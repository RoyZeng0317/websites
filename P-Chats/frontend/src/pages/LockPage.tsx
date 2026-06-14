import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { sessionLock } from '../lib/sessionLock'

export default function LockPage() {
  const { peerId } = useParams<{ peerId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const isSetup = !sessionLock.hasPassword()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [obscure, setObscure] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (!password) { setError('請輸入密碼'); return }
    setLoading(true)
    setError(null)
    try {
      if (isSetup) {
        if (password !== confirm) { setError('兩次密碼不一致'); return }
        await sessionLock.setPassword(password)
        sessionLock.markUnlocked(peerId!)
        navigate(`/chat/${peerId}`, { state: location.state, replace: true })
      } else {
        const ok = await sessionLock.verify(password)
        if (ok) {
          sessionLock.markUnlocked(peerId!)
          navigate(`/chat/${peerId}`, { state: location.state, replace: true })
        } else {
          setError('密碼錯誤，請再試一次')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-white px-8">
      <div className="w-full max-w-sm flex flex-col items-center">
        <Lock size={64} className="text-orange-500 mb-6" />
        <h2 className="text-xl font-bold mb-2">
          {isSetup ? '設定聊天室密碼' : '輸入聊天室密碼'}
        </h2>
        <p className="text-gray-500 text-sm mb-8 text-center">
          {isSetup ? '此密碼保護所有加密聊天室，請妥善保存。' : '輸入密碼以進入加密聊天室。'}
        </p>

        <div className="w-full space-y-4">
          <div className="relative">
            <input
              type={obscure ? 'password' : 'text'}
              placeholder="密碼"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(null) }}
              onKeyDown={e => !isSetup && e.key === 'Enter' && submit()}
              className="w-full border rounded-lg px-4 py-3 pr-12 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={() => setObscure(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {obscure ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {isSetup && (
            <input
              type={obscure ? 'password' : 'text'}
              placeholder="確認密碼"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setError(null) }}
              onKeyDown={e => e.key === 'Enter' && submit()}
              className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            />
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-orange-500 text-white rounded-lg py-3 font-medium hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? '驗證中…' : isSetup ? '設定密碼' : '解鎖'}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  )
}
