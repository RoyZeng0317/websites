"""M4 去重模組（比照 Stocks_Auto/dedup.py：標題相似度 + body bigram Jaccard 安全網，
避免「標題結構相似但主體不同」的文章被誤合併）。
同一則新聞被多個來源報導時，合併為一筆，body 最長者（代理『報導最完整』）為代表，
其餘列為 additional_sources，供 leveling.py 判斷『重要性』使用。
"""
from difflib import SequenceMatcher

import config


def _title_similarity(a, b):
    return SequenceMatcher(None, a, b).ratio()


def _char_shingles(text, n=None):
    n = n or config.BODY_SHINGLE_LEN
    text = (text or "")[: config.BODY_COMPARE_CHARS]
    if len(text) < n:
        return set()
    return {text[i : i + n] for i in range(len(text) - n + 1)}


def _body_similarity(body_a, body_b):
    sa, sb = _char_shingles(body_a), _char_shingles(body_b)
    if not sa or not sb:
        return 1.0
    return len(sa & sb) / len(sa | sb)


def _should_merge(article, rep, threshold):
    if _title_similarity(article["title"], rep["title"]) < threshold:
        return False
    if _body_similarity(article.get("body"), rep.get("body")) < config.BODY_SIMILARITY_MIN:
        return False
    return True


def _pick_representative(cluster):
    return max(cluster, key=lambda a: len(a.get("body") or ""))


def dedup(articles, threshold=None):
    threshold = threshold if threshold is not None else config.DEDUP_THRESHOLD

    clusters = []
    for article in articles:
        placed = False
        for cluster in clusters:
            if _should_merge(article, cluster[0], threshold):
                cluster.append(article)
                placed = True
                break
        if not placed:
            clusters.append([article])

    result = []
    for cluster in clusters:
        rep = dict(_pick_representative(cluster))
        others = [a for a in cluster if a is not rep and a.get("link") != rep.get("link")]
        rep["additional_sources"] = [
            {"source": a.get("source"), "link": a.get("link"), "title": a.get("title")}
            for a in others
        ]
        result.append(rep)
    return result


if __name__ == "__main__":
    sample = [
        {"title": "Heavy rain floods streets across the capital", "body": "x" * 700, "source": "BBC News", "link": "a1"},
        {"title": "Heavy rain floods streets in the capital", "body": "x" * 900, "source": "The Guardian", "link": "a2"},
        {"title": "Central bank raises interest rates again", "body": "y" * 650, "source": "AP News", "link": "a3"},
    ]
    out = dedup(sample)
    print(f"輸入 {len(sample)} 篇，去重後 {len(out)} 篇")
    for a in out:
        print("-", a["title"], "| source=", a["source"], "| additional=", a["additional_sources"])
    assert len(out) == 2, "前兩篇為同事件應合併、第三篇應獨立，共應為2篇"
