import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Bot, X } from 'lucide-react'
import AiConsult from './AiConsult'

export default function AiConsultFloating() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const [symbol, setSymbol] = useState<string | null>(null)

  useEffect(() => {
    const match = location.pathname.match(/^\/stock\/(.+)$/)
    setSymbol(match ? match[1] : null)
  }, [location.pathname])

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 flex w-full max-w-lg flex-col bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Bot size={20} className="text-emerald-400" />
                <h2 className="text-lg font-semibold text-slate-200">AI 智能諮詢</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors rounded-lg p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {symbol ? (
                <AiConsult symbol={symbol} mode="panel" />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <Bot size={48} className="text-slate-600 mb-4" />
                  <p className="text-slate-400 text-sm">請先搜尋並進入個股頁面</p>
                  <p className="text-slate-500 text-xs mt-1">即可使用 AI 智能諮詢功能</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[60] bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full p-3.5 shadow-lg transition-all hover:scale-105 active:scale-95"
        aria-label="AI 諮詢"
      >
        <Bot size={24} />
      </button>
    </>
  )
}
