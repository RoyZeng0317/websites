import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  query, orderBy, onSnapshot, where, setDoc, increment, limit, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { ChatRoom, MessageModel } from '../types'
import type { UserModel } from '../types'

function getChatId(uid1: string, uid2: string) {
  return [uid1, uid2].sort().join('_')
}

export function subscribeChatRooms(uid: string, cb: (rooms: ChatRoom[]) => void) {
  const q = query(
    collection(db, 'messages'),
    where('participants', 'array-contains', uid),
    orderBy('lastMessageTime', 'desc')
  )
  return onSnapshot(q, snap => {
    cb(
      snap.docs
        .map(d => ({ id: d.id, ...d.data() }) as ChatRoom)
        .filter(r => !r.hiddenFor?.includes(uid))
    )
  })
}

export function subscribeMessages(chatId: string, cb: (msgs: MessageModel[]) => void) {
  const q = query(collection(db, 'messages', chatId, 'chat'), orderBy('createdAt', 'asc'))
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() }) as MessageModel))
  })
}

export async function sendMessage(
  currentUid: string,
  targetUid: string,
  content: string,
  imageUrl?: string
) {
  const chatId = getChatId(currentUid, targetUid)
  const chatRef = doc(db, 'messages', chatId)
  const chatSnap = await getDoc(chatRef)

  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      participants: [currentUid, targetUid],
      lastMessage: content || '📷 圖片',
      lastMessageTime: serverTimestamp(),
      unreadCount: { [targetUid]: 1 },
      hiddenFor: [],
    })
  } else {
    const data = chatSnap.data() as ChatRoom
    await updateDoc(chatRef, {
      lastMessage: content || '📷 圖片',
      lastMessageTime: serverTimestamp(),
      [`unreadCount.${targetUid}`]: (data.unreadCount?.[targetUid] || 0) + 1,
    })
  }

  await addDoc(collection(db, 'messages', chatId, 'chat'), {
    senderId: currentUid,
    content,
    imageUrl: imageUrl || null,
    isRead: false,
    isRecalled: false,
    isEdited: false,
    createdAt: serverTimestamp(),
  })
  return chatId
}

export async function editMessage(chatId: string, msgId: string, content: string) {
  await updateDoc(doc(db, 'messages', chatId, 'chat', msgId), { content, isEdited: true })
}

export async function recallMessage(chatId: string, msgId: string) {
  await updateDoc(doc(db, 'messages', chatId, 'chat', msgId), { isRecalled: true, content: '' })
}

export async function markMessagesRead(chatId: string, uid: string) {
  await updateDoc(doc(db, 'messages', chatId), { [`unreadCount.${uid}`]: 0 })
}

export async function deleteConversation(chatId: string, uid: string) {
  const snap = await getDoc(doc(db, 'messages', chatId))
  if (!snap.exists()) return
  const data = snap.data() as ChatRoom
  const hidden = [...(data.hiddenFor || []), uid]
  await updateDoc(doc(db, 'messages', chatId), { hiddenFor: hidden })
}

export async function getChatPartner(chatId: string, currentUid: string): Promise<UserModel | null> {
  const snap = await getDoc(doc(db, 'messages', chatId))
  if (!snap.exists()) return null
  const data = snap.data() as ChatRoom
  const partnerId = data.participants.find(p => p !== currentUid)
  if (!partnerId) return null
  const userSnap = await getDoc(doc(db, 'users', partnerId))
  if (!userSnap.exists()) return null
  return { uid: userSnap.id, ...userSnap.data() } as UserModel
}

export function getChatIdFor(uid1: string, uid2: string) {
  return getChatId(uid1, uid2)
}
