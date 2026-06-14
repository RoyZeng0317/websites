import { useState, useRef, type ReactNode } from 'react'

interface Props {
  title: string
  onClose: () => void
  children: ReactNode
  initialX?: number
  initialY?: number
  width?: number
}

export default function DragWindow({ title, onClose, children, initialX, initialY, width = 280 }: Props) {
  const [pos, setPos] = useState({
    x: initialX ?? (window.innerWidth - width - 20),
    y: initialY ?? 80,
  })
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  function onMouseDown(e: React.MouseEvent) {
    if ((e.target as Element).closest('button, input, select')) return
    dragging.current = true
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }

    function onMove(ev: MouseEvent) {
      if (!dragging.current) return
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - width, ev.clientX - offset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 80, ev.clientY - offset.current.y)),
      })
    }
    function onUp() {
      dragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <div
      className="fixed z-40 rounded-xl shadow-2xl border border-gray-700 overflow-hidden"
      style={{ left: pos.x, top: pos.y, width }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 cursor-move select-none border-b border-gray-700"
        onMouseDown={onMouseDown}
      >
        <span className="text-sm font-medium text-white flex-1 truncate">{title}</span>
        <button
          onClick={onClose}
          onMouseDown={e => e.stopPropagation()}
          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white text-lg leading-none transition-colors"
        >
          ×
        </button>
      </div>
      {children}
    </div>
  )
}
