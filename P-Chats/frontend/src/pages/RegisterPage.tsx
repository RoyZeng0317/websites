import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { auth } from '../firebase'

interface Props { onBack: () => void }

export default function RegisterPage({ onBack }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const register = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!name || !email || !password || !confirm) { toast.error('請填寫所有欄位'); return }
    if (password !== confirm) { toast.error('兩次輸入的密碼不一致'); return }
    if (password.length < 6) { toast.error('密碼長度至少 6 個字元'); return }

    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: name })
    } catch (e: unknown) {
      const code = (e as { code?: string }).code
      if (code === 'auth/email-already-in-use') toast.error('此電子郵件已被使用')
      else if (code === 'auth/invalid-email') toast.error('電子郵件格式不正確')
      else if (code === 'auth/weak-password') toast.error('密碼強度不足')
      else toast.error((e as Error).message || '註冊失敗')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> 返回登入
        </button>

        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-full mb-3">
            <User className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">建立帳號</h1>
        </div>

        <form onSubmit={register} className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="顯示名稱" value={name}
              onChange={e => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email" placeholder="電子郵件" value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPw ? 'text' : 'password'} placeholder="密碼（至少 6 字元）" value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPw ? 'text' : 'password'} placeholder="確認密碼" value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-medium text-sm hover:bg-orange-600 active:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center mt-1">
            {loading
              ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : '建立帳號'}
          </button>
        </form>
      </div>
    </div>
  )
}
