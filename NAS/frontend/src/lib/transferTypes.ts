export type TaskStatus = 'pending' | 'running' | 'done' | 'error' | 'canceled'

export interface UploadTask {
  id: string
  name: string
  uploadPath: string
  file: File
  progress: number
  status: TaskStatus
  error?: string
  abort?: () => void
  retries?: number
}

export interface DownloadTask {
  id: string
  name: string
  filePath: string
  progress: number
  status: TaskStatus
  error?: string
  abort?: () => void
}
