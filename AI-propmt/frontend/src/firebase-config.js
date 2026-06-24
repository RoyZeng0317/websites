import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBJczM4dMxEYyouPioGUVJmgZGjKl3s80w",
  authDomain: "linguapath-platform.firebaseapp.com",
  projectId: "linguapath-platform",
  storageBucket: "linguapath-platform.firebasestorage.app",
  messagingSenderId: "339822690989",
  appId: "1:339822690989:web:9b51ef475a46735018bc24",
  measurementId: "G-TDZKQG54YC"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export default app;
