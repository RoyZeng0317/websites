// X25519 key exchange + AES-256-GCM — compatible with the Flutter app's cryptography package.
// Stored format: { ct: base64, nonce: base64, mac: base64 }

interface EncryptedData {
  ct: string
  nonce: string
  mac: string
}

const b64enc = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf instanceof ArrayBuffer ? buf : buf.buffer, (buf as Uint8Array).byteOffset, (buf as Uint8Array).byteLength)))

const b64dec = (s: string) =>
  Uint8Array.from(atob(s), c => c.charCodeAt(0))

class EncryptionService {
  private keyPair: CryptoKeyPair | null = null
  private _publicKeyBase64 = ''
  private sharedSecrets = new Map<string, CryptoKey>()

  async generateKeyPair(): Promise<void> {
    this.keyPair = await crypto.subtle.generateKey(
      { name: 'X25519' } as EcKeyGenParams,
      true,
      ['deriveKey'],
    )
    const raw = await crypto.subtle.exportKey('raw', this.keyPair.publicKey)
    this._publicKeyBase64 = b64enc(raw)
  }

  get publicKeyBase64(): string { return this._publicKeyBase64 }

  async getSharedSecret(peerId: string, peerPublicKeyBase64: string): Promise<CryptoKey> {
    const cached = this.sharedSecrets.get(peerId)
    if (cached) return cached

    const peerPubKey = await crypto.subtle.importKey(
      'raw',
      b64dec(peerPublicKeyBase64),
      { name: 'X25519' } as EcKeyImportParams,
      false,
      [],
    )
    const derived = await crypto.subtle.deriveKey(
      { name: 'X25519', public: peerPubKey } as EcdhKeyDeriveParams,
      this.keyPair!.privateKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    )
    this.sharedSecrets.set(peerId, derived)
    return derived
  }

  async encrypt(plaintext: string, sharedKey: CryptoKey): Promise<EncryptedData> {
    const nonce = crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: nonce, tagLength: 128 },
      sharedKey,
      new TextEncoder().encode(plaintext),
    )
    // Web Crypto appends 16-byte auth tag; split for Flutter compatibility
    const enc = new Uint8Array(encrypted)
    const ct = enc.slice(0, enc.length - 16)
    const mac = enc.slice(enc.length - 16)
    return { ct: b64enc(ct), nonce: b64enc(nonce), mac: b64enc(mac) }
  }

  async decrypt(data: EncryptedData, sharedKey: CryptoKey): Promise<string> {
    const ct = b64dec(data.ct)
    const mac = b64dec(data.mac)
    const combined = new Uint8Array(ct.length + mac.length)
    combined.set(ct)
    combined.set(mac, ct.length)
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: b64dec(data.nonce), tagLength: 128 },
      sharedKey,
      combined,
    )
    return new TextDecoder().decode(decrypted)
  }

  clearSharedSecret(peerId: string): void {
    this.sharedSecrets.delete(peerId)
  }
}

export const encryptionService = new EncryptionService()
