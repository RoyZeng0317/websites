import { useState } from 'react'
import CamSign from '../../components/Signin/cam_sign'
import NumSign from '../../components/Signin/num_sign'

type Tab = 'qr' | 'num'

export default function HomePage() {
  const [tab, setTab] = useState<Tab>('qr')

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex rounded-xl bg-slate-800 p-1">
        <button
          onClick={() => setTab('qr')}
          className={`rounded-lg px-6 py-2 text-sm font-semibold transition-colors ${
            tab === 'qr'
              ? 'bg-emerald-500 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          QR 掃描簽到
        </button>
        <button
          onClick={() => setTab('num')}
          className={`rounded-lg px-6 py-2 text-sm font-semibold transition-colors ${
            tab === 'num'
              ? 'bg-yellow-500 text-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          數字密碼簽到
        </button>
      </div>

      <div className="w-full max-w-lg rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-slate-800">
        {tab === 'qr' ? <CamSign /> : <NumSign />}
      </div>
    </div>
  )
}
