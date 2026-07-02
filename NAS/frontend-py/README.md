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

## Setup (on the Raspberry Pi)

```bash
cd /home/roy/casaos-nas   # or wherever this folder is deployed
python3 -m venv ~/nas-py
source ~/nas-py/bin/activate
pip install -r requirements.txt
cp .env.example .env       # then edit if needed (NODE_API defaults to localhost:3000)
```

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
| `app.py` | FastAPI routes: pages (`/login`, `/home`) + auth proxy (`/api/login`, `/api/2fa/verify`) |
| `templates/login.html` | Login + 2FA form (vanilla JS `fetch`) |
| `templates/home.html` | Placeholder post-login page |
| `static/style.css` | Dark theme |

## Roadmap (parallel migration)

- [x] Milestone 1 — login + 2FA
- [ ] Milestone 2 — file listing (`/api/files`)
- [ ] Milestone 3 — upload / download / delete
- [ ] Milestone 4 — apps (Reels / Telegram / Private …)
