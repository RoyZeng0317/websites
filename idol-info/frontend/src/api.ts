const BASE_URL = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  if (res.status === 204) return undefined as T
  return res.json()
}

export interface IdolGroup {
  id: number
  name: string
  name_zh?: string
  name_ja?: string
  name_ko?: string
  debut_date?: string
  agency?: string
  label?: string
  country?: string
  status?: string
  image_url?: string
  biography?: string
}

export interface Idol {
  id: number
  stage_name: string
  stage_name_zh?: string
  stage_name_ja?: string
  stage_name_ko?: string
  real_name?: string
  nickname?: string
  birth_date?: string
  birthplace?: string
  blood_type?: string
  height_cm?: number
  image_url?: string
  social_media?: Record<string, string>
}

export interface GroupMember {
  id: number
  idol_id: number
  group_id: number
  generation_id?: number
  join_date?: string
  graduate_date?: string
  status?: string
  color?: string
  position?: string
}

export interface Album {
  id: number
  group_id?: number
  title: string
  title_zh?: string
  title_ja?: string
  release_date?: string
  type?: string
  image_url?: string
  total_tracks?: number
}

export interface Concert {
  id: number
  group_id?: number
  title: string
  title_zh?: string
  title_ja?: string
  venue?: string
  location?: string
  concert_date: string
  type?: string
  image_url?: string
}

// Groups
export const getGroups = () => request<IdolGroup[]>('/groups')
export const getGroup = (id: number) => request<IdolGroup>(`/groups/${id}`)

// Idols
export const getIdols = () => request<Idol[]>('/idols')
export const getIdol = (id: number) => request<Idol>(`/idols/${id}`)

// Group Members
export const getGroupMembers = (groupId: number) =>
  request<GroupMember[]>(`/groups/${groupId}/members`)

// Albums
export const getAlbums = (groupId?: number) =>
  request<Album[]>(`/albums${groupId ? `?group_id=${groupId}` : ''}`)

// Concerts
export const getConcerts = (groupId?: number) =>
  request<Concert[]>(`/concerts${groupId ? `?group_id=${groupId}` : ''}`)
