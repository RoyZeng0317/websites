import { CATEGORIES, getTargetFormats } from '../api/convert'

interface Props {
  sourceFormat: string
  targetFormat: string
  onSourceChange: (ext: string) => void
  onTargetChange: (ext: string) => void
}

export default function FormatSelector({ sourceFormat, targetFormat, onSourceChange, onTargetChange }: Props) {
  const targetFormats = sourceFormat ? getTargetFormats(sourceFormat) : []

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-slate-400 mb-1.5">來源格式</label>
        <select
          value={sourceFormat}
          onChange={(e) => onSourceChange(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5
            text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
        >
          <option value="">選擇格式</option>
          {CATEGORIES.map((cat) => (
            <optgroup key={cat.id} label={`${cat.icon} ${cat.label}`}>
              {cat.formats.map((f) => (
                <option key={f.ext} value={f.ext}>{f.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1.5">目標格式</label>
        <select
          value={targetFormat}
          onChange={(e) => onTargetChange(e.target.value)}
          disabled={!sourceFormat}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5
            text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">{sourceFormat ? '選擇格式' : '先選來源格式'}</option>
          {targetFormats.map((ext) => (
            <option key={ext} value={ext}>{ext.toUpperCase()}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
