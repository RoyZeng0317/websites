export type FileCategory =
  | 'image' | 'video' | 'audio'
  | 'pdf' | 'doc' | 'sheet' | 'slide'
  | 'archive' | 'code' | 'text'
  | 'folder' | 'other'

export type OfficeCategory = Extract<FileCategory, 'doc' | 'sheet' | 'slide'>

const EXT_MAP: Record<string, FileCategory> = {
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image',
  svg: 'image', bmp: 'image', ico: 'image', heic: 'image', heif: 'image', avif: 'image',
  mp4: 'video', mkv: 'video', avi: 'video', mov: 'video', wmv: 'video',
  webm: 'video', m4v: 'video', flv: 'video', ts: 'video',
  mp3: 'audio', wav: 'audio', flac: 'audio', aac: 'audio',
  ogg: 'audio', m4a: 'audio', opus: 'audio', wma: 'audio',
  pdf: 'pdf',
  doc: 'doc', docx: 'doc',
  xls: 'sheet', xlsx: 'sheet',
  ppt: 'slide', pptx: 'slide',
  zip: 'archive', rar: 'archive', '7z': 'archive',
  tar: 'archive', gz: 'archive', bz2: 'archive', xz: 'archive',
  js: 'code', jsx: 'code', tsx: 'code',
  py: 'code', sh: 'code', bash: 'code',
  html: 'code', css: 'code', json: 'code', xml: 'code',
  yaml: 'code', yml: 'code', toml: 'code',
  go: 'code', rs: 'code', java: 'code', kt: 'code',
  c: 'code', cpp: 'code', h: 'code', cs: 'code',
  php: 'code', rb: 'code', swift: 'code', dart: 'code',
  sql: 'code', dockerfile: 'code',
  txt: 'text', md: 'text', log: 'text',
  ini: 'text', conf: 'text', env: 'text', csv: 'text',
}

export function getCategory(name: string, isFolder: boolean): FileCategory {
  if (isFolder) return 'folder'
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  return EXT_MAP[ext] ?? 'other'
}

export function isViewable(cat: FileCategory): boolean {
  return ['image', 'video', 'audio', 'text', 'code', 'pdf'].includes(cat)
}

export function isEditable(cat: FileCategory): boolean {
  return cat === 'text' || cat === 'code'
}

export function isOfficeCategory(cat: FileCategory): cat is OfficeCategory {
  return cat === 'doc' || cat === 'sheet' || cat === 'slide'
}
