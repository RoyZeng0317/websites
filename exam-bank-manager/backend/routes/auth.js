const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: '取得使用者資料失敗' });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { displayName, avatarUrl } = req.body;
    const user = await User.update(req.user.id, { displayName, avatarUrl });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: '更新個人資料失敗' });
  }
});

module.exports = router;
