import os
import sys
import tempfile
import urllib.parse
# Must set TZPATH before yfinance import to avoid os.stat(None) on Python 3.14
_tz_cache = tempfile.mkdtemp(prefix="yf_tz_")
os.environ["TZPATH"] = _tz_cache

import json
import math
import time
from datetime import datetime, timezone
from typing import Optional

import asyncio
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
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/json,*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Origin": "https://finance.yahoo.com",
    "Referer": "https://finance.yahoo.com/",
})

def _normalize_key(key):
    k = key.strip()
    if k.endswith(".TW"):
        return k
    if k.endswith(".TWO"):
        return k
    if k.endswith(".HK"):
        return k
    if k.isdigit() or (k.startswith("00") and not (k.endswith(".TW") or k.endswith(".TWO") or k.endswith(".HK"))):
        return k + ".TW"
    return k

STOCK_NAMES = {}
_raw_names = {
    "1301": "台塑", "2002": "中鋼", "2303": "聯電", "2308": "台達電",
    "2317": "鴻海", "2324": "仁寶", "2327": "國巨", "2330": "台積電",
    "2337": "旺宏", "2344": "華邦電", "2345": "智邦", "2353": "宏碁",
    "2357": "華碩", "2376": "技嘉", "2377": "微星", "2408": "南亞科",
    "2409": "友達", "2412": "中華電", "2426": "鼎元", "2454": "聯發科",
    "2515": "中工", "2610": "華航", "2646": "星宇航空",
    "2882": "國泰金", "2885": "元大金", "2887": "台新新光金", "2891": "中信金",
    "3008": "大立光", "3260": "威剛", "3481": "群創", "3714": "富采",
    "4916": "事欣科", "4967": "十銓", "5007": "三星（台）",
    "5880": "合庫金", "6605": "帝寶", "6770": "力積電",
    "7418": "香繼光", "8046": "南電", "8110": "華東",
    "0050": "元大台灣50", "0053": "元大電子", "0056": "元大高股息",
    "009816": "凱基台灣TOP50", "00403A": "主動統一升級50",
    "00981A": "主動統一台股增長",
}
for k, v in _raw_names.items():
    STOCK_NAMES[_normalize_key(k)] = {"name": v, "market": "TW"}

# 常見美股
_us_stocks = {
    "AAPL": "Apple Inc.", "MSFT": "Microsoft", "GOOGL": "Alphabet Inc.",
    "GOOG": "Alphabet Class C", "AMZN": "Amazon.com", "TSLA": "Tesla Inc.",
    "META": "Meta Platforms", "NVDA": "NVIDIA", "AMD": "AMD",
    "INTC": "Intel", "JPM": "JPMorgan Chase", "V": "Visa",
    "MA": "Mastercard", "TSM": "台積電 ADR", "BABA": "阿里巴巴 ADR",
    "NKE": "Nike", "DIS": "Disney", "BA": "Boeing",
}
for k, v in _us_stocks.items():
    STOCK_NAMES[k] = {"name": v, "market": "US"}

# 常見港股
_hk_stocks = {
    "0700.HK": "騰訊控股", "9988.HK": "阿里巴巴", "0005.HK": "匯豐控股",
    "1299.HK": "友邦保險", "2888.HK": "渣打集團", "0700": "騰訊控股",
    "9988": "阿里巴巴", "0005": "匯豐控股",
}
for k, v in _hk_stocks.items():
    STOCK_NAMES[_normalize_key(k)] = {"name": v, "market": "HK"}

def _fetch_yahoo_chart(symbol: str) -> dict:
    """Fetch price/quote data from Yahoo Finance v8 chart API (reliable, no auth needed)."""
    for ua in [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    ]:
        try:
            s = requests.Session()
            s.headers.update({"User-Agent": ua, "Accept": "application/json"})
            r = s.get(
                f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?range=5d&interval=1d",
                timeout=10,
            )
            if r.status_code != 200:
                continue
            data = r.json()
            result = data.get("chart", {}).get("result", [])
            if not result:
                continue
            meta = result[0].get("meta", {})
            quotes = result[0].get("indicators", {}).get("quote", [{}])[0] if result[0].get("indicators", {}).get("quote") else {}
            closelist = quotes.get("close", [])
            cur_price = meta.get("regularMarketPrice", closelist[-1] if closelist else 0)

            return {
                "symbol": symbol,
                "longName": meta.get("longName", meta.get("shortName", symbol)),
                "shortName": meta.get("shortName", ""),
                "currentPrice": cur_price,
                "regularMarketPrice": cur_price,
                "regularMarketChange": round(cur_price - meta.get("chartPreviousClose", cur_price), 2),
                "regularMarketChangePercent": 0,
                "regularMarketOpen": quotes.get("open", [None])[-1] if quotes.get("open") else 0,
                "regularMarketDayHigh": meta.get("regularMarketDayHigh", quotes.get("high", [None])[-1] if quotes.get("high") else 0),
                "regularMarketDayLow": meta.get("regularMarketDayLow", quotes.get("low", [None])[-1] if quotes.get("low") else 0),
                "regularMarketVolume": meta.get("regularMarketVolume", quotes.get("volume", [None])[-1] if quotes.get("volume") else 0),
                "previousClose": meta.get("chartPreviousClose", 0),
                "marketCap": 0,
                "averageVolume": 0,
                "fiftyTwoWeekHigh": meta.get("fiftyTwoWeekHigh"),
                "fiftyTwoWeekLow": meta.get("fiftyTwoWeekLow"),
                "currency": meta.get("currency", "USD"),
                "exchange": meta.get("fullExchangeName", meta.get("exchangeName", "")),
                "trailingPE": None,
                "forwardPE": None,
                "trailingEps": None,
                "forwardEps": None,
                "dividendYield": None,
                "dividendRate": None,
                "exDividendDate": None,
                "payoutRatio": None,
                "fiveYearAvgDividendYield": None,
                "returnOnEquity": None,
                "returnOnAssets": None,
                "totalRevenue": None,
                "revenuePerShare": None,
                "profitMargins": None,
                "operatingMargins": None,
                "debtToEquity": None,
                "bookValue": None,
                "priceToBook": None,
                "52WeekChange": None,
                "beta": None,
                "sector": "",
                "industry": "",
                "country": "",
                "website": "",
                "longBusinessSummary": "",
                "fullTimeEmployees": None,
                "logo_url": None,
            }
        except Exception:
            continue
    return {}


FUNDAMENTALS_CACHE = {}
FUNDAMENTALS_TTL = 7200  # 2 hours for fundamentals

FINNHUB_API_KEY = os.environ.get("FINNHUB_API_KEY", "")

_TWSE_BWIBBU_CACHE = {"data": None, "time": 0}
_TWSE_BWIBBU_TTL = 3600  # 1 hour cache


def _fetch_twse_bwibbu():
    """Fetch PE ratio, dividend yield, PB ratio for all TWSE stocks."""
    now_val = time.time()
    if now_val - _TWSE_BWIBBU_CACHE["time"] < _TWSE_BWIBBU_TTL and _TWSE_BWIBBU_CACHE["data"]:
        return _TWSE_BWIBBU_CACHE["data"]

    twse_urls = [
        "https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_ALL",
        "https://www.twse.com.tw/exchangeReport/BWIBBU_ALL?response=json",
        "http://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_ALL",
    ]
    for url in twse_urls:
        try:
            r = requests.get(
                url,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
                timeout=15,
            )
            if r.status_code == 200:
                data = r.json()
                if isinstance(data, list) and len(data) > 0:
                    lookup = {}
                    for item in data:
                        code = item.get("Code", "")
                        if code:
                            lookup[code] = {
                                "pe": _safe_float(item.get("PEratio")),
                                "divYield": _safe_float(item.get("DividendYield")),
                                "pb": _safe_float(item.get("PBratio")),
                            }
                    if lookup:
                        _TWSE_BWIBBU_CACHE["data"] = lookup
                        _TWSE_BWIBBU_CACHE["time"] = now_val
                        return lookup
        except Exception:
            continue
    return _TWSE_BWIBBU_CACHE["data"] or {}


def _safe_float(val):
    if val is None:
        return None
    try:
        v = float(str(val).replace(",", ""))
        return None if math.isnan(v) or math.isinf(v) else v
    except (ValueError, TypeError):
        return None


def _fetch_fundamentals(symbol: str, current_price: float = 0) -> dict:
    """Fetch EPS, PE ratio, dividend yield, ROE etc. from Finnhub or TWSE."""
    cache_key = f"fund_{symbol}"
    now_val = time.time()
    if cache_key in FUNDAMENTALS_CACHE and now_val - FUNDAMENTALS_CACHE[cache_key]["time"] < FUNDAMENTALS_TTL:
        return FUNDAMENTALS_CACHE[cache_key]["data"]

    result = {}
    stock_no = symbol.replace(".TW", "").replace(".TWO", "")

    # Method 1: TWSE BWIBBU API for Taiwan stocks
    if symbol.endswith(".TW") or symbol.endswith(".TWO"):
        bwibbu = _fetch_twse_bwibbu()
        entry = bwibbu.get(stock_no, {})
        pe = entry.get("pe")
        dy = entry.get("divYield")
        pb = entry.get("pb")
        if any(v is not None for v in [pe, dy, pb]):
            eps = (current_price / pe) if pe and current_price else None
            book_val = (current_price / pb) if pb and current_price else None
            roe = (pb / pe) if pb and pe else None
            result = {
                "trailingPE": pe,
                "forwardPE": None,
                "trailingEps": eps,
                "forwardEps": None,
                "dividendYield": dy / 100 if dy else None,
                "dividendRate": (eps * dy / 100) if eps and dy else None,
                "exDividendDate": None,
                "payoutRatio": None,
                "fiveYearAvgDividendYield": None,
                "returnOnEquity": roe,
                "returnOnAssets": None,
                "totalRevenue": None,
                "revenuePerShare": None,
                "profitMargins": None,
                "operatingMargins": None,
                "debtToEquity": None,
                "bookValue": book_val,
                "priceToBook": pb,
                "marketCap": None,
                "averageVolume": None,
                "beta": None,
                "fiftyTwoWeekHigh": None,
                "fiftyTwoWeekLow": None,
                "52WeekChange": None,
                "sector": "",
                "industry": "",
                "country": "Taiwan",
                "website": "",
                "longBusinessSummary": "",
                "fullTimeEmployees": None,
                "logo_url": None,
            }

    # Method 2: Finnhub for US/HK stocks
    if (not result or not any(v is not None for v in result.values())) and FINNHUB_API_KEY:
        for sym_try in [symbol, symbol.replace(".TW", "").replace(".TWO", "").replace(".HK", "")]:
            try:
                r = requests.get(
                    f"https://finnhub.io/api/v1/stock/metric?symbol={sym_try}&metric=all&token={FINNHUB_API_KEY}",
                    timeout=10,
                )
                if r.status_code != 200:
                    continue
                m = r.json().get("metric", {})
                if not m:
                    continue

                def fh(key):
                    v = m.get(key)
                    return None if v is None or (isinstance(v, str) and v == "None") else v

                result = {
                    "trailingPE": fh("peBasicExclExtraTTM") or fh("peExclExtraTTM"),
                    "forwardPE": fh("forwardPE"),
                    "trailingEps": fh("epsBasicExclExtraItemsTTM") or fh("epsExclExtraItemsTTM"),
                    "forwardEps": None,
                    "dividendYield": fh("dividendYieldIndicatedAnnual"),
                    "dividendRate": fh("dividendRate"),
                    "exDividendDate": fh("exDividendDate"),
                    "payoutRatio": fh("payoutRatio"),
                    "fiveYearAvgDividendYield": fh("dividendYield5Y"),
                    "returnOnEquity": fh("roeTTM"),
                    "returnOnAssets": fh("roaTTM"),
                    "totalRevenue": None,
                    "revenuePerShare": fh("revenuePerShareTTM"),
                    "profitMargins": fh("netProfitMarginTTM"),
                    "operatingMargins": fh("operatingMarginTTM"),
                    "debtToEquity": fh("totalDebt/totalEquityQuarterly") or fh("totalDebt/totalEquityAnnual"),
                    "bookValue": fh("bookValuePerShareQuarterly") or fh("bookValuePerShareAnnual"),
                    "priceToBook": fh("pbQuarterly") or fh("pbAnnual"),
                    "marketCap": fh("marketCapitalization"),
                    "averageVolume": None,
                    "beta": fh("beta"),
                    "fiftyTwoWeekHigh": fh("52WeekHigh"),
                    "fiftyTwoWeekLow": fh("52WeekLow"),
                    "52WeekChange": fh("52WeekPriceReturnDaily"),
                    "sector": "",
                    "industry": "",
                    "country": "",
                    "website": "",
                    "longBusinessSummary": "",
                    "fullTimeEmployees": None,
                    "logo_url": None,
                }
                break
            except Exception:
                continue

    # Method 3: yfinance as last resort
    if not result or not any(v is not None for v in result.values()):
        try:
            rate_limit()
            ticker = yf.Ticker(symbol)
            info = dict(ticker.info) if ticker.info else {}
            if info.get("symbol"):
                result = {
                    "trailingPE": info.get("trailingPE"),
                    "forwardPE": info.get("forwardPE"),
                    "trailingEps": info.get("trailingEps"),
                    "forwardEps": info.get("forwardEps"),
                    "dividendYield": info.get("dividendYield"),
                    "dividendRate": info.get("dividendRate"),
                    "exDividendDate": info.get("exDividendDate"),
                    "payoutRatio": info.get("payoutRatio"),
                    "fiveYearAvgDividendYield": info.get("fiveYearAvgDividendYield"),
                    "returnOnEquity": info.get("returnOnEquity"),
                    "returnOnAssets": info.get("returnOnAssets"),
                    "totalRevenue": info.get("totalRevenue"),
                    "revenuePerShare": info.get("revenuePerShare"),
                    "profitMargins": info.get("profitMargins"),
                    "operatingMargins": info.get("operatingMargins"),
                    "debtToEquity": info.get("debtToEquity"),
                    "bookValue": info.get("bookValue"),
                    "priceToBook": info.get("priceToBook"),
                    "marketCap": info.get("marketCap"),
                    "averageVolume": info.get("averageVolume"),
                    "beta": info.get("beta"),
                    "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh"),
                    "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow"),
                    "52WeekChange": info.get("52WeekChange"),
                    "sector": info.get("sector", ""),
                    "industry": info.get("industry", ""),
                    "country": info.get("country", ""),
                    "website": info.get("website", ""),
                    "longBusinessSummary": info.get("longBusinessSummary", ""),
                    "fullTimeEmployees": info.get("fullTimeEmployees"),
                    "logo_url": info.get("logo_url"),
                }
        except Exception:
            pass

    has_data = any(v is not None for v in result.values())
    if has_data:
        FUNDAMENTALS_CACHE[cache_key] = {"data": result, "time": now_val}
    return result


def _fetch_twse_quote(symbol: str) -> dict:
    """Fetch real-time quote from Taiwan Stock Exchange for .TW symbols."""
    stock_no = symbol.replace(".TW", "").replace(".TWO", "")
    market = "otc" if ".TWO" in symbol else "tse"

    try:
        s = requests.Session()
        s.headers.update({"User-Agent": "Mozilla/5.0"})
        s.get("http://mis.twse.com.tw/stock/index.jsp", timeout=5)

        url = f"https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch={market}_{stock_no}.tw&json=1&delay=0"
        r = s.get(url, timeout=10)
        if r.status_code != 200:
            return {}

        data = r.json()
        msg = data.get("msgArray", [])
        if not msg:
            return {}

        q = msg[0]
        twse_name = q.get("nf", q.get("n", ""))
        known_name = STOCK_NAMES.get(symbol, {}).get("name", "")
        display_name = twse_name if twse_name and twse_name != symbol else known_name if known_name else symbol

        prev_close = float(q.get("y", 0) or 0)
        current = float(q.get("z", q.get("y", 0)) if q.get("z") and q["z"] != "-" else q.get("y", 0))
        open_p = float(q.get("o", 0) or 0)
        high = float(q.get("h", 0) or 0)
        low = float(q.get("l", 0) or 0)
        volume = int(q.get("v", "0").replace(",", "") or 0)
        change = current - prev_close
        change_pct = (change / prev_close * 100) if prev_close else 0

        return {
            "symbol": symbol,
            "longName": display_name,
            "shortName": q.get("n", known_name),
            "currentPrice": current,
            "regularMarketPrice": current,
            "regularMarketChange": round(change, 2),
            "regularMarketChangePercent": round(change_pct, 2),
            "regularMarketOpen": open_p,
            "regularMarketDayHigh": high,
            "regularMarketDayLow": low,
            "regularMarketVolume": volume,
            "previousClose": prev_close,
            "marketCap": 0,
            "averageVolume": volume,
            "trailingPE": None,
            "forwardPE": None,
            "trailingEps": None,
            "forwardEps": None,
            "dividendYield": None,
            "dividendRate": None,
            "exDividendDate": None,
            "payoutRatio": None,
            "fiveYearAvgDividendYield": None,
            "returnOnEquity": None,
            "returnOnAssets": None,
            "totalRevenue": None,
            "revenuePerShare": None,
            "profitMargins": None,
            "operatingMargins": None,
            "debtToEquity": None,
            "bookValue": None,
            "priceToBook": None,
            "fiftyTwoWeekHigh": high,
            "fiftyTwoWeekLow": low,
            "52WeekChange": None,
            "beta": None,
            "sector": "",
            "industry": "",
            "country": "Taiwan",
            "website": "",
            "longBusinessSummary": "",
            "fullTimeEmployees": None,
            "exchange": "TWSE",
            "currency": "TWD",
            "logo_url": None,
        }
    except Exception:
        return {}


def _get_stock_info(symbol: str) -> dict:
    cache_key = f"info_{symbol}"
    now_val = time.time()
    if cache_key in CACHE and now_val - CACHE[cache_key]["time"] < CACHE_TTL:
        return CACHE[cache_key]["data"]

    rate_limit()

    # Look up known stock name
    known = STOCK_NAMES.get(symbol, {})

    # Method 1: TWSE API for Taiwan stocks (most accurate for TWSE)
    if symbol.endswith(".TW") or symbol.endswith(".TWO"):
        result = _fetch_twse_quote(symbol)
        if result.get("currentPrice", 0) > 0:
            _cache_stock_name(symbol, result.get("longName", ""))
            # Try to get English name from Yahoo for TWSE stocks
            try:
                yf_info = _fetch_yahoo_chart(symbol)
                if yf_info.get("longName") and yf_info["longName"] != symbol:
                    result["_nameEn"] = yf_info["longName"]
            except Exception:
                pass
            cur = result.get("currentPrice", 0)
            fund = _fetch_fundamentals(symbol, current_price=cur)
            result.update({k: v for k, v in fund.items() if v is not None})
            CACHE[cache_key] = {"data": result, "time": now_val}
            return result

    # Method 2: Yahoo Finance v8 chart API (reliable price data)
    result = _fetch_yahoo_chart(symbol)
    if result.get("currentPrice", 0) > 0:
        yahoo_long = result.get("longName", "")  # Save original Yahoo English name
        if known and (not result.get("longName") or result["longName"] == symbol):
            result["longName"] = known["name"]
            result["shortName"] = known["name"]
        result["_nameEn"] = yahoo_long  # Preserve for nameEn field
        _cache_stock_name(symbol, result.get("longName", ""))
        # Merge fundamentals (cached separately, longer TTL)
        cur = result.get("currentPrice", result.get("regularMarketPrice", 0))
        fund = _fetch_fundamentals(symbol, current_price=cur)
        result.update({k: v for k, v in fund.items() if v is not None})
        CACHE[cache_key] = {"data": result, "time": now_val}
        return result

    # Method 3: yfinance download for price fallback
    try:
        d = yf.download(symbol, period="5d", progress=False)
        if d is not None and not d.empty:
            result = {"symbol": symbol, "regularMarketPrice": float(d["Close"].iloc[-1])}
            CACHE[cache_key] = {"data": result, "time": now_val}
            return result
    except Exception:
        pass

    # Method 5: yfinance Ticker.info as last resort
    try:
        ticker = yf.Ticker(symbol)
        info = dict(ticker.info) if ticker.info else {}
        if info.get("symbol"):
            CACHE[cache_key] = {"data": info, "time": now_val}
            return info
    except Exception:
        pass

    return {}


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


def _cache_stock_name(symbol: str, name: str):
    """Auto-populate STOCK_NAMES from API responses."""
    if symbol and name and name != symbol and symbol not in STOCK_NAMES:
        market = "TW" if symbol.endswith(".TW") else "HK" if symbol.endswith(".HK") else "US"
        STOCK_NAMES[symbol] = {"name": name, "market": market}


def rate_limit():
    global _LAST_REQUEST_TIME
    now = time.time()
    elapsed = now - _LAST_REQUEST_TIME
    if elapsed < 1.5:
        time.sleep(1.5 - elapsed)
    _LAST_REQUEST_TIME = time.time()


@app.get("/api/search")
async def search_stocks(query: str = Query(..., min_length=1)):
    seen = set()
    results = []
    q = query.lower()

    # Source 1: Yahoo Finance search API (covers all global stocks)
    rate_limit()
    try:
        s = requests.Session()
        s.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
        r = s.get(
            f"https://query1.finance.yahoo.com/v1/finance/search?q={urllib.parse.quote(query)}&quotesCount=10&newsCount=0",
            timeout=8,
        )
        if r.status_code == 200:
            for quote in r.json().get("quotes", []):
                sym = quote.get("symbol", "")
                name = quote.get("longname", quote.get("shortname", ""))
                exch = quote.get("exchange", "")
                if sym and name and sym not in seen:
                    seen.add(sym)
                    results.append({"symbol": sym, "name": name, "exchange": exch})
    except Exception:
        pass

    # Source 2: STOCK_NAMES dictionary (supplement with Chinese names / known names)
    for result in results:
        sym = result["symbol"]
        if sym in STOCK_NAMES:
            result["nameCn"] = STOCK_NAMES[sym]["name"]

    for sym, info in STOCK_NAMES.items():
        name = info["name"]
        if sym not in seen and (q in sym.lower() or q in name.lower()):
            seen.add(sym)
            results.append({"symbol": sym, "name": name, "exchange": _detect_exchange(sym), "nameCn": name})

    # Source 3: Try direct Ticker lookup (for numeric TW stock codes)
    if not results or len(results) < 5:
        try:
            info = _get_stock_info(query)
            if info and info.get("symbol") and info.get("symbol") not in seen:
                sym = info["symbol"]
                name = info.get("longName", info.get("shortName", sym))
                results.insert(0, {"symbol": sym, "name": name, "exchange": _detect_exchange(sym)})
        except Exception:
            pass

    return results[:15]


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

    known_entry = STOCK_NAMES.get(symbol, {})
    name_en_raw = info.get("_nameEn") or info.get("longName")
    result = {
        "symbol": symbol,
        "name": safe(known_entry.get("name") if known_entry else info.get("longName"), safe(info.get("shortName"), symbol)),
        "nameCn": safe(known_entry.get("name")),
        "nameEn": safe(name_en_raw, safe(info.get("shortName"), symbol)),
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


@app.get("/api/debug/{symbol}")
async def debug_stock(symbol: str):
    """Debug endpoint showing raw data from all sources."""
    raw = _get_stock_info(symbol)
    fund = _fetch_fundamentals(symbol, current_price=raw.get("currentPrice", 0))
    return {
        "symbol": symbol,
        "raw_info_keys": list(raw.keys()),
        "raw_fundamentals": {k: v for k, v in fund.items() if v is not None},
        "stock_response": raw,
    }


def _fetch_yahoo_chart_data(symbol: str, period: str = "1y", interval: str = "1d") -> list:
    """Fetch chart data from Yahoo Finance v8 chart API."""
    range_map = {"1d": "1d", "5d": "5d", "1mo": "1mo", "3mo": "3mo", "6mo": "6mo", "1y": "1y", "2y": "2y", "5y": "5y", "10y": "10y", "ytd": "ytd", "max": "max"}
    interval_map = {"1m": "1m", "2m": "2m", "5m": "5m", "15m": "15m", "30m": "30m", "60m": "60m", "1d": "1d", "5d": "5d", "1wk": "1wk", "1mo": "1mo"}
    r = range_map.get(period, "1y")
    i = interval_map.get(interval, "1d")

    try:
        s = requests.Session()
        s.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?range={r}&interval={i}"
        resp = s.get(url, timeout=15)
        if resp.status_code != 200:
            return []

        data = resp.json()
        result = data.get("chart", {}).get("result", [])
        if not result:
            return []

        timestamps = result[0].get("timestamp", [])
        quotes = result[0].get("indicators", {}).get("quote", [{}])[0] if result[0].get("indicators", {}).get("quote") else {}
        opens = quotes.get("open", [])
        highs = quotes.get("high", [])
        lows = quotes.get("low", [])
        closes = quotes.get("close", [])
        volumes = quotes.get("volume", [])

        chart_data = []
        for i in range(len(timestamps)):
            dt = datetime.fromtimestamp(timestamps[i], tz=timezone.utc)
            chart_data.append({
                "date": dt.strftime("%Y-%m-%d %H:%M"),
                "open": round(float(opens[i]), 2) if i < len(opens) and opens[i] is not None else 0,
                "high": round(float(highs[i]), 2) if i < len(highs) and highs[i] is not None else 0,
                "low": round(float(lows[i]), 2) if i < len(lows) and lows[i] is not None else 0,
                "close": round(float(closes[i]), 2) if i < len(closes) and closes[i] is not None else 0,
                "volume": int(volumes[i]) if i < len(volumes) and volumes[i] is not None else 0,
            })
        return chart_data
    except Exception:
        return []


@app.get("/api/stock/{symbol}/chart")
async def get_chart(
    symbol: str,
    period: str = Query("1y", description="1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max"),
    interval: str = Query("1d", description="1m,2m,5m,15m,30m,60m,1d,5d,1wk,1mo"),
):
    data = _fetch_yahoo_chart_data(symbol, period, interval)
    if not data:
        rate_limit()
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period, interval=interval)
            for index, row in hist.iterrows():
                data.append({
                    "date": index.strftime("%Y-%m-%d %H:%M") if isinstance(index, datetime) else str(index),
                    "open": round(float(row["Open"]), 2),
                    "high": round(float(row["High"]), 2),
                    "low": round(float(row["Low"]), 2),
                    "close": round(float(row["Close"]), 2),
                    "volume": int(row["Volume"]),
                })
        except Exception:
            pass
    return {"symbol": symbol, "period": period, "interval": interval, "data": data}


@app.get("/api/stock/{symbol}/dividends")
async def get_dividends(symbol: str):
    div_data = []
    split_data = []
    rate_limit()
    try:
        ticker = yf.Ticker(symbol)
        dividends = ticker.dividends
        splits = ticker.splits
        if dividends is not None and not dividends.empty:
            for index, value in dividends.items():
                dt = index if isinstance(index, datetime) else datetime.fromtimestamp(index.timestamp()) if hasattr(index, 'timestamp') else index
                div_data.append({
                    "date": dt.strftime("%Y-%m-%d") if hasattr(dt, 'strftime') else str(dt),
                    "amount": round(float(value), 4),
                })
        if splits is not None and not splits.empty:
            for index, value in splits.items():
                split_data.append({
                    "date": index.strftime("%Y-%m-%d"),
                    "ratio": round(float(value), 4),
                })
    except Exception:
        pass
    return {"symbol": symbol, "dividends": div_data, "splits": split_data}


@app.get("/api/stock/{symbol}/financials")
async def get_financials(symbol: str):
    result = {}
    rate_limit()
    try:
        ticker = yf.Ticker(symbol)
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
    except Exception:
        pass
    return {"symbol": symbol, **result}


@app.get("/api/stock/{symbol}/holders")
async def get_holders(symbol: str):
    major_data = {}
    inst_data = []
    rate_limit()
    try:
        ticker = yf.Ticker(symbol)
        major = ticker.major_holders
        institutional = ticker.institutional_holders
        if major is not None and not major.empty:
            for index, row in major.iterrows():
                major_data[str(index)] = [str(v) for v in row.values]
        if institutional is not None and not institutional.empty:
            for _, row in institutional.iterrows():
                inst_data.append({str(k): str(v) for k, v in row.items()})
    except Exception:
        pass
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
