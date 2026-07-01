# -*- coding: utf-8 -*-
"""
Smart-skip pm2 auto update: only restart the pm2 daemon (a ~10s service
interruption) when pm2 itself has a newer version; otherwise skip entirely
(0 downtime). Rewrites the `if (targets.has('pm2'))` block inside
runUpdateTask, anchored between the pm2 and nginx target blocks so it works
regardless of the Pi's current (possibly divergent) pm2 implementation.

Run: python backend/scripts/patch_pm2_smart_skip.py | ssh roy@192.168.199.108 python3
Then: ssh roy@192.168.199.108 "node --check /home/roy/casaos-nas/server.js && pm2 restart casaos-nas --update-env"
"""
import sys
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

CODE = r'''# -*- coding: utf-8 -*-
import sys

path = '/home/roy/casaos-nas/server.js'
with open(path, 'r', encoding='utf-8') as f:
    src = f.read()

if 'npm view pm2 version' in src:
    print('[pm2] smart-skip already applied, nothing to do')
    sys.exit(0)

START = "  if (targets.has('pm2')) {"
NEXT  = "if (targets.has('nginx')) {"

s = src.find(START)
if s == -1:
    print('[pm2] ERROR: pm2 target block not found')
    sys.exit(1)
e = src.find(NEXT, s)
if e == -1:
    print('[pm2] ERROR: nginx anchor not found after pm2 block')
    sys.exit(1)

NEW = r"""  if (targets.has('pm2')) {
    try {
      // 智慧跳過：只有 pm2 本體有新版時才重啟 daemon（短暫中斷），否則完全不碰（0 中斷）。
      let cur = '', latest = ''
      try { cur = (await execAsync('pm2 -v', { timeout: 15_000 })).stdout.trim() } catch {}
      try { latest = (await execAsync('npm view pm2 version', { timeout: 30_000 })).stdout.trim() } catch {}
      if (latest && cur !== latest) {
        // daemon 重啟會殺死本 process，故用 nohup 背景獨立執行，讓 API 先回應。
        const updateScript = [
          '#!/bin/bash',
          'npm install -g pm2@latest',
          'pm2 update',
          'pm2 start /home/roy/casaos-nas/server.js --name casaos-nas --cwd /home/roy/casaos-nas',
          'pm2 save',
          'pm2 logs casaos-nas --lines 5 --nostream',
        ].join('\n')
        await fs.writeFile('/tmp/vaultix_pm2_update.sh', updateScript, { mode: 0o755 })
        await execAsync('nohup bash /tmp/vaultix_pm2_update.sh > /tmp/vaultix_pm2_update.log 2>&1 &')
        parts.push(`[pm2] ${cur} → ${latest}，更新腳本已在背景啟動，約 10 秒後生效（會短暫中斷）`)
      } else {
        parts.push(`[pm2] 已是最新版 (${cur || 'unknown'})，略過 daemon 重啟（不中斷服務）`)
      }
    } catch (e) { parts.push('[pm2] 失敗：' + String(e.message).slice(-200)) }
  }

  """

new_src = src[:s] + NEW + src[e:]

if new_src.count("if (targets.has('pm2'))") != 1:
    print('[pm2] WARNING: unexpected pm2 block count, aborting')
    sys.exit(1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_src)
print('[pm2] rewrote pm2 target block to smart-skip (version-gated daemon restart)')
'''

sys.stdout.write(CODE)
