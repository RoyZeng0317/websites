const CLOUD_NAME = 'dgopeoebw'
const API_KEY = '549262742261114'
const API_SECRET = '4lp1DL1oYdS1Y8Jt-RkVYu5UZZc'

async function sha256hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export interface MediaResult {
  url: string
  publicId: string
}

class MediaService {
  async upload(uid: string, file: File, resourceType: string): Promise<MediaResult | null> {
    const timestamp = Math.floor(Date.now() / 1000)
    const folder = `pchats/${uid}`
    const toSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`
    const signature = await sha256hex(toSign)

    const form = new FormData()
    form.append('file', file)
    form.append('api_key', API_KEY)
    form.append('timestamp', String(timestamp))
    form.append('signature', signature)
    form.append('folder', folder)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      { method: 'POST', body: form },
    )
    if (!res.ok) return null
    const data = await res.json() as { secure_url: string; public_id: string }
    return { url: data.secure_url, publicId: data.public_id }
  }

  async delete(publicId: string, resourceType: string): Promise<void> {
    const timestamp = Math.floor(Date.now() / 1000)
    const toSign = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`
    const signature = await sha256hex(toSign)

    const form = new FormData()
    form.append('public_id', publicId)
    form.append('api_key', API_KEY)
    form.append('timestamp', String(timestamp))
    form.append('signature', signature)
    form.append('signature_algorithm', 'sha256')

    await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/destroy`,
      { method: 'POST', body: form },
    ).catch(() => {})
  }
}

export const mediaService = new MediaService()
