// Uses Node's built-in node:sqlite (needs Node >= 22.5) instead of a native
// addon like better-sqlite3 — avoids node-gyp/compiler issues on the Pi's ARM
// toolchain and keeps this dependency-free.
const { DatabaseSync } = require('node:sqlite')
const path = require('path')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'messages.db')
const db = new DatabaseSync(DB_PATH)
db.exec('PRAGMA journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    chat_id TEXT NOT NULL,
    from_uid TEXT NOT NULL,
    to_uid TEXT NOT NULL,
    ct TEXT NOT NULL,
    nonce TEXT NOT NULL,
    mac TEXT NOT NULL,
    burn_timer TEXT NOT NULL DEFAULT 'off',
    created_at INTEGER NOT NULL,
    expire_at INTEGER
  );
  CREATE INDEX IF NOT EXISTS idx_messages_expire ON messages(expire_at);
  CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id);
`)

module.exports = db
