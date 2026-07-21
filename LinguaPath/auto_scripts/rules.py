"""M3 規則篩選引擎，對應 rules.md 規則01/02（比照 Stocks_Auto/rules.py 的結構）。"""
import datetime

import config


def passes_length_rule(article):
    body = article.get("body") or ""
    return len(body.split()) >= config.MIN_BODY_WORDS


def passes_recency_rule(article, now=None):
    pubdate = article.get("pubdate")
    if pubdate is None:
        return False
    now = now or datetime.datetime.now(datetime.timezone.utc)
    age = now - pubdate
    return datetime.timedelta(0) <= age <= datetime.timedelta(hours=config.RECENT_WINDOW_HOURS)


RULES = [passes_length_rule, passes_recency_rule]


def apply_rules(articles, now=None):
    passed = []
    for article in articles:
        ok = True
        for rule in RULES:
            try:
                result = rule(article, now=now) if rule is passes_recency_rule else rule(article)
            except Exception:
                result = False
            if not result:
                ok = False
                break
        if ok:
            passed.append(article)
    return passed
