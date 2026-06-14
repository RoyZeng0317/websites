import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  limit,
  getDocs,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { EncryptionService } from '../lib/encryption'

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

export interface ChatUser {
  userId: string
  displayName: string
  photoURL: string
  publicKey: string
  userHandle: string
}

interface PendingDelete {
  docPath: string
  cloudinaryPublicId?: string
  mediaType?: string
}

type MessageHandler = (msg: ChatMessage) => void
type EventHandler = (event: { type: string; documentId: string; newText?: string }) => void

export class ChatService {
  private enc: EncryptionService
  private currentUserId: string
  private currentHandle: string
  private currentDisplayName: string
  private peerPublicKeys = new Map<string, string>()
  private pendingDeletes: PendingDelete[] = []
  private unsub: Unsubscribe | null = null
  private listeningPeerId: string | null = null
  private onMessage: MessageHandler = () => {}
  private onEvent: EventHandler = () => {}

  constructor(
    enc: EncryptionService,
    userId: string,
    handle: string,
    displayName: string,
  ) {
    this.enc = enc
    this.currentUserId = userId
    this.currentHandle = handle
    this.currentDisplayName = displayName
  }

  get handle() { return this.currentHandle }
  get displayName() { return this.currentDisplayName }
  get userId() { return this.currentUserId }

  setHandlers(onMessage: MessageHandler, onEvent: EventHandler) {
    this.onMessage = onMessage
    this.onEvent = onEvent
  }

  private chatId(peerId: string): string {
    return [this.currentUserId, peerId].sort().join('_')
  }

  async updateHandle(newHandle: string): Promise<string | null> {
    const h = newHandle.toLowerCase().trim()
    if (h.length < 3) return '用戶 ID 至少需要 3 個字元'
    if (h.length > 20) return '用戶 ID 最多 20 個字元'
    if (!/^[a-z0-9_]+$/.test(h)) return '只能使用英文小寫字母、數字與底線 (_)'
    const snap = await getDocs(
      query(collection(db, 'users'), where('userHandle', '==', h), limit(1)),
    )
    if (!snap.empty && snap.docs[0].id !== this.currentUserId) return '此用戶 ID 已被使用，請換一個'
    await updateDoc(doc(db, 'users', this.currentUserId), { userHandle: h })
    this.currentHandle = h
    return null
  }

  async updateDisplayName(newName: string): Promise<string | null> {
    const name = newName.trim()
    if (!name) return '顯示名稱不得為空'
    if (name.length > 30) return '顯示名稱最多 30 個字元'
    await updateDoc(doc(db, 'users', this.currentUserId), { displayName: name })
    this.currentDisplayName = name
    return null
  }

  async deleteUserData(): Promise<void> {
    const { deleteDoc: del } = await import('firebase/firestore')
    await del(doc(db, 'users', this.currentUserId)).catch(() => {})
  }

  async searchUser(handle: string): Promise<ChatUser | null> {
    const snap = await getDocs(
      query(collection(db, 'users'), where('userHandle', '==', handle.toLowerCase().trim()), limit(1)),
    )
    if (snap.empty) return null
    const d = snap.docs[0]
    if (d.id === this.currentUserId) return null
    const data = d.data()
    this.peerPublicKeys.set(d.id, data.publicKey ?? '')
    return {
      userId: d.id,
      displayName: data.displayName ?? d.id,
      photoURL: data.photoURL ?? '',
      publicKey: data.publicKey ?? '',
      userHandle: data.userHandle ?? '',
    }
  }

  private async resolvePublicKey(uid: string, forceRefresh = false): Promise<string> {
    if (!forceRefresh) {
      const cached = this.peerPublicKeys.get(uid)
      if (cached) return cached
    }
    const snap = await getDoc(doc(db, 'users', uid))
    const pk = (snap.data()?.publicKey as string) ?? ''
    this.peerPublicKeys.set(uid, pk)
    return pk
  }

  listenToMessages(peerId: string) {
    if (this.listeningPeerId === peerId) return
    this.stopListening()
    this.listeningPeerId = peerId

    const messagesRef = collection(db, 'chats', this.chatId(peerId), 'messages')
    const q = query(messagesRef, orderBy('timestamp'))

    this.unsub = onSnapshot(q, snap => {
      snap.docChanges().forEach(change => {
        if (change.type === 'added') this.processIncoming(change.doc, peerId)
        else if (change.type === 'modified') this.processModified(change.doc, peerId)
        else if (change.type === 'removed') this.handleRemoved(change.doc)
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async processIncoming(docSnap: any, peerId: string): Promise<void> {
    try {
      const data = docSnap.data() as Record<string, unknown>
      const from = data.from as string
      if (from === this.currentUserId) return

      this.peerPublicKeys.delete(from)
      this.enc.clearSharedSecret(from)

      const burnTimer = (data.burnTimer as string) ?? 'off'
      const cloudinaryPublicId = data.cloudinaryPublicId as string | undefined
      const rawMediaType = data.mediaType as string | undefined

      if (data.recalled === true) {
        this.onMessage({
          documentId: docSnap.id,
          from, to: this.currentUserId,
          text: '', timestamp: (data.timestamp as { toDate(): Date })?.toDate() ?? new Date(),
          burnTimer: burnTimer as ChatMessage['burnTimer'],
          isBurned: false, isSentByMe: false, recalled: true, edited: false,
        })
        docSnap.ref.delete().catch(() => {})
        return
      }

      const pk = await this.resolvePublicKey(from, true)
      if (!pk) return
      const sharedKey = await this.enc.getSharedSecret(from, pk)
      const plainText = await this.enc.decryptFromMap(
        { ct: data.ct as string, nonce: data.nonce as string, mac: data.mac as string },
        sharedKey,
      )
      const payload = JSON.parse(plainText) as Record<string, unknown>

      this.onMessage({
        documentId: docSnap.id,
        from, to: this.currentUserId,
        text: (payload.text as string) ?? '',
        mediaUrl: payload.mediaUrl as string | undefined,
        mediaType: payload.mediaType as ChatMessage['mediaType'],
        fileName: payload.fileName as string | undefined,
        timestamp: (data.timestamp as { toDate(): Date })?.toDate() ?? new Date(),
        burnTimer: burnTimer as ChatMessage['burnTimer'],
        edited: (data.edited as boolean) ?? false,
        isBurned: false, isSentByMe: false, recalled: false,
      })

      const delay = burnTimer === '1m' ? 60_000 : burnTimer === '3m' ? 180_000 : burnTimer === '5m' ? 300_000 : null
      if (delay !== null) {
        setTimeout(() => {
          if (cloudinaryPublicId && rawMediaType) {
            this.deleteCloudinary(cloudinaryPublicId, rawMediaType === 'file' ? 'raw' : rawMediaType)
          }
          docSnap.ref.delete().catch(() => {})
        }, delay)
      } else {
        this.pendingDeletes.push({ docPath: docSnap.ref.path, cloudinaryPublicId, mediaType: rawMediaType })
      }
    } catch (e) {
      console.error('[ChatService] processIncoming error', e)
    }
  }

  private async processModified(docSnap: any, _peerId: string): Promise<void> {
    try {
      const data = docSnap.data() as Record<string, unknown>
      const from = data.from as string
      if (from === this.currentUserId) return

      if (data.recalled === true) {
        this.onEvent({ type: 'recall', documentId: docSnap.id })
        docSnap.ref.delete().catch(() => {})
        return
      }
      if (data.edited === true) {
        const pk = await this.resolvePublicKey(from)
        if (!pk) return
        const sharedKey = await this.enc.getSharedSecret(from, pk)
        const plainText = await this.enc.decryptFromMap(
          { ct: data.ct as string, nonce: data.nonce as string, mac: data.mac as string },
          sharedKey,
        )
        const payload = JSON.parse(plainText) as Record<string, unknown>
        this.onEvent({ type: 'edit', documentId: docSnap.id, newText: payload.text as string })
      }
    } catch {}
  }

  private handleRemoved(docSnap: any): void {
    const data = docSnap.data() as Record<string, unknown> | undefined
    if (!data) return
    const burnTimer = (data.burnTimer as string) ?? 'off'
    if (burnTimer !== 'off' && data.from === this.currentUserId) {
      this.onEvent({ type: 'burn', documentId: docSnap.id })
    }
  }

  async sendMessage(
    peerId: string,
    text: string,
    opts: {
      burnTimer?: ChatMessage['burnTimer']
      mediaUrl?: string
      mediaType?: ChatMessage['mediaType']
      fileName?: string
      cloudinaryPublicId?: string
    } = {},
  ): Promise<void> {
    const pk = await this.resolvePublicKey(peerId)
    if (!pk) return
    const sharedKey = await this.enc.getSharedSecret(peerId, pk)
    const plainPayload = JSON.stringify({
      text,
      mediaUrl: opts.mediaUrl,
      mediaType: opts.mediaType,
      fileName: opts.fileName,
      timestamp: Date.now(),
    })
    const encrypted = await this.enc.encryptToMap(plainPayload, sharedKey)
    const docRef = await addDoc(collection(db, 'chats', this.chatId(peerId), 'messages'), {
      from: this.currentUserId,
      to: peerId,
      ...encrypted,
      burnTimer: opts.burnTimer ?? 'off',
      mediaType: opts.mediaType ?? null,
      cloudinaryPublicId: opts.cloudinaryPublicId ?? null,
      fileName: opts.fileName ?? null,
      recalled: false,
      edited: false,
      timestamp: serverTimestamp(),
    })

    this.onMessage({
      documentId: docRef.id,
      from: this.currentUserId,
      to: peerId,
      text,
      mediaUrl: opts.mediaUrl,
      mediaType: opts.mediaType,
      fileName: opts.fileName,
      timestamp: new Date(),
      burnTimer: opts.burnTimer ?? 'off',
      isBurned: false,
      isSentByMe: true,
      recalled: false,
      edited: false,
    })
  }

  async editMessage(documentId: string, peerId: string, newText: string): Promise<void> {
    const pk = await this.resolvePublicKey(peerId)
    if (!pk) return
    const sharedKey = await this.enc.getSharedSecret(peerId, pk)
    const plainPayload = JSON.stringify({ text: newText, timestamp: Date.now() })
    const encrypted = await this.enc.encryptToMap(plainPayload, sharedKey)
    await updateDoc(doc(db, 'chats', this.chatId(peerId), 'messages', documentId), {
      ...encrypted,
      edited: true,
    })
    this.onEvent({ type: 'edit', documentId, newText })
  }

  async recallMessage(documentId: string, peerId: string): Promise<void> {
    await updateDoc(doc(db, 'chats', this.chatId(peerId), 'messages', documentId), {
      recalled: true, ct: '', nonce: '', mac: '',
    })
    this.onEvent({ type: 'recall', documentId })
  }

  async burnMessage(documentId: string, peerId: string): Promise<void> {
    const { deleteDoc: del } = await import('firebase/firestore')
    await del(doc(db, 'chats', this.chatId(peerId), 'messages', documentId)).catch(() => {})
  }

  private deleteCloudinary(publicId: string, resourceType: string): void {
    // Cloudinary deletion requires a signed request; done via the media service
    import('../services/mediaService').then(({ mediaService }) => {
      mediaService.delete(publicId, resourceType)
    })
  }

  stopListening(): void {
    for (const pending of this.pendingDeletes) {
      if (pending.cloudinaryPublicId && pending.mediaType) {
        const rt = pending.mediaType === 'file' ? 'raw' : pending.mediaType
        this.deleteCloudinary(pending.cloudinaryPublicId, rt)
      }
      import('firebase/firestore').then(({ doc: d, deleteDoc: del }) => {
        const ref = d(db, pending.docPath)
        del(ref).catch(() => {})
      })
    }
    this.pendingDeletes = []
    this.unsub?.()
    this.unsub = null
    this.listeningPeerId = null
  }

  dispose(): void {
    this.stopListening()
  }
}
