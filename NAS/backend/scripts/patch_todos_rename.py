"""
Adds missing /api/todos CRUD endpoints + todos table,
and /api/system/disks/rename-folder endpoint to Pi's server.js.

Run: python backend/scripts/patch_todos_rename.py | ssh roy@192.168.199.108 python3
Then: ssh roy@192.168.199.108 "pm2 restart casaos-nas --update-env"
"""
import sys

CODE = r"""
import sys

path = '/home/roy/casaos-nas/server.js'
with open(path, 'r') as f:
    src = f.read()

changed = False

# ── 1. todos table (insert before 'const upload = multer') ──────────────────
TODOS_TABLE = '''
await pool.query(`
  CREATE TABLE IF NOT EXISTS todos (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    title      VARCHAR(500) NOT NULL,
    done       TINYINT(1) NOT NULL DEFAULT 0,
    priority   ENUM('low','normal','high') NOT NULL DEFAULT 'normal',
    due_date   DATE DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`)

'''

if "CREATE TABLE IF NOT EXISTS todos" not in src:
    anchor = src.find("const upload = multer")
    if anchor == -1:
        print("[todos] ERROR: 'const upload = multer' anchor not found")
        sys.exit(1)
    src = src[:anchor] + TODOS_TABLE + src[anchor:]
    print("[todos] inserted todos table")
    changed = True
else:
    print("[todos] todos table already present")

# ── 2. /api/todos CRUD endpoints (insert before server.listen) ──────────────
TODOS_ENDPOINTS = '''
// ── Todo 清單 ─────────────────────────────────────────────

app.get('/api/todos', authenticate, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, title, done, priority, due_date, created_at FROM todos WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.uid]
  )
  res.json(rows.map(r => ({ ...r, done: !!r.done })))
})

app.post('/api/todos', authenticate, express.json(), async (req, res) => {
  const { title, priority = 'normal', due_date = null } = req.body ?? {}
  if (!title?.trim()) return res.status(400).json({ error: '請輸入任務標題' })
  if (!['low', 'normal', 'high'].includes(priority)) return res.status(400).json({ error: '無效的優先順序' })
  const [result] = await pool.query(
    'INSERT INTO todos (user_id, title, priority, due_date) VALUES (?, ?, ?, ?)',
    [req.user.uid, title.trim(), priority, due_date || null]
  )
  const [rows] = await pool.query(
    'SELECT id, title, done, priority, due_date, created_at FROM todos WHERE id = ?', [result.insertId]
  )
  res.json({ ...rows[0], done: !!rows[0].done })
})

app.put('/api/todos/:id', authenticate, express.json(), async (req, res) => {
  const id = Number(req.params.id)
  const { title, done, priority, due_date } = req.body ?? {}
  const sets = [], vals = []
  if (title !== undefined) { sets.push('title = ?'); vals.push(String(title).trim()) }
  if (done  !== undefined) { sets.push('done = ?');  vals.push(done ? 1 : 0) }
  if (priority !== undefined) { sets.push('priority = ?'); vals.push(priority) }
  if (due_date !== undefined) { sets.push('due_date = ?'); vals.push(due_date || null) }
  if (!sets.length) return res.status(400).json({ error: '沒有可更新的欄位' })
  vals.push(id, req.user.uid)
  await pool.query(`UPDATE todos SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`, vals)
  const [rows] = await pool.query(
    'SELECT id, title, done, priority, due_date, created_at FROM todos WHERE id = ?', [id]
  )
  if (!rows[0]) return res.status(404).json({ error: '找不到任務' })
  res.json({ ...rows[0], done: !!rows[0].done })
})

app.delete('/api/todos/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id)
  const [result] = await pool.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, req.user.uid])
  if (!result.affectedRows) return res.status(404).json({ error: '找不到任務' })
  res.json({ ok: true })
})

'''

if "'/api/todos'" not in src:
    anchor = src.rfind('server.listen')
    if anchor == -1:
        anchor = src.rfind('app.listen')
    if anchor == -1:
        print("[todos] ERROR: server.listen anchor not found")
        sys.exit(1)
    src = src[:anchor] + TODOS_ENDPOINTS + src[anchor:]
    print("[todos] inserted /api/todos endpoints")
    changed = True
else:
    print("[todos] /api/todos endpoints already present")

# ── 3. /api/system/disks/rename-folder (insert after umount endpoint) ────────
RENAME_FOLDER_ENDPOINT = '''
app.post('/api/system/disks/rename-folder', authenticate, requireAdmin, express.json(), async (req, res) => {
  const { oldName, newName } = req.body ?? {}
  if (!oldName || !newName || /[/\\\\:*?"<>|\\0]/.test(oldName) || /[/\\\\:*?"<>|\\0]/.test(newName))
    return res.status(400).json({ error: '無效的名稱' })

  const userRoot = path.resolve(FILES_DIR, req.user.username)
  const oldPath  = path.join(userRoot, oldName)
  const newPath  = path.join(userRoot, newName)
  if (!oldPath.startsWith(userRoot + path.sep) || !newPath.startsWith(userRoot + path.sep))
    return res.status(400).json({ error: '非法路徑' })

  try {
    const { stdout: mountsOut } = await execAsync('cat /proc/mounts').catch(() => ({ stdout: '' }))
    const mountLine = mountsOut.split('\\n').find(l => l.split(' ')[1] === oldPath)
    const device    = mountLine ? mountLine.split(' ')[0] : null
    const fstype    = mountLine ? mountLine.split(' ')[2] : null

    if (device) await execAsync(`sudo umount "${oldPath}"`, { timeout: 15000 })
    await fs.rename(oldPath, newPath)
    if (device) {
      await fs.mkdir(newPath, { recursive: true }).catch(() => {})
      await execAsync(`sudo mount -t ${fstype} "${device}" "${newPath}"`, { timeout: 15000 })
    }
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

'''

if "'/api/system/disks/rename-folder'" not in src:
    # Insert after the umount endpoint block
    anchor = src.find("'/api/system/disks/umount'")
    if anchor == -1:
        # Fall back to before server.listen
        anchor = src.rfind('server.listen')
        if anchor == -1:
            anchor = src.rfind('app.listen')
    else:
        # Find the closing }) of this endpoint
        close = src.find('\n})', anchor)
        if close != -1:
            anchor = close + 3  # after the closing })
    if anchor == -1:
        print("[rename-folder] ERROR: anchor not found")
        sys.exit(1)
    src = src[:anchor] + RENAME_FOLDER_ENDPOINT + src[anchor:]
    print("[rename-folder] inserted /api/system/disks/rename-folder endpoint")
    changed = True
else:
    print("[rename-folder] endpoint already present")

if changed:
    with open(path, 'w') as f:
        f.write(src)
    print("[patch] server.js updated successfully")
else:
    print("[patch] no changes needed")
"""

sys.stdout.write(CODE)
