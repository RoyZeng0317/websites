"""
Patch Pi's server.js to add Vaultix ID endpoints.
Run: python patch_vaultixid.py | ssh roy@192.168.199.108 python3
"""
import sys

CODE = r"""
import subprocess, sys

path = '/home/roy/casaos-nas/server.js'
with open(path, 'r') as f:
    src = f.read()

ANCHOR = 'server.listen(PORT'
if '/api/user/vaultix-id' in src:
    print('[vaultixid] already patched')
    sys.exit(0)

PATCH = '''
// ── Vaultix ID ────────────────────────────────────────────────
await pool.query(`
  CREATE TABLE IF NOT EXISTS vaultix_ids (
    user_id    INT         NOT NULL PRIMARY KEY,
    vaultix_id VARCHAR(30) NOT NULL,
    created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_vaultix_id UNIQUE (vaultix_id),
    CONSTRAINT fk_vaultix_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`)
await pool.query(`ALTER TABLE vaultix_ids ADD COLUMN IF NOT EXISTS vaultix_id_hash VARCHAR(64) AFTER vaultix_id`)
await pool.query(`UPDATE vaultix_ids SET vaultix_id_hash = SHA2(vaultix_id, 256) WHERE vaultix_id_hash IS NULL`)

app.get('/api/user/vaultix-id', authenticate, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT vaultix_id FROM vaultix_ids WHERE user_id = ?', [req.user.uid]
  )
  res.json({ vaultixId: rows[0]?.vaultix_id ?? null })
})

app.post('/api/user/vaultix-id', authenticate, express.json(), async (req, res) => {
  const { vaultixId } = req.body ?? {}
  if (!vaultixId || typeof vaultixId !== 'string')
    return res.status(400).json({ error: 'vaultixId required' })
  const id = vaultixId.trim()
  if (!/^[a-zA-Z0-9_-]{4,30}$/.test(id))
    return res.status(400).json({ error: '格式不正確' })
  try {
    await pool.query(
      `INSERT INTO vaultix_ids (user_id, vaultix_id, vaultix_id_hash) VALUES (?, ?, SHA2(?, 256))
       ON DUPLICATE KEY UPDATE vaultix_id = VALUES(vaultix_id), vaultix_id_hash = VALUES(vaultix_id_hash), updated_at = NOW()`,
      [req.user.uid, id, id]
    )
    res.json({ ok: true, vaultixId: id })
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: '此 ID 已被使用' })
    throw e
  }
})

'''

idx = src.find(ANCHOR)
if idx == -1:
    print('[vaultixid] ERROR: anchor not found')
    sys.exit(1)

new_src = src[:idx] + PATCH + src[idx:]
with open(path, 'w') as f:
    f.write(new_src)
print('[vaultixid] patched OK')
"""

sys.stdout.write(CODE)
