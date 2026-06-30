import { useEffect, useState } from 'react'
import { doc, setDoc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../firebase'

const PASSWORD_QUOTA = 5

function generateSessionId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

function generatePassword(): string {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[digits[i], digits[j]] = [digits[j], digits[i]]
  }
  return digits.slice(0, 4).join('')
}

export default function NumSign() {
  const [sessionId] = useState(generateSessionId)
  const [active, setActive] = useState(false)
  const [duration, setDuration] = useState(10)
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
      const newPassGen = Math.floor(total / PASSWORD_QUOTA)
      const prevPassGen = Math.floor((total - 1) / PASSWORD_QUOTA)

      setTotalSignIns(total)
      setCurrentPassword(data.currentPassword)

      // every PASSWORD_QUOTA sign-ins, rotate to a new password
      if (total > 0 && newPassGen !== prevPassGen) {
        const newPassword = generatePassword()
        updateDoc(ref, {
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
    setTotalSignIns(0)
    setCurrentPassword(initialPassword)
    await setDoc(doc(db, 'signinSessions', sessionId), {
      type: 'numeric',
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
  const progressPct = ((totalSignIns % PASSWORD_QUOTA) / PASSWORD_QUOTA) * 100
  const toNextRotation = PASSWORD_QUOTA - (totalSignIns % PASSWORD_QUOTA)

  if (!active) {
    return (
      <div className="flex flex-col items-center gap-6 p-10">
        <h2 className="text-2xl font-bold text-white">數字密碼簽到</h2>
        <div className="flex items-center gap-3">
          <label className="text-slate-300">開放時間（分鐘）</label>
          <input
            type="number"
            min={1}
            max={120}
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            className="w-20 rounded-lg bg-slate-800 px-3 py-2 text-center text-white"
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
      <h2 className="text-2xl font-bold text-white">數字密碼簽到進行中</h2>

      <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-800 px-12 py-8 shadow-xl">
        <p className="text-sm text-slate-400">簽到密碼</p>
        <p className="font-mono text-7xl font-bold tracking-[0.3em] text-yellow-400">
          {currentPassword}
        </p>
        <p className="text-xs text-slate-500">數字 1–9，不含 0</p>
      </div>

      <p className="font-mono text-3xl font-bold text-emerald-400">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </p>
      <p className="text-slate-400">距離簽到結束</p>

      <p className="text-slate-300">
        已簽到 <span className="font-bold text-white">{totalSignIns}</span> 人
      </p>

      <div className="flex w-64 flex-col gap-1">
        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-yellow-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-center text-xs text-slate-500">
          再 {toNextRotation} 人簽到後更新密碼（每 {PASSWORD_QUOTA} 人輪換）
        </p>
      </div>

      <button
        onClick={endSession}
        className="rounded-xl border border-red-500 px-6 py-2 text-red-400 hover:bg-red-500/10"
      >
        結束簽到
      </button>
    </div>
  )
}
