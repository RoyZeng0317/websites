# NAS
## 專案優點
## 專案欠缺

## 如何安裝?
可以根據以下系統當中進行安裝應用
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