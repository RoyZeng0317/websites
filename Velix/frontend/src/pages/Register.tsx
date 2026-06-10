import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { signUp, signInWithGoogle, completeGoogleSignup } from '../services/authService'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import TermsContent from '../components/TermsContent'

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState<'rules' | 'form'>('rules')
  const [agreed, setAgreed] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { toast.error(t('auth.passwordMismatch')); return }
    if (password.length < 6) { toast.error(t('auth.passwordTooShort')); return }
    setLoading(true)
    try {
      await signUp(email, password, name)
      navigate('/')
      toast.success(t('auth.welcomeToVelix'))
    } catch (err: any) {
      toast.error(err.code === 'auth/email-already-in-use' ? t('auth.emailInUse') : t('auth.registerFailed'))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    try {
      const { isNewUser } = await signInWithGoogle()
      if (isNewUser) await completeGoogleSignup()
      navigate('/')
      toast.success(t('auth.welcomeToVelix'))
    } catch {
      toast.error(t('auth.googleFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100dvh-56px)] flex flex-col justify-center px-6 py-10">
      <div className="w-full max-w-sm mx-auto">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-velix-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-velix-900/50">
            <span className="text-white text-2xl font-black">V</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-text">
            {step === 'rules' ? t('auth.joinVelix') : t('auth.createAccount')}
          </h1>
          <p className="text-sm text-dark-muted mt-1">
            {step === 'rules' ? t('auth.readRulesFirst') : t('auth.fillInfoToRegister')}
          </p>
        </div>

        {step === 'rules' ? (
          <div>
            <div className="bg-dark-surface border border-dark-border rounded-2xl p-5 h-64 overflow-y-auto">
              <TermsContent />
            </div>

            <p className="flex items-center justify-center gap-1 text-xs text-dark-muted mt-2">
              <ChevronDown size={13} /> {t('auth.scrollToRead')}
            </p>

            <label className="flex items-start gap-3 mt-4 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 accent-velix-500 w-4 h-4 shrink-0 cursor-pointer"
              />
              <span className="text-sm text-dark-muted leading-relaxed">
                {t('auth.agreeTerms')}{' '}
                <span className="text-velix-400">{t('auth.communityGuidelines')}</span>、
                <span className="text-velix-400">{t('auth.termsOfService')}</span>
                、<span className="text-velix-400">{t('auth.privacyPolicy')}</span>
              </span>
            </label>

            <button
              onClick={() => setStep('form')}
              disabled={!agreed}
              className="btn-primary w-full py-3.5 mt-4 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('auth.agreeAndContinue')}
            </button>

            <p className="text-center text-sm text-dark-muted mt-4">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-velix-400 font-medium hover:underline">{t('auth.loginBtn')}</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-dark-muted mb-1.5 pl-1">{t('auth.displayName')}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('auth.displayNamePlaceholder')}
                className="input-field"
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-dark-muted mb-1.5 pl-1">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                className="input-field"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-dark-muted mb-1.5 pl-1">{t('auth.passwordMin')}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                className="input-field"
                autoComplete="new-password"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-dark-muted mb-1.5 pl-1">{t('auth.confirmPassword')}</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                className="input-field"
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 rounded-xl mt-2">
              {loading ? <LoadingSpinner size={20} /> : t('auth.createAccount')}
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 border-t border-dark-border" />
              <span className="text-xs text-dark-muted">{t('auth.orUseGoogle')}</span>
              <div className="flex-1 border-t border-dark-border" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-dark-border hover:bg-dark-surface transition-colors text-sm font-medium text-dark-text"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('auth.googleRegister')}
            </button>

            <button
              type="button"
              onClick={() => setStep('rules')}
              className="w-full text-center text-sm text-dark-muted hover:text-dark-text transition-colors py-1"
            >
              {t('auth.backToRules')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
