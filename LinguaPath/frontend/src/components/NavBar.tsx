import styles from './NavBar.module.css';

interface User {
  displayName: string | null;
  photoURL: string | null;
}

interface NavBarProps {
  user?: User | null;
  onSignIn: () => void;
  onSignUp: () => void;
  onSignOut: () => void;
  onThemeToggle: () => void;
  themeIcon?: string;
}

export default function NavBar({
  user,
  onSignIn,
  onSignUp,
  onSignOut,
  onThemeToggle,
  themeIcon = '☀️',
}: NavBarProps) {
  return (
    <nav className={styles.nav}>
      <a href="index.html" className={styles.logo}>
        <img src="/icons.svg" alt="" width={20} height={20} />
        Lingua<span>Path</span>
      </a>

      <div className={styles.navCenter}>
        <a href="/vocabulary" className={styles.navLink}>Vocabulary Card</a>
        <a href="/listening" className={styles.navLink}>Listening Lab</a>
        <a href="/news" className={styles.navLink}>News Reader</a>
        <a href="path" className={styles.navLink}>Learning Path</a>
        <a href="game.html" className={styles.navLink} target="_blank">Mini Game</a>
      </div>
      <div className={styles.navRight}>
        {user ? (
          <div className={styles.userInfo}>
            {user.photoURL && (
              <img className={styles.avatar} src={user.photoURL} alt="avatar" />
            )}
            <span className={styles.userName}>{user.displayName}</span>
            <a href="dashboard.html" className="btn btn-ghost">My Progress</a>
            <button className="btn btn-ghost" onClick={onSignOut}>Sign Out</button>
          </div>
        ) : (
          <div className={styles.userInfo}>
            <button className="btn btn-ghost" onClick={onSignIn}>Sign In</button>
            <button className="btn btn-primary" onClick={onSignUp}>Get Started</button>
          </div>
        )}

        <button className={styles.themeBtn} onClick={onThemeToggle} aria-label="Toggle theme">
          {themeIcon}
        </button>
      </div>
    </nav>
  );
}
