import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang, type Lang } from '../context/LangContext'
import { apiJson } from '../lib/api'

export default function Settings() {
  const { user, signOut } = useAuth()
  const { t, lang, setLang } = useLang()
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' })
  const [pwdState, setPwdState] = useState<{ loading: boolean; ok: boolean; err: string }>({ loading: false, ok: false, err: '' })

  const [tfEnabled, setTfEnabled] = useState<boolean | null>(null)
  const [showTf, setShowTf] = useState(false)
  const [tfCode, setTfCode] = useState('')
  const [tfState, setTfState] = useState<{ loading: boolean; ok: boolean; err: string }>({ loading: false, ok: false, err: '' })

  useEffect(() => {
    apiJson<{ enabled: boolean }>('/api/2fa/status').then(d => setTfEnabled(d.enabled)).catch(() => {})
  }, [])

  async function handleTfEnable(e: React.FormEvent) {
    e.preventDefault()
    setTfState({ loading: true, ok: false, err: '' })
    try {
      await apiJson('/api/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: tfCode.replace(/\s/g, '') }),
      })
      setTfEnabled(true)
      setTfState({ loading: false, ok: true, err: '' })
      setTfCode('')
      setTimeout(() => { setTfState(s => ({ ...s, ok: false })); setShowTf(false) }, 2000)
    } catch (err: unknown) {
      setTfState({ loading: false, ok: false, err: (err as { message?: string }).message ?? t.enableFailed })
    }
  }

  async function handleTfDisable(e: React.FormEvent) {
    e.preventDefault()
    setTfState({ loading: true, ok: false, err: '' })
    try {
      await apiJson('/api/2fa/disable', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: tfCode.replace(/\s/g, '') }),
      })
      setTfEnabled(false)
      setTfState({ loading: false, ok: true, err: '' })
      setTfCode('')
      setTimeout(() => { setTfState(s => ({ ...s, ok: false })); setShowTf(false) }, 2000)
    } catch (err: unknown) {
      setTfState({ loading: false, ok: false, err: (err as { message?: string }).message ?? t.disableFailed })
    }
  }

  function handleTfCodeChange(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 6)
    setTfCode(digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim())
  }

  function handleSignOut() { signOut(); navigate('/login') }

  async function handleChangePwd(e: React.FormEvent) {
    e.preventDefault()
    if (pwdForm.next !== pwdForm.confirm) {
      setPwdState({ loading: false, ok: false, err: t.pwdMismatch })
      return
    }
    setPwdState({ loading: true, ok: false, err: '' })
    try {
      await apiJson('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwdForm.current, newPassword: pwdForm.next }),
      })
      setPwdState({ loading: false, ok: true, err: '' })
      setPwdForm({ current: '', next: '', confirm: '' })
      setTimeout(() => { setPwdState(s => ({ ...s, ok: false })); setShowPwd(false) }, 2000)
    } catch (err: unknown) {
      setPwdState({ loading: false, ok: false, err: err instanceof Error ? err.message : t.updateFailed })
    }
  }

  const pwdFieldLabel: Record<'current' | 'next' | 'confirm', string> = {
    current: t.curPwd,
    next: t.newPwd,
    confirm: t.confirmPwd,
  }

  return (
    <div className="min-h-dvh flex flex-col bg-gray-900 text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-white transition-colors">
          {t.backBtn}
        </button>
        <h1 className="text-xl font-bold text-orange-400">{t.settingsTitle}</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 p-6 space-y-4 max-w-md mx-auto w-full">
        {/* Account info */}
        <div className="bg-gray-800 rounded-xl p-4 space-y-3">
          <div>
            <p className="text-xs text-gray-400">{t.accountLabel}</p>
            <p className="text-white font-medium">{user?.username}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">{t.roleLabel}</p>
            <p className="text-white">{user?.role === 'admin' ? t.roleAdmin : t.roleUser}</p>
          </div>
        </div>

        {/* Language */}
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-3">{t.language}</p>
          <div className="grid grid-cols-2 gap-2">
            {(['zh', 'en'] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  lang === l
                    ? 'border-orange-400 bg-orange-400/10 text-orange-400'
                    : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                }`}
              >
                {l === 'zh' ? t.langZh : t.langEn}
              </button>
            ))}
          </div>
        </div>

        {/* Change password */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <button
            onClick={() => { setShowPwd(v => !v); setPwdState({ loading: false, ok: false, err: '' }) }}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700/60 transition-colors"
          >
            <span className="font-medium">{t.changePassword}</span>
            <span className="text-gray-400 text-sm">{showPwd ? '▲' : '▼'}</span>
          </button>

          {showPwd && (
            <form onSubmit={handleChangePwd} className="px-4 pb-4 space-y-3 border-t border-gray-700 pt-3">
              {(['current', 'next', 'confirm'] as const).map(field => (
                <div key={field}>
                  <label className="text-xs text-gray-400 block mb-1">{pwdFieldLabel[field]}</label>
                  <input
                    type="password"
                    value={pwdForm[field]}
                    onChange={e => setPwdForm(f => ({ ...f, [field]: e.target.value }))}
                    required
                    minLength={field === 'current' ? 1 : 8}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  />
                </div>
              ))}
              {pwdState.err && <p className="text-red-400 text-xs">{pwdState.err}</p>}
              {pwdState.ok && <p className="text-green-400 text-xs">{t.pwdUpdated}</p>}
              <button
                type="submit"
                disabled={pwdState.loading}
                className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm transition-colors disabled:opacity-50"
              >
                {pwdState.loading ? t.updatingPwd : t.updatePwdBtn}
              </button>
            </form>
          )}
        </div>

        {/* 2FA */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <button
            onClick={() => { setShowTf(v => !v); setTfState({ loading: false, ok: false, err: '' }); setTfCode('') }}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">{t.tfSetting}</span>
              {tfEnabled !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tfEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-400'}`}>
                  {tfEnabled ? t.tfEnabled : t.tfDisabled}
                </span>
              )}
            </div>
            <span className="text-gray-400 text-sm">{showTf ? '▲' : '▼'}</span>
          </button>

          {showTf && (
            <div className="px-4 pb-4 border-t border-gray-700 pt-3 space-y-3">
              {!tfEnabled ? (
                <>
                  <div className="bg-gray-900/60 rounded-lg p-3 text-xs text-gray-400 space-y-1.5 leading-relaxed">
                    <p className="text-gray-300 font-medium">{t.tfSetupTitle}</p>
                    <p>{t.tfStep1}</p>
                    <p>{t.tfStep2}</p>
                    <p>{t.tfStep3}</p>
                    <p>{t.tfStep4}</p>
                  </div>
                  <form onSubmit={handleTfEnable} className="space-y-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="XX XX XX"
                      value={tfCode}
                      onChange={e => handleTfCodeChange(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-center text-lg font-mono tracking-widest focus:outline-none focus:border-orange-400"
                    />
                    {tfState.err && <p className="text-red-400 text-xs">{tfState.err}</p>}
                    {tfState.ok && <p className="text-green-400 text-xs">{t.tfEnabledMsg}</p>}
                    <button
                      type="submit"
                      disabled={tfState.loading || tfCode.replace(/\s/g, '').length < 6}
                      className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {tfState.loading ? t.enabling : t.enableTfBtn}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <p className="text-xs text-gray-400">{t.disableHint}</p>
                  <form onSubmit={handleTfDisable} className="space-y-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="XX XX XX"
                      value={tfCode}
                      onChange={e => handleTfCodeChange(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-center text-lg font-mono tracking-widest focus:outline-none focus:border-orange-400"
                    />
                    {tfState.err && <p className="text-red-400 text-xs">{tfState.err}</p>}
                    {tfState.ok && <p className="text-green-400 text-xs">{t.tfDisabledMsg}</p>}
                    <button
                      type="submit"
                      disabled={tfState.loading || tfCode.replace(/\s/g, '').length < 6}
                      className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {tfState.loading ? t.disabling : t.disableTfBtn}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>

        {/* Admin */}
        {user?.role === 'admin' && (
          <div className="space-y-2">
            <button
              onClick={() => navigate('/admin')}
              className="w-full py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
            >
              {t.adminUsers}
            </button>
            <button
              onClick={() => navigate('/system')}
              className="w-full py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
            >
              {t.systemSettings}
            </button>
            <button
              onClick={() => navigate('/docker')}
              className="w-full py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
            >
              Docker Containers
            </button>
            <button
              onClick={() => navigate('/fail2ban')}
              className="w-full py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
            >
              Fail2ban
            </button>

          </div>
        )}

        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
        >
          {t.signOut}
        </button>
      </main>
    </div>
  )
}
