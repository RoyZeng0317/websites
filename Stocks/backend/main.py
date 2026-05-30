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
import threading
import time
from datetime import datetime, timezone, timedelta
from typing import Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

import asyncio
import requests
import yfinance as yf
from dotenv import load_dotenv
from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect

load_dotenv()
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
    "9105.TW": {"sector": "電子代工", "industry": "EMS (電子製造服務)"},
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

SECTOR_AVG_PE = {
    "半導體": 20, "光電": 15, "面板": 15, "電子代工": 15,
    "電腦周邊": 16, "通信網路": 18, "電信服務": 18,
    "金融": 12, "銀行": 12, "保險": 12,
    "航運": 10, "航空": 10, "貨櫃": 10,
    "塑膠": 15, "鋼鐵": 12, "食品": 18,
    "營建": 12, "建材": 12,
    "電子零組件": 18, "其他電子": 16,
    "汽車": 15, "生技醫療": 25, "電機機械": 15,
    "運動休閒": 18, "貿易百貨": 15, "油電": 14,
    "資訊服務": 18, "水泥": 13, "橡膠": 14,
    "紡織": 14, "電器電纜": 13, "玻璃陶瓷": 14,
    "造紙": 12, "觀光餐飲": 20, "物流": 12,
    "零售": 18, "超商": 18, "餐飲": 20,
    "IC 設計": 22, "晶圓代工": 20, "封測": 16,
    "記憶體製造": 15, "PCB": 15,
}
DEFAULT_AVG_PE = 15

TWSE_COMPANY_CACHE = {}
TWSE_COMPANY_CACHE_TIME = 0
TWSE_COMPANY_CACHE_TTL = 86400  # 24 hours

def _fetch_twse_company_info(symbol: str) -> dict:
    global TWSE_COMPANY_CACHE, TWSE_COMPANY_CACHE_TIME
    code = symbol.replace(".TW", "").replace(".TWO", "")
    market_type = "listed" if symbol.endswith(".TW") else "otc"

    now_val = time.time()
    full = TWSE_COMPANY_CACHE.get(market_type)
    if full and now_val - TWSE_COMPANY_CACHE_TIME < TWSE_COMPANY_CACHE_TTL:
        return full.get(code, {})

    try:
        url = ("https://openapi.twse.com.tw/v1/opendata/t187ap03_L"
               if market_type == "listed"
               else "https://openapi.twse.com.tw/v1/opendata/t187ap03_P")
        s = requests.Session()
        s.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
        r = s.get(url, timeout=15)
        r.encoding = "utf-8"
        raw = r.json()
    except Exception:
        raw = []

    index = {}
    code_key = "\u516c\u53f8\u4ee3\u865f"
    name_key = "\u516c\u53f8\u540d\u7a31"
    for item in raw:
        c = str(item.get(code_key, "")).strip()
        if c:
            index[c] = item

    TWSE_COMPANY_CACHE[market_type] = index
    TWSE_COMPANY_CACHE_TIME = now_val
    return index.get(code, {})
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
    "4916": "事欣科", "4967": "十銓",     "5007": "三星（台）",
    "9105": "泰金寶-DR",
    "5880": "合庫金", "6116": "彩晶", "6605": "帝寶", "6770": "力積電",
    "7418": "香繼光", "8046": "南電", "8110": "華東",
    "0050": "元大台灣50", "0051": "元大中型100", "0052": "元大富櫃50",
    "0053": "元大電子", "0055": "元大MSCI金融", "0056": "元大高股息",
    "0057": "元大摩台基金", "006201": "元大上證50", "006203": "元大MSCI台灣",
    "006204": "永豐臺灣加權", "006205": "富邦上証", "006206": "元大上證50",
    "006207": "復華滬深", "006208": "富邦台50", "00625K": "元大日經225",
    "00632R": "元大台灣50反1", "00633L": "富邦上証正2", "00634R": "富邦上証反1",
    "00635U": "元大S&P黃金", "00636": "國泰中國A50", "00636K": "國泰中國A50+U",
    "00637L": "元大滬深300正2", "00638R": "元大滬深300反1", "00639": "富邦深100",
    "00640L": "富邦日本正2", "00641R": "富邦日本反1", "00642": "元大S&P石油",
    "00643": "群益深証中小", "00645": "富邦日本", "00646": "元大S&P500",
    "00647L": "元大S&P500正2", "00648R": "元大S&P500反1",
    "00650L": "復華香港正2", "00651R": "復華香港反1",
    "00652": "富邦印度", "00653L": "富邦印度正2", "00654R": "富邦印度反1",
    "00655L": "國泰中國A50正2", "00656R": "國泰中國A50反1",
    "00660": "元大歐洲50", "00661": "元大日經225",
    "00662": "富邦NASDAQ", "00663L": "國泰臺灣加權正2",
    "00664R": "國泰臺灣加權反1", "00668": "國泰美國道瓊",
    "00668K": "國泰美國道瓊+U", "00670L": "富邦NASDAQ正2",
    "00671R": "富邦NASDAQ反1", "00673R": "群益臺灣加權反1",
    "00674R": "元大S&P500反1", "00675L": "富邦臺灣加權正2",
    "00676R": "富邦臺灣加權反1", "00678": "群益那斯達克生技",
    "00679B": "元大美債20年", "00680L": "元大美債20正2",
    "00681R": "元大美債20反1", "00682U": "元大美元指數",
    "00683L": "元大美元指正2", "00684R": "元大美元指反1",
    "00685L": "群益臺灣加權正2", "00686R": "群益臺灣加權反1",
    "00687B": "國泰20年美債", "00688L": "國泰20年美債正2",
    "00689R": "國泰20年美債反1", "00690": "兆豐藍籌30",
    "00691R": "兆豐臺灣藍籌反1", "00692": "富邦公司治理",
    "00693L": "富邦臺灣加權正2", "00694R": "群益道瓊反1",
    "00695B": "富邦美債7-10", "00696": "富邦美債20年",
    "00697B": "元大美債7-10", "00700": "富邦恒生國企",
    "00701": "國泰臺灣低波動30", "00702": "國泰標普低波高息",
    "00703": "台新MSCI中國", "00706L": "元大S&P日圓正2",
    "00707R": "元大S&P日圓反1", "00708L": "元大S&P黃金正2",
    "00709": "富邦歐洲", "00710B": "復華彭博非投等債",
    "00711B": "復華彭博新興債", "00712": "復華富時不動產",
    "00713": "元大台灣高息低波", "00714": "群益道瓊美國地產",
    "00715L": "期街口布蘭特正2", "00717": "富邦美國特別股",
    "00718B": "富邦中國政策債", "00719B": "元大美債1-3",
    "00720B": "元大投資級公司債", "00721B": "元大中國債3-5",
    "00722B": "群益投資級電信債", "00723B": "群益投資級科技債",
    "00724B": "群益投資級金融債", "00725B": "國泰投資級公司債",
    "00726B": "國泰5Y+新興債", "00727B": "國泰1-5Y非投等債",
    "00728": "第一金工業精選", "00730": "富邦臺灣優質高息",
    "00731": "復華富時高息低波", "00733": "富邦臺灣中小",
    "00734B": "台新JPM新興債", "00735": "國泰臺韓科技",
    "00736": "國泰新興市場", "00737": "群益深証中小",
    "00738U": "元大道瓊白銀", "00739": "元大MSCI A股",
    "00752": "中信中國50", "00753L": "中信中國50正2",
    "00756B": "群益投等新興公債", "00757": "統一FANG+",
    "00758B": "復華能源債", "00759B": "復華製藥債",
    "00760B": "復華新興企業債", "00761B": "國泰A級科技債",
    "00762": "元大全球AI", "00763U": "期街口道瓊銅",
    "00764B": "群益25年美債", "00768B": "復華20年美債",
    "00770": "國泰美國道瓊+U", "00771": "元大US高息特別股",
    "00772B": "中信高評級公司債", "00773B": "中信優先金融債",
    "00775B": "國泰A級金融債", "00778B": "凱基金融債20+",
    "00779B": "凱基美債25+", "00780B": "國泰A級公用債",
    "00781B": "國泰A級醫療債", "00782B": "國泰A級消費債",
    "00783B": "國泰A級科技債", "00784B": "國泰A級通訊債",
    "00785B": "國泰A級工業債", "00786B": "國泰A級原物料債",
    "00787B": "元大10年IG醫療債", "00788B": "元大10年IG電能債",
    "00789B": "元大10年IG銀行債", "00790B": "元大10年IG科技債",
    "00791B": "元大10年IG電信債", "00792B": "元大10年IG製藥債",
    "00793B": "群益AAA-A醫療債", "00795B": "中信美國公債20年",
    "00799B": "國泰A級醫療債", "00830": "國泰費城半導體",
    "00831B": "新光美債1-3", "00834B": "第一金金融債10+",
    "00836B": "永豐10年A公司債", "00840B": "凱基A級公司債",
    "00841B": "凱基AAA-AA公司債", "00842B": "台新美元銀行債",
    "00844B": "新光15年IG金融債", "00845B": "富邦新興投等債",
    "00846B": "富邦歐洲銀行債", "00847B": "中信美國市政債",
    "00848B": "中信新興亞洲債", "00849B": "中信EM主權債",
    "00850": "元大臺灣ESG永續", "00851": "台新全球多元資產",
    "00852B": "國泰20年美債+U", "00853B": "統一美債10年Aa-A",
    "00856B": "永豐1-3年美公債", "00857B": "永豐20年美公債",
    "00858": "永豐美國500大", "00859B": "群益0-1年美債",
    "00860B": "群益1-5年投資級債", "00861": "元大全球未來通訊",
    "00862B": "中信投資級公司債", "00863B": "中信全球電信債",
    "00864B": "中信美國公債0-1", "00865B": "中信美國公債20年",
    "00866B": "中信ESG投資級債", "00867B": "新光A-BBB電信債",
    "00868B": "FTNN20年美債", "00869B": "FTNN10年美債",
    "00870B": "元大15年EM主權債", "00871B": "元大10年IG銀行債",
    "00872B": "凱基1-5年美債", "00873B": "凱基10年IG金融債",
    "00875B": "中信A級科技債", "00876B": "中信A級醫療債",
    "00877B": "中信A級公用債", "00878": "國泰永續高股息",
    "00879B": "凱基新興債10+", "00880B": "凱基ESG新興債",
    "00881": "國泰台灣5G+", "00882": "中信中國高股息",
    "00883B": "中信ESG20年美債", "00884B": "中信低碳新興債",
    "00885": "富邦越南", "00886": "永豐美國科技",
    "00887": "永豐中國科技50大", "00888": "永豐台灣ESG",
    "00889": "富邦台灣半導體", "00890B": "凱基ESG BBB債15+",
    "00891": "中信關鍵半導體", "00892": "富邦台灣半導體",
    "00893": "國泰智能電動車", "00894": "中信小資高價30",
    "00895": "富邦未來車", "00896": "中信綠能及電動車",
    "00897": "富邦基因免疫生技", "00898": "國泰基因免疫革命",
    "00899": "FT潔淨能源", "00900": "富邦特選高股息30",
    "00901": "永豐智能車供應鏈", "00902": "中信電池及儲能",
    "00903": "富邦元宇宙", "00904": "新光臺灣半導體30",
    "00905": "FT臺灣Smart", "00907": "永豐優息存股",
    "00908": "富邦入息REITs+", "00909": "國泰數位支付服務",
    "00910": "第一金太空衛星", "00911": "兆豐洲際半導體",
    "00912": "中信臺灣智慧50", "00913": "兆豐台灣晶圓製造",
    "00915": "凱基優選高股息30", "00916": "國泰全球品牌50",
    "00917": "中信特選金融", "00918": "大華優利高填息30",
    "00919": "群益台灣精選高息", "00920": "兆豐台灣ESG永續",
    "00921": "兆豐龍頭等權重", "00922": "國泰台灣領袖50",
    "00923": "群益台ESG低碳50", "00924": "復華S&P500成長",
    "00925": "富邦ESG綠色電力", "00926": "凱基全球菁英55",
    "00927": "群益半導體收益", "00928": "中信上櫃ESG30",
    "00929": "復華台灣科技優息", "00930": "永豐ESG低碳高息",
    "00931B": "統一美債20年", "00932": "兆豐永續高息等權",
    "00933B": "國泰10Y+金融債", "00934": "中信成長高股息",
    "00935": "野村臺灣新科技50", "00936": "台新永續高息中小",
    "00937B": "群益ESG投等債20+", "00938": "凱基優選30",
    "00939": "統一台灣高息動能", "00940": "元大台灣價值高息",
    "00941": "中信上游半導體", "00942B": "台新美A公司債20+",
    "00943": "兆豐電子高息等權", "00944": "野村趨勢動能高息",
    "00945B": "凱基美國非投等債", "00946": "群益科技高息成長",
    "00947": "台新臺灣IC設計", "00948B": "中信優息投資級債",
    "00949": "復華日本龍頭", "00950B": "凱基A級公司債",
    "00951": "台新日本半導體", "00952": "凱基台灣AI50",
    "00953B": "群益優選非投等債", "00954": "中信日本半導體",
    "00955": "中信日本商社", "00956": "中信日經高股息",
    "00957B": "兆豐US優選投等債", "00958B": "永豐ESG銀行債15+",
    "00959B": "街口美國非投等債", "00960": "野村全球航運龍頭",
    "00961": "富邦台美雙盈", "00962": "中信亞太高股息",
    "00963": "中信臺灣 ESG 增長", "00965": "元大航太防衛科技",
    "00966B": "元大10年ESG投等債", "009800": "中信NASDAQ",
    "009801": "中信美國藍籌30", "009802": "元大全球優質龍頭",
    "009803": "保德信台商全方位", "009804": "兆豐全球債券ETF",
    "009805": "野村全球航太防衛", "009806": "元大全球半導體",
    "009807": "統一ESG投等債", "009808": "台新全球優選短債",
    "009809": "凱基全球10大品牌", "009810": "第一金全球衛星",
    "009811": "富邦全球航太防衛", "009812": "元大全球基建",
    "009813": "元大全球AI", "009815": "元大全球公用能源",
    "009816": "凱基台灣TOP50", "009817": "凱基全球優選ETF",
    "009818": "華南我國多重資產", "009819": "元大全球航太防衛",
    "009820": "中信台灣優選成長", "009821": "凱基全球AI",
    "009822": "凱基全球永續", "009823": "復華台灣科技高息",
    "009824": "元大全球優質龍頭",
    "00403A": "主動統一升級50",
    "00981A": "主動統一台股增長",
}

STOCK_MONEY = {
    "泰金寶-DR": "半年配息",
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
    "元大台灣50": "半年配息",
    "元大中型100": "年配息",
    "元大富櫃50": "年配息",
    "元大MSCI金融": "年配息",
    "元大摩台基金": "年配息",
    "元大上證50": "年配息",
    "元大MSCI台灣": "年配息",
    "永豐臺灣加權": "年配息",
    "富邦上証": "年配息",
    "復華滬深": "年配息",
    "富邦台50": "半年配息",
    "元大台灣50反1": "不配息配股",
    "元大台灣高息低波": "季配息",
    "國泰永續高股息": "季配息",
    "國泰台灣5G+": "季配息",
    "中信關鍵半導體": "季配息",
    "中信小資高價30": "季配息",
    "富邦未來車": "年配息",
    "富邦特選高股息30": "季配息",
    "群益台灣精選高息": "季配息",
    "復華台灣科技優息": "月配息",
    "元大臺灣ESG永續": "季配息",
    "中信成長高股息": "季配息",
    "統一台灣高息動能": "月配息",
    "元大台灣價值高息": "月配息",
    "群益科技高息成長": "月配息",
    "凱基優選高股息30": "季配息",
    "群益半導體收益": "月配息",
    "大華優利高填息30": "季配息",
    "兆豐永續高息等權": "月配息",
    "復華日本龍頭": "季配息",
    "富邦越南": "年配息",
    "中信中國高股息": "季配息",
    "統一FANG+": "年配息",
    "國泰費城半導體": "年配息",
    "元大全球AI": "年配息",
    "凱基台灣TOP50": "不配息配股",
    "主動統一升級50": "季配息",
    "主動統一台股增長": "年配息",
    "富邦台灣半導體": "季配息",
    "群益台ESG低碳50": "季配息",
    "國泰台灣領袖50": "半年配息",
    "凱基優選30": "季配息",
    "野村趨勢動能高息": "月配息",
    "台新永續高息中小": "月配息",
    "兆豐電子高息等權": "月配息",
    "中信上游半導體": "年配息",
    "台新臺灣IC設計": "年配息",
    "永豐ESG低碳高息": "月配息",
    "野村臺灣新科技50": "年配息",
    "兆豐龍頭等權重": "半年配息",
    "中信上櫃ESG30": "年配息",
    "凱基台灣AI50": "季配息",
    "富邦公司治理": "年配息",
    "兆豐藍籌30": "半年配息",
    "第一金工業精選": "半年配息",
    "富邦臺灣中小": "半年配息",
    "元大美債20年": "季配息",
    "國泰20年美債": "季配息",
    "元大投資級公司債": "季配息",
    "群益ESG投等債20+": "月配息",
    "國泰10Y+金融債": "月配息",
    "中信優息投資級債": "月配息",
    "凱基美國非投等債": "月配息",
    "群益優選非投等債": "月配息",
    "元大10年IG銀行債": "季配息",
    "元大10年IG科技債": "季配息",
    "群益投資級電信債": "季配息",
    "群益投資級金融債": "季配息",
    "復華彭博非投等債": "季配息",
    "復華富時不動產": "季配息",
    "富邦入息REITs+": "季配息",
    "中信電池及儲能": "年配息",
    "永豐台灣ESG": "年配息",
    "永豐美國500大": "年配息",
    "國泰智能電動車": "年配息",
    "富邦元宇宙": "年配息"
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

ETF_DIVIDEND_FALLBACK = {
    # ETF code -> {dividendYield (decimal), trailingPE (for fair value), priceToBook}
    "00403A.TW": {"dividendYield": None, "trailingPE": None, "priceToBook": None},
    "009816.TW": {"dividendYield": None, "trailingPE": 32.3, "priceToBook": None},
    "00981A.TW": {"dividendYield": None, "trailingPE": None, "priceToBook": None},
    # Popular Taiwan ETFs with known fundamental ranges
    "0050.TW": {"dividendYield": 0.025, "trailingPE": None, "priceToBook": None},
    "0056.TW": {"dividendYield": 0.045, "trailingPE": None, "priceToBook": None},
    "00878.TW": {"dividendYield": 0.055, "trailingPE": None, "priceToBook": None},
    "00919.TW": {"dividendYield": 0.08,  "trailingPE": None, "priceToBook": None},
    "00929.TW": {"dividendYield": 0.075, "trailingPE": None, "priceToBook": None},
    "00940.TW": {"dividendYield": 0.06,  "trailingPE": None, "priceToBook": None},
    "00939.TW": {"dividendYield": 0.07,  "trailingPE": None, "priceToBook": None},
    "00946.TW": {"dividendYield": 0.07,  "trailingPE": None, "priceToBook": None},
    "00915.TW": {"dividendYield": 0.07,  "trailingPE": None, "priceToBook": None},
    "00918.TW": {"dividendYield": 0.08,  "trailingPE": None, "priceToBook": None},
    "00713.TW": {"dividendYield": 0.05,  "trailingPE": None, "priceToBook": None},
    "00881.TW": {"dividendYield": 0.04,  "trailingPE": None, "priceToBook": None},
    "00891.TW": {"dividendYield": 0.035, "trailingPE": None, "priceToBook": None},
    "00900.TW": {"dividendYield": 0.06,  "trailingPE": None, "priceToBook": None},
    "00936.TW": {"dividendYield": 0.075, "trailingPE": None, "priceToBook": None},
    "00934.TW": {"dividendYield": 0.07,  "trailingPE": None, "priceToBook": None},
    "00927.TW": {"dividendYield": 0.065, "trailingPE": None, "priceToBook": None},
    "00850.TW": {"dividendYield": 0.03,  "trailingPE": None, "priceToBook": None},
    "00922.TW": {"dividendYield": 0.03,  "trailingPE": None, "priceToBook": None},
    "00692.TW": {"dividendYield": 0.03,  "trailingPE": None, "priceToBook": None},
    "00923.TW": {"dividendYield": 0.035, "trailingPE": None, "priceToBook": None},
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


_TWSE_MOPS_CACHE: dict = {"data": {}, "time": 0}
_TWSE_MOPS_TTL = 3600  # 1 hour

def _fetch_twse_mops_ratios(stock_no: str) -> dict:
    """
    Fetch financial ratios from TWSE MOPS (公開資訊觀測站).
    Returns dict with keys: roe, roa, eps, profitMargins, operatingMargins,
    debtToEquity, bookValue, revenuePerShare, totalRevenue
    """
    now_val = time.time()
    cache_key = f"mops_{stock_no}"
    if cache_key in _TWSE_MOPS_CACHE["data"] and now_val - _TWSE_MOPS_CACHE["time"] < _TWSE_MOPS_TTL:
        return _TWSE_MOPS_CACHE["data"][cache_key]

    result = {}

    # Method A: TWSE openapi 財務比率 (t187ap14_L)
    try:
        r = requests.get(
            "https://openapi.twse.com.tw/v1/opendata/t187ap14_L",
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=15,
        )
        if r.status_code == 200:
            data = r.json()
            if isinstance(data, list):
                for row in data:
                    if str(row.get("公司代號", "")).strip() == stock_no:
                        def g(k): return _safe_float(row.get(k))
                        # ROE, ROA
                        roe = g("資產報酬率(%)")
                        roa_val = g("股東權益報酬率(%)")
                        if roe: result["returnOnEquity"] = roe / 100
                        if roa_val: result["returnOnAssets"] = roa_val / 100
                        # Profit margin
                        pm = g("稅後純益率(%)")
                        if pm: result["profitMargins"] = pm / 100
                        om = g("營業利益率(%)")
                        if om: result["operatingMargins"] = om / 100
                        # D/E ratio
                        dte = g("負債佔資產比率(%)")
                        if dte and dte < 100:
                            # Convert: debt/assets% -> debt/equity ratio
                            result["debtToEquity"] = round(dte / (100 - dte), 4) if dte != 100 else None
                        # EPS
                        eps = g("每股盈餘(元)")
                        if eps: result["trailingEps"] = eps
                        # Book value
                        bv = g("每股淨值(元)")
                        if bv: result["bookValue"] = bv
                        break
    except Exception:
        pass

    # Method B: TWSE openapi 損益資料 (t187ap04_L)
    if not result or result.get("totalRevenue") is None:
        try:
            for url in [
                "https://openapi.twse.com.tw/v1/opendata/t187ap04_L",
                "https://openapi.twse.com.tw/v1/opendata/t187ap04_P",
            ]:
                r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
                if r.status_code != 200:
                    continue
                data = r.json()
                if not isinstance(data, list):
                    continue
                for row in data:
                    if str(row.get("公司代號", "")).strip() == stock_no:
                        rev_keys = ["營業收入合計", "營業收入", "營業收入淨額", "收益"]
                        ni_keys = ["本期淨利", "稅後淨利", "本期損益", "繼續營業單位淨利"]
                        oi_keys = ["營業利益", "營業損益", "營業淨利"]
                        def _first(keys):
                            for k in keys:
                                v = _safe_float(row.get(k))
                                if v is not None: return v
                            return None
                        rev = _first(rev_keys)
                        ni = _first(ni_keys)
                        oi = _first(oi_keys)
                        if rev: result["totalRevenue"] = rev
                        if ni and rev and rev != 0 and result.get("profitMargins") is None:
                            result["profitMargins"] = round(ni / rev, 4)
                        if oi and rev and rev != 0 and result.get("operatingMargins") is None:
                            result["operatingMargins"] = round(oi / rev, 4)
                        break
                if result.get("totalRevenue"):
                    break
        except Exception:
            pass

    # Method C: TWSE 個股財務比較 API
    if not result:
        try:
            year = datetime.now().year - 1911  # ROC year
            for y in [year, year - 1]:
                for season in [4, 3, 2, 1]:
                    url = f"https://mops.twse.com.tw/mops/web/ajax_t164sb04?encodeURIComponent=1&step=1&firstin=1&off=1&TYPEK=sii&year={y}&season={season}&co_id={stock_no}"
                    try:
                        r = requests.post(url, headers={"User-Agent": "Mozilla/5.0", "Content-Type": "application/x-www-form-urlencoded"}, timeout=10)
                        if r.status_code == 200 and len(r.text) > 100:
                            import re
                            # Try to extract key numbers from HTML table
                            # EPS pattern
                            eps_match = re.search(r'基本每股盈餘.*?<td[^>]*>([\d\.\-]+)</td>', r.text, re.DOTALL)
                            if eps_match and result.get("trailingEps") is None:
                                result["trailingEps"] = _safe_float(eps_match.group(1))
                            if result.get("trailingEps"):
                                break
                    except Exception:
                        continue
                if result.get("trailingEps"):
                    break
        except Exception:
            pass

    if result:
        _TWSE_MOPS_CACHE["data"][cache_key] = result
        _TWSE_MOPS_CACHE["time"] = now_val

    return result


def _fetch_etf_dividend_from_twse(stock_no: str, current_price: float) -> dict:
    """
    Fetch ETF dividend data from TWSE distribution history API.
    Returns dict with dividendYield, dividendRate, exDividendDate.
    """
    result = {}
    try:
        # TWSE ETF 配息紀錄
        for url in [
            f"https://openapi.twse.com.tw/v1/exchangeReport/TWT49U?stockNo={stock_no}",
            f"https://openapi.twse.com.tw/v1/opendata/t86",
        ]:
            try:
                r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
                if r.status_code != 200:
                    continue
                data = r.json()
                if not isinstance(data, list) or not data:
                    continue
                # Filter for this stock
                rows = [d for d in data if str(d.get("證券代號", d.get("stockNo", ""))).strip() == stock_no]
                if not rows:
                    continue
                # Sum dividends in last 12 months
                now_ts = time.time()
                one_year_ago = now_ts - 365 * 86400
                total_div = 0.0
                latest_date = None
                for row in rows:
                    date_str = row.get("除息日期", row.get("exDividendDate", ""))
                    amt = _safe_float(row.get("每受益權單位配息金額", row.get("dividend", row.get("配息金額", ""))))
                    if amt and date_str:
                        try:
                            # Parse ROC date format (e.g., "113/05/20")
                            parts = str(date_str).split("/")
                            if len(parts) == 3 and len(parts[0]) <= 3:
                                year_ad = int(parts[0]) + 1911
                                dt = datetime(year_ad, int(parts[1]), int(parts[2]), tzinfo=timezone.utc)
                            else:
                                dt = datetime.fromisoformat(str(date_str).replace("/", "-"))
                            if dt.timestamp() >= one_year_ago:
                                total_div += amt
                                if latest_date is None or dt.timestamp() > latest_date:
                                    latest_date = dt.timestamp()
                                    result["exDividendDate"] = date_str
                        except Exception:
                            pass
                if total_div > 0:
                    result["dividendRate"] = round(total_div, 4)
                    if current_price and current_price > 0:
                        result["dividendYield"] = round(total_div / current_price, 4)
                break
            except Exception:
                continue
    except Exception:
        pass
    return result


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
                "sector": None,
                "industry": None,
                "country": None,
                "website": None,
                "longBusinessSummary": None,
                "fullTimeEmployees": None,
                "logo_url": None,
            }


    # Method 1.5: TWSE MOPS financial ratios (supplements BWIBBU with ROE, ROA, EPS, margins)
    if symbol.endswith(".TW") or symbol.endswith(".TWO"):
        mops = _fetch_twse_mops_ratios(stock_no)
        if mops:
            if not result:
                result = mops
            else:
                for k, v in mops.items():
                    if v is not None and result.get(k) is None:
                        result[k] = v

    # Method 1.6: ETF dividend from TWSE for ETF symbols (00xxx.TW)
    _is_etf_symbol = (
        (symbol.endswith(".TW") or symbol.endswith(".TWO"))
        and (stock_no.startswith("00") or stock_no.startswith("004") or stock_no.startswith("009"))
    )
    if _is_etf_symbol and current_price and (not result or result.get("dividendYield") is None):
        etf_div = _fetch_etf_dividend_from_twse(stock_no, current_price)
        if etf_div:
            if not result:
                result = etf_div
            else:
                for k, v in etf_div.items():
                    if v is not None and result.get(k) is None:
                        result[k] = v

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
        if not result or not any(v is not None and v != "" for v in result.values()):
            result = finnhub_result
        else:
            for k, v in finnhub_result.items():
                if v is not None and v != "" and (result.get(k) is None or result.get(k) == ""):
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
                        "ytdReturn": _ks.get("ytdReturn"),
                        "totalAssets": _ks.get("totalAssets"),
                        "navPrice": _ks.get("navPrice"),
                        "threeYearAverageReturn": _ks.get("threeYearAverageReturn"),
                        "fiveYearAverageReturn": _ks.get("fiveYearAverageReturn"),
                        "annualReportExpenseRatio": _ks.get("annualReportExpenseRatio"),
                        "fundFamily": _fd.get("fundFamily"),
                        "category": _fd.get("category"),
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
                        # ETF-specific fields
                        "ytdReturn": _info.get("ytdReturn"),
                        "totalAssets": _info.get("totalAssets"),
                        "navPrice": _info.get("navPrice"),
                        "threeYearAverageReturn": _info.get("threeYearAverageReturn"),
                        "fiveYearAverageReturn": _info.get("fiveYearAverageReturn"),
                        "annualReportExpenseRatio": _info.get("annualReportExpenseRatio"),
                        "fundFamily": _info.get("fundFamily"),
                        "category": _info.get("category"),
                    }
                    # Normalize: yfinance returns some fields as percentages instead of decimals
                    # e.g., dividendYield=1.74 means 1.74%, debtToEquity=71.814 means 71.814%
                    for _pct_key in ["dividendYield", "fiveYearAvgDividendYield"]:
                        _v = _yf_data.get(_pct_key)
                        if _v is not None and _v > 0.5:
                            _yf_data[_pct_key] = _v / 100.0
                    _v_dte = _yf_data.get("debtToEquity")
                    if _v_dte is not None and _v_dte > 5:
                        _yf_data["debtToEquity"] = _v_dte / 100.0
            except Exception:
                pass

        if _yf_data and any(v is not None for v in _yf_data.values()):
            if result and any(v is not None and v != "" for v in result.values()):
                for k, v in _yf_data.items():
                    if v is not None:
                        existing = result.get(k)
                        if existing is None or (isinstance(existing, str) and existing.strip() == ""):
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

    # Yahoo v8 chart dividend fallback (works for all symbols including ETFs)
    # Use separate result dict since upstream sources may all return empty for ETFs
    _div_fallback = {}
    for _div_host in ["query1", "query2"]:
        for _div_ua in [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        ]:
            try:
                rate_limit()
                _div_url = f"https://{_div_host}.finance.yahoo.com/v8/finance/chart/{urllib.parse.quote(symbol)}?range=5y&interval=1mo&events=div"
                _div_rsp = requests.get(_div_url, headers={"User-Agent": _div_ua}, timeout=10)
                if _div_rsp.status_code != 200:
                    continue
                _div_data = _div_rsp.json()
                _div_result = _div_data.get("chart", {}).get("result", [])
                if not _div_result:
                    continue
                _events = _div_result[0].get("events", {})
                _divs = _events.get("dividends", {})
                if not _divs:
                    continue
                _latest_amt = None
                _latest_ts = 0
                for _ts_str, _evt in _divs.items():
                    _ts = int(_ts_str) if _ts_str.isdigit() else int(_evt.get("date", 0))
                    if _ts > _latest_ts:
                        _latest_ts = _ts
                        _latest_amt = _safe_float(_evt.get("amount"))
                if _latest_amt is not None:
                    _div_fallback["dividendRate"] = _latest_amt
                    if current_price and current_price > 0:
                        _div_fallback["dividendYield"] = round(_latest_amt / current_price, 4)
                    if _latest_ts > 0:
                        _div_fallback["exDividendDate"] = _latest_ts
                    break
            except Exception:
                continue
        if _div_fallback:
            break
    if _div_fallback:
        if not result:
            result = {}
        for _k, _v in _div_fallback.items():
            if result.get(_k) is None:
                result[_k] = _v

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

    sec = STOCK_SECTORS.get(symbol)
    if sec:
        result["sector"] = sec["sector"]
        result["industry"] = sec["industry"]
    elif not result.get("sector"):
        if FINNHUB_API_KEY:
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

    # ETF detection and comprehensive fallback
    _is_etf = (
        result.get("fundFamily") is not None
        or result.get("navPrice") is not None
        or symbol in ETF_DIVIDEND_FALLBACK
        or (
            (symbol.endswith(".TW") or symbol.endswith(".TWO"))
            and (stock_no.startswith("00") or stock_no.startswith("004") or stock_no.startswith("009"))
        )
        or (
            symbol in STOCK_NAMES
            and any(kw in STOCK_NAMES[symbol]["name"] for kw in ["元大", "富邦", "國泰", "群益", "中信", "永豐", "復華", "凱基", "台新", "統一", "兆豐", "新光", "第一金", "野村", "大華", "期街口", "街口", "FT", "FTNN"])
        )
    )

    if _is_etf:
        if result.get("fundFamily") is None:
            _known_family = None
            _name = STOCK_NAMES.get(symbol, {}).get("name", "")
            for _kw, _fam in [("元大", "元大投信"), ("富邦", "富邦投信"), ("國泰", "國泰投信"),
                              ("群益", "群益投信"), ("中信", "中信投信"), ("永豐", "永豐投信"),
                              ("復華", "復華投信"), ("凱基", "凱基投信"), ("台新", "台新投信"),
                              ("統一", "統一投信"), ("兆豐", "兆豐投信"), ("新光", "新光投信"),
                              ("第一金", "第一金投信"), ("野村", "野村投信"), ("大華", "大華投信"),
                              ("期街口", "街口投信"), ("街口", "街口投信"), ("FT", "富蘭克林華美投信"),
                              ("FTNN", "富蘭克林華美投信")]:
                if _kw in _name:
                    _known_family = _fam
                    break
            if _known_family:
                result["fundFamily"] = _known_family
                if result.get("category") is None:
                    _cat = None
                    _lc_name = _name.lower()
                    if any(kw in _lc_name for kw in ["美債", "美公債", "20年美債", "美債20"]):
                        _cat = "美國政府債券"
                    elif any(kw in _lc_name for kw in ["公司債", "金融債", "電信債", "科技債", "醫療債", "投資級"]):
                        _cat = "公司債券"
                    elif any(kw in _lc_name for kw in ["高股息", "高息", "價值高息", "精選高息"]):
                        _cat = "台股高股息"
                    elif any(kw in _lc_name for kw in ["半導體", "IC設計", "晶圓"]):
                        _cat = "半導體"
                    elif any(kw in _lc_name for kw in ["電動車", "未來車"]):
                        _cat = "電動車"
                    elif any(kw in _lc_name for kw in ["AI", "人工智慧"]):
                        _cat = "人工智慧"
                    elif any(kw in _lc_name for kw in ["5G", "通訊"]):
                        _cat = "通訊"
                    elif any(kw in _lc_name for kw in ["ESG", "永續", "公司治理"]):
                        _cat = "ESG"
                    elif any(kw in _lc_name for kw in ["上証", "滬深", "中國", "深証", "香港"]):
                        _cat = "中國股市"
                    elif any(kw in _lc_name for kw in ["S&P500", "NASDAQ", "美國", "美股"]):
                        _cat = "美國股市"
                    elif any(kw in _lc_name for kw in ["臺灣50", "台50", "台灣50", "台灣", "臺灣加權"]):
                        _cat = "台股大型股"
                    elif any(kw in _lc_name for kw in ["中小", "上櫃"]):
                        _cat = "台股中小型"
                    elif any(kw in _lc_name for kw in ["非投等債", "新興債", "新興市場"]):
                        _cat = "新興市場債券"
                    elif any(kw in _lc_name for kw in ["REIT", "不動產", "REITs"]):
                        _cat = "不動產"
                    elif any(kw in _lc_name for kw in ["越南", "印度", "日本", "歐洲"]):
                        _cat = "國際股市"
                    elif any(kw in _lc_name for kw in ["原油", "黃金", "白銀", "銅", "商品", "原物料"]):
                        _cat = "商品"
                    elif any(kw in _lc_name for kw in ["生技", "基因", "醫療"]):
                        _cat = "生技醫療"
                    elif any(kw in _lc_name for kw in ["航運", "太空", "航太"]):
                        _cat = "航運/航太"
                    elif any(kw in _lc_name for kw in ["元宇宙", "電動車", "潔淨", "綠能"]):
                        _cat = "科技主題"
                    if _cat:
                        result["category"] = _cat

        if result.get("totalAssets") is None:
            # Infer fund size from name patterns; use a default placeholder
            _known = STOCK_NAMES.get(symbol, {}).get("name", "")
            result["totalAssets"] = None  # Keep null so frontend shows "N/A"

        if result.get("annualReportExpenseRatio") is None:
            # Assign estimated expense ratio based on category
            _cat = result.get("category", "")
            if "債券" in _cat or "美債" in _cat:
                result["annualReportExpenseRatio"] = 0.0025
            elif "高股息" in _cat:
                result["annualReportExpenseRatio"] = 0.0035
            elif "半導體" in _cat or "AI" in _cat or "科技" in _cat:
                result["annualReportExpenseRatio"] = 0.0040
            elif "國際" in _cat or "中國" in _cat or "美國" in _cat:
                result["annualReportExpenseRatio"] = 0.0050
            else:
                result["annualReportExpenseRatio"] = 0.0030

        if result.get("navPrice") is None and current_price:
            # Use current price as proxy for NAV (common for Taiwan ETFs where NAV ~= price)
            result["navPrice"] = current_price

    # ETF fallback: supplement dividend yield from manual lookup when all sources fail
    if result is not None and symbol in ETF_DIVIDEND_FALLBACK:
        _ef = ETF_DIVIDEND_FALLBACK[symbol]
        for _efk in ("dividendYield", "trailingPE", "priceToBook"):
            if result.get(_efk) is None and _ef.get(_efk) is not None:
                result[_efk] = _ef[_efk]
        if result.get("dividendRate") is None and result.get("dividendYield") and current_price:
            result["dividendRate"] = round(result["dividendYield"] * current_price, 4)

    # DR stock handling: fetch fundamentals from parent company
    _DR_PARENT_MAP = {
        "9105": "CCET.BK",   # 泰金寶-DR -> Cal-Comp Electronics Thailand
        "9104": "WHA.BK",    # 泰聚亨-DR -> WHA Corporation Thailand
        "9103": "SCCC.BK",   # 泰崇越-DR -> Siam City Cement
        "9102": "SCC.BK",    # 泰金屬-DR -> Siam Cement Group
        "9101": "PTT.BK",    # 泰石油-DR -> PTT PCL
        "9108": "HMPRO.BK",  # 泰樺-DR -> Home Product Center
        "9110": "DELTA.BK",  # 泰達電-DR -> Delta Electronics Thailand
    }
    _parent_sym = _DR_PARENT_MAP.get(stock_no)
    if _parent_sym:
        try:
            _dr_data = None
            for _qs in ["query1", "query2"]:
                try:
                    rate_limit()
                    _url = f"https://{_qs}.finance.yahoo.com/v10/finance/quoteSummary/{urllib.parse.quote(_parent_sym)}?modules=summaryDetail,defaultKeyStatistics,financialData"
                    _rsp = requests.get(_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
                    if _rsp.status_code != 200:
                        continue
                    _q = _rsp.json().get("quoteSummary", {}).get("result", [{}])[0]
                    if not _q:
                        continue
                    _sd = {k: v.get("raw") if isinstance(v, dict) else v for k, v in _q.get("summaryDetail", {}).items()}
                    _ks = {k: v.get("raw") if isinstance(v, dict) else v for k, v in _q.get("defaultKeyStatistics", {}).items()}
                    _fd = {k: v.get("raw") if isinstance(v, dict) else v for k, v in _q.get("financialData", {}).items()}
                    _dr_data = {
                        "trailingEps": _ks.get("trailingEps"),
                        "forwardEps": _ks.get("forwardEps"),
                        "trailingPE": _sd.get("trailingPE"),
                        "forwardPE": _sd.get("forwardPE"),
                        "priceToBook": _ks.get("priceToBook"),
                        "bookValue": _ks.get("bookValue"),
                        "returnOnEquity": _fd.get("returnOnEquity"),
                        "returnOnAssets": _fd.get("returnOnAssets"),
                        "profitMargins": _fd.get("profitMargins"),
                        "operatingMargins": _fd.get("operatingMargins"),
                        "totalRevenue": _fd.get("totalRevenue"),
                        "revenuePerShare": _fd.get("revenuePerShare"),
                        "debtToEquity": _fd.get("debtToEquity"),
                        "payoutRatio": _sd.get("payoutRatio"),
                        "dividendYield": _sd.get("dividendYield"),
                        "dividendRate": _sd.get("dividendRate"),
                        "fiveYearAvgDividendYield": _sd.get("fiveYearAvgDividendYield"),
                        "beta": _ks.get("beta"),
                    }
                    break
                except Exception:
                    continue
            # Fallback: yfinance Ticker
            if not _dr_data or not any(v is not None for v in _dr_data.values()):
                try:
                    import socket as _sock
                    _old_to = _sock.getdefaulttimeout()
                    _sock.setdefaulttimeout(15)
                    try:
                        _pt = yf.Ticker(_parent_sym)
                        _pi = dict(_pt.info) if _pt.info else {}
                    finally:
                        _sock.setdefaulttimeout(_old_to)
                    if _pi:
                        _dr_data = {
                            "trailingEps": _pi.get("trailingEps"),
                            "forwardEps": _pi.get("forwardEps"),
                            "trailingPE": _pi.get("trailingPE"),
                            "forwardPE": _pi.get("forwardPE"),
                            "priceToBook": _pi.get("priceToBook"),
                            "bookValue": _pi.get("bookValue"),
                            "returnOnEquity": _pi.get("returnOnEquity"),
                            "returnOnAssets": _pi.get("returnOnAssets"),
                            "profitMargins": _pi.get("profitMargins"),
                            "operatingMargins": _pi.get("operatingMargins"),
                            "totalRevenue": _pi.get("totalRevenue"),
                            "revenuePerShare": _pi.get("revenuePerShare"),
                            "debtToEquity": _pi.get("debtToEquity"),
                            "payoutRatio": _pi.get("payoutRatio"),
                            "dividendYield": _pi.get("dividendYield"),
                            "dividendRate": _pi.get("dividendRate"),
                            "beta": _pi.get("beta"),
                        }
                except Exception:
                    pass
            if _dr_data:
                if not result:
                    result = {}
                for k, v in _dr_data.items():
                    if v is not None and result.get(k) is None:
                        result[k] = v
                # Normalize percentages
                for _pk in ["dividendYield", "returnOnEquity", "returnOnAssets", "profitMargins", "operatingMargins"]:
                    _v = result.get(_pk)
                    if _v is not None and abs(_v) > 1:
                        result[_pk] = _v / 100.0
        except Exception:
            pass

    # ETF: fetch totalAssets and detailed dividend from TWSE openapi
    if _is_etf and (symbol.endswith(".TW") or symbol.endswith(".TWO")):
        # Try to get totalAssets from TWSE ETF openapi
        if result.get("totalAssets") is None:
            try:
                for _etf_url in [
                    "https://openapi.twse.com.tw/v1/exchangeReport/ETF_BASIC",
                    "https://openapi.twse.com.tw/v1/opendata/t00sb08",
                ]:
                    try:
                        _er = requests.get(_etf_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
                        if _er.status_code != 200:
                            continue
                        _ed = _er.json()
                        if not isinstance(_ed, list):
                            continue
                        for _row in _ed:
                            _code = str(_row.get("證券代號", _row.get("ETFcode", ""))).strip()
                            if _code == stock_no:
                                _assets = _safe_float(_row.get("基金規模(億元)", _row.get("規模", _row.get("totalAssets", ""))))
                                if _assets:
                                    # Convert 億元 to TWD
                                    result["totalAssets"] = _assets * 1e8
                                _nav = _safe_float(_row.get("每單位淨值", _row.get("navPrice", "")))
                                if _nav and result.get("navPrice") is None:
                                    result["navPrice"] = _nav
                                break
                        if result.get("totalAssets"):
                            break
                    except Exception:
                        continue
            except Exception:
                pass

        # Fetch ETF P/E ratio from TWSE ETF composition
        if result.get("trailingPE") is None:
            try:
                _pe_url = f"https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_ALL"
                _pe_r = requests.get(_pe_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
                if _pe_r.status_code == 200:
                    _pe_data = _pe_r.json()
                    if isinstance(_pe_data, list):
                        for _row in _pe_data:
                            if str(_row.get("Code", "")).strip() == stock_no:
                                _pe = _safe_float(_row.get("PEratio"))
                                _pb = _safe_float(_row.get("PBratio"))
                                _dy = _safe_float(_row.get("DividendYield"))
                                if _pe and result.get("trailingPE") is None:
                                    result["trailingPE"] = _pe
                                if _pb and result.get("priceToBook") is None:
                                    result["priceToBook"] = _pb
                                    if current_price and result.get("bookValue") is None:
                                        result["bookValue"] = round(current_price / _pb, 4)
                                if _dy and result.get("dividendYield") is None:
                                    result["dividendYield"] = _dy / 100
                                    if current_price and result.get("dividendRate") is None:
                                        result["dividendRate"] = round(_dy / 100 * current_price, 4)
                                break
            except Exception:
                pass

        # ETF annual return from chart data
        if result.get("ytdReturn") is None or result.get("threeYearAverageReturn") is None:
            try:
                _chart_1y = _fetch_yahoo_chart_data(symbol, period="1y", interval="1mo")
                _chart_3y = _fetch_yahoo_chart_data(symbol, period="3y", interval="1mo")
                if _chart_1y and len(_chart_1y) >= 2:
                    _c1 = [d["close"] for d in _chart_1y if d.get("close", 0) > 0]
                    if _c1 and result.get("ytdReturn") is None:
                        result["ytdReturn"] = round((_c1[-1] - _c1[0]) / _c1[0], 4)
                if _chart_3y and len(_chart_3y) >= 12:
                    _c3 = [d["close"] for d in _chart_3y if d.get("close", 0) > 0]
                    if _c3 and result.get("threeYearAverageReturn") is None:
                        _3yr = (_c3[-1] - _c3[0]) / _c3[0]
                        result["threeYearAverageReturn"] = round(_3yr / 3, 4)
            except Exception:
                pass

    result["isETF"] = _is_etf

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


def _add_company_info_and_premium(result: dict, symbol: str, current_price: float):
    if symbol.endswith(".TW") or symbol.endswith(".TWO"):
        company = _fetch_twse_company_info(symbol)
        if company:
            fields = {
                "_chairman": "\u8463\u4e8b\u9577",
                "_generalManager": "\u7e3d\u7d93\u7406",
                "_spokesperson": "\u767c\u8a00\u4eba",
                "_spokespersonTitle": "\u767c\u8a00\u4eba\u8077\u7a31",
                "_deputySpokesperson": "\u4ee3\u7406\u767c\u8a00\u4eba",
                "_establishedDate": "\u6210\u7acb\u65e5\u671f",
                "_listingDate": "\u4e0a\u5e02\u65e5\u671f",
                "_phone": "\u7e3d\u6a5f\u96fb\u8a71",
                "_address": "\u4f4f\u5740",
                "_capital": "\u5be6\u6536\u8cc7\u672c\u984d",
                "_shareTransferAgency": "\u80a1\u7968\u904e\u6236\u6a5f\u69cb",
                "_auditorFirm": "\u7c3d\u8b49\u6703\u8a08\u5e2b\u4e8b\u52d9\u6240",
                "_auditor1": "\u7c3d\u8b49\u6703\u8a08\u5e2b\u0031",
                "_auditor2": "\u7c3d\u8b49\u6703\u8a08\u5e2b\u0032",
                "_fax": "\u50b3\u771f\u6a5f\u865f\u78bc",
                "_email": "\u96fb\u5b50\u90f5\u4ef6\u4fe1\u7bb1",
            }
            for eng_key, tw_key in fields.items():
                val = company.get(tw_key)
                if val is not None and str(val).strip():
                    result[eng_key] = str(val).strip()

    eps = result.get("trailingEps")
    book_value = result.get("bookValue")
    sector = result.get("sector", "")
    avg_pe = SECTOR_AVG_PE.get(sector, DEFAULT_AVG_PE)
    fair_value = None
    fair_method = None
    if eps is not None and eps > 0:
        fair_value = eps * avg_pe
        fair_method = "pe_based"
    elif book_value is not None and book_value > 0:
        fair_value = book_value * 1.2
        fair_method = "pb_based"
    if fair_value is not None and fair_value > 0 and current_price > 0:
        result["_fairValue"] = fair_value
        result["_fairValueMethod"] = fair_method
        result["_premium"] = ((current_price - fair_value) / fair_value) * 100

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
            result.update({k: v for k, v in fund.items() if v is not None and v != ""})
            _add_company_info_and_premium(result, symbol, cur)
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
        result.update({k: v for k, v in fund.items() if v is not None and v != ""})
        _add_company_info_and_premium(result, symbol, cur)
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
_RATE_LIMIT_LOCK = threading.Lock()
_realtime_history: dict[str, list[dict]] = {}
_realtime_history_lock = threading.Lock()


def _cache_stock_name(symbol: str, name: str):
    """Auto-populate STOCK_NAMES from API responses."""
    if symbol and name and name != symbol and symbol not in STOCK_NAMES:
        market = "TW" if symbol.endswith(".TW") else "HK" if symbol.endswith(".HK") else "US"
        STOCK_NAMES[symbol] = {"name": name, "market": market}


def rate_limit():
    global _LAST_REQUEST_TIME, _RATE_LIMIT_LOCK
    with _RATE_LIMIT_LOCK:
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
        # Premium / fair value
        "premium": safe(info.get("_premium")),
        "fairValue": safe(info.get("_fairValue")),
        "fairValueMethod": safe_str(info.get("_fairValueMethod")),
        # Company management info (Taiwan stocks)
        "chairman": safe_str(info.get("_chairman")),
        "generalManager": safe_str(info.get("_generalManager")),
        "spokesperson": safe_str(info.get("_spokesperson")),
        "spokespersonTitle": safe_str(info.get("_spokespersonTitle")),
        "deputySpokesperson": safe_str(info.get("_deputySpokesperson")),
        "establishedDate": safe_str(info.get("_establishedDate")),
        "listingDate": safe_str(info.get("_listingDate")),
        "phone": safe_str(info.get("_phone")),
        "companyAddress": safe_str(info.get("_address")),
        "capital": safe(info.get("_capital")),
        "shareTransferAgency": safe_str(info.get("_shareTransferAgency")),
        "auditorFirm": safe_str(info.get("_auditorFirm")),
        "auditor1": safe_str(info.get("_auditor1")),
        "auditor2": safe_str(info.get("_auditor2")),
        "fax": safe_str(info.get("_fax")),
        "companyEmail": safe_str(info.get("_email")),
        # ETF-specific fields
        "ytdReturn": safe(info.get("ytdReturn")),
        "totalAssets": safe(info.get("totalAssets")),
        "navPrice": safe(info.get("navPrice")),
        "threeYearAverageReturn": safe(info.get("threeYearAverageReturn")),
        "fiveYearAverageReturn": safe(info.get("fiveYearAverageReturn")),
        "annualReportExpenseRatio": safe(info.get("annualReportExpenseRatio")),
        "fundFamily": safe_str(info.get("fundFamily")),
        "category": safe_str(info.get("category")),
        "isETF": info.get("isETF", False),
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

    is_etf = info.get("isETF", False)

    if is_etf:
        # ETF-specific sentiment analysis
        er = info.get("annualReportExpenseRatio")
        if er is not None:
            if er < 0.003:
                signals.append({"factor": "費用率", "value": f"{er*100:.3f}%", "signal": "bullish", "reason": "費用率低於0.3%，持有成本低"})
                bullish_count += 1
            elif er > 0.008:
                signals.append({"factor": "費用率", "value": f"{er*100:.3f}%", "signal": "bearish", "reason": "費用率高於0.8%，長期成本偏高"})
                bearish_count += 1
            else:
                signals.append({"factor": "費用率", "value": f"{er*100:.3f}%", "signal": "neutral", "reason": "費用率在合理範圍"})

        nav = info.get("navPrice")
        price = info.get("currentPrice", info.get("regularMarketPrice", 0))
        if nav and price:
            premium = (price - nav) / nav * 100
            if premium > 2:
                signals.append({"factor": "溢價幅度", "value": f"+{premium:.2f}%", "signal": "bearish", "reason": "溢價超過2%，買入成本偏高"})
                bearish_count += 1
            elif premium < -2:
                signals.append({"factor": "折價幅度", "value": f"{premium:.2f}%", "signal": "bullish", "reason": "折價超過2%，可用低於淨值買入"})
                bullish_count += 1
            else:
                signals.append({"factor": "折溢價", "value": f"{premium:+.2f}%", "signal": "neutral", "reason": "折溢價在合理範圍內"})

        dy = info.get("dividendYield")
        if dy is not None:
            if dy > 0.05:
                signals.append({"factor": "配息殖利率", "value": f"{dy*100:.2f}%", "signal": "bullish", "reason": "殖利率高於5%，配息穩定"})
                bullish_count += 1
            elif dy < 0.01:
                signals.append({"factor": "配息殖利率", "value": f"{dy*100:.2f}%", "signal": "bearish", "reason": "殖利率低於1%"})
                bearish_count += 1
            else:
                signals.append({"factor": "配息殖利率", "value": f"{dy*100:.2f}%", "signal": "neutral", "reason": "殖利率適中"})

        ta = info.get("totalAssets")
        if ta is not None:
            if ta >= 10e9:
                signals.append({"factor": "基金規模", "value": f"${ta/1e9:.1f}B", "signal": "bullish", "reason": "規模超過100億，流動性佳"})
                bullish_count += 1
            elif ta < 100e6:
                signals.append({"factor": "基金規模", "value": f"${ta/1e6:.0f}M", "signal": "bearish", "reason": "規模低於1億，流動性可能不足"})
                bearish_count += 1
            else:
                signals.append({"factor": "基金規模", "value": f"${ta/1e9:.1f}B", "signal": "neutral", "reason": "規模適中"})

        ytd = info.get("ytdReturn")
        if ytd is not None:
            if ytd > 0.10:
                signals.append({"factor": "年初至今報酬", "value": f"{ytd*100:.2f}%", "signal": "bullish", "reason": "YTD表現優異，動能強勁"})
                bullish_count += 1
            elif ytd < -0.10:
                signals.append({"factor": "年初至今報酬", "value": f"{ytd*100:.2f}%", "signal": "bearish", "reason": "YTD跌幅超過10%，表現疲弱"})
                bearish_count += 1
            else:
                signals.append({"factor": "年初至今報酬", "value": f"{ytd*100:.2f}%", "signal": "neutral", "reason": "YTD表現平穩"})
    else:
        pe = info.get("trailingPE")

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


def _stock_timezone(symbol: str) -> timezone:
    if symbol.endswith(".TW") or symbol.endswith(".TWO"):
        return timezone(timedelta(hours=8))
    return timezone(timedelta(hours=-4))

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
            dt = datetime.fromtimestamp(timestamps[i], tz=_stock_timezone(symbol))
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
    def _parse_int(v):
        try:
            return int(str(v).replace(",", ""))
        except (ValueError, TypeError):
            return 0

    def _fetch_institutional(_ds):
        try:
            rate_limit()
            # selectType=ALL returns ALL stocks (no per-stock filter works on TWSE T86)
            _u = f"https://www.twse.com.tw/fund/T86?response=json&date={_ds}&selectType=ALL"
            _r = requests.get(_u, headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
            if _r.status_code != 200:
                return None
            _j = _r.json()
            if _j.get("stat") != "OK":
                return None
            return {"date": _ds, "data": _j.get("data", [])}
        except Exception:
            return None

    try:
        with ThreadPoolExecutor(max_workers=3) as _ex:
            _futs = {_ex.submit(_fetch_institutional, _ds): _ds for _ds in _date_strs[-10:]}  # last 10 trading days only
            for _f in as_completed(_futs):
                _ds = _futs[_f]
                try:
                    _result = _f.result()
                    if not _result:
                        continue
                    _rows = _result.get("data", [])
                    if not _rows:
                        continue
                    for _row in _rows:
                        if len(_row) >= 19 and str(_row[0]).strip() == _sn:
                            # TWSE T86 fields (19 fields, indices 0-18):
                            # 0:stock_code 1:stock_name
                            # 2:foreign_buy_excl_prop 3:foreign_sell_excl_prop 4:foreign_net_excl_prop
                            # 5:foreign_prop_buy 6:foreign_prop_sell 7:foreign_prop_net
                            # 8:it_buy 9:it_sell 10:it_net
                            # 11:dealer_net_combined
                            # 12:dealer_self_buy 13:dealer_self_sell 14:dealer_self_net
                            # 15:dealer_hedge_buy 16:dealer_hedge_sell 17:dealer_hedge_net
                            # 18:total_net
                            _f_buy = _parse_int(_row[2]) + _parse_int(_row[5])
                            _f_sell = _parse_int(_row[3]) + _parse_int(_row[6])
                            _it_buy = _parse_int(_row[8])
                            _it_sell = _parse_int(_row[9])
                            _d_buy = _parse_int(_row[12]) + _parse_int(_row[15])
                            _d_sell = _parse_int(_row[13]) + _parse_int(_row[16])
                            _total_buy = _f_buy + _it_buy + _d_buy
                            _total_sell = _f_sell + _it_sell + _d_sell
                            _results[_ds] = {
                                "foreignBuy": _f_buy,
                                "foreignSell": _f_sell,
                                "foreignNet": _parse_int(_row[4]) + _parse_int(_row[7]),
                                "itBuy": _it_buy,
                                "itSell": _it_sell,
                                "itNet": _parse_int(_row[10]),
                                "dealerBuy": _d_buy,
                                "dealerSell": _d_sell,
                                "dealerNet": _parse_int(_row[11]),
                                "totalBuy": _total_buy,
                                "totalSell": _total_sell,
                                "totalNet": _total_buy - _total_sell,
                            }
                            break
                except Exception:
                    pass

        _data = []
        for _k in sorted(_results.keys()):
            _r = _results[_k].copy()
            _y = _k[:4]
            _m = _k[4:6]
            _d = _k[6:8]
            _r["date"] = f"{_y}-{_m}-{_d}"
            _data.append(_r)
        return {"symbol": symbol, "data": _data}
    except Exception:
        return {"symbol": symbol, "data": []}


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
            _tz = _stock_timezone(symbol)
            if divs:
                for ts_str, evt in divs.items():
                    dt_val = datetime.fromtimestamp(evt.get("date", int(ts_str)), tz=_tz)
                    amt = _safe_float(evt.get("amount"))
                    if amt is not None:
                        div_data.append({"date": dt_val.strftime("%Y-%m-%d"), "amount": round(amt, 4)})
            splits_evt = events.get("splits", {})
            if splits_evt:
                for ts_str, evt in splits_evt.items():
                    dt_val = datetime.fromtimestamp(evt.get("date", int(ts_str)), tz=_tz)
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


@app.get("/api/stock/{symbol}/realtime-history")
async def get_realtime_history(symbol: str):
    """Return cached real-time price history for intraday chart."""
    with _realtime_history_lock:
        entries = list(_realtime_history.get(symbol, []))
    return {"symbol": symbol, "data": entries}


@app.get("/api/stock/{symbol}/etf-nav")
async def get_etf_nav(symbol: str):
    """Return ETF NAV data and premium/discount history."""
    result: dict = {"symbol": symbol, "currentNAV": None, "currentPrice": None, "premium": None, "history": []}
    stock_no = symbol.replace(".TW", "").replace(".TWO", "")
    _now = datetime.now(timezone(timedelta(hours=8)))

    # 1. Yahoo v10 NAV module
    for _host in ["query1", "query2"]:
        for _ua in [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        ]:
            try:
                rate_limit()
                _url = f"https://{_host}.finance.yahoo.com/v10/finance/quoteSummary/{urllib.parse.quote(symbol)}?modules=nav,price"
                _rsp = requests.get(_url, headers={"User-Agent": _ua}, timeout=8)
                if _rsp.status_code != 200:
                    continue
                _q = _rsp.json().get("quoteSummary", {}).get("result", [{}])[0]
                if not _q:
                    continue
                _nav = _q.get("nav", {})
                _pr = _q.get("price", {})
                _nav_price = _nav.get("regularMarketPrice", {})
                result["currentNAV"] = _nav_price.get("raw") if isinstance(_nav_price, dict) else _nav_price
                if result["currentNAV"] is None:
                    continue
                _mkt = _pr.get("regularMarketPrice", {})
                result["currentPrice"] = _mkt.get("raw") if isinstance(_mkt, dict) else _mkt
                if result["currentNAV"] and result["currentPrice"]:
                    result["premium"] = round((result["currentPrice"] - result["currentNAV"]) / result["currentNAV"] * 100, 2)
                _pclose = _nav.get("regularMarketPreviousClose", {})
                result["navPreviousClose"] = _pclose.get("raw") if isinstance(_pclose, dict) else _pclose
                break
            except Exception:
                continue
        if result.get("currentNAV") is not None:
            break

    # 2. TWSE ETF NAV history (only for likely ETF symbols: start with "00")
    if (symbol.endswith(".TW") or symbol.endswith(".TWO")) and stock_no.startswith("00"):
        for _months_back in range(3):
            _d = (_now.replace(day=1) - timedelta(days=_months_back * 30)).strftime("%Y%m%d")
            try:
                rate_limit()
                _url = f"https://www.twse.com.tw/ETF/etfNAV?response=json&date={_d}"
                _rsp = requests.get(_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
                if _rsp.status_code != 200:
                    continue
                _j = _rsp.json()
                if _j.get("stat") != "OK":
                    continue
                for _row in _j.get("data", []):
                    if len(_row) >= 6 and _row[1] == stock_no:
                        result["history"].append({
                            "date": _row[0].replace("/", "-"),
                            "nav": _safe_float(_row[3]),
                            "price": _safe_float(_row[4]),
                            "premium": _safe_float(_row[5]),
                        })
                if result["history"]:
                    break
            except Exception:
                continue
        result["history"].sort(key=lambda x: x.get("date", ""))

    return result


@app.get("/api/stock/{symbol}/etf-holdings")
async def get_etf_holdings(symbol: str):
    """Return ETF constituent stocks / holdings."""
    result: dict = {"symbol": symbol, "holdings": []}
    stock_no = symbol.replace(".TW", "").replace(".TWO", "")

    # 1. Yahoo v10 topHoldings
    for _host in ["query1", "query2"]:
        for _ua in [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        ]:
            try:
                rate_limit()
                _url = f"https://{_host}.finance.yahoo.com/v10/finance/quoteSummary/{urllib.parse.quote(symbol)}?modules=topHoldings"
                _rsp = requests.get(_url, headers={"User-Agent": _ua}, timeout=8)
                if _rsp.status_code != 200:
                    continue
                _q = _rsp.json().get("quoteSummary", {}).get("result", [{}])[0]
                if not _q:
                    continue
                _top = _q.get("topHoldings", {})
                _hl = _top.get("holdings", [])
                if not _hl:
                    continue
                for _h in _hl:
                    _sym = _h.get("symbol", "") or ""
                    if not _sym:
                        continue
                    result["holdings"].append({
                        "symbol": _sym,
                        "name": _h.get("holdingName", ""),
                        "weight": _h.get("holdingPercent", 0),
                    })
                break
            except Exception:
                continue
        if result["holdings"]:
            break

    # 2. TWSE ETF constituents (fallback, only for likely ETF symbols)
    if not result["holdings"] and (symbol.endswith(".TW") or symbol.endswith(".TWO")) and stock_no.startswith("00"):
        _dates_to_try = [(_now := datetime.now(timezone(timedelta(hours=8)))).strftime("%Y%m%d")]
        _dates_to_try.append((_now - timedelta(days=7)).strftime("%Y%m%d"))
        _dates_to_try.append((_now.replace(day=1) - timedelta(days=1)).strftime("%Y%m%d"))
        for _d in _dates_to_try:
            try:
                rate_limit()
                _url = f"https://www.twse.com.tw/ETF/etfStk?response=json&date={_d}&stockNo={stock_no}"
                _rsp = requests.get(_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
                if _rsp.status_code != 200:
                    continue
                _j = _rsp.json()
                if _j.get("stat") != "OK":
                    continue
                for _row in _j.get("data", []):
                    if len(_row) >= 3:
                        result["holdings"].append({
                            "symbol": (_row[0] + ".TW") if _row[0] and not _row[0].endswith(".TW") else _row[0],
                            "name": _row[1] if len(_row) > 1 else "",
                            "weight": _safe_float(_row[2]) if len(_row) > 2 else None,
                        })
                if result["holdings"]:
                    break
            except Exception:
                continue

    result["holdings"].sort(key=lambda x: -(x.get("weight") or 0))
    return result


@app.get("/api/stock/{symbol}/etf-analysis")
async def get_etf_analysis(symbol: str):
    """Comprehensive ETF fundamental analysis: concentration, sector exposure, fee, distribution."""
    result: dict = {
        "symbol": symbol,
        "concentration": {},
        "sectorExposure": [],
        "feeAnalysis": {},
        "distributionAnalysis": {},
        "premiumDiscountAnalysis": {},
        "performanceAnalysis": {},
        "score": {},
    }
    stock_no = symbol.replace(".TW", "").replace(".TWO", "")

    # 1. Load holdings
    holdings_resp = await get_etf_holdings(symbol)
    holdings = holdings_resp.get("holdings", [])

    # 2. Concentration metrics
    total_weight = sum(h.get("weight") or 0 for h in holdings)
    sorted_h = sorted(holdings, key=lambda x: -(x.get("weight") or 0))
    if total_weight > 0:
        top1 = sorted_h[0] if sorted_h else None
        top5 = sorted_h[:5]
        top10 = sorted_h[:10]
        result["concentration"] = {
            "top1Symbol": top1.get("symbol", "") if top1 else "",
            "top1Name": top1.get("name", "") if top1 else "",
            "top1Weight": round((top1.get("weight") or 0) / total_weight * 100, 2) if top1 else 0,
            "top5Weight": round(sum(h.get("weight") or 0 for h in top5) / total_weight * 100, 2),
            "top10Weight": round(sum(h.get("weight") or 0 for h in top10) / total_weight * 100, 2),
            "totalHoldings": len(holdings),
            "herfindahlIndex": round(sum((h.get("weight") or 0) ** 2 for h in holdings if h.get("weight")), 6),
        }

    # 3. Sector exposure (from STOCK_SECTORS for Taiwan stocks, or yfinance for others)
    sector_weights = {}
    for h in sorted_h:
        sym = h.get("symbol", "")
        weight = h.get("weight") or 0
        if not sym:
            continue
        sector_info = STOCK_SECTORS.get(sym)
        sec = ""
        ind = ""
        if sector_info:
            sec = sector_info.get("sector", "")
            ind = sector_info.get("industry", "")
        else:
            # Try yfinance for sector info
            try:
                rate_limit()
                _info = _fetch_yahoo_chart(sym)
                if _info.get("sector"):
                    sec = _info["sector"]
                    ind = _info.get("industry", "")
            except Exception:
                pass
        if sec:
            sector_weights[sec] = sector_weights.get(sec, 0) + weight
        else:
            sector_weights["其他"] = sector_weights.get("其他", 0) + weight

    if sector_weights:
        total = sum(sector_weights.values())
        result["sectorExposure"] = sorted(
            [{"sector": k, "weight": round(v / total * 100, 2)} for k, v in sector_weights.items()],
            key=lambda x: -x["weight"],
        )

    # 4. Fee analysis
    fund_info = {}
    for _host in ["query1", "query2"]:
        for _ua in [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        ]:
            try:
                rate_limit()
                _url = f"https://{_host}.finance.yahoo.com/v10/finance/quoteSummary/{urllib.parse.quote(symbol)}?modules=defaultKeyStatistics,financialData,fundProfile"
                _rsp = requests.get(_url, headers={"User-Agent": _ua}, timeout=8)
                if _rsp.status_code != 200:
                    continue
                _q = _rsp.json().get("quoteSummary", {}).get("result", [{}])[0]
                if not _q:
                    continue
                _ks = {k: v.get("raw") if isinstance(v, dict) else v for k, v in (_q.get("defaultKeyStatistics", {})).items()}
                _fd = {k: v.get("raw") if isinstance(v, dict) else v for k, v in (_q.get("financialData", {})).items()}
                _fp = _q.get("fundProfile", {})
                fund_info = {
                    "annualReportExpenseRatio": _ks.get("annualReportExpenseRatio"),
                    "totalAssets": _ks.get("totalAssets"),
                    "ytdReturn": _ks.get("ytdReturn"),
                    "threeYearAverageReturn": _ks.get("threeYearAverageReturn"),
                    "fiveYearAverageReturn": _ks.get("fiveYearAverageReturn"),
                    "fundFamily": _fd.get("fundFamily"),
                    "category": _fd.get("category"),
                    "managementInfo": _fp.get("managementInfo", {}),
                    "feesExpenses": _fp.get("feesExpenses", {}),
                    "initInvestment": _fp.get("initInvestment", {}),
                }
                break
            except Exception:
                continue
        if fund_info:
            break

    expense_ratio = fund_info.get("annualReportExpenseRatio")
    category_default = 0.005  # ~0.5% default comparison
    fee_rating = "average"
    if expense_ratio is not None:
        if expense_ratio < 0.003:
            fee_rating = "low"
        elif expense_ratio < 0.006:
            fee_rating = "average"
        else:
            fee_rating = "high"

    result["feeAnalysis"] = {
        "expenseRatio": expense_ratio,
        "expenseRatioPercent": round(expense_ratio * 100, 3) if expense_ratio else None,
        "feeRating": fee_rating,
        "categoryAvgExpenseRatio": category_default,
        "totalAssets": fund_info.get("totalAssets"),
        "totalAssetsFormatted": f"${fund_info['totalAssets']:,.0f}" if fund_info.get("totalAssets") else None,
        "fundFamily": fund_info.get("fundFamily"),
        "category": fund_info.get("category"),
        "managementName": fund_info.get("managementInfo", {}).get("managerName", "") if isinstance(fund_info.get("managementInfo"), dict) else None,
        "managementSince": fund_info.get("managementInfo", {}).get("managerSince", "") if isinstance(fund_info.get("managementInfo"), dict) else None,
    }

    # 5. Distribution / dividend analysis
    try:
        _div_resp = await get_dividends(symbol)
        _divs = _div_resp.get("dividends", [])
        if _divs:
            _recent = _divs[:12]
            _amounts = [d.get("amount", 0) for d in _recent if d.get("amount")]
            _total_div = sum(_amounts)
            _count_12m = len(_amounts)
            _avg_div = _total_div / _count_12m if _count_12m > 0 else 0

            # Fetch current price for yield calc
            _price_resp = _get_stock_info(symbol)
            _cur_price = _price_resp.get("currentPrice", 0) or _price_resp.get("regularMarketPrice", 0)

            result["distributionAnalysis"] = {
                "dividendCount12m": _count_12m,
                "averageDividend": round(_avg_div, 4),
                "totalDividend12m": round(_total_div, 4),
                "distributionYield": round(_avg_div * _count_12m / _cur_price, 4) if _cur_price and _count_12m > 0 else None,
                "distributionFrequency": "月配" if _count_12m >= 10 else "季配" if _count_12m >= 3 else "半年配" if _count_12m >= 2 else "年配" if _count_12m >= 1 else "不定期",
            }
    except Exception:
        pass

    # 6. Premium/discount analysis
    _nav_resp = await get_etf_nav(symbol)
    _nav_hist = _nav_resp.get("history", [])
    if _nav_hist:
        _premiums = [r.get("premium") for r in _nav_hist if r.get("premium") is not None]
        if _premiums:
            _avg_prem = sum(_premiums) / len(_premiums)
            _max_prem = max(_premiums)
            _min_prem = min(_premiums)

            # Count days trading at premium vs discount
            _prem_days = sum(1 for p in _premiums if p > 0)
            _disc_days = sum(1 for p in _premiums if p < 0)
            _neut_days = sum(1 for p in _premiums if p == 0)

            result["premiumDiscountAnalysis"] = {
                "averagePremium": round(_avg_prem, 2),
                "maxPremium": round(_max_prem, 2),
                "minPremium": round(_min_prem, 2),
                "premiumDays": _prem_days,
                "discountDays": _disc_days,
                "neutralDays": _neut_days,
                "premiumRatio": round(_prem_days / len(_premiums) * 100, 1) if _premiums else 0,
                "dataPoints": len(_premiums),
                "currentPremium": _nav_resp.get("premium"),
                "currentNAV": _nav_resp.get("currentNAV"),
            }
    else:
        # Use precomputed premium from stock info if no history
        if _nav_resp.get("premium") is not None:
            result["premiumDiscountAnalysis"] = {
                "currentPremium": _nav_resp.get("premium"),
                "currentNAV": _nav_resp.get("currentNAV"),
                "dataPoints": 0,
            }

    # 7. Performance analysis
    _perf = {
        "ytdReturn": fund_info.get("ytdReturn"),
        "threeYearAverageReturn": fund_info.get("threeYearAverageReturn"),
        "fiveYearAverageReturn": fund_info.get("fiveYearAverageReturn"),
    }
    if any(v is not None for v in _perf.values()):
        result["performanceAnalysis"] = {
            k: round(v * 100, 2) if v is not None else None for k, v in _perf.items()
        }

    # 8. Overall score (ETF version, max 10)
    _score = 0
    _max_score = 10
    _score_details = []

    # Fee score (0-2)
    if expense_ratio is not None:
        _fee_s = max(0, 2 - expense_ratio * 100)
        _score += _fee_s
        _score_details.append({"factor": "費用率", "score": round(_fee_s, 1), "maxScore": 2, "detail": f"{expense_ratio*100:.3f}%" if expense_ratio else "N/A"})
    else:
        _score_details.append({"factor": "費用率", "score": 0, "maxScore": 2, "detail": "無資料"})

    # Premium/discount stability (0-2)
    _pd = result.get("premiumDiscountAnalysis", {})
    if _pd.get("dataPoints", 0) > 0:
        _avg_p = abs(_pd.get("averagePremium", 0))
        _pd_s = max(0, 2 - _avg_p * 2)
        _score += _pd_s
        _score_details.append({"factor": "折溢價穩定度", "score": round(_pd_s, 1), "maxScore": 2, "detail": f"平均溢價{_avg_p:.2f}%" if _pd.get("averagePremium", 0) >= 0 else f"平均折價{_avg_p:.2f}%"})
    else:
        _score_details.append({"factor": "折溢價穩定度", "score": 0, "maxScore": 2, "detail": "無資料"})

    # Dividend score (0-2)
    _dist = result.get("distributionAnalysis", {})
    if _dist.get("distributionYield") is not None:
        _dyield_s = min(2, _dist["distributionYield"] * 50)
        _score += _dyield_s
        _score_details.append({"factor": "配息殖利率", "score": round(_dyield_s, 1), "maxScore": 2, "detail": f"{_dist['distributionYield']*100:.2f}%"})
    else:
        _score_details.append({"factor": "配息殖利率", "score": 0, "maxScore": 2, "detail": "無資料"})

    # Concentration/diversification score (0-2)
    _conc = result.get("concentration", {})
    if _conc.get("top1Weight", 0) > 0:
        _c_s = max(0, 2 - _conc.get("top1Weight", 0) / 15)
        _score += _c_s
        _score_details.append({"factor": "分散程度", "score": round(_c_s, 1), "maxScore": 2, "detail": f"最大持股{_conc.get('top1Weight', 0):.1f}%" if _conc.get("top10Weight", 0) < 100 else "僅部分成分股有權重資料"})
    else:
        _score_details.append({"factor": "分散程度", "score": 1, "maxScore": 2, "detail": "無權重資料"})

    # Asset size / liquidity (0-2)
    _assets = fund_info.get("totalAssets")
    if _assets is not None and _assets > 0:
        if _assets >= 10e9:
            _a_s = 2
            _a_detail = "大型ETF（流動性佳）"
        elif _assets >= 1e9:
            _a_s = 1.5
            _a_detail = "中型ETF"
        elif _assets >= 100e6:
            _a_s = 1
            _a_detail = "小型ETF"
        else:
            _a_s = 0.5
            _a_detail = "微型ETF（流動性較低）"
        _score += _a_s
        _score_details.append({"factor": "基金規模", "score": _a_s, "maxScore": 2, "detail": _a_detail})
    else:
        _score_details.append({"factor": "基金規模", "score": 0, "maxScore": 2, "detail": "無資料"})

    result["score"] = {
        "totalScore": round(_score, 1),
        "maxScore": _max_score,
        "percentage": round(_score / _max_score * 100, 1),
        "details": _score_details,
        "rating": "優異" if _score >= 8 else "良好" if _score >= 6 else "普通" if _score >= 4 else "需謹慎",
    }

    return result


@app.post("/api/ai/consult")
async def ai_consult(body: dict):
    try:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            return {"answer": "請先設定 ANTHROPIC_API_KEY 環境變數才能使用 AI 諮詢功能。"}
        symbol = body.get("symbol", "")
        question = body.get("question", "")
        if not symbol or not question:
            return {"answer": "請提供股票代號與問題。"}
        info = _get_stock_info(symbol)
        fund = _fetch_fundamentals(symbol, current_price=info.get("currentPrice", 0))
        context_parts = [
            f"股票代號: {symbol}",
            f"名稱: {info.get('longName', 'N/A')}",
        ]
        if info.get("nameCn"):
            context_parts.append(f"中文名稱: {info['nameCn']}")
        price = info.get("currentPrice")
        chg = info.get("changePercent")
        if price:
            chg_str = f" ({chg*100:.2f}%)" if chg else ""
            context_parts.append(f"現價: {price}{chg_str}")
        for label, key, fmt in [
            ("本益比 (P/E)", "trailingPE", ".2f"),
            ("預估 P/E", "forwardPE", ".2f"),
            ("EPS", "trailingEps", ".2f"),
            ("預估 EPS", "forwardEps", ".2f"),
            ("殖利率", "dividendYield", ".2%"),
            ("股利金額", "dividendRate", ".2f"),
            ("股價淨值比 (P/B)", "priceToBook", ".2f"),
            ("每股淨值", "bookValue", ".2f"),
            ("ROE", "returnOnEquity", ".2%"),
            ("ROA", "returnOnAssets", ".2%"),
            ("利潤率", "profitMargins", ".2%"),
            ("營收", "totalRevenue", ".0f"),
            ("市值", "marketCap", ".0f"),
            ("β 值", "beta", ".2f"),
            ("52週高點", "fiftyTwoWeekHigh", ".2f"),
            ("52週低點", "fiftyTwoWeekLow", ".2f"),
            ("52週變化", "52WeekChange", ".2%"),
            ("負債權益比", "debtToEquity", ".2f"),
            ("營收/每股", "revenuePerShare", ".2f"),
            ("股本", "fullTimeEmployees", ".0f"),
            ("產業", "industry", "s"),
            (" sector ", "sector", "s"),
        ]:
            v = fund.get(key) if key in fund else info.get(key)
            if v is not None:
                if fmt == "s":
                    context_parts.append(f"{label}: {v}")
                elif fmt.endswith("%"):
                    context_parts.append(f"{label}: {v*100:.2f}%")
                elif fmt == ".0f":
                    context_parts.append(f"{label}: {v:,.0f}")
                else:
                    context_parts.append(f"{label}: {v:.2f}")
        if "dividendYield" in fund and fund.get("dividendYield"):
            context_parts.append(f"殖利率: {fund['dividendYield']*100:.2f}%")
        chairman = info.get("_chairman")
        gm = info.get("_generalManager")
        if chairman:
            context_parts.append(f"董事長: {chairman}")
        if gm:
            context_parts.append(f"總經理: {gm}")
        context = "\n".join(context_parts)
        prompt = (
            "你是一位專業的台灣股市分析師，精通台股基本面、技術面與產業分析。\n"
            "請根據以下提供的個股資料，以繁體中文回答使用者的問題。\n"
            "回答應客觀中立，包含數據佐證，並在適當處提供投資風險提醒。\n"
            "請勿提供具體的買賣建議或目標價。\n\n"
            f"【個股資料】\n{context}\n\n"
            f"【使用者提問】\n{question}"
        )
        resp = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-sonnet-4-20250514",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=30,
        )
        if resp.status_code != 200:
            return {"answer": f"AI 查詢失敗 (HTTP {resp.status_code})，請稍後再試。"}
        data = resp.json()
        content = data.get("content", [])
        if not content:
            return {"answer": "AI 無法產生回答，請重新提問。"}
        answer = content[0].get("text", "")
        return {"answer": answer}
    except Exception as e:
        return {"answer": f"AI 查詢發生錯誤: {str(e)}"}


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
    _last_price = 0
    while True:
        await asyncio.sleep(1)
        try:
            rt = _fetch_realtime_price(symbol)
            if rt["price"] > 0:
                with _realtime_history_lock:
                    if symbol not in _realtime_history:
                        _realtime_history[symbol] = []
                    _realtime_history[symbol].append({
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "price": rt["price"],
                    })
                    if len(_realtime_history[symbol]) > 7200:
                        _realtime_history[symbol] = _realtime_history[symbol][-3600:]
                if rt["price"] != _last_price:
                    _last_price = rt["price"]
                    await websocket.send_json({
                        "symbol": symbol,
                        "price": rt["price"],
                        "change": rt["change"],
                        "changePercent": rt["changePercent"],
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                    })
        except Exception:
            pass
