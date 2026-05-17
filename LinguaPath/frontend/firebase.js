import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADqjDtdvxuM2Hqh4ple3M1uCD9OSmMUk4",
  authDomain: "linugapath.firebaseapp.com",
  projectId: "linugapath",
  storageBucket: "linugapath.firebasestorage.app",
  messagingSenderId: "821191704090",
  appId: "1:821191704090:web:030812138a98d844eb1ba3",
  measurementId: "G-1Z2DRPKCRD",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, provider);