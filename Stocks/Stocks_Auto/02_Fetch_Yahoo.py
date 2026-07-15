import datetime
import email.utils
import re
import xml.etree.ElementTree as ET

import requests
from bs4 import BeautifulSoup

import config

TAIPEI_TZ = datetime.timezone(datetime.timedelta(hours=8))
# 這兩個是單一段落內就會出現的樣板文字（例如文首「加入為您的Yahoo熱門來源」提示），
# 只濾掉命中的那一段，不影響其他段落。
BOILERPLATE_MARKERS = ["加入為", "熱門來源"]
# 2026-07-15 實跑時發現：Yahoo文章頁（尤其今周刊/BUSINESS TODAY等授權轉載來源）
# 常在本文最後多附一段「相關新聞：」「延伸閱讀」「更多OO文章/報導」起頭的推薦
# 連結區塊；「延伸閱讀」等起頭字樣本身只佔一個獨立 <p>，緊接著的推薦標題清單
# （常包含完全無關公司的股票代號）又各自是後面的 <p>，光靠關鍵字逐段濾除
# 濾不掉「起頭段落之後」的推薦清單本身。這類起頭一出現，後面到文章結尾都是
# 推薦/延伸閱讀清單、不再是本文，故命中即整段落之後全部停止收集（break）。
# （例如「延伸閱讀\n台積電法說...\n...台新新光金、凱基金上漲...」曾誤配到
# 「台新新光金」；「更多今周刊文章台塑、南亞、台化...臻鼎-KY...」曾誤配到
# 「臻鼎-KY」）。
TRAILING_SECTION_MARKERS = ["相關新聞", "延伸閱讀", "觀看原文"]
# 這裡的 lookahead（(?=.{20,})）故意排除「在 Google 上查看更多我們的精彩報導」
# 這種每篇文章開頭都會出現的通用 CTA 句——它的「報導」二字就是句尾，後面
# 沒有內容。真正的「更多OO文章/報導」推薦清單則一定緊接著大量headline文字
# （見上方docstring範例），要求匹配後至少還有20字，只留下真正的推薦清單起頭。
MORE_ARTICLES_RE = re.compile(r"更多.{0,12}(文章|報導|新聞)(?=.{20,})")


def _parse_pubdate(raw):
    try:
        dt = email.utils.parsedate_to_datetime(raw)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=datetime.timezone.utc)
        return dt.astimezone(TAIPEI_TZ)
    except Exception:
        return None


def _fetch_full_body(link):
    try:
        resp = requests.get(link, headers=config.REQUEST_HEADERS, timeout=config.REQUEST_TIMEOUT)
        resp.raise_for_status()
    except Exception:
        return ""
    soup = BeautifulSoup(resp.text, "html.parser")
    section = soup.select_one("section.module-article-body") or soup.select_one(
        "[class*=article-body]"
    )
    if not section:
        return ""
    paragraphs = []
    for p in section.find_all("p"):
        text = p.get_text(strip=True)
        if not text:
            continue
        if any(marker in text for marker in TRAILING_SECTION_MARKERS) or MORE_ARTICLES_RE.search(text):
            break
        if any(marker in text for marker in BOILERPLATE_MARKERS):
            continue
        paragraphs.append(text)
    return "\n".join(paragraphs)


def fetch():
    """回傳 Yahoo奇摩股市 最新新聞清單，每筆含 title/link/pubdate/body/description/source。"""
    src = config.SOURCES["yahoo"]
    try:
        resp = requests.get(src["url"], headers=config.REQUEST_HEADERS, timeout=config.REQUEST_TIMEOUT)
        resp.raise_for_status()
    except Exception as exc:
        print(f"[yahoo] RSS 擷取失敗：{exc}")
        return []

    try:
        root = ET.fromstring(resp.content)
    except ET.ParseError as exc:
        print(f"[yahoo] RSS 解析失敗：{exc}")
        return []

    articles = []
    for item in root.findall(".//item"):
        title_el = item.find("title")
        link_el = item.find("link")
        pubdate_el = item.find("pubDate")
        desc_el = item.find("description")

        title = (title_el.text or "").strip() if title_el is not None else ""
        link = (link_el.text or "").strip() if link_el is not None else ""
        description = (desc_el.text or "").strip() if desc_el is not None else ""
        pubdate = _parse_pubdate(pubdate_el.text) if pubdate_el is not None else None

        if not title or not link:
            continue

        body = _fetch_full_body(link)
        if not body:
            # 全文擷取失敗時退回 RSS description，讓文章仍可能通過後續規則判斷
            body = description

        articles.append(
            {
                "title": title,
                "link": link,
                "pubdate": pubdate,
                "body": body,
                "description": description,
                "source": "yahoo",
            }
        )

    return articles


if __name__ == "__main__":
    result = fetch()
    print(f"取得 {len(result)} 篇")
    for a in result[:3]:
        print("-", a["title"], "| body_len=", len(a["body"]), "| pubdate=", a["pubdate"])
