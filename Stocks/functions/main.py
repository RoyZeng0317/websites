import json
from datetime import datetime

import yfinance as yf
from firebase_functions import https_fn

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

STOCK_MEETING_URLS = {
    "2330.TW": "https://investor.tsmc.com/chinese/quarterly-results/2026/q1",
    "2409.TW": "https://www.auo.com/zh-TW/investor_conference/index",
    "2515.TW": "https://www.bes.com.tw/ir-conference.php#gsc.tab=0",
    "2412.TW": "https://www.cht.com.tw/zh-tw/home/cht/investors/shareholder-services/ir-calendar",
}


def cors_response(data, status=200):
    body = json.dumps(data, default=str)
    return https_fn.Response(
        body,
        status=status,
        headers={
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    )


def detect_exchange(symbol: str) -> str:
    if symbol.endswith(".TW"):
        return "TWSE"
    if symbol.endswith(".HK"):
        return "HKEX"
    return "NYSE/NASDAQ"


@https_fn.on_request()
def api(req: https_fn.Request) -> https_fn.Response:
    if req.method == "OPTIONS":
        return cors_response({})

    path = req.path.rstrip("/")

    if path == "/api/search":
        return handle_search(req)
    if path.startswith("/api/stock/") and path.endswith("/chart"):
        symbol = path.split("/")[3]
        return handle_chart(req, symbol)
    if path.startswith("/api/stock/") and path.endswith("/dividends"):
        symbol = path.split("/")[3]
        return handle_dividends(symbol)
    if path.startswith("/api/stock/") and path.endswith("/financials"):
        symbol = path.split("/")[3]
        return handle_financials(symbol)
    if path.startswith("/api/stock/") and path.endswith("/holders"):
        symbol = path.split("/")[3]
        return handle_holders(symbol)
    if path.startswith("/api/stock/"):
        symbol = path.split("/")[3]
        return handle_stock_info(symbol)

    return cors_response({"error": "Not found"}, 404)


def handle_search(req):
    query = req.args.get("query", "").lower()
    if not query:
        return cors_response([])

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

    results = []
    for sym, name in popular:
        if query in sym.lower() or query in name.lower():
            results.append({"symbol": sym, "name": name, "exchange": detect_exchange(sym)})

    try:
        ticker = yf.Ticker(query)
        info = ticker.info
        if info and info.get("symbol"):
            sym = info["symbol"]
            if not any(r["symbol"] == sym for r in results):
                results.insert(0, {
                    "symbol": sym,
                    "name": info.get("longName", info.get("shortName", query)),
                    "exchange": detect_exchange(sym),
                })
    except Exception:
        pass

    return cors_response(results[:20])


def handle_stock_info(symbol):
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
    except Exception as e:
        return cors_response({"error": str(e)}, 500)

    name_cn = info.get("shortName") or info.get("longName", "")
    dividend_freq = STOCK_MONEY.get(name_cn)
    meeting_url = STOCK_MEETING_URLS.get(symbol)

    result = {
        "symbol": symbol,
        "name": info.get("longName", info.get("shortName", symbol)),
        "currentPrice": info.get("currentPrice") or info.get("regularMarketPrice") or info.get("previousClose", 0),
        "previousClose": info.get("previousClose", 0),
        "open": info.get("regularMarketOpen", 0),
        "dayHigh": info.get("dayHigh", info.get("regularMarketDayHigh", 0)),
        "dayLow": info.get("dayLow", info.get("regularMarketDayLow", 0)),
        "change": info.get("regularMarketChange", 0),
        "changePercent": info.get("regularMarketChangePercent", 0),
        "marketCap": info.get("marketCap", 0),
        "volume": info.get("regularMarketVolume", 0),
        "avgVolume": info.get("averageVolume", 0),
        "peRatio": info.get("trailingPE"),
        "forwardPE": info.get("forwardPE"),
        "eps": info.get("trailingEps"),
        "forwardEps": info.get("forwardEps"),
        "earningsDate": str(info.get("earningsDate", [None, None])[0]) if info.get("earningsDate") else None,
        "dividendYield": info.get("dividendYield"),
        "dividendRate": info.get("dividendRate"),
        "exDividendDate": str(info.get("exDividendDate")) if info.get("exDividendDate") else None,
        "payoutRatio": info.get("payoutRatio"),
        "fiveYearAvgDividendYield": info.get("fiveYearAvgDividendYield"),
        "dividendFrequency": dividend_freq,
        "meetingUrl": meeting_url,
        "roe": info.get("returnOnEquity"),
        "roa": info.get("returnOnAssets"),
        "revenue": info.get("totalRevenue"),
        "revenuePerShare": info.get("revenuePerShare"),
        "profitMargin": info.get("profitMargins"),
        "operatingMargin": info.get("operatingMargins"),
        "debtToEquity": info.get("debtToEquity"),
        "bookValue": info.get("bookValue"),
        "priceToBook": info.get("priceToBook"),
        "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh"),
        "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow"),
        "fiftyTwoWeekChange": info.get("52WeekChange"),
        "beta": info.get("beta"),
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        "country": info.get("country"),
        "website": info.get("website"),
        "description": info.get("longBusinessSummary"),
        "employees": info.get("fullTimeEmployees"),
        "exchange": info.get("exchange"),
        "currency": info.get("currency"),
        "logoUrl": info.get("logo_url"),
    }
    return cors_response(result)


def handle_chart(req, symbol):
    period = req.args.get("period", "1y")
    interval = req.args.get("interval", "1d")

    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period, interval=interval)
    except Exception as e:
        return cors_response({"error": str(e)}, 500)

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

    return cors_response({"symbol": symbol, "period": period, "interval": interval, "data": data})


def handle_dividends(symbol):
    try:
        ticker = yf.Ticker(symbol)
        dividends = ticker.dividends
        splits = ticker.splits
    except Exception as e:
        return cors_response({"error": str(e)}, 500)

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
            split_data.append({"date": index.strftime("%Y-%m-%d"), "ratio": round(float(value), 4)})

    return cors_response({"symbol": symbol, "dividends": div_data, "splits": split_data})


def handle_financials(symbol):
    try:
        ticker = yf.Ticker(symbol)
    except Exception as e:
        return cors_response({"error": str(e)}, 500)

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

    return cors_response({"symbol": symbol, **result})


def handle_holders(symbol):
    try:
        ticker = yf.Ticker(symbol)
        major = ticker.major_holders
        institutional = ticker.institutional_holders
    except Exception as e:
        return cors_response({"error": str(e)}, 500)

    major_data = {}
    if major is not None and not major.empty:
        for index, row in major.iterrows():
            major_data[str(index)] = [str(v) for v in row.values]

    inst_data = []
    if institutional is not None and not institutional.empty:
        for _, row in institutional.iterrows():
            inst_data.append({str(k): str(v) for k, v in row.items()})

    return cors_response({"symbol": symbol, "majorHolders": major_data, "institutionalHolders": inst_data})
