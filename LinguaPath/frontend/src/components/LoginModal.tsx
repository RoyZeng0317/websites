import { useState } from 'react';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleSignIn: () => void;
  onEmailSignIn: (email: string, password: string) => Promise<void>;
  onEmailSignUp: (email: string, password: string) => Promise<void>;
}

export default function LoginModal({
  isOpen,
  onClose,
  onGoogleSignIn,
  onEmailSignIn,
  onEmailSignUp,
}: LoginModalProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    try {
      if (tab === 'signin') {
        await onEmailSignIn(email, password);
      } else {
        await onEmailSignUp(email, password);
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.active : ''}`} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <h2 className={styles.title}>
          {tab === 'signin' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className={styles.subtitle}>
          {tab === 'signin' ? 'Sign in to track your progress' : 'Start your learning journey'}
        </p>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${tab === 'signin' ? styles.active : ''}`}
            onClick={() => setTab('signin')}
          >
            Sign In
          </button>
          <button
            className={`${styles.tabBtn} ${tab === 'signup' ? styles.active : ''}`}
            onClick={() => setTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <button className={styles.googleBtn} onClick={onGoogleSignIn}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <div className={styles.divider}>or</div>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className={`${styles.error} ${styles.show}`}>{error}</div>}

        <button
          className={`btn btn-primary ${styles.submitBtn}`}
          onClick={handleSubmit}
        >
          {tab === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </div>
    </div>
  );
}
