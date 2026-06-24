import { useState, useRef, useEffect } from 'react'
import { consultAi } from '../api/stockApi'
import { Bot, Send, Loader2, Zap, AlertTriangle, ExternalLink } from 'lucide-react'

interface Props {
  symbol: string
  mode?: 'card' | 'panel'
  onTokensChange?: (tokens: number) => void
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_ACTIONS = [
  '這檔股票目前評價合理嗎？',
  '近期有什麼值得注意的風險？',
  '產業前景如何？',
  '財務狀況是否穩健？',
]

export default function AiConsult({ symbol, mode = 'card', onTokensChange }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showQuick, setShowQuick] = useState(true)
  const [tokensUsed, setTokensUsed] = useState(0)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const updateTokens = (tokens: number) => {
    setTokensUsed(tokens)
    onTokensChange?.(tokens)
  }

  const ask = async (question: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setLoading(true)
    setShowQuick(false)
    try {
      const res = await consultAi(symbol, question)
      if (res.tokens_used !== undefined) {
        updateTokens(res.tokens_used)
      }
      if (res.quota_exceeded) {
        setShowUpgradeDialog(true)
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: res.answer }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: '查詢失敗，請稍後再試。' }])
    } finally {
      setLoading(false)
      setInput('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    ask(input.trim())
  }

  const formatTokens = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return `${n}`
  }

  const upgradeDialog = showUpgradeDialog && (
    <div className="mx-4 mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-400" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-300">今日免費額度已達上限</p>
          <p className="mt-1 text-xs text-amber-400/80">
            Gemini 免費方案每日有使用量限制。升級付費方案後可繼續使用 AI 諮詢功能。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/30 transition-colors"
            >
              <ExternalLink size={12} />
              前往升級方案
            </a>
            <button
              onClick={() => setShowUpgradeDialog(false)}
              className="rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              稍後再說
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const chatContent = (
    <>
      <div className={`${mode === 'panel' ? 'flex-1' : 'h-80'} overflow-y-auto p-4 space-y-4`}>
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-sm text-slate-500">想問什麼？輸入問題或點擊快速提問</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-500/20 text-emerald-200 rounded-br-md'
                  : 'bg-slate-700/50 text-slate-300 rounded-bl-md'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700/50 rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 size={18} className="animate-spin text-slate-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {upgradeDialog}

      {showQuick && messages.length === 0 && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-2">
          {QUICK_ACTIONS.map((q) => (
            <button
              key={q}
              onClick={() => ask(q)}
              className="text-xs text-left bg-slate-700/30 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 rounded-lg px-3 py-2 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {!showQuick && messages.length > 0 && (
        <div className="px-4 pb-2">
          <button
            onClick={() => setShowQuick(true)}
            className="text-xs text-emerald-500 hover:text-emerald-400"
          >
            + 顯示快速提問
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-700/50 px-4 py-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入問題..."
          className="flex-1 bg-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500/50"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg p-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </form>
    </>
  )

  if (mode === 'panel') return chatContent

  return (
    <div className="bg-slate-800/50 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-emerald-400" />
          <h2 className="text-lg font-semibold text-slate-200">AI 智能諮詢</h2>
        </div>
        {tokensUsed > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-slate-700/50 px-3 py-1">
            <Zap size={12} className="text-emerald-400" />
            <span className="text-xs text-slate-400">
              今日用量：<span className="text-emerald-400 font-medium">{formatTokens(tokensUsed)}</span> tokens
            </span>
          </div>
        )}
      </div>
      {chatContent}
    </div>
  )
}
