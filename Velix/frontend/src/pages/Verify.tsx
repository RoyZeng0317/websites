import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, ShieldX, Clock, X, FileText, Camera } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { uploadIdDocument, uploadSelfie } from '../services/storageService'
import { logOut } from '../services/authService'
import FaceCapture from '../components/FaceCapture'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

type Step = 'id-doc' | 'selfie' | 'submitting'

export default function Verify() {
  const { firebaseUser, userDoc, loading } = useAuth()
  const navigate = useNavigate()
  const idFileRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>('id-doc')
  const [idFile, setIdFile] = useState<File | null>(null)
  const [idPreview, setIdPreview] = useState('')
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [selfiePreview, setSelfiePreview] = useState('')
  const [rejectReason, setRejectReason] = useState<string | null>(null)

  useEffect(() => {
    if (loading) return
    if (!firebaseUser) { navigate('/login', { replace: true }); return }
    if (userDoc?.verificationStatus === 'verified') { navigate('/home', { replace: true }); return }
    if (userDoc?.verificationStatus === 'rejected') {
      getDoc(doc(db, 'verifications', firebaseUser.uid)).then(snap => {
        if (snap.exists()) setRejectReason(snap.data()?.rejectReason || null)
      })
    }
  }, [loading, firebaseUser, userDoc?.verificationStatus])

  async function handleSubmit() {
    if (!firebaseUser || !idFile || !selfieFile) return
    setStep('submitting')
    try {
      const [idImageUrl, selfieUrl] = await Promise.all([
        uploadIdDocument(idFile, firebaseUser.uid),
        uploadSelfie(selfieFile, firebaseUser.uid),
      ])
      await Promise.all([
        setDoc(doc(db, 'verifications', firebaseUser.uid), {
          uid: firebaseUser.uid,
          idImageUrl,
          selfieUrl,
          status: 'pending',
          submittedAt: serverTimestamp(),
        }),
        updateDoc(doc(db, 'users', firebaseUser.uid), { verificationStatus: 'pending' }),
      ])
      toast.success('已提交驗證申請，等待審核')
    } catch {
      toast.error('提交失敗，請稍後再試')
      setStep('selfie')
    }
  }

  async function handleLogout() {
    await logOut()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={32} />
      </div>
    )
  }

  const vs = userDoc?.verificationStatus

  // ── Pending screen ────────────────────────────────────────────────────────
  if (vs === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 text-center">
        <div className="w-20 h-20 bg-yellow-900/30 rounded-full flex items-center justify-center animate-pulse">
          <Clock size={36} className="text-yellow-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-dark-text mb-3">審核中</h1>
          <p className="text-sm text-dark-muted max-w-xs leading-relaxed">
            您的身份驗證申請正在審核中。<br />
            審核通過後將自動解鎖所有功能，通常在 24–48 小時內完成。
          </p>
        </div>
        <div className="w-full max-w-xs bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-xs text-dark-muted text-left space-y-1.5">
          <p>✅ 申請已送出，等待管理員審核</p>
          <p>⏳ 審核通過後會收到通知</p>
          <p>🔒 審核期間無法使用任何功能</p>
        </div>
        <button onClick={handleLogout} className="text-sm text-dark-muted hover:text-dark-text transition-colors mt-4">
          登出
        </button>
      </div>
    )
  }

  // ── Step indicator ────────────────────────────────────────────────────────
  function StepIndicator() {
    const steps = [
      { id: 'id-doc', icon: <FileText size={14} />, label: '上傳證件' },
      { id: 'selfie', icon: <Camera size={14} />, label: '人臉驗證' },
    ]
    const currentIdx = step === 'submitting' ? 1 : steps.findIndex(s => s.id === step)
    return (
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i < currentIdx ? 'bg-green-600 text-white' :
              i === currentIdx ? 'bg-velix-600 text-white' :
              'bg-dark-border text-dark-muted'
            }`}>
              {i < currentIdx ? '✓' : i + 1}
            </div>
            <span className={`text-xs ${i === currentIdx ? 'text-dark-text' : 'text-dark-muted'}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && <div className={`w-8 h-px ${i < currentIdx ? 'bg-green-600' : 'bg-dark-border'}`} />}
          </div>
        ))}
      </div>
    )
  }

  // ── Step 1: ID document ───────────────────────────────────────────────────
  if (step === 'id-doc') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-velix-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={28} className="text-velix-400" />
            </div>
            <h1 className="text-xl font-bold text-dark-text mb-1">需要身份驗證</h1>
            <p className="text-xs text-dark-muted">完成兩步驟驗證後即可使用 Velix</p>
          </div>

          <StepIndicator />

          {vs === 'rejected' && (
            <div className="flex items-start gap-3 text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3 mb-5">
              <ShieldX size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">審核未通過，請重新提交</p>
                {rejectReason && <p className="text-xs mt-1 text-red-300/80">原因：{rejectReason}</p>}
              </div>
            </div>
          )}

          <p className="text-sm text-dark-muted mb-3">
            請上傳身份證、護照或其他政府核發的身份證明文件，<br />
            並在文件上標註浮水印「僅供velix平台使用」。
          </p>

          <div className="flex items-start gap-2 bg-yellow-900/20 border border-yellow-800/40 rounded-xl px-3 py-2.5 mb-4">
            <span className="text-yellow-400 text-base leading-none mt-0.5">⚠️</span>
            <p className="text-xs text-yellow-300/90 leading-relaxed">
              拍攝時請確保光線均勻，<strong>避免反光</strong>，以免文字模糊導致審核不通過。
            </p>
          </div>

          <input
            ref={idFileRef}
            type="file"
            accept="image/*"
            onChange={e => {
              const f = e.target.files?.[0]
              if (!f) return
              setIdFile(f)
              setIdPreview(URL.createObjectURL(f))
            }}
            className="hidden"
          />

          {idPreview ? (
            <div className="relative mb-4">
              <img src={idPreview} className="w-full rounded-xl border border-dark-border max-h-52 object-cover" />
              <button
                onClick={() => { setIdFile(null); setIdPreview('') }}
                className="absolute top-2 right-2 bg-dark-bg/80 rounded-full p-1 text-dark-muted hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => idFileRef.current?.click()}
              className="w-full border border-dashed border-dark-border rounded-xl py-10 text-sm text-dark-muted hover:border-velix-500 hover:text-velix-400 transition-colors mb-4"
            >
              點擊上傳身份證明文件
            </button>
          )}

          <button
            onClick={() => setStep('selfie')}
            disabled={!idFile}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3 disabled:opacity-50"
          >
            下一步：人臉驗證
          </button>

          <button onClick={handleLogout} className="w-full text-center text-sm text-dark-muted hover:text-dark-text transition-colors mt-3 py-2">
            登出
          </button>
        </div>
      </div>
    )
  }

  // ── Step 2: Face capture ──────────────────────────────────────────────────
  if (step === 'selfie') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-velix-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={28} className="text-velix-400" />
            </div>
            <h1 className="text-xl font-bold text-dark-text mb-1">人臉驗證</h1>
            <p className="text-xs text-dark-muted">請拍攝一張清晰的臉部照片</p>
          </div>

          <StepIndicator />

          {selfieFile && selfiePreview ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden border-4 border-green-500">
                <img src={selfiePreview} className="w-full h-full object-cover scale-x-[-1]" />
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => { setSelfieFile(null); setSelfiePreview('') }}
                  className="flex-1 py-2.5 rounded-xl border border-dark-border text-sm text-dark-muted hover:text-dark-text transition-colors"
                >
                  重拍
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-2.5"
                >
                  <ShieldCheck size={15} /> 提交驗證申請
                </button>
              </div>
            </div>
          ) : (
            <FaceCapture
              onCapture={file => {
                setSelfieFile(file)
                setSelfiePreview(URL.createObjectURL(file))
              }}
              onCancel={() => setStep('id-doc')}
            />
          )}
        </div>
      </div>
    )
  }

  // ── Submitting ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <LoadingSpinner size={36} />
      <p className="text-sm text-dark-muted">正在提交驗證資料...</p>
    </div>
  )
}
