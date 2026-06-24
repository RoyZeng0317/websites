import CourseCard from './CourseCard';
import type { Course } from './CourseCard';
import styles from './CoursesGrid.module.css';

const COURSES: Course[] = [
  { id: 'beginner-foundations',   level: 'Beginner',   title: 'Foundations of English',    lessons: 8,  badge: 'popular', desc: 'Master the alphabet, basic grammar, and everyday vocabulary. Perfect for complete beginners.' },
  { id: 'everyday-conversations', level: 'Elementary', title: 'Everyday Conversations',     lessons: 7,  badge: null,      desc: 'Learn to introduce yourself, ask for directions, and navigate common social situations.' },
  { id: 'grammar-essentials',     level: 'Intermediate',title: 'Grammar Essentials',        lessons: 9,  badge: 'new',     desc: 'Deep dive into tenses, conditionals, and sentence structures that elevate your writing.' },
  { id: 'advanced-fluency',       level: 'Advanced',   title: 'Advanced Fluency',           lessons: 8,  badge: null,      desc: 'Idioms, nuance, academic writing, and presentation skills for professional contexts.' },
  { id: 'skill-listening',        level: 'All Levels', title: 'Listening',                  lessons: 5,  badge: 'new',     desc: 'Develop your ability to understand spoken English from basic sounds to native-speed conversations.' },
  { id: 'skill-speaking',         level: 'All Levels', title: 'Speaking',                   lessons: 5,  badge: 'new',     desc: 'Build confidence in spoken English from first words to fluent conversation and public speaking.' },
  { id: 'skill-reading',          level: 'All Levels', title: 'Reading',                    lessons: 5,  badge: 'new',     desc: 'Learn to read English effectively from phonics and simple texts to academic papers and literature.' },
  { id: 'skill-writing',          level: 'All Levels', title: 'Writing',                    lessons: 5,  badge: 'new',     desc: 'Master written expression in English from forming letters to writing essays and professional documents.' },
];

interface CoursesGridProps {
  courses?: Course[];
}

export default function CoursesGrid({ courses = COURSES }: CoursesGridProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionTitle}>All Courses</div>
      <div className={styles.grid}>
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </div>
  );
}
