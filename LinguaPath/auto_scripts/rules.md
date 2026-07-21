# Rules

比照 `Stocks/Stocks_Auto/rules.md` 的角色：這裡只寫「篩選規則」，實作對應在 `rules.py`
（規則01/02）與 `leveling.py`（規則03）。

01. 來源文章正文（body，爬蟲取得的全文，非 RSS 摘要）須達 600 字（英文以空白斷詞計算的
    word count）以上，未達門檻的文章當日略過。這只是「候選門檻」，不代表輸出全文——
    `output.py` 寫入 JSON 的 `content` 欄位是摘要（標題+首段約100-150字）+ 原文連結，
    不存完整全文，比照 Stocks_Auto 的版權考量（別人的新聞全文不整篇存進 repo）。

02. 只取「近 48 小時內發布」的新聞，缺少發布時間（pubdate）者略過該篇。Stocks_Auto
    原本用「只取當日」，但這裡的來源橫跨多個時區（BBC/Guardian/NPR/AP 是 UTC 前後、
    Al Jazeera/Taiwan News 各自不同），改用滾動時間窗口比較不會因時區誤差在午夜前後
    誤刪剛好發布的新聞。

03. 依 Flesch-Kincaid Grade Level 讀本難度公式，把每篇文章歸類到最接近的 CEFR 等級
    （A1-C2），對照表見 `config.CEFR_GRADE_BANDS`。這是「分類」不是「改寫」——文章本身
    的難度不會被簡化，只是被標記屬於哪個等級，同一 CEFR 等級當天若有多篇候選，取
    「被越多來源報導（additional_sources 越多）優先，其次 word count 越接近600字」者。

    **已知限制**：主流英文新聞的用字/句構通常落在 Flesch-Kincaid 8-14 年級（約當
    CEFR B2-C1），A1/A2/B1 常常當天沒有任何候選文章符合——這是刻意的設計結果，不會
    為了湊滿六個等級而硬塞不合適的文章，也不會用 LLM 把難文章簡化成易文章（見下）。

04. 全流程零 LLM/生成式 AI API 依賴：不呼叫 OpenAI/Anthropic/Gemini 等任何生成模型。
    詞彙教學的定義文字來自免費字典 API（`api.dictionaryapi.dev`，純查詢、非生成），
    可用 `grep -riE "openai|anthropic|generativeai|gpt-|google.generativeai"` 對本目錄
    掃描驗證零命中。
