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

export function getUnitLabel(_symbol: string): 'share' {
  return 'share'
}

export function getShareCount(position: Pick<HoldingPosition, 'quantity' | 'unitLabel'>) {
  return position.quantity
}

export async function loadHoldings(uid: string): Promise<HoldingDoc[]> {
  const snapshot = await getDocs(holdingsCollectionRef(uid))
  const docs = snapshot.docs.map((item) => {
    const data = item.data() as HoldingPosition
    return { id: item.id, ...data }
  })
  docs.sort((a, b) => {
    const ta = 'toMillis' in a.updatedAt ? a.updatedAt.toMillis() : new Date(a.updatedAt as unknown as string).getTime()
    const tb = 'toMillis' in b.updatedAt ? b.updatedAt.toMillis() : new Date(b.updatedAt as unknown as string).getTime()
    return tb - ta
  })
  return docs
}

export async function loadSymbolHoldings(uid: string, symbol: string): Promise<HoldingDoc[]> {
  const snapshot = await getDocs(holdingsCollectionRef(uid))
  const docs: HoldingDoc[] = []
  for (const item of snapshot.docs) {
    const data = item.data() as HoldingPosition
    if (data.symbol === symbol) {
      docs.push({ id: item.id, ...data })
    }
  }
  docs.sort((a, b) => {
    const ta = 'toMillis' in a.updatedAt ? a.updatedAt.toMillis() : new Date(a.updatedAt as unknown as string).getTime()
    const tb = 'toMillis' in b.updatedAt ? b.updatedAt.toMillis() : new Date(b.updatedAt as unknown as string).getTime()
    return tb - ta
  })
  return docs
}

export async function saveHolding(uid: string, position: HoldingPosition): Promise<string> {
  const docRef = await addDoc(holdingsCollectionRef(uid), position)
  return docRef.id
}

export async function deleteHolding(uid: string, docId: string) {
  await deleteDoc(doc(holdingsCollectionRef(uid), docId))
}
