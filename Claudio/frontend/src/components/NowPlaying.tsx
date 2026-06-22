import { useMemo } from 'react'
import type { Song } from '../types'
import './NowPlaying.css'

interface Props {
  song: Song | null
  playing: boolean
}

export function NowPlaying({ song, playing }: Props) {
  const fallbackGradient = useMemo(() => {
    if (!song) return 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)'
    const h1 = (song.name.charCodeAt(0) * 137 + 60) % 360
    const h2 = (h1 + 80) % 360
    return `linear-gradient(135deg, hsl(${h1},70%,18%) 0%, hsl(${h2},60%,12%) 100%)`
  }, [song?.name])

  return (
    <div className="card now-playing">
      <div
        className="album-art"
        style={song?.albumArt ? undefined : { background: fallbackGradient }}
      >
        {song?.albumArt && (
          <img
            src={song.albumArt}
            alt={song.name}
            className="album-img"
            crossOrigin="anonymous"
          />
        )}

        {playing && (
          <div className="eq-overlay">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="eq-bar"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        )}

        {!song?.albumArt && !playing && (
          <span className="music-icon">&#9835;</span>
        )}
      </div>

      <div className="song-info">
        <h2 className="song-title">
          {song ? song.name : 'Claudio AI Radio'}
        </h2>
        <p className="song-artist">
          {song?.artist ?? (song ? '' : '正在載入播放清單…')}
        </p>
      </div>
    </div>
  )
}
