import { useState, useEffect } from 'react';
import NavBar from './NavBar';
import { useTheme } from '../hooks/useTheme';
import styles from './ListeningPage.module.css';

interface KeyPoint {
  text: string;
}

interface ListeningLesson {
  id: string | number;
  title: string;
  difficulty: string;
  youtube_url?: string;
  audio_url?: string;
  key_points?: KeyPoint[] | string[];
}

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function diffClass(d: string): string {
  if (d === 'A1' || d === 'A2') return styles.diffA;
  if (d === 'B1' || d === 'B2') return styles.diffB;
  return styles.diffC;
}

function toEmbed(url: string): string {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?rel=0` : url;
}

const STORAGE_KEY = 'lp-listen-';
function getChecked(id: string | number): boolean[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY + id) ?? '[]'); } catch { return []; }
}
function saveChecked(id: string | number, arr: boolean[]): void {
  localStorage.setItem(STORAGE_KEY + id, JSON.stringify(arr));
}

interface LessonCardProps {
  lesson: ListeningLesson;
  onPointsChange: () => void;
}

function LessonCard({ lesson, onPointsChange }: LessonCardProps) {
  const points: string[] = Array.isArray(lesson.key_points)
    ? lesson.key_points.map((p) => (typeof p === 'string' ? p : p.text))
    : [];

  const [checked, setChecked] = useState<boolean[]>(() => {
    const saved = getChecked(lesson.id);
    return points.map((_, i) => saved[i] ?? false);
  });

  const toggle = (i: number) => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
    saveChecked(lesson.id, next);
    onPointsChange();
  };

  const reset = () => {
    const next = points.map(() => false);
    setChecked(next);
    saveChecked(lesson.id, next);
    onPointsChange();
  };

  const score = points.length ? Math.round((checked.filter(Boolean).length / points.length) * 100) : 0;

  return (
    <div className={styles.lessonCard}>
      {lesson.youtube_url && (
        <div className={styles.lessonThumb}>
          <iframe
            src={toEmbed(lesson.youtube_url)}
            allowFullScreen
            title={lesson.title}
          />
        </div>
      )}
      {!lesson.youtube_url && lesson.audio_url && (
        <div className={styles.audioPlayer}>
          <audio controls src={lesson.audio_url} preload="none">
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      <div className={styles.lessonBody}>
        <div className={styles.lessonTop}>
          <div className={styles.lessonTitle}>{lesson.title}</div>
          <span className={`${styles.tagDiff} ${diffClass(lesson.difficulty)}`}>{lesson.difficulty}</span>
        </div>

        {points.length > 0 && (
          <>
            <div className={styles.pointsTitle}>Key Points</div>
            {points.map((pt, i) => (
              <div
                key={i}
                className={`${styles.pointItem} ${checked[i] ? styles.checked : ''}`}
                onClick={() => toggle(i)}
              >
                <div className={styles.pointCheck} />
                <span className={styles.pointText}>{pt}</span>
              </div>
            ))}

            <div className={styles.scoreRow}>
              <div className={styles.scoreBarWrap}>
                <div className={styles.scoreBarFill} style={{ width: `${score}%` }} />
              </div>
              <span className={styles.scorePct}>{score}%</span>
              <button className={styles.btnReset} onClick={reset}>Reset</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ListeningPage() {
  const { icon, toggle } = useTheme();
  const [lessons, setLessons] = useState<ListeningLesson[]>([]);
  const [diffFilter, setDiffFilter] = useState('');
  const [ability, setAbility] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('listening.json')
      .then((r) => r.json())
      .then((data: ListeningLesson[]) => {
        setLessons(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const calcAbility = () => {
    let total = 0, done = 0;
    lessons.forEach((l) => {
      const pts = Array.isArray(l.key_points) ? l.key_points : [];
      if (!pts.length) return;
      total += pts.length;
      done += getChecked(l.id).filter(Boolean).length;
    });
    setAbility(total ? Math.round((done / total) * 100) : 0);
  };

  useEffect(() => { calcAbility(); }, [lessons]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = diffFilter ? lessons.filter((l) => l.difficulty === diffFilter) : lessons;

  return (
    <>
      <NavBar
        user={null}
        onSignIn={() => {}}
        onSignUp={() => {}}
        onSignOut={() => {}}
        onThemeToggle={toggle}
        themeIcon={icon}
      />

      <div className={styles.header}>
        <h1>Listening Lab</h1>
        <p>Watch the video, then check every key point you understood. Track your listening ability.</p>
      </div>

      {/* Ability bar */}
      <div className={styles.abilityBox}>
        <div className={styles.abilityCard}>
          <span className={styles.abilityLabel}>🎧 Listening Ability</span>
          <div className={styles.abilityBarWrap}>
            <div className={styles.abilityBarFill} style={{ width: `${ability}%` }} />
          </div>
          <span className={styles.abilityPct}>{ability ? `${ability}%` : '—'}</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <select value={diffFilter} onChange={(e) => setDiffFilter(e.target.value)}>
          <option value="">All Levels</option>
          {CEFR_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <span className={styles.countLabel}>{filtered.length} lesson{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className={styles.stateMsg}><span className={styles.icon}>⏳</span>Loading…</div>
      ) : filtered.length === 0 ? (
        <div className={styles.stateMsg}><span className={styles.icon}>🎧</span>No lessons available yet. Check back soon!</div>
      ) : (
        <div className={styles.lessonGrid}>
          {filtered.map((l) => (
            <LessonCard key={l.id} lesson={l} onPointsChange={calcAbility} />
          ))}
        </div>
      )}
    </>
  );
}
