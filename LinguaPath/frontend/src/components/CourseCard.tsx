import styles from './CourseCard.module.css';

export interface Course {
  id: string;
  level: string;
  title: string;
  desc: string;
  lessons: number;
  badge?: 'new' | 'popular' | null;
  progress?: number; // 0–100
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const badgeClass =
    course.badge === 'new' ? styles.badgeNew :
    course.badge === 'popular' ? styles.badgePopular : '';

  return (
    <a href={`lesson.html?course=${course.id}`} className={styles.card}>
      <div className={styles.level}>{course.level}</div>
      <div className={styles.title}>
        {course.title}
        {course.badge && (
          <span className={`${styles.badge} ${badgeClass}`}>{course.badge}</span>
        )}
      </div>
      <div className={styles.desc}>{course.desc}</div>
      <div className={styles.meta}>
        <span className={styles.lessons}>{course.lessons} lessons</span>
      </div>
      {course.progress !== undefined && (
        <>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${course.progress}%` }} />
          </div>
          <div className={styles.progressLabel}>{course.progress}% complete</div>
        </>
      )}
    </a>
  );
}
