import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 輸出路徑：Stocks_Auto 現在就住在 websites/Stocks repo 內，直接寫到
# backend/main.py 的 /api/news 端點實際讀取路徑 backend/data/news/{date}.json，
# 不再需要寫到巢狀暫存路徑後手動搬移。
OUTPUT_DIR = os.path.join(BASE_DIR, "..", "backend", "data", "news")
FILE_NAME_FORMAT = "%Y-%m-%d.json"

# 排程執行時間：由 .github/workflows/news-automation.yml 的 cron 驅動
# （07:00 UTC = 15:00 台北時間），此值僅供參考/文件用途。
SUGGESTED_RUN_TIME = "15:00"

RULES_FILE = os.path.join(BASE_DIR, "rules.md")

# 篩選規則參數（對應 rules.md）
MIN_BODY_LENGTH = 600  # rules.md 規則 01
TODAY_ONLY = True  # rules.md 規則 02

# 財經關鍵字（rules.md 規則 03：所有來源內容需比對，非財經內容當日略過）
FINANCIAL_KEYWORDS = [
    "股市", "台股", "大盤", "財經", "投資", "升息", "降息", "通膨", "匯率",
    "個股", "股價", "上市", "上櫃", "券商", "外資", "法人", "財報", "營收",
    "指數", "殖利率", "美股", "陸股", "期貨", "基金", "央行", "利率",
]

# 2026-07-19 修正：部分關鍵字會被詞義完全無關的複合詞「包住」而誤判，例如
# 「空氣品質指數」命中「指數」、「財團法人」命中「法人」、「文化基金會」命中
# 「基金」——這些命中要排除。key 是關鍵字，value 是已知會誤配的複合詞清單，
# 命中位置的前後文字只要含有任一已知複合詞，這次命中就不算數（見 rules.py
# passes_financial_filter，比對方式沿用 grouping.py 既有的「排除子句」手法）。
FINANCIAL_KEYWORD_FALSE_POSITIVE_PHRASES = {
    "指數": ["空氣品質指數", "紫外線指數", "幸福指數", "痛苦指數", "犯罪指數", "體感指數"],
    "法人": ["財團法人", "社團法人", "公益法人"],
    "基金": ["基金會"],
}

# 2026-07-20 修正三：排除已知複合詞誤配後，仍有一類殘留假陽性——文章主題其實是
# 地緣政治/總體經濟/生活理財等內容，只是「順帶」提到一次財經關鍵字（例如伊朗
# 衝突報導提到一次「推升通膨」、日本iPhone漲價報導提到一次「匯率衝擊」、個人
# 理財心得文章提到多次「投資」），並非以股票/資本市場為報導主體。這類文章不會
# 被 grouping.py 分類到任何實際上市櫃公司（歸入 UNCLASSIFIED_GROUP），此時
# 「單一關鍵字命中一次即放行」的門檻太低（見 rules.py passes_core_market_filter /
# filter_unclassified_group）。
#
# CORE_MARKET_KEYWORDS 從 FINANCIAL_KEYWORDS 中排除「財經」「投資」「匯率」——
# 這三個詞經 2026-07-19 實跑資料驗證是最大宗的假陽性來源：「財經」常只是記者
# 所屬編輯部署名（例如「財經中心／OOO報導」的byline，跟報導主題無關）；
# 「投資」語意過廣，個人理財心得、生技展會招商、企業一般營運策略都會用到，
# 不足以代表報導主體是股票市場；「匯率」也常只是消費性產品定價分析裡的次要
# 因素，不代表報導主體是金融市場。
CORE_MARKET_EXCLUDE = ["財經", "投資", "匯率"]
CORE_MARKET_KEYWORDS = [k for k in FINANCIAL_KEYWORDS if k not in CORE_MARKET_EXCLUDE]

# UNCLASSIFIED_GROUP 文章需要 CORE_MARKET_KEYWORDS 有效命中（含重複）達此次數
# 才放行；已比對到實際上市櫃公司的分組不受此限制（比對到真實公司代號/簡稱
# 本身就是夠強的財經相關性訊號，見 grouping.py 內建的多重防呆機制）。
UNCLASSIFIED_MIN_CORE_HITS = 2

# 2026-07-20：以上四個規則參數（FINANCIAL_KEYWORDS / FINANCIAL_KEYWORD_FALSE_POSITIVE_PHRASES
# / CORE_MARKET_EXCLUDE / UNCLASSIFIED_MIN_CORE_HITS）可透過後端新聞管理介面
# （backend/admin_news.py）編輯，寫入本檔同層的 rules_config.json 並 commit 回
# git（GitHub Actions 每次執行都會 checkout 最新版本）。找不到該檔或格式錯誤時，
# 靜默沿用上面寫死的預設值，不中斷 pipeline。
RULES_CONFIG_FILE = os.path.join(BASE_DIR, "rules_config.json")


def _load_rule_overrides():
    global FINANCIAL_KEYWORDS, FINANCIAL_KEYWORD_FALSE_POSITIVE_PHRASES
    global CORE_MARKET_EXCLUDE, CORE_MARKET_KEYWORDS, UNCLASSIFIED_MIN_CORE_HITS

    if not os.path.isfile(RULES_CONFIG_FILE):
        return
    try:
        with open(RULES_CONFIG_FILE, "r", encoding="utf-8") as f:
            overrides = json.load(f)
        FINANCIAL_KEYWORDS = list(overrides.get("financial_keywords", FINANCIAL_KEYWORDS))
        FINANCIAL_KEYWORD_FALSE_POSITIVE_PHRASES = dict(
            overrides.get("false_positive_phrases", FINANCIAL_KEYWORD_FALSE_POSITIVE_PHRASES)
        )
        CORE_MARKET_EXCLUDE = list(overrides.get("core_market_exclude", CORE_MARKET_EXCLUDE))
        CORE_MARKET_KEYWORDS = [k for k in FINANCIAL_KEYWORDS if k not in CORE_MARKET_EXCLUDE]
        UNCLASSIFIED_MIN_CORE_HITS = int(
            overrides.get("unclassified_min_core_hits", UNCLASSIFIED_MIN_CORE_HITS)
        )
    except Exception as exc:
        print(f"[config] rules_config.json 讀取失敗，改用內建預設值: {exc}")


_load_rule_overrides()

# 去重模組（M4）設定：標題相似度門檻，difflib.SequenceMatcher，範圍 0-1
DEDUP_THRESHOLD = 0.8

# 新聞來源清單（M2）。method: "rss" 或 "html"
SOURCES = {
    "yahoo": {
        "name": "Yahoo奇摩股市",
        "method": "rss",
        "url": "https://tw.stock.yahoo.com/rss?category=news",
        "confirmed": True,  # RESEARCH.md Findings #1：已即時驗證可用
    },
    "cnyes": {
        "name": "鉅亨網",
        "method": "html",
        "url": "https://news.cnyes.com/news/cat/headline",
        "confirmed": False,  # RESEARCH.md Findings #2：無確認可用 RSS，走 HTML 爬蟲
    },
    "udn": {
        "name": "經濟日報",
        "method": "html",
        "url": "https://money.udn.com/money/index",
        "confirmed": False,  # RESEARCH.md Findings #2：舊 RSS 已失效/不明朗，走 HTML 爬蟲
    },
    "ctee": {
        "name": "工商時報",
        "method": "html",
        "url": "https://www.ctee.com.tw/livenews/tw",
        "confirmed": False,  # RESEARCH.md Findings #2：無確認可用 RSS，走 HTML 爬蟲
    },
    "ptt": {
        "name": "PTT Stock板",
        "method": "html",
        "url": "https://www.ptt.cc/bbs/Stock/index.html",
        "confirmed": False,  # RESEARCH.md Findings #4：無 RSS，需 over18 cookie，ToS 灰色地帶
    },
    "youtube": {
        "name": "57東森財經新聞",
        "method": "youtube",
        # RESEARCH.md Findings #8：頻道 handle @57ETFN，channel_id 已交叉驗證
        "channel_id": "UCuzqko_GKcj9922M1gUo__w",
        "rss_url": "https://www.youtube.com/feeds/videos.xml?channel_id=UCuzqko_GKcj9922M1gUo__w",
        "confirmed": True,  # 頻道/RSS 已驗證，字幕可用性未知，實作時逐支影片驗證
    },
}

# 台灣證交所(TWSE)/櫃買中心(TPEx) 上市櫃公司代碼對照表（M5 分組）
# RESEARCH.md Findings #6：已直接驗證可下載，欄位含「公司代號」「公司名稱」「公司簡稱」
TWSE_LISTED_CSV = "https://mopsfin.twse.com.tw/opendata/t187ap03_L.csv"
TPEX_LISTED_CSV = "https://mopsfin.twse.com.tw/opendata/t187ap03_O.csv"

# 公司代碼對照表本地快取（避免每次執行都重新下載）
COMPANY_MAP_CACHE = os.path.join(BASE_DIR, "cache", "company_map.json")

# HTTP 請求共用設定
REQUEST_TIMEOUT = 15
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
REQUEST_HEADERS = {"User-Agent": USER_AGENT}

# 未分類到任何股票代碼的新聞歸入此分組
UNCLASSIFIED_GROUP = "大盤/未分類"
