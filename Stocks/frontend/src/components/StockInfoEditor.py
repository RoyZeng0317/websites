"""股票資訊人工編輯器（本地執行，不隨前端部署）。

呼叫後端 /api/admin/stock/{symbol}（見 backend/admin_stock_info.py）讀寫人工覆寫
欄位；GET /api/stock/{symbol} 之後會用這裡存的值蓋掉即時抓取結果。

使用方式：
1. 開啟已部署的網站 → 登入 Google（須是 ADMIN_EMAIL 帳號）→ 進管理頁 → 按「複製管理員
   Token」（NewsAdminPanel.tsx）。
2. 執行本檔案，貼上 Token，輸入股票代號（如 2330.TW），按「讀取」。
3. Token 效期約 1 小時，過期後回步驟 1 重新複製即可。
"""

import json, tkinter as tk
from tkinter import messagebox
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

DEFAULT_BASE = "https://stock-info-backend-z6sr.onrender.com/api"
NUMERIC_FIELDS = {"marketCap", "dividendYield", "peRatio", "priceToBook"}
FIELDS = [
    ("marketCap", "市值"), ("dividendNote", "配息配股"), ("dividendYield", "殖利率"),
    ("peRatio", "本益比"), ("priceToBook", "股價淨值比"), ("name", "公司名稱"),
    ("sector", "產業別"), ("industry", "細產業"), ("website", "網站"), ("description", "公司簡介"),
]


def parse_num(s):
    try:
        return int(s)
    except ValueError:
        return float(s)


def call(base, method, path, token, body=None):
    req = Request(
        f"{base}{path}", method=method,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        data=json.dumps(body).encode() if body is not None else None,
    )
    try:
        with urlopen(req, timeout=15) as resp:
            return json.loads(resp.read())
    except HTTPError as e:
        try:
            detail = json.loads(e.read()).get("detail", str(e))
        except Exception:
            detail = str(e)
        raise RuntimeError(detail)
    except URLError as e:
        raise RuntimeError(f"連線失敗: {e.reason}")


class App:
    def __init__(self, win):
        self.win = win
        win.title("股票資訊編輯器 StockInfoEditor")
        win.geometry("680x700")

        top = tk.Frame(win)
        top.pack(fill="x", padx=10, pady=6)
        tk.Label(top, text="後端網址").grid(row=0, column=0, sticky="w")
        self.base = tk.Entry(top)
        self.base.insert(0, DEFAULT_BASE)
        self.base.grid(row=0, column=1, sticky="we")
        tk.Label(top, text="管理員 Token").grid(row=1, column=0, sticky="w")
        self.token = tk.Entry(top, show="*")
        self.token.grid(row=1, column=1, sticky="we")
        tk.Label(top, text="股票代號").grid(row=2, column=0, sticky="w")
        self.symbol = tk.Entry(top)
        self.symbol.grid(row=2, column=1, sticky="we")
        top.columnconfigure(1, weight=1)

        btns = tk.Frame(win)
        btns.pack(fill="x", padx=10, pady=4)
        tk.Button(btns, text="讀取", command=self.load).pack(side="left")
        tk.Button(btns, text="儲存", command=self.save).pack(side="left", padx=6)
        tk.Button(btns, text="清除覆寫", command=self.clear).pack(side="left")

        form = tk.Frame(win)
        form.pack(fill="both", expand=True, padx=10, pady=6)
        self.entries, self.refs = {}, {}
        for i, (key, label) in enumerate(FIELDS):
            tk.Label(form, text=label).grid(row=i, column=0, sticky="nw", pady=3)
            widget = tk.Text(form, height=4, width=40) if key == "description" else tk.Entry(form, width=40)
            widget.grid(row=i, column=1, sticky="we", pady=3)
            ref = tk.Label(form, fg="gray", wraplength=180, justify="left")
            ref.grid(row=i, column=2, sticky="w", padx=6)
            self.entries[key], self.refs[key] = widget, ref
        form.columnconfigure(1, weight=1)

        self.status = tk.Label(win, fg="blue", anchor="w", wraplength=660, justify="left")
        self.status.pack(fill="x", padx=10, pady=6)

    def get_val(self, key):
        w = self.entries[key]
        return w.get("1.0", "end").strip() if isinstance(w, tk.Text) else w.get().strip()

    def set_val(self, key, val):
        w = self.entries[key]
        if isinstance(w, tk.Text):
            w.delete("1.0", "end")
            w.insert("1.0", "" if val is None else str(val))
        else:
            w.delete(0, "end")
            w.insert(0, "" if val is None else str(val))

    def set_status(self, text, ok=True):
        self.status.config(text=text, fg="green" if ok else "red")

    def _ready(self):
        symbol, token, base = self.symbol.get().strip(), self.token.get().strip(), self.base.get().strip()
        if not symbol or not token or not base:
            messagebox.showwarning("提醒", "請先輸入後端網址、管理員 Token 與股票代號")
            return None
        return symbol, token, base

    def load(self):
        ready = self._ready()
        if not ready:
            return
        symbol, token, base = ready
        try:
            live = call(base, "GET", f"/stock/{symbol}", token)
            override = call(base, "GET", f"/admin/stock/{symbol}", token)
        except RuntimeError as e:
            self.set_status(f"讀取失敗: {e}", ok=False)
            return

        overrides = override.get("overrides", {})
        for key, _ in FIELDS:
            self.set_val(key, overrides.get(key, ""))
            self.refs[key].config(text=f"目前顯示：{live.get(key, '')}")
        self.set_status(f"已讀取 {symbol}（最後更新：{override.get('updated_at') or '尚無人工覆寫'}）")

    def save(self):
        ready = self._ready()
        if not ready:
            return
        symbol, token, base = ready
        payload = {}
        for key, _ in FIELDS:
            val = self.get_val(key)
            if not val:
                continue
            if key in NUMERIC_FIELDS:
                try:
                    val = parse_num(val)
                except ValueError:
                    self.set_status(f"{key} 必須是數字", ok=False)
                    return
            payload[key] = val
        try:
            res = call(base, "PUT", f"/admin/stock/{symbol}", token, payload)
        except RuntimeError as e:
            self.set_status(f"儲存失敗: {e}", ok=False)
            return
        gh = res.get("github", {})
        note = "已 commit 回 GitHub" if gh.get("committed") else f"未 commit 回 GitHub（{gh.get('reason', '未知原因')}）"
        self.set_status(f"已儲存 {symbol}。{note}")

    def clear(self):
        ready = self._ready()
        if not ready:
            return
        symbol, token, base = ready
        if not messagebox.askyesno("確認", f"確定要清除 {symbol} 的所有人工覆寫嗎？"):
            return
        try:
            call(base, "DELETE", f"/admin/stock/{symbol}", token)
        except RuntimeError as e:
            self.set_status(f"清除失敗: {e}", ok=False)
            return
        for key, _ in FIELDS:
            self.set_val(key, "")
        self.set_status(f"已清除 {symbol} 的覆寫")


def main():
    win = tk.Tk()
    App(win)
    win.mainloop()


if __name__ == "__main__":
    main()
