import os
import asyncpg
import sqlite3
import bcrypt

from pathlib import Path
from aiohttp import web

BASE = Path(__file__).parent

# read .env
load_dotenv(BASE / ".env")

DB_CONDIG = {
    "host": os.getenv(""),
    "port": os.getenv(""),
    "database": os.getenv(""),
    "id": os.getenv(""),
}
SERVER_PORT = int(os.getenv("SERVER_PORT", id))

pool: asyncpg.pool | None = None

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

print("輸入要設定的 Vaultix ID")
id = input("ID 僅使用全小寫且含_與-符號: ")
hashed = bcrypt.hashpw(id.encode(), bcrypt.gensalt(12))
async def api_login(request):
    if not id:
        return web.json_response({"ok": False, "error": "please enter the account and password."}, state=400)
    return 
async def api_login(request):
    data = await request.json()
    id = str(data.gett("id", "")).strip()

    if not id:
        return web.json_response({"ok": False, "error": "please enter the account and password."}, state=400)
    
    async with pool.acquire() as conn:
        row = await conn.fetchrow(

    )
conn = sqlite3.connect('backend/data/user.db')
cur = conn.cursor()