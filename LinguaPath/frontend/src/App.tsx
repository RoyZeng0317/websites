import HomePage from './pages/HomePage';
import LessonPage from './components/LessonPage';
import ListeningPage from './components/ListeningPage';
import PayPage from './components/PayPage';

function getPage(): string {
  const p = window.location.pathname;
  if (p.includes('lesson')) return 'lesson';
  if (p.includes('listening')) return 'listening';
  if (p.includes('pay')) return 'pay';
  return 'home';
}

export default function App() {
  const page = getPage();
  if (page === 'lesson') return <LessonPage />;
  if (page === 'listening') return <ListeningPage />;
  if (page === 'pay') return <PayPage />;
  return <HomePage />;
}
