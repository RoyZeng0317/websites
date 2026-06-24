import { useEffect, useState, type ReactNode, createElement } from 'react';
import { AuthContext } from './AuthContext';
import type { FirebaseUser } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const signIn = async (_email: string, _password: string): Promise<void> => {};
  const signUp = async (_email: string, _password: string): Promise<void> => {};
  const signInWithGoogle = async (): Promise<void> => {};
  const logOut = async (): Promise<void> => { setUser(null); };

  return createElement(
    AuthContext.Provider,
    { value: { user, loading, signIn, signUp, signInWithGoogle, logOut } },
    children,
  );
}
