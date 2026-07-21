import datetime

import config


def passes_length_rule(article):
    body = article.get("body") or ""
    return len(body) >= config.MIN_BODY_LENGTH


def passes_today_rule(article, today=None):
    if not config.TODAY_ONLY:
        return True
    pub_date = article.get("pubdate")
    if pub_date is None:
        return False
    today = today or datetime.date.today()
    if isinstance(pub_date, datetime.datetime):
        pub_date = pub_date.date()
    return pub_date == today


FALSE_POSITIVE_CONTEXT_WINDOW = 6


def _count_keyword_valid_hits(keyword, text):
    """keyword 在 text 中「不落在已知誤配複合詞裡」的有效命中次數（含重複）
    （見 config.FINANCIAL_KEYWORD_FALSE_POSITIVE_PHRASES，例如「指數」命中
    「空氣品質指數」不算數）。沒有設定誤配清單的關鍵字，任一次子字串命中即算數。"""
    false_positive_phrases = config.FINANCIAL_KEYWORD_FALSE_POSITIVE_PHRASES.get(keyword)
    count = 0
    start = 0
    while True:
        idx = text.find(keyword, start)
        if idx == -1:
            return count
        if false_positive_phrases:
            window_start = max(0, idx - FALSE_POSITIVE_CONTEXT_WINDOW)
            window_end = idx + len(keyword) + FALSE_POSITIVE_CONTEXT_WINDOW
            window = text[window_start:window_end]
            if any(phrase in window for phrase in false_positive_phrases):
                start = idx + 1
                continue
        count += 1
        start = idx + 1


def passes_core_market_filter(article):
    """UNCLASSIFIED_GROUP（未分類到實際公司）文章適用的嚴格財經相關性檢查：
    title+body 中 config.CORE_MARKET_KEYWORDS 的有效命中總次數（含重複）需達
    config.UNCLASSIFIED_MIN_CORE_HITS 以上才算數（見 config.py 2026-07-20 修正三）。"""
    title = article.get("title") or ""
    body = article.get("body") or ""
    text = title + " " + body
    total_hits = sum(_count_keyword_valid_hits(keyword, text) for keyword in config.CORE_MARKET_KEYWORDS)
    return total_hits >= config.UNCLASSIFIED_MIN_CORE_HITS


def filter_unclassified_group(grouped):
    """套用於 grouping.group() 的輸出（{group_name: [articles...]}）：只對
    config.UNCLASSIFIED_GROUP 這組文章套用 passes_core_market_filter 嚴格篩選；
    已比對到實際上市櫃公司的分組維持不變，不受此限制。過濾後若
    UNCLASSIFIED_GROUP 變空則整組移除。"""
    result = {}
    for group_name, articles in grouped.items():
        if group_name != config.UNCLASSIFIED_GROUP:
            result[group_name] = articles
            continue
        kept = [a for a in articles if passes_core_market_filter(a)]
        if kept:
            result[group_name] = kept
    return result


RULES = [
    passes_length_rule,
    passes_today_rule,
]


def apply_rules(articles, today=None):
    passed = []
    for article in articles:
        ok = True
        for rule in RULES:
            try:
                if rule is passes_today_rule:
                    result = rule(article, today=today)
                else:
                    result = rule(article)
            except Exception:
                result = False
            if not result:
                ok = False
                break
        if ok:
            passed.append(article)
    return passed
