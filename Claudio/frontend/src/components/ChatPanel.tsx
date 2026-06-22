import { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '../types'
import './ChatPanel.css'

interface Props {
  messages: ChatMessage[]
  onSend: (text: string) => void
}

export function ChatPanel({ messages, onSend }: Props) {
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const submit = async () => {
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    setSending(true)
    await onSend(text)
    setSending(false)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="card chat-panel">
      <div className="chat-header">
        <span className="chat-title">LIVE CHAT</span>
        <span className="chat-count">{messages.length} 則訊息</span>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.role}`}>
            <div className="bubble-meta">
              <span className="bubble-role">
                {msg.role === 'dj' ? 'Claudio DJ' : '你'}
              </span>
              <span className="bubble-time">{fmtTime(msg.timestamp)}</span>
            </div>
            <p className="bubble-text">{msg.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          type="text"
          placeholder="輸入訊息…點歌、提問都可以"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={sending}
          maxLength={200}
        />
        <button
          className="send-btn"
          onClick={submit}
          disabled={!input.trim() || sending}
        >
          {sending ? '…' : '送出'}
        </button>
      </div>
    </div>
  )
}
