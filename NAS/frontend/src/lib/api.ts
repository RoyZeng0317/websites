const BACKEND = import.meta.env.VITE_BACKEND_URL

const TOKEN_KEY = 'nas_jwt'

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
  const res = await fetch(`${BACKEND}${url}`, {
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
    xhr.open('POST', `${BACKEND}${url}`)
    xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`)
    xhr.upload.onprogress = e => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve()
      else {
        const data = JSON.parse(xhr.responseText || '{}')
        reject(new Error(data.error ?? '上傳失敗'))
      }
    }
    xhr.onerror = () => reject(new Error('網路錯誤'))
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
        reject(new Error(`下載失敗 HTTP ${xhr.status}`))
      }
    }
    xhr.onerror = () => reject(new Error('網路錯誤'))
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
  return `${BACKEND}/api/files/download?path=${encodeURIComponent(filePath)}&token=${getToken()}`
}
