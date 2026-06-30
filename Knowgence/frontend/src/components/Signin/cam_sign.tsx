import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { doc, setDoc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../firebase'

const QR_QUOTA = 5

function generateSessionId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

function buildToken(sessionId: string, generation: number) {
  return `SIGNIN:KNOWGENCE:${sessionId}:${generation}`
}

export default function CamSign() {
  const [sessionId] = useState(generateSessionId)
  const [active, setActive] = useState(false)
  const [duration, setDuration] = useState(10)
  const [generation, setGeneration] = useState(0)
  const [totalSignIns, setTotalSignIns] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [endTime, setEndTime] = useState<Date | null>(null)

  useEffect(() => {
    if (!active) return
    const ref = doc(db, 'signinSessions', sessionId)
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return
      const data = snap.data()
      const total: number = data.totalSignIns
      const newGen = Math.floor(total / QR_QUOTA)
      const prevGen = Math.floor((total - 1) / QR_QUOTA)

      setTotalSignIns(total)
      setGeneration(newGen)

      // every QR_QUOTA sign-ins, write the new generation to Firestore
      if (total > 0 && newGen !== prevGen) {
        updateDoc(ref, { generation: newGen })
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
    setEndTime(end)
    setActive(true)
    setGeneration(0)
    setTotalSignIns(0)
    await setDoc(doc(db, 'signinSessions', sessionId), {
      type: 'qr',
      token: buildToken(sessionId, 0),
      generation: 0,
      totalSignIns: 0,
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
        <h2 className="text-2xl font-bold text-white">QR 掃描簽到</h2>
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

  const progressPct = ((totalSignIns % QR_QUOTA) / QR_QUOTA) * 100
  const toNextRotation = QR_QUOTA - (totalSignIns % QR_QUOTA)

  return (
    <div className="flex flex-col items-center gap-6 p-10">
      <h2 className="text-2xl font-bold text-white">QR 掃描簽到進行中</h2>

      <div className="relative rounded-2xl bg-white p-6 shadow-xl">
        <QRCodeSVG value={qrValue} size={260} />
        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-700 px-3 py-0.5 text-xs text-slate-300">
          第 {generation + 1} 版
        </span>
      </div>

      <p className="font-mono text-xs text-slate-500">Session: {sessionId}</p>

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
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-center text-xs text-slate-500">
          再 {toNextRotation} 人掃碼後更新 QR Code（每 {QR_QUOTA} 人輪換）
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
