require('dotenv').config()
const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const { v2: cloudinary } = require('cloudinary')
const db = require('./db')
const { authenticate } = require('./firebaseAuth')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express()

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://p-chats-26652.web.app',
  'https://p-chats-26652.firebaseapp.com',
  ...(process.env.EXTRA_ORIGINS ? process.env.EXTRA_ORIGINS.split(',') : []),
]

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
}))
app.use(express.json({ limit: '256kb' }))

// Returns a signed upload credential — file never touches this server
app.get('/api/upload-credentials', (_req, res) => {
  const timestamp = Math.round(Date.now() / 1000)
  const folder = 'p-chats'
  const toSign = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
  const signature = crypto.createHash('sha256').update(toSign).digest('hex')

  res.json({
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
  })
})

// ── Message text cache ──────────────────────────────────────────────────────
// Encrypted message bodies (ct/nonce/mac) live here, keyed by the same doc id
// the client also writes as a metadata-only signal doc in Firestore. Firestore
// keeps giving realtime push; this server is the only place the ciphertext sits,
// and it's temporary — burn timers are enforced here so a closed tab can't skip it.

const BURN_MS = { '1m': 60_000, '3m': 180_000, '5m': 300_000 }

function chatIdFor(a, b) { return [a, b].sort().join('_') }

const insertStmt = db.prepare(`
  INSERT INTO messages (id, chat_id, from_uid, to_uid, ct, nonce, mac, burn_timer, created_at, expire_at)
  VALUES (@id, @chatId, @from, @to, @ct, @nonce, @mac, @burnTimer, @createdAt, @expireAt)
`)
const getStmt = db.prepare('SELECT * FROM messages WHERE id = ?')
const updateStmt = db.prepare('UPDATE messages SET ct = ?, nonce = ?, mac = ? WHERE id = ?')
const deleteStmt = db.prepare('DELETE FROM messages WHERE id = ?')
const sweepStmt = db.prepare('DELETE FROM messages WHERE expire_at IS NOT NULL AND expire_at <= ?')

app.post('/api/messages', authenticate, (req, res) => {
  const { to, ct, nonce, mac, burnTimer } = req.body || {}
  if (!to || !ct || !nonce || !mac) return res.status(400).json({ error: 'Missing fields' })

  const from = req.uid
  const bt = ['1m', '3m', '5m', 'exit'].includes(burnTimer) ? burnTimer : 'off'
  const createdAt = Date.now()
  const expireAt = BURN_MS[bt] ? createdAt + BURN_MS[bt] : null
  const id = crypto.randomUUID()

  insertStmt.run({ id, chatId: chatIdFor(from, to), from, to, ct, nonce, mac, burnTimer: bt, createdAt, expireAt })
  res.json({ id, timestamp: createdAt })
})

app.get('/api/messages/:id', authenticate, (req, res) => {
  const row = getStmt.get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  if (row.from_uid !== req.uid && row.to_uid !== req.uid) return res.status(403).json({ error: 'Forbidden' })
  res.json({ ct: row.ct, nonce: row.nonce, mac: row.mac })
})

app.put('/api/messages/:id', authenticate, (req, res) => {
  const row = getStmt.get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  if (row.from_uid !== req.uid) return res.status(403).json({ error: 'Forbidden' })
  const { ct, nonce, mac } = req.body || {}
  if (!ct || !nonce || !mac) return res.status(400).json({ error: 'Missing fields' })
  updateStmt.run(ct, nonce, mac, req.params.id)
  res.json({ ok: true })
})

app.delete('/api/messages/:id', authenticate, (req, res) => {
  const row = getStmt.get(req.params.id)
  if (!row) return res.json({ ok: true }) // already gone — recall/exit-cleanup races are fine
  if (row.from_uid !== req.uid && row.to_uid !== req.uid) return res.status(403).json({ error: 'Forbidden' })
  deleteStmt.run(req.params.id)
  res.json({ ok: true })
})

setInterval(() => {
  try { sweepStmt.run(Date.now()) } catch (e) { console.error('[sweep] failed', e) }
}, 15_000)

app.get('/health', (_req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`P-Chats backend listening on port ${PORT}`))
