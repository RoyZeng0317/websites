"""
Patch Pi's server.js to add the public QuickConnect resolve endpoint.
Resolves a VaultixID -> { username, backendUrl } with NO auth (used before login).
Run: python patch_vaultix_resolve.py | ssh roy@192.168.199.108 python3
"""
import sys

CODE = r"""
import sys

path = '/home/roy/casaos-nas/server.js'
with open(path, 'r') as f:
    src = f.read()

ANCHOR = 'server.listen(PORT'
if '/api/vaultix/resolve' in src:
    print('[vaultix-resolve] already patched')
    sys.exit(0)

PATCH = '''
// ── Vaultix QuickConnect resolve (public, no auth) ─────────────
app.get('/api/vaultix/resolve', async (req, res) => {
  const id = String(req.query.id ?? '').trim()
  if (!/^[a-zA-Z0-9_-]{4,30}$/.test(id))
    return res.status(400).json({ error: 'invalid id' })
  const [rows] = await pool.query(
    `SELECT u.username FROM vaultix_ids v JOIN users u ON u.id = v.user_id WHERE v.vaultix_id = ?`,
    [id]
  )
  if (!rows[0]) return res.status(404).json({ error: 'Vaultix ID not found' })
  const backendUrl = process.env.PUBLIC_BACKEND_URL || `https://${req.headers.host}`
  res.json({ ok: true, username: rows[0].username, backendUrl })
})

'''

idx = src.find(ANCHOR)
if idx == -1:
    print('[vaultix-resolve] ERROR: anchor not found')
    sys.exit(1)

new_src = src[:idx] + PATCH + src[idx:]
with open(path, 'w') as f:
    f.write(new_src)
print('[vaultix-resolve] patched OK')
"""

sys.stdout.write(CODE)
