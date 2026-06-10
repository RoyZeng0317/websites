import { useEffect, useRef, useState } from 'react'
import { X, Send } from 'lucide-react'
import { timeAgo } from '../lib/dateUtils'
import { useAuth } from '../context/AuthContext'
import { subscribeComments, addComment } from '../services/postService'
import type { CommentModel, PostModel } from '../types'
import Avatar from './Avatar'
import toast from 'react-hot-toast'
import { checkSensitive } from '../lib/sensitiveWords'

interface Props {
  post: PostModel
  onClose: () => void
}

export default function CommentSheet({ post, onClose }: Props) {
  const { firebaseUser, userDoc } = useAuth()
  const [comments, setComments] = useState<CommentModel[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const unsub = subscribeComments(post.id, setComments)
    return unsub
  }, [post.id])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleSend() {
    if (!text.trim() || !firebaseUser || !userDoc) return

    const sensitive = checkSensitive(text)
    if (sensitive.level === 2) {
      toast.error('留言含有違規字詞，無法送出', { duration: 4000 })
      return
    }
    if (sensitive.level === 1) {
      const ok = window.confirm(`留言含有不當字詞（${sensitive.matched.join('、')}），確定送出？`)
      if (!ok) return
    }

    setSending(true)
    try {
      await addComment(
        post.id,
        firebaseUser.uid,
        userDoc.displayName,
        userDoc.username,
        userDoc.photoUrl,
        text.trim(),
        post
      )
      setText('')
    } catch {
      toast.error('留言失敗')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-dark-surface w-full max-w-lg max-h-[80vh] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
          <span className="font-semibold text-dark-text">留言 ({post.commentsCount})</span>
          <button onClick={onClose} className="text-dark-muted hover:text-dark-text">
            <X size={20} />
          </button>
        </div>

        {/* Comments */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {comments.length === 0 && (
            <p className="text-center text-dark-muted text-sm py-8">還沒有留言，第一個留言吧！</p>
          )}
          {comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <Avatar src={c.authorPhotoUrl} name={c.authorName} size={32} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-dark-text">{c.authorName}</span>
                  <span className="text-xs text-dark-muted">
                    {timeAgo(c.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-dark-text mt-0.5 break-words">{c.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        {firebaseUser && (
          <div className="px-4 py-3 border-t border-dark-border flex gap-3 items-center">
            <Avatar src={userDoc?.photoUrl} name={userDoc?.displayName || ''} size={32} />
            <input
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="留言..."
              className="flex-1 bg-transparent text-sm text-dark-text placeholder-dark-muted outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || sending}
              className="text-velix-400 disabled:opacity-40 hover:text-velix-300 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
