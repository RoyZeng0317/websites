const DEFAULT_BACKEND = import.meta.env.VITE_BACKEND_URL
const BACKEND_KEY = 'nas_backend'   // QuickConnect override (VaultixID → resolved URL)

const TOKEN_KEY = 'nas_jwt'

// Active backend base URL: a QuickConnect-resolved override wins, else the build-time default.
export function backendBase(): string {
  return localStorage.getItem(BACKEND_KEY) || DEFAULT_BACKEND
}

export function setBackend(url: string) {
  localStorage.setItem(BACKEND_KEY, url)
}

export function clearBackend() {
  localStorage.removeItem(BACKEND_KEY)
}

// Resolve a VaultixID (QuickConnect ID) to its NAS backend URL + owning username.
// Always queries the build-time default backend (acts as the directory/broker).
export async function resolveVaultixId(id: string): Promise<{ backendUrl: string; username: string }> {
  const res = await fetch(`${DEFAULT_BACKEND}/api/vaultix/resolve?id=${encodeURIComponent(id)}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `找不到此 Vaultix ID`)
  return data as { backendUrl: string; username: string }
}

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? ''
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(`${backendBase()}${url}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${getToken()}`,
    },
  })
  if (res.status === 401) {
    clearToken()
    window.location.href = '/login'
  }
  return res
}

export async function apiJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(url, options)
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function apiUpload(
  url: string,
  body: FormData,
  onProgress: (pct: number) => void
): { promise: Promise<void>; abort: () => void } {
  let xhr!: XMLHttpRequest
  const promise = new Promise<void>((resolve, reject) => {
    xhr = new XMLHttpRequest()
    xhr.open('POST', `${backendBase()}${url}`)
    xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`)
    xhr.upload.onprogress = e => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve()
      else {
        const data = JSON.parse(xhr.responseText || '{}')
        reject(new Error(data.error ?? 'Upload failed'))
      }
    }
    xhr.onerror = () => reject(new Error('Connection dropped — check Pi disk space or file size'))
    xhr.onabort = () => {
      const err = new Error('canceled')
      err.name = 'AbortError'
      reject(err)
    }
    xhr.send(body)
  })
  return { promise, abort: () => xhr.abort() }
}

export function apiDownload(
  url: string,
  filename: string,
  onProgress: (pct: number) => void
): { promise: Promise<void>; abort: () => void } {
  let xhr!: XMLHttpRequest
  const promise = new Promise<void>((resolve, reject) => {
    xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.onprogress = e => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const blobUrl = URL.createObjectURL(xhr.response as Blob)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000)
        resolve()
      } else {
        reject(new Error(`Download failed HTTP ${xhr.status}`))
      }
    }
    xhr.onerror = () => reject(new Error('Network error'))
    xhr.onabort = () => {
      const err = new Error('canceled')
      err.name = 'AbortError'
      reject(err)
    }
    xhr.send()
  })
  return { promise, abort: () => xhr.abort() }
}

export function downloadUrl(filePath: string): string {
  return `${backendBase()}/api/files/download?path=${encodeURIComponent(filePath)}&token=${getToken()}`
}
