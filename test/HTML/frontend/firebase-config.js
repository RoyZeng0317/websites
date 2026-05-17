// ─── Firebase 專案設定 ───────────────────────────────────────────────
// 使用方式：
//   1. 前往 https://console.firebase.google.com 建立一個 Firebase 專案
//   2. 啟用 Authentication → 登入提供者 → Google
//   3. 啟用 Firestore Database → 建立資料庫（選擇測試模式）
//   4. 在專案設定中複製下方的設定值
// ─────────────────────────────────────────────────────────────────────
const firebaseConfig = {
    apiKey: "AIzaSyAgoHsPRCkW7a0Sfw82bBPVlMFVAs5Udds",
    authDomain: "test-exam-db65a.firebaseapp.com",
    projectId: "test-exam-db65a",
    storageBucket: "test-exam-db65a.firebasestorage.app",
    messagingSenderId: "914637875391",
    appId: "1:914637875391:web:230b7d38546b64f914fe0a",
    measurementId: "G-3B2EJGSS1G"
};

// 初始化 Firebase（僅在未初始化且已設定時執行）
const _fbReady = firebaseConfig.apiKey !== 'YOUR_API_KEY';
if (_fbReady && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
