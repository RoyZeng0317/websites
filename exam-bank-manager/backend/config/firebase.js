const admin = require('firebase-admin');
require('dotenv').config();

let auth = null;
let db = null;
let adminInitialized = false;

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const projectId = process.env.FIREBASE_PROJECT_ID;

if (privateKey && clientEmail && projectId &&
    !privateKey.includes('YOUR_PRIVATE_KEY') &&
    !clientEmail.includes('your-firebase-project')) {
  try {
    const serviceAccount = {
      type: 'service_account',
      projectId,
      privateKey: privateKey.replace(/\\n/g, '\n'),
      clientEmail
    };
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    auth = admin.auth();
    db = admin.firestore();
    adminInitialized = true;
    console.log('Firebase Admin SDK 初始化成功');
  } catch (err) {
    console.warn('Firebase Admin SDK 初始化失敗（認證與 Firestore 功能受限）:', err.message);
  }
} else {
  console.warn('Firebase Admin SDK 未設定（認證與 Firestore 功能受限）');
}

module.exports = { admin, auth, db, adminInitialized };
