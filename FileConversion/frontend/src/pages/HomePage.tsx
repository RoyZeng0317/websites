import { useState, useRef } from 'react'
import { convertFile, formatFileSize, CONVERSION_MAP } from '../api/convert'
import FormatSelector from '../components/FormatSelector'

type Step = 'upload' | 'converting' | 'done'

interface ConvertResult {
  downloadUrl: string
  filename: string
  size: number
}

export default function HomePage() {
  const [step, setStep] = useState<Step>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ConvertResult | null>(null)
  const [error, setError] = useState('')
  const [sourceFormat, setSourceFormat] = useState('')
  const [targetFormat, setTargetFormat] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSourceChange = (ext: string) => {
    setSourceFormat(ext)
    setTargetFormat('')
    setFile(null)
    setError('')
  }

  const handleFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
    if (sourceFormat && ext !== sourceFormat && !(ext === 'jpeg' && sourceFormat === 'jpg')) {
      setError(`請上傳 .${sourceFormat} 格式的檔案`)
      return
    }
    setFile(f)
    setError('')
    if (!sourceFormat && ext && CONVERSION_MAP[ext]) {
      setSourceFormat(ext)
      setTargetFormat('')
    }
  }

  const handleConvert = async () => {
    if (!sourceFormat || !targetFormat) { setError('請選擇來源與目標格式'); return }
    if (!file) { setError('請上傳檔案'); return }
    setStep('converting')
    setProgress(0)
    setError('')
    try {
      const res = await convertFile(file, targetFormat, setProgress)
      setResult(res)
      setStep('done')
    } catch (e: any) {
      setError(e.message || '轉換失敗，請稍後再試')
      setStep('upload')
    }
  }

  const reset = () => {
    setStep('upload')
    setFile(null)
    setProgress(0)
    setResult(null)
    setError('')
    setSourceFormat('')
    setTargetFormat('')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <div className="max-w-3xl mx-auto space-y-8">

        <div className="text-center pt-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">檔案轉換</h1>
          <p className="text-slate-400">快速將檔案轉換為所需格式</p>
        </div>

        {step === 'upload' && (
          <div className="space-y-4">
            <FormatSelector
              sourceFormat={sourceFormat}
              targetFormat={targetFormat}
              onSourceChange={handleSourceChange}
              onTargetChange={setTargetFormat}
            />

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                const f = e.dataTransfer.files[0]
                if (f) handleFile(f)
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
                ${isDragging
                  ? 'border-emerald-400 bg-emerald-500/10'
                  : file
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-slate-700 hover:border-slate-500 bg-slate-800/30'
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              {file ? (
                <div className="space-y-2">
                  <div className="text-3xl">✅</div>
                  <p className="font-medium text-slate-200">{file.name}</p>
                  <p className="text-sm text-slate-400">{formatFileSize(file.size)}</p>
                  <p className="text-xs text-slate-500">點擊更換檔案</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-4xl">📂</div>
                  <p className="text-slate-300">拖曳檔案至此，或點擊選擇</p>
                  {sourceFormat && <p className="text-xs text-slate-500">.{sourceFormat} 格式</p>}
                </div>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 rounded-lg px-4 py-2">⚠️ {error}</p>
            )}

            <button
              onClick={handleConvert}
              disabled={!file || !sourceFormat || !targetFormat}
              className="w-full py-3.5 rounded-xl font-semibold text-slate-950 bg-emerald-500
                hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500
                disabled:cursor-not-allowed transition-all"
            >
              開始轉換
            </button>
          </div>
        )}

        {step === 'converting' && (
          <div className="text-center py-12 space-y-6">
            <div className="text-5xl animate-bounce">⚙️</div>
            <h2 className="text-xl font-semibold text-slate-200">轉換中...</h2>
            <div className="max-w-sm mx-auto">
              <div className="flex justify-between text-sm text-slate-400 mb-1">
                <span>進度</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <p className="text-slate-500 text-sm">{file?.name}</p>
          </div>
        )}

        {step === 'done' && result && (
          <div className="text-center py-8 space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-slate-100">轉換成功！</h2>
            <div className="bg-slate-800/60 rounded-xl p-5 max-w-sm mx-auto text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">檔案名稱</span>
                <span className="text-slate-200 font-medium">{result.filename}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">檔案大小</span>
                <span className="text-slate-200">{formatFileSize(result.size)}</span>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <a
                href={result.downloadUrl}
                download={result.filename}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400
                  text-slate-950 font-semibold transition-all"
              >
                ⬇️ 下載檔案
              </a>
              <button
                onClick={reset}
                className="px-6 py-3 rounded-xl border border-slate-600
                  text-slate-300 hover:border-slate-400 transition-all"
              >
                再轉換一個
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
