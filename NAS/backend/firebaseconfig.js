// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHMJuqLQ4ZOy2OVS_u1qsyXeDYlrQuJTE",
  authDomain: "vaultix-nas.firebaseapp.com",
  projectId: "vaultix-nas",
  storageBucket: "vaultix-nas.firebasestorage.app",
  messagingSenderId: "584854333100",
  appId: "1:584854333100:web:f619a1d81a2f4456dde109",
  measurementId: "G-ZEF1EK97M7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);