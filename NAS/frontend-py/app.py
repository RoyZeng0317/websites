"""
Vaultix NAS — Python frontend (login + 2FA)

Architecture (chosen 2026-07-02):
    browser (HTML+JS) --HTTP--> FastAPI (this app) --httpx--> Node backend (/api/*) --> MariaDB

- Password check is proxied to the existing Node backend (single source of truth).
- 2FA is Python-native via pwd_2FA_check.TwoFactor (TOTP now; WebAuthn next).
  If the user has NODE 2FA enabled, we fall back to Node's 2FA flow (kept working).
- The JWT lives in an HttpOnly, SameSite=Strict cookie.
"""
import base64
import json
import os
import secrets
import time
from pathlib import Path
from urllib.parse import quote

import httpx
from fastapi import FastAPI, Request, Response
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from dotenv import load_dotenv

from pwd_2FA_check import TwoFactor

BASE = Path(__file__).parent
load_dotenv(BASE / ".env")

# ── config (env) ─────────────────────────────────────────
NODE_API = os.getenv("NODE_API", "http://127.0.0.1:3000").rstrip("/")
# Browser-facing URL for the Node backend (downloads, WebDAV) — NODE_API is
# often a loopback address for server-to-server calls, which the user's
# browser cannot reach directly.
NODE_PUBLIC_URL = os.getenv("NODE_PUBLIC_URL", "https://raspberrypi.tail8767da.ts.net").rstrip("/")
FRONTEND_PORT = int(os.getenv("FRONTEND_PORT", "8001"))
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "true").lower() == "true"
JWT_DAYS = int(os.getenv("JWT_DAYS", "7"))
COOKIE_NAME = "nas_jwt"

# 2FA config — RP_ID/ORIGIN must match the served domain for WebAuthn to work later.
RP_ID = os.getenv("RP_ID", "localhost")
TFA_ORIGIN = os.getenv("TFA_ORIGIN", "http://localhost:8001")
TFA_DB = os.getenv("TFA_DB", str(BASE / "2fa.db"))
tf = TwoFactor(db_path=TFA_DB, rp_id=RP_ID, rp_name="Vaultix NAS", origin=TFA_ORIGIN)

app = FastAPI(title="Vaultix NAS (Python frontend)")
app.mount("/static", StaticFiles(directory=BASE / "static"), name="static")
templates = Jinja2Templates(directory=str(BASE / "templates"))

_UNSAFE_METHODS = {"POST", "PUT", "PATCH", "DELETE"}


@app.middleware("http")
async def security_middleware(request: Request, call_next):
    # CSRF: state-changing requests must carry a custom header. Cross-site HTML
    # forms cannot set custom headers, and we don't enable permissive CORS, so a
    # cross-site attacker can't forge these — combined with SameSite=Strict cookies.
    if request.method in _UNSAFE_METHODS and request.headers.get("x-csrf") != "1":
        return JSONResponse({"error": "CSRF check failed"}, status_code=403)
    resp = await call_next(request)
    resp.headers["X-Frame-Options"] = "DENY"                       # clickjacking
    resp.headers["X-Content-Type-Options"] = "nosniff"            # MIME sniffing
    resp.headers["Referrer-Policy"] = "same-origin"
    resp.headers["Content-Security-Policy"] = "frame-ancestors 'none'"
    return resp


# ── pending 2FA logins (Node token held until 2FA passes) ─
_pending: dict[str, tuple[str, str, float]] = {}   # ticket -> (username, node_token, expiry)
_TICKET_TTL = 180   # 3 minutes to complete 2FA


def _new_ticket(username: str, token: str) -> str:
    ticket = secrets.token_urlsafe(24)
    _pending[ticket] = (username, token, time.time() + _TICKET_TTL)
    return ticket


def _peek_ticket(ticket: str):
    item = _pending.get(ticket)
    if not item or item[2] < time.time():
        _pending.pop(ticket, None)
        return None
    return item


# ── helpers ──────────────────────────────────────────────
def _set_token_cookie(resp: Response, token: str) -> None:
    resp.set_cookie(
        COOKIE_NAME, token,
        max_age=JWT_DAYS * 86400,
        httponly=True, secure=COOKIE_SECURE, samesite="strict", path="/",
    )


def _jwt_username(token: str) -> str | None:
    """Decode the JWT payload for display only (signature NOT verified — Node enforces auth)."""
    try:
        payload_b64 = token.split(".")[1]
        payload_b64 += "=" * (-len(payload_b64) % 4)
        return json.loads(base64.urlsafe_b64decode(payload_b64)).get("username")
    except Exception:
        return None


def _current_user(request: Request) -> str | None:
    token = request.cookies.get(COOKIE_NAME)
    return _jwt_username(token) if token else None


def _tf_status(username: str) -> dict:
    return {"totp": tf.totp_status(username),
            "webauthn": tf.webauthn_status(username)["registered"]}


async def _node_post(path: str, body: dict) -> httpx.Response:
    async with httpx.AsyncClient(timeout=15) as client:
        return await client.post(f"{NODE_API}{path}", json=body)


async def _node_get(path: str, token: str) -> httpx.Response:
    async with httpx.AsyncClient(timeout=15) as client:
        return await client.get(f"{NODE_API}{path}", headers={"Authorization": f"Bearer {token}"})


# ── Office file browser ────────────────────────────────────
# ext -> (display label, URI scheme used for "open in desktop app")
OFFICE_EXT = {
    ".docx": ("Word", "ms-word"),
    ".xlsx": ("Excel", "ms-excel"),
    ".pptx": ("PowerPoint", "ms-powerpoint"),
}


def _breadcrumb(path: str) -> list[dict]:
    if not path:
        return []
    crumbs, acc = [], []
    for part in path.split("/"):
        acc.append(part)
        crumbs.append({"name": part, "path": "/".join(acc)})
    return crumbs


# ── page routes ──────────────────────────────────────────
@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return RedirectResponse("/home" if request.cookies.get(COOKIE_NAME) else "/login", status_code=302)


@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.get("/home", response_class=HTMLResponse)
async def home_page(request: Request):
    user = _current_user(request)
    if not user:
        return RedirectResponse("/login", status_code=302)
    return templates.TemplateResponse("home.html", {"request": request, "username": user})


@app.get("/security", response_class=HTMLResponse)
async def security_page(request: Request):
    user = _current_user(request)
    if not user:
        return RedirectResponse("/", status_code=302)
    return templates.TemplateResponse("security.html", {"request": request, "username": user})


@app.get("/office", response_class=HTMLResponse)
async def office_page(request: Request, path: str = ""):
    user = _current_user(request)
    if not user:
        return RedirectResponse("/login", status_code=302)

    token = request.cookies.get(COOKIE_NAME)
    ctx = {"request": request, "username": user, "path": path,
           "breadcrumb": _breadcrumb(path), "folders": [], "files": [], "error": None}

    try:
        r = await _node_get(f"/api/files?path={quote(path)}", token)
    except httpx.RequestError as e:
        ctx["error"] = f"無法連線後端: {e}"
        return templates.TemplateResponse("office.html", ctx)

    if r.status_code != 200:
        ctx["error"] = f"HTTP {r.status_code}"
        return templates.TemplateResponse("office.html", ctx)

    items = r.json().get("items", [])
    ctx["folders"] = [i for i in items if i.get("type") == "folder"]

    files = []
    for i in items:
        if i.get("type") != "file":
            continue
        ext = Path(i["name"]).suffix.lower()
        if ext not in OFFICE_EXT:
            continue
        label, scheme = OFFICE_EXT[ext]
        rel = f"{path}/{i['name']}" if path else i["name"]
        webdav_url = f"{NODE_PUBLIC_URL}/webdav/{'/'.join(quote(p) for p in rel.split('/'))}"
        files.append({
            "name": i["name"],
            "label": label,
            "size": i.get("size"),
            "download_url": f"{NODE_PUBLIC_URL}/api/files/download?path={quote(rel)}&token={token}",
            "open_url": f"{scheme}:ofe|u|{webdav_url}",
        })
    ctx["files"] = files
    return templates.TemplateResponse("office.html", ctx)


@app.get("/logout")
async def logout():
    resp = RedirectResponse("/login", status_code=302)
    resp.delete_cookie(COOKIE_NAME, path="/")
    return resp


# ── auth API ─────────────────────────────────────────────
@app.post("/api/login")
async def api_login(request: Request):
    body = await request.json()
    username = body.get("username", "")
    try:
        r = await _node_post("/api/login", {"username": username, "password": body.get("password", "")})
    except httpx.RequestError as e:
        return JSONResponse({"error": f"無法連線後端: {e}"}, status_code=502)

    data = r.json() if r.headers.get("content-type", "").startswith("application/json") else {}
    if r.status_code != 200:
        return JSONResponse({"error": data.get("error", f"HTTP {r.status_code}")}, status_code=r.status_code)

    # Node's own 2FA (kept working for existing enrollments)
    if data.get("requiresTwoFactor"):
        return JSONResponse({"requiresTwoFactor": True, "method": "node",
                             "tempToken": data["tempToken"], "username": data.get("username")})

    token = data["token"]
    # Password OK → enforce Python-native 2FA if the user enrolled it here.
    status = _tf_status(username)
    if status["totp"] or status["webauthn"]:
        return JSONResponse({"requiresTwoFactor": True, "method": "python",
                             "ticket": _new_ticket(username, token),
                             "totp": status["totp"], "webauthn": status["webauthn"],
                             "username": username})

    resp = JSONResponse({"ok": True, "next": "/home"})
    _set_token_cookie(resp, token)
    return resp


@app.post("/api/2fa/verify")
async def api_2fa_verify(request: Request):
    """Node 2FA path (used only when Node itself required 2FA)."""
    body = await request.json()
    try:
        r = await _node_post("/api/2fa/verify", {"tempToken": body.get("tempToken", ""), "code": body.get("code", "")})
    except httpx.RequestError as e:
        return JSONResponse({"error": f"無法連線後端: {e}"}, status_code=502)
    data = r.json() if r.headers.get("content-type", "").startswith("application/json") else {}
    if r.status_code != 200:
        return JSONResponse({"error": data.get("error", f"HTTP {r.status_code}")}, status_code=r.status_code)
    resp = JSONResponse({"ok": True, "next": "/home"})
    _set_token_cookie(resp, data["token"])
    return resp


@app.post("/api/2fa/totp/login")
async def api_2fa_totp_login(request: Request):
    """Python 2FA path at login: verify the TOTP code against the held ticket."""
    body = await request.json()
    ticket = body.get("ticket", "")
    item = _peek_ticket(ticket)
    if not item:
        return JSONResponse({"error": "驗證階段已過期，請重新登入"}, status_code=400)
    username, token, _ = item
    if not tf.totp_verify(username, body.get("code", "")):
        return JSONResponse({"error": "驗證碼錯誤"}, status_code=401)   # ticket stays valid for retry within TTL
    _pending.pop(ticket, None)
    resp = JSONResponse({"ok": True, "next": "/home"})
    _set_token_cookie(resp, token)
    return resp


# ── 2FA enrollment API (requires a logged-in cookie) ─────
@app.get("/api/2fa/status")
async def api_2fa_status(request: Request):
    user = _current_user(request)
    if not user:
        return JSONResponse({"error": "未登入"}, status_code=401)
    return JSONResponse(_tf_status(user))


@app.post("/api/2fa/totp/provision")
async def api_totp_provision(request: Request):
    user = _current_user(request)
    if not user:
        return JSONResponse({"error": "未登入"}, status_code=401)
    return JSONResponse(tf.totp_provision(user))   # {secret, uri, qr, expires_in}


@app.post("/api/2fa/totp/enable")
async def api_totp_enable(request: Request):
    user = _current_user(request)
    if not user:
        return JSONResponse({"error": "未登入"}, status_code=401)
    body = await request.json()
    if tf.totp_enable(user, body.get("code", "")):
        return JSONResponse({"ok": True})
    return JSONResponse({"error": "驗證碼錯誤，或 QR 已超過 3 分鐘，請重新產生"}, status_code=400)


@app.post("/api/2fa/totp/disable")
async def api_totp_disable(request: Request):
    user = _current_user(request)
    if not user:
        return JSONResponse({"error": "未登入"}, status_code=401)
    tf.totp_disable(user)
    return JSONResponse({"ok": True})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=FRONTEND_PORT, reload=True)
