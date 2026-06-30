import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  doc, setDoc, onSnapshot, updateDoc, Timestamp
} from 'firebase/firestore'
import { db } from '../firebase'

const QR_QUOTA = 10
const PASSWORD_QUOTA = 5

function generateSessionId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

function buildToken(sessionId: string, generation: number) {
  return `SIGNIN:KNOWGENCE:${sessionId}:${generation}`
}

function generatePassword(): string {
  const digits = Array.from({ length: 10 }, (_, i) => i)
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]]
  }
  return digits.slice(0, 4).join('')
}

export default function SignIn() {
  const [sessionId] = useState(generateSessionId)
  const [active, setActive] = useState(false)
  const [duration, setDuration] = useState(10)
  const [generation, setGeneration] = useState(0)
  const [totalSignIns, setTotalSignIns] = useState(0)
  const [currentPassword, setCurrentPassword] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [endTime, setEndTime] = useState<Date | null>(null)

  useEffect(() => {
    if (!active) return
    const ref = doc(db, 'signinSessions', sessionId)
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return
      const data = snap.data()
      const total: number = data.totalSignIns
      const newQrGen = Math.floor(total / QR_QUOTA)
      const newPassGen = Math.floor(total / PASSWORD_QUOTA)
      const prevPassGen = Math.floor((total - 1) / PASSWORD_QUOTA)

      setTotalSignIns(total)
      setGeneration(newQrGen)
      setCurrentPassword(data.currentPassword)

      // 每 PASSWORD_QUOTA 人換一次密碼
      if (total > 0 && newPassGen !== prevPassGen) {
        const newPassword = generatePassword()
        updateDoc(ref, {
          generation: newQrGen,
          passwordGeneration: newPassGen,
          currentPassword: newPassword,
        })
      }
    })
    return unsub
  }, [active, sessionId])

  useEffect(() => {
    if (!endTime) return
    const tick = setInterval(() => {
      const secs = Math.max(0, Math.round((endTime.getTime() - Date.now()) / 1000))
      setSecondsLeft(secs)
      if (secs === 0) {
        setActive(false)
        clearInterval(tick)
      }
    }, 1000)
    return () => clearInterval(tick)
  }, [endTime])

  async function startSession() {
    const end = new Date(Date.now() + duration * 60 * 1000)
    const initialPassword = generatePassword()
    setEndTime(end)
    setActive(true)
    setGeneration(0)
    setTotalSignIns(0)
    setCurrentPassword(initialPassword)
    await setDoc(doc(db, 'signinSessions', sessionId), {
      token: buildToken(sessionId, 0),
      generation: 0,
      totalSignIns: 0,
      passwordGeneration: 0,
      currentPassword: initialPassword,
      sessionEndTime: Timestamp.fromDate(end),
      active: true,
    })
  }

  async function endSession() {
    setActive(false)
    await updateDoc(doc(db, 'signinSessions', sessionId), { active: false })
  }

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const qrValue = buildToken(sessionId, generation)

  if (!active) {
    return (
      <div className="flex flex-col items-center gap-6 p-10">
        <h2 className="text-2xl font-bold text-white">課堂簽到</h2>
        <div className="flex items-center gap-3">
          <label className="text-slate-300">開放時間（分鐘）</label>
          <input
            type="number" min={1} max={120}
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            className="w-20 rounded-lg bg-slate-800 px-3 py-2 text-white text-center"
          />
        </div>
        <button
          onClick={startSession}
          className="rounded-xl bg-emerald-500 px-8 py-3 font-semibold text-white hover:bg-emerald-400"
        >
          開始簽到
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 p-10">
      <h2 className="text-2xl font-bold text-white">課堂簽到進行中</h2>
      <div className="rounded-2xl bg-white p-6 shadow-xl">
        <QRCodeSVG value={qrValue} size={256} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-slate-400 text-sm">數字密碼</p>
        <p className="text-4xl font-mono font-bold tracking-widest text-yellow-400">
          {currentPassword}
        </p>
      </div>
      <p className="text-3xl font-mono font-bold text-emerald-400">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </p>
      <p className="text-slate-400">距離簽到結束</p>
      <p className="text-slate-300">
        已簽到 <span className="font-bold text-white">{totalSignIns}</span> 人
      </p>
      <button
        onClick={endSession}
        className="rounded-xl border border-red-500 px-6 py-2 text-red-400 hover:bg-red-500/10"
      >
        結束簽到
      </button>
    </div>
  )
}
