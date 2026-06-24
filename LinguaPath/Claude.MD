# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LinguaPath is an English learning platform deployed at **https://linugapath.web.app** (Firebase project ID: `linugapath`). It has two distinct runtime environments:

1. **Admin server** (`admin/`) — local-only Node.js/Express on port 3002, connected to MySQL
2. **Frontend** (`frontend/`) — static HTML/JS files deployed to Firebase Hosting

## Key Architecture Decision: Static JSON Bridge

The frontend is a **static site** (Firebase Hosting) but needs data from MySQL. The solution is a publish-to-JSON pattern:

- Admin writes `frontend/vocab.json` and `frontend/listening.json` via `POST /api/publish`
- Frontend pages read these static JSON files with cache-busting (`fetch('vocab.json?t=' + Date.now())`)
- `POST /api/publish` also triggers `firebase deploy --only hosting` via `child_process.exec`

**Never** have frontend pages call `http://localhost:3002` directly — that only works locally, not on Firebase.

## Commands

### Admin Server (must be running for admin panel and publish)
```powershell
cd admin
node server.js          # start on port 3002 (auto-retries port+1 if busy)
# or double-click admin/start-admin.bat
```

### Frontend Build + Deploy
```powershell
cd frontend
npm run build           # tsc -b && vite build (checks TypeScript, outputs to dist/)
cd ..
firebase deploy --only hosting   # deploys entire frontend/ directory (NOT just dist/)
```

> `firebase.json` sets `"public": "frontend"` — so **all** static `.html/.js/.css/.json` files in `frontend/` are deployed directly alongside the Vite `dist/` subfolder. The build step is TypeScript validation only; it does not affect which HTML/JS files are served.

### Database
```powershell
# Quick query / check counts
& "C:\Program Files\MySQL\MySQL Server 9.7\bin\mysql.exe" -u root linguapath -e "SELECT cefr_level, COUNT(*) FROM vocabulary GROUP BY cefr_level;"

# Run a SQL file (use cmd /c for file redirect — PowerShell < operator doesn't work with native exe)
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.7\bin\mysql.exe`" -u root --default-character-set=utf8mb4 < path\to\file.sql"
```

### Publish vocabulary to live site
```powershell
# Via admin server (also triggers firebase deploy automatically):
Invoke-RestMethod -Uri "http://localhost:3002/api/publish" -Method POST

# Or manually: write JSON then deploy
# vocab.json and listening.json are written to frontend/ then firebase deploys
```

## Directory Structure

```
LinguaPath/
├── admin/                  # Local admin panel (never deployed to Firebase)
│   ├── server.js           # Express API: vocab CRUD, listening CRUD, publish+deploy
│   ├── index.html          # Admin UI (3 tabs: Vocabulary, Users, Listening)
│   ├── schema.sql          # MySQL DDL (reference only — table already altered since)
│   ├── vocab_batch.sql     # Batch INSERT for adding vocabulary words in bulk
│   └── start-admin.bat     # Convenience launcher
├── frontend/               # Deployed to Firebase Hosting ("public": "frontend")
│   ├── index.html          # Landing page
│   ├── vocabulary.html     # Flip-card vocabulary practice (reads vocab.json)
│   ├── listening.html      # Listening lab with YouTube embeds (reads listening.json)
│   ├── news.html           # News Reader — inline article data + vocab annotation
│   ├── vocab.json          # Published from MySQL via POST /api/publish
│   ├── listening.json      # Published from MySQL via POST /api/publish
│   ├── style.css           # Global dark-theme styles (CSS variables)
│   ├── account.js          # Shared Firebase Auth module (ES module)
│   ├── firebase-config.js  # Firebase SDK init
│   ├── script.js           # Shared theme toggle
│   └── src/                # Unused React/Vite scaffold (ignored by Firebase hosting)
├── firebase.json           # Hosting config; Firestore enabled; no Functions deployed
└── package.json            # Root-level (unused legacy backend)
```

## Admin Server API (`http://localhost:3002/api`)

| Method | Path | Purpose |
|--------|------|---------|
| GET/POST/PUT/DELETE | `/vocab` | Vocabulary CRUD |
| GET/POST/PUT/DELETE | `/listening` | Listening lesson CRUD |
| GET/POST/PUT/DELETE | `/news` | News article CRUD |
| POST | `/publish` | Write vocab.json + listening.json + news.json → `firebase deploy --only hosting` |
| GET | `/export` | Download vocabulary as JSON attachment |
| GET | `/stats` | Word counts by CEFR level and POS |
| GET | `/users` | List Firebase Auth users (requires serviceAccount.json) |
| PATCH | `/users/:uid/disable` | Enable/disable a Firebase Auth user |

## MySQL Database (`linguapath`)

Connection: `root` / no password / port 3306. Pool configured in `admin/server.js`.

**`vocabulary`** (~492 words as of last update)
- `id, word, part_of_speech (ENUM), cefr_level (ENUM A1–C2), category, example, image_url, exam_tags (VARCHAR comma-separated), created_at`
- `translation` column exists but is nullable and unused in the UI
- `exam_tags` stores comma-separated exam names: `TOEIC`, `TOEFL`, `IELTS`, `GRE` (e.g. `"TOEIC,TOEFL"`)
- Target distribution: A1 ~40, A2 ~150, B1 ~140, B2 ~90, C1 ~40, C2 ~20

**`listening_lessons`**
- `id, title, youtube_url, difficulty (ENUM A1–C2), key_points (JSON array of strings), created_at`
- `key_points` is stored as JSON string; parsed with `JSON.parse()` when read

**`news_articles`** (auto-created on server start)
- `id, title, source, difficulty (ENUM A1–C2), summary, content (LONGTEXT), created_at`
- Published to `frontend/news.json` via `POST /api/publish`
- Admin tab: 📰 News (left: form, right: article list)

## Vocabulary Card Features (`vocabulary.html`)

- Reads `vocab.json` as static file; no runtime server needed
- Flip cards: front shows word + CEFR badge + POS + category + exam tags; back shows example sentence
- Exam tag badges: color-coded — TOEIC (pink), TOEFL (blue), IELTS (green), GRE (orange)
- 🔊 Listen: Web Speech API TTS, speed controlled by filter-bar selector (極慢/慢/適中)
- 🎤 Speak: Whisper tiny.en (via `@xenova/transformers` CDN dynamic import, ~38MB first load, cached). Uses `env.backends.onnx.wasm.proxy = false` to avoid cross-origin Worker issues.
- ✓/✗ self-assessment buttons always available as fallback

## News Reader (`news.html`)

- Article source priority: loads `news.json` first (published from DB); falls back to hardcoded `ARTICLES` array if empty/unavailable
- `ARTICLE_DETAILS` (hardcoded second paragraphs) only merged when using fallback hardcoded articles
- CEFR filter: **exact level match** — selecting A1 shows only A1 articles (not cumulative). Article picker groups by level with colored headers
- Vocabulary annotation by CEFR level color: A1/A2 green dashed, B1/B2 blue dashed, C1/C2 gold dashed; above-level = red dotted
- Exam-tagged words show colored superscript dots (TOEIC pink, TOEFL blue, IELTS green, GRE gold)
- Word tooltip shows: word, POS, CEFR badge, category, exam tag badges, example sentence
- Word tooltip uses `onmouseenter` / `onmouseleave` with a 100ms hide delay

## Firebase Auth

Firebase Admin SDK (v14 modular API) used in `admin/server.js` — import from `firebase-admin/app` and `firebase-admin/auth`, not the old `require('firebase-admin')` default export. Requires `admin/serviceAccount.json`. Without it, the Users tab shows guidance; all other admin features work.

Frontend Auth: `frontend/firebase-config.js` + `frontend/account.js` (shared ES module on every page).

`account.js` has DOM references to `courses-grid` and `cta-btn` — these are guarded with null-checks because they only exist on `index.html` / `dashboard.html`.

## Frontend Pages Pattern

Every public page shares:
- `style.css` — dark-theme CSS variables (`--bg`, `--surface`, `--surface2`, `--accent`, `--muted`, `--border`, `--text`, `--danger`)
- `<script type="module" src="account.js">` — Firebase Auth state, login modal
- `<script src="script.js">` — `themeToggle()`
- Page-specific `<style>` block + inline `<script>`

Nav link order across all pages: `Vocabulary → Listening Lab → News Reader → Learning Path`

## Listening Lab Score

Comprehension progress stored in **localStorage** (`lp-listen-{id}`). Checked key-points array per lesson; aggregate "Listening Ability %" calculated client-side. Not synced to Firebase.
