import { usePremium } from '../context/PremiumContext'
import { CheckCircle, Lock } from 'lucide-react'

const PAYPAL_URL = 'https://www.paypal.com/ncp/payment/2EFDRAFTKRYJW'

export default function Pay() {
  const { isPremium, unlock, lock } = usePremium()

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="text-lg font-semibold text-slate-200">會員訂閱</h2>

      {isPremium ? (
        <>
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">已解鎖進階內容</span>
          </div>
          <p className="text-xs text-slate-500">感謝您的支持！所有進階資訊已永久解鎖。</p>
          <button
            onClick={lock}
            className="mt-1 text-xs text-slate-600 underline transition-colors hover:text-slate-400"
          >
            重置為未付費狀態（測試用）
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-slate-400 text-center leading-relaxed">
            想要查看更多詳細的個股資訊嗎？付費解鎖後即可永久查看基本面、法人買賣、多空分析、相關期貨、股息及公司資訊。
          </p>
          <a
            href={PAYPAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0070BA] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#005EA6] active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788l.038-.199.734-4.653.047-.256a.932.932 0 0 1 .92-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.78-4.453z" />
            </svg>
            透過 PayPal 付款
          </a>
          <p className="text-xs text-slate-500">安全付款由 PayPal 處理</p>
        </>
      )}
    </div>
  )
}
