# CLAUDE.md
[English](english)
[中文](chinese)

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
2. Has the ufw, faile2ban, tailescale this firewall.
3. We have the terminal can use, include the linux and win11 command, also have the us special command.

## To do list
[x] pm2 still can't auto update, it's still kill the server.js at pi 5 backend.
[x] create a actions log.
[x] nas haven't the mobile phone interface
[x] nas haven't the connect id
[x] NAS need the ufw state widget show at trash can left.
[x] NAS frontend need the input VaultixID at the broswer.
[x] pm2 auto update this function need to split, give me can update per month.
[x] pm2 can't auto update.
[x] remove the VideoPlay, ImagePlay, and MusicPlayer at the frontend(home.tsx) — 2026-07-01: removed Image Viewer (→Photos) & Music Player (→Music) launcher apps + deleted orphan ImageViewer/AudioPlayer.tsx. Video Player KEPT (no replacement app for video playback) — button + click-to-play + VideoPlayer.tsx restored.
[x] the music, video, and audio apps need to chane the interface, left side it's folder explorer, right side it's apps interface; the album icon will be the music photo.jpg at the music app.
[x] video player like same between photo app and msuic app, inlcude the interface, app name, and so on. — 2026-07-01: VideoApp aligned with Photo/Music (shared header + breadcrumb + left FolderSidebar). App names unified to Music/Photo/Video across launcher + headers.
[x] from the login page to start, adapt the interface can use the @media width:480px{} to mobile phone can use. step by step to adapt the interface, not everything need to adapt for phone, give me check the interface is correct, i agree it, adapt next one.
[x] the music app interface, right side player this music icon need to change from \sda1\音樂\img\ — 2026-07-01: cover matched from sda1/音樂/img by base filename (same name, any image ext). Priority: img-dir → folder photo.jpg → embedded ID3 → default.
[x] the lyrics are not sync from \sda1\音樂\lyric — 2026-07-01: trackLrcPath now reads .lrc from sda1/音樂/lyric matched by base filename (replaced same-folder .lrc lookup).
[x] the file list need the quick key press, like: F2 can rename, ctrl+c can copy file, ctrl+v can past file. — 2026-07-01: added F2 (rename single selection), Ctrl/⌘+C (copy selection to clipboard state), Ctrl/⌘+V (paste via /api/files/copy) in home.tsx keydown handler.
[x] the audio can't according the current audio file are open then play the current audio folder. — 2026-07-01: fixed folder race — MusicApp path now initialises to initialFile.dir (removed '' → dir double-load that could overwrite items with root).
[x] the sda1\音樂\lyric\ can use the texteditor to open it. — 2026-07-01: mapped `lrc → 'text'` in `lib/fileTypes.ts` EXT_MAP, so double-clicking any `.lrc` (incl. sda1/音樂/lyric) routes through home.tsx `openFile` → TextEditor.
[x] the file upload list(root\音樂, root\影片, root\圖片 and so on, include the sda1\音樂, sda1\影片, sda1\圖片, and so on) adapt for English, show the Chinese at the Chinese interface. show the English at the English interface. — 2026-07-01: added `folderDisplayName(name, lang)` in `lib/fileTypes.ts` (FOLDER_EN map: 音樂→Music, 影片→Videos, 圖片→Pictures, 照片→Photos, 文件/文檔→Documents, 下載→Downloads, 桌面→Desktop). home.tsx list renders it for folders only; en UI shows English, zh UI keeps original disk name. Disk names stay Chinese.
[x] terminal can open it at the new window, also can grab it to pull out a new window, also can put in together. — 2026-07-01: BOTH mechanisms coexist (user wants both buttons). Header has "New window" (window.open('/terminal') → TerminalPage full-window, authed /terminal route) AND "Float/Dock" (line 164 in-app floating). onToggleDock/onPopOut are optional props on TerminalView; TerminalPage passes neither so the popped-out window shows only Copy/Paste/Close.
[x] the top location: roo\下載, sda1\下載 and so one can adapt English, same the line 159. — 2026-07-01: breadcrumb segments in home.tsx now render `folderDisplayName(seg, lang)` (same helper as line 159).
[x] the footer part: 共 x 個項目(x 個資料夾) and so on part need to adapt English. — 2026-07-01: added translation fns to LangContext (foldersCount/filesCount/itemsSummary/selectedOne/selectedMany + listSep '、'/', '); home.tsx footer count + selection status now use `t.*`.
[x] the browser need include the VaultixID to connect the NAS system. — 2026-07-01: Synology QuickConnect-style. Login page (App.tsx LoginPage) gained a QuickConnect field: enter VaultixID → `resolveVaultixId()` (lib/api.ts) queries default backend `/api/vaultix/resolve?id=` → `{ username, backendUrl }` → `setBackend(url)` (localStorage `nas_backend` override) + prefills username. api.ts `backendBase()` now returns override||VITE_BACKEND_URL; AuthContext + terminal.tsx use it. Single-NAS resolves to same Pi but mechanism ready for multi-NAS. **Pi endpoint NOT yet applied (SSH needs password, couldn't run from agent)** — run:
   ```powershell
   python backend/scripts/patch_vaultix_resolve.py | ssh roy@192.168.199.108 python3
   ssh roy@192.168.199.108 "node --check /home/roy/casaos-nas/server.js && pm2 restart casaos-nas --update-env"
   ```
   Until applied, resolve 404s → login falls back to account/password (no regression).
[x] the terminal can put in the window, i mean open a new browser window also can put in terminal, and open new widnow at the same browser. — 2026-07-01: in-app floating/dockable terminal. terminal.tsx `TerminalOverlay` holds `docked` state; `TerminalView` kept with stable React `key` so xterm DOM + WebSocket survive dock⇄float (same session, no reconnect). Header "Float/Dock" button toggles; floating mode is draggable by the header (clamped to viewport). Docked = 90vw×80vh modal w/ backdrop; float = 680×440 draggable window, no backdrop.
[x] the terminal can same with the windows 11, can put in and pull out. — 2026-07-01: (a) PWA install (manifest.webmanifest + sw.js + InstallButton.tsx) so it runs in a native OS window w/ real Win11 min/max/close. (b) Screenshot clarified user wanted Windows-Terminal-style TABS → rewrote terminal.tsx as a tabbed, multi-window manager: `createSession()` builds each xterm+WS OUTSIDE React (returns a detached DOM `el`); `SessionHost` appends `session.el` so tabs/windows can move via appendChild WITHOUT reconnecting the WebSocket. Features: tab strip + "+" new tab + per-tab close; drag a tab onto another window's tab strip = merge (put in); drag a tab to empty space = tear out into a new floating window (pull out); Float/Dock toggle (one docked at a time) + OS "New window" (/terminal → TerminalPage standalone) retained. `TerminalManager` holds windows[] state; closing all tabs closes the overlay. NOTE: browsers cannot JS-minimize a tab/popup — native min/max only in the installed PWA window.
[x] the same from win11 terminal can pull out the terminal title at the webhook window, and also can put back the terminal. — 2026-07-01: chose "real browser window, fresh session" (a live WebSocket/PTY can't move across OS windows). Pull out: drag a tab off the tab strip (drop anywhere not a tab strip) → `onTabDragEnd` sees it wasn't dropped → `tearOut()` opens a real `/terminal` popup window + closes the source tab. Put back: the standalone /terminal window has a "Put back" button → posts `{type:'new-tab'}` on a BroadcastChannel (`nas-terminal-bus`) then `window.close()`; the main TerminalManager listens and opens a fresh tab. Removed the old in-app tear-out floating window + drop layer. Caveat: torn-out window is a NEW session (scrollback/cwd don't carry over).
[x] the pull out window need it's full window, not mini window and put on the right side. — 2026-07-01: `popOutOS()` now opens the popup at full screen size (left/top = screen.availLeft/availTop, width/height = availWidth/availHeight) instead of filling only the space to the right. Both "New window" and tab tear-out use it, so both open full-window.
[x] almost will be done at the terminal, but it's can't pull back the first terminal beside. — 2026-07-01: root cause — pulling out the last tab closed the main TerminalManager, so nothing was listening on `nas-terminal-bus` for "Put back". Fix: added a BroadcastChannel listener in home.tsx that reopens the terminal (setShowTerminal(true)) on a 'new-tab' message. When the overlay is already open, TerminalManager's own listener adds a tab (home's setShowTerminal(true) is a no-op) → no double; when it was closed, home remounts it with a fresh tab.
[x] terminal still can't pull back, create the pull back button to pull back. — 2026-07-01: root cause of "can't pull back" was a race — the popped-out window called `window.close()` immediately after `BroadcastChannel.postMessage`, destroying the context before the message was delivered, so the main window never got it. Fix: delay `window.close()` by 250ms after posting. Also made the "Put back" button prominent (solid blue) in the torn-out /terminal window's toolbar so it's easy to find.
[x] i can't see the pull out terminal window has put back button. — 2026-07-01: "Put back" was already in the shipped bundle (toolbar button). Added an always-visible floating blue "Put back to main window" pill (bottom-right, z-70) in standalone mode so it can't be missed; shared `putBack()`. If still hidden it's stale cached JS in the popup — hard-refresh it.
[x] i mean putback button can't see at the app.tsx — 2026-07-01: likely cause was pop-up blocking: tear-out's window.open fired from onDragEnd (not a user gesture) got blocked, but tearOut had ALREADY closed the source tab → tab lost, nothing (no Put back) shown anywhere. Fix: `popOutOS()` returns the window handle; `tearOut()` only `closeTab()` if the window actually opened, else alerts to allow pop-ups. Reliable path to get the Put-back window: the toolbar "New window" button (click = allowed). Put-back button itself (blue floating pill + toolbar) was already shipping. **CONFIRMED REAL ROOT CAUSE (via user screenshot, Samsung Browser): the popped-out /terminal window was loading a STALE cached bundle (older than the Put-back button), so the button never rendered. Final fix: open popup as `/terminal?v=${Date.now()}` (cache-busts index.html) + bumped service worker cache to `vaultix-v2`. Verified working by user.** Lesson: popups that open an app route can serve stale index.html from HTTP/SW cache — always cache-bust the popout URL.
[x] i mean other user can't pretty easy to download anything ... make download hard for other users. — 2026-07-01: added content-protection deterrents. `controlsList="nodownload noplaybackrate noremoteplayback"` + `disablePictureInPicture` on the native `<video controls>` in VideoPlayer.tsx and Locker.tsx (hides the browser's built-in download button). Global CSS in index.css: `img,video,audio { -webkit-user-drag:none; user-select:none }` blocks drag-to-save. Right-click already disabled + DevTools shortcuts blocked (line 178). **HONEST LIMIT: this only stops casual users — anyone can still grab files from the Network tab / the token'd URL; true prevention of downloading viewable/playable media is impossible client-side. Real protection is the server-side JWT already required on /api/files.**
[x] stop the element to show at the f12 elemnt. — 2026-07-01: added a global keydown blocker in main.tsx for F12 / Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+U (view-source). Ctrl+Shift+C left unblocked (terminal copy uses it). Right-click was already disabled. NOTE: this is only a DETERRENT — DevTools can still be opened from the browser menu and JS can't truly hide elements; real protection is the server-side JWT on file access.
[x] root list sda1 [外接] need to adapt to english, also the footer: 7 items (7folder) ends button: delete need to adapt the english at the english page. — 2026-07-01: added LangContext keys externalTag(外接/External), deleteSelected, dragToBulkMove. home.tsx: mount badge `外接`→`t.externalTag`, footer delete button label `刪除`→`t.deleteBtn` + title→`t.deleteSelected`, bulk-move hint→`t.dragToBulkMove`. (footer counts were already i18n'd on line 162.)
[x] the top menu download widget this app, need to adapt to english at the english page. — 2026-07-01: top-bar Downloader button title `媒體下載器`→`t.mediaDownloader` (Media Downloader).
[x] the media download label: 媒體下載器, 影片/音樂網址, 格式 and os one are not to adapt to english, i hope this window can adapt to english and chinese. — 2026-07-01: fully i18n'd Downloader.tsx. Added ~48 keys to LangContext (dl* prefix + cancel/download etc.). Each sub-component (FolderPicker, JobRow, DownloaderPanel) got its own `const { t } = useLang()`. Module-level quality constants converted to `mp3Qualities(t)`/`mp4Qualities(t)` fns (top-level can't read t). All labels/placeholders/toasts/status now use `t.*`; zh keeps Chinese, en shows English. Only Chinese left = 3 dev comments + full-width-punct regex (not UI).
[] the excution log, log result needs to 
[x] the quartus qrime needs to adapt for english interface. — 2026-07-01: i18n'd QuartusPanel.tsx. Added 10 keys (quartus*). Module-level `LINKS` const (labels+sub, with JSX icons) → `buildLinks(t)` fn called in component via `const { t } = useLang(); const LINKS = buildLinks(t)`. Header subtitle + install-note also `t.*`. zh/en both filled.
[x] new terminal command: explorer location can open the explorer ... music.app, video.app, etc. app can open the app. — 2026-07-01: terminal (createSession) intercepts `explorer <path>` → posts `{type:'open-path',path}` on `nas-terminal-bus`; `<name>.app` (music.app/video.app/photo.app/…) → `{type:'open-app',app}`. home.tsx BroadcastChannel listener: open-app → `handleLaunchBuiltin(app)`; open-path → normalise `\`→`/`, folder → `setPathSegments`, file (has ext) → navigate to dir + `pendingOpenName` → openFile once items load. Backslashes normalised; note real disk folders are Chinese (sda1/音樂) so use actual names. Added to HELP_TEXT. Works cross-window (torn-out terminal → main app).
[] the backend\server.js and server.py file to save the vaultix-nas this folder at the pi, remove the casaos-nas this folder. — NEEDS USER (SSH password, can't run from agent). Migration plan below; do NOT delete casaos-nas until vaultix-nas is confirmed running.
[x] when use cp, rm command can show the progress bar. — 2026-07-01: terminal `withProgress()` rewrites: flag-less `cp SRC DEST` → `rsync -ah --info=progress2` (byte-level bar, matches cp for files); `cp` with flags → `cp -v`; `rm` → `rm -v`. Applied after winToLinux so Windows `copy`/`del` also get it. rsync must exist on Pi (it does on Raspberry Pi OS).
[] the Office Collaboration Workspace is like full office 365, like excel, powerpoint, word app. first one is need to build up the word, second is powerpoint, thired is excel.(check the token will be extra or not.)
[] create the folder, include: pictures, videos, video etc.

<!-- see the detial -->

<!-- ## Problem Detial
1. pm2
Detial: From my opinion, it's should be the server.js this file is key point problem, I'm try use the terminal key the ssh to connect the pi 5, key the "pm2 update" this command can restart the casaos-nas this backend server.
When I click the update button, wait almost 15 second, the pm2 "casaos-nas" this backend server will be kill, the frontned said:"Failed to load." -->

Detial
<!-- 1. Use the Flutter to build up the interface (Doning nothing, I'll write the something later.) -->
<!-- 2. I creat the VaultixID.tsx file -->
3. I creat a ufwWidget.tsx at \fontned\src\componetns\ ,so you need to create a state about the ufw this widget, green means good, red means bad. If have the error, put at the \frontend\src\compoents errorlog.tsx this file.

VaultixID.tsx File need inlcude:
<!-- 1. userInput ID (remark: Don't include birthday, ID number or phone number.)
2. random button (if user click button, random a pefect ID, not super eays.)
3. connect with the VaultixID.sql
4. mini window
5. save the ID at the \backend\data\VaultixID.sql -->
<!-- 6. The frontend need the button, put at the settings this page. -->
## Error Log
1. [x] The backend said: "failed to load", I check the pi's pm2,
  
2. [x] VaultixID page HTTP 404 `/api/user/vaultix-id` — Pi's server.js missing the endpoint. Fixed by running patch script (2026-06-30); endpoint now returns 401 (auth required) as expected.
   ```powershell
   python backend/scripts/patch_vaultixid.py | ssh roy@192.168.199.108 python3
   ssh roy@192.168.199.108 "pm2 restart casaos-nas --update-env"
   ```
3. [x] Settings "back" this button can't click — Fixed: added `sticky top-0 z-10 bg-gray-900` to header so it stays visible when page scrolls on small screens.
4. [x] UFW status widget — Created `frontend/src/components/widgets/ufwWidget.tsx` (green=active, red=inactive/error). Placed left of trash button in `home.tsx`. Pi endpoint added via:
   ```powershell
   cat /home/roy/casaos-nas/server.js | python backend/scripts/patch_ufw.py | ssh roy@192.168.199.108 python3
   ssh roy@192.168.199.108 "pm2 restart casaos-nas --update-env"
   ```
5. [x] The ufw widget said: "inactive" — Fixed 2026-07-01.
   Two separate causes: (a) ufw was genuinely OFF — enabled it after allowing 22/tcp + `in on tailscale0` + 3000 + 8888, then `ufw --force enable`. (b) Even once active, `systemctl is-active ufw` STILL reports "inactive" on this Pi while `sudo ufw status` = active — so the endpoint must NOT rely on systemctl. `patch_ufw_conf_primary.py` rewrote `/api/ufw/status` to read `/etc/ufw/ufw.conf` (`ENABLED=yes`, reliable, no root) as the PRIMARY check, systemctl as fallback.
6. [x] Upload large file shows "Network Error" — Fixed 2026-07-01.
   Root cause: XHR onerror when Pi drops TCP on large uploads. `patch_upload_limit.py` added 8 GB multer limit + 413 error handler. Pi disk space is fine (901 GB avail on /dev/sda1). Result: `[upload] already patched` (was applied in a prior session).
7. [x] The pi 5 said: "failed to load". REAL root cause (found 2026-07-01): server.js had a `SyntaxError: Illegal return statement` at the `/api/ufw/status` endpoint — `patch_ufw_fix.py` inserted the new endpoint but left the OLD body as orphaned top-level code (`return res.json({ active, detail })` outside any function). Node never started → port 3000 refused → Tailscale returned its error page with no CORS header → browser mislabeled it "CORS error". Fixed by `patch_fix_ufw_orphan.py` (removes the dead block). Always `node --check` before `pm2 restart`.
   - `/api/todos` (CRUD) + `/api/system/disks/rename-folder` moved OUT of server.js into `backend/server.py` (FastAPI sidecar, pm2 `nas-python`, port 3001, localhost-only). Express proxies via `patch_add_proxy.py`, passing identity as `X-User-*` headers after `authenticate`. Pi uses conda python; install deps with `python3 -m pip install fastapi uvicorn pymysql python-dotenv`.
   - pm2 cwd gotcha: start with `cd /home/roy/casaos-nas && pm2 start server.js` so `dotenv` loads `.env` (CORS_ORIGIN etc.). Starting from `~` silently breaks CORS.
   ```powershell
   python backend/scripts/patch_fix_ufw_orphan.py | ssh roy@192.168.199.108 python3
   ssh roy@192.168.199.108 "node --check /home/roy/casaos-nas/server.js && pm2 restart casaos-nas --update-env"
8. [x] the terminal can't to open it (WebSocket closed before connection established) — 2026-07-01: NOT a backend issue. Bug in the new tabbed `TerminalManager`: the "close terminal when all windows gone" effect fired on the initial empty render (started.current was set in the mount effect BEFORE the setWindows re-render committed, so the guard effect saw windows=[] && started=true → called onExitAll immediately → disposed the just-created WS). Fixed: set `started.current = true` only once `windows.length > 0`, then allow close on empty. `node --check` n/a (frontend).
9. [ ] Pi migration casaos-nas → vaultix-nas failing. ROOT CAUSE (2026-07-01): `/home/roy/vaultix-nas` was a stray **FILE**, not a directory → rsync `cannot stat destination ".../vaultix-nas/": Not a directory` and `cd vaultix-nas: Not a directory`. Also `pm2 start server.js` was run from `~` (looked for /home/roy/server.js) and casaos-nas still held port 3000. FIX (user runs on Pi): (1) `rm -i vaultix-nas` (delete the stray file); (2) `rsync -a --exclude node_modules --exclude .git casaos-nas/ vaultix-nas/`; (3) `cd vaultix-nas && npm install`, verify `.env` FILES_DIR is an ABSOLUTE path (/DATA…) not relative; (4) `pm2 stop casaos-nas` then `cd /home/roy/vaultix-nas && pm2 start server.js --name vaultix-nas` (cwd matters for dotenv/CORS); (5) test frontend, roll back with `pm2 stop vaultix-nas && pm2 start casaos-nas` if broken; (6) only later `pm2 delete casaos-nas && pm2 save` + `rm -rf casaos-nas`. DO NOT run `pm2 update` mid-migration (has killed casaos-nas before). Also copy/restart the python sidecar (server.py / nas-python:3001) the same way.
```bash
(base) roy@raspberrypi:~ $ cd /home/roy
(base) roy@raspberrypi:~ $ rsyc -a --exclude node_modules casaos-nas/ vaultix-nas/
-bash: rsyc: command not found
(base) roy@raspberrypi:~ $ rsync -a --exclude node_modules casaos-nas/ vaultix-nas/
rsync: [Receiver] ERROR: cannot stat destination "/home/roy/vaultix-nas/": Not a directory (20)
rsync error: errors selecting input/output files, dirs (code 3) at main.c(781) [Receiver=3.4.1]
(base) roy@raspberrypi:~ $ grep -rn casaos-nas . --include=*.js --include=*.py --include=.env
(base) roy@raspberrypi:~ $ rsync -a --exclude node_modules casaos-nas/ vaultix-nas/
rsync: [Receiver] ERROR: cannot stat destination "/home/roy/vaultix-nas/": Not a directory (20)
rsync error: errors selecting input/output files, dirs (code 3) at main.c(781) [Receiver=3.4.1]
(base) roy@raspberrypi:~ $ cd vaultix-nas && npm install
-bash: cd: vaultix-nas: Not a directory
(base) roy@raspberrypi:~ $ ks
-bash: ks: command not found
(base) roy@raspberrypi:~ $ ls
backup         Downloads                           nas-files          photorec.ses  Templates
backup.tar.gz  duckdns                             node_modules       Pictures      vaultix-nas
bakcup         index.nginx-debian.html             onlyoffice         Public        Videos
casaos-nas     miniconda3                          package.json       recup_dir.1
Desktop        Miniconda3-latest-Linux-aarch64.sh  package-lock.json  recup_dir.2
Documents      Music                               photorec.se2       recup_dir.3
(base) roy@raspberrypi:~ $ pm2 start server.js --name vaultix-nas

>>>> In-memory PM2 is out-of-date, do:
>>>> $ pm2 update
In memory PM2 version: 7.0.1
Local PM2 version: 7.0.3

[PM2][ERROR] Script not found: /home/roy/server.js
(base) roy@raspberrypi:~ $ pm2 logs vaultix-nas --lines 30 --nostream

>>>> In-memory PM2 is out-of-date, do:
>>>> $ pm2 update
In memory PM2 version: 7.0.1
Local PM2 version: 7.0.3

[TAILING] Tailing last 30 lines for [vaultix-nas] process (change the value with --lines option)
(base) roy@raspberrypi:~ $ #    pm2 delete casaos-nas ; pm2 save
```
10. [ ] Migration attempt #2. DIAGNOSIS (2026-07-01): `pm2 start server.js` → "Script not found: /home/roy/vaultix-nas/server.js" because the vaultix-nas DIRECTORY is EMPTY — the `rsync casaos-nas/ vaultix-nas/` copy never actually succeeded (in #9 it failed on the stray file; the dir was later created but the copy wasn't re-run). Also user ran `pm2 update` (was warned not to) → bounced the daemon & stopped everything → recovered with `pm2 start all`. **END STATE IS HEALTHY: casaos-nas + nas-python both online (original backend restored, no damage).** To resume migration: `rsync -a --exclude node_modules --exclude .git casaos-nas/ vaultix-nas/` then VERIFY `ls vaultix-nas/server.js server.py .env` exist BEFORE switching; check `pm2 describe nas-python` for the python interpreter to replicate. RECOMMENDATION: consider skipping — the folder rename is purely internal (users only ever see "Vaultix NAS"), zero user benefit, real risk to a working backend.
pi:
```bash
(base) roy@raspberrypi:~ $ mount: /dev/sda1: Can't open blockdev
> ^C
(base) roy@raspberrypi:~ $ # 若 testdisk/photorec 還開著,按 q 一直退到結束
ps aux | grep -Ei 'testdisk|photorec' | grep -v grep      # 有列出來就代表還在跑
sudo fuser -mv /dev/sda 2>/dev/null                        # 看誰佔用；有 PID 就 kill
root     2246787  0.0  0.0  22176  8000 pts/0    S+   Jul01   0:02 sudo testdisk /dev/sda
root     2246789  0.0  0.0  22176  3584 pts/2    Ss   Jul01   0:00 sudo testdisk /dev/sda
root     2246790  3.7  0.0   8704  4432 pts/2    S+   Jul01   2:26 testdisk /dev/sda
[sudo] password for roy:
 2246790(base) roy@raspberrlsblk                       # sda1 還在不在還在不在
ls -l /dev/sda1             # 裝置節點在不在
sudo blkid /dev/sda1        # 應該顯示 TYPE="exfat"
dmesg | tail -15            # 看核心為什麼開不了(USB 掉線會有訊息)
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop0         7:0    0     2G  0 loop
sda           8:0    0 931.5G  0 disk
└─sda1        8:1    0 931.5G  0 part
mmcblk0     179:0    0  57.9G  0 disk
├─mmcblk0p1 179:1    0   512M  0 part /boot/firmware
└─mmcblk0p2 179:2    0  57.4G  0 part /
zram0       254:0    0     2G  0 disk [SWAP]
brw-rw---- 1 root disk 8, 1 Jun 13 21:12 /dev/sda1
/dev/sda1: LABEL="Game" UUID="1248-F29E" BLOCK_SIZE="512" TYPE="exfat"
[1526472.226476] [UFW BLOCK] IN=eth0 OUT= MAC=88:a2:9e:85:10:9e:58:1c:f8:d3:8e:b6:08:00 SRC=192.168.199.117 DST=192.168.199.108 LEN=52 TOS=0x00 PREC=0x00 TTL=128 ID=35224 DF PROTO=TCP SPT=9416 DPT=80 WINDOW=65535 RES=0x00 SYN URGP=0
[1526480.226929] [UFW BLOCK] IN=eth0 OUT= MAC=88:a2:9e:85:10:9e:58:1c:f8:d3:8e:b6:08:00 SRC=192.168.199.117 DST=192.168.199.108 LEN=52 TOS=0x00 PREC=0x00 TTL=128 ID=35225 DF PROTO=TCP SPT=9416 DPT=80 WINDOW=65535 RES=0x00 SYN URGP=0
[1527095.321861] [UFW BLOCK] IN=eth0 OUT= MAC=88:a2:9e:85:10:9e:58:1c:f8:d3:8e:b6:08:00 SRC=192.168.199.117 DST=192.168.199.108 LEN=1248 TOS=0x00 PREC=0x00 TTL=128 ID=35228 DF PROTO=UDP SPT=61306 DPT=443 LEN=1228
[1527096.324892] [UFW BLOCK] IN=eth0 OUT= MAC=88:a2:9e:85:10:9e:58:1c:f8:d3:8e:b6:08:00 SRC=192.168.199.117 DST=192.168.199.108 LEN=1248 TOS=0x00 PREC=0x00 TTL=128 ID=35229 DF PROTO=UDP SPT=61306 DPT=443 LEN=1228
[1527098.320688] [UFW BLOCK] IN=eth0 OUT= MAC=88:a2:9e:85:10:9e:58:1c:f8:d3:8e:b6:08:00 SRC=192.168.199.117 DST=192.168.199.108 LEN=1248 TOS=0x00 PREC=0x00 TTL=128 ID=35231 DF PROTO=UDP SPT=61306 DPT=443 LEN=1228
[1527102.317493] [UFW BLOCK] IN=eth0 OUT= MAC=88:a2:9e:85:10:9e:58:1c:f8:d3:8e:b6:08:00 SRC=192.168.199.117 DST=192.168.199.108 LEN=1248 TOS=0x00 PREC=0x00 TTL=128 ID=35233 DF PROTO=UDP SPT=61306 DPT=443 LEN=1228
[1527115.321513] [UFW BLOCK] IN=eth0 OUT= MAC=88:a2:9e:85:10:9e:58:1c:f8:d3:8e:b6:08:00 SRC=192.168.199.117 DST=192.168.199.108 LEN=52 TOS=0x00 PREC=0x00 TTL=128 ID=35235 DF PROTO=TCP SPT=5718 DPT=80 WINDOW=65535 RES=0x00 SYN URGP=0
[1527116.321163] [UFW BLOCK] IN=eth0 OUT= MAC=88:a2:9e:85:10:9e:58:1c:f8:d3:8e:b6:08:00 SRC=192.168.199.117 DST=192.168.199.108 LEN=52 TOS=0x00 PREC=0x00 TTL=128 ID=35236 DF PROTO=TCP SPT=5718 DPT=80 WINDOW=65535 RES=0x00 SYN URGP=0
[1527118.321844] [UFW BLOCK] IN=eth0 OUT= MAC=88:a2:9e:85:10:9e:58:1c:f8:d3:8e:b6:08:00 SRC=192.168.199.117 DST=192.168.199.108 LEN=52 TOS=0x00 PREC=0x00 TTL=128 ID=35237 DF PROTO=TCP SPT=5718 DPT=80 WINDOW=65535 RES=0x00 SYN URGP=0
[1527122.323548] [UFW BLOCK] IN=eth0 OUT= MAC=88:a2:9e:85:10:9e:58:1c:f8:d3:8e:b6:08:00 SRC=192.168.199.117 DST=192.168.199.108 LEN=52 TOS=0x00 PREC=0x00 TTL=128 ID=35238 DF PROTO=TCP SPT=5718 DPT=80 WINDOW=65535 RES=0x00 SYN URGP=0
[1527130.323916] [UFW BLOCK] IN=eth0 OUT= MAC=88:a2:9e:85:10:9e:58:1c:f8:d3:8e:b6:08:00 SRC=192.168.199.117 DST=192.168.199.108 LEN=52 TOS=0x00 PREC=0x00 TTL=128 ID=35239 DF PROTO=TCP SPT=5718 DPT=80 WINDOW=65535 RES=0x00 SYN URGP=0
[1527153.158127] [UFW BLOCK] IN=eth0 OUT= MAC=88:a2:9e:85:10:9e:58:1c:f8:d3:8e:b6:08:00 SRC=192.168.199.117 DST=192.168.199.108 LEN=1248 TOS=0x00 PREC=0x00 TTL=128 ID=35242 DF PROTO=UDP SPT=53296 DPT=443 LEN=1228
[1527154.157792] [UFW BLOCK] IN=eth0 OUT= MAC=88:a2:9e:85:10:9e:58:1c:f8:d3:8e:b6:08:00 SRC=192.168.199.117 DST=192.168.199.108 LEN=1248 TOS=0x00 PREC=0x00 TTL=128 ID=35243 DF PROTO=UDP SPT=53296 DPT=443 LEN=1228
[1527156.156120] [UFW BLOCK] IN=eth0 OUT= MAC=88:a2:9e:85:10:9e:58:1c:f8:d3:8e:b6:08:00 SRC=192.168.199.117 DST=192.168.199.108 LEN=1248 TOS=0x00 PREC=0x00 TTL=128 ID=35245 DF PROTO=UDP SPT=53296 DPT=443 LEN=1228
[1527160.152489] [UFW BLOCK] IN=eth0 OUT= MAC=88:a2:9e:85:10:9e:58:1c:f8:d3:8e:b6:08:00 SRC=192.168.199.117 DST=192.168.199.108 LEN=1248 TOS=0x00 PREC=0x00 TTL=128 ID=35247 DF PROTO=UDP SPT=53296 DPT=443 LEN=1228
(base) roy@raspberrypi:~ $ sudo mount -t exfat -o uid=1000,gid=1000,dmask=0022,fmask=0133,noatime /dev/sda1 /DATA/boyud9.5/sda1
mount: /DATA/boyud9.5/sda1: fsconfig() failed: /dev/sda1: Can't open blockdev.
       dmesg(1) may have more information after failed mount system call.
(base) roy@raspberrypi:~ $ # ⚠️ 確認 /dev/sda1 真的是那顆外接碟再做!會清空它
sudo umount /dev/sda1 2>/dev/null
sudo mkfs.exfat -n VaultixData /dev/sda1
sudo mount /dev/sda1 /DATA/boyud9.5/sda1
exfatprogs version : 1.2.9
open failed : /dev/sda1, Device or resource busy

exFAT format fail!
mount: /DATA/boyud9.5/sda1: fsconfig() failed: /dev/sda1: Can't open blockdev.
       dmesg(1) may have more information after failed mount system call.
```
  ### backend command (pi)
  
  pm2 list
  
  ```
  ```
  1.

  ## output
  ```

  ```
