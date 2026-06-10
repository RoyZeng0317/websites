const express = require('express');
const { getDb } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', (req, res) => {
  const db = getDb();

  const user = db.prepare(
    'SELECT id, email, username, display_name, bio, photo_url, is_private, created_at FROM users WHERE id = ?'
  ).get(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.display_name,
      bio: user.bio,
      photoUrl: user.photo_url,
      isPrivate: !!user.is_private,
      createdAt: user.created_at,
    },
  });
});

router.put('/me', authenticateToken, (req, res) => {
  const { displayName, bio, photoUrl, isPrivate } = req.body;
  const db = getDb();

  const updates = [];
  const params = [];

  if (displayName !== undefined) {
    updates.push('display_name = ?');
    params.push(displayName);
  }
  if (bio !== undefined) {
    updates.push('bio = ?');
    params.push(bio);
  }
  if (photoUrl !== undefined) {
    updates.push('photo_url = ?');
    params.push(photoUrl);
  }
  if (isPrivate !== undefined) {
    updates.push('is_private = ?');
    params.push(isPrivate ? 1 : 0);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updates.push("updated_at = datetime('now')");
  params.push(req.userId);

  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);

  const user = db.prepare(
    'SELECT id, email, username, display_name, bio, photo_url, is_private FROM users WHERE id = ?'
  ).get(req.userId);

  res.json({
    message: 'Profile updated',
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.display_name,
      bio: user.bio,
      photoUrl: user.photo_url,
      isPrivate: !!user.is_private,
    },
  });
});

module.exports = router;
