import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyADqjDtdvxuM2Hqh4ple3M1uCD9OSmMUk4",
    authDomain: "linugapath.firebaseapp.com",
    projectId: "linugapath",
    storageBucket: "linugapath.firebasestorage.app",
    messagingSenderId: "821191704090",
    appId: "1:821191704090:web:030812138a98d844eb1ba3",
    measurementId: "G-1Z2DRPKCRD"
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
