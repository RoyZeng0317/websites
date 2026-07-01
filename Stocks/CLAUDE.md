# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack global stock information platform supporting Taiwan (TWSE/TPEx), US, and HK stocks. Frontend deployed to Firebase Hosting; backend deployed to Render.

- **Production frontend**: https://stocks-global.web.app (Firebase Hosting)
- **Production backend**: https://stock-info-backend-z6sr.onrender.com (Render)
- **Firebase project**: `stocks-global`

---

## Common Commands

### Start both services locally (PowerShell)
```powershell
.\start.ps1
# Backend: http://localhost:8000
# Frontend: http://localhost:5173
```

### Frontend only
```bash
cd frontend
npm run dev       # dev server (proxies /api → localhost:8000)
npm run build     # tsc -b && vite build
npm run preview   # preview production build
```

### Backend only
```bash
cd backend
python -m uvicorn main:app --port 8000 --reload
```

### Deploy frontend
```bash
# From Stocks/ root:
cd frontend && npm run build && cd ..
npx firebase use stocks-global
npx firebase deploy --only hosting
```

### Deploy Firestore rules
```bash
npx firebase deploy --only firestore:rules
```

---

## Architecture

### Frontend (`frontend/`)
React 18 + TypeScript + Vite + Tailwind CSS. Single-page app with React Router.

**Key files:**
- `src/pages/StockPage.tsx` — individual stock page; uses a **tab system** (`TabId` union type) where tabs are either pre-mounted (`PREFETCH_TABS`) or lazily mounted on first click. Once mounted, tabs stay alive (hidden with `display:none`) to avoid re-fetching.
- `src/pages/HomePage.tsx` — search + watchlist + attention/disposition stocks + market lists.
- `src/api/stockApi.ts` — all API calls to backend. `BASE` reads from `VITE_API_BASE_URL` env var (falls back to `/api` for dev proxy). WebSocket URL derived from `BASE`.
- `src/hooks/usePriceWebSocket.ts` — **shared WebSocket pool**: one WS connection per symbol across all components. Prevents duplicate connections when multiple components (StockHeader, RealtimeChart, HoldingTracker) subscribe to the same symbol.
- `src/utils/holdings.ts` — Firestore CRUD for user holdings (`users/{uid}/holdings/{docId}`).
- `src/utils/watchlist.ts` — localStorage-based watchlist.

**Data flow for TWSE data fetched directly by frontend** (bypasses backend):
- `AttentionStocks.tsx` → `https://www.twse.com.tw/announcement/notice?response=json&startDate=YYYYMMDD&endDate=YYYYMMDD`
- `AttentionStocks.tsx` → `https://www.twse.com.tw/announcement/punish?response=json`
- `CompanyInfo.tsx` → `https://openapi.twse.com.tw/v1/opendata/t187ap03_L` (listed) or `t187ap03_P` (OTC)

### Backend (`backend/main.py`)
FastAPI ~3600 lines. Single file. All API logic is blocking synchronous (uses `requests`), called from async route handlers via `loop.run_in_executor(None, fn, args)`.

**Data source priority for Taiwan stocks:**
1. TWSE OpenAPI (BWIBBU, MOPS) — PE, dividend yield, PB
2. Finnhub — supplemental fundamentals (if `FINNHUB_API_KEY` env var set)
3. Yahoo Finance v10 API — direct HTTP calls (no SDK)
4. yfinance library — last resort fallback

**Caching strategy (all in-memory, lost on restart):**
- `CACHE` / `CACHE_TTL=120s` — main stock info cache
- `FUNDAMENTALS_CACHE` / `FUNDAMENTALS_TTL=7200s` — fundamental data
- `_TWSE_BWIBBU_CACHE` / `_TWSE_BWIBBU_TTL=3600s`
- `_TWSE_WARNING_CACHE` / `_TWSE_WARNING_TTL=1800s` — attention/disposition stocks

**Key endpoints:**
- `GET /api/stock/{symbol}` — full stock info (price + fundamentals + company info)
- `GET /api/price/{symbol}` — realtime price only
- `GET /api/prices?symbols=A,B,C` — batch prices (up to 20)
- `GET /api/attention-stocks` — TWSE 注意股 list
- `GET /api/disposition-stocks` — TWSE 處置股 list
- `WS /ws/price/{symbol}` — WebSocket realtime price (polls every 1s)

**Rate limiting:** `rate_limit()` — global 1.5s minimum between requests, thread-locked.

### Firebase
- **Hosting** — serves `frontend/dist`
- **Firestore** — user holdings at `users/{uid}/holdings/{docId}` (authenticated reads/writes only)
- **Auth** — Google Sign-In only

---

## Environment Variables

### Backend (set in Render dashboard)
| Variable | Purpose |
|---|---|
| `FINNHUB_API_KEY` | Optional — Finnhub API for supplemental data |
| `GEMINI_API_KEY` | Required for AI consult feature |

### Frontend
| File | Variable |
|---|---|
| `.env.production` | `VITE_API_BASE_URL=https://stock-info-backend-z6sr.onrender.com/api` |
| (dev default) | `VITE_API_BASE_URL` falls back to `/api` → Vite proxy → `localhost:8000` |

---

## Known Constraints

**GitHub push protection**: The repo has secret scanning enabled. Pushes may be blocked if Firebase API keys (from `backend/firebaseconfig.js` or `frontend/src/firebase.ts`) are in the diff. To unblock: go to the GitHub security URLs shown in the push error and click "Allow secret".

**Backend deployment**: Render watches the `main` branch of `github.com/RoyZeng0317/websites`. Backend is at `rootDir: Stocks` in `render.yaml`. Frontend is deployed separately via Firebase CLI, not Render.

**Taiwan stock company info**: `CompanyInfo.tsx` calls TWSE OpenAPI directly because the backend's `_fetch_twse_company_info()` has occasional reliability issues. The TWSE full company list (~1000 entries) is downloaded and filtered client-side.

**注意股 timing**: TWSE publishes the attention stock list after market close (~15:00 TST). The `announcement/notice` endpoint returns empty during trading hours. `getAttentionStocks()` queries up to 5 recent trading days and caches the last non-empty result in localStorage.

**ETF detection**: `isETF` is determined by `info.isETF === true || info.fundFamily != null || info.navPrice != null`. ETF-only tabs (折溢價) and ETF-only analytics are gated on this.

## To do list
[x] 讀取backend\data\銀行手續費.xlsx做出frontend\PortfolioOverview.tsx "我的持股"精準版，包含手續費的部分，會調漲買入為0.0x，x為手續費前x0元(也就是x0元手續費為x%買入價)

## Error log
[ ] frontend show: ```無法載入新聞資料 Unexpected token '<', "<!DOCTYPE "... is not valid JSON ``` this error log
