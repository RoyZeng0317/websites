export async function hashPassword(pw: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw))
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

export const getPeerHash = (peerUid: string) =>
  localStorage.getItem(`pchat_lock_${peerUid}`)

export const setPeerHash = (peerUid: string, h: string) =>
  localStorage.setItem(`pchat_lock_${peerUid}`, h)

export const clearPeerHash = (peerUid: string) =>
  localStorage.removeItem(`pchat_lock_${peerUid}`)
