import { Route, Routes } from 'react-router-dom'
import AuthControls from './components/AuthControls'
import AiConsultFloating from './components/AiConsultFloating'
import HomePage from './pages/HomePage'
import StockPage from './pages/StockPage'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl font-bold text-emerald-400 transition-colors hover:text-emerald-300">
              StockInfo
            </a>
            <span className="hidden text-xs text-slate-500 sm:inline">全球股市追蹤平台</span>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <a
              href="/#portfolio-overview"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-500/40 hover:bg-slate-800 hover:text-emerald-300"
            >
              我的持股
            </a>
          </div>
          <AuthControls />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stock/:symbol" element={<StockPage />} />
        </Routes>
      </main>

      <AiConsultFloating />
    </div>
  )
}
