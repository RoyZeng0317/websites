# NAS
## 專案優點
## 專案欠缺
01. [x] \ps1 檔案有多餘的步驟，需要開啟記事本，但是我希望用戶可以直接從 github 當中安裝，不需要多餘的步驟(包含使用筆記本) — 2026-07-06: 新增 `frontend-py/install.ps1`，用 `irm ... | iex` 直接從 GitHub sparse-clone 安裝，全程無需開記事本。
02. [x] ps1 可以使用以下安裝模式
1. npm install
2. curl (支援 windows CDM 與 MacOS 及 Linux)
3. irm (windows powershell)
使用這些安裝檔案進行安裝
用這樣簡易的命令，讓用戶複製指令進行安裝
— 2026-07-06: `frontend-py/install.ps1`(irm) 與 `frontend-py/install.sh`(curl，跨 macOS/Linux/樹莓派) 皆已提供一行安裝指令，見 `frontend-py/README.md`。

Windows (PowerShell):
```powershell
irm https://raw.githubusercontent.com/RoyZeng0317/websites/main/NAS/frontend-py/install.ps1 | iex
```

macOS / Linux / Raspberry Pi:
```bash
curl -fsSL https://raw.githubusercontent.com/RoyZeng0317/websites/main/NAS/frontend-py/install.sh | bash
```

Node.js (React frontend, `NAS/frontend`):
```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/RoyZeng0317/websites.git vaultix-nas-frontend && cd vaultix-nas-frontend && git sparse-checkout set NAS/frontend && cd NAS/frontend && npm install
```

03. [x] 如果說有需要伺服器進行使用，那麼就使用到 firebase 或者是 cloudinary 等伺服器，不使用本地(如: localhost、127.0.1.1 等形式進行運行) 有需要 secrect key 的部分，那就產生 key 讓我自行複製到 .env 檔案當中，不可以自行寫入 .env 檔案當中，交給我處理即可 — 2026-07-06: 確認 `frontend-py` 現有程式碼(`app.py`、`pwd_2FA_check.py`)沒有任何地方寫入 `.env`；`TFA_KEY` 由 `pwd_2FA_check.py` 自動產生 `2fa.db.key` 檔(非 `.env`)。安裝腳本只印出 `.env.example` 內容供參考複製，不建立、不寫入 `.env`，一律交給使用者自行處理。
