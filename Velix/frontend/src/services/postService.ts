import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  query, orderBy, limit, where, onSnapshot, increment, serverTimestamp,
  setDoc, arrayUnion, Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { PostModel, CommentModel } from '../types'

function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w一-鿿]+/g) || []
  return [...new Set(matches.map(t => t.slice(1).toLowerCase()))]
}

// Set this to the platform owner's Firebase Auth UID.
// Their very first post will always appear in every user's "最新" feed.
export const PLATFORM_OWNER_UID = ''

// ── Posts ──────────────────────────────────────────────────────────────────

export async function createPost(
  uid: string,
  data: {
    authorName: string
    authorUsername: string
    authorPhotoUrl: string
    content: string
    imageUrl?: string
    videoUrl?: string
    mediaUrls?: string[]
    locationName?: string
    musicTitle?: string
    musicArtist?: string
    category?: string
  }
): Promise<string> {
  const hashtags = extractHashtags(data.content)
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  )
  const ref = await addDoc(collection(db, 'posts'), {
    ...cleanData,
    authorId: uid,
    hashtags,
    likesCount: 0,
    commentsCount: 0,
    viewsCount: 0,
    repostsCount: 0,
    createdAt: serverTimestamp(),
  })
  await updateDoc(doc(db, 'users', uid), { postsCount: increment(1) })
  return ref.id
}

export async function incrementViewCount(postId: string) {
  await updateDoc(doc(db, 'posts', postId), { viewsCount: increment(1) })
}

export async function editPost(postId: string, content: string) {
  const hashtags = extractHashtags(content)
  await updateDoc(doc(db, 'posts', postId), { content, hashtags, updatedAt: serverTimestamp() })
}

export async function deletePost(postId: string, authorId: string) {
  await deleteDoc(doc(db, 'posts', postId))
  await updateDoc(doc(db, 'users', authorId), { postsCount: increment(-1) })
}

export function subscribeFeed(
  callback: (posts: PostModel[]) => void,
  limitCount = 60
) {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(limitCount))
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as PostModel))
  })
}

// Fetch owner's first-ever post (welcome post visible to everyone)
let _cachedWelcomePost: PostModel | null | undefined = undefined
async function getOwnerWelcomePost(): Promise<PostModel | null> {
  if (!PLATFORM_OWNER_UID) return null
  if (_cachedWelcomePost !== undefined) return _cachedWelcomePost
  try {
    const snap = await getDocs(query(
      collection(db, 'posts'),
      where('authorId', '==', PLATFORM_OWNER_UID),
      orderBy('createdAt', 'asc'),
      limit(1)
    ))
    _cachedWelcomePost = snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as PostModel)
  } catch {
    _cachedWelcomePost = null
  }
  return _cachedWelcomePost
}

// Following-based feed with client-side filter
// followingUids: IDs the current user follows (from getFollowingUids)
// selfUid: current user's own UID
export function subscribeFollowingFeed(
  selfUid: string,
  followingUids: string[],
  callback: (posts: PostModel[], welcomePost: PostModel | null) => void,
  fetchLimit = 120
) {
  const allowed = new Set([selfUid, ...followingUids])
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(fetchLimit))

  return onSnapshot(q, async snap => {
    const posts = snap.docs
      .map(d => ({ id: d.id, ...d.data() }) as PostModel)
      .filter(p => allowed.has(p.authorId))

    // Include platform owner's welcome post for users who don't follow the owner
    let welcomePost: PostModel | null = null
    if (PLATFORM_OWNER_UID && !allowed.has(PLATFORM_OWNER_UID)) {
      welcomePost = await getOwnerWelcomePost()
    }

    callback(posts, welcomePost)
  })
}

export function subscribeUserPosts(uid: string, callback: (posts: PostModel[]) => void) {
  const q = query(
    collection(db, 'posts'),
    where('authorId', '==', uid),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as PostModel))
  })
}

export async function getHashtagPosts(tag: string): Promise<PostModel[]> {
  const q = query(
    collection(db, 'posts'),
    where('hashtags', 'array-contains', tag.toLowerCase()),
    orderBy('createdAt', 'desc'),
    limit(40)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as PostModel)
}

// ── Likes ──────────────────────────────────────────────────────────────────

export async function toggleLike(postId: string, uid: string, isLiked: boolean, post: PostModel) {
  const likeRef = doc(db, 'posts', postId, 'likes', uid)
  const postRef = doc(db, 'posts', postId)
  if (isLiked) {
    await deleteDoc(likeRef)
    await updateDoc(postRef, { likesCount: increment(-1) })
  } else {
    await setDoc(likeRef, { uid, createdAt: serverTimestamp() })
    await updateDoc(postRef, { likesCount: increment(1) })
    if (post.authorId !== uid) {
      await addNotification(post.authorId, uid, 'like', postId, post.content.slice(0, 80))
    }
  }
}

export async function isLiked(postId: string, uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'posts', postId, 'likes', uid))
  return snap.exists()
}

export function subscribeIsLiked(postId: string, uid: string, cb: (v: boolean) => void) {
  return onSnapshot(doc(db, 'posts', postId, 'likes', uid), snap => cb(snap.exists()))
}

// ── Bookmarks ──────────────────────────────────────────────────────────────

export async function toggleBookmark(postId: string, uid: string, isBookmarked: boolean) {
  const ref = doc(db, 'users', uid, 'bookmarks', postId)
  if (isBookmarked) {
    await deleteDoc(ref)
  } else {
    await setDoc(ref, { postId, savedAt: Date.now() })
  }
}

export function subscribeIsBookmarked(postId: string, uid: string, cb: (v: boolean) => void) {
  return onSnapshot(doc(db, 'users', uid, 'bookmarks', postId), snap => cb(snap.exists()))
}

export async function getUserBookmarks(uid: string): Promise<PostModel[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'bookmarks'))
  const postIds = snap.docs.map(d => d.id)
  if (!postIds.length) return []
  const posts = await Promise.all(
    postIds.map(id => getDoc(doc(db, 'posts', id)).then(d => d.exists() ? ({ id: d.id, ...d.data() } as PostModel) : null))
  )
  return posts.filter(Boolean) as PostModel[]
}

// ── Reposts ────────────────────────────────────────────────────────────────

export async function toggleRepost(postId: string, uid: string, isReposted: boolean, post: PostModel) {
  const repostRef = doc(db, 'users', uid, 'reposts', postId)
  const postRef = doc(db, 'posts', postId)
  if (isReposted) {
    await deleteDoc(repostRef)
    await updateDoc(postRef, { repostsCount: increment(-1) })
  } else {
    await setDoc(repostRef, { postId, repostedAt: Date.now() })
    await updateDoc(postRef, { repostsCount: increment(1) })
  }
}

export function subscribeIsReposted(postId: string, uid: string, cb: (v: boolean) => void) {
  return onSnapshot(doc(db, 'users', uid, 'reposts', postId), snap => cb(snap.exists()))
}

// ── Comments ───────────────────────────────────────────────────────────────

export function subscribeComments(postId: string, cb: (comments: CommentModel[]) => void) {
  const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'))
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() }) as CommentModel)  )
  })
}

export async function addComment(
  postId: string,
  uid: string,
  authorName: string,
  authorUsername: string,
  authorPhotoUrl: string,
  content: string,
  post: PostModel
) {
  await addDoc(collection(db, 'posts', postId, 'comments'), {
    authorId: uid,
    authorName,
    authorUsername,
    authorPhotoUrl,
    content,
    createdAt: serverTimestamp(),
  })
  await updateDoc(doc(db, 'posts', postId), { commentsCount: increment(1) })
  if (post.authorId !== uid) {
    await addNotification(post.authorId, uid, 'comment', postId, post.content.slice(0, 80))
  }
}

// ── Recommendation ─────────────────────────────────────────────────────────

function toMs(v: any): number {
  if (!v) return 0
  if (typeof v.toMillis === 'function') return v.toMillis()
  if (typeof v === 'number') return v
  return 0
}

export async function recordInteraction(uid: string, post: PostModel, weight: number) {
  const tags = post.hashtags ?? []
  const cat = post.category
  if (!tags.length && !cat) return
  const updates: Record<string, any> = {}
  tags.forEach(tag => { updates[`interests.${tag}`] = increment(weight) })
  if (cat) updates[`interests.__cat_${cat}`] = increment(weight * 0.6)
  try { await updateDoc(doc(db, 'users', uid), updates) } catch {}
}

export async function getRecommendedFeed(uid: string, limitCount = 80): Promise<PostModel[]> {
  const [userSnap, postsSnap] = await Promise.all([
    getDoc(doc(db, 'users', uid)),
    getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(limitCount))),
  ])
  const interests: Record<string, number> = userSnap.data()?.interests ?? {}
  const posts = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }) as PostModel)

  const hasInterests = Object.keys(interests).length > 0
  if (!hasInterests) return posts

  const now = Date.now()
  return posts
    .map(post => {
      let score = 0
      ;(post.hashtags ?? []).forEach(tag => { score += interests[tag] ?? 0 })
      if (post.category) score += interests[`__cat_${post.category}`] ?? 0
      const ageH = (now - toMs(post.createdAt)) / 3_600_000
      score += Math.max(0, 12 * Math.exp(-ageH / 36))
      return { post, score }
    })
    .sort((a, b) => b.score - a.score)
    .map(s => s.post)
}

// ── Notifications ──────────────────────────────────────────────────────────

export async function addNotification(
  toUserId: string,
  fromUserId: string,
  type: 'like' | 'comment' | 'follow' | 'followRequest',
  postId?: string,
  postContent?: string
) {
  const fromUser = await getDoc(doc(db, 'users', fromUserId))
  if (!fromUser.exists()) return
  const { displayName, photoUrl } = fromUser.data()
  await addDoc(collection(db, 'users', toUserId, 'notifications'), {
    toUserId,
    fromUserId,
    fromUserName: displayName,
    fromUserPhoto: photoUrl,
    type,
    postId: postId || null,
    postContent: postContent || null,
    isRead: false,
    createdAt: serverTimestamp(),
  })
}
