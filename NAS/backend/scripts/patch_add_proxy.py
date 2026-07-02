"""
Adds proxy routes to Pi's server.js so Express forwards
/api/todos and /api/system/disks/rename-folder to the Python sidecar on port 3001.

Run: python backend/scripts/patch_add_proxy.py | ssh roy@192.168.199.108 python3
"""
import sys

CODE = r"""
import sys

path = '/home/roy/casaos-nas/server.js'
with open(path, 'r') as f:
    src = f.read()

MARKER = '// ── Python sidecar proxy'
FAIL2BAN_MARKER = 'app.post(\'/api/system/disks/rename-folder\''

if MARKER in src:
    if FAIL2BAN_MARKER not in src:
        print('[proxy] patched but missing fail2ban routes, appending')
        F2B_BLOCK = '''
app.get('/api/system/fail2ban',     authenticate, requireAdmin, _pyProxy)
app.get('/api/system/fail2ban/log', authenticate, requireAdmin, _pyProxy)
app.post('/api/system/fail2ban/unban', authenticate, requireAdmin, _pyProxy)

'''
        anchor = src.find('app.post(\'/api/system/disks/rename-folder\'')
        if anchor != -1:
            eol = src.find('\n', anchor)
            src = src[:eol+1] + F2B_BLOCK + src[eol+1:]
            with open(path, 'w') as f:
                f.write(src)
            print('[proxy] appended fail2ban proxy routes')
        else:
            print('[proxy] ERROR: rename-folder anchor not found')
    else:
        print('[proxy] already patched, skipping')
    sys.exit(0)

PROXY_BLOCK = '''
// ── Python sidecar proxy ─────────────────────────────────────────────────────
function _pyProxy(req, res) {
  const u = req.user ?? {}
  const opts = {
    hostname: '127.0.0.1', port: 3001,
    path: req.originalUrl, method: req.method,
    headers: {
      ...req.headers,
      host: '127.0.0.1:3001',
      'x-user-uid':      String(u.uid      ?? ''),
      'x-user-username': String(u.username  ?? ''),
      'x-user-role':     String(u.role      ?? ''),
    }
  }
  const pr = http.request(opts, r => {
    res.writeHead(r.statusCode, r.headers)
    r.pipe(res, { end: true })
  })
  pr.on('error', () => res.status(502).json({ error: 'Python sidecar unavailable' }))
  req.pipe(pr, { end: true })
}

app.all('/api/todos',     authenticate, _pyProxy)
app.all('/api/todos/:id', authenticate, _pyProxy)
app.post('/api/system/disks/rename-folder', authenticate, requireAdmin, _pyProxy)
app.get('/api/system/fail2ban',     authenticate, requireAdmin, _pyProxy)
app.get('/api/system/fail2ban/log', authenticate, requireAdmin, _pyProxy)
app.post('/api/system/fail2ban/unban', authenticate, requireAdmin, _pyProxy)

'''

anchor = src.rfind('server.listen')
if anchor == -1:
    anchor = src.rfind('app.listen')
if anchor == -1:
    print('[proxy] ERROR: server.listen anchor not found')
    sys.exit(1)

src = src[:anchor] + PROXY_BLOCK + src[anchor:]
with open(path, 'w') as f:
    f.write(src)
print('[proxy] inserted Python sidecar proxy routes')
"""

sys.stdout.write(CODE)
