import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
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
  const snapshot = await getDocs(query(holdingsCollectionRef(uid), orderBy('updatedAt', 'desc')))
  return snapshot.docs.map((item) => {
    const data = item.data() as HoldingPosition
    return { id: item.id, ...data }
  })
}

export async function loadSymbolHoldings(uid: string, symbol: string): Promise<HoldingDoc[]> {
  const snapshot = await getDocs(
    query(holdingsCollectionRef(uid), where('symbol', '==', symbol)),
  )
  const docs = snapshot.docs.map((item) => {
    const data = item.data() as HoldingPosition
    return { id: item.id, ...data }
  })
  docs.sort((a, b) => b.updatedAt.toMillis() - a.updatedAt.toMillis())
  return docs
}

export async function saveHolding(uid: string, position: HoldingPosition): Promise<string> {
  const docRef = await addDoc(holdingsCollectionRef(uid), position)
  return docRef.id
}

export async function deleteHolding(uid: string, docId: string) {
  await deleteDoc(doc(holdingsCollectionRef(uid), docId))
}
