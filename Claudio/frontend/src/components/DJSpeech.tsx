import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import './DJSpeech.css'

interface Props {
  audioRef: RefObject<HTMLAudioElement>
  script: string
  audioUrl: string | null
  speaking: boolean
  onEnded: () => void
}

export function DJSpeech({ audioRef, script, audioUrl, speaking, onEnded }: Props) {
  const prevUrlRef = useRef<string | null>(null)

  // Auto-play new DJ audio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl || audioUrl === prevUrlRef.current) return
    prevUrlRef.current = audioUrl
    audio.src = audioUrl
    audio.load()
    audio.play().catch(() => {})
  }, [audioUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="card dj-speech">
      <div className="dj-header">
        <div className={`dj-avatar ${speaking ? 'speaking' : ''}`}>
          <span className="dj-mic">&#127897;</span>
          {speaking && (
            <div className="dj-rings">
              <span /><span /><span />
            </div>
          )}
        </div>
        <div className="dj-identity">
          <span className="dj-name">Claudio</span>
          <span className={`dj-status ${speaking ? 'on' : 'off'}`}>
            {speaking ? '● ON AIR' : '○ STANDBY'}
          </span>
        </div>
      </div>

      <div className="script-box">
        {script ? (
          <p className="script-text">{script}</p>
        ) : (
          <p className="script-placeholder">
            Claudio 正在等待播放第一首歌…
          </p>
        )}
      </div>

      {speaking && (
        <div className="speech-wave">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="wave-bar"
              style={{ animationDelay: `${(i * 0.07).toFixed(2)}s` }}
            />
          ))}
        </div>
      )}

      <audio ref={audioRef} onEnded={onEnded} />
    </div>
  )
}
