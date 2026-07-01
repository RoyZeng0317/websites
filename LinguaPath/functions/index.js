const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { GameState } = require('./game-engine');

/* ── Firebase Admin ─────────────────────────────────────────────────────── */
let firestoreReady = false;
let db = null;
try {
  if (!admin.apps.length) {
    admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || 'linugapath' });
  }
  db = admin.firestore();
  firestoreReady = true;
} catch (e) {
  console.warn('Firestore not available:', e.message);
}

/* ── In-memory game sessions ────────────────────────────────────────────── */
const sessions = new Map();
const WORDS_CACHE = { words: [], loaded: false };

function loadWords() {
  if (WORDS_CACHE.loaded) return;
  const vocabPath = path.join(__dirname, '..', 'frontend', 'vocab.json');
  try {
    const data = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));
    WORDS_CACHE.words = Array.isArray(data) ? data.map(e => e.word).filter(Boolean) : [];
    WORDS_CACHE.loaded = true;
  } catch {
    WORDS_CACHE.words = ['apple', 'brave', 'crane', 'dance', 'eagle'];
  }
}
loadWords();

/* ── Express app for game API ───────────────────────────────────────────── */
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

/* Helper: load / update game from session */
function getOrCreateGame(roleId) {
  const gs = new GameState(roleId, WORDS_CACHE.words);
  sessions.set(gs.id, gs);
  return gs;
}

function getGame(id) { return sessions.get(id) || null; }

/* Clean stale sessions every 5 minutes */
setInterval(() => {
  const now = Date.now();
  for (const [id, gs] of sessions) {
    if (now - gs.startTime > 300_000) sessions.delete(id);
  }
}, 300_000);

/* ── API Routes ─────────────────────────────────────────────────────────── */

/* Health check */
app.get('/api/game', (req, res) => {
  res.json({ status: 'ok', sessions: sessions.size });
});

/* Start */
app.post('/api/game/start', (req, res) => {
  const roleId = (req.body.role || 'square').toLowerCase();
  if (!['square', 'triangle', 'circle', 'rectangle'].includes(roleId)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  const gs = getOrCreateGame(roleId);
  res.json({ gameId: gs.id, state: gs.toJSON() });
});

/* Update (process input) */
app.post('/api/game/update', (req, res) => {
  const gs = getGame(req.body.gameId);
  if (!gs) return res.status(404).json({ error: 'Game not found' });
  gs.update(req.body.keys || {});
  res.json(gs.toJSON());
});

/* Action (attack / super) */
app.post('/api/game/action', (req, res) => {
  const gs = getGame(req.body.gameId);
  if (!gs) return res.status(404).json({ error: 'Game not found' });
  const action = req.body.action || '';
  if (action === 'attack') gs.attack(req.body.mouseX, req.body.mouseY);
  else if (action === 'super') gs.activateSuper();
  res.json(gs.toJSON());
});

/* Spell check */
app.post('/api/game/spell', (req, res) => {
  const gs = getGame(req.body.gameId);
  if (!gs) return res.status(404).json({ error: 'Game not found' });
  const correct = gs.checkSpell(req.body.word || '');
  res.json({ correct, state: gs.toJSON() });
});

/* Save score to Firestore */
app.post('/api/game/save', async (req, res) => {
  const gs = getGame(req.body.gameId);
  if (!gs) return res.status(404).json({ error: 'Game not found' });
  if (!firestoreReady || !db) return res.status(503).json({ error: 'Firebase not available' });
  try {
    const stats = gs.getFinalStats();
    await db.collection('game_scores').doc(gs.id).set({
      ...stats,
      userId: req.body.userId || 'anonymous',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ saved: true, stats });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* Get word list */
app.get('/api/game/words', (req, res) => {
  const w = WORDS_CACHE.words.length > 0
    ? WORDS_CACHE.words[Math.floor(Math.random() * WORDS_CACHE.words.length)]
    : 'apple';
  res.json({ word: w });
});

/* ── Export as Firebase Function ────────────────────────────────────────── */
exports.game = functions.https.onRequest(app);

/* ── Keep existing speechToText function ────────────────────────────────── */
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.speechToText = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const { audio, mimeType } = req.body;
    if (!audio) { res.status(400).json({ error: 'No audio data provided' }); return; }

    const apiKey = process.env.GEMINI_API_KEY || functions.config().gemini?.api_key;
    if (!apiKey) { res.status(500).json({ error: 'GEMINI_API_KEY not configured' }); return; }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent([
      { text: 'Transcribe the speech in this audio. Return only the transcribed text, nothing else.' },
      { inlineData: { mimeType: mimeType || 'audio/ogg', data: audio } }
    ]);
    const transcript = result.response.text().trim();
    if (!transcript) { res.status(500).json({ error: 'Empty transcript from Gemini' }); return; }
    res.json({ transcript });
  } catch (err) {
    console.error('Gemini STT error:', err.message, err.status);
    if (err.message && err.message.includes('API_KEY')) { res.status(500).json({ error: 'Invalid Gemini API key' }); return; }
    if (err.status === 429) { res.status(429).json({ error: 'Gemini API quota exceeded. Please wait and try again.' }); return; }
    res.status(500).json({ error: err.message || 'Speech-to-text failed' });
  }
});
