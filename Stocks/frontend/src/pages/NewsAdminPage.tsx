import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import ErrorBoundary from '../components/ErrorBoundary'
import NewsAdminPanel from '../components/admin/NewsAdminPanel'

export default function NewsAdminPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ChevronLeft size={16} />
          返回
        </button>
        <h1 className="text-lg font-semibold text-slate-100">新聞管理</h1>
      </div>
      <ErrorBoundary>
        <NewsAdminPanel />
      </ErrorBoundary>
    </div>
  )
}
