# English-Learning Project

A full-stack application for learning English vocabulary with interactive flashcards and a "Word of the Day" feature.

## Features
- **Flashcards:** Test your knowledge with flip animations.
- **Word of the Day:** Learn a new word daily.
- **Vocabulary Management:** Add, delete, and mark words as mastered.
- **Pronunciation:** Hear words spoken aloud using the browser's speech synthesis.

## How to Run

### 1. Start the Backend
1. Open a terminal.
2. Navigate to `backend/`.
3. Run: `npm run dev`

### 2. Start the Frontend
1. Open a second terminal.
2. Navigate to `frontend/`.
3. Run: `npm run dev`

### 3. Open the App
Go to [http://localhost:5173/](http://localhost:5173/) in your web browser.

## Technologies
- **Frontend:** React, TypeScript, Vite, Vanilla CSS.
- **Backend:** Node.js, Express, CORS.
- **Storage:** Local JSON file (`backend/data/words.json`).


## a mini game

## role
1. square
2. triangle
3. circle
4. rectangle

## function
1. wasd to control the arrow up or down
2. have some random monster will be attack
3. use enter key can use command, like: /super can open the super attak and can protect us.
4. if will be die, we need to spell the vocablary.


## to do list
1. [x] the monster live bar need to display
2. [x] the role live bar set: 150
3. [x] i can eat the energe point to live(but need to enter the vocab, monster need to stop to move before enter the vocab)
4. [x] the live energe point set the 50
5. [x] the attck of leng it will be 100cm
6. [x] the monster will be according the role level to random create very fast.
7. [x] the game.js change to python file.
8. [x] spell wrong vocab is can't get back energe, can eat the next energe.
9. [x] according the mouse move tray to change the attack tray
10. [x] already implemented in `game_engine.py` `check_spell()` ??filters monsters within 30px when HP < 50 and correct
11. [x] added "Mini Game" nav link (`http://localhost:5000`, target=_blank) to all pages; removed dead MySQL code from `game_engine.py`
12. [x] `_load_words()` already reads from `frontend/vocab.json` ??same source as vocabulary.html
13. [x] `_load_words()` already loads from both `vocab.json` and `listening.json`; `trigger_spell()` uses `random.choice()`
14. [x] fix: `npx firebase deploy --only hosting` from `frontend/` produced no output because `frontend/firebase.js` (stale placeholder file) blocked npx from resolving the global `firebase` CLI. Removed the file. NAS project had no such `.js` file ??only `firebase.json`.
15. [x] cleaned up project root: deleted 11 dead prototype files (ability.js, auth.js, example.html, firebase.js, icons.svg, login.php, progress.js, radar.css, server.js, style.css, test.html), 2 dead frontend files (grammer.html, README.md), moved generate_audio.py to tools/, removed unused deps (bcrypt, jsonwebtoken, firebase) from root package.json.
16. [x] check the \frontend\src\components\ and \frontend\listening.html have same file or not, inlcude the news.html, vocabulary.html and so on. if have the same function, remove the html file at here, can save more space to use.
17. [x] i need to fix the contact us and footer are have same color background, because between this block has a long black rectangle at here.
18. [x] the \game\game_engine.py can connection with the firebase
19. [x] the \game\game_engine.py are show at the index.hmtl this frontend, i hope can put at the top menu, leanring path right side.
20. [x] the \frontend\src\components\vocab.tsx inside has the vocab card here, so i need the it's have the a button to slide the it, right button and left button can slide per vocab card. ??2026-07-01: replaced card grid with carousel slider; left/right arrow buttons navigate cards; page indicator (1 / 15); keyboard ????support; resets to card 1 on filter change.
21. [x] Migrate .html pages to .tsx React components — 2026-07-01: lesson.html → LessonPage.tsx (removed); path.html → PathPage.tsx (removed); firebase.json rewrites route /path → /dist/index.html (React SPA); all nav links updated.
22. [x] the \game\game_engine.py are not to use the http this server to connection, i wanna change to use the firebase or other server to use it, it's can use the htttps:// this server to use it. — 2026-07-01: ported game engine to client-side JS (`frontend/game-engine.js`); created `frontend/game.html` served via Firebase Hosting (HTTPS); game state runs entirely in-browser; Firestore save via Firebase Web SDK; nav links updated to `game.html`.
23. [x] i hope the game_engine.py can use the server from the https:// (like firebase) this server to play the game, but you didn't made it. — 2026-07-01: created Firebase Cloud Function (`functions/index.js`) that ports game_engine.py to Node.js as an HTTPS API; Firebase Hosting rewrites `/api/game/*` to the Function; `game.html` uses the Function API when deployed (HTTPS) and falls back to client-side engine locally; `functions/game-engine.js` is the server-side Node.js port.
24. [x] however, the link when i click 'mini game' this button is show localhost:port at new window hostly, i'm so dissapointment. — 2026-07-01: removed `target="_blank"` from Mini Game nav link in index.html and dist/index.html so it navigates in the same tab like all other nav links.
25. [] 
## output
```bash
(base) PS C:\Users\Roy\Documents\GitHub\websites\LinguaPath\frontend> npx firebase deploy --only hosting
```
```bash
(base) PS C:\Users\Roy\Documents\GitHub\websites\NAS\frontend> npx firebase deploy --only hosting

=== Deploying to 'vaultix-nas'...

i  deploying hosting
i  hosting[vaultix-nas]: beginning deploy...
i  hosting[vaultix-nas]: found 10 files in dist
+  hosting[vaultix-nas]: file upload complete
i  hosting[vaultix-nas]: finalizing version...
+  hosting[vaultix-nas]: version finalized
i  hosting[vaultix-nas]: releasing new version...
+  hosting[vaultix-nas]: release complete

+  Deploy complete!

Project Console: https://console.firebase.google.com/project/vaultix-nas/overview
Hosting URL: https://vaultix-nas.web.ap
```
