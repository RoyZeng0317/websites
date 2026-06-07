// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcnU7YOabw4qnaEPQ0-cFbqcyjLfDd96M",
  authDomain: "knowgence-b7a2c.firebaseapp.com",
  projectId: "knowgence-b7a2c",
  storageBucket: "knowgence-b7a2c.firebasestorage.app",
  messagingSenderId: "186080739418",
  appId: "1:186080739418:web:cc1498d4ca0d254dec5863",
  measurementId: "G-P888ZKR96N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();