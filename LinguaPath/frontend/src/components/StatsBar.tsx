import styles from './StatsBar.module.css';

interface Stat {
  num: string | number;
  label: string;
}

interface StatsBarProps {
  stats?: Stat[];
}

const DEFAULT_STATS: Stat[] = [
  { num: 8,     label: 'Courses' },
  { num: 52,    label: 'Lessons' },
  { num: 'Pay', label: 'Some functions' },
];

export default function StatsBar({ stats = DEFAULT_STATS }: StatsBarProps) {
  return (
    <div className={styles.statsBar}>
      {stats.map((s, i) => (
        <div key={i} className={styles.stat}>
          <div className={styles.statNum}>{s.num}</div>
          <div className={styles.statLabel}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
