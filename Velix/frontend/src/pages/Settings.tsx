import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, X, Globe, Instagram, Youtube, Link2, FileText, ShieldCheck, ShieldX, Clock, AlertTriangle, LogIn } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { updateUserProfile, deleteAccount, isUsernameAvailable, getAuthProvider, reauthWithEmail, reauthWithGoogle, logOut, getSavedAccounts } from '../services/authService'
import type { SavedAccount } from '../services/authService'
import { uploadAvatar, uploadIdDocument } from '../services/storageService'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { SocialLink, SocialPlatform } from '../types'
import Avatar from '../components/Avatar'
import LoadingSpinner from '../components/LoadingSpinner'
import AccountSwitcher from '../components/AccountSwitcher'
import LanguageSwitcher from '../components/LanguageSwitcher'
import toast from 'react-hot-toast'

export default function Settings() {
  const { firebaseUser, userDoc } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [displayName, setDisplayName] = useState(userDoc?.displayName || '')
  const [username, setUsername] = useState(userDoc?.username || '')
  const [bio, setBio] = useState(userDoc?.bio || '')
  const [isPrivate, setIsPrivate] = useState(userDoc?.isPrivate || false)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(userDoc?.socialLinks || [])
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>(userDoc?.photoUrl || '')
  const [saving, setSaving] = useState(false)
  const [newLinkPlatform, setNewLinkPlatform] = useState<SocialPlatform>('custom')
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [newLinkLabel, setNewLinkLabel] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const idFileRef = useRef<HTMLInputElement>(null)
  const [idFile, setIdFile] = useState<File | null>(null)
  const [idPreview, setIdPreview] = useState<string>('')
  const [idSubmitting, setIdSubmitting] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    userDoc?.verificationStatus || null
  )
  const [showSwitcher, setShowSwitcher] = useState(false)
  const [switcherAccounts, setSwitcherAccounts] = useState<SavedAccount[]>([])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  function handleIdFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIdFile(file)
    setIdPreview(URL.createObjectURL(file))
  }

  async function handleSubmitVerification() {
    if (!firebaseUser || !idFile) return
    setIdSubmitting(true)
    try {
      const imageUrl = await uploadIdDocument(idFile, firebaseUser.uid)
      await setDoc(doc(db, 'verifications', firebaseUser.uid), {
        uid: firebaseUser.uid,
        idImageUrl: imageUrl,
        status: 'pending',
        submittedAt: serverTimestamp(),
      })
      setVerificationStatus('pending')
      setIdFile(null)
      setIdPreview('')
      toast.success(t('settings.verificationSubmitted'))
    } catch {
      toast.error(t('settings.verificationFailed'))
    } finally {
      setIdSubmitting(false)
    }
  }

  function buildUrl(platform: SocialPlatform, input: string): string {
    const raw = input.trim()
    if (!raw) return ''
    // Already a full URL
    if (/^https?:\/\//i.test(raw)) return raw
    // Contains a slash → treat as domain/path, prepend https
    if (raw.includes('/')) return 'https://' + raw.replace(/^\/+/, '')
    // Plain username — strip leading @
    const username = raw.replace(/^@+/, '')
    switch (platform) {
      case 'instagram': return `https://instagram.com/${username}`
      case 'threads':   return `https://threads.net/@${username}`
      case 'twitter':   return `https://x.com/${username}`
      case 'tiktok':    return `https://tiktok.com/@${username}`
      case 'youtube':   return `https://youtube.com/@${username}`
      default:          return username.includes('.') ? 'https://' + username : username
    }
  }

  function addSocialLink() {
    if (!newLinkUrl.trim() || socialLinks.length >= 5) return
    setSocialLinks(prev => [...prev, {
      platform: newLinkPlatform,
      url: buildUrl(newLinkPlatform, newLinkUrl),
      label: newLinkLabel.trim() || undefined,
    }])
    setNewLinkUrl('')
    setNewLinkLabel('')
  }

  const urlPreview = buildUrl(newLinkPlatform, newLinkUrl)

  async function handleSave() {
    if (!firebaseUser) return
    if (!displayName.trim()) { toast.error(t('settings.displayNameRequired')); return }
    if (username.trim().length < 3) { toast.error(t('settings.usernameTooShort')); return }
    if (!/^[a-z0-9_.]+$/.test(username.trim())) { toast.error(t('settings.usernameInvalid')); return }

    setSaving(true)
    try {
      const available = await isUsernameAvailable(username.trim(), firebaseUser.uid)
      if (!available) { toast.error(t('settings.usernameTaken')); setSaving(false); return }

      let photoUrl = userDoc?.photoUrl || ''
      if (avatarFile) {
        photoUrl = await uploadAvatar(avatarFile, firebaseUser.uid)
      }

      await updateUserProfile(firebaseUser.uid, {
        displayName: displayName.trim(),
        username: username.trim(),
        bio: bio.trim(),
        isPrivate,
        photoUrl,
        socialLinks,
      })
      toast.success(t('settings.saved'))
    } catch {
      toast.error(t('settings.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [reauthPassword, setReauthPassword] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function handleDeleteAccount() {
    setShowDeleteModal(true)
  }

  async function confirmDelete() {
    if (!firebaseUser) return
    setDeleteLoading(true)
    try {
      await deleteAccount(firebaseUser.uid)
      navigate('/login')
      toast.success(t('settings.accountDeleted'))
    } catch (err: any) {
      if (err?.code === 'auth/requires-recent-login') {
        // Need re-authentication
        const provider = getAuthProvider()
        try {
          if (provider === 'google') {
            await reauthWithGoogle()
          } else {
            if (!reauthPassword) {
              toast.error(t('settings.passwordRequired'))
              setDeleteLoading(false)
              return
            }
            await reauthWithEmail(reauthPassword)
          }
          // Retry deletion after re-auth
          await deleteAccount(firebaseUser.uid)
          navigate('/login')
          toast.success(t('settings.accountDeleted'))
        } catch (reauthErr: any) {
          if (reauthErr?.code === 'auth/wrong-password' || reauthErr?.code === 'auth/invalid-credential') {
            toast.error(t('settings.passwordWrong'))
          } else if (reauthErr?.code === 'auth/popup-closed-by-user') {
            toast.error(t('settings.googleAuthCancelled'))
          } else {
            toast.error(t('settings.authFailed'))
          }
        }
      } else {
        toast.error(t('settings.deleteFailed'))
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  const platformIcons: Record<SocialPlatform, React.ReactNode> = {
    instagram: <Instagram size={14} />,
    threads: <Link2 size={14} />,
    twitter: <Link2 size={14} />,
    tiktok: <Link2 size={14} />,
    youtube: <Youtube size={14} />,
    custom: <Globe size={14} />,
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="sticky top-0 z-30 bg-dark-bg/80 backdrop-blur border-b border-dark-border px-4 h-14 flex items-center justify-between">
        <span className="font-bold text-dark-text">{t('settings.editProfile')}</span>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-1.5 px-5 flex items-center gap-2">
          {saving ? <LoadingSpinner size={16} /> : t('common.save')}
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <button onClick={() => fileRef.current?.click()}>
            <Avatar src={avatarPreview} name={displayName} size={72} />
          </button>
          <div>
            <button onClick={() => fileRef.current?.click()} className="text-sm text-velix-400 hover:underline">
              {t('settings.changeAvatar')}
            </button>
            <p className="text-xs text-dark-muted mt-1">{t('settings.avatarHint')}</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-dark-muted mb-1 block">{t('settings.displayName')}</label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs text-dark-muted mb-1 block">{t('settings.username')}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted text-sm">@</span>
              <input
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                className="input-field pl-8"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-dark-muted mb-1 block">{t('settings.bio')}</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              maxLength={200}
              className="input-field resize-none"
              placeholder={t('settings.bioPlaceholder')}
            />
          </div>
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text font-medium">{t('settings.privateAccount')}</p>
              <p className="text-xs text-dark-muted">{t('settings.privateAccountHint')}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPrivate(v => !v)}
              className={`w-11 h-6 rounded-full transition-colors ${isPrivate ? 'bg-velix-600' : 'bg-dark-border'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full mx-0.5 transition-transform ${isPrivate ? 'translate-x-5' : ''}`} />
            </button>
          </label>
        </div>

        {/* Social links */}
        <div>
          <p className="text-sm font-semibold text-dark-text mb-3">{t('settings.socialLinks', { count: socialLinks.length })}</p>
          <div className="space-y-2">
            {socialLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-2 bg-dark-surface border border-dark-border rounded-xl px-3 py-2">
                <span className="text-dark-muted">{platformIcons[link.platform]}</span>
                <span className="flex-1 text-sm text-dark-text truncate">{link.label || link.url}</span>
                <button onClick={() => setSocialLinks(prev => prev.filter((_, j) => j !== i))} className="text-dark-muted hover:text-red-400">
                  <X size={14} />
                </button>
              </div>
            ))}
            {socialLinks.length < 5 && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select value={newLinkPlatform} onChange={e => setNewLinkPlatform(e.target.value as SocialPlatform)} className="input-field text-sm py-2 w-32">
                    <option value="instagram">Instagram</option>
                    <option value="threads">Threads</option>
                    <option value="twitter">X</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="custom">{t('settings.customPlatform')}</option>
                  </select>
                  <input value={newLinkLabel} onChange={e => setNewLinkLabel(e.target.value)} placeholder={t('settings.displayNameLabel')} className="input-field text-sm py-2 flex-1" />
                </div>
                <div className="flex gap-2">
                  <input
                    value={newLinkUrl}
                    onChange={e => setNewLinkUrl(e.target.value)}
                    placeholder={newLinkPlatform === 'custom' ? 'example.com' : t('settings.usernameOrUrl')}
                    className="input-field text-sm py-2 flex-1"
                  />
                  <button onClick={addSocialLink} disabled={!newLinkUrl.trim()} className="btn-outline text-sm py-2 px-3">
                    <Plus size={16} />
                  </button>
                </div>
                {newLinkUrl.trim() && (
                  <p className="text-xs text-dark-muted pl-1 truncate">
                    → <span className="text-velix-400">{urlPreview}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Identity Verification */}
        <div className="pt-4 border-t border-dark-border">
          <p className="text-sm font-semibold text-dark-text mb-1">{t('settings.identity')}</p>
          <p className="text-xs text-dark-muted mb-3">{t('settings.identityHint')}</p>

          {verificationStatus === 'verified' && (
            <div className="flex items-center gap-2 text-sm text-green-400 bg-green-900/20 border border-green-800/40 rounded-xl px-4 py-3">
              <ShieldCheck size={16} /> {t('settings.verified')}
            </div>
          )}

          {verificationStatus === 'pending' && (
            <div className="flex items-center gap-2 text-sm text-yellow-400 bg-yellow-900/20 border border-yellow-800/40 rounded-xl px-4 py-3">
              <Clock size={16} /> {t('settings.pending')}
            </div>
          )}

          {(verificationStatus === 'rejected' || !verificationStatus) && (
            <div className="space-y-3">
              {verificationStatus === 'rejected' && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3">
                  <ShieldX size={16} /> {t('settings.rejected')}
                </div>
              )}
              <input ref={idFileRef} type="file" accept="image/*" onChange={handleIdFileChange} className="hidden" />
              {idPreview ? (
                <div className="relative">
                  <img src={idPreview} className="w-full rounded-xl border border-dark-border max-h-48 object-cover" />
                  <button onClick={() => { setIdFile(null); setIdPreview('') }} className="absolute top-2 right-2 bg-dark-bg/80 rounded-full p-1 text-dark-muted hover:text-red-400">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button onClick={() => idFileRef.current?.click()} className="w-full border border-dashed border-dark-border rounded-xl py-6 text-sm text-dark-muted hover:border-velix-500 hover:text-velix-400 transition-colors">
                  {t('settings.uploadIdDoc')}
                </button>
              )}
              {idFile && (
                <button onClick={handleSubmitVerification} disabled={idSubmitting} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                  {idSubmitting ? <LoadingSpinner size={16} /> : <ShieldCheck size={16} />}
                  {idSubmitting ? t('settings.submitting') : t('settings.submitVerification')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Policy */}
        <div className="pt-4 border-t border-dark-border">
          <Link
            to="/policy"
            className="flex items-center gap-3 w-full py-2.5 text-sm text-dark-muted hover:text-dark-text transition-colors"
          >
            <FileText size={16} />
            {t('settings.policyAndRules')}
          </Link>
        </div>
        {/* Switch account */}
        <div className="pt-4 border-t border-dark-border">
          <button
            onClick={() => {
              const others = getSavedAccounts().filter(a => a.uid !== firebaseUser?.uid)
              if (others.length === 0) {
                logOut().then(() => navigate('/register'))
              } else {
                setSwitcherAccounts(others)
                setShowSwitcher(true)
              }
            }}
            className="flex items-center gap-3 w-full py-2.5 text-sm text-dark-muted hover:text-dark-text transition-colors"
          >
            <LogIn size={16} />
            {t('settings.switchAccount')}
          </button>
        </div>
        {/* Language */}
        <LanguageSwitcher />

        {/* Logout + Delete */}
        <div className="pt-2 border-t border-dark-border space-y-3">
          <button
            onClick={async () => { await logOut(); navigate('/login') }}
            className="w-full text-center text-sm text-dark-muted hover:text-dark-text py-2"
          >
            {t('settings.logout')}
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full text-center text-sm text-red-400 hover:text-red-300 py-2"
          >
            {t('settings.deleteAccount')}
          </button>
        </div>
      </div>

      {/* Delete account modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-dark-surface rounded-2xl w-full max-w-sm p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-dark-text">{t('settings.confirmDelete')}</p>
                <p className="text-xs text-dark-muted mt-0.5">{t('settings.deleteWarning')}</p>
              </div>
            </div>

            {/* Email provider: ask for password */}
            {getAuthProvider() === 'email' && (
              <div>
                <label className="text-xs text-dark-muted mb-1.5 block">{t('settings.enterPasswordConfirm')}</label>
                <input
                  type="password"
                  value={reauthPassword}
                  onChange={e => setReauthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field text-sm"
                  autoComplete="current-password"
                />
              </div>
            )}

            {/* Google provider: info text */}
            {getAuthProvider() === 'google' && (
              <p className="text-sm text-dark-muted bg-dark-bg rounded-xl px-4 py-3">
                {t('settings.googleDeleteHint')}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setReauthPassword('') }}
                className="flex-1 btn-outline text-sm py-2.5"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading || (getAuthProvider() === 'email' && !reauthPassword)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {deleteLoading ? <LoadingSpinner size={16} /> : t('settings.confirmDeleteBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSwitcher && (
        <AccountSwitcher
          accounts={switcherAccounts}
          onClose={() => setShowSwitcher(false)}
          onSelect={async account => {
            setShowSwitcher(false)
            await logOut()
            navigate('/login', { state: { prefillEmail: account.email } })
          }}
          onAddNew={async () => {
            setShowSwitcher(false)
            await logOut()
            navigate('/register')
          }}
        />
      )}
    </div>
  )
}
