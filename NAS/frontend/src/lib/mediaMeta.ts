import { apiJson } from './api'

export const CATEGORIES = ['風景', '人像', '旅遊', '食物', '生活', '動物', '建築', '節日', '運動', '其他'] as const
export type MediaCategory = typeof CATEGORIES[number] | ''

export interface FileMeta {
  tags: string[]
  location: string
  category: MediaCategory
  note: string
}

export const EMPTY_META: FileMeta = { tags: [], location: '', category: '', note: '' }

export async function getMeta(filePath: string): Promise<FileMeta | null> {
  try {
    const d = await apiJson<{ meta: FileMeta | null }>(`/api/media/meta?path=${encodeURIComponent(filePath)}`)
    return d.meta
  } catch { return null }
}

export async function saveMeta(filePath: string, meta: FileMeta): Promise<void> {
  await apiJson('/api/media/meta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: filePath, ...meta }),
  })
}

export async function searchByMeta(params: {
  q?: string; tags?: string; category?: string; location?: string
}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v) as [string, string][]
  )
  return apiJson<{ items: Array<{ path: string; name: string; type: string; meta: FileMeta }> }>(
    `/api/media/search?${qs}`
  )
}
