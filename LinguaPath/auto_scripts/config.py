"""Central configuration, mirroring Stocks/Stocks_Auto/config.py's role for this pipeline.

No LLM/AI-generation dependency anywhere in this package (see rules.md) — mirrors the
same hard constraint Stocks_Auto was built under (avoid token/API cost, avoid depending
on an external generative model for a pipeline that must run unattended every day).
"""
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 輸出路徑：LinguaPath/backend/data/News/yyyy-mm-dd.json
# 這個資料夾已被 admin/server.js 的 POST /api/publish 讀取合併進 frontend/news.json，
# 檔名慣例、date/generated_at/articles.{A1..C2} 結構需維持相容，否則 publish 端會整批跳過。
OUTPUT_DIR = os.path.join(BASE_DIR, "..", "backend", "data", "News")
FILE_NAME_FORMAT = "%Y-%m-%d.json"

# 排程建議執行時間（Windows Task Scheduler 每日觸發，見 README/schedule_task.ps1）
SUGGESTED_RUN_TIME = "07:00"

RULES_FILE = os.path.join(BASE_DIR, "rules.md")

# 篩選規則參數（rules.md 規則01/02）
MIN_BODY_WORDS = 600          # 英文以空白斷詞計算的 word count，未達門檻的來源文章當日略過
RECENT_WINDOW_HOURS = 48      # 取代 Stocks_Auto「只取當日」：新聞來源橫跨多時區，改用48小時滾動窗口

# 去重模組設定（比照 Stocks_Auto/dedup.py 的 DEDUP_THRESHOLD 與 body 相似度安全網）
DEDUP_THRESHOLD = 0.8
BODY_SIMILARITY_MIN = 0.15
BODY_SHINGLE_LEN = 2
BODY_COMPARE_CHARS = 400

# CEFR 分級：依 Flesch-Kincaid Grade Level 換算年級，對照到最接近的 CEFR 等級（近似值，
# 詳見 rules.md 規則03；真實新聞用字通常落在 B2-C1，A1/A2/B1 常常當天沒有候選文章屬預期內限制）。
CEFR_GRADE_BANDS = [
    (2.0, "A1"),
    (4.0, "A2"),
    (6.0, "B1"),
    (9.0, "B2"),
    (12.0, "C1"),
    (float("inf"), "C2"),
]

# 摘要長度（比照 Stocks_Auto/summarize.py 的 SUMMARY_MAX_LEN，字元數）
SUMMARY_MAX_LEN = 150

# 詞彙教學設定：從文章 TF-IDF 高權重詞中挑選，透過免費字典 API 查詢定義（非 LLM）
VOCAB_TARGET_COUNT = 5
VOCAB_CANDIDATE_POOL = 20
DICTIONARY_API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/{word}"

# 新聞來源清單（皆為公開 RSS，免金鑰）
SOURCES = {
    "bbc": {"name": "BBC News", "rss_url": "https://feeds.bbci.co.uk/news/world/rss.xml"},
    "guardian": {"name": "The Guardian", "rss_url": "https://www.theguardian.com/world/rss"},
    "npr": {"name": "NPR", "rss_url": "https://feeds.npr.org/1004/rss.xml"},
    "aljazeera": {"name": "Al Jazeera", "rss_url": "https://www.aljazeera.com/xml/rss/all.xml"},
    # 2026-07-16 修正：apnews.com 的 ?output=rss 參數已失效(改回傳一般HTML首頁)，
    # taiwannews.com.tw/en/rss/1 同樣只回傳首頁HTML，兩者RSS功能皆已停用，改用
    # 實際驗證仍為有效XML的來源。
    "ap": {"name": "CBS News", "rss_url": "https://www.cbsnews.com/latest/rss/world"},
    "taiwannews": {"name": "Taipei Times", "rss_url": "https://www.taipeitimes.com/xml/index.rss"},
}

# HTTP 請求共用設定（比照 Stocks_Auto/config.py）
REQUEST_TIMEOUT = 15
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
REQUEST_HEADERS = {"User-Agent": USER_AGENT}

# 英文常見虛詞，過濾掉才不會讓 the/a/said 這類詞霸佔 TF-IDF 高權重詞彙榜
STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "also", "am", "an", "and",
    "any", "are", "as", "at", "be", "because", "been", "before", "being", "below",
    "between", "both", "but", "by", "can", "could", "did", "do", "does", "doing", "down",
    "during", "each", "few", "for", "from", "further", "had", "has", "have", "having",
    "he", "her", "here", "hers", "herself", "him", "himself", "his", "how", "i", "if",
    "in", "into", "is", "it", "its", "itself", "just", "me", "more", "most", "my",
    "myself", "no", "nor", "not", "now", "of", "off", "on", "once", "only", "or",
    "other", "our", "ours", "ourselves", "out", "over", "own", "said", "same", "she",
    "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them",
    "themselves", "then", "there", "these", "they", "this", "those", "through", "to",
    "too", "under", "until", "up", "very", "was", "we", "were", "what", "when", "where",
    "which", "while", "who", "whom", "why", "will", "with", "would", "you", "your",
    "yours", "yourself", "yourselves", "also", "will", "one", "two", "new", "said",
}

# 各來源文章頁常見樣板/廣告文字，擷取內文時濾除（比照 Stocks_Auto/fetch_common.py）
BOILERPLATE_MARKERS = [
    "All rights reserved", "Copyright", "Sign up", "Subscribe", "Newsletter",
    "Follow us", "Share this", "Read more", "Related:", "Advertisement",
    "Cookie", "Terms of use", "Privacy Policy", "Comments are closed",
]

# 側欄/推薦/廣告容器的 class/id 關鍵字（比照 Stocks_Auto，這些是通用 Web 慣例命名，
# 英文新聞網站與中文新聞網站共用同一套慣例）
SIDEBAR_CONTAINER_MARKERS = [
    "related", "recommend", "sidebar", "aside", "extend", "read-more",
    "readmore", "promo", "ad-", "advertisement", "widget", "popular",
    "hot-news", "hotnews", "share", "social", "newsletter", "byline",
    "comments", "footer", "nav",
]
