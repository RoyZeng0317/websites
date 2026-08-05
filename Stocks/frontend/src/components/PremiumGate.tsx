import { useState } from 'react'
import { usePremium } from '../context/PremiumContext'
import { Lock, CheckCircle } from 'lucide-react'

const PAYPAL_URL = 'https://www.paypal.com/ncp/payment/2EFDRAFTKRYJW'

interface Props {
  children: React.ReactNode
  label?: string
}

export default function PremiumGate({ children, label = '此內容' }: Props) {
  const { isPremium, unlock } = usePremium()
  const [showConfirm, setShowConfirm] = useState(false)

  if (isPremium) return <>{children}</>

  return (
    <div className="relative">
      {/* Blurred content preview */}
      <div className="pointer-events-none select-none opacity-30 blur-sm max-h-48 overflow-hidden">
        {children}
      </div>

      {/* Paywall overlay */}
      <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-amber-500/20 bg-gradient-to-b from-slate-900/95 via-slate-900/98 to-slate-900/95 backdrop-blur-[2px]">
        <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
            <Lock size={24} className="text-amber-400" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-100">付費內容</h3>
            <p className="mt-1 text-sm text-slate-400">
              {label}為進階功能，需付費解鎖後才能查看
            </p>
          </div>

          {!showConfirm ? (
            <a
              href={PAYPAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowConfirm(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0070BA] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#005EA6] active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788l.038-.199.734-4.653.047-.256a.932.932 0 0 1 .92-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.78-4.453z" />
              </svg>
              透過 PayPal 付款
            </a>
          ) : (
            <button
              onClick={unlock}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-500 active:scale-95"
            >
              <CheckCircle size={18} />
              我已完成付款，點此解鎖
            </button>
          )}

          <p className="text-xs text-slate-500">
            {showConfirm
              ? '付款完成後點擊上方按鈕即可解鎖（同裝置永久有效）'
              : '安全付款由 PayPal 處理'}
          </p>
        </div>
      </div>
    </div>
  )
}
