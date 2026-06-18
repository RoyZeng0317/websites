import { useEffect, useState, type ReactNode, createElement } from 'react';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { AuthContext } from './AuthContext';

const firebaseConfig = {
  apiKey: 'AIzaSyADqjDtdvxuM2Hqh4ple3M1uCD9OSmMUk4',
  authDomain: 'linugapath.firebaseapp.com',
  projectId: 'linugapath',
  storageBucket: 'linugapath.firebasestorage.app',
  messagingSenderId: '821191704090',
  appId: '1:821191704090:web:030812138a98d844eb1ba3',
  measurementId: 'G-1Z2DRPKCRD',
};

let app: FirebaseApp | undefined;
let initialized = false;

function getFirebaseApp(): FirebaseApp {
  if (!initialized) {
    app = initializeApp(firebaseConfig);
    initialized = true;
  }
  return app!;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(getFirebaseApp());
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = async (email: string, password: string) => {
    const auth = getAuth(getFirebaseApp());
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    const auth = getAuth(getFirebaseApp());
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const auth = getAuth(getFirebaseApp());
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logOut = async () => {
    const auth = getAuth(getFirebaseApp());
    await signOut(auth);
  };

  return createElement(
    AuthContext.Provider,
    { value: { user, loading, signIn, signUp, signInWithGoogle, logOut } },
    children,
  );
}
