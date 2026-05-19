const { auth, adminInitialized } = require('../config/firebase');
const User = require('../models/User');
require('dotenv').config();

const verifyWithRestApi = async (idToken) => {
  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    throw new Error('FIREBASE_WEB_API_KEY 未設定');
  }
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Token 驗證失敗');
  }
  const userInfo = data.users?.[0];
  if (!userInfo) throw new Error('無法取得使用者資訊');
  return {
    uid: userInfo.localId,
    email: userInfo.email || '',
    name: userInfo.displayName || ''
  };
};

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未提供授權令牌' });
    }

    const token = authHeader.split('Bearer ')[1];

    let firebaseUid, email, displayName;

    if (adminInitialized && auth) {
      const decodedToken = await auth.verifyIdToken(token);
      firebaseUid = decodedToken.uid;
      email = decodedToken.email || '';
      displayName = decodedToken.name || '';
    } else {
      const decoded = await verifyWithRestApi(token);
      firebaseUid = decoded.uid;
      email = decoded.email;
      displayName = decoded.name;
    }

    let user = await User.findByFirebaseUid(firebaseUid);
    if (!user) {
      user = await User.create({ firebaseUid, email, displayName });
    }

    req.user = user;
    req.firebaseUid = firebaseUid;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ error: '授權驗證失敗：' + error.message });
  }
};

module.exports = { authenticate };
