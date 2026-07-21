"""輕量 TF-IDF term-document matrix，供 vocabulary.py 抽取候選詞彙用（比照
Stocks_Auto/12_Martix_DataSheet.py 的演算法，改為英文單詞 token + 停用詞過濾，
並且是對「當天整批文章」建 matrix（而非 stocks_auto 對單一分組合併文本建 matrix），
讓 IDF 真正反映「這個詞在其他文章裡是否也常見」，而不會退化成純 TF 排序。
"""
import math
import re
from collections import Counter

import config

WORD_RE = re.compile(r"[A-Za-z][A-Za-z'-]*")


def tokenize(text):
    if not text:
        return []
    tokens = [t.lower() for t in WORD_RE.findall(text)]
    return [t for t in tokens if len(t) >= 4 and t not in config.STOPWORDS]


def term_frequencies(tokens):
    counts = Counter(tokens)
    total = sum(counts.values()) or 1
    return {term: count / total for term, count in counts.items()}


def build_matrix(documents):
    """documents: List[str] -> (terms, matrix)，matrix[i] 為第 i 篇文件對應各 term 的 TF-IDF 值。"""
    tokenized_docs = [tokenize(doc) for doc in documents]
    doc_freq = Counter()
    for tokens in tokenized_docs:
        doc_freq.update(set(tokens))

    n_docs = len(documents) or 1
    idf = {term: math.log(n_docs / (1 + df)) + 1 for term, df in doc_freq.items()}
    terms = sorted(idf.keys())
    term_index = {term: i for i, term in enumerate(terms)}

    matrix = []
    for tokens in tokenized_docs:
        row = [0.0] * len(terms)
        tf = term_frequencies(tokens)
        for term, freq in tf.items():
            row[term_index[term]] = freq * idf[term]
        matrix.append(row)

    return terms, matrix


def top_keywords(doc_index, terms, matrix, top_n=10):
    row = matrix[doc_index]
    scored = sorted(zip(terms, row), key=lambda pair: pair[1], reverse=True)
    return [term for term, weight in scored if weight > 0][:top_n]


if __name__ == "__main__":
    sample_docs = [
        "The central bank raised interest rates to fight persistent inflation across the economy.",
        "Scientists launched a new telescope into orbit to study distant galaxies and stars.",
        "Heavy rain caused flooding across the capital, forcing several roads to close overnight.",
    ]
    terms, matrix = build_matrix(sample_docs)
    print(f"詞彙表大小: {len(terms)}")
    for i, doc in enumerate(sample_docs):
        print(doc[:40], "->", top_keywords(i, terms, matrix, top_n=5))
