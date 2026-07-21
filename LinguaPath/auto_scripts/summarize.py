"""M6 摘要/詞彙模組（比照 Stocks_Auto/summarize.py 的角色：規則式摘要 + TF-IDF
關鍵字，這裡把「關鍵字標籤」延伸為「詞彙教學清單」，改查免費字典 API 拿定義，
全程零 LLM，見 rules.md 規則04）。
"""
import re

import requests

import config
import tfidf

SUMMARY_MAX_LEN = config.SUMMARY_MAX_LEN


def _looks_like_proper_noun(word, body):
    """啟發式判斷：這個詞在原文(未轉小寫)裡是否『只曾經以字首大寫的形式出現、
    從未以全小寫形式出現』——符合的話多半是國名/人名/機構名等專有名詞
    （例如 "China"），這種詞當「教學詞彙」沒有意義（學習者早就認識），且免費
    字典 API 常常只查得到另一個不相關詞義（例如 china 指瓷器），寧可跳過換下一個候選詞。
    """
    body = body or ""
    lower_hits = len(re.findall(r"\b" + re.escape(word) + r"\b", body))
    capitalized = word[:1].upper() + word[1:]
    cap_hits = len(re.findall(r"\b" + re.escape(capitalized) + r"\b", body))
    return cap_hits > 0 and lower_hits == 0


def summarize_article(article):
    """回傳文章摘要文字（100-150字內，規則式擷取：優先用 RSS description，
    沒有才退回 body 前段，比照 Stocks_Auto/summarize.py 的方案B）。"""
    description = (article.get("description") or "").strip()
    body = (article.get("body") or "").strip()
    text = description or body
    if len(text) > SUMMARY_MAX_LEN:
        text = text[:SUMMARY_MAX_LEN].rstrip() + "…"
    return text


def _lookup_definition(word):
    """查詢免費字典 API（api.dictionaryapi.dev，非 LLM，純字典查詢）拿第一個定義；
    查無此字（通常是專有名詞/罕見詞）回傳 None，呼叫端換下一個候選詞。"""
    url = config.DICTIONARY_API_URL.format(word=word)
    try:
        resp = requests.get(url, timeout=config.REQUEST_TIMEOUT)
        if resp.status_code != 200:
            return None
        data = resp.json()
        for entry in data:
            for meaning in entry.get("meanings", []):
                for definition in meaning.get("definitions", []):
                    text = (definition.get("definition") or "").strip()
                    if text:
                        return text
    except Exception as exc:
        print(f"[summarize] 字典查詢失敗 {word}: {exc}")
    return None


def article_vocabulary(article, all_documents, doc_index, top_n=None):
    """回傳 [{word, definition}]，最多 top_n 筆（預設 config.VOCAB_TARGET_COUNT）。
    候選詞來自當天整批文章的 TF-IDF 高權重詞（tfidf.py），依序查字典，查得到才收錄，
    查不到（例如專有名詞）就換下一個候選詞，直到湊滿 top_n 或候選用盡。"""
    top_n = top_n or config.VOCAB_TARGET_COUNT
    terms, matrix = tfidf.build_matrix(all_documents)
    candidates = tfidf.top_keywords(doc_index, terms, matrix, top_n=config.VOCAB_CANDIDATE_POOL)

    body = article.get("body") or ""
    vocabulary = []
    for word in candidates:
        if len(vocabulary) >= top_n:
            break
        if _looks_like_proper_noun(word, body):
            continue
        definition = _lookup_definition(word)
        if definition:
            vocabulary.append({"word": word, "definition": definition})
    return vocabulary


if __name__ == "__main__":
    sample = {
        "title": "Central bank raises interest rates again",
        "description": "The central bank raised interest rates today to fight persistent inflation across the economy, surprising many analysts.",
        "body": "The central bank raised interest rates today to fight persistent inflation. " * 5,
    }
    print("summary:", summarize_article(sample))
    vocab = article_vocabulary(sample, [sample["body"]], 0, top_n=3)
    print("vocabulary:", vocab)
