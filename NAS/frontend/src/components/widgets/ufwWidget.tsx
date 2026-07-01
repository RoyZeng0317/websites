import { useState, useEffect } from 'react'
import { apiJson } from '../../lib/api'

type UfwStatus = 'active' | 'inactive' | 'error' | 'loading'

interface UfwResponse {
  active: boolean
  detail?: string
}

export default function UfwWidget() {
  const [status, setStatus] = useState<UfwStatus>('loading')
  const [detail, setDetail] = useState('Checking UFW...')

  async function fetchStatus() {
    try {
      const data = await apiJson<UfwResponse>('/api/ufw/status')
      setStatus(data.active ? 'active' : 'inactive')
      setDetail(data.detail ?? (data.active ? 'UFW: Active' : 'UFW: Inactive'))
    } catch {
      setStatus('error')
      setDetail('UFW: Failed to reach backend')
    }
  }

  useEffect(() => {
    fetchStatus()
    const id = setInterval(fetchStatus, 60_000)
    return () => clearInterval(id)
  }, [])

  const dotClass =
    status === 'active'
      ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]'
      : status === 'loading'
      ? 'bg-gray-500 animate-pulse'
      : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)]'

  return (
    <div
      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-700 transition-colors cursor-default"
      title={detail}
    >
      <div className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
    </div>
  )
}
