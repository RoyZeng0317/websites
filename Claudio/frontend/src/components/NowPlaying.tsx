import { useMemo } from 'react'
import type { Song } from '../types'
import './NowPlaying.css'

interface Props {
  song: Song | null
  playing: boolean
}

export function NowPlaying({ song, playing }: Props) {
  const albumGradient = useMemo(() => {
    if (!song) return 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)'
    const h1 = (song.name.charCodeAt(0) * 137 + 60) % 360
    const h2 = (h1 + 80) % 360
    return `linear-gradient(135deg, hsl(${h1},70%,18%) 0%, hsl(${h2},60%,12%) 100%)`
  }, [song?.name])

  return (
    <div className="card now-playing">
      <div className="album-art" style={{ background: albumGradient }}>
        {playing ? (
          <div className="eq-bars">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="eq-bar"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        ) : (
          <span className="music-icon">&#9835;</span>
        )}
      </div>

      <div className="song-info">
        <h2 className="song-title">
          {song ? song.name : 'Claudio AI Radio'}
        </h2>
        <p className="song-artist">
          {song?.artist ?? (song ? '' : '將 MP3 加入 backend/music/ 開始播放')}
        </p>
      </div>
    </div>
  )
}
