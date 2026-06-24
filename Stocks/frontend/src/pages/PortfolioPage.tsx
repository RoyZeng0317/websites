import PortfolioOverview from '../components/PortfolioOverview'
import ErrorBoundary from '../components/ErrorBoundary'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function PortfolioPage() {
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
      </div>
      <ErrorBoundary>
        <PortfolioOverview />
      </ErrorBoundary>
    </div>
  )
}
