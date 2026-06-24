"""
AI Prompt Analyzer - Python Rule-Based Backend
Firebase Cloud Functions (2nd gen) + Flask local dev
"""
import json
import re
from flask import Flask, request, jsonify

# ── Rule-based analysis engine ─────────────────────────────────────────────

VAGUE_WORDS = [
    "something", "stuff", "things", "whatever", "etc", "and so on",
    "maybe", "perhaps", "possibly", "kind of", "sort of", "somehow",
    "some way", "lots of", "bunch of", "a bit", "a little", "somehow",
    "some stuff", "some things",
]

ACTION_VERBS = [
    "write", "create", "explain", "analyze", "analyse", "list",
    "summarize", "summarise", "translate", "generate", "describe",
    "compare", "calculate", "fix", "improve", "suggest", "find",
    "identify", "design", "build", "implement", "review", "edit",
    "format", "convert", "extract", "classify", "evaluate", "draft",
    "rewrite", "answer", "provide", "give", "make", "show", "tell",
    "define", "outline", "plan", "help", "check", "verify",
]

FORMAT_WORDS = [
    "list", "table", "json", "markdown", "bullet", "numbered",
    "format", "output", "include", "return", "paragraph", "steps",
    "in the form", "as a", "present",
]

ROLE_WORDS = [
    "you are", "act as", "as a ", "as an ", "pretend", "imagine you",
    "role of", "expert in", "specialist",
]

EXAMPLE_WORDS = [
    "for example", "such as", "like", "e.g.", "for instance",
    "similar to", "example:", "as follows",
]

CONSTRAINT_WORDS = [
    "max", "minimum", "maximum", "at most", "at least", "no more than",
    "tone", "formal", "informal", "concise", "brief", "detailed",
    "beginner", "expert", "in english", "in chinese", "in 中文",
    "words", "sentences", "characters", "paragraphs",
]

AMBIGUOUS_STARTERS = ["it", "this", "that", "they", "these", "those", "its"]


def analyze_prompt(text: str) -> dict:
    text = text.strip()
    lower = text.lower()
    words = text.split()
    issues = []
    suggestions = []
    score = 100

    # ── 1. Length ───────────────────────────────────────────────────────────
    char_count = len(text)
    word_count = len(words)

    if char_count == 0:
        issues.append("提示詞為空，請輸入內容。")
        suggestions.append("至少說明目標、背景與期望輸出。")
        score -= 65
    elif char_count < 10:
        issues.append("提示詞過短，無法有效傳達意圖。")
        suggestions.append("至少說明目標、背景與期望輸出。")
        score -= 45
    elif char_count < 30:
        issues.append("提示詞太簡短，缺乏足夠細節。")
        suggestions.append("增加背景說明或限制條件。")
        score -= 20
    elif char_count > 3000:
        issues.append("提示詞過長，可能導致模型忽略部分細節。")
        suggestions.append("拆分為多個獨立步驟的提示詞。")
        score -= 10

    # ── 2. Vague language ───────────────────────────────────────────────────
    found_vague = [w for w in VAGUE_WORDS if w in lower]
    if found_vague:
        unique_vague = list(set(found_vague))[:4]
        issues.append(f"含有模糊詞彙：{', '.join(unique_vague)}")
        suggestions.append("用具體名詞或明確描述取代模糊詞。")
        score -= min(20, 7 * len(unique_vague))

    # ── 3. Starts with ambiguous pronoun ───────────────────────────────────
    if words and words[0].lower() in AMBIGUOUS_STARTERS:
        issues.append(f"以模糊代名詞「{words[0]}」開頭，缺乏明確主詞。")
        suggestions.append("明確說明「它」或「這」指的是什麼。")
        score -= 15

    # ── 4. Missing action verb ──────────────────────────────────────────────
    first_five = [w.lower().rstrip(".,!?") for w in words[:5]]
    has_action = any(v in first_five for v in ACTION_VERBS)
    if not has_action and char_count > 30:
        suggestions.append("在開頭使用明確動詞，例如「寫」、「解釋」、「分析」、「列出」。")
        score -= 10

    # ── 5. Output format unspecified ───────────────────────────────────────
    has_format = any(f in lower for f in FORMAT_WORDS)
    if not has_format and char_count > 60:
        suggestions.append("指定輸出格式，例如：條列式、表格、JSON 或段落。")
        score -= 8

    # ── 6. No role / context ────────────────────────────────────────────────
    has_role = any(r in lower for r in ROLE_WORDS)
    if not has_role and char_count > 120:
        suggestions.append("設定角色有助於提升回答品質，例如：「你是一位資深工程師…」")
        score -= 5

    # ── 7. No examples ──────────────────────────────────────────────────────
    has_examples = any(e in lower for e in EXAMPLE_WORDS)
    if not has_examples and char_count > 250:
        suggestions.append("提供範例能讓模型更準確理解您的期望。")
        score -= 5

    # ── 8. No constraints ───────────────────────────────────────────────────
    has_constraints = any(c in lower for c in CONSTRAINT_WORDS)
    if not has_constraints and char_count > 60:
        suggestions.append("加入限制條件，例如字數、語氣或目標受眾。")
        score -= 5

    # ── 9. Pure question (minor deduction) ─────────────────────────────────
    stripped = text.rstrip()
    if stripped.endswith("?") and len(words) < 15:
        suggestions.append("相較於單純提問，指令式提示詞通常能獲得更豐富的回覆。")
        score -= 3

    # ── Final score & grade ─────────────────────────────────────────────────
    score = max(0, score)

    if score >= 85:
        grade, overall = "A", "優秀的提示詞"
    elif score >= 70:
        grade, overall = "B", "良好，還有小幅優化空間"
    elif score >= 55:
        grade, overall = "C", "一般，請參考建議進行改善"
    elif score >= 40:
        grade, overall = "D", "較弱，建議根據提示大幅修改"
    else:
        grade, overall = "F", "需要全面改寫"

    return {
        "score": score,
        "grade": grade,
        "overall": overall,
        "issues": issues,
        "suggestions": suggestions,
        "word_count": word_count,
        "char_count": char_count,
    }


# ── Firebase Cloud Functions entry point ───────────────────────────────────

def create_response(body: dict, status: int = 200):
    """Helper used by both Firebase Functions and Flask."""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json; charset=utf-8",
    }
    return json.dumps(body, ensure_ascii=False), status, headers


try:
    from firebase_functions import https_fn

    @https_fn.on_request()
    def api(req: https_fn.Request) -> https_fn.Response:
        # CORS preflight
        if req.method == "OPTIONS":
            return https_fn.Response(
                "", 204,
                {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            )

        # Only POST /analyze
        if not req.path.rstrip("/").endswith("/analyze") or req.method != "POST":
            body, status, headers = create_response({"error": "Not found"}, 404)
            return https_fn.Response(body, status, headers)

        data = req.get_json(silent=True) or {}
        prompt = data.get("prompt", "")
        if not isinstance(prompt, str):
            body, status, headers = create_response({"error": "Invalid input"}, 400)
            return https_fn.Response(body, status, headers)

        result = analyze_prompt(prompt)
        body, status, headers = create_response(result)
        return https_fn.Response(body, status, headers)

except ImportError:
    # Running locally without firebase_functions installed
    pass


# ── Flask local-dev server ─────────────────────────────────────────────────

flask_app = Flask(__name__)


@flask_app.route("/api/analyze", methods=["POST", "OPTIONS"])
def analyze_endpoint():
    if request.method == "OPTIONS":
        resp = flask_app.make_response("")
        resp.status_code = 204
        resp.headers["Access-Control-Allow-Origin"] = "*"
        resp.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
        return resp

    data = request.get_json(silent=True) or {}
    prompt = data.get("prompt", "")
    result = analyze_prompt(prompt)
    resp = jsonify(result)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp


if __name__ == "__main__":
    flask_app.run(host="0.0.0.0", port=8080, debug=True)
