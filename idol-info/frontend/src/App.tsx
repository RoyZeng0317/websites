import { Routes, Route, Link, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GroupPage from './pages/GroupPage'
import IdolPage from './pages/IdolPage'

function NavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation()
  const active = location.pathname === to
  return (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
        active
          ? 'bg-pink-500 text-white'
          : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
      }`}
    >
      {label}
    </Link>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-pink-600">
            偶像資訊
          </Link>
          <nav className="flex gap-1">
            <NavLink to="/" label="首頁" />
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/groups/:id" element={<GroupPage />} />
          <Route path="/idols/:id" element={<IdolPage />} />
        </Routes>
      </main>

      <footer className="bg-white border-t py-4 text-center text-xs text-gray-400">
        &copy; 作者: <a href="https://royzeng0317.github.io/HTML/Self-Website/zh-tw/index.html" className="text-pink-500 hover:underline">Roy Zeng</a> 著作所有.
      </footer>
    </div>
  )
}
