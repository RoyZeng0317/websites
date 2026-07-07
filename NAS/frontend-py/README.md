# Vaultix NAS — Python Frontend

A server-rendered Python frontend (FastAPI + Jinja2) being built **alongside** the existing
React app as a gradual migration. Milestone 1 = login + 2FA.

## Architecture

```
browser (HTML+JS) --HTTP--> FastAPI (this app) --httpx--> Node backend /api/* --> MariaDB
```

Auth is **proxied to the existing Node backend** (single source of truth), so existing
accounts and 2FA keep working. The JWT is stored in an **HttpOnly cookie** (safer than
localStorage). When the backend later moves to Python, only `NODE_API` targets change.

## Install

One-line install, no manual clone/venv/editor steps:

**Windows (PowerShell):**
```powershell
irm https://raw.githubusercontent.com/RoyZeng0317/websites/main/NAS/frontend-py/install.ps1 | iex
```

**macOS / Linux / Raspberry Pi:**
```bash
curl -fsSL https://raw.githubusercontent.com/RoyZeng0317/websites/main/NAS/frontend-py/install.sh | bash
```

Both scripts sparse-clone just this folder, create a venv, and install
`requirements.txt`. All config has safe defaults (`NODE_API` defaults to
`http://127.0.0.1:3000`), so it runs without any `.env` at all. The
installer prints `.env.example` at the end for reference but never creates
or writes `.env` itself — if you need to override a default (e.g.
`RP_ID`/`TFA_ORIGIN` for the Pi), create that file yourself.

## Run

```bash
source ~/nas-py/bin/activate
python app.py                     # dev, http://0.0.0.0:8001
# or production:
uvicorn app:app --host 0.0.0.0 --port 8001
```

Expose via Tailscale (like the code-server on :8443):

```bash
sudo tailscale serve --bg --https 8444 http://127.0.0.1:8001
```

Then browse `https://raspberrypi.tail8767da.ts.net:8444/login`.
Set `COOKIE_SECURE=true` when served over HTTPS.

## Files

| File | Purpose |
|------|---------|
| `app.py` | FastAPI routes: pages (`/login`, `/home`, `/office`) + auth proxy (`/api/login`, `/api/2fa/verify`) |
| `templates/login.html` | Login + 2FA form (vanilla JS `fetch`) |
| `templates/home.html` | Placeholder post-login page |
| `templates/office.html` | Office file browser (Word/Excel/PowerPoint only) |
| `static/style.css` | Dark theme |

`/office` proxies `GET {NODE_API}/api/files` (server-side, with the user's JWT)
to list folders/`.docx`/`.xlsx`/`.pptx` files, then renders download links and
"open in desktop app" links (`ms-word:ofe|u|<webdav-url>` etc., pointed at
`NODE_PUBLIC_URL`, which must be reachable from the *browser* — unlike
`NODE_API` which only needs to be reachable from the Pi itself). This is
scoped to Office files only — it is **not** the general file manager
(Milestone 2 below).

## Roadmap (parallel migration)

- [x] Milestone 1 — login + 2FA
- [x] Office file browser (`/office`) — Word/Excel/PowerPoint list + download + open-in-desktop via WebDAV
- [ ] Milestone 2 — general file listing (`/api/files`, full file manager)
- [ ] Milestone 3 — upload / download / delete
- [ ] Milestone 4 — apps (Reels / Telegram / Private …)
