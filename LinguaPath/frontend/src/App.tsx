import HomePage from './pages/HomePage';
import LessonPage from './components/LessonPage';
import ListeningPage from './components/ListeningPage';
import PayPage from './components/PayPage';
import VocabularyPage from './components/VocabularyPage';
import NavBar from './components/NavBar';
import News from './components/news';
import PathPage from './components/PathPage';
import { useTheme } from './hooks/useTheme';

function getPage(): string {
  const p = window.location.pathname;
  if (p.includes('vocabulary')) return 'vocabulary';
  if (p.includes('lesson')) return 'lesson';
  if (p.includes('listening')) return 'listening';
  if (p.includes('news')) return 'news';
  if (p.includes('pay')) return 'pay';
  if (p.includes('path')) return 'path';
  return 'home';
}

function NewsPage() {
  const { icon, toggle } = useTheme();
  return (
    <>
      <NavBar user={null} onSignIn={() => {}} onSignUp={() => {}} onSignOut={() => {}}
        onThemeToggle={toggle} themeIcon={icon} />
      <News />
    </>
  );
}

export default function App() {
  const page = getPage();
  if (page === 'vocabulary') return <VocabularyPage />;
  if (page === 'lesson') return <LessonPage />;
  if (page === 'listening') return <ListeningPage />;
  if (page === 'news') return <NewsPage />;
  if (page === 'pay') return <PayPage />;
  if (page === 'path') return <PathPage />;
  return <HomePage />;
}
