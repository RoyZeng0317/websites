"""管理股票資訊覆寫 API（/api/admin/stock/*）。

用途：StockInfoEditor.py（本地 tkinter 工具）用來手動修正/補充
GET /api/stock/{symbol} 抓取失敗或需要人工核對的欄位（市值、配息配股、殖利率、
本益比、股價淨值比、公司基本資料）。存進 backend/data/stock_overrides/{symbol}.json，
main.py 的 get_stock_info() 回傳前會用這裡的值蓋掉即時抓取的值（見 load_override）。

存取限制與持久化策略同 admin_news.py：前端已登入的 Firebase ID Token 當 Bearer
token 送過來，這裡用 google-auth 驗證簽章（不需要 service account 憑證）+ 檢查
email 是不是 ADMIN_EMAIL；寫入採「本地寫入（立即生效）+ 嘗試 commit 回 GitHub
（持久化，撐過 Render 重新部署）」雙軌並行。
"""

import base64
import json
import os
from datetime import datetime, timezone

import requests
from fastapi import APIRouter, Body, Depends, Header, HTTPException
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # backend/
OVERRIDES_DIR = os.path.join(BASE_DIR, "data", "stock_overrides")

# 這個 monorepo 的 render rootDir 是 Stocks/，但 GitHub Contents API 的路徑是
# 相對於整個 repo 根目錄（RoyZeng0317/websites），所以要補回 "Stocks/" 前綴。
OVERRIDES_REPO_DIR = "Stocks/backend/data/stock_overrides"

FIREBASE_PROJECT_ID = os.environ.get("FIREBASE_PROJECT_ID", "stocks-global")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "boyud9.5@gmail.com")

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
GITHUB_REPO = os.environ.get("GITHUB_REPO", "RoyZeng0317/websites")
GITHUB_BRANCH = os.environ.get("GITHUB_BRANCH", "main")
GITHUB_API = "https://api.github.com"

# main.py 回傳給前端的欄位名稱直接對應這裡的 key，合併時可以直接 dict.update()。
# dividendNote（配息配股）是新增欄位，之前 /api/stock/{symbol} 沒有這個 key。
EDITABLE_FIELDS = {
    "marketCap", "dividendNote", "dividendYield", "peRatio", "priceToBook",
    "name", "sector", "industry", "website", "description",
}

_google_request = google_requests.Request()


def require_admin(authorization: str = Header(default="")):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization[len("Bearer "):].strip()
    try:
        decoded = google_id_token.verify_firebase_token(
            token, _google_request, audience=FIREBASE_PROJECT_ID
        )
    except Exception as exc:
        raise HTTPException(status_code=401, detail=f"Invalid token: {exc}")

    email = decoded.get("email")
    if not decoded.get("email_verified") or email != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Not authorized")
    return decoded


router = APIRouter(
    prefix="/api/admin/stock",
    tags=["admin-stock"],
    dependencies=[Depends(require_admin)],
)


# ── GitHub Contents API：讓編輯結果 commit 回 repo，撐過 Render 重新部署 ──────
# (與 admin_news.py 的實作相同，見該檔說明；各 admin_*.py 各自獨立一份，
#  避免互相影響已經在跑的新聞管理功能。)

def _github_enabled():
    return bool(GITHUB_TOKEN)


def _github_headers():
    return {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def _github_get_sha(repo_path):
    try:
        resp = requests.get(
            f"{GITHUB_API}/repos/{GITHUB_REPO}/contents/{repo_path}",
            headers=_github_headers(),
            params={"ref": GITHUB_BRANCH},
            timeout=15,
        )
    except Exception:
        return None
    if resp.status_code == 200:
        return resp.json().get("sha")
    return None


def _github_put_file(repo_path, content_str, message):
    if not _github_enabled():
        return {"committed": False, "reason": "GITHUB_TOKEN not configured"}
    try:
        body = {
            "message": message,
            "content": base64.b64encode(content_str.encode("utf-8")).decode("ascii"),
            "branch": GITHUB_BRANCH,
        }
        sha = _github_get_sha(repo_path)
        if sha:
            body["sha"] = sha
        resp = requests.put(
            f"{GITHUB_API}/repos/{GITHUB_REPO}/contents/{repo_path}",
            headers=_github_headers(),
            json=body,
            timeout=20,
        )
        if resp.status_code not in (200, 201):
            return {"committed": False, "reason": f"GitHub API {resp.status_code}: {resp.text[:300]}"}
        return {"committed": True, "commit_sha": resp.json().get("commit", {}).get("sha")}
    except Exception as exc:
        return {"committed": False, "reason": str(exc)}


def _github_delete_file(repo_path, message):
    if not _github_enabled():
        return {"committed": False, "reason": "GITHUB_TOKEN not configured"}
    sha = _github_get_sha(repo_path)
    if not sha:
        return {"committed": False, "reason": "file not found on GitHub"}
    try:
        resp = requests.delete(
            f"{GITHUB_API}/repos/{GITHUB_REPO}/contents/{repo_path}",
            headers=_github_headers(),
            json={"message": message, "sha": sha, "branch": GITHUB_BRANCH},
            timeout=20,
        )
        if resp.status_code != 200:
            return {"committed": False, "reason": f"GitHub API {resp.status_code}: {resp.text[:300]}"}
        return {"committed": True}
    except Exception as exc:
        return {"committed": False, "reason": str(exc)}


# ── 股票覆寫資料讀寫 ─────────────────────────────────────────────────────

def _override_path(symbol: str) -> str:
    return os.path.join(OVERRIDES_DIR, f"{symbol}.json")


def load_override(symbol: str) -> dict:
    """給 main.py 合併進 GET /api/stock/{symbol} 用，不需要驗證，直接讀本地檔案。"""
    path = _override_path(symbol)
    if not os.path.isfile(path):
        return {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        return {}
    return {k: v for k, v in data.items() if k in EDITABLE_FIELDS and v not in (None, "")}


@router.get("/{symbol}")
def get_override(symbol: str):
    path = _override_path(symbol)
    if not os.path.isfile(path):
        return {"symbol": symbol, "overrides": {}, "updated_at": None}
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return {
        "symbol": symbol,
        "overrides": {k: data.get(k) for k in EDITABLE_FIELDS if data.get(k) not in (None, "")},
        "updated_at": data.get("updated_at"),
    }


@router.put("/{symbol}")
def put_override(symbol: str, payload: dict = Body(...)):
    unknown = set(payload.keys()) - EDITABLE_FIELDS
    if unknown:
        raise HTTPException(status_code=400, detail=f"Unknown fields: {sorted(unknown)}")

    data = {k: v for k, v in payload.items() if k in EDITABLE_FIELDS and v not in (None, "")}
    data["updated_at"] = datetime.now(timezone.utc).isoformat()

    os.makedirs(OVERRIDES_DIR, exist_ok=True)
    content_str = json.dumps(data, ensure_ascii=False, indent=2)
    with open(_override_path(symbol), "w", encoding="utf-8") as f:
        f.write(content_str)

    github = _github_put_file(
        f"{OVERRIDES_REPO_DIR}/{symbol}.json",
        content_str,
        f"chore: admin update stock override {symbol}",
    )
    return {"ok": True, "symbol": symbol, "github": github, "data": data}


@router.delete("/{symbol}")
def delete_override(symbol: str):
    path = _override_path(symbol)
    existed = os.path.isfile(path)
    if existed:
        os.remove(path)

    github = _github_delete_file(
        f"{OVERRIDES_REPO_DIR}/{symbol}.json",
        f"chore: admin delete stock override {symbol}",
    )
    return {"ok": True, "symbol": symbol, "existed_locally": existed, "github": github}
