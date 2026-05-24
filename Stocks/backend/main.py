import os
import sys
import json
import tempfile
import urllib.parse
# Must set TZPATH before yfinance import to avoid os.stat(None) on Python 3.14
_tz_cache = tempfile.mkdtemp(prefix="yf_tz_")
os.environ["TZPATH"] = _tz_cache

import json
import math
import socket
import time
from datetime import datetime, timezone, timedelta
from typing import Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

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

STOCK_SECTORS = {
    # sector mapping for Taiwan stocks
    "2330.TW": {"sector": "半導體", "industry": "晶圓代工"},
    "2454.TW": {"sector": "半導體", "industry": "IC 設計"},
    "2303.TW": {"sector": "半導體", "industry": "晶圓代工"},
    "3711.TW": {"sector": "半導體", "industry": "封測"},
    "2344.TW": {"sector": "半導體", "industry": "記憶體製造"},
    "2408.TW": {"sector": "半導體", "industry": "記憶體製造"},
    "5347.TW": {"sector": "半導體", "industry": "晶圓代工"},
    "3443.TW": {"sector": "半導體", "industry": "IC 設計"},
    "3661.TW": {"sector": "半導體", "industry": "IC 設計"},
    "5274.TW": {"sector": "半導體", "industry": "IC 設計"},
    "3037.TW": {"sector": "半導體", "industry": "PCB"},
    "8046.TW": {"sector": "半導體", "industry": "PCB"},
    "3374.TW": {"sector": "半導體", "industry": "封測"},
    "2449.TW": {"sector": "半導體", "industry": "封測"},
    "3583.TW": {"sector": "半導體", "industry": "設備"},
    "2337.TW": {"sector": "半導體", "industry": "記憶體製造"},
    "2317.TW": {"sector": "電子代工", "industry": "組裝"},
    "2308.TW": {"sector": "電子零組件", "industry": "電源供應"},
    "2327.TW": {"sector": "電子零組件", "industry": "被動元件"},
    "2353.TW": {"sector": "電腦硬體", "industry": "PC 製造"},
    "2357.TW": {"sector": "電腦硬體", "industry": "PC 製造"},
    "2376.TW": {"sector": "電腦硬體", "industry": "板卡"},
    "2377.TW": {"sector": "電腦硬體", "industry": "板卡"},
    "2324.TW": {"sector": "電子代工", "industry": "組裝"},
    "3008.TW": {"sector": "光電", "industry": "光學鏡頭"},
    "2409.TW": {"sector": "光電", "industry": "面板"},
    "3481.TW": {"sector": "光電", "industry": "面板"},
    "6116.TW": {"sector": "光電", "industry": "面板"},
    "8069.TW": {"sector": "光電", "industry": "電子紙"},
    "2345.TW": {"sector": "通訊", "industry": "網通設備"},
    "3596.TW": {"sector": "通訊", "industry": "網通設備"},
    "5388.TW": {"sector": "通訊", "industry": "網通設備"},
    "2412.TW": {"sector": "電信", "industry": "電信服務"},
    "3045.TW": {"sector": "電信", "industry": "電信服務"},
    "4904.TW": {"sector": "電信", "industry": "電信服務"},
    "2881.TW": {"sector": "金融", "industry": "金控"},
    "2882.TW": {"sector": "金融", "industry": "金控"},
    "2885.TW": {"sector": "金融", "industry": "金控"},
    "2886.TW": {"sector": "金融", "industry": "金控"},
    "2891.TW": {"sector": "金融", "industry": "金控"},
    "2884.TW": {"sector": "金融", "industry": "金控"},
    "5880.TW": {"sector": "金融", "industry": "金控"},
    "2888.TW": {"sector": "金融", "industry": "金控"},
    "2002.TW": {"sector": "鋼鐵", "industry": "鋼鐵"},
    "1301.TW": {"sector": "塑膠", "industry": "塑膠"},
    "1303.TW": {"sector": "塑膠", "industry": "塑膠"},
    "1326.TW": {"sector": "塑膠", "industry": "塑膠"},
    "1216.TW": {"sector": "食品", "industry": "食品"},
    "2912.TW": {"sector": "零售", "industry": "超商"},
    "6505.TW": {"sector": "油電", "industry": "石化"},
    "2610.TW": {"sector": "航運", "industry": "航空"},
    "2646.TW": {"sector": "航運", "industry": "航空"},
    "2723.TW": {"sector": "觀光餐飲", "industry": "餐飲"},
    "2727.TW": {"sector": "觀光餐飲", "industry": "餐飲"},
    "2753.TW": {"sector": "觀光餐飲", "industry": "餐飲"},
    "1268.TW": {"sector": "觀光餐飲", "industry": "餐飲"},
    "2618.TW": {"sector": "航運", "industry": "航空"},
    "2603.TW": {"sector": "航運", "industry": "貨櫃"},
    "2609.TW": {"sector": "航運", "industry": "貨櫃"},
}

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

STOCK_MONEY = {
    "台塑": "年配息",
    "中鋼": "年配息",
    "聯電": "年配息",
    "台達電": "年配息",
    "鴻海": "年配息",
    "仁寶": "年配息",
    "國巨": "不定期配息",
    "台積電":"季配息",
    "旺宏": "年配息",
    "華邦電": "不定期配息",
    "智邦": "年配息",
    "宏碁": "年配息",
    "華碩": "年配息",
    "技嘉": "年配息",
    "微星": "年配息",
    "南亞科": "年配息",
    "友達": "不定期配息",
    "中華電": "年配息",
    "鼎元": "不定期配息",
    "聯發科": "不定期配息",
    "中工": "年配息",
    "華航": "年配息",
    "星宇航空": "不配息配股",
    "國泰金": "年配息",
    "元大金": "年配息",
    "台新新光金": "年配息",
    "中信金": "年配息",
    "大立光": "半年配息",
    "威剛": "不配息配股",
    "群創": "不定期配息",
    "富采": "年配息",
    "事欣科": "年配息",
    "十銓": "年配息",
    "三星(台)": "年配息",
    "合庫金": "年配息",
    "帝寶": "年配息",
    "力機電": "不定期配息",
    "香繼光": "未知",
    "南電": "年配息",
    "華東": "年配息",
    "元大50": "半年配息",
    "元大電子": "年配息",
    "元大高股息": "季配息",
    "凱基TOP50": "不配息配股",
    "主動統一升級50": "季配息",
    "主動統一台股增長": "年配息"
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
            cur_price = meta.get("regularMarketPrice")
            if cur_price is None and closelist:
                cur_price = closelist[-1]
            if cur_price is None:
                cur_price = 0

            return {
                "symbol": symbol,
                "longName": meta.get("longName", meta.get("shortName", symbol)),
                "shortName": meta.get("shortName", ""),
                "currentPrice": cur_price,
                "regularMarketPrice": cur_price,
                "regularMarketChange": round(cur_price - meta.get("chartPreviousClose", cur_price), 2),
                "regularMarketChangePercent": round((cur_price - meta.get("chartPreviousClose", cur_price)) / meta.get("chartPreviousClose", cur_price) * 100, 2) if meta.get("chartPreviousClose", cur_price) else 0,
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

STOCK_MEETING_URLS = {
    "2330.TW": "https://investor.tsmc.com/chinese/quarterly-results/2026/q1",
    "2409.TW": "https://www.auo.com/zh-TW/investor_conference/index",
    "2515.TW": "https://www.bes.com.tw/ir-conference.php#gsc.tab=0",
    "2412.TW": "https://www.cht.com.tw/zh-tw/home/cht/investors/shareholder-services/ir-calendar",
}

FUNDAMENTALS_CACHE = {}
FUNDAMENTALS_TTL = 7200  # 2 hours for fundamentals

FINNHUB_API_KEY = os.environ.get("FINNHUB_API_KEY", "")

_TWSE_BWIBBU_CACHE = {"data": None, "time": 0}
_TWSE_BWIBBU_TTL = 3600  # 1 hour cache


def _load_bwibbu_fallback():
    """Load BWIBBU data from local fallback file."""
    try:
        fp = os.path.join(os.path.dirname(__file__), "bwibbu_fallback.json")
        with open(fp, "r", encoding="utf-8") as f:
            data = json.load(f)
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
            return lookup
    except Exception:
        pass
    return {}


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
    # Fallback: load local snapshot
    fallback = _load_bwibbu_fallback()
    if fallback:
        _TWSE_BWIBBU_CACHE["data"] = fallback
        _TWSE_BWIBBU_CACHE["time"] = now_val
    return fallback


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

    # Method 2: Finnhub to supplement fundamentals (fills BWIBBU gaps for Taiwan stocks)
    finnhub_result = {}
    if FINNHUB_API_KEY:
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

                finnhub_result = {
                    "trailingPE": fh("peBasicExclExtraTTM") or fh("peExclExtraTTM"),
                    "forwardPE": fh("forwardPE"),
                    "trailingEps": fh("epsBasicExclExtraItemsTTM") or fh("epsExclExtraItemsTTM"),
                    "forwardEps": None,
                    "dividendYield": fh("dividendYieldIndicatedAnnual") or fh("currentDividendYieldTTM"),
                    "dividendRate": fh("dividendIndicatedAnnual") or fh("dividendPerShareTTM"),
                    "exDividendDate": None,
                    "payoutRatio": fh("payoutRatioTTM") or fh("payoutRatioAnnual"),
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
    if finnhub_result:
        if not result or not any(v is not None for v in result.values()):
            result = finnhub_result
        else:
            for k, v in finnhub_result.items():
                if v is not None and result.get(k) is None:
                    result[k] = v

    # Method 3: yfinance as last resort
    needs_yf = not result or not any(v is not None for v in result.values())
    if not needs_yf and (symbol.endswith(".TW") or symbol.endswith(".TWO")):
        needs_yf = any(result.get(k) is None for k in ["beta", "marketCap", "forwardPE", "fiftyTwoWeekHigh", "fiftyTwoWeekLow", "52WeekChange"])
    if needs_yf:
        _yf_data = None

        for _qs in ["query1", "query2"]:
            for ua in [
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            ]:
                try:
                    rate_limit()
                    _url = f"https://{_qs}.finance.yahoo.com/v10/finance/quoteSummary/{urllib.parse.quote(symbol)}?modules=price,summaryDetail,defaultKeyStatistics,financialData,incomeStatementHistory"
                    _rsp = requests.get(_url, headers={"User-Agent": ua, "Accept": "application/json"}, timeout=8)
                    if _rsp.status_code != 200:
                        continue
                    _q = _rsp.json().get("quoteSummary", {}).get("result", [{}])[0]
                    if not _q:
                        continue
                    _sd = {k: v.get("raw") if isinstance(v, dict) else v for k, v in (_q.get("summaryDetail", {})).items()}
                    _ks = {k: v.get("raw") if isinstance(v, dict) else v for k, v in (_q.get("defaultKeyStatistics", {})).items()}
                    _fd = {k: v.get("raw") if isinstance(v, dict) else v for k, v in (_q.get("financialData", {})).items()}
                    _yf_data = {
                        "trailingPE": _sd.get("trailingPE"),
                        "forwardPE": _sd.get("forwardPE"),
                        "trailingEps": _ks.get("trailingEps"),
                        "forwardEps": _ks.get("forwardEps"),
                        "dividendYield": _sd.get("dividendYield"),
                        "dividendRate": _sd.get("dividendRate"),
                        "exDividendDate": _sd.get("exDividendDate"),
                        "payoutRatio": _sd.get("payoutRatio"),
                        "fiveYearAvgDividendYield": _sd.get("fiveYearAvgDividendYield"),
                        "returnOnEquity": _fd.get("returnOnEquity"),
                        "returnOnAssets": _fd.get("returnOnAssets"),
                        "totalRevenue": _fd.get("totalRevenue"),
                        "revenuePerShare": _fd.get("revenuePerShare"),
                        "profitMargins": _fd.get("profitMargins"),
                        "operatingMargins": _fd.get("operatingMargins"),
                        "debtToEquity": _fd.get("debtToEquity"),
                        "bookValue": _ks.get("bookValue"),
                        "priceToBook": _ks.get("priceToBook"),
                        "marketCap": _sd.get("marketCap"),
                        "averageVolume": _sd.get("averageVolume"),
                        "beta": _sd.get("beta"),
                        "fiftyTwoWeekHigh": _sd.get("fiftyTwoWeekHigh"),
                        "fiftyTwoWeekLow": _sd.get("fiftyTwoWeekLow"),
                        "52WeekChange": _ks.get("52WeekChange"),
                        "sector": _fd.get("sector", ""),
                        "industry": _fd.get("industry", ""),
                        "country": _ks.get("country", ""),
                        "website": _ks.get("website", ""),
                        "longBusinessSummary": _ks.get("longBusinessSummary", ""),
                        "fullTimeEmployees": _ks.get("fullTimeEmployees"),
                        "logo_url": _ks.get("logoUrl", ""),
                    }
                    break
                except Exception:
                    continue
            if _yf_data and any(v is not None for v in _yf_data.values()):
                break

        if _yf_data is None or not any(v is not None for v in _yf_data.values()):
            try:
                rate_limit()
                _old_to = socket.getdefaulttimeout()
                socket.setdefaulttimeout(15)
                try:
                    _t = yf.Ticker(symbol)
                    _info = dict(_t.info) if _t.info else {}
                finally:
                    socket.setdefaulttimeout(_old_to)
                if _info and any(v is not None for v in _info.values()):
                    _yf_data = {
                        "trailingPE": _info.get("trailingPE"),
                        "forwardPE": _info.get("forwardPE"),
                        "trailingEps": _info.get("trailingEps"),
                        "forwardEps": _info.get("forwardEps"),
                        "dividendYield": _info.get("dividendYield"),
                        "dividendRate": _info.get("dividendRate"),
                        "exDividendDate": _info.get("exDividendDate"),
                        "payoutRatio": _info.get("payoutRatio"),
                        "fiveYearAvgDividendYield": _info.get("fiveYearAvgDividendYield"),
                        "returnOnEquity": _info.get("returnOnEquity"),
                        "returnOnAssets": _info.get("returnOnAssets"),
                        "totalRevenue": _info.get("totalRevenue"),
                        "revenuePerShare": _info.get("revenuePerShare"),
                        "profitMargins": _info.get("profitMargins"),
                        "operatingMargins": _info.get("operatingMargins"),
                        "debtToEquity": _info.get("debtToEquity"),
                        "bookValue": _info.get("bookValue"),
                        "priceToBook": _info.get("priceToBook"),
                        "marketCap": _info.get("marketCap"),
                        "averageVolume": _info.get("averageVolume"),
                        "beta": _info.get("beta"),
                        "fiftyTwoWeekHigh": _info.get("fiftyTwoWeekHigh"),
                        "fiftyTwoWeekLow": _info.get("fiftyTwoWeekLow"),
                        "52WeekChange": _info.get("52WeekChange"),
                        "sector": _info.get("sector", ""),
                        "industry": _info.get("industry", ""),
                        "country": _info.get("country", ""),
                        "website": _info.get("website", ""),
                        "longBusinessSummary": _info.get("longBusinessSummary", ""),
                        "fullTimeEmployees": _info.get("fullTimeEmployees"),
                        "logo_url": _info.get("logo_url"),
                    }
            except Exception:
                pass

        if _yf_data and any(v is not None for v in _yf_data.values()):
            if result and any(v is not None for v in result.values()):
                for k, v in _yf_data.items():
                    if v is not None and result.get(k) is None:
                        result[k] = v
            else:
                result = _yf_data

        if result and any(result.get(k) is None for k in ["totalRevenue", "operatingMargins", "debtToEquity"]):
            _old_to = socket.getdefaulttimeout()
            socket.setdefaulttimeout(20)
            try:
                rate_limit()
                _t = yf.Ticker(symbol)
                _is = _t.income_stmt
                if _is is not None and not _is.empty:
                    _total_rev = None
                    _operating_income = None
                    _net_income = None
                    for _idx in _is.index:
                        _label = str(_idx).lower()
                        _vals = []
                        for _c in _is.columns:
                            _v = _is.loc[_idx, _c]
                            if _v is not None and _v == _v:
                                try:
                                    _vals.append(float(_v))
                                except (ValueError, TypeError):
                                    pass
                        if not _vals:
                            continue
                        if "total revenue" in _label and result.get("totalRevenue") is None:
                            _total_rev = _vals[0]
                            result["totalRevenue"] = _total_rev
                        elif "operating income" in _label and result.get("operatingMargins") is None:
                            _operating_income = _vals[0]
                        elif "net income" in _label and not any(x in _label for x in ["diluted", "excluding", "discontinued", "minority", "non-controlling", "noncontrolling"]):
                            _net_income = _vals[0]
                    if _operating_income is not None and result.get("totalRevenue") and result["totalRevenue"] != 0:
                        result["operatingMargins"] = round(_operating_income / result["totalRevenue"], 4)

                    _teps = result.get("trailingEps")
                    if result.get("marketCap") is None and _net_income is not None and _teps and _teps != 0 and current_price:
                        _shares_out = _net_income / _teps
                        result["marketCap"] = current_price * _shares_out

                    if result.get("totalRevenue") is not None and current_price and result.get("revenuePerShare") is None:
                        if result.get("marketCap") and result["marketCap"] > 0:
                            result["revenuePerShare"] = result["totalRevenue"] / (result["marketCap"] / current_price)
                        elif _net_income is not None and _teps and _teps != 0 and _net_income != 0:
                            result["revenuePerShare"] = result["totalRevenue"] * _teps / _net_income
                    
                    if result.get("profitMargins") is None:
                        if _net_income is not None and result.get("totalRevenue") and result["totalRevenue"] != 0:
                            result["profitMargins"] = round(_net_income / result["totalRevenue"], 4)
                        elif _teps and result.get("revenuePerShare") and result["revenuePerShare"] != 0:
                            result["profitMargins"] = _teps / result["revenuePerShare"]

                _bs = _t.balance_sheet
                if _bs is not None and not _bs.empty and result.get("debtToEquity") is None:
                    _total_debt = None
                    _total_equity = None
                    for _idx in _bs.index:
                        _label = str(_idx).lower()
                        _vals = []
                        for _c in _bs.columns:
                            _v = _bs.loc[_idx, _c]
                            if _v is not None and _v == _v:
                                try:
                                    _vals.append(float(_v))
                                except (ValueError, TypeError):
                                    pass
                        if not _vals:
                            continue
                        if "total debt" in _label:
                            _total_debt = _vals[0]
                        elif "total stockholder equity" in _label or "total equity" in _label:
                            _total_equity = _vals[0]
                    if _total_debt is not None and _total_equity is not None and _total_equity != 0:
                        result["debtToEquity"] = round(_total_debt / _total_equity, 4)

                if result.get("revenuePerShare") is None and result.get("totalRevenue") is not None:
                    try:
                        _shares_series = _t.get_shares_full()
                        if _shares_series is not None and not _shares_series.empty:
                            _shares_out = float(_shares_series.iloc[-1])
                            if _shares_out > 0:
                                result["revenuePerShare"] = result["totalRevenue"] / _shares_out
                    except Exception:
                        pass

                try:
                    _divs = _t.dividends
                    if _divs is not None and not _divs.empty:
                        _last_ex = _divs.index[-1]
                        if hasattr(_last_ex, 'timestamp'):
                            result["exDividendDate"] = _last_ex.timestamp()
                        elif hasattr(_last_ex, 'strftime'):
                            result["exDividendDate"] = _last_ex.strftime("%Y-%m-%dT%H:%M:%S.000Z")
                except Exception:
                    pass

            except Exception:
                pass
            finally:
                socket.setdefaulttimeout(_old_to)

        # Direct Yahoo API fallback for income statement (bypasses yfinance)
        if result and any(result.get(k) is None for k in ["totalRevenue", "operatingMargins", "profitMargins"]):
            _old_to2 = socket.getdefaulttimeout()
            socket.setdefaulttimeout(15)
            try:
                _is_urls = [
                    f"https://query1.finance.yahoo.com/v10/finance/quoteSummary/{urllib.parse.quote(symbol)}?modules=incomeStatementHistory",
                    f"https://query2.finance.yahoo.com/v10/finance/quoteSummary/{urllib.parse.quote(symbol)}?modules=incomeStatementHistory",
                    f"https://query1.finance.yahoo.com/v10/finance/quoteSummary/{urllib.parse.quote(symbol)}?modules=incomeStatementHistory&formatted=true",
                ]
                for _ua in ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "Mozilla/5.0 (compatible; YahooFinance/1.0)"]:
                    for _is_url in _is_urls:
                        try:
                            rate_limit()
                            _is_rsp = requests.get(_is_url, headers={"User-Agent": _ua}, timeout=10)
                            if _is_rsp.status_code != 200:
                                continue
                            _is_json = _is_rsp.json()
                            _is_result = _is_json.get("quoteSummary", {}).get("result", [])
                            if not _is_result:
                                continue
                            _ish = _is_result[0].get("incomeStatementHistory", {})
                            _quarters = _ish.get("incomeStatementHistory", [])
                            if not _quarters:
                                continue
                            _latest = _quarters[0]
                            def _qval(key):
                                v = _latest.get(key, {})
                                if isinstance(v, dict):
                                    return v.get("raw")
                                return v
                            _total_rev = _qval("totalRevenue")
                            _net_inc = _qval("netIncome")
                            _op_inc = _qval("operatingIncome")
                            if _total_rev and result.get("totalRevenue") is None:
                                result["totalRevenue"] = float(_total_rev)
                            if _net_inc and result.get("profitMargins") is None and _total_rev and float(_total_rev) != 0:
                                result["profitMargins"] = round(float(_net_inc) / float(_total_rev), 4)
                            if _op_inc and _total_rev and result.get("operatingMargins") is None and float(_total_rev) != 0:
                                result["operatingMargins"] = round(float(_op_inc) / float(_total_rev), 4)
                            if _total_rev and result.get("totalRevenue"):
                                if result.get("revenuePerShare") is None and current_price:
                                    mc = result.get("marketCap")
                                    if mc and mc > 0:
                                        result["revenuePerShare"] = float(_total_rev) / (mc / current_price)
                                if result.get("debtToEquity") is None:
                                    _bs_url = _is_url.replace("incomeStatementHistory", "balanceSheetHistory")
                                    _bs_rsp = requests.get(_bs_url, headers={"User-Agent": _ua}, timeout=10)
                                    if _bs_rsp.status_code == 200:
                                        _bs_json = _bs_rsp.json()
                                        _bs_result = _bs_json.get("quoteSummary", {}).get("result", [])
                                        if _bs_result:
                                            _bsh = _bs_result[0].get("balanceSheetHistory", {}).get("balanceSheetStatements", [])
                                            if _bsh:
                                                _bl = _bsh[0]
                                                def _bval(key):
                                                    v = _bl.get(key, {})
                                                    return float(v["raw"]) if isinstance(v, dict) and v.get("raw") else None
                                                _td = _bval("totalDebt")
                                                _te = _bval("totalStockholderEquity")
                                                if _td is not None and _te and _te != 0:
                                                    result["debtToEquity"] = round(_td / _te, 4)
                            if result.get("totalRevenue"):
                                break
                        except Exception:
                            continue
                    if result.get("totalRevenue"):
                        break
            except Exception:
                pass
            finally:
                socket.setdefaulttimeout(_old_to2)

        # Yahoo timeseries API fallback (different endpoint, works for some stocks)
        if result and any(result.get(k) is None for k in ["totalRevenue", "profitMargins", "operatingMargins"]):
            _old_to3 = socket.getdefaulttimeout()
            socket.setdefaulttimeout(15)
            try:
                _ts_types = "annualTotalRevenue,annualOperatingIncome,annualNetIncome"
                for _ts_host in ["query1.finance.yahoo.com", "query2.finance.yahoo.com"]:
                    _ts_url = f"https://{_ts_host}/ws/fundamentals-timeseries/v1/finance/timeseries/{urllib.parse.quote(symbol)}?symbol={urllib.parse.quote(symbol)}&lang=en-US&region=US&type={_ts_types}"
                    try:
                        rate_limit()
                        _ts_rsp = requests.get(_ts_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
                        if _ts_rsp.status_code != 200:
                            continue
                        _ts_json = _ts_rsp.json()
                        _ts_result = _ts_json.get("timeseries", {}).get("result", [])
                        if not _ts_result:
                            continue
                        _ts_map = {}
                        for _r in _ts_result:
                            _t = _r.get("type", "")
                            _ts_data = _r.get(_t, {})
                            if isinstance(_ts_data, list) and _ts_data:
                                for _entry in _ts_data:
                                    if isinstance(_entry, dict) and "reportedValue" in _entry:
                                        _rv = _entry["reportedValue"]
                        if isinstance(_rv, dict):
                            _rv = _rv.get("raw", _rv)
                        _ts_map[_t] = _rv
                                        break
                        _ts_rev = _ts_map.get("annualTotalRevenue")
                        _ts_ni = _ts_map.get("annualNetIncome")
                        _ts_oi = _ts_map.get("annualOperatingIncome")
                        if _ts_rev and result.get("totalRevenue") is None:
                            result["totalRevenue"] = float(_ts_rev)
                        if _ts_ni and _ts_rev and result.get("profitMargins") is None and float(_ts_rev) != 0:
                            result["profitMargins"] = round(float(_ts_ni) / float(_ts_rev), 4)
                        if _ts_oi and _ts_rev and result.get("operatingMargins") is None and float(_ts_rev) != 0:
                            result["operatingMargins"] = round(float(_ts_oi) / float(_ts_rev), 4)
                        if _ts_rev and result.get("totalRevenue"):
                            if result.get("revenuePerShare") is None and current_price:
                                mc = result.get("marketCap")
                                if mc and mc > 0:
                                    result["revenuePerShare"] = float(_ts_rev) / (mc / current_price)
                            break
                    except Exception:
                        continue
            except Exception:
                pass
            finally:
                socket.setdefaulttimeout(_old_to3)

        # TWSE open data fallback for Taiwan stocks (income statement & financial ratios)
        if (symbol.endswith(".TW") or symbol.endswith(".TWO")) and result and any(
            result.get(k) is None for k in ["totalRevenue", "profitMargins", "operatingMargins"]
        ):
            try:
                for _tw_url in [
                    f"https://openapi.twse.com.tw/v1/opendata/t187ap04_L",
                    f"https://www.twse.com.tw/opendata/t187ap04_L",
                    f"https://openapi.twse.com.tw/v1/opendata/t187ap04_P",
                    f"https://openapi.twse.com.tw/v1/opendata/t187ap04_R",
                ]:
                    try:
                        _tw_rsp = requests.get(_tw_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
                        if _tw_rsp.status_code != 200:
                            continue
                        _tw_data = _tw_rsp.json()
                        if not isinstance(_tw_data, list):
                            continue

                        # Build a set of candidate field names to search
                        _rev_keys = ["營業收入合計", "營業收入", "營業收入淨額", "收益", "收入"]
                        _ni_keys = ["本期淨利", "繼續營業單位淨利", "本期淨利（淨損）", "稅後淨利", "本期損益", "淨利"]
                        _oi_keys = ["營業利益", "營業損益", "營業淨利"]

                        def _find_first(row, keys):
                            for k in keys:
                                v = row.get(k)
                                if v is not None and v != "":
                                    return v
                            # case-insensitive fallback
                            for rk in row:
                                for k in keys:
                                    if rk.lower().replace(" ", "") == k.lower().replace(" ", ""):
                                        return row[rk]
                            return None

                        for _row in _tw_data:
                            if str(_row.get("公司代號", "")) == stock_no:
                                _rev = _safe_float(_find_first(_row, _rev_keys))
                                _ni = _safe_float(_find_first(_row, _ni_keys))
                                _oi = _safe_float(_find_first(_row, _oi_keys))
                                if _rev and result.get("totalRevenue") is None:
                                    result["totalRevenue"] = _rev
                                if _ni and _rev and result.get("profitMargins") is None and _rev != 0:
                                    result["profitMargins"] = round(_ni / _rev, 4)
                                if _oi and _rev and result.get("operatingMargins") is None and _rev != 0:
                                    result["operatingMargins"] = round(_oi / _rev, 4)
                                if result.get("totalRevenue"):
                                    if result.get("revenuePerShare") is None and current_price:
                                        mc = result.get("marketCap")
                                        if mc and mc > 0:
                                            result["revenuePerShare"] = _rev / (mc / current_price)
                                break
                    except Exception:
                        continue
            except Exception:
                pass

    if result.get("forwardPE") and result.get("forwardEps") is None and current_price:
        result["forwardEps"] = current_price / result["forwardPE"]

    # Calculate missing fields from available data
    if result:
        if result.get("payoutRatio") is None and result.get("dividendRate") is not None and result.get("trailingEps"):
            if result["trailingEps"] != 0:
                result["payoutRatio"] = result["dividendRate"] / result["trailingEps"]

        _key_gaps = [k for k in ("beta", "52WeekChange", "averageVolume", "fiftyTwoWeekHigh", "fiftyTwoWeekLow") if result.get(k) is None]
        if _key_gaps:
            _cd = _fetch_yahoo_chart_data(symbol, period="1y", interval="1d")
            if _cd:
                _cl = [d["close"] for d in _cd if d.get("close", 0) > 0]
                _vl = [d["volume"] for d in _cd]
                if result.get("fiftyTwoWeekHigh") is None and _cl:
                    result["fiftyTwoWeekHigh"] = max(_cl)
                if result.get("fiftyTwoWeekLow") is None and _cl:
                    result["fiftyTwoWeekLow"] = min(_cl)
                if result.get("averageVolume") is None and _vl:
                    result["averageVolume"] = int(sum(_vl) / len(_vl))
                if result.get("52WeekChange") is None and len(_cl) >= 2:
                    result["52WeekChange"] = round((_cl[-1] - _cl[0]) / _cl[0], 4)
                if result.get("beta") is None and len(_cl) >= 30:
                    _mkt = "^TWII" if symbol.endswith((".TW", ".TWO")) else "^HSI" if symbol.endswith(".HK") else "^GSPC"
                    _md = _fetch_yahoo_chart_data(_mkt, period="1y", interval="1d")
                    if _md:
                        _mc = [d["close"] for d in _md if d.get("close", 0) > 0]
                        _n = min(len(_cl), len(_mc))
                        if _n >= 30:
                            _sr = [(_cl[i] - _cl[i-1]) / _cl[i-1] for i in range(1, _n)]
                            _mr = [(_mc[i] - _mc[i-1]) / _mc[i-1] for i in range(1, _n)]
                            _mm = sum(_mr) / len(_mr)
                            _cov = sum((_mr[i] - _mm) * (_sr[i] - _mm) for i in range(len(_mr)))
                            _vm = sum((r - _mm) ** 2 for r in _mr)
                            if _vm > 0:
                                result["beta"] = round(_cov / _vm, 4)

    if not result.get("sector"):
        sec = STOCK_SECTORS.get(symbol)
        if sec:
            result["sector"] = sec["sector"]
            result["industry"] = sec["industry"]
        elif FINNHUB_API_KEY:
            sym_clean = symbol.replace(".TW", "").replace(".TWO", "").replace(".HK", "")
            try:
                r = requests.get(f"https://finnhub.io/api/v1/stock/profile2?symbol={sym_clean}&token={FINNHUB_API_KEY}", timeout=5)
                if r.status_code == 200:
                    p = r.json()
                    fin = p.get("finnhubIndustry") or p.get("industry") or ""
                    if fin:
                        result["sector"] = fin
                        result["industry"] = fin
                    if not result.get("country"):
                        result["country"] = p.get("country", "")
                    if not result.get("website"):
                        result["website"] = p.get("weburl", "")
                    if not result.get("logo_url"):
                        result["logo_url"] = p.get("logo", "")
            except Exception:
                pass

    # Comprehensive fill: derive missing fields from available data
    if result and current_price:
        mc = result.get("marketCap")
        if not mc or mc <= 0:
            for _q_url in [
                f"https://query1.finance.yahoo.com/v6/finance/quote?symbols={urllib.parse.quote(symbol)}",
                f"https://query1.finance.yahoo.com/v7/finance/quote?symbols={urllib.parse.quote(symbol)}",
                f"https://query2.finance.yahoo.com/v6/finance/quote?symbols={urllib.parse.quote(symbol)}",
            ]:
                try:
                    rate_limit()
                    _q_rsp = requests.get(_q_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=6)
                    if _q_rsp.status_code == 200:
                        _qi = _q_rsp.json().get("quoteResponse", {}).get("result", [{}])[0]
                        _mc = _qi.get("marketCap")
                        if _mc:
                            mc = _mc
                            break
                except Exception:
                    continue
        if mc and mc > 0:
            shares = mc / current_price
            rev = result.get("totalRevenue")
            rps = result.get("revenuePerShare")
            if rev is None and rps is not None:
                result["totalRevenue"] = rps * shares
            elif rps is None and rev is not None:
                result["revenuePerShare"] = rev / shares
        eps_val = result.get("trailingEps")
        rps_val = result.get("revenuePerShare")
        if result.get("profitMargins") is None and eps_val and rps_val and rps_val != 0:
            result["profitMargins"] = eps_val / rps_val
        roe_val = result.get("returnOnEquity")
        dte_val = result.get("debtToEquity")
        if result.get("returnOnAssets") is None and roe_val and dte_val:
            dte = dte_val / 100 if dte_val > 5 else dte_val
            result["returnOnAssets"] = roe_val / (1 + dte)

    has_data = any(v is not None for v in result.values())
    if has_data:
        FUNDAMENTALS_CACHE[cache_key] = {"data": result, "time": now_val}
    return result

def _fetch_twse_quote(symbol: str) -> dict:
    """Fetch real-time quote from Taiwan Stock Exchange for .TW symbols."""
    stock_no = symbol.replace(".TW", "").replace(".TWO", "")
    market = "otc" if ".TWO" in symbol else "tse"
    urls = [
        f"https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch={market}_{stock_no}.tw&json=1&delay=0",
        f"http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch={market}_{stock_no}.tw&json=1&delay=0",
    ]

    for url in urls:
        try:
            s = requests.Session()
            s.headers.update({"User-Agent": "Mozilla/5.0", "Referer": "https://mis.twse.com.tw/"})
            r = s.get(url, timeout=8)
            if r.status_code != 200:
                continue
            try:
                data = r.json()
            except Exception:
                continue
            msg = data.get("msgArray", [])
            if not msg:
                continue

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
                "fiftyTwoWeekHigh": None,
                "fiftyTwoWeekLow": None,
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
            continue
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
            # Supplement with Yahoo chart meta (52-week range, exchange, currency)
            try:
                yf_info = _fetch_yahoo_chart(symbol)
                if yf_info.get("longName") and yf_info["longName"] != symbol:
                    result["_nameEn"] = yf_info["longName"]
                for k in ["fiftyTwoWeekHigh", "fiftyTwoWeekLow", "currency", "exchange"]:
                    if yf_info.get(k) is not None:
                        result[k] = yf_info.get(k)
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
    stock_name = known_entry.get("name", "") or info.get("longName", "")
    dividend_freq = STOCK_MONEY.get(stock_name)
    meeting_url = STOCK_MEETING_URLS.get(symbol)
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
        "dividendFrequency": dividend_freq,
        "meetingUrl": meeting_url,
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
    bwibbu_fallback_count = 0
    fallback_sample = ""
    try:
        fp = os.path.join(os.path.dirname(__file__), "bwibbu_fallback.json")
        import os as _os
        if _os.path.exists(fp):
            with open(fp, "r", encoding="utf-8") as f:
                bdata = json.load(f)
                if isinstance(bdata, list):
                    bwibbu_fallback_count = len(bdata)
                    stock_no = symbol.replace(".TW", "").replace(".TWO", "").replace(".HK", "")
                    for item in bdata:
                        if item.get("Code") == stock_no:
                            fallback_sample = json.dumps(item)
                            break
        else:
            fallback_sample = f"FILE NOT FOUND at {fp}"
    except Exception as e:
        fallback_sample = f"ERROR: {e}"
    return {
        "symbol": symbol,
        "raw_info_keys": list(raw.keys()),
        "raw_fundamentals": {k: v for k, v in fund.items() if v is not None},
        "bwibbu_fallback_count": bwibbu_fallback_count,
        "bwibbu_fallback_entry": fallback_sample,
        "stock_response": raw,
    }


@app.get("/api/stock/{symbol}/sentiment")
async def get_sentiment(symbol: str):
    """多空/利空 - Compute bullish/bearish sentiment from fundamentals and external data."""
    info = _get_stock_info(symbol)
    signals = []
    bullish_count = 0
    bearish_count = 0
    from datetime import timedelta

    pe = info.get("trailingPE")
    if pe is not None:
        if pe < 15:
            signals.append({"factor": "本益比 (P/E)", "value": f"{pe:.2f}", "signal": "bullish", "reason": "低於15，股價可能被低估"})
            bullish_count += 1
        elif pe > 30:
            signals.append({"factor": "本益比 (P/E)", "value": f"{pe:.2f}", "signal": "bearish", "reason": "高於30，股價可能偏高"})
            bearish_count += 1
        else:
            signals.append({"factor": "本益比 (P/E)", "value": f"{pe:.2f}", "signal": "neutral", "reason": "位於合理區間 15-30"})

    fpe = info.get("forwardPE")
    if fpe is not None and pe is not None:
        if fpe < pe:
            signals.append({"factor": "預估本益比", "value": f"{fpe:.2f}", "signal": "bullish", "reason": "低於目前本益比，預期獲利成長"})
            bullish_count += 1
        elif fpe > pe:
            signals.append({"factor": "預估本益比", "value": f"{fpe:.2f}", "signal": "bearish", "reason": "高於目前本益比，預期獲利衰退"})
            bearish_count += 1

    roe = info.get("returnOnEquity")
    if roe is not None:
        if roe > 0.15:
            signals.append({"factor": "ROE", "value": f"{roe*100:.2f}%", "signal": "bullish", "reason": "高於15%，獲利能力優異"})
            bullish_count += 1
        elif roe < 0.05:
            signals.append({"factor": "ROE", "value": f"{roe*100:.2f}%", "signal": "bearish", "reason": "低於5%，獲利能力不佳"})
            bearish_count += 1
        else:
            signals.append({"factor": "ROE", "value": f"{roe*100:.2f}%", "signal": "neutral", "reason": "位於5%-15%之間"})

    pb = info.get("priceToBook")
    if pb is not None:
        if pb < 1.5:
            signals.append({"factor": "股價淨值比 (P/B)", "value": f"{pb:.2f}", "signal": "bullish", "reason": "低於1.5，股價低於淨值"})
            bullish_count += 1
        elif pb > 5:
            signals.append({"factor": "股價淨值比 (P/B)", "value": f"{pb:.2f}", "signal": "bearish", "reason": "高於5，股價可能偏高"})
            bearish_count += 1
        else:
            signals.append({"factor": "股價淨值比 (P/B)", "value": f"{pb:.2f}", "signal": "neutral", "reason": "位於1.5-5之間"})

    dy = info.get("dividendYield")
    if dy is not None:
        if dy > 0.03:
            signals.append({"factor": "殖利率", "value": f"{dy*100:.2f}%", "signal": "bullish", "reason": "高於3%，配息穩定"})
            bullish_count += 1
        elif dy < 0.01:
            signals.append({"factor": "殖利率", "value": f"{dy*100:.2f}%", "signal": "bearish", "reason": "低於1%，配息較低"})
            bearish_count += 1
        else:
            signals.append({"factor": "殖利率", "value": f"{dy*100:.2f}%", "signal": "neutral", "reason": "位於1%-3%之間"})

    dte = info.get("debtToEquity")
    if dte is not None:
        if dte < 0.5:
            signals.append({"factor": "負債權益比", "value": f"{dte:.2f}", "signal": "bullish", "reason": "低於0.5，財務結構穩健"})
            bullish_count += 1
        elif dte > 2:
            signals.append({"factor": "負債權益比", "value": f"{dte:.2f}", "signal": "bearish", "reason": "高於2，負債偏高"})
            bearish_count += 1

    pm = info.get("profitMargins")
    if pm is not None:
        if pm > 0.15:
            signals.append({"factor": "利潤率", "value": f"{pm*100:.2f}%", "signal": "bullish", "reason": "高於15%，獲利能力強"})
            bullish_count += 1
        elif pm < 0.05:
            signals.append({"factor": "利潤率", "value": f"{pm*100:.2f}%", "signal": "bearish", "reason": "低於5%，利潤空間有限"})
            bearish_count += 1

    chg52 = info.get("52WeekChange")
    if chg52 is not None:
        if chg52 > 0:
            signals.append({"factor": "52週漲跌幅", "value": f"{chg52*100:.2f}%", "signal": "bullish", "reason": "過去一年上漲，趨勢向好"})
            bullish_count += 1
        else:
            signals.append({"factor": "52週漲跌幅", "value": f"{chg52*100:.2f}%", "signal": "bearish", "reason": "過去一年下跌，趨勢偏弱"})
            bearish_count += 1

    beta = info.get("beta")
    if beta is not None:
        if beta < 0.8:
            signals.append({"factor": "β 值", "value": f"{beta:.2f}", "signal": "bullish", "reason": "低於0.8，波動較小，防禦性強"})
            bullish_count += 1
        elif beta > 1.5:
            signals.append({"factor": "β 值", "value": f"{beta:.2f}", "signal": "bearish", "reason": "高於1.5，波動劇烈，風險較高"})
            bearish_count += 1

    recommendations = []
    inst_trading = {}

    if FINNHUB_API_KEY and not (symbol.endswith(".TW") or symbol.endswith(".TWO")):
        for sym_try in [symbol, symbol.replace(".HK", "")]:
            try:
                r = requests.get(f"https://finnhub.io/api/v1/stock/recommendation?symbol={sym_try}&token={FINNHUB_API_KEY}", timeout=5)
                if r.status_code == 200:
                    recs = r.json()
                    if isinstance(recs, list) and len(recs) > 0:
                        recommendations = recs[:5]
                        latest = recs[0]
                        strong_buy = latest.get("strongBuy", 0) or 0
                        buy = latest.get("buy", 0) or 0
                        hold = latest.get("hold", 0) or 0
                        sell = latest.get("sell", 0) or 0
                        strong_sell = latest.get("strongSell", 0) or 0
                        total = strong_buy + buy + hold + sell + strong_sell
                        if total > 0:
                            rec_score = (strong_buy * 2 + buy - sell - strong_sell * 2) / total
                            if rec_score > 0:
                                signals.append({"factor": "分析師評級", "value": f"買進{(strong_buy+buy)/total*100:.0f}%/中立{hold/total*100:.0f}%/賣出{(sell+strong_sell)/total*100:.0f}%", "signal": "bullish" if rec_score > 0.3 else "neutral", "reason": f"分析師共識評分 {rec_score:.2f}"})
                                if rec_score > 0.3:
                                    bullish_count += 1
                            else:
                                signals.append({"factor": "分析師評級", "value": f"買進{(strong_buy+buy)/total*100:.0f}%/中立{hold/total*100:.0f}%/賣出{(sell+strong_sell)/total*100:.0f}%", "signal": "bearish" if rec_score < -0.3 else "neutral", "reason": f"分析師共識評分 {rec_score:.2f}"})
                                if rec_score < -0.3:
                                    bearish_count += 1
                    break
            except Exception:
                continue

    if symbol.endswith(".TW") or symbol.endswith(".TWO"):
        stock_no = symbol.replace(".TW", "").replace(".TWO", "")
        for d_off in range(3):
            d = (datetime.now(timezone.utc) - timedelta(days=d_off)).strftime("%Y%m%d")
            try:
                r = requests.get(f"https://www.twse.com.tw/fund/T86?response=json&date={d}&selectType=ALL", timeout=4)
                if r.status_code == 200:
                    inst_data = r.json()
                    if inst_data.get("data") and isinstance(inst_data["data"], list):
                        for row in inst_data["data"]:
                            if len(row) >= 16 and row[1] == stock_no:
                                inst_trading = {
                                    "date": row[0],
                                    "foreignNet": _safe_float(row[5]) or 0,
                                    "itNet": _safe_float(row[8]) or 0,
                                    "dealerNet": _safe_float(row[14]) or 0,
                                    "totalNet": _safe_float(row[15]) or 0,
                                }
                                fn = inst_trading["foreignNet"]
                                tn = inst_trading["totalNet"]
                                if fn > 0:
                                    signals.append({"factor": "外資買賣超", "value": f"{fn:+,.0f}", "signal": "bullish", "reason": "外資買超，法人看好"})
                                    bullish_count += 1
                                elif fn < 0:
                                    signals.append({"factor": "外資買賣超", "value": f"{fn:+,.0f}", "signal": "bearish", "reason": "外資賣超，法人看淡"})
                                    bearish_count += 1
                                if tn > 0:
                                    signals.append({"factor": "三大法人買賣超", "value": f"{tn:+,.0f}", "signal": "bullish", "reason": "法人整體買超"})
                                    bullish_count += 1
                                elif tn < 0:
                                    signals.append({"factor": "三大法人買賣超", "value": f"{tn:+,.0f}", "signal": "bearish", "reason": "法人整體賣超"})
                                    bearish_count += 1
                                break
                        if inst_trading:
                            break
            except Exception:
                continue

    total = bullish_count + bearish_count
    score = round((bullish_count - bearish_count) / total, 2) if total > 0 else 0
    overall = "bullish" if bullish_count > bearish_count else "bearish" if bearish_count > bullish_count else "neutral"

    return {
        "symbol": symbol,
        "overall": overall,
        "score": score,
        "bullishCount": bullish_count,
        "bearishCount": bearish_count,
        "signals": signals,
        "recommendations": recommendations,
        "institutionalTrading": inst_trading,
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
            if i >= len(opens) or opens[i] is None or i >= len(closes) or closes[i] is None:
                continue
            dt = datetime.fromtimestamp(timestamps[i], tz=timezone.utc)
            chart_data.append({
                "date": dt.strftime("%Y-%m-%d %H:%M"),
                "open": round(float(opens[i]), 2),
                "high": round(float(highs[i]), 2) if i < len(highs) and highs[i] is not None else 0,
                "low": round(float(lows[i]), 2) if i < len(lows) and lows[i] is not None else 0,
                "close": round(float(closes[i]), 2),
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

    # TWSE STOCK_DAY fallback: fill missing data points for TW stocks (daily only)
    if (symbol.endswith(".TW") or symbol.endswith(".TWO")) and interval == "1d" and data:
        try:
            _sn = symbol.replace(".TW", "").replace(".TWO", "")
            _built_dates = {d["date"][:10] for d in data if d.get("close", 0) > 0}
            _tw_dates = set()
            for _d in data:
                _date_str = _d.get("date", "")[:10]
                if _date_str:
                    _year, _month = _date_str[:4], _date_str[5:7]
                    _tw_dates.add(f"{_year}{_month}")
            for _ym in _tw_dates:
                try:
                    _tw_url = f"https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date={_ym}01&stockNo={_sn}"
                    _tw_rsp = requests.get(_tw_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
                    if _tw_rsp.status_code != 200:
                        continue
                    _tw_json = _tw_rsp.json()
                    if _tw_json.get("stat") != "OK":
                        continue
                    _tw_rows = _tw_json.get("data", [])
                    for _row in _tw_rows:
                        if len(_row) < 7:
                            continue
                        _tw_date_str = _row[0].replace("/", "-")
                        _tw_year = _tw_date_str.split("-")[0]
                        if len(_tw_year) == 3:
                            _tw_date_str = str(int(_tw_year) + 1911) + "-" + "-".join(_tw_date_str.split("-")[1:])
                        _tw_close = _safe_float(_row[6])
                        if _tw_close and _tw_date_str not in _built_dates:
                            _tw_open = _safe_float(_row[3]) or _tw_close
                            _tw_high = _safe_float(_row[4]) or _tw_close
                            _tw_low = _safe_float(_row[5]) or _tw_close
                            _tw_vol = int(float(_row[1].replace(",", ""))) if _row[1] else 0
                            data.append({
                                "date": _tw_date_str + " 00:00",
                                "open": round(_tw_open, 2),
                                "high": round(_tw_high, 2),
                                "low": round(_tw_low, 2),
                                "close": round(_tw_close, 2),
                                "volume": _tw_vol,
                            })
                            _built_dates.add(_tw_date_str)
                except Exception:
                    continue
            if data:
                data.sort(key=lambda x: x.get("date", ""))
        except Exception:
            pass

    return {"symbol": symbol, "period": period, "interval": interval, "data": data}


@app.get("/api/stock/{symbol}/institutional")
async def get_institutional(symbol: str):
    """三大法人買賣超 data for Taiwan stocks from TWSE."""
    if not (symbol.endswith(".TW") or symbol.endswith(".TWO")):
        return {"symbol": symbol, "data": []}

    _sn = symbol.replace(".TW", "").replace(".TWO", "")
    _today = datetime.now(timezone.utc)
    _date_strs = []

    # generate last 60 calendar days, skip weekends
    for _i in range(60):
        _d = _today - timedelta(days=_i)
        if _d.weekday() < 5:
            _date_strs.append(_d.strftime("%Y%m%d"))
    _date_strs.sort()

    _results = {}
    def _fetch_institutional(_ds):
        try:
            rate_limit()
            _u = f"https://www.twse.com.tw/fund/T86?response=json&date={_ds}&stockNo={_sn}"
            _r = requests.get(_u, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
            if _r.status_code != 200:
                return None
            _j = _r.json()
            if _j.get("stat") != "OK":
                return None
            return _j.get("data", [])
        except Exception:
            return None

    with ThreadPoolExecutor(max_workers=8) as _ex:
        _futs = {_ex.submit(_fetch_institutional, _ds): _ds for _ds in _date_strs}
        for _f in as_completed(_futs):
            _ds = _futs[_f]
            try:
                _rows = _f.result()
                if _rows and len(_rows) >= 1:
                    _row = _rows[0]
                    if len(_row) >= 22:
                        # TWSE T86 returns: [date, stock_no, stock_name,
                        #   foreign_buy, foreign_sell, foreign_net,
                        #   foreign_self_buy, foreign_self_sell, foreign_self_net,
                        #   it_buy, it_sell, it_net,
                        #   dealer_self_buy, dealer_self_sell, dealer_self_net,
                        #   dealer_hedge_buy, dealer_hedge_sell, dealer_hedge_net,
                        #   dealer_total_buy, dealer_total_sell, dealer_total_net,
                        #   total_buy, total_sell, total_net]
                        _date_raw = _row[0]
                        _parts = _date_raw.split("/")
                        _y = str(int(_parts[0]) + 1911) if len(_parts[0]) == 3 else _parts[0]
                        _date_fmt = f"{_y}-{_parts[1]}-{_parts[2]}"
                        _results[_ds] = {
                            "date": _date_fmt,
                            "foreignBuy": int(_row[3].replace(",", "")),
                            "foreignSell": int(_row[4].replace(",", "")),
                            "foreignNet": int(_row[5].replace(",", "")),
                            "itBuy": int(_row[9].replace(",", "")),
                            "itSell": int(_row[10].replace(",", "")),
                            "itNet": int(_row[11].replace(",", "")),
                            "dealerBuy": int(_row[18].replace(",", "")),
                            "dealerSell": int(_row[19].replace(",", "")),
                            "dealerNet": int(_row[20].replace(",", "")),
                            "totalBuy": int(_row[21].replace(",", "")),
                            "totalSell": int(_row[22].replace(",", "")),
                            "totalNet": int(_row[23].replace(",", "")),
                        }
            except Exception:
                pass

    _data = [_results[k] for k in sorted(_results.keys()) if k in _results]
    return {"symbol": symbol, "data": _data}


@app.get("/api/stock/{symbol}/dividends")
async def get_dividends(symbol: str):
    div_data = []
    split_data = []

    # Source 1: Yahoo v8 chart events (reliable, no auth needed)
    try:
        for ua in [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        ]:
            s = requests.Session()
            s.headers.update({"User-Agent": ua})
            r = s.get(f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?range=10y&interval=1mo&events=div,split", timeout=15)
            if r.status_code != 200:
                continue
            data = r.json()
            result = data.get("chart", {}).get("result", [])
            if not result:
                continue
            events = result[0].get("events", {})
            divs = events.get("dividends", {})
            if divs:
                for ts_str, evt in divs.items():
                    dt_val = datetime.fromtimestamp(evt.get("date", int(ts_str)), tz=timezone.utc)
                    amt = _safe_float(evt.get("amount"))
                    if amt is not None:
                        div_data.append({"date": dt_val.strftime("%Y-%m-%d"), "amount": round(amt, 4)})
            splits_evt = events.get("splits", {})
            if splits_evt:
                for ts_str, evt in splits_evt.items():
                    dt_val = datetime.fromtimestamp(evt.get("date", int(ts_str)), tz=timezone.utc)
                    num = _safe_float(evt.get("numerator"))
                    den = _safe_float(evt.get("denominator"))
                    if num and den:
                        split_data.append({"date": dt_val.strftime("%Y-%m-%d"), "ratio": round(num / den, 4)})
            if div_data or split_data:
                break
    except Exception:
        pass

    # Source 2: yfinance (always runs to supplement with latest data)
    rate_limit()
    try:
        ticker = yf.Ticker(symbol)
        dividends = ticker.dividends
        splits = ticker.splits
        if dividends is not None and not dividends.empty:
            existing_dates = {d["date"] for d in div_data}
            for index, value in dividends.items():
                dt = index if isinstance(index, datetime) else datetime.fromtimestamp(index.timestamp()) if hasattr(index, 'timestamp') else index
                date_str = dt.strftime("%Y-%m-%d") if hasattr(dt, 'strftime') else str(dt)
                if date_str not in existing_dates:
                    div_data.append({
                        "date": date_str,
                        "amount": round(float(value), 4),
                    })
                    existing_dates.add(date_str)
        if splits is not None and not splits.empty:
            existing_split_dates = {s["date"] for s in split_data}
            for index, value in splits.items():
                date_str = index.strftime("%Y-%m-%d")
                if date_str not in existing_split_dates:
                    split_data.append({
                        "date": date_str,
                        "ratio": round(float(value), 4),
                    })
    except Exception:
        pass

    div_data.sort(key=lambda x: x["date"], reverse=True)
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


def _fetch_realtime_price(symbol: str) -> dict:
    """Get real-time price from the best available source.
    For TWSE stocks: try TWSE mis API, fall back to Yahoo v8 intraday.
    For US/HK stocks: Yahoo v8 intraday.
    """
    # Taiwan stocks: TWSE mis API first
    if symbol.endswith(".TW") or symbol.endswith(".TWO"):
        twse = _fetch_twse_quote(symbol)
        if twse.get("currentPrice", 0) > 0:
            prev = twse.get("previousClose", 0)
            cur = twse.get("currentPrice", 0)
            return {"price": cur, "change": round(cur - prev, 2), "changePercent": round((cur - prev) / prev * 100, 2) if prev else 0}

    # All stocks: Yahoo v8 intraday
    for ua in [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    ]:
        try:
            s = requests.Session()
            s.headers.update({"User-Agent": ua, "Accept": "application/json"})
            r = s.get(f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?range=1d&interval=5m", timeout=8)
            if r.status_code != 200:
                continue
            data = r.json()
            result = data.get("chart", {}).get("result", [])
            if not result:
                continue
            meta = result[0].get("meta", {})
            quotes = result[0].get("indicators", {}).get("quote", [{}])[0] if result[0].get("indicators", {}).get("quote") else {}
            closelist = quotes.get("close", [])
            cur_price = meta.get("regularMarketPrice")
            if cur_price is None and closelist:
                cur_price = closelist[-1]
            if cur_price is None:
                cur_price = 0
            prev_close = meta.get("chartPreviousClose", cur_price)
            change = round(cur_price - prev_close, 2)
            change_pct = round(change / prev_close * 100, 2) if prev_close else 0
            if cur_price > 0:
                return {"price": cur_price, "change": change, "changePercent": change_pct}
        except Exception:
            continue
    return {"price": 0, "change": 0, "changePercent": 0}


@app.get("/api/price/{symbol}")
async def get_price(symbol: str):
    try:
        rt = _fetch_realtime_price(symbol)
        if rt.get("price", 0) > 0:
            return {"symbol": symbol, "price": rt["price"], "change": rt["change"], "changePercent": rt["changePercent"]}
        return {"symbol": symbol, "price": 0, "change": 0, "changePercent": 0}
    except Exception:
        return {"symbol": symbol, "price": 0, "change": 0, "changePercent": 0}


@app.websocket("/ws/price/{symbol}")
async def websocket_price(websocket: WebSocket, symbol: str):
    await websocket.accept()
    while True:
        await asyncio.sleep(5)
        try:
            rt = _fetch_realtime_price(symbol)
            if rt["price"] > 0:
                await websocket.send_json({
                    "symbol": symbol,
                    "price": rt["price"],
                    "change": rt["change"],
                    "changePercent": rt["changePercent"],
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                })
        except Exception:
            pass
