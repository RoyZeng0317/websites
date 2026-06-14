const PW_KEY = 'pchats_pw_hash'

async function sha256base64(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

class ChatSessionLock {
  private unlockedPeers = new Set<string>()
  private appUnlocked = false

  isPeerUnlocked(peerId: string): boolean {
    return this.appUnlocked && this.unlockedPeers.has(peerId)
  }

  markUnlocked(peerId: string): void {
    this.appUnlocked = true
    this.unlockedPeers.add(peerId)
  }

  lockPeer(peerId: string): void {
    this.unlockedPeers.delete(peerId)
  }

  lockAll(): void {
    this.unlockedPeers.clear()
    this.appUnlocked = false
  }

  hasPassword(): boolean {
    return localStorage.getItem(PW_KEY) !== null
  }

  async setPassword(password: string): Promise<void> {
    localStorage.setItem(PW_KEY, await sha256base64(password))
  }

  async verify(password: string): Promise<boolean> {
    const stored = localStorage.getItem(PW_KEY)
    if (!stored) return false
    return stored === (await sha256base64(password))
  }
}

export const sessionLock = new ChatSessionLock()
