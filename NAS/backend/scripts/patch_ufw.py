"""
Adds GET /api/ufw/status endpoint to the Pi's server.js.
Run: python backend/scripts/patch_ufw.py | ssh roy@192.168.199.108 python3
Then: ssh roy@192.168.199.108 "pm2 restart casaos-nas --update-env"
"""
import sys

CODE = r"""
import sys

path = '/home/roy/casaos-nas/server.js'
with open(path, 'r') as f:
    src = f.read()

if '/api/ufw/status' in src:
    print('[ufw] already patched')
    sys.exit(0)

PATCH = '''
// UFW status endpoint
app.get('/api/ufw/status', authenticate, async (req, res) => {
  const { exec } = await import('child_process')
  const { promisify } = await import('util')
  const execAsync = promisify(exec)
  try {
    const { stdout } = await execAsync('sudo ufw status 2>&1', { timeout: 5000 })
    const active = /status: active/i.test(stdout)
    const detail = stdout.trim().split('\\n').slice(0, 3).join('\\n')
    return res.json({ active, detail })
  } catch (_) {}
  try {
    const { readFile } = await import('fs/promises')
    const conf = await readFile('/etc/ufw/ufw.conf', 'utf8')
    const active = /ENABLED=yes/i.test(conf)
    return res.json({ active, detail: active ? 'UFW enabled (config)' : 'UFW disabled (config)' })
  } catch (_) {}
  res.json({ active: false, detail: 'UFW status unavailable' })
})

'''

anchor = src.rfind('server.listen')
if anchor == -1:
    anchor = src.rfind('app.listen')
if anchor == -1:
    print('[ufw] ERROR: anchor not found')
    sys.exit(1)

new_src = src[:anchor] + PATCH + src[anchor:]
with open(path, 'w') as f:
    f.write(new_src)
print('[ufw] patched OK')
"""

sys.stdout.write(CODE)
