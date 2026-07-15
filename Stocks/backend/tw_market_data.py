"""Self-contained TW market data fetchers for the ML prediction endpoint.

Deliberately does NOT import from main.py: main.py has import-time side
effects meant for the ASGI server and this module needs to stay usable
independent of it. Small overlap with main.py's own TWSE fetch functions
is intentional (see Stocks/CLAUDE.md's note that main.py's fetchers are
already ~3800 lines of one file — not worth coupling a new module to it).
"""
from __future__ import annotations

import threading
import time
from datetime import datetime, timedelta, timezone

import pandas as pd
import requests
import yfinance as yf

_TAIPEI = timezone(timedelta(hours=8))

_HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

_LAST_REQUEST_TIME = 0.0
_RATE_LOCK = threading.Lock()


def rate_limit(min_interval: float = 1.5):
    global _LAST_REQUEST_TIME
    with _RATE_LOCK:
        elapsed = time.time() - _LAST_REQUEST_TIME
        if elapsed < min_interval:
            time.sleep(min_interval - elapsed)
        _LAST_REQUEST_TIME = time.time()


def _bare_code(symbol: str) -> str:
    return symbol.replace(".TW", "").replace(".TWO", "")


def fetch_ohlcv_history(symbol: str, period: str = "9mo") -> pd.DataFrame:
    """Fetch daily OHLCV history via yfinance. Returns a DataFrame indexed by
    date with lowercase open/high/low/close/volume columns (empty df on failure).
    """
    try:
        rate_limit()
        hist = yf.Ticker(symbol).history(period=period, interval="1d")
        if hist is None or hist.empty:
            return pd.DataFrame(columns=["open", "high", "low", "close", "volume"])
        hist = hist.rename(columns={
            "Open": "open", "High": "high", "Low": "low", "Close": "close", "Volume": "volume",
        })[["open", "high", "low", "close", "volume"]]
        hist.index = hist.index.tz_localize(None) if hist.index.tz is not None else hist.index
        return hist.dropna(subset=["close"])
    except Exception:
        return pd.DataFrame(columns=["open", "high", "low", "close", "volume"])


def _recent_trading_dates(n: int) -> list[str]:
    """Last n calendar days (weekdays only) in YYYYMMDD, most recent first."""
    dates = []
    d = datetime.now(_TAIPEI).date()
    while len(dates) < n:
        if d.weekday() < 5:
            dates.append(d.strftime("%Y%m%d"))
        d -= timedelta(days=1)
    return dates


def fetch_institutional_flow(symbol: str, lookback_days: int = 10) -> pd.DataFrame:
    """三大法人 (foreign/investment-trust/dealer) net buy/sell for `symbol`
    over the last `lookback_days` trading days. Returns a DataFrame with
    columns date, foreign_net, it_net, dealer_net, total_net (empty on failure).
    """
    if not (symbol.endswith(".TW") or symbol.endswith(".TWO")):
        return pd.DataFrame(columns=["date", "foreign_net", "it_net", "dealer_net", "total_net"])

    code = _bare_code(symbol)
    rows = []
    for date_str in _recent_trading_dates(lookback_days * 2):
        if len(rows) >= lookback_days:
            break
        try:
            rate_limit()
            url = f"https://www.twse.com.tw/fund/T86?response=json&date={date_str}&selectType=ALL"
            resp = requests.get(url, headers=_HEADERS, timeout=10)
            if resp.status_code != 200:
                continue
            payload = resp.json()
            data = payload.get("data", [])
            for row in data:
                if len(row) < 11 or str(row[0]).strip() != code:
                    continue
                def _num(x):
                    try:
                        return float(str(x).replace(",", ""))
                    except Exception:
                        return 0.0
                foreign_net = _num(row[4]) if len(row) > 4 else 0.0
                it_net = _num(row[7]) if len(row) > 7 else 0.0
                dealer_net = _num(row[10]) if len(row) > 10 else 0.0
                rows.append({
                    "date": f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:]}",
                    "foreign_net": foreign_net,
                    "it_net": it_net,
                    "dealer_net": dealer_net,
                    "total_net": foreign_net + it_net + dealer_net,
                })
                break
        except Exception:
            continue
    if not rows:
        return pd.DataFrame(columns=["date", "foreign_net", "it_net", "dealer_net", "total_net"])
    return pd.DataFrame(rows).sort_values("date").reset_index(drop=True)


def fetch_margin_trading(symbol: str) -> dict:
    """融資融券 (margin/short balance) for `symbol`'s most recent trading day.
    Returns {} on failure — callers should treat missing margin data as neutral.
    """
    if not (symbol.endswith(".TW") or symbol.endswith(".TWO")):
        return {}
    code = _bare_code(symbol)
    for date_str in _recent_trading_dates(5):
        try:
            rate_limit()
            url = f"https://openapi.twse.com.tw/v1/exchangeReport/MI_MARGN?date={date_str}"
            resp = requests.get(url, headers=_HEADERS, timeout=10)
            if resp.status_code != 200:
                continue
            payload = resp.json()
            rows = payload if isinstance(payload, list) else []
            for row in rows:
                if str(row.get("Code", "")).strip() != code:
                    continue
                def _num(key):
                    try:
                        return float(str(row.get(key, "0")).replace(",", ""))
                    except Exception:
                        return 0.0
                return {
                    "date": f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:]}",
                    "margin_balance": _num("MarginTodayBalance") or _num("TodayBalance"),
                    "margin_balance_prev": _num("MarginPreviousBalance") or _num("PreviousBalance"),
                    "short_balance": _num("ShortTodayBalance"),
                    "short_balance_prev": _num("ShortPreviousBalance"),
                }
        except Exception:
            continue
    return {}
