"""M7 輸出模組（比照 Stocks_Auto/output.py：只存摘要+連結，不存完整全文，見
rules.md 規則01）。寫到 config.OUTPUT_DIR / <today>.json，結構維持與既有手動/AI
產出的 backend/data/News/yyyy-mm-dd.json 相容（date/generated_at/sources/
articles.{A1..C2}.{title,content}），admin/server.js 的 POST /api/publish 合併
邏輯靠 art.title && art.content 判斷是否收錄，所以 `content` 欄位一定要有值
——這裡放「摘要 + 原文連結」，不是完整改寫過的600字文章。
"""
import datetime
import json
import os

import config


def _build_content(article):
    """content 欄位 = 摘要 + 原文連結，供既有 news.html/news.tsx 顯示與歸屬來源。"""
    summary = article.get("summary") or ""
    link = article.get("link") or ""
    if link:
        return f"{summary}\n\n(Read the full article: {link})"
    return summary


def _serialize_article(article):
    return {
        "title": article.get("title"),
        "source": article.get("source") or "",
        "link": article.get("link") or "",
        "grade_level": article.get("_grade_level"),
        "content": _build_content(article),
        "vocabulary": article.get("vocabulary") or [],
        "additional_sources": article.get("additional_sources") or [],
    }


def build_report(assigned_levels, report_date=None):
    report_date = report_date or datetime.date.today()
    articles_out = {level: _serialize_article(article) for level, article in assigned_levels.items()}
    sources = sorted({a.get("source") for a in assigned_levels.values() if a.get("source")})
    return {
        "date": report_date.isoformat(),
        "generated_at": datetime.datetime.now().astimezone().isoformat(),
        "sources": sources,
        "articles": articles_out,
    }


def write_report(report, output_dir=None, filename_format=None):
    output_dir = output_dir or config.OUTPUT_DIR
    filename_format = filename_format or config.FILE_NAME_FORMAT
    os.makedirs(output_dir, exist_ok=True)

    report_date = datetime.date.fromisoformat(report["date"])
    filename = report_date.strftime(filename_format)
    path = os.path.join(output_dir, filename)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    return path


if __name__ == "__main__":
    sample_assigned = {
        "B2": {
            "title": "Central bank raises interest rates again",
            "source": "AP News",
            "link": "https://example.com/article",
            "_grade_level": 8.3,
            "summary": "The central bank raised interest rates today to fight persistent inflation.",
            "vocabulary": [{"word": "inflation", "definition": "a general increase in prices"}],
            "additional_sources": [],
        }
    }
    report = build_report(sample_assigned)
    path = write_report(report)
    print("已輸出：", path)
