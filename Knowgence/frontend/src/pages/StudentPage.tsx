import { useState } from 'react'
import {
  collection, query, where, getDocs, updateDoc, doc, increment
} from 'firebase/firestore'
import { db } from '../firebase'
import type { AuthUser } from '../../components/Login'

export default function StudentPage({ user }: { user: AuthUser }) {
  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <div className="flex flex-col items-center gap-1">
        <p className="text-slate-400 text-sm">歡迎回來</p>
        <h2 className="text-2xl font-bold text-white">{user.name || user.account}</h2>
        {user.class_name && (
          <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
            {user.class_name}
          </span>
        )}
      </div>

      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl ring-1 ring-slate-800">
        <h3 className="mb-4 text-lg font-semibold text-white">課堂簽到</h3>
        <p className="mb-6 text-sm text-slate-400">
          請向老師取得簽到方式，選擇以下其中一種完成簽到：
        </p>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl bg-slate-800 p-4">
            <p className="font-medium text-emerald-400">QR Code 掃描</p>
            <p className="mt-1 text-sm text-slate-400">
              使用 Knowgence Flutter App 掃描老師螢幕上的 QR Code
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-4">
            <p className="font-medium text-yellow-400">數字密碼簽到</p>
            <p className="mt-1 mb-3 text-sm text-slate-400">
              輸入老師公布的 4 位數簽到密碼（數字 1–9）
            </p>
            <NumCodeInput account={user.account} />
          </div>
        </div>
      </div>
    </div>
  )
}

type SignInStatus = 'idle' | 'loading' | 'ok' | 'wrong_code' | 'no_session' | 'already' | 'error'

function NumCodeInput({ account }: { account: string }) {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<SignInStatus>('idle')

  async function submit() {
    if (code.length !== 4) return
    setStatus('loading')
    try {
      // 查詢目前 active 且為 numeric 類型的簽到 session
      const q = query(
        collection(db, 'signinSessions'),
        where('active', '==', true),
        where('type', '==', 'numeric'),
      )
      const snap = await getDocs(q)

      if (snap.empty) {
        setStatus('no_session')
        return
      }

      // 取最近一筆 session（老師端同時只會有一個 active）
      const sessionDoc = snap.docs[0]
      const data = sessionDoc.data()

      // 驗證密碼
      if (data.currentPassword !== code) {
        setStatus('wrong_code')
        return
      }

      // 驗證 session 是否在時間內
      const endTime: Date = data.sessionEndTime.toDate()
      if (endTime < new Date()) {
        setStatus('no_session')
        return
      }

      // 檢查是否重複簽到（signedAccounts 陣列）
      const signed: string[] = data.signedAccounts ?? []
      if (signed.includes(account)) {
        setStatus('already')
        return
      }

      // 寫入 Firestore：totalSignIns +1，記錄該學生帳號
      await updateDoc(doc(db, 'signinSessions', sessionDoc.id), {
        totalSignIns: increment(1),
        signedAccounts: [...signed, account],
      })

      setStatus('ok')
      setCode('')
    } catch {
      setStatus('error')
    }
  }

  const messages: Record<Exclude<SignInStatus, 'idle' | 'loading'>, { text: string; cls: string }> = {
    ok:          { text: '簽到成功！',           cls: 'text-emerald-400' },
    wrong_code:  { text: '密碼錯誤，請再確認',   cls: 'text-red-400' },
    no_session:  { text: '目前沒有進行中的簽到', cls: 'text-slate-400' },
    already:     { text: '您已完成簽到',          cls: 'text-yellow-400' },
    error:       { text: '發生錯誤，請稍後再試', cls: 'text-red-400' },
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          maxLength={4}
          inputMode="numeric"
          placeholder="1234"
          value={code}
          onChange={e => {
            setCode(e.target.value.replace(/[^1-9]/g, '').slice(0, 4))
            setStatus('idle')
          }}
          className="w-24 rounded-lg bg-slate-700 px-3 py-2 text-center font-mono text-lg tracking-widest text-white outline-none ring-1 ring-slate-600 focus:ring-yellow-400"
        />
        <button
          onClick={submit}
          disabled={code.length !== 4 || status === 'loading' || status === 'ok'}
          className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-400 disabled:opacity-40"
        >
          {status === 'loading' ? '驗證中...' : '確認簽到'}
        </button>
      </div>
      {status !== 'idle' && status !== 'loading' && (
        <p className={`text-sm ${messages[status].cls}`}>{messages[status].text}</p>
      )}
    </div>
  )
}
