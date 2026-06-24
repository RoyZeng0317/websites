import styles from './SkillsSection.module.css';

interface Skill {
  char: string;
  label: string;
  desc: string;
  color: string;
}

const SKILLS: Skill[] = [
  { char: 'L', label: 'Listening', color: '#a78bfa', desc: 'Comprehend spoken English across accents and speeds.' },
  { char: 'S', label: 'Speaking',  color: '#f59e0b', desc: 'Build fluency and confidence in real conversations.' },
  { char: 'R', label: 'Reading',   color: '#34d399', desc: 'Understand articles, stories, and academic texts.' },
  { char: 'W', label: 'Writing',   color: '#f472b6', desc: 'Express ideas clearly in written English.' },
];

export default function SkillsSection() {
  return (
    <div>
      <div style={{ padding: '0 2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div className={styles.sectionTitle}>Learning Skills</div>
      </div>
      <div className={styles.grid}>
        {SKILLS.map((s) => (
          <div
            key={s.label}
            className={styles.card}
            style={{ '--card-color': s.color } as React.CSSProperties}
          >
            <div className={styles.char}>{s.char}</div>
            <div className={styles.label}>{s.label}</div>
            <div className={styles.desc}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
