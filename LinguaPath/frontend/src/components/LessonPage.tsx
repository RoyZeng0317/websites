import { useState, useEffect, useCallback } from 'react';
import { COURSES } from '../data/courses';
import NavBar from './NavBar';
import { useTheme } from '../hooks/useTheme';
import styles from './LessonPage.module.css';

export default function LessonPage() {
  const { icon, toggle } = useTheme();

  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('course') ?? 'beginner-foundations';
  const [lessonIdx, setLessonIdx] = useState(parseInt(params.get('lesson') ?? '0', 10));

  const course = COURSES[courseId] ?? COURSES['beginner-foundations'];
  const lesson = course.lessons[lessonIdx];

  // Persist progress in localStorage
  const progressKey = `lp-progress-${courseId}`;
  const [progress, setProgress] = useState<Record<number, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(progressKey) ?? '{}'); } catch { return {}; }
  });

  const markComplete = useCallback(() => {
    const next = { ...progress, [lessonIdx]: true };
    setProgress(next);
    localStorage.setItem(progressKey, JSON.stringify(next));
  }, [lessonIdx, progress, progressKey]);

  // Sync URL when lesson changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('course', courseId);
    url.searchParams.set('lesson', String(lessonIdx));
    window.history.replaceState(null, '', url.toString());
    window.scrollTo(0, 0);
  }, [courseId, lessonIdx]);

  const completed = course.lessons.filter((_, i) => progress[i]).length;
  const pct = Math.round((completed / course.lessons.length) * 100);

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

      <div className={styles.layout}>
        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCourseLabel}>{course.level}</div>
          <div className={styles.sidebarCourseTitle}>{course.title}</div>

          <div className={styles.lessonList}>
            {course.lessons.map((l, i) => (
              <div
                key={i}
                className={[
                  styles.lessonItem,
                  i === lessonIdx ? styles.active : '',
                  progress[i] ? styles.done : '',
                ].join(' ')}
                onClick={() => setLessonIdx(i)}
              >
                <div className={styles.lessonNum}>{progress[i] ? '✓' : i + 1}</div>
                <div className={styles.lessonName}>{l.title}</div>
              </div>
            ))}
          </div>

          <div className={styles.sidebarProgress}>
            <div className={styles.progressRow}>
              <span>Progress</span>
              <span className={styles.pct}>{pct}%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${pct}%` }} />
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className={styles.main}>
          <div className={styles.breadcrumb}>
            <a href="index.html">Home</a> / {course.title} / {lesson.title}
          </div>

          <div className={styles.lessonHeader}>
            <div className={styles.lessonLevel}>{course.level}</div>
            <h1 className={styles.lessonTitle}>{lesson.title}</h1>
            <div className={styles.lessonMeta}>
              <span>Lesson {lessonIdx + 1} of {course.lessons.length}</span>
              <span>{lesson.duration} read</span>
            </div>
          </div>

          {/* Video */}
          <div className={styles.videoWrapper}>
            {lesson.videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${lesson.videoId}`}
                allowFullScreen
                title={lesson.title}
              />
            ) : (
              <div className={styles.videoPlaceholder}>
                <div className={styles.playIcon}>▶</div>
                <span>No video for this lesson</span>
              </div>
            )}
          </div>

          {/* Lesson body (trusted internal HTML) */}
          <div
            className={styles.lessonContent}
            dangerouslySetInnerHTML={{ __html: lesson.body }}
          />

          {/* Actions */}
          <div className={styles.lessonActions}>
            <button
              className="btn btn-ghost"
              style={{ visibility: lessonIdx > 0 ? 'visible' : 'hidden' }}
              onClick={() => setLessonIdx((i) => i - 1)}
            >
              &lt; Previous
            </button>

            <button
              className={progress[lessonIdx] ? styles.completedBtn : styles.completeBtn}
              onClick={markComplete}
              disabled={!!progress[lessonIdx]}
            >
              {progress[lessonIdx] ? 'Completed ✓' : 'Mark as Complete'}
            </button>

            <button
              className="btn btn-ghost"
              style={{ visibility: lessonIdx < course.lessons.length - 1 ? 'visible' : 'hidden' }}
              onClick={() => setLessonIdx((i) => i + 1)}
            >
              Next &gt;
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
