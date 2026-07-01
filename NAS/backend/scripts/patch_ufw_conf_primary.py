"""
Rewrites /api/ufw/status to use /etc/ufw/ufw.conf (ENABLED=yes) as the PRIMARY
check. On this Pi `systemctl is-active ufw` reports "inactive" even when ufw is
active (`sudo ufw status` = active), so it must not be the primary indicator.

Run: python backend/scripts/patch_ufw_conf_primary.py | ssh roy@192.168.199.108 python3
"""
import sys

CODE = r"""
import sys

path = '/home/roy/casaos-nas/server.js'
with open(path, 'r') as f:
    src = f.read()

START = "app.get('/api/ufw/status', authenticate, async (req, res) => {"
END   = "  res.json({ active: false, detail: 'UFW status unavailable' })\n})"

if 'Primary: ufw.conf ENABLED' in src:
    print('[ufw] already using ufw.conf as primary, nothing to do')
    sys.exit(0)

s = src.find(START)
if s == -1:
    print('[ufw] ERROR: /api/ufw/status endpoint not found')
    sys.exit(1)
e = src.find(END, s)
if e == -1:
    print('[ufw] ERROR: endpoint end marker not found')
    sys.exit(1)
e += len(END)

NEW = '''app.get('/api/ufw/status', authenticate, async (req, res) => {
  // Primary: ufw.conf ENABLED flag (reliable, no root). On this Pi
  // `systemctl is-active ufw` falsely reports inactive while ufw is active.
  try {
    const { readFile } = await import('fs/promises')
    const conf = await readFile('/etc/ufw/ufw.conf', 'utf8')
    const active = /^ENABLED=yes/im.test(conf)
    return res.json({ active, detail: active ? 'UFW: Active' : 'UFW: Inactive' })
  } catch (_) {}
  // Fallback: systemctl
  try {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)
    const { stdout } = await execAsync('systemctl is-active ufw', { timeout: 5000 })
    const active = stdout.trim() === 'active'
    return res.json({ active, detail: active ? 'UFW: Active' : 'UFW: Inactive' })
  } catch (_) {}
  res.json({ active: false, detail: 'UFW status unavailable' })
})'''

new_src = src[:s] + NEW + src[e:]

if new_src.count("app.get('/api/ufw/status'") != 1:
    print('[ufw] WARNING: unexpected number of ufw endpoints, aborting')
    sys.exit(1)

with open(path, 'w') as f:
    f.write(new_src)
print('[ufw] rewrote /api/ufw/status to use ufw.conf as primary check')
"""

sys.stdout.write(CODE)
