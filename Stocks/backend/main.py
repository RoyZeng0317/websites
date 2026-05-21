import os
import sys
import tempfile
# Must set TZPATH before yfinance import to avoid os.stat(None) on Python 3.14
_tz_cache = tempfile.mkdtemp(prefix="yf_tz_")
os.environ["TZPATH"] = _tz_cache

import json
import math
import time
from datetime import datetime, timezone
from typing import Optional

import requests
import yfinance as yf
from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# yfinance cache workaround
try:
    yf.set_tz_cache_location(_tz_cache)
except Exception:
    pass

_YF_SESSION = requests.Session()
_YF_SESSION.headers.update({
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/json,*/*",
    "Accept-Language": "en-US,en;q=0.9",
})


def _get_stock_info(symbol: str) -> dict:
    cache_key = f"info_{symbol}"
    now_val = time.time()
    if cache_key in CACHE and now_val - CACHE[cache_key]["time"] < CACHE_TTL:
        return CACHE[cache_key]["data"]

    rate_limit()
    errors = []
    try:
        ticker = yf.Ticker(symbol)
        info = dict(ticker.info) if ticker.info else {}
        if info.get("symbol"):
            CACHE[cache_key] = {"data": info, "time": now_val}
            return info
        errors.append("no symbol in info")
    except Exception as e:
        errors.append(f"ticker.info: {e}")

    try:
        d = yf.download(symbol, period="5d", progress=False)
        if d is not None and not d.empty:
            result = {"symbol": symbol, "regularMarketPrice": float(d["Close"].iloc[-1])}
            CACHE[cache_key] = {"data": result, "time": now_val}
            return result
        errors.append(f"download empty: {d}")
    except Exception as e:
        errors.append(f"download: {e}")

    errors.append("all methods failed")
    return {"_debug": errors, "symbol": symbol}


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        try:
            if hasattr(obj, 'item'):
                return obj.item()
            return super().default(obj)
        except TypeError:
            return str(obj)


app = FastAPI(title="Stock Info API")
app.json_encoder = CustomJSONEncoder

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CACHE = {}
CACHE_TTL = 120
_LAST_REQUEST_TIME = 0


def rate_limit():
    global _LAST_REQUEST_TIME
    now = time.time()
    elapsed = now - _LAST_REQUEST_TIME
    if elapsed < 1.5:
        time.sleep(1.5 - elapsed)
    _LAST_REQUEST_TIME = time.time()


@app.get("/api/search")
async def search_stocks(query: str = Query(..., min_length=1)):
    results = []

    popular = [
        ("AAPL", "Apple Inc."),
        ("MSFT", "Microsoft Corporation"),
        ("GOOGL", "Alphabet Inc."),
        ("AMZN", "Amazon.com Inc."),
        ("TSLA", "Tesla Inc."),
        ("META", "Meta Platforms Inc."),
        ("NVDA", "NVIDIA Corporation"),
        ("AMD", "Advanced Micro Devices Inc."),
        ("0700.HK", "Tencent Holdings Ltd."),
        ("9988.HK", "Alibaba Group Holding Ltd."),
        ("2330.TW", "Taiwan Semiconductor Manufacturing"),
        ("2317.TW", "Hon Hai Precision Industry"),
        ("2454.TW", "MediaTek Inc."),
        ("2888.HK", "HSBC Holdings plc"),
        ("0005.HK", "HSBC Holdings"),
        ("1299.HK", "AIA Group Ltd."),
        ("V", "Visa Inc."),
        ("MA", "Mastercard Inc."),
        ("JPM", "JPMorgan Chase & Co."),
        ("TSM", "Taiwan Semiconductor ADR"),
        ("BABA", "Alibaba Group ADR"),
    ]

    q = query.lower()
    for sym, name in popular:
        if q in sym.lower() or q in name.lower():
            results.append({"symbol": sym, "name": name, "exchange": _detect_exchange(sym)})

    try:
        info = _get_stock_info(query)
        if info and info.get("symbol"):
            sym = info["symbol"]
            if not any(r["symbol"] == sym for r in results):
                results.insert(0, {
                    "symbol": sym,
                    "name": info.get("longName", info.get("shortName", query)),
                    "exchange": _detect_exchange(sym),
                })
    except Exception:
        pass

    return results[:20]


def _detect_exchange(symbol: str) -> str:
    if symbol.endswith(".TW"):
        return "TWSE"
    if symbol.endswith(".HK"):
        return "HKEX"
    return "NYSE/NASDAQ"


@app.get("/api/stock/{symbol}")
async def get_stock_info(symbol: str):
    try:
        info = _get_stock_info(symbol)
    except Exception as e:
        return {"error": f"exception: {e}", "symbol": symbol}
    if not info or not info.get("symbol"):
        return {"error": "Failed to fetch stock info", "debug": info.get("_debug", "no debug info"), "symbol": symbol}

    import math as _math

    def safe(val, default=None):
        if val is None:
            return default
        try:
            if isinstance(val, float) and (_math.isnan(val) or _math.isinf(val)):
                return default
            if hasattr(val, 'item'):
                return val.item()
            if isinstance(val, (int, float)):
                return val
            return val
        except Exception:
            return default

    def safe_str(val, default=None):
        if val is None:
            return default
        try:
            s = str(val)
            return s if s != 'nan' else default
        except Exception:
            return default

    def safe_date(val):
        if val is None:
            return None
        try:
            return str(val)
        except Exception:
            return None

    result = {
        "symbol": symbol,
        "name": safe(info.get("longName"), safe(info.get("shortName"), symbol)),
        "currentPrice": safe(info.get("currentPrice"), safe(info.get("regularMarketPrice"), safe(info.get("previousClose"), 0))),
        "previousClose": safe(info.get("previousClose"), 0),
        "open": safe(info.get("regularMarketOpen"), 0),
        "dayHigh": safe(info.get("dayHigh"), safe(info.get("regularMarketDayHigh"), 0)),
        "dayLow": safe(info.get("dayLow"), safe(info.get("regularMarketDayLow"), 0)),
        "change": safe(info.get("regularMarketChange"), 0),
        "changePercent": safe(info.get("regularMarketChangePercent"), 0),
        "marketCap": safe(info.get("marketCap"), 0),
        "volume": safe(info.get("regularMarketVolume"), 0),
        "avgVolume": safe(info.get("averageVolume"), 0),
        "peRatio": safe(info.get("trailingPE")),
        "forwardPE": safe(info.get("forwardPE")),
        "eps": safe(info.get("trailingEps")),
        "forwardEps": safe(info.get("forwardEps")),
        "earningsDate": None,
        "dividendYield": safe(info.get("dividendYield")),
        "dividendRate": safe(info.get("dividendRate")),
        "exDividendDate": safe_date(info.get("exDividendDate")),
        "payoutRatio": safe(info.get("payoutRatio")),
        "fiveYearAvgDividendYield": safe(info.get("fiveYearAvgDividendYield")),
        "roe": safe(info.get("returnOnEquity")),
        "roa": safe(info.get("returnOnAssets")),
        "revenue": safe(info.get("totalRevenue")),
        "revenuePerShare": safe(info.get("revenuePerShare")),
        "profitMargin": safe(info.get("profitMargins")),
        "operatingMargin": safe(info.get("operatingMargins")),
        "debtToEquity": safe(info.get("debtToEquity")),
        "bookValue": safe(info.get("bookValue")),
        "priceToBook": safe(info.get("priceToBook")),
        "fiftyTwoWeekHigh": safe(info.get("fiftyTwoWeekHigh")),
        "fiftyTwoWeekLow": safe(info.get("fiftyTwoWeekLow")),
        "fiftyTwoWeekChange": safe(info.get("52WeekChange")),
        "beta": safe(info.get("beta")),
        "sector": safe(info.get("sector")),
        "industry": safe(info.get("industry")),
        "country": safe(info.get("country")),
        "website": safe(info.get("website")),
        "description": safe_str(info.get("longBusinessSummary")),
        "employees": safe(info.get("fullTimeEmployees")),
        "exchange": safe(info.get("exchange")),
        "currency": safe(info.get("currency")),
        "logoUrl": safe_str(info.get("logo_url")),
    }

    return result


@app.get("/api/stock/{symbol}/chart")
async def get_chart(
    symbol: str,
    period: str = Query("1y", description="1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max"),
    interval: str = Query("1d", description="1m,2m,5m,15m,30m,60m,1d,5d,1wk,1mo"),
):
    rate_limit()
    ticker = yf.Ticker(symbol)
    hist = ticker.history(period=period, interval=interval)

    data = []
    for index, row in hist.iterrows():
        data.append({
            "date": index.strftime("%Y-%m-%d %H:%M") if isinstance(index, datetime) else str(index),
            "open": round(float(row["Open"]), 2),
            "high": round(float(row["High"]), 2),
            "low": round(float(row["Low"]), 2),
            "close": round(float(row["Close"]), 2),
            "volume": int(row["Volume"]),
        })

    return {"symbol": symbol, "period": period, "interval": interval, "data": data}


@app.get("/api/stock/{symbol}/dividends")
async def get_dividends(symbol: str):
    rate_limit()
    ticker = yf.Ticker(symbol)
    dividends = ticker.dividends
    splits = ticker.splits

    div_data = []
    if dividends is not None and not dividends.empty:
        for index, value in dividends.items():
            dt = index if isinstance(index, datetime) else datetime.fromtimestamp(index.timestamp()) if hasattr(index, 'timestamp') else index
            div_data.append({
                "date": dt.strftime("%Y-%m-%d") if hasattr(dt, 'strftime') else str(dt),
                "amount": round(float(value), 4),
            })

    split_data = []
    if splits is not None and not splits.empty:
        for index, value in splits.items():
            split_data.append({
                "date": index.strftime("%Y-%m-%d"),
                "ratio": round(float(value), 4),
            })

    return {"symbol": symbol, "dividends": div_data, "splits": split_data}


@app.get("/api/stock/{symbol}/financials")
async def get_financials(symbol: str):
    rate_limit()
    ticker = yf.Ticker(symbol)

    result = {}
    for stmt_name, stmt in [
        ("incomeStatement", ticker.income_stmt),
        ("balanceSheet", ticker.balance_sheet),
        ("cashFlow", ticker.cashflow),
    ]:
        stmt_data = {}
        if stmt is not None and not stmt.empty:
            for index, row in stmt.iterrows():
                label = str(index)
                values = {}
                for col in row.index:
                    val = row[col]
                    col_str = str(col)
                    if hasattr(col, 'strftime'):
                        col_str = col.strftime("%Y-%m-%d")
                    try:
                        values[col_str] = round(float(val), 2) if val is not None and val == val else None
                    except (ValueError, TypeError):
                        values[col_str] = str(val) if val is not None else None
                stmt_data[label] = values
        result[stmt_name] = stmt_data

    return {"symbol": symbol, **result}


@app.get("/api/stock/{symbol}/holders")
async def get_holders(symbol: str):
    rate_limit()
    ticker = yf.Ticker(symbol)
    major = ticker.major_holders
    institutional = ticker.institutional_holders

    major_data = {}
    if major is not None and not major.empty:
        for index, row in major.iterrows():
            major_data[str(index)] = [str(v) for v in row.values]

    inst_data = []
    if institutional is not None and not institutional.empty:
        for _, row in institutional.iterrows():
            inst_data.append({str(k): str(v) for k, v in row.items()})

    return {"symbol": symbol, "majorHolders": major_data, "institutionalHolders": inst_data}


@app.websocket("/ws/price/{symbol}")
async def websocket_price(websocket: WebSocket, symbol: str):
    await websocket.accept()
    while True:
        await asyncio.sleep(5)
        rate_limit()
        try:
            info = _get_stock_info(symbol)
            price = info.get("currentPrice") or info.get("regularMarketPrice")
            if price is not None:
                await websocket.send_json({
                    "symbol": symbol,
                    "price": price,
                    "change": info.get("change", 0),
                    "changePercent": info.get("changePercent", 0),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                })
        except Exception:
            pass
