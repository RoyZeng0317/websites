import type { Idol } from '../api'
import { Link } from 'react-router-dom'

interface IdolCardProps {
  idol: Idol
}

export default function IdolCard({ idol }: IdolCardProps) {
  return (
    <Link
      to={`/idols/${idol.id}`}
      className="block p-4 rounded-xl border border-slate-700/50 bg-slate-800 hover:shadow-lg hover:shadow-pink-500/5 hover:border-pink-500/30 transition-all"
    >
      <div className="flex items-center gap-3">
        {idol.image_url ? (
          <img
            src={idol.image_url}
            alt={idol.stage_name}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-pink-500/10 flex items-center justify-center text-xl text-pink-400 shrink-0">
            {idol.stage_name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-bold text-slate-100">{idol.stage_name}</h3>
          {idol.stage_name_zh && (
            <p className="text-sm text-slate-400">{idol.stage_name_zh}</p>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-slate-500">
            {idol.real_name && <span>本名: {idol.real_name}</span>}
            {idol.birth_date && <span>{idol.birth_date}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
