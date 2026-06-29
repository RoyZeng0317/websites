import type { Idol } from './api'

interface IdolBasicInfoProps {
  idol: Idol
}

export default function IdolBasicInfo({ idol }: IdolBasicInfoProps) {
  return (
    <div className="flex gap-4 p-4 rounded-lg border border-slate-700/50 bg-slate-800 shadow-sm hover:shadow-md hover:shadow-pink-500/5 hover:border-pink-500/30 transition-all">
      <div className="shrink-0">
        {idol.image_url ? (
          <img
            src={idol.image_url}
            alt={idol.stage_name}
            className="w-24 h-24 object-cover rounded-full"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-pink-500/10 flex items-center justify-center text-3xl text-pink-400">
            {idol.stage_name.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-slate-100">{idol.stage_name}</h3>
        {idol.stage_name_zh && (
          <p className="text-sm text-slate-400">{idol.stage_name_zh}</p>
        )}
        {idol.real_name && (
          <p className="text-xs text-slate-500 mt-1">本名: {idol.real_name}</p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
          {idol.nickname && <span>暱稱: {idol.nickname}</span>}
          {idol.birth_date && <span>生日: {idol.birth_date}</span>}
          {idol.birthplace && <span>出身地: {idol.birthplace}</span>}
          {idol.blood_type && <span>血型: {idol.blood_type}</span>}
          {idol.height_cm && <span>身高: {idol.height_cm}cm</span>}
          {idol.zodiac_sign && <span>星座: {idol.zodiac_sign}</span>}
        </div>

        {idol.biography && (
          <p className="text-xs text-slate-500 mt-2 line-clamp-2">{idol.biography}</p>
        )}
      </div>
    </div>
  )
}
