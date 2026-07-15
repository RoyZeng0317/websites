"""Builds/refreshes the `symbols` table: TWSE+TPEx full company list
(for sector/industry metadata) filtered down to a liquid v1 universe.

Source: https://openapi.twse.com.tw/v1/opendata/t187ap03_L (listed) /
t187ap03_P (OTC) — the same endpoint CompanyInfo.tsx already uses on the
frontend (see Stocks/CLAUDE.md), so sector/industry labels stay consistent
with what the rest of the site already shows for a given stock.
"""
from __future__ import annotations

import sys
import time

import pandas as pd
import requests

import config
import db
from collectors.rate_limiter import rate_limit

_HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

_URLS = {
    "TWSE": "https://openapi.twse.com.tw/v1/opendata/t187ap03_L",
    "TPEx": "https://openapi.twse.com.tw/v1/opendata/t187ap03_P",
}


def fetch_full_company_list() -> pd.DataFrame:
    rows = []
    for market, url in _URLS.items():
        try:
            rate_limit()
            resp = requests.get(url, headers=_HEADERS, timeout=20)
            resp.raise_for_status()
            for item in resp.json():
                code = str(item.get("公司代號", "")).strip()
                if not code:
                    continue
                suffix = ".TW" if market == "TWSE" else ".TWO"
                rows.append({
                    "symbol": f"{code}{suffix}",
                    "name": item.get("公司簡稱") or item.get("公司名稱") or "",
                    "market": market,
                    "sector": item.get("產業別", ""),
                    "industry": item.get("產業別", ""),
                })
        except Exception as e:
            print(f"[universe] failed to fetch {market} company list: {e}", file=sys.stderr)
    return pd.DataFrame(rows, columns=["symbol", "name", "market", "sector", "industry"])


def _rank_by_liquidity(conn, top_n: int) -> set[str]:
    """Rank symbols by trailing 20-day average dollar volume (close*volume).
    Returns empty set if daily_bars doesn't have enough history yet
    (bootstrap case — caller falls back to config.SEED_SYMBOLS).
    """
    try:
        df = pd.read_sql_query(
            "SELECT symbol, date, close, volume FROM daily_bars "
            "WHERE date >= date('now', '-30 day')", conn,
        )
    except Exception:
        return set()
    if df.empty:
        return set()
    df["dollar_vol"] = df["close"] * df["volume"]
    ranked = df.groupby("symbol")["dollar_vol"].mean().sort_values(ascending=False)
    return set(ranked.head(top_n).index)


def refresh_universe(top_n: int = config.UNIVERSE_SIZE):
    db.init_db()
    companies = fetch_full_company_list()
    with db.connect() as conn:
        active_set = _rank_by_liquidity(conn, top_n)
        if not active_set:
            # Bootstrap: no price history yet, seed with known large caps.
            active_set = set(config.SEED_SYMBOLS)

        rows = []
        for _, r in companies.iterrows():
            rows.append({
                "symbol": r["symbol"], "name": r["name"], "market": r["market"],
                "sector": r["sector"], "industry": r["industry"],
                "is_active": 1 if r["symbol"] in active_set else 0,
            })
        # Ensure seed symbols exist even if the company-list fetch failed/partial.
        known = {r["symbol"] for r in rows}
        for sym in active_set - known:
            rows.append({"symbol": sym, "name": sym, "market": "TWSE" if sym.endswith(".TW") else "TPEx",
                         "sector": "", "industry": "", "is_active": 1})
        db.upsert_rows(conn, "symbols", rows)
    print(f"[universe] refreshed: {len(rows)} symbols total, {len(active_set)} active")


def active_symbols() -> list[str]:
    with db.connect() as conn:
        cur = conn.execute("SELECT symbol FROM symbols WHERE is_active = 1 ORDER BY symbol")
        return [r[0] for r in cur.fetchall()]


if __name__ == "__main__":
    refresh_universe()
