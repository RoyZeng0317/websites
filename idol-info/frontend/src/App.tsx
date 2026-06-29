import { Routes, Route, Link, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GroupPage from './pages/GroupPage'
import IdolPage from './pages/IdolPage'
import IdolsPage from './pages/IdolsPage'
import IdolFormPage from './pages/IdolFormPage'

function NavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation()
  const active = location.pathname === to
  return (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
        active
          ? 'bg-pink-500 text-white'
          : 'text-slate-400 hover:bg-pink-500/10 hover:text-pink-400'
      }`}
    >
      {label}
    </Link>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="bg-slate-800/80 border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-pink-400">
            偶像資訊
          </Link>
          <nav className="flex gap-1">
            <NavLink to="/" label="首頁" />
            <NavLink to="/idols" label="偶像" />
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/groups/:id" element={<GroupPage />} />
            <Route path="/idols" element={<IdolsPage />} />
            <Route path="/idols/new" element={<IdolFormPage />} />
            <Route path="/idols/:id" element={<IdolPage />} />
            <Route path="/idols/:id/edit" element={<IdolFormPage />} />
          </Routes>
      </main>

      <footer className="bg-slate-800/50 border-t border-slate-700/50 py-4 text-center text-xs text-slate-500">
        &copy; 作者: <a href="https://stellarix-electronics.web.app/" className="text-pink-400 hover:underline">星元電子科技有限公司</a> 著作所有.
      </footer>
    </div>
  )
}
