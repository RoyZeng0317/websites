import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import mysql from 'mysql2/promise'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs/promises'
import os from 'os'
import { exec, spawn } from 'child_process'
import { promisify } from 'util'
import { randomBytes, createHash } from 'crypto'
import { createReadStream } from 'fs'
import http from 'http'
import { WebSocketServer } from 'ws'
import { authenticator } from 'otplib'
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server'
import { createWebDAVRouter } from './webdav.js'
import archiver from 'archiver'
import cron from 'node-cron'

authenticator.options = { step: 60, window: 2 }

const execAsync = promisify(exec)

const __dirname  = path.dirname(fileURLToPath(import.meta.url))
const PORT       = process.env.PORT ?? 3000
const ORIGINS    = (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(',').map(s => s.trim())
const JWT_SECRET  = process.env.JWT_SECRET
const JWT_EXPIRES = process.env.JWT_EXPIRES ?? '7d'
const FILES_DIR   = process.env.FILES_DIR ?? path.join(__dirname, 'data', 'files')
const TMP_DIR     = path.join(__dirname, 'data', 'tmp')
const AVATARS_DIR = path.join(__dirname, 'data', 'avatars')

if (!JWT_SECRET || JWT_SECRET === 'CHANGE_THIS_TO_A_RANDOM_64_CHAR_SECRET') {
  console.error('錯誤：請在 .env 設定隨機的 JWT_SECRET')
  process.exit(1)
}

// MySQL 連線池
const pool = mysql.createPool({
  host:            process.env.DB_HOST     ?? 'localhost',
  port:            Number(process.env.DB_PORT ?? 3306),
  user:            process.env.DB_USER     ?? 'root',
  password:        process.env.DB_PASSWORD ?? '',
  database:        process.env.DB_NAME     ?? 'casaos_nas',
  waitForConnections: true,
  connectionLimit: 10,
})

await fs.mkdir(FILES_DIR,   { recursive: true })
await fs.mkdir(TMP_DIR,     { recursive: true })
await fs.mkdir(AVATARS_DIR, { recursive: true })

// Wait for MariaDB to be ready after pm2/apt updates (retry up to 10× with 3 s delay)
async function waitForDB(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try { await pool.query('SELECT 1'); return } catch (e) {
      if (i === retries - 1) throw e
      console.log(`[startup] DB not ready (${e.code ?? e.message}), retry ${i + 1}/${retries} in ${delay}ms`)
      await new Promise(r => setTimeout(r, delay))
    }
  }
}
await waitForDB()

// 使用者擴充欄位（自動遷移）
await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name    VARCHAR(100)`)
await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_ext     VARCHAR(10)`)
await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_temporary   TINYINT(1) NOT NULL DEFAULT 0`)
await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS temp_expires_at DATETIME DEFAULT NULL`)
await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS temp_login_used TINYINT(1) NOT NULL DEFAULT 0`)

// 私人相冊 WebAuthn 憑證資料表
await pool.query(`
  CREATE TABLE IF NOT EXISTS locker_webauthn (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL,
    credential_id VARCHAR(512) NOT NULL UNIQUE,
    public_key    TEXT NOT NULL,
    counter       BIGINT NOT NULL DEFAULT 0,
    device_name   VARCHAR(100) DEFAULT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`)

// 二步驗證資料表
await pool.query(`
  CREATE TABLE IF NOT EXISTS two_factor (
    user_id INT NOT NULL PRIMARY KEY,
    secret  VARCHAR(64) NOT NULL,
    enabled TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`)

// 分享連結資料表
await pool.query(`
  CREATE TABLE IF NOT EXISTS shares (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    token      VARCHAR(64) NOT NULL UNIQUE,
    owner_id   INT NOT NULL,
    file_path  VARCHAR(2048) NOT NULL,
    is_folder  TINYINT(1) NOT NULL DEFAULT 0,
    permission ENUM('edit','view','download') NOT NULL DEFAULT 'view',
    password   VARCHAR(255),
    one_time   TINYINT(1) NOT NULL DEFAULT 0,
    used       TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
  )
`)

await pool.query(`
  CREATE TABLE IF NOT EXISTS scheduled_tasks (
    id          VARCHAR(36)  NOT NULL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    type        ENUM('backup','update') NOT NULL,
    enabled     TINYINT(1)   NOT NULL DEFAULT 1,
    cron_expr   VARCHAR(100) NOT NULL,
    source_path VARCHAR(500),
    dest_path   VARCHAR(500),
    keep_count  TINYINT      NOT NULL DEFAULT 7,
    last_run    DATETIME,
    last_status VARCHAR(10),
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`)
await pool.query(`
  CREATE TABLE IF NOT EXISTS schedule_logs (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    task_id     VARCHAR(255) NOT NULL,
    task_name   VARCHAR(255) NOT NULL,
    type        VARCHAR(50) NOT NULL,
    status      VARCHAR(20) NOT NULL,
    message     TEXT,
    duration_ms INT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `)

  await pool.query(`
  CREATE TABLE IF NOT EXISTS collab_tasks (
    id         VARCHAR(255) PRIMARY KEY,
    file_path  VARCHAR(1024) NOT NULL,
    title      VARCHAR(1024) NOT NULL,
    done       TINYINT(1) DEFAULT 0,
    owner      VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (file_path(255))
  )
  `)

  await pool.query(`
  CREATE TABLE IF NOT EXISTS collab_notes (
    id         VARCHAR(255) PRIMARY KEY,
    file_path  VARCHAR(1024) NOT NULL,
    author     VARCHAR(255) NOT NULL,
    text       TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (file_path(255))
  )
  `)

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

const upload = multer({ dest: TMP_DIR })

const app = express()

// Chrome Private Network Access: allow public origin → local IP requests
app.use((req, res, next) => {
  if (req.headers['access-control-request-private-network']) {
    res.setHeader('Access-Control-Allow-Private-Network', 'true')
  }
  next()
})

app.use(cors({
  origin: ORIGINS,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS','HEAD','PROPFIND','MKCOL','MOVE','COPY'],
  allowedHeaders: ['Authorization','Content-Type','Depth','Destination','Overwrite'],
}))
app.use(express.json())

// WebDAV — must be before express.json() parsing to allow raw streaming PUT
app.use('/webdav', createWebDAVRouter(pool, bcrypt, FILES_DIR))

// ── 工具函式 ──────────────────────────────────────────────

// Multer 以 latin1 解讀 Content-Disposition 的 filename，
// 但瀏覽器實際上是傳 UTF-8 編碼，導致中文檔名變成亂碼。
// 此函式偵測字串是否已被 latin1 誤解，若是則還原為 UTF-8。
// 若字串已包含 >U+00FF 的字元，代表已是正確的 Unicode，不做轉換。
function fixEncoding(name) {
  if ([...name].some(c => c.charCodeAt(0) > 0xFF)) return name
  return Buffer.from(name, 'latin1').toString('utf8')
}

function safePath(username, relativePath = '') {
  const userRoot = path.resolve(FILES_DIR, username)
  const full = path.resolve(userRoot, relativePath.replace(/^\/+/, ''))
  if (full !== userRoot && !full.startsWith(userRoot + path.sep))
    throw new Error('Invalid path')
  return full
}

// ── 中介層 ───────────────────────────────────────────────

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.query.token
  if (!token) return res.status(401).json({ error: '請先登入' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.twoFactor) return res.status(401).json({ error: '需要完成二步驗證' })
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: '登入已過期，請重新登入' })
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: '權限不足' })
  next()
}

// ── 登入 ─────────────────────────────────────────────────

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body ?? {}
  if (!username || !password)
    return res.status(400).json({ error: '請輸入帳號和密碼' })

  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
  const user = rows[0]

  if (!user)
    return res.status(401).json({ error: '帳號或密碼錯誤' })
  if (user.disabled)
    return res.status(403).json({ error: '此帳號已被停用，請聯繫管理員' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid)
    return res.status(401).json({ error: '帳號或密碼錯誤' })

  if (user.is_temporary) {
    if (user.temp_login_used)
      return res.status(403).json({ error: '此臨時帳號已使用過，無法再次登入' })
    if (user.temp_expires_at && new Date() > new Date(user.temp_expires_at))
      return res.status(403).json({ error: '此臨時帳號已過期' })
    await pool.query('UPDATE users SET temp_login_used = 1 WHERE id = ?', [user.id])
  }

  await fs.mkdir(path.join(FILES_DIR, username), { recursive: true })

  // 檢查是否啟用 2FA
  const [tfRows] = await pool.query('SELECT 1 FROM two_factor WHERE user_id = ? AND enabled = 1', [user.id])
  if (tfRows.length > 0) {
    const tempToken = jwt.sign(
      { uid: user.id, username: user.username, role: user.role, twoFactor: true },
      JWT_SECRET,
      { expiresIn: '5m' }
    )
    return res.json({ requiresTwoFactor: true, tempToken, username: user.username })
  }

  const token = jwt.sign(
    { uid: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  )
  res.json({ token, username: user.username, role: user.role })
})

// ── 檔案管理 ─────────────────────────────────────────────

app.get('/api/files', authenticate, async (req, res) => {
  try {
    const dir = safePath(req.user.username, req.query.path ?? '')
    // Only auto-create the user's root dir; sub-paths should already exist
    if (!req.query.path || req.query.path === '') {
      await fs.mkdir(dir, { recursive: true })
    }
    let rawEntries
    try {
      rawEntries = await fs.readdir(dir, { withFileTypes: true })
    } catch (e) {
      if (e.code === 'ENOENT') return res.json({ items: [] })
      throw e
    }
    const entries = rawEntries
      .filter(e => !e.name.startsWith('.'))  // hide .trash and other hidden items
    const parentStat = await fs.stat(dir)
    const rawItems = await Promise.all(entries.map(async e => {
      const fullPath = path.join(dir, e.name)
      try {
        const stat = await fs.stat(fullPath)
        const isMount = e.isDirectory() && stat.dev !== parentStat.dev
        return {
          name: e.name,
          type: e.isDirectory() ? 'folder' : 'file',
          size: e.isDirectory() ? undefined : stat.size,
          modified: stat.mtime.toISOString(),
          ...(isMount ? { isMount: true } : {}),
        }
      } catch {
        return null  // 跳過殭屍掛載或無法存取的項目
      }
    }))
    const items = rawItems.filter(Boolean)
    items.sort((a, b) =>
      a.type !== b.type ? (a.type === 'folder' ? -1 : 1) : a.name.localeCompare(b.name)
    )
    res.json({ items })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.get('/api/files/search', authenticate, async (req, res) => {
  try {
    const q = (req.query.q ?? '').trim().toLowerCase()
    if (!q) return res.json({ items: [] })
    const root = safePath(req.user.username, '')
    const limit = Math.min(Number(req.query.limit) || 50, 200)
    const items = []

    async function walk(dir, relPath) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true })
        for (const e of entries) {
          if (e.name.startsWith('.')) continue
          const fullPath = path.join(dir, e.name)
          const itemRelPath = relPath ? `${relPath}/${e.name}` : e.name
          if (e.name.toLowerCase().includes(q)) {
            let stat
            try { stat = await fs.stat(fullPath) } catch { continue }
            items.push({
              name: e.name,
              type: e.isDirectory() ? 'folder' : 'file',
              path: itemRelPath,
              size: e.isDirectory() ? undefined : stat.size,
              modified: stat.mtime.toISOString(),
            })
            if (items.length >= limit) return
          }
          if (e.isDirectory()) {
            await walk(fullPath, itemRelPath)
            if (items.length >= limit) return
          }
        }
      } catch { /* skip unreadable */ }
    }

    await walk(root, '')
    res.json({ items })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post('/api/files/upload', authenticate, upload.array('files'), async (req, res) => {
  const tempFiles = req.files ?? []
  const rawNames = req.body.filenames
  const nameList = Array.isArray(rawNames) ? rawNames : [rawNames]
  const rawMtimes = req.body.lastModifieds
  const mtimeList = Array.isArray(rawMtimes) ? rawMtimes : [rawMtimes]
  try {
    const dir = safePath(req.user.username, req.query.path ?? '')
    await fs.mkdir(dir, { recursive: true })
    for (let i = 0; i < tempFiles.length; i++) {
      const f = tempFiles[i]
      const name = nameList[i] ?? fixEncoding(f.originalname)
      const dest = path.join(dir, name)
      await fs.copyFile(f.path, dest)
      await fs.unlink(f.path)
      const mts = Number(mtimeList[i])
      if (mts > 0) {
        const mdate = new Date(mts)
        await fs.utimes(dest, mdate, mdate).catch(() => {})
      }
    }
    res.json({ ok: true })
  } catch (err) {
    for (const f of tempFiles) await fs.unlink(f.path).catch(() => {})
    res.status(400).json({ error: err.message })
  }
})

// ── 媒體時間軸 ──────────────────────────────────────────

const MEDIA_EXTS = new Set([
  'jpg','jpeg','png','gif','webp','svg','bmp','ico','heic','heif','avif',
  'mp4','mkv','avi','mov','wmv','webm','m4v','flv','ts',
])

app.get('/api/files/timeline', authenticate, async (req, res) => {
  try {
    const root = safePath(req.user.username, '')
    const groups = {}  // YYYY-MM-DD → items[]

    async function walk(dir) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true })
        for (const e of entries) {
          if (e.name.startsWith('.')) continue
          const fullPath = path.join(dir, e.name)
          try {
            const stat = await fs.stat(fullPath)
            if (e.isDirectory()) {
              await walk(fullPath)
            } else {
              const ext = path.extname(e.name).slice(1).toLowerCase()
              if (!MEDIA_EXTS.has(ext)) continue
              const relPath = path.relative(root, fullPath).replace(/\\/g, '/')
              const dateStr = stat.mtime.toISOString().slice(0, 10)
              if (!groups[dateStr]) groups[dateStr] = []
              groups[dateStr].push({
                name: e.name,
                path: relPath,
                size: stat.size,
                modified: stat.mtime.toISOString(),
                type: ['mp4','mkv','avi','mov','wmv','webm','m4v','flv','ts'].includes(ext) ? 'video' : 'image',
              })
            }
          } catch { /* skip unreadable */ }
        }
      } catch { /* skip unreadable */ }
    }

    await walk(root)

    const sorted = Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, items]) => ({ date, items }))

    res.json({ groups: sorted })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.get('/api/files/download', authenticate, async (req, res) => {
  try {
    const { path: userPath } = req.query
    if (!userPath) return res.status(400).json({ error: 'path required' })
    const fullPath = safePath(req.user.username, userPath)
    const stat = await fs.stat(fullPath)
    if (stat.isDirectory()) {
      const folderName = path.basename(fullPath)
      res.setHeader('Content-Type', 'application/zip')
      res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(folderName)}.zip`)
      const archive = archiver('zip', { zlib: { level: 6 } })
      archive.on('error', err => { if (!res.headersSent) res.status(500).json({ error: err.message }) })
      archive.pipe(res)
      archive.directory(fullPath, folderName)
      await archive.finalize()
    } else {
      res.download(fullPath)
    }
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.delete('/api/files', authenticate, async (req, res) => {
  try {
    const { path: userPath } = req.query
    if (!userPath) return res.status(400).json({ error: 'path required' })
    const src = safePath(req.user.username, userPath)
    const trashDir = path.join(FILES_DIR, req.user.username, '.trash')
    await fs.mkdir(trashDir, { recursive: true })

    const name = path.basename(src)
    const trashName = `${Date.now()}_${name}`
    const dst = path.join(trashDir, trashName)

    // Read/update metadata
    const metaPath = path.join(trashDir, '.meta.json')
    let meta = {}
    try { meta = JSON.parse(await fs.readFile(metaPath, 'utf8')) } catch {}
    meta[trashName] = { name, originalPath: userPath, deletedAt: new Date().toISOString() }

    // Move to trash
    await fs.rename(src, dst).catch(async e => {
      if (e.code === 'EXDEV') { await fs.cp(src, dst, { recursive: true }); await fs.rm(src, { recursive: true, force: true }) }
      else throw e
    })
    await fs.writeFile(metaPath, JSON.stringify(meta))
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// ── 回收桶 ───────────────────────────────────────────────

function trashMeta(username) {
  return path.join(FILES_DIR, username, '.trash', '.meta.json')
}
function trashDir(username) {
  return path.join(FILES_DIR, username, '.trash')
}
async function readMeta(username) {
  try { return JSON.parse(await fs.readFile(trashMeta(username), 'utf8')) } catch { return {} }
}
async function writeMeta(username, meta) {
  await fs.writeFile(trashMeta(username), JSON.stringify(meta))
}

app.get('/api/trash', authenticate, async (req, res) => {
  try {
    const dir = trashDir(req.user.username)
    await fs.mkdir(dir, { recursive: true })
    const meta = await readMeta(req.user.username)
    const entries = (await fs.readdir(dir)).filter(e => e !== '.meta.json')
    const items = await Promise.all(entries.map(async trashName => {
      const m = meta[trashName] ?? {}
      const stat = await fs.stat(path.join(dir, trashName)).catch(() => null)
      return {
        trashName,
        name: m.name ?? trashName,
        originalPath: m.originalPath ?? '',
        deletedAt: m.deletedAt ?? '',
        size: stat ? (stat.isDirectory() ? undefined : stat.size) : undefined,
        type: stat?.isDirectory() ? 'folder' : 'file',
      }
    }))
    items.sort((a, b) => b.deletedAt.localeCompare(a.deletedAt))
    res.json({ items })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post('/api/trash/restore', authenticate, express.json(), async (req, res) => {
  const { trashName } = req.body ?? {}
  if (!trashName || trashName.includes('/') || trashName.includes('..') || trashName === '.meta.json')
    return res.status(400).json({ error: '無效的項目' })
  try {
    const dir = trashDir(req.user.username)
    const src = path.join(dir, trashName)
    const meta = await readMeta(req.user.username)
    const m = meta[trashName]
    if (!m) return res.status(404).json({ error: '找不到還原資訊' })

    let dst = safePath(req.user.username, m.originalPath)
    if (await fs.stat(dst).then(() => true).catch(() => false)) {
      // Auto-rename on conflict
      const ext = path.extname(dst)
      const base = dst.slice(0, dst.length - ext.length)
      let n = 1
      while (await fs.stat(`${base} (${n})${ext}`).then(() => true).catch(() => false)) n++
      dst = `${base} (${n})${ext}`
    }
    await fs.mkdir(path.dirname(dst), { recursive: true })
    await fs.rename(src, dst)
    delete meta[trashName]
    await writeMeta(req.user.username, meta)
    res.json({ ok: true, restoredPath: m.originalPath })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.delete('/api/trash/item', authenticate, async (req, res) => {
  const { trashName } = req.query
  if (!trashName || String(trashName).includes('/') || String(trashName).includes('..'))
    return res.status(400).json({ error: '無效的項目' })
  try {
    const dir = trashDir(req.user.username)
    await fs.rm(path.join(dir, String(trashName)), { recursive: true, force: true })
    const meta = await readMeta(req.user.username)
    delete meta[String(trashName)]
    await writeMeta(req.user.username, meta)
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.delete('/api/trash/all', authenticate, async (req, res) => {
  try {
    const dir = trashDir(req.user.username)
    const entries = (await fs.readdir(dir).catch(() => [])).filter(e => e !== '.meta.json')
    await Promise.all(entries.map(e => fs.rm(path.join(dir, e), { recursive: true, force: true })))
    await writeMeta(req.user.username, {})
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post('/api/files/move', authenticate, express.json(), async (req, res) => {
  const { from, to } = req.body ?? {}
  if (!from || !to) return res.status(400).json({ error: '缺少路徑' })
  try {
    const src = safePath(req.user.username, from)
    const dst = safePath(req.user.username, to)
    if (src === dst) return res.status(400).json({ error: '來源與目的相同' })
    if (dst.startsWith(src + path.sep)) return res.status(400).json({ error: '不能移動到自身子目錄' })
    const dstExists = await fs.stat(dst).then(() => true).catch(() => false)
    if (dstExists) return res.status(409).json({ error: `目的地已有同名項目：${path.basename(dst)}` })
    await fs.mkdir(path.dirname(dst), { recursive: true })
    try {
      await fs.rename(src, dst)
    } catch (e) {
      if (e.code === 'EXDEV') {
        await fs.cp(src, dst, { recursive: true })
        await fs.rm(src, { recursive: true, force: true })
      } else throw e
    }
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post('/api/files/copy', authenticate, express.json(), async (req, res) => {
  const { from, to } = req.body ?? {}
  if (!from || !to) return res.status(400).json({ error: '缺少路徑' })
  try {
    const src = safePath(req.user.username, from)
    const dst = safePath(req.user.username, to)
    if (src === dst) return res.status(400).json({ error: '來源與目的相同' })
    if (dst.startsWith(src + path.sep)) return res.status(400).json({ error: '不能複製到自身子目錄' })
    // Auto-rename if destination exists: append (1), (2), ...
    let finalDst = dst
    const ext = path.extname(dst)
    const base = dst.slice(0, dst.length - ext.length)
    let n = 1
    while (await fs.stat(finalDst).then(() => true).catch(() => false)) {
      finalDst = `${base} (${n++})${ext}`
    }
    await fs.mkdir(path.dirname(finalDst), { recursive: true })
    await fs.cp(src, finalDst, { recursive: true })
    res.json({ ok: true, name: path.basename(finalDst) })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.put('/api/files/content', authenticate, express.text({ limit: '20mb', type: '*/*' }), async (req, res) => {
  try {
    const { path: userPath } = req.query
    if (!userPath) return res.status(400).json({ error: 'path required' })
    const filePath = safePath(req.user.username, userPath)
    await fs.writeFile(filePath, req.body ?? '', 'utf8')
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post('/api/files/mkdir', authenticate, async (req, res) => {
  try {
    const { path: userPath = '', name } = req.body ?? {}
    if (!name) return res.status(400).json({ error: 'name required' })
    await fs.mkdir(safePath(req.user.username, path.posix.join(userPath, name)), { recursive: true })
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// ── 使用者偏好設定（儲存於 sda1，保護記憶卡）─────────────

async function getUserPrefsPath(username) {
  // 優先存在 sda1（外接硬碟），保護 SD 記憶卡
  const sda1Dir = path.join(FILES_DIR, username, 'sda1', '.vaultix')
  try {
    await fs.mkdir(sda1Dir, { recursive: true })
    const test = path.join(sda1Dir, '.wtest')
    await fs.writeFile(test, '').then(() => fs.unlink(test))
    return path.join(sda1Dir, 'prefs.json')
  } catch {
    // sda1 未掛載時退回使用者目錄
    const fallback = path.join(FILES_DIR, username, '.vaultix')
    await fs.mkdir(fallback, { recursive: true })
    return path.join(fallback, 'prefs.json')
  }
}

app.get('/api/user/prefs', authenticate, async (req, res) => {
  try {
    const file = await getUserPrefsPath(req.user.username)
    const data = JSON.parse(await fs.readFile(file, 'utf8').catch(() => '{}'))
    res.json(data)
  } catch { res.json({}) }
})

app.patch('/api/user/prefs', authenticate, express.json(), async (req, res) => {
  try {
    const file = await getUserPrefsPath(req.user.username)
    const existing = JSON.parse(await fs.readFile(file, 'utf8').catch(() => '{}'))
    const updated = { ...existing, ...req.body }
    await fs.writeFile(file, JSON.stringify(updated, null, 2))
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Speech Recognition ─────────────────────────────────────

app.post('/api/speech/recognize', authenticate, upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no audio' })
  const inputPath = req.file.path
  const wavPath   = inputPath + '.wav'
  try {
    // Convert browser audio (webm/ogg) → 16kHz mono WAV
    await execAsync(`ffmpeg -i "${inputPath}" -ar 16000 -ac 1 -f wav "${wavPath}" -y`, { timeout: 15000 })

    // Transcribe via Python speech_recognition (Google Web Speech API fallback)
    const transcript = await new Promise((resolve, reject) => {
      const py = spawn('python3', ['-'])
      let out = '', err = ''
      py.stdout.on('data', d => { out += d })
      py.stderr.on('data', d => { err += d })
      py.on('close', code => {
        if (code === 0) resolve(out.trim())
        else reject(new Error(err.trim() || out.trim() || '辨識失敗'))
      })
      py.stdin.write(`
import speech_recognition as sr
r = sr.Recognizer()
r.pause_threshold = 1.5
with sr.AudioFile(${JSON.stringify(wavPath)}) as src:
    audio = r.record(src)
try:
    print(r.recognize_google(audio, language='zh-TW'), end='')
except sr.UnknownValueError:
    print('', end='')
`)
      py.stdin.end()
    })

    res.json({ transcript })
  } catch (err) {
    const msg = String(err.message || err)
    const hint = msg.includes('No module') ? '請安裝：pip3 install SpeechRecognition' :
                 msg.includes('ffmpeg')     ? '請安裝：sudo apt install ffmpeg' : msg
    res.status(500).json({ error: hint })
  } finally {
    fs.unlink(inputPath).catch(() => {})
    fs.unlink(wavPath).catch(() => {})
  }
})

// ── Media Metadata (tags / location / category) ────────────

async function getMediaMetaPath(username) {
  const sda1Dir = path.join(FILES_DIR, username, 'sda1', '.vaultix')
  try {
    await fs.mkdir(sda1Dir, { recursive: true })
    const test = path.join(sda1Dir, '.wtest')
    await fs.writeFile(test, '').then(() => fs.unlink(test))
    return path.join(sda1Dir, 'media_meta.json')
  } catch {
    const fallback = path.join(FILES_DIR, username, '.vaultix')
    await fs.mkdir(fallback, { recursive: true })
    return path.join(fallback, 'media_meta.json')
  }
}

async function readMediaMeta(username) {
  try {
    const file = await getMediaMetaPath(username)
    return JSON.parse(await fs.readFile(file, 'utf8'))
  } catch { return {} }
}

async function writeMediaMeta(username, data) {
  const file = await getMediaMetaPath(username)
  await fs.writeFile(file, JSON.stringify(data, null, 2))
}

app.get('/api/media/meta', authenticate, async (req, res) => {
  try {
    const all = await readMediaMeta(req.user.username)
    const { path: p } = req.query
    if (p) return res.json({ meta: all[String(p)] ?? null })
    res.json({ meta: all })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/media/meta', authenticate, express.json(), async (req, res) => {
  const { path: p, tags, location, category, note } = req.body ?? {}
  if (!p) return res.status(400).json({ error: 'path required' })
  try {
    const all = await readMediaMeta(req.user.username)
    all[p] = {
      tags:     Array.isArray(tags) ? tags : [],
      location: location ?? '',
      category: category ?? '',
      note:     note ?? '',
    }
    await writeMediaMeta(req.user.username, all)
    res.json({ ok: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.delete('/api/media/meta', authenticate, async (req, res) => {
  const { path: p } = req.query
  if (!p) return res.status(400).json({ error: 'path required' })
  try {
    const all = await readMediaMeta(req.user.username)
    delete all[String(p)]
    await writeMediaMeta(req.user.username, all)
    res.json({ ok: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/media/search', authenticate, async (req, res) => {
  try {
    const { q, tags: tagsQ, category, location } = req.query
    const all = await readMediaMeta(req.user.username)
    const filterTags = tagsQ ? String(tagsQ).split(',').map(t => t.trim()).filter(Boolean) : []

    const items = Object.entries(all)
      .filter(([filePath, d]) => {
        if (filterTags.length && !filterTags.some(ft => d.tags?.some(t => t.includes(ft)))) return false
        if (category && d.category !== String(category)) return false
        if (location && !d.location?.toLowerCase().includes(String(location).toLowerCase())) return false
        if (q) {
          const lower = String(q).toLowerCase()
          if (!filePath.toLowerCase().includes(lower) &&
              !d.tags?.some(t => t.toLowerCase().includes(lower)) &&
              !d.location?.toLowerCase().includes(lower) &&
              !d.category?.toLowerCase().includes(lower) &&
              !d.note?.toLowerCase().includes(lower)) return false
        }
        return true
      })
      .map(([filePath, d]) => ({
        path: filePath,
        name: filePath.split('/').pop(),
        type: 'file',
        meta: d,
      }))

    res.json({ items })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── 使用者管理（管理員） ─────────────────────────────────

app.get('/api/admin/users', authenticate, requireAdmin, async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT id, username, display_name, role, disabled, avatar_ext, is_temporary, temp_expires_at, temp_login_used FROM users ORDER BY id'
  )
  res.json({ users: rows })
})

app.post('/api/admin/users', authenticate, requireAdmin, async (req, res) => {
  const { username, password, role = 'user', displayName, isTemporary = false, tempExpiryMinutes } = req.body ?? {}
  if (!username || !password) return res.status(400).json({ error: '請填寫帳號和密碼' })
  if (!/^[\w.-]{2,32}$/.test(username)) return res.status(400).json({ error: '帳號只能用英數字、底線、點、連字號（2-32字元）' })
  if (password.length < 8) return res.status(400).json({ error: '密碼至少需要 8 個字元' })
  try {
    const hash = await bcrypt.hash(password, 12)
    const tempExpiresAt = (isTemporary && tempExpiryMinutes > 0)
      ? new Date(Date.now() + tempExpiryMinutes * 60 * 1000)
      : null
    const [result] = await pool.query(
      'INSERT INTO users (username, password, role, display_name, is_temporary, temp_expires_at) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hash, role === 'admin' ? 'admin' : 'user', displayName?.trim() || null, isTemporary ? 1 : 0, tempExpiresAt]
    )
    await fs.mkdir(path.join(FILES_DIR, username), { recursive: true })
    const [rows] = await pool.query(
      'SELECT id, username, display_name, role, disabled, avatar_ext, is_temporary, temp_expires_at, temp_login_used FROM users WHERE id = ?',
      [result.insertId]
    )
    res.json({ user: rows[0] })
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: '帳號已存在' })
    throw e
  }
})

app.put('/api/admin/users/:id', authenticate, requireAdmin, async (req, res) => {
  const id = Number(req.params.id)
  const { username, displayName, password, role, disabled } = req.body ?? {}
  if (username !== undefined) {
    if (!/^[\w.-]{2,32}$/.test(username)) return res.status(400).json({ error: '帳號格式不正確' })
    try {
      await pool.query('UPDATE users SET username = ? WHERE id = ?', [username, id])
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: '帳號已存在' })
      throw e
    }
  }
  if (displayName !== undefined)
    await pool.query('UPDATE users SET display_name = ? WHERE id = ?', [displayName.trim() || null, id])
  if (password !== undefined) {
    if (password.length < 8) return res.status(400).json({ error: '密碼至少需要 8 個字元' })
    const hash = await bcrypt.hash(password, 12)
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hash, id])
  }
  if (role !== undefined)
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id])
  if (disabled !== undefined)
    await pool.query('UPDATE users SET disabled = ? WHERE id = ?', [disabled ? 1 : 0, id])
  const [rows] = await pool.query(
    'SELECT id, username, display_name, role, disabled, avatar_ext, is_temporary, temp_expires_at, temp_login_used FROM users WHERE id = ?', [id]
  )
  res.json({ user: rows[0] })
})

app.delete('/api/admin/users/:id', authenticate, requireAdmin, async (req, res) => {
  const id = Number(req.params.id)
  if (id === req.user.uid) return res.status(400).json({ error: '無法刪除自己的帳號' })
  const [rows] = await pool.query('SELECT username, avatar_ext FROM users WHERE id = ?', [id])
  if (!rows[0]) return res.status(404).json({ error: '找不到使用者' })
  const { username, avatar_ext } = rows[0]
  await pool.query('DELETE FROM users WHERE id = ?', [id])
  if (avatar_ext) {
    try { await fs.rm(path.join(AVATARS_DIR, `${username}.${avatar_ext}`)) } catch {}
  }
  res.json({ ok: true })
})

app.post('/api/admin/users/:id/avatar', authenticate, requireAdmin, upload.single('avatar'), async (req, res) => {
  const id = Number(req.params.id)
  if (!req.file) return res.status(400).json({ error: '未提供圖片' })
  const [rows] = await pool.query('SELECT username, avatar_ext FROM users WHERE id = ?', [id])
  if (!rows[0]) { await fs.rm(req.file.path).catch(() => {}); return res.status(404).json({ error: '找不到使用者' }) }
  const { username, avatar_ext: oldExt } = rows[0]
  const ext = req.file.mimetype === 'image/png' ? 'png' : req.file.mimetype === 'image/webp' ? 'webp' : 'jpg'
  if (oldExt) try { await fs.rm(path.join(AVATARS_DIR, `${username}.${oldExt}`)) } catch {}
  await fs.rename(req.file.path, path.join(AVATARS_DIR, `${username}.${ext}`))
  await pool.query('UPDATE users SET avatar_ext = ? WHERE id = ?', [ext, id])
  res.json({ ok: true, avatarExt: ext })
})

// ── 自己的個人資料 ────────────────────────────────────────

app.get('/api/user/me', authenticate, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, username, display_name, role, avatar_ext FROM users WHERE id = ?', [req.user.uid]
  )
  const u = rows[0]
  if (!u) return res.status(404).json({ error: '找不到使用者' })
  res.json({ id: u.id, username: u.username, displayName: u.display_name || null, role: u.role, avatarExt: u.avatar_ext || null })
})

app.put('/api/user/profile', authenticate, async (req, res) => {
  const { displayName } = req.body ?? {}
  if (displayName !== undefined) {
    const trimmed = String(displayName).trim().slice(0, 50)
    await pool.query('UPDATE users SET display_name = ? WHERE id = ?', [trimmed || null, req.user.uid])
  }
  const [rows] = await pool.query(
    'SELECT id, username, display_name, role, avatar_ext FROM users WHERE id = ?', [req.user.uid]
  )
  const u = rows[0]
  res.json({ id: u.id, username: u.username, displayName: u.display_name || null, role: u.role, avatarExt: u.avatar_ext || null })
})

app.post('/api/user/avatar', authenticate, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: '未提供圖片' })
  const [rows] = await pool.query('SELECT username, avatar_ext FROM users WHERE id = ?', [req.user.uid])
  const { username, avatar_ext: oldExt } = rows[0]
  const ext = req.file.mimetype === 'image/png' ? 'png' : req.file.mimetype === 'image/webp' ? 'webp' : 'jpg'
  if (oldExt) try { await fs.rm(path.join(AVATARS_DIR, `${username}.${oldExt}`)) } catch {}
  await fs.rename(req.file.path, path.join(AVATARS_DIR, `${username}.${ext}`))
  await pool.query('UPDATE users SET avatar_ext = ? WHERE id = ?', [ext, req.user.uid])
  res.json({ ok: true, avatarExt: ext })
})

// ── 頭貼（公開，不需要認證）──────────────────────────────

app.get('/api/avatars/:username', async (req, res) => {
  const [rows] = await pool.query('SELECT avatar_ext FROM users WHERE username = ?', [req.params.username])
  if (!rows[0]?.avatar_ext) return res.status(404).end()
  const filePath = path.join(AVATARS_DIR, `${req.params.username}.${rows[0].avatar_ext}`)
  try {
    await fs.access(filePath)
    res.setHeader('Cache-Control', 'no-cache, no-store')
    res.sendFile(filePath)
  } catch {
    res.status(404).end()
  }
})

// ── 修改密碼 ─────────────────────────────────────────────

app.post('/api/auth/change-password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body ?? {}
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: '請填寫所有欄位' })
  if (newPassword.length < 8)
    return res.status(400).json({ error: '新密碼至少需要 8 個字元' })

  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.uid])
  const user = rows[0]
  if (!user) return res.status(404).json({ error: '找不到使用者' })

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) return res.status(401).json({ error: '目前密碼不正確' })

  const hash = await bcrypt.hash(newPassword, 12)
  await pool.query('UPDATE users SET password = ? WHERE id = ?', [hash, req.user.uid])

  // 同步 FTP 和 Samba 密碼（若已安裝）
  try { await syncServicePasswords(user.username, newPassword) } catch {}

  res.json({ ok: true })
})

// ── 多餘檔案偵測 ─────────────────────────────────────────

function md5File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash('md5')
    const rs = createReadStream(filePath)
    rs.on('error', reject)
    rs.on('data', chunk => hash.update(chunk))
    rs.on('end', () => resolve(hash.digest('hex')))
  })
}

async function walkUserFiles(userRoot) {
  const results = []
  async function walk(dir, relBase) {
    let entries
    try { entries = await fs.readdir(dir, { withFileTypes: true }) } catch { return }
    for (const e of entries) {
      if (e.name.startsWith('.')) continue  // skip .trash, .vaultix etc.
      const full = path.join(dir, e.name)
      const rel = relBase ? `${relBase}/${e.name}` : e.name
      if (e.isDirectory()) {
        await walk(full, rel)
      } else if (e.isFile()) {
        const stat = await fs.stat(full).catch(() => null)
        if (stat) results.push({ fullPath: full, userPath: '/' + rel, name: e.name, size: stat.size, modifiedAt: stat.mtime.toISOString() })
      }
    }
  }
  await walk(userRoot, '')
  return results
}

app.get('/api/files/duplicates', authenticate, async (req, res) => {
  try {
    const userRoot = path.join(FILES_DIR, req.user.username)
    const files = await walkUserFiles(userRoot)

    // Group by size first — quick filter before expensive hashing
    const bySize = {}
    for (const f of files) {
      if (f.size === 0) continue
      const key = String(f.size)
      bySize[key] = bySize[key] ?? []
      bySize[key].push(f)
    }

    // Hash only files that share the same size
    const hashMap = {}
    for (const group of Object.values(bySize)) {
      if (group.length < 2) continue
      for (const f of group) {
        try {
          const h = await md5File(f.fullPath)
          hashMap[h] = hashMap[h] ?? []
          hashMap[h].push(f)
        } catch {}
      }
    }

    const groups = Object.entries(hashMap)
      .filter(([, g]) => g.length >= 2)
      .map(([hash, grp]) => ({
        hash,
        size: grp[0].size,
        files: grp
          .map(({ userPath, name, size, modifiedAt }) => ({ path: userPath, name, size, modifiedAt }))
          .sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt)),  // newest first
      }))
      .sort((a, b) => b.size - a.size)  // largest waste first

    res.json({ groups, scanned: files.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── 系統資訊 ─────────────────────────────────────────────

app.get('/api/system/info', authenticate, requireAdmin, async (_req, res) => {
  try {
    let disk = null
    try {
      const { stdout } = await execAsync(`df -B1 "${FILES_DIR}"`)
      const parts = stdout.trim().split('\n')[1].split(/\s+/)
      disk = { total: Number(parts[1]), used: Number(parts[2]), free: Number(parts[3]) }
    } catch {}

    let disk1 = null
    try {
      const { stdout } = await execAsync('df -B1')
      const line = stdout.trim().split('\n').find(l => l.startsWith('/dev/sda1'))
      if (line) {
        const parts = line.split(/\s+/)
        disk1 = { total: Number(parts[1]), used: Number(parts[2]), free: Number(parts[3]) }
      }
    } catch {}

    const nets = Object.values(os.networkInterfaces()).flat()
    const ip = nets.find(n => n?.family === 'IPv4' && !n.internal)?.address ?? 'N/A'

    let cpuModel = ''
    try {
      const { stdout } = await execAsync("grep -m1 'model name' /proc/cpuinfo | awk -F': ' '{print $2}'")
      cpuModel = stdout.trim()
    } catch {}
    if (!cpuModel) {
      try {
        const { stdout } = await execAsync("grep -m1 '^Model' /proc/cpuinfo | awk -F': ' '{print $2}'")
        cpuModel = stdout.trim()
      } catch {}
    }

    let osName = ''
    try {
      const { stdout } = await execAsync('grep PRETTY_NAME /etc/os-release | cut -d\'"\' -f2')
      osName = stdout.trim()
    } catch {}

    let cpuTemp = null
    try {
      const { stdout } = await execAsync('cat /sys/class/thermal/thermal_zone0/temp')
      const t = parseInt(stdout.trim())
      if (!isNaN(t)) cpuTemp = t / 1000
    } catch {}

    res.json({
      hostname: os.hostname(),
      ip,
      uptime: Math.floor(os.uptime()),
      platform: os.platform(),
      arch: os.arch(),
      cpuModel,
      osName,
      cpuTemp,
      loadavg: os.loadavg(),
      memory: { total: os.totalmem(), free: os.freemem() },
      disk,
      disk1,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── UPS 不斷電系統 ────────────────────────────────────────

function parseNutOutput(stdout) {
  const d = {}
  for (const line of stdout.trim().split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    d[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
  }
  const st = d['ups.status'] ?? ''
  let statusLabel = '未知狀態'
  if (st.includes('OL') && !st.includes('OB')) statusLabel = '市電供電'
  if (st.includes('OB')) statusLabel = '電池供電'
  if (st.includes('LB')) statusLabel = '低電量警告'
  if (st.includes('CHRG')) statusLabel += '・充電中'
  if (st.includes('BYPASS')) statusLabel = '旁路模式'
  const num = k => d[k] !== undefined ? parseFloat(d[k]) || null : null
  return {
    connected: true, driver: 'nut',
    model: d['device.model'] || d['ups.model'] || '',
    manufacturer: d['device.mfr'] || '',
    status: st, statusLabel,
    batteryPct: num('battery.charge'),
    batteryVoltage: num('battery.voltage'),
    runtimeMin: d['battery.runtime'] ? Math.round(parseFloat(d['battery.runtime']) / 60) : null,
    loadPct: num('ups.load'),
    inputVoltage: num('input.voltage'),
    outputVoltage: num('output.voltage'),
    temperature: num('ups.temperature'),
  }
}

function parseApcAccess(stdout) {
  const d = {}
  for (const line of stdout.trim().split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    d[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
  }
  const raw = d['STATUS'] ?? ''
  let status = 'UNKNOWN', statusLabel = '未知狀態'
  if (raw === 'ONLINE')             { status = 'OL'; statusLabel = '市電供電' }
  else if (raw.includes('ONBATT')) { status = 'OB'; statusLabel = '電池供電' }
  else if (raw.includes('LOWBATT')){ status = 'LB'; statusLabel = '低電量警告' }
  else if (raw.includes('CHARGING')){ statusLabel = '充電中' }
  const num = k => { const m = (d[k] ?? '').match(/[\d.]+/); return m ? parseFloat(m[0]) : null }
  return {
    connected: true, driver: 'apcupsd',
    model: d['MODEL'] || d['APCMODEL'] || '',
    manufacturer: 'APC',
    status, statusLabel,
    batteryPct: num('BCHARGE'),
    batteryVoltage: num('BATTV'),
    runtimeMin: num('TIMELEFT'),
    loadPct: num('LOADPCT'),
    inputVoltage: num('LINEV'),
    outputVoltage: num('OUTPUTV'),
    temperature: null,
  }
}

app.get('/api/system/ups', authenticate, async (_req, res) => {
  try {
    // Try NUT (Network UPS Tools)
    try {
      const { stdout: listOut } = await execAsync('upsc -l 2>/dev/null', { timeout: 4000 })
      const upsName = listOut.trim().split('\n')[0]?.trim()
      if (upsName) {
        const { stdout } = await execAsync(`upsc ${upsName} 2>/dev/null`, { timeout: 4000 })
        if (stdout.trim()) return res.json(parseNutOutput(stdout))
      }
    } catch {}
    // Try apcupsd
    try {
      const { stdout } = await execAsync('apcaccess status 2>/dev/null', { timeout: 4000 })
      if (stdout.trim()) return res.json(parseApcAccess(stdout))
    } catch {}
    res.json({ connected: false })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── 服務狀態 / 控制 ───────────────────────────────────────

async function isServiceActive(name) {
  try {
    const { stdout } = await execAsync(`systemctl is-active ${name} 2>/dev/null`)
    return stdout.trim() === 'active'
  } catch { return false }
}

app.get('/api/system/services', authenticate, requireAdmin, async (_req, res) => {
  const [ftp, samba] = await Promise.all([isServiceActive('vsftpd'), isServiceActive('smbd')])
  res.json({ ftp, sftp: true, samba, webdav: true })
})

app.post('/api/system/services/:svc/:action', authenticate, requireAdmin, async (req, res) => {
  const svcMap = { vsftpd: true, smbd: true }
  const actMap = { start: true, stop: true, restart: true }
  const { svc, action } = req.params
  if (!svcMap[svc] || !actMap[action])
    return res.status(400).json({ error: '不支援的服務或操作' })
  try {
    await execAsync(`sudo systemctl ${action} ${svc}`)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── 外接裝置 / 磁碟管理 ───────────────────────────────────

app.get('/api/system/disks', authenticate, requireAdmin, async (_req, res) => {
  try {
    // Use basic columns supported by all lsblk versions (util-linux ≥ 2.19)
    const { stdout } = await execAsync(
      'lsblk -J -o NAME,SIZE,TYPE,MOUNTPOINT,FSTYPE,LABEL,UUID',
      { timeout: 5000 }
    )
    res.json(JSON.parse(stdout))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/system/disks/mount', authenticate, requireAdmin, express.json(), async (req, res) => {
  const { device, folderName, bindSource } = req.body ?? {}

  // 只允許標準區塊裝置路徑
  if (!device || !/^\/dev\/(sd[a-z]\d*|mmcblk\d+p\d+|nvme\d+n\d+p\d+)$/.test(device))
    return res.status(400).json({ error: '無效的裝置路徑' })

  // 驗證資料夾名稱
  if (!folderName || folderName.length > 64 || /[/\\:*?"<>|\0]/.test(folderName))
    return res.status(400).json({ error: '無效的資料夾名稱' })

  // 掛載到管理員的 NAS 檔案目錄下
  const mountPath = path.join(FILES_DIR, req.user.username, folderName)
  const userRoot  = path.resolve(FILES_DIR, req.user.username)
  if (!path.resolve(mountPath).startsWith(userRoot + path.sep))
    return res.status(400).json({ error: '非法路徑' })

  try {
    await fs.mkdir(mountPath, { recursive: true })

    // Detect filesystem type to decide mount strategy
    const { stdout: fstypeOut } = await execAsync(
      `lsblk -no FSTYPE "${device}"`, { timeout: 5000 }
    ).catch(() => ({ stdout: '' }))
    const fstype = fstypeOut.trim().toLowerCase()
    const nasUid = process.getuid()
    const nasGid = process.getgid()

    let mountCmd
    if (['exfat', 'vfat', 'msdos', 'ntfs'].includes(fstype)) {
      // FAT-family: uid/gid are mount-time options; avoid bind mount which inherits wrong uid
      const opts = `uid=${nasUid},gid=${nasGid},dmask=0022,fmask=0133,noatime`
      mountCmd = `sudo mount -t ${fstype} -o ${opts} "${device}" "${mountPath}"`
    } else if (bindSource && typeof bindSource === 'string' && bindSource.startsWith('/')) {
      mountCmd = `sudo mount --bind "${bindSource}" "${mountPath}"`
    } else {
      mountCmd = `sudo mount "${device}" "${mountPath}"`
    }

    await execAsync(mountCmd, { timeout: 15000 })
    res.json({ ok: true })
  } catch (err) {
    await fs.rmdir(mountPath).catch(() => {})
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/system/disks/umount', authenticate, requireAdmin, express.json(), async (req, res) => {
  const { folderName } = req.body ?? {}
  if (!folderName || /[/\\:*?"<>|\0]/.test(folderName))
    return res.status(400).json({ error: '無效的名稱' })

  const mountPath = path.join(FILES_DIR, req.user.username, folderName)
  const userRoot  = path.resolve(FILES_DIR, req.user.username)
  if (!path.resolve(mountPath).startsWith(userRoot + path.sep))
    return res.status(400).json({ error: '非法路徑' })

  try {
    await execAsync(`sudo umount "${mountPath}"`, { timeout: 15000 })
    await fs.rmdir(mountPath).catch(() => {})
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/system/disks/rename-folder', authenticate, requireAdmin, express.json(), async (req, res) => {
  const { oldName, newName } = req.body ?? {}
  if (!oldName || !newName || /[/\\:*?"<>|\0]/.test(oldName) || /[/\\:*?"<>|\0]/.test(newName))
    return res.status(400).json({ error: '無效的名稱' })

  const userRoot = path.resolve(FILES_DIR, req.user.username)
  const oldPath  = path.join(userRoot, oldName)
  const newPath  = path.join(userRoot, newName)
  if (!oldPath.startsWith(userRoot + path.sep) || !newPath.startsWith(userRoot + path.sep))
    return res.status(400).json({ error: '非法路徑' })

  try {
    // Detect if oldPath is currently mounted; if so, umount → rename → remount
    const { stdout: mountsOut } = await execAsync('cat /proc/mounts').catch(() => ({ stdout: '' }))
    const mountLine = mountsOut.split('\n').find(l => l.split(' ')[1] === oldPath)
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

// ── 網路速度 ─────────────────────────────────────────────

const netCache = { time: 0, stats: /** @type {Record<string, {rx:number,tx:number}>} */ ({}) }

app.get('/api/system/network', authenticate, async (_req, res) => {
  try {
    const now = Date.now()
    const content = await fs.readFile('/proc/net/dev', 'utf8')
    const current = {}
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*(\w+):\s*(\d+)\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+(\d+)/)
      if (m) current[m[1]] = { rx: +m[2], tx: +m[3] }
    }

    let totalRx = 0, totalTx = 0
    const interfaces = {}

    if (netCache.time > 0) {
      const elapsed = (now - netCache.time) / 1000
      if (elapsed > 0) {
        for (const [iface, vals] of Object.entries(current)) {
          if (iface === 'lo') continue
          const prev = netCache.stats[iface]
          if (prev) {
            const rx = Math.max(0, (vals.rx - prev.rx) / elapsed)
            const tx = Math.max(0, (vals.tx - prev.tx) / elapsed)
            interfaces[iface] = { rx, tx }
            totalRx += rx
            totalTx += tx
          }
        }
      }
    }

    netCache.time = now
    netCache.stats = current
    res.json({ totalRx, totalTx, interfaces })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Fail2ban ──────────────────────────────────────────────

app.get('/api/system/fail2ban', authenticate, requireAdmin, async (_req, res) => {
  try {
    const { stdout: jailsOut } = await execAsync('sudo fail2ban-client status', { timeout: 8000 })
    const jailsMatch = jailsOut.match(/Jail list:\s*(.+)/)
    const jailNames = jailsMatch ? jailsMatch[1].trim().split(',').map(s => s.trim()).filter(Boolean) : []

    const jails = []
    for (const name of jailNames) {
      try {
        const { stdout } = await execAsync(`sudo fail2ban-client status ${name}`, { timeout: 8000 })
        const banned = parseInt(stdout.match(/Currently banned:\s*(\d+)/)?.[1] ?? '0')
        const totalBanned = parseInt(stdout.match(/Total banned:\s*(\d+)/)?.[1] ?? '0')
        const failed = parseInt(stdout.match(/Currently failed:\s*(\d+)/)?.[1] ?? '0')
        const totalFailed = parseInt(stdout.match(/Total failed:\s*(\d+)/)?.[1] ?? '0')
        const banListMatch = stdout.match(/Banned IP list:\s*(.+)/)
        const bannedIps = banListMatch
          ? banListMatch[1].trim().split(/\s+/).filter(s => s && /^[\d.]+$/.test(s))
          : []

        const status = stdout.match(/Status for the jail/i) ? 'active' : 'inactive'

        jails.push({ name, status, banned, totalBanned, failed, totalFailed, bannedIps })
      } catch {
        jails.push({ name, status: 'error', banned: 0, totalBanned: 0, failed: 0, totalFailed: 0, bannedIps: [] })
      }
    }

    res.json({ jails })
  } catch (err) {
    const msg = String(err.message ?? '')
    if (msg.includes('not found') || msg.includes('command not found'))
      return res.json({ jails: [], unavailable: true, reason: 'not_installed' })
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/system/fail2ban/unban', authenticate, requireAdmin, express.json(), async (req, res) => {
  const { jail, ip } = req.body ?? {}
  if (!jail || !ip) return res.status(400).json({ error: '缺少 jail 或 IP' })
  try {
    await execAsync(`sudo fail2ban-client set ${jail} unbanip ${ip}`, { timeout: 10000 })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/system/fail2ban/log', authenticate, requireAdmin, async (_req, res) => {
  const attempts = [
    'sudo tail -n 300 /var/log/fail2ban.log',
    'tail -n 300 /var/log/fail2ban.log',
    'sudo journalctl -u fail2ban -n 300 --no-pager --output=short',
  ]
  for (const cmd of attempts) {
    try {
      const { stdout } = await execAsync(cmd, { timeout: 8000 })
      const lines = stdout.trim().split('\n').filter(Boolean).reverse()
      return res.json({ lines })
    } catch { /* try next */ }
  }
  res.json({ lines: [] })
})

// ── 應用程式 (Docker) ──────────────────────────────────────

app.get('/api/apps', authenticate, async (_req, res) => {
  let dockerApps = []
  let unavailable = false
  let reason = ''

  try {
    const { stdout } = await execAsync("docker ps -a --format '{{json .}}'", { timeout: 8000 })
    dockerApps = stdout.trim().split('\n')
      .filter(Boolean)
      .map(line => { try { return JSON.parse(line) } catch { return null } })
      .filter(Boolean)
  } catch (err) {
    unavailable = true
    const msg = String(err.message ?? '')
    reason = msg.includes('permission denied') || msg.includes('connect to the Docker daemon')
      ? 'permission'
      : msg.includes('not found') || msg.includes('No such file')
        ? 'not_installed'
        : 'unavailable'
  }

  // Also include pm2 processes
  let pm2Apps = []
  try {
    const { stdout: pm2Out } = await execAsync('pm2 jlist', { timeout: 5000 })
    const procs = JSON.parse(pm2Out)
    pm2Apps = procs.map(p => ({
      ID: `pm2_${p.pm_id}`,
      Names: p.name,
      Image: `Node.js (pm2)`,
      Status: p.pm2_env?.status === 'online' ? `運行中 ${Math.floor((Date.now() - p.pm2_env.pm_uptime) / 60000)} 分鐘` : (p.pm2_env?.status ?? 'stopped'),
      State: p.pm2_env?.status === 'online' ? 'running' : 'stopped',
      Ports: p.pm2_env?.PORT ? `:${p.pm2_env.PORT}` : '',
      RunningFor: '',
      _pm2: true,
    }))
  } catch {}

  res.json({ apps: [...dockerApps, ...pm2Apps], unavailable: unavailable && pm2Apps.length === 0, reason })
})

app.post('/api/apps/:id/control', authenticate, requireAdmin, express.json(), async (req, res) => {
  const { id } = req.params
  const { action } = req.body ?? {}
  if (!['start', 'stop', 'restart'].includes(action))
    return res.status(400).json({ error: '不支援的操作' })

  // pm2 process
  if (id.startsWith('pm2_')) {
    const pm2Id = id.slice(4)
    if (!/^\d+$/.test(pm2Id)) return res.status(400).json({ error: '無效的 pm2 ID' })
    try {
      await execAsync(`pm2 ${action} ${pm2Id}`, { timeout: 15000 })
      return res.json({ ok: true })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (!/^[a-zA-Z0-9_.-]+$/.test(id))
    return res.status(400).json({ error: '無效的容器 ID' })
  try {
    await execAsync(`docker ${action} ${id}`, { timeout: 30000 })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/apps/:id/pull', authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params
  if (!/^[a-zA-Z0-9_.-]+$/.test(id))
    return res.status(400).json({ error: '無效的容器 ID' })
  try {
    const { stdout: imgOut } = await execAsync(`docker inspect --format '{{.Config.Image}}' ${id}`, { timeout: 5000 })
    const image = imgOut.trim()
    if (!image) return res.status(404).json({ error: '找不到容器' })
    const { stdout: pullOut } = await execAsync(`docker pull ${image}`, { timeout: 120000 })
    const updated = !pullOut.includes('Status: Image is up to date')
    if (updated) await execAsync(`docker restart ${id}`, { timeout: 30000 }).catch(() => {})
    res.json({ ok: true, updated, image })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── 分享連結 ─────────────────────────────────────────────

async function getShare(token) {
  const [rows] = await pool.query(
    'SELECT s.*, u.username FROM shares s JOIN users u ON s.owner_id = u.id WHERE s.token = ?',
    [token]
  )
  return rows[0] ?? null
}

function shareValid(s) {
  if (!s) return false
  if (s.one_time && s.used) return false
  if (s.expires_at && new Date(s.expires_at) < new Date()) return false
  return true
}

// 建立分享
app.post('/api/shares', authenticate, async (req, res) => {
  const { path: filePath, permission = 'view', password, oneTime = false, expiresIn } = req.body ?? {}
  if (!filePath) return res.status(400).json({ error: 'path required' })
  let stat
  try { stat = await fs.stat(safePath(req.user.username, filePath)) }
  catch { return res.status(404).json({ error: '檔案不存在' }) }

  const token = randomBytes(16).toString('hex')
  const hash = password ? await bcrypt.hash(password, 10) : null
  const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null
  await pool.query(
    'INSERT INTO shares (token,owner_id,file_path,is_folder,permission,password,one_time,expires_at) VALUES (?,?,?,?,?,?,?,?)',
    [token, req.user.uid, filePath, stat.isDirectory() ? 1 : 0, permission, hash, oneTime ? 1 : 0, expiresAt]
  )
  res.json({ token })
})

// 我的分享清單
app.get('/api/shares', authenticate, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id,token,file_path,is_folder,permission,one_time,used,created_at,expires_at FROM shares WHERE owner_id = ? ORDER BY created_at DESC',
    [req.user.uid]
  )
  res.json({ shares: rows })
})

// 刪除分享
app.delete('/api/shares/:token', authenticate, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM shares WHERE token = ?', [req.params.token])
  const s = rows[0]
  if (!s) return res.status(404).json({ error: '分享不存在' })
  if (s.owner_id !== req.user.uid && req.user.role !== 'admin')
    return res.status(403).json({ error: '無權限' })
  await pool.query('DELETE FROM shares WHERE token = ?', [req.params.token])
  res.json({ ok: true })
})

// ── 公開分享存取 ─────────────────────────────────────────

// 取得分享資訊（公開）
app.get('/api/share/:token', async (req, res) => {
  const s = await getShare(req.params.token)
  if (!shareValid(s)) return res.status(404).json({ error: '分享連結不存在或已過期' })
  res.json({
    token: s.token,
    fileName: path.basename(s.file_path),
    isFolder: !!s.is_folder,
    permission: s.permission,
    hasPassword: !!s.password,
    oneTime: !!s.one_time,
  })
})

// 驗證密碼 / 取得存取令牌（公開）
app.post('/api/share/:token/verify', async (req, res) => {
  const s = await getShare(req.params.token)
  if (!shareValid(s)) return res.status(404).json({ error: '分享連結不存在或已過期' })
  if (s.password) {
    const valid = await bcrypt.compare(req.body?.password ?? '', s.password)
    if (!valid) return res.status(401).json({ error: '密碼錯誤' })
  }
  if (s.one_time) await pool.query('UPDATE shares SET used=1 WHERE token=?', [s.token])
  const shareJwt = jwt.sign(
    { shareToken: s.token, permission: s.permission, username: s.username },
    JWT_SECRET, { expiresIn: '24h' }
  )
  res.json({ shareJwt })
})

function verifyShareJwt(req, res, next) {
  const raw = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : req.query.shareJwt
  if (!raw) return res.status(401).json({ error: '需要存取令牌' })
  try {
    const p = jwt.verify(raw, JWT_SECRET)
    if (!p.shareToken || p.shareToken !== req.params.token) return res.status(403).json({ error: '令牌不符' })
    req.sharePayload = p
    next()
  } catch { res.status(401).json({ error: '令牌已過期' }) }
}

// 列出資料夾內容（公開）
app.get('/api/share/:token/files', verifyShareJwt, async (req, res) => {
  const s = await getShare(req.params.token)
  if (!s || !s.is_folder) return res.status(404).json({ error: '無效分享' })
  const base = safePath(s.username, s.file_path)
  const sub = (req.query.path ?? '').replace(/^\/+/, '')
  const dir = sub ? path.resolve(base, sub) : base
  if (!dir.startsWith(base)) return res.status(403).json({ error: '路徑超出範圍' })
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const items = await Promise.all(entries.map(async e => {
    const st = await fs.stat(path.join(dir, e.name))
    return { name: e.name, type: e.isDirectory() ? 'folder' : 'file', size: e.isDirectory() ? undefined : st.size, modified: st.mtime.toISOString() }
  }))
  items.sort((a, b) => a.type !== b.type ? (a.type === 'folder' ? -1 : 1) : a.name.localeCompare(b.name))
  res.json({ items })
})

// 下載（公開）
app.get('/api/share/:token/download', verifyShareJwt, async (req, res) => {
  const s = await getShare(req.params.token)
  if (!s) return res.status(404).json({ error: '無效分享' })
  if (s.permission === 'view') return res.status(403).json({ error: '此分享不允許下載' })
  const base = safePath(s.username, s.file_path)
  const sub = (req.query.path ?? '').replace(/^\/+/, '')
  const filePath = sub ? path.resolve(base, sub) : base
  if (!filePath.startsWith(base)) return res.status(403).json({ error: '路徑超出範圍' })
  res.download(filePath)
})

// 上傳到分享資料夾（公開，需 edit 權限）
app.post('/api/share/:token/upload', verifyShareJwt, upload.array('files'), async (req, res) => {
  const tempFiles = req.files ?? []
  if (req.sharePayload.permission !== 'edit') {
    for (const f of tempFiles) await fs.unlink(f.path).catch(() => {})
    return res.status(403).json({ error: '無編輯權限' })
  }
  const s = await getShare(req.params.token)
  if (!s || !s.is_folder) {
    for (const f of tempFiles) await fs.unlink(f.path).catch(() => {})
    return res.status(404).json({ error: '無效分享' })
  }
  try {
    const base = safePath(s.username, s.file_path)
    const sub = (req.query.path ?? '').replace(/^\/+/, '')
    const dir = sub ? path.resolve(base, sub) : base
    if (!dir.startsWith(base)) throw new Error('Invalid path')
    await fs.mkdir(dir, { recursive: true })
    const rawNames = req.body.filenames
    const nameList = Array.isArray(rawNames) ? rawNames : [rawNames]
    for (let i = 0; i < tempFiles.length; i++) {
      const f = tempFiles[i]
      const name = nameList[i] ?? fixEncoding(f.originalname)
      const dest = path.join(dir, name)
      await fs.copyFile(f.path, dest)
      await fs.unlink(f.path)
    }
    res.json({ ok: true })
  } catch (err) {
    for (const f of tempFiles) await fs.unlink(f.path).catch(() => {})
    res.status(400).json({ error: err.message })
  }
})

// ── 同步服務密碼輔助 ──────────────────────────────────────

async function syncServicePasswords(username, plainPassword) {
  // FTP virtual users DB (requires db_load installed)
  const dbTxt = '/etc/vsftpd/virtual_users.txt'
  try {
    let lines = []
    try { lines = (await fs.readFile(dbTxt, 'utf8')).split('\n').filter(Boolean) } catch {}
    const map = {}
    for (let i = 0; i < lines.length; i += 2) map[lines[i]] = lines[i + 1] ?? ''
    map[username] = plainPassword
    const content = Object.entries(map).map(([u, p]) => `${u}\n${p}`).join('\n') + '\n'
    await fs.writeFile(dbTxt, content)
    await execAsync(`sudo db_load -T -t hash -f ${dbTxt} /etc/vsftpd/login.db && sudo chmod 600 /etc/vsftpd/login.db`)
  } catch {}

  // Samba password
  try {
    await execAsync(`printf '%s\n%s\n' '${plainPassword.replace(/'/g, "'\\''")}' '${plainPassword.replace(/'/g, "'\\''")}' | sudo smbpasswd -s -a ${username}`)
  } catch {}
}

// ── 二步驗證 (2FA / TOTP) ────────────────────────────────

// App 初始設定：用帳密換 secret（App 用，不需 JWT）
app.post('/api/2fa/app-setup', async (req, res) => {
  const { username, password } = req.body ?? {}
  if (!username || !password) return res.status(400).json({ error: '請提供帳號和密碼' })

  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
  const user = rows[0]
  if (!user) return res.status(401).json({ error: '帳號或密碼錯誤' })
  if (user.disabled) return res.status(403).json({ error: '帳號已停用' })
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: '帳號或密碼錯誤' })

  // 若已啟用 2FA，不允許重設（需先從網頁停用）
  const [tfRows] = await pool.query('SELECT * FROM two_factor WHERE user_id = ?', [user.id])
  if (tfRows[0]?.enabled) return res.status(409).json({ error: '二步驗證已啟用，請先在網頁設定頁面停用後再重新設定' })

  const secret = authenticator.generateSecret()
  await pool.query(
    'INSERT INTO two_factor (user_id, secret, enabled) VALUES (?, ?, 0) ON DUPLICATE KEY UPDATE secret = ?, enabled = 0',
    [user.id, secret, secret]
  )
  res.json({ secret, username: user.username })
})

// 查詢 2FA 狀態（需 JWT）
app.get('/api/2fa/status', authenticate, async (req, res) => {
  const [rows] = await pool.query('SELECT enabled FROM two_factor WHERE user_id = ?', [req.user.uid])
  res.json({ enabled: !!(rows[0]?.enabled) })
})

// 啟用 2FA（需 JWT + 驗證碼）
app.post('/api/2fa/enable', authenticate, async (req, res) => {
  const { code } = req.body ?? {}
  if (!code) return res.status(400).json({ error: '請輸入驗證碼' })
  const [rows] = await pool.query('SELECT * FROM two_factor WHERE user_id = ? AND enabled = 0', [req.user.uid])
  if (!rows[0]) return res.status(400).json({ error: '請先在手機 App 完成設定' })
  if (!authenticator.verify({ token: String(code).replace(/\s/g, ''), secret: rows[0].secret }))
    return res.status(400).json({ error: '驗證碼錯誤或已過期，請重新查看 App' })
  await pool.query('UPDATE two_factor SET enabled = 1 WHERE user_id = ?', [req.user.uid])
  res.json({ ok: true })
})

// 停用 2FA（需 JWT + 驗證碼）
app.delete('/api/2fa/disable', authenticate, async (req, res) => {
  const { code } = req.body ?? {}
  if (!code) return res.status(400).json({ error: '請輸入驗證碼' })
  const [rows] = await pool.query('SELECT * FROM two_factor WHERE user_id = ? AND enabled = 1', [req.user.uid])
  if (!rows[0]) return res.status(400).json({ error: '二步驗證未啟用' })
  if (!authenticator.verify({ token: String(code).replace(/\s/g, ''), secret: rows[0].secret }))
    return res.status(400).json({ error: '驗證碼錯誤或已過期' })
  await pool.query('DELETE FROM two_factor WHERE user_id = ?', [req.user.uid])
  res.json({ ok: true })
})

// 登入時驗證 TOTP（使用 tempToken，不需 JWT）
app.post('/api/2fa/verify', async (req, res) => {
  const { tempToken, code } = req.body ?? {}
  if (!tempToken || !code) return res.status(400).json({ error: '缺少參數' })
  let payload
  try { payload = jwt.verify(tempToken, JWT_SECRET) } catch { return res.status(401).json({ error: '驗證連結已過期，請重新登入' }) }
  if (!payload.twoFactor) return res.status(400).json({ error: '無效的驗證令牌' })
  const [rows] = await pool.query('SELECT secret FROM two_factor WHERE user_id = ? AND enabled = 1', [payload.uid])
  if (!rows[0]) return res.status(400).json({ error: '此帳號未設定二步驗證' })
  if (!authenticator.verify({ token: String(code).replace(/\s/g, ''), secret: rows[0].secret }))
    return res.status(401).json({ error: '驗證碼錯誤或已過期' })
  const token = jwt.sign(
    { uid: payload.uid, username: payload.username, role: payload.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  )
  res.json({ token, username: payload.username, role: payload.role })
})

// ── 私人相冊 WebAuthn 指紋解鎖 ───────────────────────────

// 每位使用者的 challenge 暫存（5 分鐘 TTL）
const lockerChallenges = new Map()
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of lockerChallenges) if (v.expires < now) lockerChallenges.delete(k)
}, 5 * 60 * 1000)

// 手機生物識別解鎖信號（userId → expires），60 秒 TTL
const lockerMobileSignals = new Map()
const reelsMobileSignals  = new Map()
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of lockerMobileSignals) if (v < now) lockerMobileSignals.delete(k)
  for (const [k, v] of reelsMobileSignals)  if (v < now) reelsMobileSignals.delete(k)
}, 30 * 1000)

function getOrigin(req) {
  // Prefer explicit origin sent by authenticated frontend (more reliable than CORS header)
  if (req.query?.origin) {
    try { const u = new URL(decodeURIComponent(req.query.origin)); return `${u.protocol}//${u.host}` } catch {}
  }
  return req.headers.origin || `https://${req.hostname}`
}
function hostnameFromOrigin(origin) {
  try { return new URL(origin).hostname } catch { return origin }
}
function getRpId(req) {
  return hostnameFromOrigin(getOrigin(req))
}

// 取得已登錄的憑證數量（前端用來判斷是否需要先註冊）
app.get('/api/locker/webauthn/status', authenticate, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, device_name, created_at FROM locker_webauthn WHERE user_id = ?',
    [req.user.uid]
  )
  res.json({ registered: rows.length > 0, devices: rows })
})

// 1. 取得註冊選項
app.get('/api/locker/webauthn/register-options', authenticate, async (req, res) => {
  const [existing] = await pool.query(
    'SELECT credential_id FROM locker_webauthn WHERE user_id = ?', [req.user.uid]
  )
  try {
    const options = await generateRegistrationOptions({
      rpName: 'CasaOS NAS 私人相冊',
      rpID: getRpId(req),
      userID: Buffer.from(String(req.user.uid)),
      userName: req.user.username,
      userDisplayName: req.user.username,
      attestationType: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred',
      },
      excludeCredentials: existing.map(r => ({ id: r.credential_id, type: 'public-key' })),
    })
    lockerChallenges.set(`reg_${req.user.uid}`, { challenge: options.challenge, origin: getOrigin(req), expires: Date.now() + 5 * 60 * 1000 })
    res.json(options)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// 2. 驗證並儲存憑證
app.post('/api/locker/webauthn/register-verify', authenticate, express.json(), async (req, res) => {
  const { response, deviceName } = req.body ?? {}
  const stored = lockerChallenges.get(`reg_${req.user.uid}`)
  if (!stored || Date.now() > stored.expires) return res.status(400).json({ error: '驗證已過期，請重試' })
  try {
    const result = await verifyRegistrationResponse({
      response,
      expectedChallenge: stored.challenge,
      expectedOrigin: stored.origin,
      expectedRPID: hostnameFromOrigin(stored.origin),
      requireUserVerification: true,
    })
    if (!result.verified || !result.registrationInfo) throw new Error('驗證失敗')
    const { credential } = result.registrationInfo
    const pubKeyB64 = Buffer.from(credential.publicKey).toString('base64url')
    await pool.query(
      `INSERT INTO locker_webauthn (user_id, credential_id, public_key, counter, device_name)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE public_key = VALUES(public_key), counter = VALUES(counter), device_name = VALUES(device_name)`,
      [req.user.uid, credential.id, pubKeyB64, credential.counter, deviceName || null]
    )
    lockerChallenges.delete(`reg_${req.user.uid}`)
    res.json({ ok: true })
  } catch (e) { res.status(400).json({ error: e.message }) }
})

// 3. 取得驗證選項
app.get('/api/locker/webauthn/auth-options', authenticate, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT credential_id FROM locker_webauthn WHERE user_id = ?', [req.user.uid]
  )
  if (!rows.length) return res.status(404).json({ error: 'no_credential' })
  try {
    const options = await generateAuthenticationOptions({
      rpID: getRpId(req),
      userVerification: 'required',
      allowCredentials: rows.map(r => ({ id: r.credential_id, type: 'public-key' })),
    })
    lockerChallenges.set(`auth_${req.user.uid}`, { challenge: options.challenge, origin: getOrigin(req), expires: Date.now() + 5 * 60 * 1000 })
    res.json(options)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// 4. 驗證指紋並解鎖
app.post('/api/locker/webauthn/auth-verify', authenticate, express.json(), async (req, res) => {
  const { response } = req.body ?? {}
  const stored = lockerChallenges.get(`auth_${req.user.uid}`)
  if (!stored || Date.now() > stored.expires) return res.status(400).json({ error: '驗證已過期，請重試' })
  try {
    const [rows] = await pool.query(
      'SELECT * FROM locker_webauthn WHERE user_id = ? AND credential_id = ?',
      [req.user.uid, response.id]
    )
    if (!rows[0]) throw new Error('找不到對應的設備憑證')
    const pubKey = new Uint8Array(Buffer.from(rows[0].public_key, 'base64url'))
    const result = await verifyAuthenticationResponse({
      response,
      expectedChallenge: stored.challenge,
      expectedOrigin: stored.origin,
      expectedRPID: hostnameFromOrigin(stored.origin),
      requireUserVerification: true,
      credential: { id: rows[0].credential_id, publicKey: pubKey, counter: rows[0].counter },
    })
    if (!result.verified) throw new Error('指紋驗證失敗')
    await pool.query(
      'UPDATE locker_webauthn SET counter = ? WHERE credential_id = ?',
      [result.authenticationInfo.newCounter, response.id]
    )
    lockerChallenges.delete(`auth_${req.user.uid}`)
    res.json({ ok: true })
  } catch (e) { res.status(401).json({ error: e.message }) }
})

// 刪除已登錄的設備
app.delete('/api/locker/webauthn/:credId', authenticate, async (req, res) => {
  await pool.query(
    'DELETE FROM locker_webauthn WHERE user_id = ? AND id = ?',
    [req.user.uid, req.params.credId]
  )
  res.json({ ok: true })
})

// 私人相冊：用 TOTP 驗證碼解鎖（需 JWT，不需 2FA 已啟用於登入）
app.post('/api/locker/unlock', authenticate, express.json(), async (req, res) => {
  const { code } = req.body ?? {}
  if (!code) return res.status(400).json({ error: '請提供驗證碼' })
  const clean = String(code).replace(/\s/g, '')
  if (!/^\d{6}$/.test(clean)) return res.status(400).json({ error: '驗證碼格式錯誤' })
  const [rows] = await pool.query(
    'SELECT secret FROM two_factor WHERE user_id = ? AND enabled = 1',
    [req.user.uid]
  )
  if (!rows[0]) return res.status(403).json({ error: '尚未啟用雙重驗證，請先在設定中啟用 2FA' })
  const valid = authenticator.verify({ token: clean, secret: rows[0].secret })
  if (!valid) return res.status(401).json({ error: '驗證碼錯誤或已過期，請確認手機時間正確' })
  res.json({ ok: true })
})

// 手機 App 生物識別成功後發送解鎖信號（不需 JWT，以 TOTP 驗證身份）
app.post('/api/locker/mobile-signal', express.json(), async (req, res) => {
  const { username, totpCode } = req.body ?? {}
  if (!username || !totpCode) return res.status(400).json({ error: '缺少參數' })
  const clean = String(totpCode).replace(/\s/g, '')
  if (!/^\d{6}$/.test(clean)) return res.status(400).json({ error: '驗證碼格式錯誤' })
  try {
    const [users] = await pool.query('SELECT id FROM users WHERE username = ?', [username])
    if (!users[0]) return res.status(401).json({ error: '帳號不存在' })
    const [tfRows] = await pool.query(
      'SELECT secret FROM two_factor WHERE user_id = ? AND enabled = 1', [users[0].id]
    )
    if (!tfRows[0]) return res.status(403).json({ error: '此帳號未設定雙重驗證' })
    if (!authenticator.verify({ token: clean, secret: tfRows[0].secret }))
      return res.status(401).json({ error: '驗證碼錯誤或已過期' })
    lockerMobileSignals.set(users[0].id, Date.now() + 60 * 1000)
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// 網頁端輪詢手機信號（需 JWT）
app.get('/api/locker/mobile-signal', authenticate, (req, res) => {
  const expires = lockerMobileSignals.get(req.user.uid)
  if (expires && expires > Date.now()) {
    lockerMobileSignals.delete(req.user.uid)
    return res.json({ ready: true })
  }
  res.json({ ready: false })
})

// ── Telegram 影片集 手機生物識別解鎖信號 ────────────────────
const telegramMobileSignals = new Map()
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of telegramMobileSignals) if (v < now) telegramMobileSignals.delete(k)
}, 30 * 1000)

app.post('/api/telegram/mobile-signal', express.json(), async (req, res) => {
  const { username, totpCode } = req.body ?? {}
  if (!username || !totpCode) return res.status(400).json({ error: '缺少參數' })
  const clean = String(totpCode).replace(/\s/g, '')
  if (!/^\d{6}$/.test(clean)) return res.status(400).json({ error: '驗證碼格式錯誤' })
  try {
    const [users] = await pool.query('SELECT id FROM users WHERE username = ?', [username])
    if (!users[0]) return res.status(401).json({ error: '帳號不存在' })
    const [tfRows] = await pool.query(
      'SELECT secret FROM two_factor WHERE user_id = ? AND enabled = 1', [users[0].id]
    )
    if (!tfRows[0]) return res.status(403).json({ error: '此帳號未設定雙重驗證' })
    if (!authenticator.verify({ token: clean, secret: tfRows[0].secret }))
      return res.status(401).json({ error: '驗證碼錯誤或已過期' })
    telegramMobileSignals.set(users[0].id, Date.now() + 60 * 1000)
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.get('/api/telegram/mobile-signal', authenticate, (req, res) => {
  const expires = telegramMobileSignals.get(req.user.uid)
  if (expires && expires > Date.now()) {
    telegramMobileSignals.delete(req.user.uid)
    return res.json({ ready: true })
  }
  res.json({ ready: false })
})

// ── Telegram Bot 輪詢（設定 TELEGRAM_BOT_TOKEN 後自動啟動）──
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN
if (TG_TOKEN) {
  let tgOffset = 0
  async function tgHandleUpdate(update) {
    const msg = update.message || update.channel_post
    if (!msg) return
    const video = msg.video
      || (msg.document?.mime_type?.startsWith('video/') ? msg.document : null)
    if (!video) return
    try {
      // getFile API
      const gfRes = await fetch(
        `https://api.telegram.org/bot${TG_TOKEN}/getFile?file_id=${video.file_id}`
      )
      const gfData = await gfRes.json()
      const filePath = gfData.result?.file_path
      if (!filePath) return
      // download file (Bot API: up to 20 MB)
      const dlRes = await fetch(
        `https://api.telegram.org/file/bot${TG_TOKEN}/${filePath}`
      )
      if (!dlRes.ok) return
      const ext = filePath.split('.').pop() || 'mp4'
      const filename = `tg_${Date.now()}_${video.file_id.slice(-8)}.${ext}`
      // save to admin boyud9.5's Telegram folder
      const destDir = safePath('boyud9.5', 'sda1/Telegram')
      await fs.mkdir(destDir, { recursive: true })
      const buf = Buffer.from(await dlRes.arrayBuffer())
      await fs.writeFile(path.join(destDir, filename), buf)
      console.log(`[tg-bot] saved: ${filename}`)
    } catch (e) { console.error('[tg-bot] error:', e.message) }
  }
  async function tgPoll() {
    try {
      const url = `https://api.telegram.org/bot${TG_TOKEN}/getUpdates?timeout=25&offset=${tgOffset}`
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
      const data = await res.json()
      for (const update of data.result ?? []) {
        tgOffset = update.update_id + 1
        tgHandleUpdate(update).catch(() => {})
      }
    } catch { /* network error, retry */ }
    setTimeout(tgPoll, 2000)
  }
  tgPoll()
  console.log('[tg-bot] polling started')
}

// ── 私人短影音 手機生物識別解鎖信號 ─────────────────────────
app.post('/api/reels/mobile-signal', express.json(), async (req, res) => {
  const { username, totpCode } = req.body ?? {}
  if (!username || !totpCode) return res.status(400).json({ error: '缺少參數' })
  const clean = String(totpCode).replace(/\s/g, '')
  if (!/^\d{6}$/.test(clean)) return res.status(400).json({ error: '驗證碼格式錯誤' })
  try {
    const [users] = await pool.query('SELECT id FROM users WHERE username = ?', [username])
    if (!users[0]) return res.status(401).json({ error: '帳號不存在' })
    const [tfRows] = await pool.query(
      'SELECT secret FROM two_factor WHERE user_id = ? AND enabled = 1', [users[0].id]
    )
    if (!tfRows[0]) return res.status(403).json({ error: '此帳號未設定雙重驗證' })
    if (!authenticator.verify({ token: clean, secret: tfRows[0].secret }))
      return res.status(401).json({ error: '驗證碼錯誤或已過期' })
    reelsMobileSignals.set(users[0].id, Date.now() + 60 * 1000)
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.get('/api/reels/mobile-signal', authenticate, (req, res) => {
  const expires = reelsMobileSignals.get(req.user.uid)
  if (expires && expires > Date.now()) {
    reelsMobileSignals.delete(req.user.uid)
    return res.json({ ready: true })
  }
  res.json({ ready: false })
})

// ── 診斷（臨時） ─────────────────────────────────────────
app.get('/api/2fa/debug', authenticate, async (req, res) => {
  const [rows] = await pool.query('SELECT secret, enabled FROM two_factor WHERE user_id = ?', [req.user.uid])
  if (!rows[0]) return res.status(404).json({ error: '未設定 2FA' })
  const code = authenticator.generate(rows[0].secret)
  res.json({
    serverTime: new Date().toISOString(),
    serverCode: code,
    enabled: !!rows[0].enabled,
  })
})

// ── 快照系統 ──────────────────────────────────────────────

async function getSnapshotsDir(username) {
  const sda1Dir = path.join(FILES_DIR, username, 'sda1', '.vaultix', 'snapshots')
  try {
    await fs.mkdir(sda1Dir, { recursive: true })
    const test = path.join(sda1Dir, '.wtest')
    await fs.writeFile(test, '').then(() => fs.unlink(test))
    return sda1Dir
  } catch {
    const fallback = path.join(FILES_DIR, username, '.vaultix', 'snapshots')
    await fs.mkdir(fallback, { recursive: true })
    return fallback
  }
}

// 列出快照
app.get('/api/snapshots', authenticate, async (req, res) => {
  try {
    const dir = await getSnapshotsDir(req.user.username)
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
    const snapshots = []
    for (const e of entries) {
      if (!e.isDirectory()) continue
      const metaPath = path.join(dir, e.name, '_meta.json')
      try {
        const meta = JSON.parse(await fs.readFile(metaPath, 'utf8'))
        // get size via du
        let size = ''
        try {
          const { stdout } = await execAsync(`du -sh "${path.join(dir, e.name)}" 2>/dev/null | cut -f1`, { timeout: 5000 })
          size = stdout.trim()
        } catch { /* ignore */ }
        snapshots.push({ ...meta, size })
      } catch { /* skip malformed */ }
    }
    snapshots.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    res.json({ snapshots })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 建立快照
app.post('/api/snapshots', authenticate, express.json(), async (req, res) => {
  const { path: relPath } = req.body ?? {}
  if (!relPath) return res.status(400).json({ error: '請提供路徑' })

  const safe = path.normalize(relPath).replace(/^(\.\.[/\\])+/, '')
  const srcFull = path.join(FILES_DIR, req.user.username, safe)

  // Verify it's a directory
  try {
    const st = await fs.stat(srcFull)
    if (!st.isDirectory()) return res.status(400).json({ error: '只能對資料夾建立快照' })
  } catch {
    return res.status(404).json({ error: '找不到資料夾' })
  }

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const folderName = path.basename(safe)
  const id = `${ts}_${folderName.replace(/[^a-zA-Z0-9_一-鿿]/g, '_')}`

  const snapshotsDir = await getSnapshotsDir(req.user.username)
  const destDir = path.join(snapshotsDir, id)
  await fs.mkdir(destDir, { recursive: true })

  try {
    // Copy using cp -rp (preserve timestamps), fallback handled by cp itself
    await execAsync(`cp -rp "${srcFull}/." "${destDir}/"`, { timeout: 300000 })

    const meta = { id, originalPath: safe, name: folderName, createdAt: new Date().toISOString() }
    await fs.writeFile(path.join(destDir, '_meta.json'), JSON.stringify(meta, null, 2))
    res.json(meta)
  } catch (err) {
    await fs.rm(destDir, { recursive: true, force: true }).catch(() => {})
    res.status(500).json({ error: `快照失敗：${err.message}` })
  }
})

// 還原快照（在同層建立新資料夾，不覆蓋原本）
app.post('/api/snapshots/:id/restore', authenticate, async (req, res) => {
  const snapshotsDir = await getSnapshotsDir(req.user.username)
  const snapDir = path.join(snapshotsDir, req.params.id)

  const metaPath = path.join(snapDir, '_meta.json')
  let meta
  try { meta = JSON.parse(await fs.readFile(metaPath, 'utf8')) }
  catch { return res.status(404).json({ error: '找不到快照' }) }

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)
  const parentRel = path.dirname(meta.originalPath)
  const restoredName = `${meta.name}_restored_${ts}`
  const restoredRel = parentRel === '.' ? restoredName : `${parentRel}/${restoredName}`
  const restoredFull = path.join(FILES_DIR, req.user.username, restoredRel)

  await fs.mkdir(restoredFull, { recursive: true })
  try {
    await execAsync(`cp -rp "${snapDir}/." "${restoredFull}/"`, { timeout: 300000 })
    // Remove the copied _meta.json from restored folder
    await fs.unlink(path.join(restoredFull, '_meta.json')).catch(() => {})
    res.json({ restoredPath: restoredRel })
  } catch (err) {
    await fs.rm(restoredFull, { recursive: true, force: true }).catch(() => {})
    res.status(500).json({ error: `還原失敗：${err.message}` })
  }
})

// 刪除快照
app.delete('/api/snapshots/:id', authenticate, async (req, res) => {
  const snapshotsDir = await getSnapshotsDir(req.user.username)
  const snapDir = path.join(snapshotsDir, req.params.id)

  // Security check: must be inside snapshots dir
  if (!snapDir.startsWith(snapshotsDir + path.sep)) {
    return res.status(400).json({ error: '路徑錯誤' })
  }
  try {
    await fs.stat(snapDir) // confirm exists
    await fs.rm(snapDir, { recursive: true, force: true })
    res.json({ ok: true })
  } catch {
    res.status(404).json({ error: '找不到快照' })
  }
})

// ── 監視器攝影機 ──────────────────────────────────────────

const CAMERAS_FILE = path.join(__dirname, 'data', 'cameras.json')

async function readCameras() {
  try { return JSON.parse(await fs.readFile(CAMERAS_FILE, 'utf8')) }
  catch { return [] }
}
async function writeCameras(list) {
  await fs.mkdir(path.dirname(CAMERAS_FILE), { recursive: true })
  await fs.writeFile(CAMERAS_FILE, JSON.stringify(list, null, 2))
}

// 列出所有攝影機
app.get('/api/cameras', authenticate, async (_req, res) => {
  res.json(await readCameras())
})

// 新增攝影機（管理員）
app.post('/api/cameras', authenticate, requireAdmin, express.json(), async (req, res) => {
  const { name, url, notes } = req.body ?? {}
  if (!name || !url) return res.status(400).json({ error: '請填寫名稱與串流網址' })
  const cameras = await readCameras()
  const cam = { id: randomBytes(8).toString('hex'), name, url, notes: notes ?? '' }
  cameras.push(cam)
  await writeCameras(cameras)
  res.json(cam)
})

// 更新攝影機（管理員）
app.put('/api/cameras/:id', authenticate, requireAdmin, express.json(), async (req, res) => {
  const { name, url, notes } = req.body ?? {}
  const cameras = await readCameras()
  const idx = cameras.findIndex(c => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: '找不到攝影機' })
  cameras[idx] = { ...cameras[idx], ...(name && { name }), ...(url && { url }), notes: notes ?? cameras[idx].notes }
  await writeCameras(cameras)
  res.json(cameras[idx])
})

// 刪除攝影機（管理員）
app.delete('/api/cameras/:id', authenticate, requireAdmin, async (req, res) => {
  const cameras = await readCameras()
  const filtered = cameras.filter(c => c.id !== req.params.id)
  if (filtered.length === cameras.length) return res.status(404).json({ error: '找不到攝影機' })
  await writeCameras(filtered)
  res.json({ ok: true })
})

// MJPEG 串流代理（ffmpeg 轉碼，支援 RTSP 與 HTTP MJPEG）
app.get('/api/cameras/:id/stream', authenticate, async (req, res) => {
  const cameras = await readCameras()
  const cam = cameras.find(c => c.id === req.params.id)
  if (!cam) return res.status(404).end()

  res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=ffmpeg')
  res.setHeader('Cache-Control', 'no-cache, no-store')
  res.setHeader('Pragma', 'no-cache')

  const isRtsp = cam.url.startsWith('rtsp://') || cam.url.startsWith('rtsps://')
  const ffArgs = [
    '-loglevel', 'quiet',
    ...(isRtsp ? ['-rtsp_transport', 'tcp'] : []),
    '-i', cam.url,
    '-f', 'mpjpeg',
    '-q:v', '5',
    '-r', '10',
    'pipe:1',
  ]

  let proc
  try {
    proc = spawn('ffmpeg', ffArgs, { stdio: ['ignore', 'pipe', 'ignore'] })
  } catch {
    return res.status(500).end()
  }

  proc.stdout.pipe(res)

  function cleanup() {
    try { proc.kill('SIGTERM') } catch { /* already dead */ }
  }
  req.on('close', cleanup)
  proc.on('error', () => res.end())
  proc.stdout.on('error', () => cleanup())
})

// 快照（取單張 JPEG）
app.get('/api/cameras/:id/snapshot', authenticate, async (req, res) => {
  const cameras = await readCameras()
  const cam = cameras.find(c => c.id === req.params.id)
  if (!cam) return res.status(404).end()

  const isRtsp = cam.url.startsWith('rtsp://') || cam.url.startsWith('rtsps://')
  try {
    const { stdout } = await execAsync(
      `ffmpeg -loglevel quiet ${isRtsp ? '-rtsp_transport tcp ' : ''}-i "${cam.url.replace(/"/g, '\\"')}" -vframes 1 -f image2 -vcodec mjpeg pipe:1`,
      { encoding: 'buffer', timeout: 10000 }
    )
    res.setHeader('Content-Type', 'image/jpeg')
    res.end(stdout)
  } catch {
    res.status(500).json({ error: 'snapshot failed' })
  }
})

// ── 健康檢查 ─────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({ ok: true }))

const server = http.createServer(app)

// node-pty（選用，未安裝時自動降級為 spawn）
let pty = null
try { pty = (await import('node-pty')).default } catch { /* spawn fallback */ }

// ── WebSocket 終端機 ──────────────────────────────────────

const wss = new WebSocketServer({ noServer: true })
const collabWss = new WebSocketServer({ noServer: true })
const fileRooms = new Map() // filePath -> Set of { ws, user, color, connectedAt }

const COLORS = ['#f87171', '#fb923c', '#fbbf24', '#34d399', '#22d3ee', '#818cf8', '#c084fc', '#f472b6']

function broadcastToRoom(filePath, message, excludeWs = null) {
  const room = fileRooms.get(filePath)
  if (!room) return
  const data = JSON.stringify(message)
  for (const client of room) {
    if (client.ws !== excludeWs && client.ws.readyState === 1) {
      client.ws.send(data)
    }
  }
}

function getRoomUsers(filePath) {
  const room = fileRooms.get(filePath)
  if (!room) return []
  return Array.from(room).map(c => ({
    id: c.user.uid,
    username: c.user.username,
    displayName: c.user.username,
    color: c.color,
    connectedAt: c.connectedAt
  }))
}

server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url ?? '', `http://${request.headers.host}`)
  if (url.pathname === '/api/terminal') {
    wss.handleUpgrade(request, socket, head, ws => wss.emit('connection', ws, request))
  } else if (url.pathname === '/api/collab') {
    collabWss.handleUpgrade(request, socket, head, ws => collabWss.emit('connection', ws, request))
  } else {
    socket.destroy()
  }
})

collabWss.on('connection', (ws, req) => {
  const url = new URL(req.url ?? '', `http://${req.headers.host}`)
  const token = url.searchParams.get('token') ?? ''
  let user
  try {
    user = jwt.verify(token, JWT_SECRET)
  } catch {
    ws.close(4001, '未授權')
    return
  }

  let currentFilePath = null
  const userColor = COLORS[Math.floor(Math.random() * COLORS.length)]
  const connectedAt = new Date().toISOString()

  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data)
      if (msg.type === 'join') {
        const { filePath } = msg
        currentFilePath = filePath
        let room = fileRooms.get(filePath)
        if (!room) {
          room = new Set()
          fileRooms.set(filePath, room)
        }
        room.add({ ws, user, color: userColor, connectedAt })

        const [tasks] = await pool.query('SELECT * FROM collab_tasks WHERE file_path = ? ORDER BY created_at ASC', [filePath])
        const [notes] = await pool.query('SELECT * FROM collab_notes WHERE file_path = ? ORDER BY created_at ASC', [filePath])
        
        ws.send(JSON.stringify({
          type: 'snapshot',
          users: getRoomUsers(filePath),
          tasks: tasks.map(t => ({ ...t, done: !!t.done })),
          notes: notes.map(n => ({ ...n, created_at: n.created_at?.toISOString?.() ?? n.created_at }))
        }))

        broadcastToRoom(filePath, { type: 'presence', users: getRoomUsers(filePath) }, ws)
        broadcastToRoom(filePath, { type: 'activity', text: `${user.username} 加入了文件` }, ws)

      } else if (msg.type === 'add-task') {
        if (!currentFilePath) return
        const taskId = makeUuid()
        await pool.query(
          'INSERT INTO collab_tasks (id, file_path, title, owner) VALUES (?,?,?,?)',
          [taskId, currentFilePath, msg.title, user.username]
        )
        const [tasks] = await pool.query('SELECT * FROM collab_tasks WHERE file_path = ? ORDER BY created_at ASC', [currentFilePath])
        broadcastToRoom(currentFilePath, { type: 'tasks', tasks: tasks.map(t => ({ ...t, done: !!t.done })) })
        broadcastToRoom(currentFilePath, { type: 'activity', text: `${user.username} 新增了任務: ${msg.title}` }, ws)

      } else if (msg.type === 'toggle-task') {
        if (!currentFilePath) return
        await pool.query('UPDATE collab_tasks SET done = NOT done WHERE id = ?', [msg.id])
        const [tasks] = await pool.query('SELECT * FROM collab_tasks WHERE file_path = ? ORDER BY created_at ASC', [currentFilePath])
        broadcastToRoom(currentFilePath, { type: 'tasks', tasks: tasks.map(t => ({ ...t, done: !!t.done })) })

      } else if (msg.type === 'delete-task') {
        if (!currentFilePath) return
        await pool.query('DELETE FROM collab_tasks WHERE id = ?', [msg.id])
        const [tasks] = await pool.query('SELECT * FROM collab_tasks WHERE file_path = ? ORDER BY created_at ASC', [currentFilePath])
        broadcastToRoom(currentFilePath, { type: 'tasks', tasks: tasks.map(t => ({ ...t, done: !!t.done })) })

      } else if (msg.type === 'add-note') {
        if (!currentFilePath) return
        const noteId = makeUuid()
        const note = { id: noteId, file_path: currentFilePath, author: user.username, text: msg.text, created_at: new Date().toISOString() }
        await pool.query(
          'INSERT INTO collab_notes (id, file_path, author, text) VALUES (?,?,?,?)',
          [noteId, currentFilePath, user.username, msg.text]
        )
        broadcastToRoom(currentFilePath, { type: 'note', note })
        broadcastToRoom(currentFilePath, { type: 'activity', text: `${user.username} 留下了批註` }, ws)
      }
    } catch (err) {
      console.error('Collab WS Error:', err)
    }
  })

  ws.on('close', () => {
    if (currentFilePath) {
      const room = fileRooms.get(currentFilePath)
      if (room) {
        for (const client of room) {
          if (client.ws === ws) {
            room.delete(client)
            break
          }
        }
        if (room.size === 0) fileRooms.delete(currentFilePath)
        else {
          broadcastToRoom(currentFilePath, { type: 'presence', users: getRoomUsers(currentFilePath) })
          broadcastToRoom(currentFilePath, { type: 'activity', text: `${user.username} 離開了文件` })
        }
      }
    }
  })
})

wss.on('connection', (ws, req) => {
  const url = new URL(req.url ?? '', `http://${req.headers.host}`)
  const token = url.searchParams.get('token') ?? ''
  let user
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (payload.twoFactor) throw new Error('需要完成二步驗證')
    user = payload
  } catch {
    ws.close(4001, '未授權')
    return
  }

  const userDir = path.join(FILES_DIR, user.username)
  let closed = false
  function cleanup() {
    if (closed) return
    closed = true
    ws.close()
  }

  if (pty) {
    // ── PTY 模式（互動式終端）──────────────────────────────
    const ptyProc = pty.spawn('bash', [], {
      name: 'xterm-256color',
      cols: 80,
      rows: 24,
      cwd: userDir,
      env: { ...process.env, TERM: 'xterm-256color', HOME: `/home/${user.username}` },
    })

    ptyProc.onData(data => { if (!closed) ws.send(data) })
    ptyProc.onExit(() => { cleanup() })

    ws.on('message', data => {
      if (closed) return
      const msg = data.toString()
      try {
        const parsed = JSON.parse(msg)
        if (parsed.type === 'resize' && parsed.cols > 0 && parsed.rows > 0) {
          ptyProc.resize(parsed.cols, parsed.rows)
          return
        }
      } catch {}
      ptyProc.write(msg)
    })

    ws.on('close', () => { try { ptyProc.kill() } catch {}; cleanup() })
    ws.on('error', () => { try { ptyProc.kill() } catch {}; cleanup() })
  } else {
    // ── 降級模式（無 PTY，bash -i）────────────────────────
    const child = spawn('bash', ['-i'], {
      cwd: userDir,
      env: { ...process.env, TERM: 'xterm-256color', HOME: `/home/${user.username}` },
      stdio: 'pipe',
    })

    child.stdout.on('data', d => { if (!closed) ws.send(d.toString()) })
    child.stderr.on('data', d => { if (!closed) ws.send(d.toString()) })
    child.on('exit', () => cleanup())
    child.on('error', () => cleanup())

    ws.on('message', data => {
      if (closed) return
      const msg = data.toString()
      try { if (JSON.parse(msg).type === 'resize') return } catch {}
      child.stdin.write(msg)
    })
    ws.on('close', () => { child.kill(); cleanup() })
    ws.on('error', () => { child.kill(); cleanup() })

    ws.send('\x1b[33m注意：node-pty 未安裝，使用基礎模式（無互動提示符）\x1b[0m\r\n')
  }
})

// ── 排程任務 ──────────────────────────────────────────────

const cronJobs = new Map()

function makeUuid() {
  const b = randomBytes(16)
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  return [b.slice(0,4),b.slice(4,6),b.slice(6,8),b.slice(8,10),b.slice(10)]
    .map(x => x.toString('hex')).join('-')
}

async function logRun(taskId, taskName, type, status, message, durationMs) {
  await pool.query(
    'INSERT INTO schedule_logs (task_id, task_name, type, status, message, duration_ms) VALUES (?,?,?,?,?,?)',
    [taskId, taskName, type, status, String(message ?? '').slice(0, 2000), durationMs]
  ).catch(console.error)
  await pool.query(
    'UPDATE scheduled_tasks SET last_run = NOW(), last_status = ? WHERE id = ?',
    [status, taskId]
  ).catch(console.error)
}

async function runBackupTask(task) {
  const { source_path: src, dest_path: dst, keep_count: keep } = task
  if (!src || !dst) throw new Error('缺少來源或目標路徑')
  await execAsync(`mkdir -p "${dst}"`)
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const outFile = path.join(dst, `backup-${ts}.tar.gz`)
  const srcDir  = path.dirname(src)
  const srcBase = path.basename(src)
  await execAsync(`tar -czf "${outFile}" -C "${srcDir}" "${srcBase}"`, { timeout: 600_000 })
  const { stdout } = await execAsync(`ls -t "${dst}"/backup-*.tar.gz 2>/dev/null || true`)
  const files = stdout.trim().split('\n').filter(Boolean)
  if (files.length > keep) {
    await Promise.all(files.slice(keep).map(f => execAsync(`rm -f "${f}"`).catch(() => {})))
  }
  return `備份完成：${outFile}`
}

async function runUpdateTask(task) {
  // Parse targets from source_path (stored as JSON array by the frontend)
  // Sudoers setup on Pi:
  //   echo "$(whoami) ALL=(ALL) NOPASSWD: /usr/bin/apt-get, /usr/bin/systemctl, /usr/sbin/nginx" \
  //     | sudo tee /etc/sudoers.d/vaultix-update && sudo chmod 440 /etc/sudoers.d/vaultix-update
  let targets
  try { targets = new Set(JSON.parse(task.source_path || '[]')) } catch { targets = new Set() }
  if (targets.size === 0) targets.add('apt')

  const parts = []
  const run = async (cmd, timeout = 180_000) => {
    const { stdout = '', stderr = '' } = await execAsync(cmd, { timeout })
    return (stdout + stderr).slice(-400) || '完成'
  }

  // Pre-fetch package list once if any apt-based service target is selected without full apt upgrade
  const aptServices = ['nginx', 'fail2ban', 'mariadb'].filter(s => targets.has(s))
  if (!targets.has('apt') && aptServices.length > 0) {
    await execAsync('sudo -n apt-get update -qq', { timeout: 60_000 }).catch(() => {})
  }

  if (targets.has('apt')) {
    try {
      parts.push('[系統套件] ' + await run('sudo -n apt-get update -qq && sudo -n apt-get upgrade -y 2>&1', 200_000))
    } catch (e) { parts.push('[系統套件] 失敗：' + String(e.message).slice(-200)) }
  }

  if (targets.has('pm2')) {
    try {
      // 智慧跳過：pm2 update 會重啟 daemon 並短暫中斷服務，但只有在 pm2 本體有新版時才需要。
      // 先同步比對版本，已是最新就完全不碰 daemon（0 中斷）；有新版才在背景執行更新腳本。
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

  if (targets.has('nginx')) {
    try {
      const cmd = targets.has('apt')
        ? 'sudo -n systemctl reload nginx 2>&1'
        : 'sudo -n apt-get install --only-upgrade -y nginx 2>&1 && sudo -n systemctl reload nginx 2>&1'
      parts.push('[nginx] ' + await run(cmd, 120_000))
    } catch (e) { parts.push('[nginx] 失敗：' + String(e.message).slice(-200)) }
  }

  if (targets.has('fail2ban')) {
    try {
      const cmd = targets.has('apt')
        ? 'sudo -n systemctl restart fail2ban 2>&1'
        : 'sudo -n apt-get install --only-upgrade -y fail2ban 2>&1 && sudo -n systemctl restart fail2ban 2>&1'
      parts.push('[fail2ban] ' + await run(cmd, 120_000))
    } catch (e) { parts.push('[fail2ban] 失敗：' + String(e.message).slice(-200)) }
  }

  if (targets.has('mariadb') && !targets.has('apt')) {
    try {
      parts.push('[mariadb] ' + await run('sudo -n apt-get install --only-upgrade -y mariadb-server 2>&1', 180_000))
    } catch (e) { parts.push('[mariadb] 失敗：' + String(e.message).slice(-200)) }
  }

  return parts.join('\n') || '更新完成'
}

async function runTask(task) {
  const start = Date.now()
  let status = 'success', message = ''
  try {
    if (task.type === 'backup')      message = await runBackupTask(task)
    else if (task.type === 'update') message = await runUpdateTask(task)
  } catch (err) {
    status  = 'error'
    message = err.message ?? '執行失敗'
  }
  await logRun(task.id, task.name, task.type, status, message, Date.now() - start)
}

function reloadCronJob(task) {
  if (cronJobs.has(task.id)) { cronJobs.get(task.id).stop(); cronJobs.delete(task.id) }
  if (!task.enabled || !cron.validate(task.cron_expr)) return
  const job = cron.schedule(task.cron_expr, () => runTask(task))
  cronJobs.set(task.id, job)
}

async function initScheduler() {
  try {
    const [tasks] = await pool.query('SELECT * FROM scheduled_tasks WHERE enabled = 1')
    for (const t of tasks) reloadCronJob({ ...t, enabled: !!t.enabled })
    console.log(`排程初始化：${tasks.length} 個任務`)
  } catch (err) { console.error('排程初始化失敗:', err.message) }
}

// ── 排程 CRUD ────────────────────────────────────────────

app.get('/api/schedule/tasks', authenticate, requireAdmin, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM scheduled_tasks ORDER BY created_at DESC')
  res.json(rows.map(r => ({
    ...r, enabled: !!r.enabled,
    last_run:   r.last_run?.toISOString?.()   ?? null,
    created_at: r.created_at?.toISOString?.() ?? null,
  })))
})

app.post('/api/schedule/tasks', authenticate, requireAdmin, async (req, res) => {
  const { name, type, cron_expr, source_path, dest_path, keep_count, enabled } = req.body
  if (!name || !type || !cron_expr) return res.status(400).json({ error: '缺少必填欄位' })
  if (!['backup','update'].includes(type)) return res.status(400).json({ error: '無效的任務類型' })
  if (!cron.validate(cron_expr)) return res.status(400).json({ error: '無效的 cron 表達式' })
  const id = makeUuid()
  const en = enabled !== false ? 1 : 0
  await pool.query(
    'INSERT INTO scheduled_tasks (id,name,type,enabled,cron_expr,source_path,dest_path,keep_count) VALUES (?,?,?,?,?,?,?,?)',
    [id, name, type, en, cron_expr, source_path ?? null, dest_path ?? null, keep_count ?? 7]
  )
  const task = { id, name, type, enabled: !!en, cron_expr, source_path: source_path ?? null, dest_path: dest_path ?? null, keep_count: keep_count ?? 7, last_run: null, last_status: null }
  reloadCronJob(task)
  res.json(task)
})

app.put('/api/schedule/tasks/:id', authenticate, requireAdmin, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM scheduled_tasks WHERE id = ?', [req.params.id])
  if (!rows[0]) return res.status(404).json({ error: '任務不存在' })
  const t = rows[0]
  const { name, cron_expr, source_path, dest_path, keep_count, enabled } = req.body
  if (cron_expr && !cron.validate(cron_expr)) return res.status(400).json({ error: '無效的 cron 表達式' })
  const upd = {
    name:        name        ?? t.name,
    cron_expr:   cron_expr   ?? t.cron_expr,
    source_path: source_path !== undefined ? source_path : t.source_path,
    dest_path:   dest_path   !== undefined ? dest_path   : t.dest_path,
    keep_count:  keep_count  ?? t.keep_count,
    enabled:     enabled     !== undefined ? (enabled ? 1 : 0) : t.enabled,
  }
  await pool.query(
    'UPDATE scheduled_tasks SET name=?,cron_expr=?,source_path=?,dest_path=?,keep_count=?,enabled=? WHERE id=?',
    [upd.name, upd.cron_expr, upd.source_path, upd.dest_path, upd.keep_count, upd.enabled, t.id]
  )
  const updated = { ...t, ...upd, enabled: !!upd.enabled }
  reloadCronJob(updated)
  res.json(updated)
})

app.delete('/api/schedule/tasks/:id', authenticate, requireAdmin, async (req, res) => {
  const [rows] = await pool.query('SELECT id FROM scheduled_tasks WHERE id = ?', [req.params.id])
  if (!rows[0]) return res.status(404).json({ error: '任務不存在' })
  if (cronJobs.has(req.params.id)) { cronJobs.get(req.params.id).stop(); cronJobs.delete(req.params.id) }
  await pool.query('DELETE FROM scheduled_tasks WHERE id = ?', [req.params.id])
  res.json({ ok: true })
})

app.post('/api/schedule/tasks/:id/run', authenticate, requireAdmin, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM scheduled_tasks WHERE id = ?', [req.params.id])
  if (!rows[0]) return res.status(404).json({ error: '任務不存在' })
  res.json({ ok: true, message: '已開始執行，請稍後查看記錄' })
  runTask({ ...rows[0], enabled: !!rows[0].enabled }).catch(err => console.error('手動執行失敗:', err.message))
})

app.get('/api/schedule/logs', authenticate, requireAdmin, async (req, res) => {
  const { limit = 100, type, status } = req.query
  let q = 'SELECT * FROM schedule_logs WHERE 1=1'
  const params = []
  if (type)   { q += ' AND type = ?';   params.push(type) }
  if (status) { q += ' AND status = ?'; params.push(status) }
  q += ' ORDER BY created_at DESC LIMIT ?'
  params.push(Math.min(Number(limit), 500))
  const [rows] = await pool.query(q, params)
  res.json(rows.map(r => ({ ...r, created_at: r.created_at?.toISOString?.() ?? null })))
})

app.delete('/api/schedule/logs', authenticate, requireAdmin, async (_req, res) => {
  await pool.query('DELETE FROM schedule_logs')
  res.json({ ok: true })
})

// ── yt-dlp 媒體下載 ───────────────────────────────────────

const ytdlJobs = new Map()
const YTDL_PATH_EXT   = '/usr/local/bin:/home/pi/.local/bin:/usr/bin:/bin'
const YTDL_COOKIES_DIR  = path.join(__dirname, 'data', 'cookies')
const YTDL_COOKIES_FILE = path.join(YTDL_COOKIES_DIR, 'ytdl_cookies.txt')

async function startDouyinYtdl(job) {
  const outTpl = path.join(job.destDir, '%(title)s.%(ext)s')
  const args = [
    '--newline', '--no-playlist', '--socket-timeout', '30', '-o', outTpl,
    '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    '--merge-output-format', 'mp4',
    '--add-header', 'Referer:https://www.douyin.com',
    '--add-header', 'Accept-Language:zh-CN,zh;q=0.9',
  ]

  const hasCookies = await fs.access(YTDL_COOKIES_FILE).then(() => true).catch(() => false)
  if (hasCookies) {
    args.push('--cookies', YTDL_COOKIES_FILE)
  } else {
    job.status = 'error'
    job.error = '抖音目前需要 Cookies 才能下載，請至設定頁面上傳 cookies.txt（可用瀏覽器擴充功能 Get cookies.txt LOCALLY 匯出）'
    throw new Error(job.error)
  }

  args.push('--', job.url)

  return new Promise((resolve, reject) => {
    const proc = spawn('yt-dlp', args, {
      env: { ...process.env, PATH: `${process.env.PATH ?? ''}:${YTDL_PATH_EXT}` },
    })
    job.proc = proc
    let stderr = ''

    function handleLine(text) {
      const pm = text.match(/\s+([\d.]+)%/)
      if (pm) job.progress = Math.min(99, Math.round(parseFloat(pm[1])))
      const dm = text.match(/(?:Destination|Merging formats into):\s+"?(.+?)"?\s*$/)
      if (dm) job.filename = path.basename(dm[1].trim())
      job.output = (job.output + text).slice(-4000)
    }

    proc.stdout.on('data', d => handleLine(d.toString()))
    proc.stderr.on('data', d => {
      const text = d.toString()
      stderr += text
      handleLine(text)
    })
    proc.on('close', code => {
      job.proc = null
      if (code === 0) { job.status = 'done'; job.progress = 100; resolve() }
      else {
        job.status = 'error'
        const combined = stderr + job.output
        if (combined.includes('cookies') || combined.includes('Fresh cookies') || combined.includes('logged in')) {
          job.error = '抖音 Cookies 已失效或格式錯誤，請重新從已登入的瀏覽器匯出 cookies.txt'
        } else if (combined.includes('JSON') || combined.includes('ExtractorError') || combined.includes('parse')) {
          job.error = 'yt-dlp 版本過舊，請在 Pi 執行：pip install -U yt-dlp，再重試'
        } else {
          job.error = stderr.slice(-500) || 'yt-dlp 下載失敗'
        }
        reject(new Error(job.error))
      }
    })
    proc.on('error', err => { job.proc = null; job.status = 'error'; job.error = err.message; reject(err) })
  })
}

async function startDouyinDownload(job) {
  job.status = 'running'
  const ua = 'com.ss.android.ugc.aweme/160101 (Linux; U; Android 9; zh_CN; Pixel 4; Build/PQ3A.190801.002)'
  try {
    // Resolve short URL → get aweme_id (supports /video/, /note/, and short links)
    let awemeId = job.url.match(/\/video\/(\d+)/)?.[1] || job.url.match(/\/note\/(\d+)/)?.[1]
    if (!awemeId) {
      const { stdout: redir } = await execAsync(
        `curl -sL -o /dev/null -w "%{url_effective}" "${job.url}"`,
        { timeout: 15000 }
      )
      awemeId = redir.match(/\/video\/(\d+)/)?.[1] || redir.match(/\/note\/(\d+)/)?.[1]
    }
    if (!awemeId) throw new Error('無法解析 aweme_id（影片或圖文 ID）')
    job.output += `aweme_id: ${awemeId}\n`

    let aweme = null
    try {
      const { stdout: apiOut } = await execAsync(
        `curl -s "https://api.amemv.com/aweme/v1/feed/?aweme_id=${awemeId}&aid=1128" -H "User-Agent: ${ua}"`,
        { timeout: 15000 }
      )
      aweme = JSON.parse(apiOut)?.aweme_list?.[0]
    } catch {
      job.output += 'API 解析失敗，改用 yt-dlp 下載\n'
    }
    if (!aweme) {
      job.output += 'API 未回傳有效內容，改用 yt-dlp 下載\n'
      return startDouyinYtdl(job)
    }

    job.title = (aweme?.desc || String(awemeId)).slice(0, 100)
    const safeName = job.title.replace(/[/\\:*?"<>|]/g, '_').slice(0, 60)

    // ── 圖文 (image post) ──
    const images = aweme?.image_post_info?.images
    if (images?.length) {
      job.output += `圖文貼文，共 ${images.length} 張圖片\n`
      for (let i = 0; i < images.length; i++) {
        const imgUrl = images[i]?.display_image?.url_list?.[0]
          || images[i]?.owner_watermark_image?.url_list?.[0]
        if (!imgUrl) { job.output += `第 ${i + 1} 張無法取得連結，跳過\n`; continue }
        const filename = `${safeName}_${awemeId}_${String(i + 1).padStart(2, '0')}.jpg`
        job.filename = filename
        job.output += `下載第 ${i + 1}/${images.length} 張\n`
        await new Promise((resolve, reject) => {
          const proc = spawn('wget', ['-q', '--show-progress',
            `--user-agent=${ua}`, '-O', path.join(job.destDir, filename), imgUrl])
          proc.stderr.on('data', d => { job.output = (job.output + d.toString()).slice(-4000) })
          proc.on('close', code => {
            if (code === 0) resolve()
            else reject(new Error(`wget 退出碼 ${code}`))
          })
          proc.on('error', reject)
        })
        job.progress = Math.round(((i + 1) / images.length) * 100)
      }
      job.status = 'done'; job.progress = 100
      return
    }

    // ── 影片 ──
    const videoUrl = aweme?.video?.play_addr?.url_list?.[0]
    if (!videoUrl) throw new Error('API 未回傳影片連結，也未偵測到圖文格式')

    job.output += `取得影片連結成功\n`
    const filename = `${safeName}_${awemeId}.mp4`
    job.filename = filename

    return new Promise((resolve, reject) => {
      const proc = spawn('wget', ['-q', '--show-progress',
        `--user-agent=${ua}`, '-O', path.join(job.destDir, filename), videoUrl])
      job.proc = proc
      proc.stderr.on('data', d => {
        const text = d.toString()
        const m = text.match(/([\d.]+)%/)
        if (m) job.progress = Math.min(99, Math.round(parseFloat(m[1])))
        job.output = (job.output + text).slice(-4000)
      })
      proc.on('close', code => {
        job.proc = null
        if (code === 0) { job.status = 'done'; job.progress = 100; resolve() }
        else { job.status = 'error'; job.error = '下載失敗'; reject(new Error(job.error)) }
      })
      proc.on('error', err => { job.proc = null; job.status = 'error'; job.error = err.message; reject(err) })
    })
  } catch (err) {
    job.status = 'error'; job.error = err.message; throw err
  }
}

async function startNetflixDownload(job) {
  job.status = 'running'
  const hasCookies = await fs.access(YTDL_COOKIES_FILE).then(() => true).catch(() => false)
  if (!hasCookies) {
    job.status = 'error'
    job.error = 'Netflix 需要 cookies。請在瀏覽器登入 Netflix → 用 Get cookies.txt LOCALLY 擴充功能匯出 cookies.txt → 上傳。注意：Netflix 有 DRM 保護，yt-dlp 最高僅能下載 540p。'
    throw new Error(job.error)
  }
  const outTpl = path.join(job.destDir, '%(title)s.%(ext)s')
  const nfq = job.quality === 'best' ? '540' : String(Math.min(parseInt(job.quality) || 540, 540))
  const args = [
    '--newline', '--no-playlist', '--socket-timeout', '30', '-o', outTpl,
    '--cookies', YTDL_COOKIES_FILE,
    '--add-header', 'User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    '--add-header', 'Accept-Language:en-US,en;q=0.9',
    '-f', `bestvideo[height<=${nfq}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${nfq}]+bestaudio/best[height<=${nfq}][ext=mp4]/best[height<=${nfq}]`,
    '--merge-output-format', 'mp4',
    '--', job.url,
  ]

  return new Promise((resolve, reject) => {
    const proc = spawn('yt-dlp', args, {
      env: { ...process.env, PATH: `${process.env.PATH ?? ''}:${YTDL_PATH_EXT}` },
    })
    job.proc = proc

    const onData = data => {
      const text = data.toString()
      const pm = text.match(/\[download\]\s+([\d.]+)%/)
      if (pm) job.progress = Math.min(99, Math.round(parseFloat(pm[1])))
      const dm = text.match(/(?:Destination|Merging formats into):\s+"?(.+?)"?\s*$/)
      if (dm) job.filename = path.basename(dm[1].trim())
      job.output = (job.output + text).slice(-4000)
    }
    proc.stdout.on('data', onData)
    proc.stderr.on('data', onData)
    proc.on('close', (code, signal) => {
      job.proc = null
      if (code === 0) {
        job.status = 'done'; job.progress = 100
        if (!job.title && job.filename) job.title = job.filename.replace(/\.[^.]+$/, '')
        resolve()
      } else {
        job.status = 'error'
        const output = job.output.trim().slice(-800)
        if (output.includes('Unsupported URL') || output.includes('generic') || output.includes('Falling back')) {
          job.error = 'Netflix 不支援此連結。可能原因：1) Pi 上的 yt-dlp 版本過舊，請執行 pip install -U yt-dlp 2) cookies 已失效，請重新匯出上傳'
        } else if (output.includes('HTTP Error') || output.includes('403') || output.includes('401')) {
          job.error = 'Netflix 拒絕存取，cookies 可能已失效，請重新匯出上傳'
        } else {
          job.error = output || (signal ? `收到信號 ${signal}` : `退出碼 ${code}`)
        }
        reject(new Error(job.error))
      }
    })
    proc.on('error', err => {
      job.proc = null; job.status = 'error'
      job.error = err.code === 'ENOENT' ? 'yt-dlp 未安裝，請在 Pi 執行：pip install yt-dlp' : err.message
      reject(err)
    })
  })
}

async function startYtdlJob(job) {
  if (job.url.includes('douyin.com')) return startDouyinDownload(job)
  if (job.url.includes('netflix.com')) return startNetflixDownload(job)
  job.status = 'running'
  const outTpl = path.join(job.destDir, '%(title)s.%(ext)s')
  const args = ['--newline', '--no-playlist', '--socket-timeout', '30', '-o', outTpl]

  if (job.format === 'mp3') {
    args.push('-x', '--audio-format', 'mp3')
    args.push('--audio-quality', job.quality === 'best' ? '0' : `${job.quality}K`)
  } else if (job.format === 'image') {
    // Let yt-dlp pick the best available (images, GIFs, or video thumbnail fallback)
    args.push('--write-thumbnail', '--convert-thumbnails', 'jpg', '--skip-download')
    // For image-hosting / social media carousel posts yt-dlp treats as images directly
    args.push('-f', 'best')
  } else {
    const fq = job.quality === 'best'
      ? 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best[ext=mp4]/best'
      : `bestvideo[height<=${job.quality}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${job.quality}]+bestaudio/best[height<=${job.quality}][ext=mp4]/best[height<=${job.quality}]/best`
    args.push('-f', fq, '--merge-output-format', 'mp4')
  }

  // Pass cookies file if present — required by Douyin, Twitter/X, and other gated sites
  const hasCookies = await fs.access(YTDL_COOKIES_FILE).then(() => true).catch(() => false)
  if (hasCookies) args.push('--cookies', YTDL_COOKIES_FILE)

  args.push('--', job.url)

  return new Promise((resolve, reject) => {
    const proc = spawn('yt-dlp', args, {
      env: { ...process.env, PATH: `${process.env.PATH ?? ''}:${YTDL_PATH_EXT}` },
    })
    job.proc = proc

    const onData = data => {
      const text = data.toString()
      const pm = text.match(/\[download\]\s+([\d.]+)%/)
      if (pm) job.progress = Math.min(99, Math.round(parseFloat(pm[1])))
      const dm = text.match(/(?:Destination|Merging formats into):\s+"?(.+?)"?\s*$/)
      if (dm) job.filename = path.basename(dm[1].trim())
      const tm = text.match(/\[(?:youtube|info)\].*?:\s+(.+)/)
      if (tm && !job.title) job.title = tm[1].trim()
      job.output = (job.output + text).slice(-4000)
    }
    proc.stdout.on('data', onData)
    proc.stderr.on('data', onData)
    proc.on('close', (code, signal) => {
      job.proc = null
      if (code === 0) {
        job.status = 'done'
        job.progress = 100
        if (!job.title && job.filename) job.title = job.filename.replace(/\.[^.]+$/, '')
        resolve()
      } else {
        job.status = 'error'
        const detail = job.output.trim().slice(-800)
        const _isNetflix = job.url.includes('netflix.com')
        if (_isNetflix && (detail.includes('Unsupported URL') || detail.includes('generic') || detail.includes('Falling back'))) {
          job.error = 'Netflix 不支援此連結。原因：1) Pi 上的 yt-dlp 版本過舊，請執行 pip install -U yt-dlp 2) cookies 已失效或格式錯誤，請重新匯出上傳'
        } else if (_isNetflix && (detail.includes('HTTP Error') || detail.includes('403') || detail.includes('401'))) {
          job.error = 'Netflix 拒絕存取，cookies 可能已失效，請重新匯出上傳'
        } else {
          job.error = detail || (signal ? `收到信號 ${signal}` : `退出碼 ${code}`)
        }
        reject(new Error(job.error))
      }
    })
    proc.on('error', err => {
      job.proc = null
      job.status = 'error'
      job.error = err.code === 'ENOENT'
        ? 'yt-dlp 未安裝，請在 Pi 執行：pip install yt-dlp'
        : err.message
      reject(err)
    })
  })
}

function serializeJob(j) {
  return {
    id: j.id, status: j.status, progress: j.progress,
    title: j.title, filename: j.filename, error: j.error,
    format: j.format, quality: j.quality, url: j.url, destPath: j.destPath,
    createdAt: j.createdAt.toISOString(),
  }
}

app.post('/api/ytdl/start', authenticate, async (req, res) => {
  let { url, format = 'mp3', quality = 'best', destPath = '' } = req.body ?? {}
  if (!url) return res.status(400).json({ error: '缺少 URL' })
  // Extract URL from share text (e.g. Douyin / TikTok share paste)
  const urlMatch = String(url).match(/https?:\/\/[^\s　]+/)
  if (urlMatch) url = urlMatch[0].replace(/[,，。.!！?？\s]+$/, '')
  if (!url.startsWith('http')) return res.status(400).json({ error: '無法識別有效 URL，請直接貼上連結' })
  if (!['mp3', 'mp4', 'image'].includes(format)) return res.status(400).json({ error: '格式無效' })
  let destDir
  try {
    destDir = safePath(req.user.username, destPath)
    await fs.mkdir(destDir, { recursive: true })
  } catch { return res.status(400).json({ error: '目標路徑無效' }) }

  const jobId = makeUuid()
  const job = {
    id: jobId, userId: req.user.uid, username: req.user.username,
    url, format, quality, destDir, destPath,
    status: 'pending', progress: 0, title: '', filename: '', error: '', output: '',
    proc: null, createdAt: new Date(),
  }
  ytdlJobs.set(jobId, job)
  if (ytdlJobs.size > 100) {
    const old = [...ytdlJobs.entries()]
      .filter(([, j]) => j.status !== 'running')
      .sort((a, b) => a[1].createdAt - b[1].createdAt)[0]
    if (old) ytdlJobs.delete(old[0])
  }
  res.json({ jobId })
  startYtdlJob(job).catch(() => {})
})

app.get('/api/ytdl/jobs', authenticate, (req, res) => {
  const jobs = [...ytdlJobs.values()]
    .filter(j => j.userId === req.user.uid)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 30)
    .map(serializeJob)
  res.json(jobs)
})

app.get('/api/ytdl/status/:id', authenticate, (req, res) => {
  const j = ytdlJobs.get(req.params.id)
  if (!j || j.userId !== req.user.uid) return res.status(404).json({ error: '找不到任務' })
  res.json(serializeJob(j))
})

app.delete('/api/ytdl/jobs/:id', authenticate, (req, res) => {
  const j = ytdlJobs.get(req.params.id)
  if (!j || j.userId !== req.user.uid) return res.status(404).json({ error: '找不到任務' })
  if (j.proc && j.status === 'running') {
    try { j.proc.kill('SIGTERM') } catch {}
    j.status = 'error'; j.error = '已手動取消'
  }
  ytdlJobs.delete(req.params.id)
  res.json({ ok: true })
})

// ── yt-dlp Cookie 管理 ───────────────────────────────────

app.get('/api/ytdl/cookies', authenticate, async (_req, res) => {
  const exists = await fs.access(YTDL_COOKIES_FILE).then(() => true).catch(() => false)
  res.json({ exists })
})

// Generate Netscape cookies.txt from Twitter/X auth_token + ct0
app.post('/api/ytdl/cookies/twitter', authenticate, requireAdmin, express.json(), async (req, res) => {
  const { auth_token, ct0 } = req.body ?? {}
  if (!auth_token || !ct0) return res.status(400).json({ error: '缺少 auth_token 或 ct0' })
  try {
    await fs.mkdir(YTDL_COOKIES_DIR, { recursive: true })
    const netscape = [
      '# Netscape HTTP Cookie File',
      `.twitter.com\tTRUE\t/\tTRUE\t0\tauth_token\t${auth_token}`,
      `.twitter.com\tTRUE\t/\tTRUE\t0\tct0\t${ct0}`,
      `.x.com\tTRUE\t/\tTRUE\t0\tauth_token\t${auth_token}`,
      `.x.com\tTRUE\t/\tTRUE\t0\tct0\t${ct0}`,
    ].join('\n')
    await fs.writeFile(YTDL_COOKIES_FILE, netscape, 'utf8')
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Upload a full cookies.txt (Netscape format from browser extension, works for Douyin etc.)
app.post('/api/ytdl/cookies/upload', authenticate, requireAdmin, upload.single('cookies'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: '未提供檔案' })
  try {
    await fs.mkdir(YTDL_COOKIES_DIR, { recursive: true })
    await fs.rename(req.file.path, YTDL_COOKIES_FILE).catch(async e => {
      if (e.code === 'EXDEV') {
        await fs.copyFile(req.file.path, YTDL_COOKIES_FILE)
        await fs.unlink(req.file.path)
      } else throw e
    })
    res.json({ ok: true })
  } catch (err) {
    await fs.unlink(req.file.path).catch(() => {})
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/ytdl/cookies', authenticate, requireAdmin, async (_req, res) => {
  await fs.rm(YTDL_COOKIES_FILE, { force: true }).catch(() => {})
  res.json({ ok: true })
})

// ── RAID ─────────────────────────────────────────────────────────────────────

function parseMdstat(content) {
  const arrays = []
  const lines = content.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const hm = line.match(/^(md\d+)\s*:\s*([\w\s()+-]+?)\s+(raid\d+|linear|multipath)\s+(.*)$/)
    if (hm) {
      const arr = {
        name: hm[1],
        state: hm[2].trim().replace(/\(.*?\)/g, '').trim(),
        level: hm[3],
        devices: [],
        totalDevices: 0,
        activeDevices: 0,
        deviceStates: '',
        sizeBlocks: 0,
      }
      const devRegex = /(\w+)\[(\d+)\](\(\w\))?/g
      let dm
      while ((dm = devRegex.exec(hm[4])) !== null) {
        arr.devices.push({ name: dm[1], index: parseInt(dm[2]), state: dm[3] ? dm[3][1] : 'U' })
      }
      i++
      while (i < lines.length && /^\s+/.test(lines[i])) {
        const sub = lines[i].trim()
        const sm = sub.match(/^(\d+) blocks.*?\[(\d+)\/(\d+)\]\s*\[([U_F]+)\]/)
        if (sm) {
          arr.sizeBlocks    = parseInt(sm[1])
          arr.totalDevices  = parseInt(sm[2])
          arr.activeDevices = parseInt(sm[3])
          arr.deviceStates  = sm[4]
        }
        const pm = sub.match(/(?:recovery|resync)\s*=\s*([\d.]+)%.*finish=([\d.]+)min\s+speed=(\S+)/)
        if (pm) {
          arr.syncPct    = parseFloat(pm[1])
          arr.syncFinish = `${Math.round(parseFloat(pm[2]))} 分鐘`
          arr.syncSpeed  = pm[3]
          arr.state      = sub.includes('recovery') ? 'recovering' : 'resyncing'
        }
        i++
      }
      if (!arr.syncPct && arr.totalDevices > 0 && arr.activeDevices < arr.totalDevices)
        arr.state = 'degraded'
      else if (!arr.syncPct && (arr.state.includes('active') || arr.state === ''))
        arr.state = 'clean'
      arrays.push(arr)
    } else {
      i++
    }
  }
  return arrays
}

const VALID_DEV = /^\/dev\/[a-z]{1,10}\d*$/
const VALID_ARR = /^md\d{1,3}$/

app.get('/api/raid/status', authenticate, async (req, res) => {
  let mdadmAvailable = false
  try { await execAsync('which mdadm 2>/dev/null'); mdadmAvailable = true } catch {}
  if (!mdadmAvailable) return res.json({ arrays: [], disks: [], mdadmAvailable: false })

  let mdstat = ''
  try { mdstat = await fs.readFile('/proc/mdstat', 'utf8') } catch {}
  const arrays = parseMdstat(mdstat)

  let disks = []
  try {
    const { stdout } = await execAsync('lsblk -J -o NAME,SIZE,TYPE,MOUNTPOINT,MODEL 2>/dev/null')
    disks = JSON.parse(stdout).blockdevices ?? []
  } catch {}

  res.json({ arrays, disks, mdadmAvailable: true })
})

app.post('/api/raid/action', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: '需要管理員權限' })
  const { array, action, device } = req.body ?? {}
  if (!array || !VALID_ARR.test(array)) return res.status(400).json({ error: '無效的陣列名稱' })
  if (device && !VALID_DEV.test(device)) return res.status(400).json({ error: '無效的裝置路徑' })

  let cmd
  switch (action) {
    case 'add':
      if (!device) return res.status(400).json({ error: '缺少裝置' })
      cmd = `sudo mdadm /dev/${array} --add ${device}`
      break
    case 'remove':
    case 'fail':
      if (!device) return res.status(400).json({ error: '缺少裝置' })
      cmd = `sudo mdadm /dev/${array} --fail ${device} && sudo mdadm /dev/${array} --remove ${device}`
      break
    case 'stop':
      cmd = `sudo mdadm --stop /dev/${array}`
      break
    default:
      return res.status(400).json({ error: '不支援的操作' })
  }

  try {
    await execAsync(cmd, { timeout: 30000 })
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message ?? '操作失敗' })
  }
})

app.post('/api/raid/create', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: '需要管理員權限' })
  const { name, level, devices } = req.body ?? {}
  if (!name || !VALID_ARR.test(name)) return res.status(400).json({ error: '無效的陣列名稱（應為 md0~md127）' })
  if (![1, 5, 6].includes(Number(level))) return res.status(400).json({ error: '不支援的 RAID 等級（支援 1/5/6）' })
  if (!Array.isArray(devices) || devices.length < 2) return res.status(400).json({ error: '至少需要 2 個磁碟' })
  for (const d of devices) {
    if (!VALID_DEV.test(d)) return res.status(400).json({ error: `無效的裝置路徑：${d}` })
  }
  const minDisks = { 1: 2, 5: 3, 6: 4 }
  if (devices.length < (minDisks[Number(level)] ?? 2))
    return res.status(400).json({ error: `RAID ${level} 至少需要 ${minDisks[Number(level)]} 個磁碟` })

  const devStr = devices.join(' ')
  const cmd = `sudo mdadm --create /dev/${name} --level=${level} --raid-devices=${devices.length} ${devStr} --run --force`
  try {
    await execAsync(cmd, { timeout: 120000 })
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message ?? '建立失敗' })
  }
})

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

// ── OCR ──────────────────────────────────────────────────────────────────────
const ALLOWED_OCR_LANGS = new Set([
  'chi_tra', 'chi_sim', 'eng', 'jpn',
  'chi_tra+eng', 'chi_sim+eng', 'jpn+eng',
])

app.post('/api/ocr', authenticate, async (req, res) => {
  const { path: relPath, lang = 'chi_tra+eng' } = req.body ?? {}
  if (!relPath) return res.status(400).json({ error: '缺少 path' })
  if (!ALLOWED_OCR_LANGS.has(lang)) return res.status(400).json({ error: '不支援的語言' })

  let fullPath
  try {
    fullPath = safePath(req.user.username, relPath)
    await fs.access(fullPath)
  } catch {
    return res.status(404).json({ error: '找不到檔案' })
  }

  try {
    const text = await new Promise((resolve, reject) => {
      // Use spawn (not exec) to avoid shell injection with arbitrary file paths
      const proc = spawn('tesseract', [fullPath, 'stdout', '-l', lang])
      let out = ''
      proc.stdout.on('data', d => { out += d })
      proc.on('close', code => {
        if (code === 0) resolve(out)
        else reject(new Error(`Tesseract 返回錯誤碼 ${code}`))
      })
      proc.on('error', err => {
        if (err.code === 'ENOENT') {
          reject(new Error('Tesseract 未安裝，請在 Pi 執行：sudo apt install tesseract-ocr tesseract-ocr-chi-tra'))
        } else {
          reject(err)
        }
      })
      // 30s timeout
      setTimeout(() => { try { proc.kill() } catch {} ; reject(new Error('OCR 逾時（超過 30 秒）')) }, 30000)
    })
    res.json({ text: String(text).trim() })
  } catch (e) {
    const msg = e.message ?? '辨識失敗'
    res.status(msg.includes('未安裝') ? 503 : 500).json({ error: msg })
  }
})

await initScheduler()

server.listen(PORT, () => {
  console.log(`CasaOS NAS backend running on port ${PORT}`)
  // 通知 pm2 此 process 已準備好接請求（配合 pm2 reload --wait-ready 使用）
  if (process.send) process.send('ready')
})

// Graceful shutdown：讓 pm2 reload 能等現有請求跑完再殺舊 process
process.on('SIGTERM', () => {
  // 停止所有 cron job
  for (const job of cronJobs.values()) job.stop()
  cronJobs.clear()
  // 立即斷開所有 WebSocket 連線（避免 server.close() 等待 ws 客戶端）
  for (const ws of wss.clients) ws.terminate()
  for (const ws of collabWss.clients) ws.terminate()
  wss.close()
  collabWss.close()
  // 關閉 HTTP server 後再結束 DB pool
  server.close(() => {
    pool.end().catch(() => {})
    process.exit(0)
  })
  // 最多等 5 秒，避免卡死
  setTimeout(() => process.exit(0), 5000)
})
