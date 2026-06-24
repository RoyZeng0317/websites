import { useState } from 'react'
import type { UploadTask, DownloadTask, TaskStatus } from '../lib/transferTypes'

interface Props {
  uploads: UploadTask[]
  downloads: DownloadTask[]
  onCancelUpload: (id: string) => void
  onCancelDownload: (id: string) => void
  onClearAll: () => void
  onCancelAllUploads: () => void
}

function statusIcon(status: TaskStatus) {
  if (status === 'done') return <span className="text-green-400 text-sm leading-none">✓</span>
  if (status === 'canceled') return <span className="text-gray-500 text-sm leading-none">—</span>
  if (status === 'error') return <span className="text-red-400 text-sm leading-none">✕</span>
  if (status === 'running') return <div className="w-3.5 h-3.5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
  return <div className="w-3.5 h-3.5 border-2 border-gray-600 rounded-full" />
}

interface RowProps {
  name: string
  progress: number
  status: TaskStatus
  error?: string
  type: 'upload' | 'download'
  onCancel: () => void
}

function TaskRow({ name, progress, status, error, type, onCancel }: RowProps) {
  const active = status === 'running' || status === 'pending'
  return (
    <div className="flex items-center gap-2 py-2 px-3 border-b border-gray-800 last:border-0">
      <div className="shrink-0 w-4 flex items-center justify-center">
        {statusIcon(status)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`text-xs shrink-0 px-1 rounded ${type === 'upload' ? 'text-orange-400' : 'text-blue-400'}`}>
            {type === 'upload' ? '↑' : '↓'}
          </span>
          <span className="text-xs text-gray-300 truncate">{name}</span>
        </div>
        {status === 'running' && (
          <div className="mt-1 flex items-center gap-1.5">
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${type === 'upload' ? 'bg-orange-400' : 'bg-blue-400'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 shrink-0 w-8 text-right">{progress}%</span>
          </div>
        )}
        {status === 'error' && (
          <p className="text-xs text-red-400 truncate mt-0.5">{error ?? 'Failed'}</p>
        )}
      </div>
      {active && (
        <button
          onClick={onCancel}
          className="shrink-0 w-5 h-5 flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors rounded hover:bg-gray-700"
          title="Cancel"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default function QueuePanel({ uploads, downloads, onCancelUpload, onCancelDownload, onClearAll, onCancelAllUploads }: Props) {
  const [minimized, setMinimized] = useState(false)

  const allTasks = [...uploads, ...downloads]
  if (allTasks.length === 0) return null

  const running = allTasks.filter(t => t.status === 'running').length
  const pending = allTasks.filter(t => t.status === 'pending').length
  const done = allTasks.filter(t => t.status === 'done' || t.status === 'canceled' || t.status === 'error').length
  const hasFinished = allTasks.some(t => t.status === 'done' || t.status === 'canceled' || t.status === 'error')
  const hasActiveUploads = uploads.some(t => t.status === 'running' || t.status === 'pending')

  return (
    <div className="fixed bottom-4 right-4 z-40 w-72 rounded-xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          {running > 0 && <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />}
          <span className="text-xs font-medium text-white">
            {running > 0
              ? `${running} transferring`
              : pending > 0
                ? `${pending} pending`
                : `${done} done`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {hasActiveUploads && (
            <button
              onClick={onCancelAllUploads}
              className="text-xs text-red-400 hover:text-red-300 px-1.5 py-0.5 rounded hover:bg-gray-700 transition-colors"
            >
              Cancel All
            </button>
          )}
          {hasFinished && (
            <button
              onClick={onClearAll}
              className="text-xs text-gray-500 hover:text-gray-300 px-1.5 py-0.5 rounded hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setMinimized(v => !v)}
            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            {minimized
              ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
              : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            }
          </button>
        </div>
      </div>

      {/* Task list */}
      {!minimized && (
        <div className="max-h-64 overflow-y-auto">
          {uploads.map(t => (
            <TaskRow
              key={t.id}
              name={t.name}
              progress={t.progress}
              status={t.status}
              error={t.error}
              type="upload"
              onCancel={() => onCancelUpload(t.id)}
            />
          ))}
          {downloads.map(t => (
            <TaskRow
              key={t.id}
              name={t.name}
              progress={t.progress}
              status={t.status}
              error={t.error}
              type="download"
              onCancel={() => onCancelDownload(t.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
