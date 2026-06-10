import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { signIn, signInWithGoogle, completeGoogleSignup, cancelGoogleSignup, getSavedAccounts } from '../services/authService'
import type { SavedAccount } from '../services/authService'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import AccountSwitcher from '../components/AccountSwitcher'
import TermsContent from '../components/TermsContent'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(true)
  const [loading, setLoading] = useState(false)

  // Terms overlay for new Google users
  const [showTerms, setShowTerms] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [pendingUid, setPendingUid] = useState('')

  // Account switcher
  const [showSwitcher, setShowSwitcher] = useState(false)
  const [switcherAccounts, setSwitcherAccounts] = useState<SavedAccount[]>([])

  useEffect(() => {
    const prefill = (location.state as any)?.prefillEmail
    if (prefill) setEmail(prefill)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password, keepLoggedIn)
      navigate('/')
      toast.success(t('auth.welcomeBack'))
    } catch (err: any) {
      const code: string = err.code ?? ''
      let message: string
      switch (code) {
        case 'auth/user-not-found': message = t('auth.accountNotFound'); break
        case 'auth/wrong-password': message = t('auth.wrongPassword'); break
        case 'auth/invalid-email': message = t('auth.invalidEmail'); break
        case 'auth/too-many-requests': message = t('auth.tooManyRequests'); break
        default: message = t('auth.loginFailed')
      }
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    try {
      const { user, isNewUser } = await signInWithGoogle()
      if (isNewUser) {
        setPendingUid(user.uid)
        setTermsAgreed(false)
        setShowTerms(true)
      } else {
        navigate('/')
        toast.success(t('auth.welcomeBack'))
      }
    } catch {
      toast.error(t('auth.googleFailed'))
    } finally {
      setLoading(false)
    }
  }

  async function handleTermsAccept() {
    setLoading(true)
    try {
      await completeGoogleSignup()
      setShowTerms(false)
      navigate('/settings')
      toast.success(t('auth.welcomeToVelix'))
    } catch {
      toast.error(t('auth.googleFailed'))
    } finally {
      setLoading(false)
    }
  }

  async function handleTermsDecline() {
    setLoading(true)
    try {
      await cancelGoogleSignup(pendingUid)
      setShowTerms(false)
      toast(t('auth.cancelledAccountNotCreated'))
    } catch {
      toast.error(t('auth.googleFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-[calc(100dvh-56px)] flex flex-col justify-center px-6 py-10">
        <div className="w-full max-w-sm mx-auto">

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-velix-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-velix-900/50">
              <span className="text-white text-2xl font-black">V</span>
            </div>
            <h1 className="text-2xl font-bold text-dark-text">{t('auth.welcomeBack')}</h1>
            <p className="text-sm text-dark-muted mt-1">{t('auth.loginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-xs text-dark-muted mb-1.5 pl-1">{t('auth.password')}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                className="input-field"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-sm text-dark-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={e => setKeepLoggedIn(e.target.checked)}
                  className="accent-velix-500"
                />
                {t('auth.keepLoggedIn')}
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 rounded-xl text-base mt-2">
              {loading ? <LoadingSpinner size={20} /> : t('auth.loginBtn')}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-dark-border" />
            <span className="text-xs text-dark-muted">{t('auth.orUseOther')}</span>
            <div className="flex-1 border-t border-dark-border" />
          </div>

          <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-dark-border hover:bg-dark-surface transition-colors text-sm font-medium text-dark-text">
            <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t('auth.googleLogin')}
          </button>

          <button
            type="button"
            onClick={() => {
              const accounts = getSavedAccounts()
              if (accounts.length === 0) {
                navigate('/register')
              } else {
                setSwitcherAccounts(accounts)
                setShowSwitcher(true)
              }
            }}
            disabled={loading}
            className="w-full text-center text-sm text-dark-muted hover:text-velix-400 transition-colors mt-3 py-1.5"
          >
            {t('auth.switchAccount')}
          </button>

          <p className="text-center text-sm text-dark-muted mt-8">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-velix-400 font-medium hover:underline">{t('auth.freeRegister')}</Link>
          </p>
        </div>
      </div>

      {showSwitcher && (
        <AccountSwitcher
          accounts={switcherAccounts}
          onClose={() => setShowSwitcher(false)}
          onSelect={account => {
            setShowSwitcher(false)
            if (account.provider === 'google') {
              handleGoogle()
            } else {
              setEmail(account.email)
            }
          }}
          onAddNew={() => { setShowSwitcher(false); navigate('/register') }}
        />
      )}

      {/* Terms overlay for new Google users */}
      {showTerms && (
        <div className="fixed inset-0 z-50 bg-dark-bg flex flex-col overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center px-6 py-10">
            <div className="w-full max-w-sm mx-auto">

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-velix-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-velix-900/50">
                  <span className="text-white text-2xl font-black">V</span>
                </div>
                <h2 className="text-xl font-bold text-dark-text">{t('auth.readBeforeJoin')}</h2>
                <p className="text-sm text-dark-muted mt-1">{t('auth.googleTermsSubtitle')}</p>
              </div>

              <div className="bg-dark-surface border border-dark-border rounded-2xl p-5 h-64 overflow-y-auto">
                <TermsContent />
              </div>

              <p className="flex items-center justify-center gap-1 text-xs text-dark-muted mt-2">
                <ChevronDown size={13} /> {t('auth.scrollToRead')}
              </p>

              <label className="flex items-start gap-3 mt-4 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={e => setTermsAgreed(e.target.checked)}
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
                onClick={handleTermsAccept}
                disabled={!termsAgreed || loading}
                className="btn-primary w-full py-3.5 mt-4 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <LoadingSpinner size={20} /> : t('auth.agreeAndCreate')}
              </button>

              <button
                onClick={handleTermsDecline}
                disabled={loading}
                className="w-full text-center text-sm text-dark-muted hover:text-red-400 transition-colors mt-3 py-2"
              >
                {t('auth.declineCancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
