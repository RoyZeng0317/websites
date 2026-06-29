const RP_ID = location.hostname === 'localhost' ? 'localhost' : location.hostname

export async function isBiometricAvailable(): Promise<boolean> {
  if (!window.PublicKeyCredential) return false
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch { return false }
}

export async function registerBiometric(peerUid: string, userId: string): Promise<boolean> {
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32))
    const cred = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { id: RP_ID, name: 'P Chats' },
        user: {
          id: new TextEncoder().encode(`${userId}_${peerUid}`),
          name: `pchat_${peerUid.slice(0, 8)}`,
          displayName: 'P Chats 聊天室鎖',
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred',
        },
        timeout: 60000,
      },
    })) as PublicKeyCredential | null
    if (!cred) return false
    const credId = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)))
    localStorage.setItem(`pchat_biometric_cred_${peerUid}`, credId)
    localStorage.setItem(`pchat_biometric_${peerUid}`, '1')
    return true
  } catch { return false }
}

export async function verifyBiometric(peerUid: string): Promise<boolean> {
  const b64 = localStorage.getItem(`pchat_biometric_cred_${peerUid}`)
  if (!b64) return false
  try {
    const credId = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
    const challenge = crypto.getRandomValues(new Uint8Array(32))
    const result = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{ type: 'public-key', id: credId }],
        userVerification: 'required',
        rpId: RP_ID,
        timeout: 60000,
      },
    })
    return !!result
  } catch { return false }
}

export function isBiometricEnabled(peerUid: string): boolean {
  return localStorage.getItem(`pchat_biometric_${peerUid}`) === '1'
}

export function disableBiometric(peerUid: string) {
  localStorage.removeItem(`pchat_biometric_${peerUid}`)
  localStorage.removeItem(`pchat_biometric_cred_${peerUid}`)
}
