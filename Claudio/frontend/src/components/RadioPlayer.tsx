import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { Song } from '../types'
import './RadioPlayer.css'

interface Props {
  audioRef: RefObject<HTMLAudioElement>
  song: Song | null
  playing: boolean
  onPlay: () => void
  onPause: () => void
  onPrev: () => void
  onNext: () => void
  onEnded: () => void
}

export function RadioPlayer({
  audioRef,
  song,
  playing,
  onPlay,
  onPause,
  onPrev,
  onNext,
  onEnded,
}: Props) {
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const progressRef = useRef<HTMLDivElement>(null)

  // Load song
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !song) return
    audio.src = song.url
    audio.volume = volume
    audio.load()
    if (playing) audio.play().catch(() => {})
  }, [song?.url]) // eslint-disable-line react-hooks/exhaustive-deps

  // Play / pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [playing]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(audio.currentTime)
    setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio?.duration || !progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="card radio-player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={onEnded}
        preload="metadata"
      />

      {song && (
        <div className="player-song-info">
          <p className="player-song-title">{song.name}</p>
          {song.artist && <p className="player-song-artist">{song.artist}</p>}
        </div>
      )}

      <div
        className="progress-track"
        ref={progressRef}
        onClick={handleSeek}
      >
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        <div className="progress-thumb" style={{ left: `${progress}%` }} />
      </div>

      <div className="time-row">
        <span>{fmt(currentTime)}</span>
        <span>{fmt(duration)}</span>
      </div>

      <div className="controls">
        <button className="ctrl-btn" onClick={onPrev} title="上一首">
          ⏮
        </button>

        <button
          className="ctrl-btn play-btn"
          onClick={playing ? onPause : onPlay}
          disabled={!song}
          title={playing ? '暫停' : '播放'}
        >
          {playing ? '⏸' : '▶'}
        </button>

        <button className="ctrl-btn" onClick={onNext} title="下一首">
          ⏭
        </button>

        <div className="volume-row">
          <span className="vol-icon">🔊</span>
          <input
            type="range"
            className="volume-slider"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolume}
          />
        </div>
      </div>
    </div>
  )
}
