"""M2 擷取器共用工具：RSS 解析、文章頁 HTML 請求、內文段落擷取。
供 fetch_bbc.py / fetch_guardian.py / fetch_npr.py / fetch_aljazeera.py /
fetch_ap.py / fetch_taiwannews.py 共用。所有來源都先讀 RSS 拿列表（title/link/
description/pubdate），再各自 GET 文章頁擷取全文（RSS 的 description 通常只有
一兩句，不足以判斷 rules.md 規則01的600字門檻）。
"""
import datetime
import email.utils
import re
from html import unescape

import requests
from bs4 import BeautifulSoup

import config

ITEM_RE = re.compile(r"<item[\s\S]*?</item>", re.IGNORECASE)
TAG_CACHE = {}


def _tag_re(tag):
    if tag not in TAG_CACHE:
        TAG_CACHE[tag] = re.compile(rf"<{tag}[^>]*>([\s\S]*?)</{tag}>", re.IGNORECASE)
    return TAG_CACHE[tag]


def _extract_tag(xml, tag):
    m = _tag_re(tag).search(xml)
    if not m:
        return ""
    val = m.group(1)
    cdata = re.search(r"<!\[CDATA\[([\s\S]*?)\]\]>", val)
    return cdata.group(1) if cdata else val


def _clean_text(text):
    # 部分來源（例如 Guardian）的 RSS description 把 HTML 標籤做了「雙重編碼」
    # （字面上是 &lt;p&gt;...&lt;/p&gt; 而不是真正的 <p>...</p>），所以要先 unescape
    # 把實體還原成標籤，再統一剝掉標籤——順序顛倒會讓 <p> 這類字面文字殘留在輸出裡。
    text = unescape(text or "")
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _parse_pubdate(raw):
    """RSS pubDate 通常是 RFC 822 格式；也容錯 ISO8601（Atom-ish feeds）。"""
    raw = (raw or "").strip()
    if not raw:
        return None
    try:
        dt = email.utils.parsedate_to_datetime(raw)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=datetime.timezone.utc)
        return dt
    except Exception:
        pass
    try:
        return datetime.datetime.fromisoformat(raw.replace("Z", "+00:00"))
    except Exception:
        return None


def fetch_rss_items(rss_url, source_name, limit=15):
    """回傳 RSS 列表，每筆含 title/link/description/pubdate/source。失敗回傳空清單
    （不拋例外，讓 pipeline 的單一來源失敗不影響其他來源，比照 Stocks_Auto/fetch_common.fetch_html）。"""
    try:
        resp = requests.get(rss_url, headers=config.REQUEST_HEADERS, timeout=config.REQUEST_TIMEOUT)
        resp.raise_for_status()
    except Exception as exc:
        print(f"[fetch_common] RSS 擷取失敗 {source_name} ({rss_url}): {exc}")
        return []

    items = []
    for raw in ITEM_RE.findall(resp.text)[:limit]:
        title = _clean_text(_extract_tag(raw, "title"))
        link = _clean_text(_extract_tag(raw, "link"))
        description = _clean_text(_extract_tag(raw, "description"))
        pubdate = _parse_pubdate(_extract_tag(raw, "pubDate"))
        if not title or not link:
            continue
        items.append(
            {
                "title": title,
                "link": link,
                "description": description,
                "pubdate": pubdate,
                "source": source_name,
            }
        )
    return items


def fetch_html(url):
    """GET 一個文章頁 URL，回傳 requests.Response；失敗回傳 None。"""
    try:
        resp = requests.get(url, headers=config.REQUEST_HEADERS, timeout=config.REQUEST_TIMEOUT)
        resp.raise_for_status()
        return resp
    except Exception as exc:
        print(f"[fetch_common] GET 文章頁失敗 {url}: {exc}")
        return None


def _is_in_sidebar_container(tag):
    """往上檢查祖先元素的 tag/class/id，判斷這個 <p> 是否位於側欄/推薦/廣告容器內
    （比照 Stocks_Auto/fetch_common.py 的 DOM 結構訊號法，避免只靠關鍵字黑名單誤留側欄文字）。"""
    for ancestor in tag.parents:
        name = getattr(ancestor, "name", None)
        if name == "aside":
            return True
        if name in (None, "[document]", "html", "body"):
            break
        attr_text = " ".join(ancestor.get("class") or []) + " " + (ancestor.get("id") or "")
        attr_text = attr_text.lower()
        if any(marker in attr_text for marker in config.SIDEBAR_CONTAINER_MARKERS):
            return True
    return False


def extract_body_from_paragraphs(soup, min_len=20):
    """規則式內文擷取：collect所有 <p> 文字，濾除過短/樣板行/側欄容器內的段落，
    其餘依原順序合併（比照 Stocks_Auto/fetch_common.extract_body_from_paragraphs）。"""
    paragraphs = []
    for p in soup.find_all("p"):
        text = p.get_text(" ", strip=True)
        if len(text) < min_len:
            continue
        if any(marker in text for marker in config.BOILERPLATE_MARKERS):
            continue
        if _is_in_sidebar_container(p):
            continue
        paragraphs.append(text)
    return "\n".join(paragraphs)


def fetch_article_body(url):
    """GET 文章頁並擷取內文，任何一步失敗都回傳空字串（呼叫端 fallback 到 RSS description）。"""
    resp = fetch_html(url)
    if resp is None:
        return ""
    soup = BeautifulSoup(resp.text, "html.parser")
    return extract_body_from_paragraphs(soup)
