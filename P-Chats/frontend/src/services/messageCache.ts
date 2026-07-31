// Client for the Pi-hosted message cache. Firestore only ever carries a metadata
// signal doc (from/to/timestamp/burnTimer/recalled/edited) — the encrypted
// ct/nonce/mac payload lives here instead, and the Pi enforces burn-timer
// deletion server-side so a closed tab can't skip it.
import { auth } from '../firebase'

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001'

export interface EncryptedPayload {
  ct: string
  nonce: string
  mac: string
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await auth.currentUser?.getIdToken()
  if (!token) throw new Error('Not authenticated')
  return { Authorization: `Bearer ${token}` }
}

export async function pushMessage(
  to: string,
  payload: EncryptedPayload,
  burnTimer: string,
): Promise<{ id: string; timestamp: number }> {
  const res = await fetch(`${BACKEND_URL}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify({ to, ...payload, burnTimer }),
  })
  if (!res.ok) throw new Error('Failed to cache message')
  return res.json()
}

export async function fetchMessage(id: string): Promise<EncryptedPayload> {
  const res = await fetch(`${BACKEND_URL}/api/messages/${id}`, { headers: await authHeaders() })
  if (!res.ok) throw new Error('Message unavailable')
  return res.json()
}

export async function editMessageContent(id: string, payload: EncryptedPayload): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/messages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to edit cached message')
}

export async function deleteMessageContent(id: string): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/messages/${id}`, { method: 'DELETE', headers: await authHeaders() })
  } catch { /* best-effort — Pi's own TTL sweep is the real backstop */ }
}
