import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
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

function holdingDocRef(uid: string, symbol: string) {
  return doc(db, 'users', uid, 'holdings', symbol)
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

export async function loadHoldings(uid: string): Promise<HoldingPosition[]> {
  const snapshot = await getDocs(query(holdingsCollectionRef(uid), orderBy('updatedAt', 'desc')))
  return snapshot.docs.map((item) => item.data() as HoldingPosition)
}

export async function loadHolding(uid: string, symbol: string): Promise<HoldingPosition | null> {
  const snapshot = await getDoc(holdingDocRef(uid, symbol))
  return snapshot.exists() ? (snapshot.data() as HoldingPosition) : null
}

export async function saveHolding(uid: string, position: HoldingPosition) {
  await setDoc(holdingDocRef(uid, position.symbol), position)
}

export async function deleteHolding(uid: string, symbol: string) {
  await deleteDoc(holdingDocRef(uid, symbol))
}
