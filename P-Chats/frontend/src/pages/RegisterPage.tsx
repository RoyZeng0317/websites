import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'
import { UserPlus, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

function translateError(code: string, msg?: string): string {
  switch (code) {
    case 'auth/email-already-in-use': return '此電子郵件已被使用'
    case 'auth/invalid-email': return '電子郵件格式不正確'
    case 'auth/weak-password': return '密碼強度不足，請使用更複雜的密碼'
    default: return msg ?? '註冊失敗'
  }
}

export default function RegisterPage() {
  const { registerWithEmail } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [obscure, setObscure] = useState(true)
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      toast.error('請填寫所有欄位'); return
    }
    if (password !== confirm) { toast.error('兩次輸入的密碼不一致'); return }
    if (password.length < 6) { toast.error('密碼長度至少需要 6 個字元'); return }
    setLoading(true)
    try {
      await registerWithEmail(email.trim(), password, name.trim())
    } catch (e) {
      if (e instanceof FirebaseError) toast.error(translateError(e.code, e.message))
      else toast.error('註冊失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8 py-12 bg-white">
      <UserPlus size={64} className="text-orange-500 mb-6" />
      <h1 className="text-xl font-bold mb-8">建立帳號</h1>

      <div className="w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="顯示名稱"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
        />
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
            placeholder="密碼（至少 6 字元）"
            value={password}
            onChange={e => setPassword(e.target.value)}
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
        <input
          type={obscure ? 'password' : 'text'}
          placeholder="確認密碼"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleRegister()}
          className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-orange-500 text-white rounded-lg py-3 font-medium hover:bg-orange-600 transition disabled:opacity-50"
        >
          {loading ? '建立中…' : '建立帳號'}
        </button>

        <button
          onClick={() => navigate('/login')}
          className="w-full text-center text-sm text-orange-500 hover:underline"
        >
          已有帳號？返回登入
        </button>
      </div>
    </div>
  )
}
