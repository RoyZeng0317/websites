const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase, isDbReady } = require('./config/db');
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'https://exam-bank-manager.web.app',
  'https://exam-bank-manager.firebaseapp.com'
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: isDbReady() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: '伺服器內部錯誤' });
});

const startServer = async () => {
  await initDatabase();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`題庫管理系統後端啟動，端口: ${PORT}`);
  });
};

startServer();
