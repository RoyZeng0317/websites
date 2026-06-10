import {
  collection, addDoc, updateDoc, doc,
  onSnapshot, orderBy, query, limit, arrayUnion,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { StoryModel } from '../types'

const STORY_TTL = 24 * 60 * 60 * 1000 // 24 hours in ms

export function subscribeStories(cb: (stories: StoryModel[]) => void) {
  const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'), limit(300))
  return onSnapshot(q, snap => {
    const now = Date.now()
    const stories = snap.docs
      .map(d => ({ id: d.id, ...d.data() }) as StoryModel)
      .filter(s => s.expiresAt > now)
    cb(stories)
  })
}

export async function createStory(
  uid: string,
  displayName: string,
  photoUrl: string,
  imageUrl: string,
) {
  const now = Date.now()
  await addDoc(collection(db, 'stories'), {
    uid,
    displayName,
    photoUrl,
    imageUrl,
    createdAt: now,
    expiresAt: now + STORY_TTL,
    viewedBy: [],
  })
}

export async function markStoryViewed(storyId: string, viewerUid: string) {
  await updateDoc(doc(db, 'stories', storyId), {
    viewedBy: arrayUnion(viewerUid),
  })
}
