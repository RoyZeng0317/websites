// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBT9ueRFmd8CsFtb6VyRkjwLuVNy1sDsHM",
  authDomain: "stocks-global.firebaseapp.com",
  projectId: "stocks-global",
  storageBucket: "stocks-global.firebasestorage.app",
  messagingSenderId: "896423596342",
  appId: "1:896423596342:web:95a76103ace72aa40ae397",
  measurementId: "G-4JSGJ99VWG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);