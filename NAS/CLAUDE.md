# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vaultix NAS** — A self-hosted private cloud system running on a Raspberry Pi, with:
- **Frontend**: React/TypeScript/Vite SPA → deployed to Firebase Hosting (`vaultix-nas.web.app`)
- **Backend**: Express.js ESM server running on Raspberry Pi at `/home/roy/casaos-nas/server.js`, exposed via Tailscale HTTPS at `https://raspberrypi.tail8767da.ts.net`

## Commands

### Frontend (run from `frontend/`)
```bash
npm run dev        # local dev server (vite)
npm run build      # builds to frontend/dist/
npx firebase deploy --only hosting   # deploy to Firebase
```

**Full deploy (build + deploy):**
```powershell
npm run build && npx firebase deploy --only hosting
```

### Backend (on Raspberry Pi)
```bash
pm2 restart casaos-nas --update-env   # restart after server.js changes
pm2 logs casaos-nas --lines 20 --nostream   # view logs
node --check /home/roy/casaos-nas/server.js  # syntax check before restart
```

**Modify server.js remotely:** Use Python scripts piped via SSH — never scp the local server.js over the Pi's (they are out of sync). The Pi's server.js has many endpoints inserted directly on the Pi that don't exist in `backend/server.js`.

## Architecture

### Frontend (`frontend/src/`)

**Entry:** `main.tsx` → wraps app in `<LangProvider>` + `<AuthProvider>` → `App.tsx`

**Auth flow (`context/AuthContext.tsx`):**
- JWT stored in `localStorage` under key `nas_jwt`
- `SESSION_TIMEOUT_KEY` (`nas_session_timeout`) controls auto-logout in minutes
- On 401, clears token and redirects to `/login`

**API layer (`lib/api.ts`):**
- `apiJson<T>(url, options)` — authenticated JSON fetch, throws on error
- `apiFetch(url, options)` — raw authenticated fetch
- `apiUpload(url, form, onProgress)` — XHR upload with progress
- `downloadUrl(path)` — generates authenticated download URL with token in query param

**UI constants stored in `localStorage`:**
- `nas_login_bg` — CSS background for login page (exported from `App.tsx` as `LOGIN_BG_KEY`)
- `nas_home_bg` — CSS background for home/file manager (exported as `HOME_BG_KEY`)
- `nas_background` — legacy background image URL (home page)
- `nas_session_timeout` — auto-logout minutes (exported from `AuthContext.tsx` as `SESSION_TIMEOUT_KEY`)

**Home page (`components/home.tsx`):**
The central component. Controls all modals/panels. Key patterns:
- File listing via `/api/files?path=`
- Right-click context menu with `ctxItem`, `ctxPath`, `ctxMenu` state
- `cat` variable classifies files: `'video' | 'audio' | 'image' | 'doc' | 'folder' | 'other'`
- `ctxBtn(label, svgPath, onClick)` helper renders context menu buttons

**App launcher (`components/AppLauncher.tsx`):**
Grid of app icons. Each has `id`, `name`, `desc`, `icon`, `color`, `bg`. Handled in `home.tsx` via `if (id === 'xxx') { ... }` pattern. To add a new app: add entry in `AppLauncher.tsx`, add handler + state in `home.tsx`, render component conditionally.

**Video editor (`components/EditVideo.tsx`):**
Full-screen CapCut-style editor. Timeline is pixel-based (60px/sec × zoom). `Ctrl+scroll` → seek video. `K` = play/pause, `Ctrl+B` = cut clip, `Del` = delete selected clip. Export uses `/api/video/export` async job endpoint with polling.

**File conversion (`components/FileConverter.tsx`):**
Standalone app for converting video/audio/image formats. Calls `/api/video/to-images` for MP4→JPG and `/api/file/convert` for other formats.

**UserProfilePanel (`components/UserProfilePanel.tsx`):**
4-tab panel: 個人資料 / 外觀 / 安全性 / 修改密碼. Contains hidden dummy username input in password tab to prevent browser autofill from polluting the search bar.

**Viewers (`components/viewers/`):**
- `VideoPlayer.tsx` — full-screen player with subtitle support (auto-detects `.srt`/`.vtt`), AI subtitle via Whisper (`/api/video/subtitle`)
- `AudioPlayer.tsx`, `ImageViewer.tsx`, `TextEditor.tsx`, `PDFview.tsx`

### Backend (`/home/roy/casaos-nas/server.js` on Pi)

**ESM module** (`"type": "module"`) — use `import`, never `require()`. For CJS packages (e.g. `archiver`), use:
```js
import { createRequire as _cr } from 'module'
const archiver = _cr(import.meta.url)('archiver')
```

**Key middleware:**
- `authenticate` — verifies JWT from `Authorization: Bearer` header or `?token=` query param; sets `req.user`
- `requireAdmin` — checks `req.user.role === 'admin'`
- `safePath(username, relativePath)` — resolves path under `FILES_DIR/{username}/`, throws if path escapes

**File storage:** `/DATA/{username}/` (configured via `FILES_DIR` env var, defaults to `data/files/` next to server.js)

**Database:** MariaDB/MySQL — pool in `pool` variable. DB name: `casaos_nas`.

**Process manager:** pm2 — process name `casaos-nas` (id 0), Jupyter (id 4).

**Async job pattern** (video export, subtitle generation, ytdl):
```js
const jobs = new Map()
app.post('/api/xxx/start', authenticate, async (req, res) => {
  const jobId = Math.random().toString(36).slice(2)
  jobs.set(jobId, { status: 'running', progress: 0 })
  res.json({ jobId })
  ;(async () => { /* background work */ })()
})
app.get('/api/xxx/:id', authenticate, (req, res) => {
  res.json(jobs.get(req.params.id) ?? { error: 'not found' })
})
```

**Tailscale setup:**
- Port 443 → 3000 (NAS backend via Tailscale Funnel)
- Port 8443 → 8888 (code-server)

## Environment Variables (frontend `.env`)

```
VITE_BACKEND_URL=https://raspberrypi.tail8767da.ts.net
VITE_CODE_SERVER_URL=https://raspberrypi.tail8767da.ts.net:8443
VITE_JUPYTER_URL=https://raspberrypi.tail8767da.ts.net/jupyter
VITE_FIREBASE_* (Firebase config for hosting/auth)
```

## Critical Constraints

- **Never overwrite Pi's `server.js` with `scp` from local** — Pi has many endpoints not in the local `backend/server.js`. Always insert new endpoints via Python scripts on the Pi, inserting before the final `server.listen()` / `app.listen()` call.
- **Backend is ESM** — no `require()`, no CommonJS patterns.
- **Firebase deploy must be run from `frontend/`** — the `firebase.json` is there and `dist/` is the public dir.
- **`vite.config.ts` sets `root: 'src'`** — so `npm run build` must be run from `frontend/`, not `frontend/src/`.


## Good at
1. Has code server at the NAS, you can use the vscode at NAS.
## To do list
[X] pm2 still can't auto update, it's still kill the server.js at pi 5 backend.
[X] create a actions log.
## Problem Detial
1. pm2
Detial: From my opinion, it's should be the server.js this file is key point problem, I'm try use the terminal key the ssh to connect the pi 5, key the "pm2 update" this command can restart the casaos-nas this backend server.
When I click the update button, wait almost 15 second, the pm2 "casaos-nas" this backend server will be kill, the frontned said:"Failed to load."