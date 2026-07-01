"""
Replaces the UFW status endpoint on Pi to use 'systemctl is-active ufw'
instead of 'sudo ufw status' (which fails without root).
Run: python backend/scripts/patch_ufw_fix.py | ssh roy@192.168.199.108 python3
Then: ssh roy@192.168.199.108 "pm2 restart casaos-nas --update-env"
"""
import sys

CODE = r"""
import sys, re

path = '/home/roy/casaos-nas/server.js'
with open(path, 'r') as f:
    src = f.read()

NEW_ENDPOINT = '''
// UFW status endpoint
app.get('/api/ufw/status', authenticate, async (req, res) => {
  const { exec } = await import('child_process')
  const { promisify } = await import('util')
  const execAsync = promisify(exec)
  try {
    const { stdout } = await execAsync('systemctl is-active ufw', { timeout: 5000 })
    const active = stdout.trim() === 'active'
    return res.json({ active, detail: active ? 'UFW: Active' : 'UFW: Inactive' })
  } catch (e) {
    // systemctl returns exit code 3 when inactive — stdout still has the state
    const state = (e.stdout || '').trim()
    if (state === 'inactive' || state === 'failed') {
      return res.json({ active: false, detail: 'UFW: Inactive' })
    }
  }
  try {
    const { readFile } = await import('fs/promises')
    const conf = await readFile('/etc/ufw/ufw.conf', 'utf8')
    const active = /ENABLED=yes/i.test(conf)
    return res.json({ active, detail: active ? 'UFW enabled (conf)' : 'UFW disabled (conf)' })
  } catch (_) {}
  res.json({ active: false, detail: 'UFW status unavailable' })
})

'''

# Replace existing endpoint block if present
pattern = r'// UFW status endpoint\napp\.get\(\'/api/ufw/status\'.*?\}\)\n'
if re.search(pattern, src, re.DOTALL):
    src = re.sub(pattern, NEW_ENDPOINT.lstrip('\n'), src, flags=re.DOTALL)
    print('[ufw] replaced existing endpoint')
elif '/api/ufw/status' in src:
    print('[ufw] endpoint exists but pattern not matched — manual check needed')
    sys.exit(1)
else:
    anchor = src.rfind('server.listen')
    if anchor == -1:
        anchor = src.rfind('app.listen')
    if anchor == -1:
        print('[ufw] ERROR: anchor not found')
        sys.exit(1)
    src = src[:anchor] + NEW_ENDPOINT + src[anchor:]
    print('[ufw] inserted new endpoint')

with open(path, 'w') as f:
    f.write(src)
print('[ufw] done')
"""

sys.stdout.write(CODE)
