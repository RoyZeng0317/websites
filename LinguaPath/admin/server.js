const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');
const path    = require('path');
const fs = require('fs');
const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// ── Firebase Admin ────────────────────────────────────────────────────────────
let firebaseReady = false;
let fbAuth = null;
try {
  const saPath    = path.join(__dirname, 'serviceAccount.json');
  const projectId = process.env.FIREBASE_PROJECT_ID || 'linugapath';
  if (fs.existsSync(saPath)) {
    initializeApp({ credential: cert(require(saPath)), projectId });
  } else {
    initializeApp({ credential: applicationDefault(), projectId });
  }
  fbAuth = getAuth();
  firebaseReady = true;
  console.log('Firebase Admin initialised');
} catch (e) {
  console.warn('Firebase Admin not available:', e.message);
}

const app  = express();
const PORT = process.env.PORT || 3002;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname), { etag: false, lastModified: false, setHeaders: res => res.set('Cache-Control', 'no-store') }));

// ── DB Pool ──────────────────────────────────────────────────────────────────
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306'),
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASS     || '',
  database: process.env.DB_NAME     || 'linguapath',
  waitForConnections: true,
  connectionLimit: 5
});

// ── Routes ───────────────────────────────────────────────────────────────────

// GET /api/vocab?cefr=A1&category=food&q=apple
app.get('/api/vocab', async (req, res) => {
  try {
    let sql    = 'SELECT * FROM vocabulary WHERE 1=1';
    const params = [];
    if (req.query.cefr)     { sql += ' AND cefr_level = ?';          params.push(req.query.cefr); }
    if (req.query.category) { sql += ' AND category LIKE ?';         params.push('%' + req.query.category + '%'); }
    if (req.query.q)        { sql += ' AND (word LIKE ? OR translation LIKE ?)'; params.push('%'+req.query.q+'%', '%'+req.query.q+'%'); }
    sql += ' ORDER BY created_at DESC LIMIT 500';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/vocab/:id
app.get('/api/vocab/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vocabulary WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/vocab
app.post('/api/vocab', async (req, res) => {
  const { word, part_of_speech, cefr_level, category, example, image_url } = req.body;
  if (!word?.trim()) {
    return res.status(400).json({ error: 'word is required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO vocabulary (word, part_of_speech, cefr_level, category, example, image_url) VALUES (?,?,?,?,?,?)',
      [word.trim(), part_of_speech || 'noun', cefr_level || 'A1', (category || '').trim(), (example || '').trim(), (image_url || '').trim() || null]
    );
    const [rows] = await pool.query('SELECT * FROM vocabulary WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/vocab/:id
app.put('/api/vocab/:id', async (req, res) => {
  const { word, part_of_speech, cefr_level, category, example, image_url } = req.body;
  try {
    await pool.query(
      'UPDATE vocabulary SET word=?, part_of_speech=?, cefr_level=?, category=?, example=?, image_url=? WHERE id=?',
      [word, part_of_speech, cefr_level, (category||'').trim(), (example||'').trim(), (image_url||'').trim()||null, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM vocabulary WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/vocab/:id
app.delete('/api/vocab/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM vocabulary WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/export  → JSON file download
app.get('/api/export', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vocabulary ORDER BY cefr_level, word');
    res.setHeader('Content-Disposition', 'attachment; filename="vocabulary.json"');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/publish  → write vocab.json then deploy to Firebase
app.post('/api/publish', async (req, res) => {
  const { exec } = require('child_process');
  try {
    const [rows] = await pool.query(
      'SELECT id, word, part_of_speech, cefr_level, category, example, image_url FROM vocabulary ORDER BY cefr_level, word'
    );
    const dest = path.join(__dirname, '..', 'frontend', 'vocab.json');
    fs.writeFileSync(dest, JSON.stringify(rows, null, 2), 'utf8');

    const projectRoot = path.join(__dirname, '..');
    exec('firebase deploy --only hosting', { cwd: projectRoot, timeout: 120000 }, (err, stdout, stderr) => {
      if (err) {
        console.error('Deploy error:', stderr || err.message);
        return res.status(500).json({ ok: false, count: rows.length, error: 'Deploy failed: ' + (stderr || err.message).slice(0, 200) });
      }
      res.json({ ok: true, count: rows.length, deployed: true });
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/stats
app.get('/api/stats', async (req, res) => {
  try {
    const [[totRow]]  = await pool.query('SELECT COUNT(*) AS total FROM vocabulary');
    const [byLevel]   = await pool.query('SELECT cefr_level, COUNT(*) AS cnt FROM vocabulary GROUP BY cefr_level');
    const [byPos]     = await pool.query('SELECT part_of_speech, COUNT(*) AS cnt FROM vocabulary GROUP BY part_of_speech');
    res.json({ total: totRow.total, byLevel, byPos });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/users?q=email&pageToken=...
app.get('/api/users', async (req, res) => {
  if (!firebaseReady) {
    return res.status(503).json({
      error: 'firebase_not_configured',
      hint: 'Place serviceAccount.json in admin/ OR set GOOGLE_APPLICATION_CREDENTIALS env var'
    });
  }
  try {
    const { q, pageToken } = req.query;
    const MAX = 500;
    let users = [];
    let nextPage = undefined;

    if (q) {
      // Search by email or display name (Firebase doesn't support substring search,
      // so we list all and filter locally — ok for small projects)
      let token = undefined;
      do {
        const result = await fbAuth.listUsers(1000, token);
        users.push(...result.users);
        token = result.pageToken;
      } while (token && users.length < 5000);

      const lq = q.toLowerCase();
      users = users.filter(u =>
        (u.email || '').toLowerCase().includes(lq) ||
        (u.displayName || '').toLowerCase().includes(lq)
      );
    } else {
      const result = await fbAuth.listUsers(MAX, pageToken || undefined);
      users = result.users;
      nextPage = result.pageToken || null;
    }

    const mapped = users.map(u => ({
      uid:          u.uid,
      email:        u.email || '',
      displayName:  u.displayName || '',
      photoURL:     u.photoURL || '',
      emailVerified: u.emailVerified,
      disabled:     u.disabled,
      provider:     (u.providerData || []).map(p => p.providerId).join(', ') || 'email',
      createdAt:    u.metadata.creationTime,
      lastSignIn:   u.metadata.lastSignInTime || null,
    }));

    res.json({ users: mapped, nextPage: nextPage || null, total: mapped.length });
  } catch (err) {
    console.error('listUsers error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/:uid/disable
app.patch('/api/users/:uid/disable', async (req, res) => {
  if (!firebaseReady) return res.status(503).json({ error: 'firebase_not_configured' });
  try {
    const { disabled } = req.body;
    await fbAuth.updateUser(req.params.uid, { disabled: !!disabled });
    res.json({ ok: true, disabled: !!disabled });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Start ─────────────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`LinguaPath Admin running → http://localhost:${PORT}`);
});
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const next = PORT + 1;
    console.warn(`Port ${PORT} in use, retrying on ${next}…`);
    server.listen(next);
  } else {
    throw err;
  }
});
