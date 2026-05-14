import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBh-ugjnWXOIFgaujjvEoHJ4jx_KfcXezU",
    authDomain: "english-language-platform.firebaseapp.com",
    projectId: "english-language-platform",
    storageBucket: "english-language-platform.firebasestorage.app",
    messagingSenderId: "398558443265",
    appId: "1:398558443265:web:7cca79b438a3994e9bcd00",
    measurementId: "G-MSNCYB2MTZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { 
    auth, db, googleProvider, 
    onAuthStateChanged, signOut, signInWithPopup, 
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    doc, getDoc, setDoc, serverTimestamp 
};
