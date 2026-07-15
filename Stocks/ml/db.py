"""SQLite storage for the Pi-side collection/training pipeline.

Single-file DB (see config.DB_PATH), safe for daily cron upserts
(INSERT OR REPLACE on primary keys means a half-finished run can just
be re-run without corrupting anything). WAL mode so a concurrent
`sqlite3 stocks.db` debugging session doesn't block the cron writer.
"""
from __future__ import annotations

import sqlite3
from contextlib import contextmanager

import config

SCHEMA = """
CREATE TABLE IF NOT EXISTS symbols (
    symbol TEXT PRIMARY KEY,
    name TEXT,
    market TEXT,        -- 'TWSE' | 'TPEx'
    sector TEXT,
    industry TEXT,
    is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS daily_bars (
    symbol TEXT NOT NULL,
    date TEXT NOT NULL,   -- YYYY-MM-DD
    open REAL, high REAL, low REAL, close REAL, volume REAL,
    source TEXT,
    PRIMARY KEY (symbol, date)
);

CREATE TABLE IF NOT EXISTS institutional_flow (
    symbol TEXT NOT NULL,
    date TEXT NOT NULL,
    foreign_net REAL, it_net REAL, dealer_net REAL, total_net REAL,
    PRIMARY KEY (symbol, date)
);

CREATE TABLE IF NOT EXISTS margin_trading (
    symbol TEXT NOT NULL,
    date TEXT NOT NULL,
    margin_buy REAL, margin_sell REAL, margin_balance REAL, margin_balance_prev REAL,
    short_balance REAL, short_balance_prev REAL,
    PRIMARY KEY (symbol, date)
);

CREATE TABLE IF NOT EXISTS fundamentals_snapshot (
    symbol TEXT NOT NULL,
    date TEXT NOT NULL,
    pe REAL, pb REAL, div_yield REAL,
    PRIMARY KEY (symbol, date)
);

-- Derived/rebuildable — never hand-edited. Column set mirrors
-- backend/feature_schema.py::FEATURE_COLUMNS plus the two label columns.
CREATE TABLE IF NOT EXISTS features (
    symbol TEXT NOT NULL,
    date TEXT NOT NULL,
    feature_json TEXT NOT NULL,   -- {feature_name: value, ...}, keys = FEATURE_COLUMNS
    label_1d INTEGER,             -- 0=down,1=flat,2=up ; NULL if not yet resolvable
    label_5d INTEGER,
    PRIMARY KEY (symbol, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_bars_date ON daily_bars(date);
CREATE INDEX IF NOT EXISTS idx_features_date ON features(date);
"""


@contextmanager
def connect():
    config.DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(config.DB_PATH), timeout=30)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=OFF")
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with connect() as conn:
        conn.executescript(SCHEMA)


def upsert_rows(conn: sqlite3.Connection, table: str, rows: list[dict]):
    """Generic INSERT OR REPLACE for a list of dicts sharing the same keys."""
    if not rows:
        return
    cols = list(rows[0].keys())
    placeholders = ", ".join(["?"] * len(cols))
    col_list = ", ".join(cols)
    sql = f"INSERT OR REPLACE INTO {table} ({col_list}) VALUES ({placeholders})"
    conn.executemany(sql, [tuple(r.get(c) for c in cols) for r in rows])


if __name__ == "__main__":
    init_db()
    print(f"Initialized schema at {config.DB_PATH}")
