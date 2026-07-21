"""M2 擷取器：The Guardian World（RSS + 文章頁全文，見 fetch_common.py）。"""
import config
from fetch_common import fetch_rss_items, fetch_article_body

SOURCE_KEY = "guardian"


def fetch(limit=15):
    conf = config.SOURCES[SOURCE_KEY]
    items = fetch_rss_items(conf["rss_url"], conf["name"], limit=limit)
    articles = []
    for item in items:
        body = fetch_article_body(item["link"]) or item["description"]
        item["body"] = body
        articles.append(item)
    return articles


if __name__ == "__main__":
    result = fetch()
    print(f"取得 {len(result)} 篇")
    for a in result[:3]:
        print("-", a["title"], "| body_len=", len(a["body"]), "| pubdate=", a["pubdate"])
