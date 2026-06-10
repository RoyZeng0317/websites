import {
  collection, doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc,
  query, where, orderBy, limit, onSnapshot, increment, addDoc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { UserModel, NotificationModel } from '../types'
import { addNotification } from './postService'

export async function getUser(uid: string): Promise<UserModel | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return { uid: snap.id, ...snap.data() } as UserModel
}

export function subscribeUser(uid: string, cb: (user: UserModel | null) => void) {
  return onSnapshot(doc(db, 'users', uid), snap => {
    cb(snap.exists() ? ({ uid: snap.id, ...snap.data() } as UserModel) : null)
  })
}

export async function searchUsers(queryText: string): Promise<UserModel[]> {
  const q = query(
    collection(db, 'users'),
    where('username', '>=', queryText.toLowerCase()),
    where('username', '<=', queryText.toLowerCase() + ''),
    limit(20)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }) as UserModel)
}

// ── Follow ─────────────────────────────────────────────────────────────────

export async function followUser(
  currentUid: string,
  currentName: string,
  currentPhoto: string,
  targetUid: string,
  targetIsPrivate: boolean
) {
  if (targetIsPrivate) {
    await setDoc(doc(db, 'users', targetUid, 'followRequests', currentUid), {
      uid: currentUid,
      displayName: currentName,
      photoUrl: currentPhoto,
      requestedAt: serverTimestamp(),
    })
    await addNotification(targetUid, currentUid, 'followRequest')
  } else {
    await setDoc(doc(db, 'users', currentUid, 'following', targetUid), { followedAt: serverTimestamp() })
    await setDoc(doc(db, 'users', targetUid, 'followers', currentUid), { followedAt: serverTimestamp() })
    await updateDoc(doc(db, 'users', currentUid), { followingCount: increment(1) })
    await updateDoc(doc(db, 'users', targetUid), { followersCount: increment(1) })
    await addNotification(targetUid, currentUid, 'follow')
  }
}

export async function unfollowUser(currentUid: string, targetUid: string) {
  await deleteDoc(doc(db, 'users', currentUid, 'following', targetUid))
  await deleteDoc(doc(db, 'users', targetUid, 'followers', currentUid))
  await updateDoc(doc(db, 'users', currentUid), { followingCount: increment(-1) })
  await updateDoc(doc(db, 'users', targetUid), { followersCount: increment(-1) })
}

export async function cancelFollowRequest(currentUid: string, targetUid: string) {
  await deleteDoc(doc(db, 'users', targetUid, 'followRequests', currentUid))
}

export async function approveFollowRequest(ownerUid: string, requestorUid: string) {
  await deleteDoc(doc(db, 'users', ownerUid, 'followRequests', requestorUid))
  await setDoc(doc(db, 'users', requestorUid, 'following', ownerUid), { followedAt: serverTimestamp() })
  await setDoc(doc(db, 'users', ownerUid, 'followers', requestorUid), { followedAt: serverTimestamp() })
  await updateDoc(doc(db, 'users', requestorUid), { followingCount: increment(1) })
  await updateDoc(doc(db, 'users', ownerUid), { followersCount: increment(1) })
}

export async function rejectFollowRequest(ownerUid: string, requestorUid: string) {
  await deleteDoc(doc(db, 'users', ownerUid, 'followRequests', requestorUid))
}

export function subscribeIsFollowing(currentUid: string, targetUid: string, cb: (v: boolean) => void) {
  return onSnapshot(doc(db, 'users', currentUid, 'following', targetUid), snap => cb(snap.exists()))
}

export function subscribeIsFollowRequestPending(currentUid: string, targetUid: string, cb: (v: boolean) => void) {
  return onSnapshot(doc(db, 'users', targetUid, 'followRequests', currentUid), snap => cb(snap.exists()))
}

export async function getFollowingUids(uid: string): Promise<string[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'following'))
  return snap.docs.map(d => d.id)
}

export async function getFollowers(uid: string): Promise<UserModel[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'followers'))
  const users = await Promise.all(snap.docs.map(d => getUser(d.id)))
  return users.filter(Boolean) as UserModel[]
}

export async function getFollowing(uid: string): Promise<UserModel[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'following'))
  const users = await Promise.all(snap.docs.map(d => getUser(d.id)))
  return users.filter(Boolean) as UserModel[]
}

// ── Notifications ──────────────────────────────────────────────────────────

export function subscribeNotifications(uid: string, cb: (notifs: NotificationModel[]) => void) {
  const q = query(
    collection(db, 'users', uid, 'notifications'),
    orderBy('createdAt', 'desc'),
    limit(50)
  )
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() }) as NotificationModel))
  })
}

export async function markNotificationRead(uid: string, notifId: string) {
  await updateDoc(doc(db, 'users', uid, 'notifications', notifId), { isRead: true })
}

export async function markAllNotificationsRead(uid: string) {
  const snap = await getDocs(query(
    collection(db, 'users', uid, 'notifications'),
    where('isRead', '==', false)
  ))
  await Promise.all(snap.docs.map(d => updateDoc(d.ref, { isRead: true })))
}

// ── Follow Requests ────────────────────────────────────────────────────────

export function subscribeFollowRequests(uid: string, cb: (requests: { uid: string; displayName: string; photoUrl: string }[]) => void) {
  return onSnapshot(collection(db, 'users', uid, 'followRequests'), snap => {
    cb(snap.docs.map(d => d.data() as { uid: string; displayName: string; photoUrl: string }))
  })
}
