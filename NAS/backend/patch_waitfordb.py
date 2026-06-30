#!/usr/bin/env python3
"""
修復 Pi 上 server.js 的三個問題：
  1. waitForDB retries 10×3s → 30×5s（最多等 150 秒，足夠 MariaDB 升級後重啟）
  2. apt-get upgrade 後加 mysqladmin ping 等待，避免 pm2 restart 搶在 MariaDB 就緒前發生
  3. pm2 update 用 detached spawn 延後 3 秒執行，讓 server.js 先完成回應再被 pm2 daemon 重啟殺掉

用法（從本機執行）：
  ssh roy@192.168.199.108 python3 - < patch_waitfordb.py
  或
  ssh roy@raspberrypi.tail8767da.ts.net python3 - < patch_waitfordb.py
"""

import sys

PATH = '/home/roy/casaos-nas/server.js'

PATCHES = [
    # ── Fix 1: waitForDB 容忍度 ──────────────────────────────
    (
        'async function waitForDB(retries = 10, delay = 3000) {',
        'async function waitForDB(retries = 30, delay = 5000) {',
    ),
    # ── Fix 3: pm2 update 用 detached spawn，避免殺掉自己 ───
    # pm2 update 會重啟 pm2 daemon → 殺掉正在執行的 server.js
    # 改用 spawn detached + 3 秒延遲，讓任務結果先回報後才重啟
    (
        "      parts.push('[pm2] ' + await run('npm install -g pm2@latest 2>&1 && pm2 update 2>&1', 120_000))",

        "      await run('npm install -g pm2@latest 2>&1', 60_000)\n"
        "      // pm2 update restarts the pm2 daemon which kills this process.\n"
        "      // Detach it with a delay so the task result can be saved first.\n"
        "      spawn('bash', ['-c', 'sleep 3 && pm2 update'], { detached: true, stdio: 'ignore' }).unref()\n"
        "      parts.push('[pm2] 升級完成，pm2 daemon 將在 3 秒後重啟（伺服器短暫離線屬正常）')",
    ),
    # ── Fix 2: apt 升級後等 MariaDB 就緒 ────────────────────
    (
        "      parts.push('[系統套件] ' + await run('sudo -n apt-get update -qq && sudo -n apt-get upgrade -y 2>&1', 300_000))\n"
        "    } catch (e) { parts.push('[系統套件] 失敗：' + String(e.message).slice(-200)) }",

        "      parts.push('[系統套件] ' + await run('sudo -n apt-get update -qq && sudo -n DEBIAN_FRONTEND=noninteractive apt-get upgrade -y 2>&1', 300_000))\n"
        "      await run('until sudo -n mysqladmin ping -h 127.0.0.1 --silent 2>/dev/null; do sleep 3; done', 120_000).catch(() => {})\n"
        "    } catch (e) { parts.push('[系統套件] 失敗：' + String(e.message).slice(-200)) }",
    ),
]

with open(PATH, 'r', encoding='utf-8') as f:
    src = f.read()

original = src
for old, new in PATCHES:
    count = src.count(old)
    if count == 0:
        print(f'[SKIP] 找不到目標字串（可能已修過）：\n  {old[:80]!r}')
        continue
    if count > 1:
        print(f'[ERROR] 目標字串出現 {count} 次，無法安全替換：\n  {old[:80]!r}')
        sys.exit(1)
    src = src.replace(old, new)
    print(f'[OK] 已套用修補：{old[:60]!r} ...')

if src == original:
    print('[INFO] 無任何修改（所有 patch 均已套用或找不到目標）')
    sys.exit(0)

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(src)
print('[OK] server.js 已儲存')

import subprocess
r = subprocess.run(['node', '--check', PATH], capture_output=True, text=True)
if r.returncode != 0:
    print('[ERROR] 語法檢查失敗，正在還原！')
    with open(PATH, 'w', encoding='utf-8') as f:
        f.write(original)
    print(r.stderr)
    sys.exit(1)
print('[OK] 語法檢查通過')

subprocess.run(['pm2', 'restart', 'casaos-nas', '--update-env'], check=False)
print('[OK] pm2 已重啟')
