import type { ProgramSegment } from '../types'
import './ProgramSchedule.css'

interface Props {
  program: ProgramSegment[]
}

const THEME_COLORS: Record<string, string> = {
  流行: '#00d4ff',
  爵士: '#f97316',
  電子: '#a855f7',
  搖滾: '#ef4444',
  古典: '#eab308',
  'R&B': '#ec4899',
  default: '#64748b',
}

export function ProgramSchedule({ program }: Props) {
  const color = (theme: string) => THEME_COLORS[theme] ?? THEME_COLORS.default

  if (!program.length) {
    return (
      <div className="program-schedule empty">
        <span>正在生成節目表…</span>
      </div>
    )
  }

  return (
    <div className="program-schedule">
      <span className="schedule-label">節目表</span>
      <div className="schedule-track">
        {program.map((seg, i) => (
          <div key={i} className={`schedule-seg ${i === 0 ? 'active' : ''}`}>
            <div className="seg-dot" style={{ background: color(seg.theme) }} />
            <div className="seg-info">
              <span className="seg-name">{seg.name}</span>
              <span className="seg-meta">{seg.theme} · {seg.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
