"""
Migration: Add SHA-256 hashing for VaultixID.
Run: python backend/scripts/patch_vaultixid_hash_migration.py | ssh roy@192.168.199.108 python3
Then: ssh roy@192.168.199.108 "node --check /home/roy/casaos-nas/server.js && pm2 restart casaos-nas --update-env"
"""
import sys

CODE = r"""
import sys

path = '/home/roy/casaos-nas/server.js'
with open(path, 'r') as f:
    src = f.read()

if 'vaultix_id_hash' in src:
    print('[hash] already migrated')
    sys.exit(0)

changes = 0

# ── 1. Create table ALTER TABLE migration ──
old_table_end = '''    CONSTRAINT fk_vaultix_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`)'''
new_table_end = '''    CONSTRAINT fk_vaultix_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`)
// vaultix_id_hash migration
await pool.query(`ALTER TABLE vaultix_ids ADD COLUMN IF NOT EXISTS vaultix_id_hash VARCHAR(64) AFTER vaultix_id`)
await pool.query(`UPDATE vaultix_ids SET vaultix_id_hash = SHA2(vaultix_id, 256) WHERE vaultix_id_hash IS NULL`)'''

if old_table_end in src:
    src = src.replace(old_table_end, new_table_end, 1)
    changes += 1
    print('[hash] table migration added')
else:
    print('[hash] WARN: CREATE TABLE anchor not found, skipping')

# ── 2. Resolve endpoint: use vaultix_id_hash ──
old_resolve = 'SELECT u.username FROM vaultix_ids v JOIN users u ON u.id = v.user_id WHERE v.vaultix_id = ?'
new_resolve = 'SELECT u.username FROM vaultix_ids v JOIN users u ON u.id = v.user_id WHERE v.vaultix_id_hash = SHA2(?, 256)'
if old_resolve in src:
    src = src.replace(old_resolve, new_resolve, 1)
    changes += 1
    print('[hash] resolve endpoint updated')
else:
    print('[hash] WARN: resolve SQL not found')

# ── 3. POST vaultix-id: add vaultix_id_hash column + SHA2 ──
old_post_sql = '''INSERT INTO vaultix_ids (user_id, vaultix_id) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE vaultix_id = VALUES(vaultix_id), updated_at = NOW()'''
new_post_sql = '''INSERT INTO vaultix_ids (user_id, vaultix_id, vaultix_id_hash) VALUES (?, ?, SHA2(?, 256))
       ON DUPLICATE KEY UPDATE vaultix_id = VALUES(vaultix_id), vaultix_id_hash = VALUES(vaultix_id_hash), updated_at = NOW()'''
old_post_args = '[req.user.uid, id]'
new_post_args = '[req.user.uid, id, id]'

post_modified = False
if old_post_sql in src:
    src = src.replace(old_post_sql, new_post_sql, 1)
    post_modified = True
    print('[hash] vaultix-id POST SQL updated')
else:
    print('[hash] WARN: vaultix-id POST SQL not found')

if old_post_args in src:
    src = src.replace(old_post_args, new_post_args, 1)
    post_modified = True
    print('[hash] vaultix-id POST args updated')
else:
    print('[hash] WARN: vaultix-id POST args not found')

if post_modified:
    changes += 1

if changes:
    with open(path, 'w') as f:
        f.write(src)
    print(f'[hash] {changes} change(s) applied OK')
    print('[hash] Next: node --check server.js && pm2 restart casaos-nas --update-env')
else:
    print('[hash] no changes were needed')
"""

sys.stdout.write(CODE)
