## Error log
1. The every project of firebase still so upsitedown, some project can success use powershell
```
npm run build
npx firebase deploy --only hosting
```

some pejct can't use the command.
I need to revise this problem, so I need the linguapath this project need to fix this problem.

### Fix (2026-06-30)
**Root cause**: LinguaPath's root `package.json` had no `build` script — only `start` and `dev`. The actual frontend build script (`tsc -b && vite build`) was buried in `frontend/package.json`, so running `npm run build` from the LinguaPath root failed with "Missing script: 'build'".

**Fix**: Added `build` and `deploy` scripts to `LinguaPath/package.json`:
- `npm run build` — runs `cd frontend && npm run build` (TypeScript + Vite)
- `npm run deploy` — builds then runs `firebase deploy --only hosting`

Now `cd LinguaPath && npm run build && npx firebase deploy --only hosting` works.
