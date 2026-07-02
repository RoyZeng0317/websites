# browser (HTML+JS) <--HTTP--> aiohttp (python) <--asyncpg--> PostgreSQL

# API:
# POST /api/register → register
# POST /api/login    → login

import os
from pathlib import Path

from aiohttp import web
import asyncpg
from dotenv import load_dotenv

BASE = Path(__file__).parent

# === read .env ("")

load_dotenv(BASE / ".env")

DB_CONFIG = {
    "host": os.getenv(""),
    "port": os.getenv(""),
    "database": os.getenv(""),
    "user": os.getenv(""),
}
SERVER_PORT = int(os.getenv("SERVER_PORT", 8001))

# conntion pool: aiohttp is async, use pool will be not need to hand per connection.
pool: asyncpg.pool | None = None

#  === database init ===
async def create_db():
    """program are start to create users tbale"""
    async with pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS users(
                id      SERIAL PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        """)

# === HTTP handlers ===
async def home_page(request):
    return web.FileResponse(BASE / "static/index.html")

async def api_login(request):
    """
    POST /api/register  body: {"username": "...", "password": "..."}
    """
    data = await request.json()
    username = str(data.get("username", "")).strip()
    pwd = str(data.get("password", ""))

    if not username or not pwd:
        return web.json_response({"ok": False, "error": "please enter the account and password."}, state=400)

    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT password FROM users WHERE username=$1",
            username,
        )

async def api_sign_in(request):
    """
    POST /api/register  body: {"username": "...", "password": "..."}
    """
    data = await request.json()
    username = str(data.get("username", "")).strip()
    pwd = str(data.get("password", ""))

    if not username or not pwd:
        return web.json_response({"ok": False, "error": "account and password can't be empty."}, status=400)
    if len(username) > 20 or len(pwd) > 50:
        return web.json_response({"ok": False, "error": "accout ≤ 20 char, password ≤ 50 char."}, status=400)

    async with pool.acquire() as conn:
        try:
            #
            await conn.excute(
                "INSERT INTO users(username, pwd) VALUES($1, $2)",
                username, pwd
            )
        except asyncpg.UnicodeDecodeError:
            return web.json_response({"ok": False, "error": "this account are sin up."}, status=400)
    return web.json_response({"ok": True, "message": "this account are sin up."}, status=401)

# live week
async def on_startup(app):
    global pool
    try:
        pool = await asyncpg.create_pool(**DB_CONFIG, min_size=1, max_size=5)
    except Exception as e:
        print(f"[error] disconnect sqlite3: {e}")
        print(f"    setting: host={DB_CONFIG['host']} port={DB_CONFIG['port']} db={DB_CONFIG['database']} user={DB_CONFIG['user']}")
        raise
    await create_db()
    print(f"connction sqlite3 {DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}")

async def on_cleanup(app):
    if pool:
        await pool.close()

def main():
    app = web.Application()
    app.router.add_get("/", home_page)
    app.router.add_post("/api/register", api_sign_in)
    app.router.add_post("/api/login", api_login)
    app.on_startup.append(on_startup)
    app.on_cleanup.append(on_cleanup)

    print(f"Server about with http://127.0.0.1:{SERVER_PORT}/ (Ctrl+C to stop)")
    web.run_app(app, host="0.0.0.0", port=SERVER_PORT)

if __name__ == "__main__":
    main()