// Upload to Cloudinary (matches Flutter app behavior)
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadImage(file: File, uid: string, folder = 'posts'): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', `velix/${uid}/${folder}`)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.secure_url as string
}

export async function uploadMedia(file: File, uid: string, folder = 'posts'): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', `velix/${uid}/${folder}`)

  const isVideo = file.type.startsWith('video/')
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${isVideo ? 'video' : 'image'}/upload`

  const res = await fetch(endpoint, { method: 'POST', body: formData })
  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.secure_url as string
}

export async function uploadAvatar(file: File, uid: string): Promise<string> {
  return uploadImage(file, uid, 'avatar')
}

export async function uploadIdDocument(file: File, uid: string): Promise<string> {
  return uploadImage(file, uid, 'verification')
}

export async function uploadStoryImage(file: File, uid: string): Promise<string> {
  return uploadImage(file, uid, 'stories')
}

export async function uploadSelfie(file: File, uid: string): Promise<string> {
  return uploadImage(file, uid, 'selfie')
}
