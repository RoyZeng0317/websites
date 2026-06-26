export interface ChatUser {
  userId: string
  displayName: string
  photoURL: string
  userHandle: string
  publicKey: string
}

export interface ChatMessage {
  documentId: string
  from: string
  to: string
  text: string
  timestamp: Date
  burnTimer: 'off' | 'exit' | '1m' | '3m' | '5m'
  mediaUrl?: string
  mediaType?: 'image' | 'video' | 'file'
  fileName?: string
  isBurned: boolean
  isSentByMe: boolean
  recalled: boolean
  edited: boolean
}
