"""後端新聞管理介面 API（/api/admin/news/*）。

功能範圍（見對話需求）：
1. 依日期瀏覽/編輯/刪除 backend/data/news/{date}.json 內容
2. 管理 Stocks_Auto 財經關鍵字/規則參數（寫入 Stocks_Auto/rules_config.json，
   Stocks_Auto/config.py 啟動時會讀取覆寫，見該檔 _load_rule_overrides）
3. 查看 news-automation.yml 的 GitHub Actions 執行紀錄

存取限制：僅限本人（ADMIN_EMAIL）。前端送 Firebase ID Token 當 Bearer token，
這裡用 google-auth 驗證簽章（Google 公開金鑰），不需要 service account 憑證。

持久化：Render 的檔案系統是 ephemeral，每次部署都會重置，且
news-automation.yml 每天會 commit 新資料觸發 Render 重新部署，本地寫入會被
蓋掉。因此這裡的寫入操作一律「本地寫入（立即生效）+ 嘗試 commit 回 GitHub
（持久化，讓下次部署/pipeline 執行都讀到最新版本）」雙軌並行。若未設定
GITHUB_TOKEN 環境變數，GitHub 那一路會被跳過並在回應中提示，但本地寫入仍會
成功（僅在下次部署前有效，足以應付「修正今天已發佈的清單」這類即時需求）。
"""

import base64
import json
import os
from datetime import datetime

import requests
from fastapi import APIRouter, Body, Depends, Header, HTTPException
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # backend/
NEWS_DIR = os.path.join(BASE_DIR, "data", "news")
RULES_CONFIG_LOCAL = os.path.join(BASE_DIR, "..", "Stocks_Auto", "rules_config.json")

# 這個 monorepo 的 render rootDir 是 Stocks/，但 GitHub Contents API 的路徑是
# 相對於整個 repo 根目錄（RoyZeng0317/websites），所以要補回 "Stocks/" 前綴。
NEWS_REPO_DIR = "Stocks/backend/data/news"
RULES_CONFIG_REPO_PATH = "Stocks/Stocks_Auto/rules_config.json"

FIREBASE_PROJECT_ID = os.environ.get("FIREBASE_PROJECT_ID", "stocks-global")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "boyud9.5@gmail.com")

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
GITHUB_REPO = os.environ.get("GITHUB_REPO", "RoyZeng0317/websites")
GITHUB_BRANCH = os.environ.get("GITHUB_BRANCH", "main")
GITHUB_API = "https://api.github.com"
GITHUB_WORKFLOW_FILE = "news-automation.yml"

# 對應 Stocks_Auto/config.py 目前寫死的預設值——找不到 rules_config.json 覆寫檔時
# 管理介面用這組當「目前生效值」顯示（不直接 import Stocks_Auto.config，因為
# 該資料夾的檔名如 01_Data_Search.py 不是合法模組名，且刻意不當套件用）。
DEFAULT_FINANCIAL_KEYWORDS = [
    "股市", "台股", "大盤", "財經", "投資", "升息", "降息", "通膨", "匯率",
    "個股", "股價", "上市", "上櫃", "券商", "外資", "法人", "財報", "營收",
    "指數", "殖利率", "美股", "陸股", "期貨", "基金", "央行", "利率",
]
DEFAULT_FALSE_POSITIVE_PHRASES = {
    "指數": ["空氣品質指數", "紫外線指數", "幸福指數", "痛苦指數", "犯罪指數", "體感指數"],
    "法人": ["財團法人", "社團法人", "公益法人"],
    "基金": ["基金會"],
}
DEFAULT_CORE_MARKET_EXCLUDE = ["財經", "投資", "匯率"]
DEFAULT_UNCLASSIFIED_MIN_CORE_HITS = 2

_google_request = google_requests.Request()


def require_admin(authorization: str = Header(default="")):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization[len("Bearer "):].strip()
    try:
        decoded = google_id_token.verify_firebase_token(
            token, _google_request, audience=FIREBASE_PROJECT_ID
        )
    except Exception as exc:
        raise HTTPException(status_code=401, detail=f"Invalid token: {exc}")

    email = decoded.get("email")
    if not decoded.get("email_verified") or email != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Not authorized")
    return decoded


router = APIRouter(
    prefix="/api/admin/news",
    tags=["admin-news"],
    dependencies=[Depends(require_admin)],
)


# ── GitHub Contents API：讓編輯結果 commit 回 repo，撐過 Render 重新部署 ──────

def _github_enabled():
    return bool(GITHUB_TOKEN)


def _github_headers():
    return {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def _github_get_sha(repo_path):
    try:
        resp = requests.get(
            f"{GITHUB_API}/repos/{GITHUB_REPO}/contents/{repo_path}",
            headers=_github_headers(),
            params={"ref": GITHUB_BRANCH},
            timeout=15,
        )
    except Exception:
        return None
    if resp.status_code == 200:
        return resp.json().get("sha")
    return None


def _github_put_file(repo_path, content_str, message):
    if not _github_enabled():
        return {"committed": False, "reason": "GITHUB_TOKEN not configured"}
    try:
        body = {
            "message": message,
            "content": base64.b64encode(content_str.encode("utf-8")).decode("ascii"),
            "branch": GITHUB_BRANCH,
        }
        sha = _github_get_sha(repo_path)
        if sha:
            body["sha"] = sha
        resp = requests.put(
            f"{GITHUB_API}/repos/{GITHUB_REPO}/contents/{repo_path}",
            headers=_github_headers(),
            json=body,
            timeout=20,
        )
        if resp.status_code not in (200, 201):
            return {"committed": False, "reason": f"GitHub API {resp.status_code}: {resp.text[:300]}"}
        return {"committed": True, "commit_sha": resp.json().get("commit", {}).get("sha")}
    except Exception as exc:
        return {"committed": False, "reason": str(exc)}


def _github_delete_file(repo_path, message):
    if not _github_enabled():
        return {"committed": False, "reason": "GITHUB_TOKEN not configured"}
    sha = _github_get_sha(repo_path)
    if not sha:
        return {"committed": False, "reason": "file not found on GitHub"}
    try:
        resp = requests.delete(
            f"{GITHUB_API}/repos/{GITHUB_REPO}/contents/{repo_path}",
            headers=_github_headers(),
            json={"message": message, "sha": sha, "branch": GITHUB_BRANCH},
            timeout=20,
        )
        if resp.status_code != 200:
            return {"committed": False, "reason": f"GitHub API {resp.status_code}: {resp.text[:300]}"}
        return {"committed": True}
    except Exception as exc:
        return {"committed": False, "reason": str(exc)}


# ── 新聞瀏覽/編輯/刪除（依日期） ──────────────────────────────────────────

def _validate_date(date: str):
    try:
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")


def _news_path(date: str):
    return os.path.join(NEWS_DIR, f"{date}.json")


@router.get("/dates")
def list_dates():
    if not os.path.isdir(NEWS_DIR):
        return []
    items = []
    for name in sorted(os.listdir(NEWS_DIR), reverse=True):
        if not name.endswith(".json"):
            continue
        date = name[: -len(".json")]
        try:
            with open(os.path.join(NEWS_DIR, name), "r", encoding="utf-8") as f:
                payload = json.load(f)
        except Exception:
            items.append({"date": date, "valid": False})
            continue
        items.append({
            "date": date,
            "valid": isinstance(payload, dict) and isinstance(payload.get("groups"), list),
            "generated_at": payload.get("generated_at") if isinstance(payload, dict) else None,
            "group_count": payload.get("group_count") if isinstance(payload, dict) else None,
            "total_articles": payload.get("total_articles") if isinstance(payload, dict) else None,
        })
    return items


# NOTE: Starlette 依「註冊順序」比對路由，不是依靜態/動態路徑自動排優先權。
# 所以 /dates、/config/rules、/runs 這些固定路徑必須排在 /{date} 這個萬用動態
# 路由「之前」註冊，否則例如 GET /runs 會先被 /{date}（把 "runs" 當成日期）攔截，
# 回傳 400 Invalid date format，永遠到不了 list_runs()。

# ── 財經關鍵字/規則參數 ──────────────────────────────────────────────────

@router.get("/config/rules")
def get_rules_config():
    if os.path.isfile(RULES_CONFIG_LOCAL):
        try:
            with open(RULES_CONFIG_LOCAL, "r", encoding="utf-8") as f:
                overrides = json.load(f)
            return {
                "source": "override",
                "financial_keywords": overrides.get("financial_keywords", DEFAULT_FINANCIAL_KEYWORDS),
                "false_positive_phrases": overrides.get("false_positive_phrases", DEFAULT_FALSE_POSITIVE_PHRASES),
                "core_market_exclude": overrides.get("core_market_exclude", DEFAULT_CORE_MARKET_EXCLUDE),
                "unclassified_min_core_hits": overrides.get(
                    "unclassified_min_core_hits", DEFAULT_UNCLASSIFIED_MIN_CORE_HITS
                ),
            }
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Failed to parse rules_config.json: {exc}")

    return {
        "source": "default",
        "financial_keywords": DEFAULT_FINANCIAL_KEYWORDS,
        "false_positive_phrases": DEFAULT_FALSE_POSITIVE_PHRASES,
        "core_market_exclude": DEFAULT_CORE_MARKET_EXCLUDE,
        "unclassified_min_core_hits": DEFAULT_UNCLASSIFIED_MIN_CORE_HITS,
    }


@router.put("/config/rules")
def put_rules_config(payload: dict = Body(...)):
    financial_keywords = payload.get("financial_keywords")
    false_positive_phrases = payload.get("false_positive_phrases")
    core_market_exclude = payload.get("core_market_exclude")
    unclassified_min_core_hits = payload.get("unclassified_min_core_hits")

    if not isinstance(financial_keywords, list) or not all(isinstance(k, str) for k in financial_keywords):
        raise HTTPException(status_code=400, detail="financial_keywords must be a list of strings.")
    if not isinstance(false_positive_phrases, dict) or not all(
        isinstance(k, str) and isinstance(v, list) and all(isinstance(p, str) for p in v)
        for k, v in false_positive_phrases.items()
    ):
        raise HTTPException(status_code=400, detail="false_positive_phrases must be a dict of str -> list[str].")
    if not isinstance(core_market_exclude, list) or not all(isinstance(k, str) for k in core_market_exclude):
        raise HTTPException(status_code=400, detail="core_market_exclude must be a list of strings.")
    if not isinstance(unclassified_min_core_hits, int) or unclassified_min_core_hits < 1:
        raise HTTPException(status_code=400, detail="unclassified_min_core_hits must be an integer >= 1.")

    data = {
        "financial_keywords": financial_keywords,
        "false_positive_phrases": false_positive_phrases,
        "core_market_exclude": core_market_exclude,
        "unclassified_min_core_hits": unclassified_min_core_hits,
    }
    content_str = json.dumps(data, ensure_ascii=False, indent=2)

    os.makedirs(os.path.dirname(RULES_CONFIG_LOCAL), exist_ok=True)
    with open(RULES_CONFIG_LOCAL, "w", encoding="utf-8") as f:
        f.write(content_str)

    github = _github_put_file(
        RULES_CONFIG_REPO_PATH,
        content_str,
        "chore: admin update news rules_config.json",
    )
    return {"ok": True, "github": github, "data": data}


# ── Pipeline 執行紀錄（GitHub Actions runs） ────────────────────────────────

@router.get("/runs")
def list_runs(per_page: int = 15):
    headers = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

    try:
        resp = requests.get(
            f"{GITHUB_API}/repos/{GITHUB_REPO}/actions/workflows/{GITHUB_WORKFLOW_FILE}/runs",
            headers=headers,
            params={"per_page": min(max(per_page, 1), 50)},
            timeout=15,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Failed to reach GitHub Actions API: {exc}")

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"GitHub API {resp.status_code}: {resp.text[:300]}")

    runs = resp.json().get("workflow_runs", [])
    return [
        {
            "id": r.get("id"),
            "run_number": r.get("run_number"),
            "status": r.get("status"),
            "conclusion": r.get("conclusion"),
            "event": r.get("event"),
            "created_at": r.get("created_at"),
            "run_started_at": r.get("run_started_at"),
            "updated_at": r.get("updated_at"),
            "html_url": r.get("html_url"),
        }
        for r in runs
    ]


# ── 單日新聞讀取/寫入/刪除（放在檔案最後：/{date} 是萬用動態路由，必須排在
#    上面所有固定路徑之後註冊，見上方 NOTE） ─────────────────────────────

@router.get("/{date}")
def get_date(date: str):
    _validate_date(date)
    filepath = _news_path(date)
    if not os.path.isfile(filepath):
        raise HTTPException(status_code=404, detail="No news data for this date.")
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


@router.put("/{date}")
def put_date(date: str, payload: dict = Body(...)):
    _validate_date(date)
    groups = payload.get("groups")
    if not isinstance(groups, list):
        raise HTTPException(status_code=400, detail="Payload must contain a 'groups' list.")

    payload["date"] = date
    payload["group_count"] = len(groups)
    payload["total_articles"] = sum(len(g.get("articles") or []) for g in groups)

    os.makedirs(NEWS_DIR, exist_ok=True)
    content_str = json.dumps(payload, ensure_ascii=False, indent=2)
    with open(_news_path(date), "w", encoding="utf-8") as f:
        f.write(content_str)

    github = _github_put_file(
        f"{NEWS_REPO_DIR}/{date}.json",
        content_str,
        f"chore: admin edit news {date}",
    )
    return {"ok": True, "date": date, "github": github, "data": payload}


@router.delete("/{date}")
def delete_date(date: str):
    _validate_date(date)
    filepath = _news_path(date)
    existed = os.path.isfile(filepath)
    if existed:
        os.remove(filepath)

    github = _github_delete_file(
        f"{NEWS_REPO_DIR}/{date}.json",
        f"chore: admin delete news {date}",
    )
    return {"ok": True, "date": date, "existed_locally": existed, "github": github}
