import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import StockPage from './pages/StockPage'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <a href="/" className="text-xl font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
            StockInfo
          </a>
          <span className="text-xs text-slate-500 hidden sm:inline">個股完整資訊</span>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stock/:symbol" element={<StockPage />} />
        </Routes>
      </main>
    </div>
  )
}
