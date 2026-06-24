import styles from './Hero.module.css';

interface HeroProps {
  onStartLearning: () => void;
  onCheckLevel: () => void;
}

export default function Hero({ onStartLearning, onCheckLevel }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.tag}>✦ English Language Platform</div>
      <h1 className={styles.title}>
        Master English with<br />
        <em>structured paths</em>
      </h1>
      <p className={styles.subtitle}>
        From beginner foundations to advanced fluency — track your progress and learn at your own pace.
      </p>
      <div className={styles.actions}>
        <button
          className="btn btn-primary"
          style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
          onClick={onStartLearning}
        >
          Start Learning Now
        </button>
        <button
          className="btn btn-primary"
          style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
          onClick={onCheckLevel}
        >
          Check Your Level
        </button>
      </div>
    </section>
  );
}
