interface Props {
  onClose: () => void
}

export default function RAIDPanel({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">RAID Management</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xl transition-colors"
          >
            ×
          </button>
        </div>
        <p className="text-gray-400 text-sm">RAID array management coming soon.</p>
      </div>
    </div>
  )
}
