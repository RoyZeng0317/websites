import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'
import { Flame, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [obscure, setObscure] = useState(true)
  const [loading, setLoading] = useState(false)

  async function handleGoogle() {
    setLoading(true)
    try { await signInWithGoogle() }
    catch (e) { toast.error(e instanceof FirebaseError ? (e.message ?? 'Google 登入失敗') : '登入失敗') }
    finally { setLoading(false) }
  }

  async function handleEmail() {
    if (!email.trim() || !password) { toast.error('請填寫電子郵件和密碼'); return }
    setLoading(true)
    try { await signInWithEmail(email.trim(), password) }
    catch (e) { toast.error(e instanceof FirebaseError ? (e.message ?? '登入失敗') : '登入失敗') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8 py-12 bg-white">
      <Flame size={72} className="text-orange-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">P Chats</h1>
      <p className="text-gray-400 text-sm mb-10 text-center">端到端加密 · 訊息不存伺服器 · 閱後即焚</p>

      <button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full max-w-sm flex items-center justify-center gap-2 border border-orange-400 rounded-lg py-3 text-sm font-medium hover:bg-orange-50 transition mb-6 disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        使用 Google 帳號登入
      </button>

      <div className="w-full max-w-sm flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-gray-400 text-sm">或使用帳號密碼</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="電子郵件"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
        />
        <div className="relative">
          <input
            type={obscure ? 'password' : 'text'}
            placeholder="密碼"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEmail()}
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

        <button
          onClick={handleEmail}
          disabled={loading}
          className="w-full bg-orange-500 text-white rounded-lg py-3 font-medium hover:bg-orange-600 transition disabled:opacity-50"
        >
          {loading ? '登入中…' : '登入'}
        </button>

        <button
          onClick={() => navigate('/register')}
          disabled={loading}
          className="w-full text-center text-sm text-orange-500 hover:underline"
        >
          還沒有帳號？點此註冊
        </button>
      </div>
    </div>
  )
}
