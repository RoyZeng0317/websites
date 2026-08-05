"""Stocks_Auto 桌面操作介面。"""

import contextlib
import datetime
import importlib
import json
import os
import queue
import threading
import traceback
import webbrowser

import tkinter as tk
from tkinter import messagebox, ttk
from tkinter.scrolledtext import ScrolledText

import config
import dedup
import fetch_cnyes
import fetch_common
import fetch_ctee
import fetch_ptt
import fetch_udn
import fetch_youtube
import grouping
import output
import rules
import summarize

# 這些檔名以數字開頭，需透過 importlib 載入。
data_search = importlib.import_module("01_Data_Search")
fetch_yahoo = importlib.import_module("02_Fetch_Yahoo")
pipeline = importlib.import_module("03_Pipeline")
matrix_data_sheet = importlib.import_module("12_Martix_DataSheet")


SOURCES = {
    "yahoo": ("Yahoo 股市", pipeline._fetch_yahoo),
    "cnyes": ("鉅亨網", fetch_cnyes.fetch),
    "udn": ("經濟日報", fetch_udn.fetch),
    "ctee": ("工商時報", fetch_ctee.fetch),
    "ptt": ("PTT Stock", fetch_ptt.fetch),
    "youtube": ("57 東森財經新聞", fetch_youtube.fetch),
}


class QueueWriter:
    """將背景執行緒的 print 輸出安全地送回 GUI。"""

    def __init__(self, messages: queue.Queue[tuple[str, object]]):
        self.messages = messages

    def write(self, text: str, /) -> int:
        if text and text.strip():
            self.messages.put(("log", text.rstrip()))
        return len(text)

    def flush(self) -> None:
        pass


class StocksAutoApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Stocks Auto｜市場新聞整理")
        self.geometry("960x700")
        self.minsize(820, 600)
        self.configure(bg="#f4f7fb")

        self.messages = queue.Queue()
        self.running = False
        self.report_path = ""
        self.source_vars = {key: tk.BooleanVar(value=True) for key in SOURCES}
        self.status_var = tk.StringVar(value="就緒：選擇來源後即可開始整理。")
        self.result_var = tk.StringVar(value="尚未產生報告")

        self._configure_style()
        self._build_ui()
        self.after(100, self._consume_messages)

    def _configure_style(self):
        style = ttk.Style(self)
        style.theme_use("clam")
        style.configure("App.TFrame", background="#f4f7fb")
        style.configure("Card.TFrame", background="#ffffff")
        style.configure("Title.TLabel", background="#f4f7fb", foreground="#13233a", font=("Microsoft JhengHei UI", 20, "bold"))
        style.configure("Sub.TLabel", background="#f4f7fb", foreground="#64748b", font=("Microsoft JhengHei UI", 10))
        style.configure("CardTitle.TLabel", background="#ffffff", foreground="#1e3a5f", font=("Microsoft JhengHei UI", 12, "bold"))
        style.configure("CardText.TLabel", background="#ffffff", foreground="#526275", font=("Microsoft JhengHei UI", 10))
        style.configure("Run.TButton", font=("Microsoft JhengHei UI", 11, "bold"), padding=(18, 10), foreground="#ffffff", background="#2563eb")
        style.map("Run.TButton", background=[("active", "#1d4ed8"), ("disabled", "#94a3b8")])

    def _build_ui(self):
        root = ttk.Frame(self, style="App.TFrame", padding=24)
        root.pack(fill="both", expand=True)
        root.columnconfigure(0, weight=1)
        root.rowconfigure(3, weight=1)

        ttk.Label(root, text="市場新聞自動整理", style="Title.TLabel").grid(row=0, column=0, sticky="w")
        ttk.Label(root, text="抓取、過濾、去重、分群並輸出每日 JSON 報告", style="Sub.TLabel").grid(row=1, column=0, sticky="w", pady=(4, 18))

        controls = ttk.Frame(root, style="Card.TFrame", padding=20)
        controls.grid(row=2, column=0, sticky="ew")
        controls.columnconfigure(0, weight=1)
        ttk.Label(controls, text="新聞來源", style="CardTitle.TLabel").grid(row=0, column=0, sticky="w")
        ttk.Label(controls, text="未選取任何來源時不會開始執行。", style="CardText.TLabel").grid(row=1, column=0, sticky="w", pady=(3, 12))

        source_frame = ttk.Frame(controls, style="Card.TFrame")
        source_frame.grid(row=2, column=0, sticky="w")
        for index, (key, (label, _)) in enumerate(SOURCES.items()):
            ttk.Checkbutton(source_frame, text=label, variable=self.source_vars[key]).grid(
                row=index // 3, column=index % 3, sticky="w", padx=(0, 28), pady=5
            )

        action_frame = ttk.Frame(controls, style="Card.TFrame")
        action_frame.grid(row=0, column=1, rowspan=3, sticky="ns", padx=(28, 0))
        self.run_button = ttk.Button(action_frame, text="開始產生報告", style="Run.TButton", command=self.start_run)
        self.run_button.pack(pady=(14, 8))
        self.open_button = ttk.Button(action_frame, text="開啟報告位置", command=self.open_report, state="disabled")
        self.open_button.pack()

        content = ttk.Frame(root, style="App.TFrame")
        content.grid(row=3, column=0, sticky="nsew", pady=(18, 0))
        content.columnconfigure(0, weight=3)
        content.columnconfigure(1, weight=2)
        content.rowconfigure(0, weight=1)

        log_card = ttk.Frame(content, style="Card.TFrame", padding=16)
        log_card.grid(row=0, column=0, sticky="nsew", padx=(0, 12))
        log_card.columnconfigure(0, weight=1)
        log_card.rowconfigure(2, weight=1)
        ttk.Label(log_card, text="執行紀錄", style="CardTitle.TLabel").grid(row=0, column=0, sticky="w")
        ttk.Label(log_card, textvariable=self.status_var, style="CardText.TLabel").grid(row=1, column=0, sticky="w", pady=(3, 10))
        self.log = ScrolledText(log_card, height=15, wrap="word", relief="flat", font=("Consolas", 10), background="#0f172a", foreground="#dbeafe", insertbackground="#ffffff")
        self.log.grid(row=2, column=0, sticky="nsew")
        self.log.configure(state="disabled")

        history_card = ttk.Frame(content, style="Card.TFrame", padding=16)
        history_card.grid(row=0, column=1, sticky="nsew")
        history_card.columnconfigure(0, weight=1)
        history_card.rowconfigure(4, weight=1)
        ttk.Label(history_card, text="產出紀錄", style="CardTitle.TLabel").grid(row=0, column=0, sticky="w", pady=(0, 10))
        self.history = ttk.Treeview(history_card, columns=("market", "date", "articles", "groups"), show="headings", height=6)
        self.history.heading("market", text="市場")
        self.history.heading("date", text="報告日期")
        self.history.heading("articles", text="文章")
        self.history.heading("groups", text="群組")
        self.history.column("market", width=50, anchor="center")
        self.history.column("date", width=100, anchor="w")
        self.history.column("articles", width=55, anchor="center")
        self.history.column("groups", width=55, anchor="center")
        self.history.grid(row=1, column=0, sticky="nsew")
        self.history.bind("<Double-1>", lambda _event: self.open_selected_report())
        self.history.bind("<<TreeviewSelect>>", self.show_selected_report)
        history_actions = ttk.Frame(history_card, style="Card.TFrame")
        history_actions.grid(row=2, column=0, sticky="ew", pady=(10, 0))
        ttk.Button(history_actions, text="重新整理", command=self.refresh_history).pack(side="left")
        ttk.Button(history_actions, text="開啟選取報告", command=self.open_selected_report).pack(side="right")
        ttk.Label(history_card, text="報告紀錄內容", style="CardTitle.TLabel").grid(row=3, column=0, sticky="w", pady=(14, 6))
        self.report_details = ScrolledText(
            history_card,
            height=9,
            wrap="word",
            relief="flat",
            font=("Microsoft JhengHei UI", 9),
            background="#f8fafc",
            foreground="#334155",
        )
        self.report_details.grid(row=4, column=0, sticky="nsew")
        self.report_details.configure(state="disabled")

        result = ttk.Frame(root, style="App.TFrame")
        result.grid(row=4, column=0, sticky="ew", pady=(12, 0))
        ttk.Label(result, textvariable=self.result_var, style="Sub.TLabel").pack(anchor="w")
        self.refresh_history()

    def start_run(self):
        selected = [key for key, value in self.source_vars.items() if value.get()]
        if not selected:
            messagebox.showwarning("尚未選擇來源", "請至少選擇一個新聞來源。")
            return
        if self.running:
            return

        self.running = True
        self.report_path = ""
        self.run_button.configure(state="disabled")
        self.open_button.configure(state="disabled")
        self.status_var.set("執行中：正在抓取市場新聞…")
        self.result_var.set("報告處理中")
        self._clear_log()
        self._append_log(f"開始執行：{', '.join(SOURCES[key][0] for key in selected)}")
        threading.Thread(target=self._run_pipeline, args=(selected,), daemon=True).start()

    def _run_pipeline(self, selected):
        writer = QueueWriter(self.messages)
        try:
            with contextlib.redirect_stdout(writer), contextlib.redirect_stderr(writer):
                articles = []
                for key in selected:
                    name, fetch = SOURCES[key]
                    print(f"[抓取] {name}…")
                    try:
                        fetched = fetch()
                    except Exception as exc:
                        print(f"[略過] {name} 失敗：{type(exc).__name__}: {exc}")
                        fetched = []
                    articles.extend(fetched)
                    print(f"[完成] {name}：{len(fetched)} 篇")

                today = datetime.date.today()
                print(f"[處理] 原始文章：{len(articles)} 篇")
                filtered = rules.apply_rules(articles, today=today)
                deduped = dedup.dedup(filtered)
                grouped = rules.filter_unclassified_group(grouping.group(deduped))
                summarized = summarize.summarize_groups(grouped)
                report = output.build_report(summarized, report_date=today)
                report["market"] = "ALL"
                path = output.write_report(report)
                market_paths = pipeline.write_market_reports(grouped, report_date=today)
                print(f"[完成] 美股報告：{market_paths['US']}")
                print(f"[完成] 港股報告：{market_paths['HK']}")
                self.messages.put(("done", (path, report["total_articles"], report["group_count"])))
        except Exception:
            self.messages.put(("error", traceback.format_exc()))

    def _consume_messages(self):
        try:
            while True:
                kind, payload = self.messages.get_nowait()
                if kind == "log":
                    self._append_log(payload)
                elif kind == "done":
                    path, article_count, group_count = payload
                    self.running = False
                    self.report_path = path
                    self.run_button.configure(state="normal")
                    self.open_button.configure(state="normal")
                    self.status_var.set("完成：報告已寫入資料目錄。")
                    self.result_var.set(f"完成：{article_count} 篇文章／{group_count} 個群組｜{path}")
                    self._append_log("\n✓ 報告已產生。")
                    self.refresh_history()
                elif kind == "error":
                    self.running = False
                    self.run_button.configure(state="normal")
                    self.status_var.set("執行失敗，請查看下方錯誤紀錄。")
                    self.result_var.set("未產生報告")
                    self._append_log(payload)
        except queue.Empty:
            pass
        self.after(100, self._consume_messages)

    def _append_log(self, text):
        self.log.configure(state="normal")
        self.log.insert("end", f"{text}\n")
        self.log.see("end")
        self.log.configure(state="disabled")

    def _clear_log(self):
        self.log.configure(state="normal")
        self.log.delete("1.0", "end")
        self.log.configure(state="disabled")

    def open_report(self):
        if not self.report_path:
            return
        directory = os.path.dirname(os.path.abspath(self.report_path))
        webbrowser.open(f"file:///{directory.replace(os.sep, '/')}")

    def refresh_history(self):
        """Load previously generated reports into the output history panel."""
        for item in self.history.get_children():
            self.history.delete(item)

        if not os.path.isdir(config.OUTPUT_DIR):
            return

        reports = []
        for directory, _, filenames in os.walk(config.OUTPUT_DIR):
            for filename in filenames:
                if not filename.lower().endswith(".json"):
                    continue
                path = os.path.join(directory, filename)
                try:
                    with open(path, "r", encoding="utf-8") as report_file:
                        report = json.load(report_file)
                    reports.append((
                        str(report.get("date", os.path.splitext(filename)[0])),
                        str(report.get("market", "ALL")),
                        report.get("total_articles", "-"),
                        report.get("group_count", "-"),
                        path,
                    ))
                except (OSError, json.JSONDecodeError):
                    continue

        for report_date, market, articles, groups, path in sorted(reports, reverse=True):
            self.history.insert("", "end", values=(market, report_date, articles, groups), tags=(path,))

    def open_selected_report(self):
        selected = self.history.selection()
        if not selected:
            messagebox.showinfo("選擇報告", "請先在產出紀錄中選擇一份報告。")
            return
        path = self.history.item(selected[0], "tags")[0]
        webbrowser.open(f"file:///{os.path.abspath(path).replace(os.sep, '/')}")

    def show_selected_report(self, _event=None):
        """Display the selected report's saved record inside the application."""
        selected = self.history.selection()
        if not selected:
            return
        path = self.history.item(selected[0], "tags")[0]
        try:
            with open(path, "r", encoding="utf-8") as report_file:
                report = json.load(report_file)
            lines = [
                f"市場：{report.get('market', 'ALL')}",
                f"報告日期：{report.get('date', '-')}",
                f"產出時間：{report.get('generated_at', '-')}",
                f"文章總數：{report.get('total_articles', 0)}",
                f"群組總數：{report.get('group_count', 0)}",
                "",
            ]
            for group in report.get("groups", []):
                lines.append(f"【{group.get('group', '未分類')}】 {group.get('article_count', 0)} 篇")
                keywords = group.get("keywords", [])
                if keywords:
                    lines.append(f"關鍵字：{'、'.join(keywords)}")
                for article in group.get("articles", [])[:5]:
                    title = str(article.get("title", "未命名文章")).replace("⊕", "")
                    lines.append(f"・{title}")
                if group.get("article_count", 0) > 5:
                    lines.append("・…其餘文章請開啟 JSON 報告查看")
                lines.append("")
            text = "\n".join(lines)
        except (OSError, json.JSONDecodeError) as exc:
            text = f"無法讀取此份報告紀錄：{exc}"

        self.report_details.configure(state="normal")
        self.report_details.delete("1.0", "end")
        self.report_details.insert("1.0", text)
        self.report_details.configure(state="disabled")


def main():
    StocksAutoApp().mainloop()


if __name__ == "__main__":
    main()
