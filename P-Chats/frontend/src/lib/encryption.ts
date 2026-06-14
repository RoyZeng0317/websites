export class EncryptionService {
  private keyPair: CryptoKeyPair | null = null
  private publicKeyBytes: Uint8Array | null = null
  private sharedSecrets = new Map<string, CryptoKey>()

  async generateKeyPair(): Promise<void> {
    this.keyPair = await crypto.subtle.generateKey(
      { name: 'X25519' } as AlgorithmIdentifier,
      true,
      ['deriveBits'],
    ) as CryptoKeyPair
    const raw = await crypto.subtle.exportKey('raw', this.keyPair.publicKey)
    this.publicKeyBytes = new Uint8Array(raw)
  }

  get publicKeyBase64(): string {
    if (!this.publicKeyBytes) throw new Error('Key pair not generated')
    return btoa(String.fromCharCode(...this.publicKeyBytes))
  }

  clearSharedSecret(peerId: string): void {
    this.sharedSecrets.delete(peerId)
  }

  async getSharedSecret(peerId: string, peerPublicKeyBase64: string): Promise<CryptoKey> {
    const cached = this.sharedSecrets.get(peerId)
    if (cached) return cached

    const peerKeyBytes = Uint8Array.from(atob(peerPublicKeyBase64), c => c.charCodeAt(0))
    const peerPublicKey = await crypto.subtle.importKey(
      'raw',
      peerKeyBytes,
      { name: 'X25519' } as AlgorithmIdentifier,
      true,
      [],
    )
    const sharedBits = await crypto.subtle.deriveBits(
      { name: 'X25519', public: peerPublicKey } as AlgorithmIdentifier,
      this.keyPair!.privateKey,
      256,
    )
    const aesKey = await crypto.subtle.importKey(
      'raw',
      sharedBits,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    )
    this.sharedSecrets.set(peerId, aesKey)
    return aesKey
  }

  async encryptToMap(
    plainText: string,
    sharedKey: CryptoKey,
  ): Promise<{ ct: string; nonce: string; mac: string }> {
    const nonce = crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: nonce, tagLength: 128 },
      sharedKey,
      new TextEncoder().encode(plainText),
    )
    const bytes = new Uint8Array(encrypted)
    const ct = bytes.slice(0, -16)
    const mac = bytes.slice(-16)
    return {
      ct: btoa(String.fromCharCode(...ct)),
      nonce: btoa(String.fromCharCode(...nonce)),
      mac: btoa(String.fromCharCode(...mac)),
    }
  }

  async decryptFromMap(
    data: { ct: string; nonce: string; mac: string },
    sharedKey: CryptoKey,
  ): Promise<string> {
    const ct = Uint8Array.from(atob(data.ct), c => c.charCodeAt(0))
    const nonce = Uint8Array.from(atob(data.nonce), c => c.charCodeAt(0))
    const mac = Uint8Array.from(atob(data.mac), c => c.charCodeAt(0))
    const cipherWithTag = new Uint8Array(ct.length + mac.length)
    cipherWithTag.set(ct)
    cipherWithTag.set(mac, ct.length)
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: nonce, tagLength: 128 },
      sharedKey,
      cipherWithTag,
    )
    return new TextDecoder().decode(decrypted)
  }
}
