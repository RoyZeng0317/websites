import { useState } from 'react'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { Flame, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { auth } from '../firebase'

interface Props { onRegister: () => void }

export default function LoginPage({ onRegister }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const withGoogle = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (e: unknown) {
      toast.error((e as Error).message || 'Google 登入失敗')
    } finally { setLoading(false) }
  }

  const withEmail = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!email || !password) { toast.error('請填寫電子郵件和密碼'); return }
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (e: unknown) {
      toast.error((e as Error).message || '登入失敗')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-950 px-4 py-8">
      <div className="w-full max-w-sm bg-gray-900 rounded-2xl border border-gray-800 p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500/10 rounded-full mb-3">
            <Flame className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">P Chats</h1>
          <p className="text-xs text-gray-500 mt-1">端到端加密 · 訊息不存伺服器 · 閱後即焚</p>
        </div>

        {/* Google */}
        <button
          onClick={withGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-700 rounded-xl py-3 text-sm font-medium text-gray-200 hover:bg-gray-800 transition-colors disabled:opacity-50 mb-5"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          使用 Google 帳號登入
        </button>

        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-gray-900 text-gray-500">或使用帳號密碼</span>
          </div>
        </div>

        <form onSubmit={withEmail} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email" placeholder="電子郵件" value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type={showPw ? 'text' : 'password'} placeholder="密碼" value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-medium text-sm hover:bg-orange-600 active:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center">
            {loading
              ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : '登入'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          還沒有帳號？{' '}
          <button onClick={onRegister} className="text-orange-500 font-medium hover:underline">點此註冊</button>
        </p>
      </div>
    </div>
  )
}
