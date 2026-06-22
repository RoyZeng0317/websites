export interface Song {
  name: string
  filename: string
  url: string       // empty string for YT Music songs (resolved on demand)
  artist?: string
  albumArt?: string // YouTube thumbnail URL
  videoId?: string  // YouTube video ID
}

export interface ChatMessage {
  id: string
  role: 'user' | 'dj'
  text: string
  audio_url?: string | null
  timestamp: string
}

export interface ProgramSegment {
  name: string
  theme: string
  description: string
  duration: string
}

export interface WSMessage {
  type: 'welcome' | 'now_playing' | 'dj_intro' | 'chat_reply' | 'error'
  message?: string
  song?: Song
  script?: string
  audio_url?: string | null
  next_song?: Song
  text?: string
  timestamp: string
}
