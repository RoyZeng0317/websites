"""端到端管線入口點（比照 Stocks_Auto/03_Pipeline.py）。
依 rules.md：擷取(M2) -> 規則篩選(M3) -> 去重(M4) -> CEFR分級(M5) -> 摘要/詞彙(M6)
-> 輸出JSON(M7)。

各來源擷取器彼此獨立，任一來源失敗（RSS改版/被擋/連線錯誤等）僅記錄訊息並回傳
空清單，不會讓整條管線崩潰（見各 fetch_*.py / fetch_common.py 內的例外處理）。

全流程零 LLM/生成式 AI API 依賴（見 rules.md 規則04）。

執行方式：
    python pipeline.py
"""
import datetime

import config
import rules
import dedup
import leveling
import summarize
import output

import fetch_bbc
import fetch_guardian
import fetch_npr
import fetch_aljazeera
import fetch_ap
import fetch_taiwannews


def fetch_all():
    """依序呼叫每個來源的 fetch()，個別失敗不影響其他來源。"""
    all_articles = []
    fetch_funcs = {
        "bbc": fetch_bbc.fetch,
        "guardian": fetch_guardian.fetch,
        "npr": fetch_npr.fetch,
        "aljazeera": fetch_aljazeera.fetch,
        "ap": fetch_ap.fetch,
        "taiwannews": fetch_taiwannews.fetch,
    }
    for name, fetch_func in fetch_funcs.items():
        try:
            articles = fetch_func()
        except Exception as exc:
            print(f"[pipeline] 來源 {name} 擷取時發生未預期例外，略過：{type(exc).__name__}: {exc}")
            articles = []
        print(f"[pipeline] {name}: 擷取 {len(articles)} 篇")
        all_articles.extend(articles)
    return all_articles


def run():
    today = datetime.date.today()
    print(f"=== LinguaPath news pipeline 開始執行 {today.isoformat()} ===")

    raw_articles = fetch_all()
    print(f"[pipeline] 共擷取 {len(raw_articles)} 篇（去重/篩選前）")

    filtered = rules.apply_rules(raw_articles)
    print(f"[pipeline] rules.md 篩選後剩 {len(filtered)} 篇（600字門檻 + 48小時內）")

    deduped = dedup.dedup(filtered)
    print(f"[pipeline] 去重後剩 {len(deduped)} 篇")

    assigned = leveling.assign_levels(deduped)
    print(f"[pipeline] 分入 {len(assigned)} 個 CEFR 等級：{sorted(assigned.keys())}")

    if not assigned:
        print("[pipeline] 沒有任何文章通過篩選/分級，不寫入檔案")
        return None

    all_bodies = [a.get("body") or "" for a in assigned.values()]
    levels_in_order = list(assigned.keys())
    for idx, level in enumerate(levels_in_order):
        article = assigned[level]
        article["summary"] = summarize.summarize_article(article)
        article["vocabulary"] = summarize.article_vocabulary(article, all_bodies, idx)

    report = output.build_report(assigned, report_date=today)
    path = output.write_report(report)
    print(f"[pipeline] 已輸出：{path}")
    print(f"=== 完成，共 {len(assigned)} 個等級：{sorted(assigned.keys())} ===")
    return path


if __name__ == "__main__":
    run()
