import { formatDistanceToNow } from 'date-fns'
import { zhTW } from 'date-fns/locale'

// Firestore Timestamp, plain number (ms), or Date — all converted safely to ms
export function toMs(val: unknown): number {
  if (typeof val === 'number') return val
  if (val instanceof Date) return val.getTime()
  // Firestore Timestamp object: has toMillis() or seconds
  if (val && typeof (val as any).toMillis === 'function') return (val as any).toMillis()
  if (val && typeof (val as any).seconds === 'number') return (val as any).seconds * 1000
  return Date.now()
}

export function timeAgo(val: unknown): string {
  try {
    return formatDistanceToNow(new Date(toMs(val)), { addSuffix: true, locale: zhTW })
  } catch {
    return ''
  }
}
