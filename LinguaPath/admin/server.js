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
  const { word, part_of_speech, cefr_level, category, example, image_url, exam_tags } = req.body;
  if (!word?.trim()) {
    return res.status(400).json({ error: 'word is required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO vocabulary (word, part_of_speech, cefr_level, category, example, image_url, exam_tags) VALUES (?,?,?,?,?,?,?)',
      [word.trim(), part_of_speech || 'noun', cefr_level || 'A1', (category || '').trim(), (example || '').trim(), (image_url || '').trim() || null, (exam_tags || '').trim()]
    );
    const [rows] = await pool.query('SELECT * FROM vocabulary WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/vocab/:id
app.put('/api/vocab/:id', async (req, res) => {
  const { word, part_of_speech, cefr_level, category, example, image_url, exam_tags } = req.body;
  try {
    await pool.query(
      'UPDATE vocabulary SET word=?, part_of_speech=?, cefr_level=?, category=?, example=?, image_url=?, exam_tags=? WHERE id=?',
      [word, part_of_speech, cefr_level, (category||'').trim(), (example||'').trim(), (image_url||'').trim()||null, (exam_tags||'').trim(), req.params.id]
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

    // also publish listening lessons
    const [lRows] = await pool.query('SELECT * FROM listening_lessons ORDER BY created_at DESC');
    lRows.forEach(l => { try { l.key_points = JSON.parse(l.key_points || '[]'); } catch { l.key_points = []; } });
    const lDest = path.join(__dirname, '..', 'frontend', 'listening.json');
    fs.writeFileSync(lDest, JSON.stringify(lRows, null, 2), 'utf8');

    // also publish news articles
    const [nRows] = await pool.query('SELECT * FROM news_articles ORDER BY created_at DESC');
    const nDest = path.join(__dirname, '..', 'frontend', 'news.json');
    fs.writeFileSync(nDest, JSON.stringify(nRows, null, 2), 'utf8');

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

// ── News Articles ─────────────────────────────────────────────────────────────

pool.query(`
  CREATE TABLE IF NOT EXISTS news_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    source VARCHAR(255) DEFAULT '',
    difficulty ENUM('A1','A2','B1','B2','C1','C2') DEFAULT 'B1',
    summary TEXT,
    content LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(e => console.warn('news_articles table init:', e.message));

app.get('/api/news', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM news_articles ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/news', async (req, res) => {
  const { title, source, difficulty, summary, content } = req.body;
  if (!title?.trim() || !content?.trim()) return res.status(400).json({ error: 'title and content required' });
  try {
    const [r] = await pool.query(
      'INSERT INTO news_articles (title, source, difficulty, summary, content) VALUES (?,?,?,?,?)',
      [title.trim(), (source||'').trim(), difficulty||'B1', (summary||'').trim(), content.trim()]
    );
    const [rows] = await pool.query('SELECT * FROM news_articles WHERE id=?', [r.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/news/:id', async (req, res) => {
  const { title, source, difficulty, summary, content } = req.body;
  try {
    await pool.query(
      'UPDATE news_articles SET title=?, source=?, difficulty=?, summary=?, content=? WHERE id=?',
      [title, (source||'').trim(), difficulty, (summary||'').trim(), content, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM news_articles WHERE id=?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM news_articles WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Listening Lessons ────────────────────────────────────────────────────────

app.get('/api/listening', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM listening_lessons ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/listening', async (req, res) => {
  const { title, youtube_url, difficulty, key_points } = req.body;
  if (!title?.trim() || !youtube_url?.trim()) return res.status(400).json({ error: 'title and youtube_url required' });
  try {
    const [r] = await pool.query(
      'INSERT INTO listening_lessons (title, youtube_url, difficulty, key_points) VALUES (?,?,?,?)',
      [title.trim(), youtube_url.trim(), difficulty || 'B1', JSON.stringify(key_points || [])]
    );
    const [rows] = await pool.query('SELECT * FROM listening_lessons WHERE id=?', [r.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/listening/:id', async (req, res) => {
  const { title, youtube_url, difficulty, key_points } = req.body;
  try {
    await pool.query(
      'UPDATE listening_lessons SET title=?, youtube_url=?, difficulty=?, key_points=? WHERE id=?',
      [title, youtube_url, difficulty, JSON.stringify(key_points || []), req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM listening_lessons WHERE id=?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/listening/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM listening_lessons WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Static (admin UI) — must be after all API routes ──────────────────────────
app.use(express.static(path.join(__dirname), { etag: false, lastModified: false, setHeaders: res => res.set('Cache-Control', 'no-store') }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `${req.method} ${req.path} not found` });
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
