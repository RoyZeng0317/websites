import { format, isToday, isYesterday } from 'date-fns'
import { zhTW } from 'date-fns/locale'

export function formatMessageTime(date: Date): string {
  return format(date, 'HH:mm')
}

export function formatChatListTime(date: Date): string {
  if (isToday(date)) return format(date, 'HH:mm')
  if (isYesterday(date)) return '昨天'
  return format(date, 'MM/dd', { locale: zhTW })
}
