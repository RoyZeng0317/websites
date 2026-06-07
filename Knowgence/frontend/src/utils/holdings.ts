import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

export interface HoldingPosition {
  buyPrice: number
  companyName: string
  currency: string
  quantity: number
  symbol: string
  unitLabel: 'share'
  updatedAt: Timestamp
}

export interface HoldingDoc extends HoldingPosition {
  id: string
}

function holdingsCollectionRef(uid: string) {
  return collection(db, 'users', uid, 'holdings')
}

function toMs(ts: unknown): number {
  if (!ts) return 0
  if (typeof ts === 'object' && ts !== null && 'toMillis' in ts) {
    return (ts as { toMillis: () => number }).toMillis()
  }
  return new Date(String(ts)).getTime()
}

export function getUnitLabel(_symbol: string): 'share' {
  return 'share'
}

export function getShareCount(position: Pick<HoldingPosition, 'quantity' | 'unitLabel'>) {
  return position.quantity
}

export async function loadHoldings(uid: string): Promise<HoldingDoc[]> {
  let snapshot
  try {
    snapshot = await getDocs(holdingsCollectionRef(uid))
  } catch (err) {
    console.error('loadHoldings: getDocs failed, trying getDoc fallback', err)
    snapshot = null
  }
  if (!snapshot) {
    return []
  }
  const docs: HoldingDoc[] = snapshot.docs.map((item) => {
    const data = item.data() as HoldingPosition
    return { id: item.id, ...data }
  })
  docs.sort((a, b) => toMs(b.updatedAt) - toMs(a.updatedAt))
  return docs
}

export async function loadSymbolHoldings(uid: string, symbol: string): Promise<HoldingDoc[]> {
  const all = await loadHoldings(uid)
  return all.filter((d) => d.symbol === symbol)
}

export async function saveHolding(uid: string, position: HoldingPosition): Promise<string> {
  const docRef = await addDoc(holdingsCollectionRef(uid), position)
  return docRef.id
}

export async function deleteHolding(uid: string, docId: string) {
  await deleteDoc(doc(holdingsCollectionRef(uid), docId))
}
