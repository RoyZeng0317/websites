import sqlite3
import hashlib
import os

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'users.db')

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

cur.execute("PRAGMA foreign_keys = ON")

cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role     TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'user')),
    disabled INTEGER NOT NULL DEFAULT 0
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS vaultix_ids (
    user_id         INTEGER NOT NULL PRIMARY KEY,
    vaultix_id      TEXT    NOT NULL UNIQUE,
    vaultix_id_hash TEXT    DEFAULT NULL,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
""")

demo_user = "admin"
demo_pass = hashlib.sha256("admin123".encode()).hexdigest()
try:
    cur.execute("INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')", (demo_user, demo_pass))
    print(f"Inserted demo user: {demo_user}")
except sqlite3.IntegrityError:
    print("Demo user already exists")

conn.commit()
conn.close()
print(f"SQLite DB created at: {DB_PATH}")
