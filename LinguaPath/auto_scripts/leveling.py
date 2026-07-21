"""M5 分級模組（取代 Stocks_Auto/grouping.py 的角色：那邊依股票代號分組，這裡依
Flesch-Kincaid Grade Level 換算的 CEFR 等級「分組」，見 rules.md 規則03）。

這是分類，不是改寫：文章難度不會被簡化，只是被貼上最接近的 CEFR 標籤。同一等級
當天若有多篇候選，取 additional_sources 較多（代表被更多來源報導、較重要/較可信）
者優先，其次取字數較接近600字者。
"""
import re

import config

SENTENCE_SPLIT_RE = re.compile(r"[.!?]+")
WORD_RE = re.compile(r"[A-Za-z']+")
VOWEL_RE = re.compile(r"[aeiouy]+")


def _count_syllables(word):
    word = word.lower()
    groups = VOWEL_RE.findall(word)
    syllables = len(groups)
    if word.endswith("e") and syllables > 1:
        syllables -= 1
    return max(syllables, 1)


def flesch_kincaid_grade(text):
    words = WORD_RE.findall(text or "")
    sentences = [s for s in SENTENCE_SPLIT_RE.split(text or "") if s.strip()]
    if not words or not sentences:
        return None
    n_words = len(words)
    n_sentences = len(sentences)
    n_syllables = sum(_count_syllables(w) for w in words)
    return 0.39 * (n_words / n_sentences) + 11.8 * (n_syllables / n_words) - 15.59


def grade_to_cefr(grade):
    for max_grade, level in config.CEFR_GRADE_BANDS:
        if grade <= max_grade:
            return level
    return config.CEFR_GRADE_BANDS[-1][1]


def _candidate_rank(article):
    word_count = len(_body_words(article))
    importance = len(article.get("additional_sources") or [])
    return (-importance, abs(word_count - 600))


def _body_words(article):
    return (article.get("body") or "").split()


def assign_levels(articles):
    """回傳 {cefr_level: article}，每個等級最多一篇（挑最佳候選），字典只含當天
    真的有候選文章的等級——A1/A2/B1 常常會缺席，屬預期內限制（見 rules.md 規則03）。"""
    buckets = {}
    for article in articles:
        grade = flesch_kincaid_grade(article.get("body") or "")
        if grade is None:
            continue
        level = grade_to_cefr(grade)
        article = dict(article)
        article["_grade_level"] = round(grade, 1)
        buckets.setdefault(level, []).append(article)

    assigned = {}
    for level, candidates in buckets.items():
        candidates.sort(key=_candidate_rank)
        assigned[level] = candidates[0]
    return assigned


if __name__ == "__main__":
    easy = "The cat sat on the mat. It was a hot day. The cat was happy. " * 20
    hard = (
        "The ramifications of this unprecedented monetary policy intervention remain "
        "profoundly consequential for macroeconomic stability, notwithstanding the "
        "ostensibly conciliatory rhetoric employed by central bank officials. "
    ) * 10
    print("easy grade:", flesch_kincaid_grade(easy), "->", grade_to_cefr(flesch_kincaid_grade(easy)))
    print("hard grade:", flesch_kincaid_grade(hard), "->", grade_to_cefr(flesch_kincaid_grade(hard)))
