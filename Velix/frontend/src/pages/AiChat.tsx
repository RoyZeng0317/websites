import { useState, useRef, useEffect } from 'react'
import { Send, Bot, Trash2 } from 'lucide-react'
import type { AiMessage } from '../types'
import Avatar from '../components/Avatar'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY
const MODEL = 'claude-haiku-4-5-20251001'

const SYSTEM_PROMPT = `你是 Velix 的 AI 助手。請用繁體中文回答問題，保持友善、簡潔。
Velix 是一個社交平台，你可以幫助用戶了解如何使用平台功能，或者回答各種問題。`

const DEV_NOTICE = '目前 AI 功能正在開發中...敬請期待!'

export default function AiChat() {
  const { userDoc } = useAuth()
  const [messages, setMessages] = useState<AiMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')

    const newMessages: AiMessage[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-request-source': 'user-controlled',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      const reply = data.content?.[0]?.text || '抱歉，我無法處理這個請求。'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      toast.error('AI 回應失敗，請稍後再試')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-dark-bg border-b border-dark-border px-4 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-velix-700 rounded-full flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-dark-text">Velix AI</p>
            <p className="text-xs text-dark-muted">Claude Haiku</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="text-dark-muted hover:text-red-400 text-xs flex items-center gap-1">
            <Trash2 size={14} /> 清除
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-24 lg:pb-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
            <div className="w-16 h-16 bg-velix-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot size={32} className="text-velix-400" />
            </div>
            <h2 className="text-lg font-semibold text-dark-text">{DEV_NOTICE}</h2>
            <p className="text-sm text-dark-muted mt-2">AI 功能即將上線，請敬請期待</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {msg.role === 'assistant' ? (
              <div className="w-8 h-8 bg-velix-700 rounded-full flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
            ) : (
              <Avatar src={userDoc?.photoUrl} name={userDoc?.displayName || 'Me'} size={32} />
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-velix-700 text-white rounded-tr-sm'
                  : 'bg-dark-surface text-dark-text rounded-tl-sm border border-dark-border'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-velix-700 rounded-full flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-dark-surface border border-dark-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-dark-muted rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed lg:sticky bottom-14 lg:bottom-0 left-0 right-0 bg-dark-bg border-t border-dark-border px-4 py-3 z-20">
        <div className="flex items-end gap-3 max-w-2xl mx-auto">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="輸入訊息..."
            rows={1}
            className="flex-1 bg-dark-surface border border-dark-border rounded-2xl px-4 py-2.5 text-sm text-dark-text placeholder-dark-muted outline-none focus:border-velix-500 resize-none"
            style={{ maxHeight: 120 }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-velix-600 hover:bg-velix-700 text-white rounded-full p-2.5 disabled:opacity-40 transition-colors shrink-0"
          >
            {loading ? <LoadingSpinner size={18} /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  )
}
