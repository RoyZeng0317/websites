# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LinguaPath is an English learning platform deployed at **https://linguapath-platform.web.app** (Firebase project ID: `linguapath-platform`). It has three distinct runtime environments:

1. **Admin server** (`admin/`) — local-only Node.js/Express on port 3002, connected to MySQL
2. **Backend server** (`backend/`) — local Node.js/Express on port 5000, Gemini STT + word CRUD
3. **Frontend** (`frontend/`) — static HTML/JS files deployed to Firebase Hosting

## Key Architecture Decision: Static JSON Bridge

The frontend is a **static site** (Firebase Hosting) with no server at runtime. Data flows via a publish-to-JSON pattern:

- `POST /api/publish` on the admin server (port 3002) writes `frontend/vocab.json`, `frontend/listening.json`, and `frontend/news.json`, then runs `firebase deploy --only hosting`
- Frontend pages fetch these static JSON files with cache-busting (`fetch('file.json?t=' + Date.now())`)

**Never** have frontend pages call `http://localhost:3002` or `http://localhost:5000` directly — those only work locally, not on Firebase Hosting.

## Commands

### Admin Server
```powershell
cd admin
node server.js          # port 3002 (auto-retries port+1 if busy)
```

### Backend Server (Gemini STT)
```powershell
cd backend
node index.js           # port 5000; reads GEMINI_API_KEY from ../.env
```

### Frontend Build + Deploy
```powershell
# MUST run from LinguaPath root (not from frontend/)
cd frontend
npm run build           # tsc -b && vite build — TypeScript validation only
cd ..
firebase deploy --only hosting
```

> `firebase.json` sets `"public": "frontend"` — Firebase deploys every file in `frontend/` directly, including `.html/.json/.js/.css`. The Vite build (`dist/`) is secondary; the real served files are the flat `frontend/` files.

> **Active project must be `linguapath-platform`**. If deploy fails with "linugapath" or "linguapath" errors, run: `firebase use linguapath-platform`

### Publish to live site (all data at once)
```powershell
# Admin server must be running first
Invoke-RestMethod -Uri "http://localhost:3002/api/publish" -Method POST
# This writes vocab.json + listening.json + news.json then auto-deploys
```

### Database
```powershell
& "C:\Program Files\MySQL\MySQL Server 9.7\bin\mysql.exe" -u root linguapath -e "SELECT cefr_level, COUNT(*) FROM vocabulary GROUP BY cefr_level;"
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.7\bin\mysql.exe`" -u root --default-character-set=utf8mb4 < path\to\file.sql"
```

## Directory Structure

```
LinguaPath/
├── admin/                  # Local admin panel (never deployed)
│   ├── server.js           # Express API: vocab/listening/news CRUD, publish+deploy
│   ├── index.html          # Admin UI (tabs: Vocabulary, Users, Listening, News)
│   ├── schema.sql          # MySQL DDL reference
│   └── vocab_batch.sql     # Bulk INSERT for vocabulary words
├── backend/                # Local backend (never deployed)
│   ├── index.js            # Express API: word CRUD + POST /api/speech-to-text (Gemini)
│   └── data/
│       ├── words.json      # Flat word list for the backend word API
│       └── News/           # Daily AI-generated news: yyyy-mm-dd.json
├── frontend/               # Deployed to Firebase Hosting
│   ├── index.html          # Landing page
│   ├── vocabulary.html     # Flip-card practice (reads vocab.json)
│   ├── listening.html      # Listening lab with YouTube embeds (reads listening.json)
│   ├── news.html           # News Reader (reads news.json + hardcoded fallback)
│   ├── vocab.json          # Published from MySQL via POST /api/publish
│   ├── listening.json      # Published from MySQL via POST /api/publish
│   ├── news.json           # Published: MySQL news_articles + backend/data/News/*.json merged
│   ├── style.css           # Global dark-theme CSS variables
│   ├── account.js          # Shared Firebase Auth ES module (every page)
│   ├── firebase-config.js  # Firebase SDK init
│   ├── script.js           # themeToggle()
│   └── src/                # React/Vite scaffold — NOT served by Firebase (ignored)
├── .firebaserc             # default project: linguapath-platform
└── firebase.json           # public: "frontend"; Firestore rules also referenced
```

## news.json: Merge Pipeline

`POST /api/publish` builds `frontend/news.json` by merging two sources in order:

1. **MySQL `news_articles` table** — manually curated articles (IDs are MySQL auto-increment integers)
2. **`backend/data/News/yyyy-mm-dd.json`** — AI-generated daily files, one per CEFR level

Daily file format:
```json
{ "date": "2026-06-26", "articles": { "A1": { "title": "...", "source": "...", "content": "..." }, "A2": {...}, ... } }
```

ID scheme for daily articles: `parseInt(dateKey) * 10 + levelIndex` — e.g. 2026-06-26 A1 → `202606260`. These never collide with MySQL integer IDs.

## News Reader (`news.html` and `src/components/news.tsx`)

**Article loading — always MERGE, never replace:**
1. The 13 hardcoded `ARTICLES` always have `ARTICLE_DETAILS` (second paragraphs) applied
2. If `news.json` loads successfully with data, those articles are **appended** to the hardcoded set
3. If `news.json` is unavailable, only the 13 hardcoded articles are shown

CEFR filter: **exact level match only** (`a.difficulty === userLevel`). Article picker shows only the selected level.

Vocabulary annotation colors: A1/A2 green dashed · B1/B2 blue dashed · C1/C2 gold dashed · above-level = red dotted. Exam-tagged words (`TOEIC/TOEFL/IELTS/GRE`) show colored superscript dots.

## Admin Server API (`http://localhost:3002/api`)

| Method | Path | Purpose |
|--------|------|---------|
| GET/POST/PUT/DELETE | `/vocab` | Vocabulary CRUD |
| GET/POST/PUT/DELETE | `/listening` | Listening lesson CRUD |
| GET/POST/PUT/DELETE | `/news` | News article CRUD (MySQL table) |
| POST | `/publish` | Write all JSON files → `firebase deploy --only hosting` |
| GET | `/export` | Download vocabulary as JSON |
| GET | `/stats` | Word counts by CEFR level and POS |
| GET | `/users` | List Firebase Auth users (needs `admin/serviceAccount.json`) |
| PATCH | `/users/:uid/disable` | Enable/disable a Firebase Auth user |

## MySQL Database (`linguapath`)

Connection: `root` / no password / port 3306.

**`vocabulary`** — `id, word, part_of_speech (ENUM), cefr_level (ENUM A1–C2), category, example, image_url, exam_tags (VARCHAR comma-separated), created_at`
- `exam_tags`: comma-separated `TOEIC,TOEFL,IELTS,GRE`
- `translation` column exists but is unused

**`listening_lessons`** — `id, title, youtube_url, difficulty, key_points (JSON string), created_at`

**`news_articles`** — `id, title, source, difficulty, summary, content (LONGTEXT), created_at`
- Auto-created on admin server start
- These are manually curated; AI-generated daily news lives in `backend/data/News/` instead

## Vocabulary Card (`vocabulary.html`)

- Flip cards: front = word + CEFR badge + POS + category + exam tags; back = example sentence
- 🔊 Listen: Web Speech API TTS with speed selector
- 🎤 Speak: Whisper tiny.en via `@xenova/transformers` CDN (~38MB first load, then cached). Uses `env.backends.onnx.wasm.proxy = false` to avoid cross-origin Worker issues

## Firebase Auth

Firebase Admin SDK v14 modular API in `admin/server.js` — import from `firebase-admin/app` and `firebase-admin/auth`. Requires `admin/serviceAccount.json`; without it, the Users tab degrades gracefully.

Frontend: `firebase-config.js` + `account.js` (shared ES module). `account.js` guards DOM refs to `courses-grid` and `cta-btn` with null-checks since those elements only exist on `index.html`.

## Frontend Pages Pattern

Every page includes:
- `style.css` — CSS variables: `--bg`, `--surface`, `--surface2`, `--accent`, `--muted`, `--border`, `--text`, `--danger`
- `<script type="module" src="account.js">` — Auth state + login modal
- `<script src="script.js">` — `themeToggle()`
- Page-specific `<style>` block + inline `<script>`

Nav order across all pages: `Vocabulary → Listening Lab → News Reader → Learning Path`

## Listening Lab Score

Comprehension progress stored in **localStorage** (`lp-listen-{id}`). Aggregate "Listening Ability %" is calculated client-side from checked key-points. Not synced to Firebase.
