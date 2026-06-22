import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import './App.css'

import { NowPlaying } from './components/NowPlaying'
import { RadioPlayer } from './components/RadioPlayer'
import { DJSpeech } from './components/DJSpeech'
import { ChatPanel } from './components/ChatPanel'
import { ProgramSchedule } from './components/ProgramSchedule'
import { useWebSocket } from './hooks/useWebSocket'
import type { ChatMessage, ProgramSegment, Song, WSMessage } from './types'

export default function App() {
  const [playlist, setPlaylist]     = useState<Song[]>([])
  const [currentIndex, setIndex]    = useState(0)
  const [playing, setPlaying]       = useState(false)
  const [djSpeaking, setDjSpeaking] = useState(false)
  const [djScript, setDjScript]     = useState('')
  const [djAudioUrl, setDjAudioUrl] = useState<string | null>(null)
  const [messages, setMessages]     = useState<ChatMessage[]>([])
  const [program, setProgram]       = useState<ProgramSegment[]>([])
  const [time, setTime]             = useState(new Date())

  const audioRef   = useRef<HTMLAudioElement>(null!)
  const djAudioRef = useRef<HTMLAudioElement>(null!)

  const currentSong = playlist[currentIndex] ?? null

  // Clock tick
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  // Bootstrap
  useEffect(() => {
    axios.get('/api/music').then((r) => {
      setPlaylist(r.data.files as Song[])
    })
    axios.post('/api/program/generate').then((r) => {
      setProgram((r.data.program as ProgramSegment[]) ?? [])
    })
  }, [])

  const handleWSMessage = useCallback((msg: WSMessage) => {
    switch (msg.type) {
      case 'welcome':
        setMessages((prev) => [
          ...prev,
          {
            id: `ws-${Date.now()}`,
            role: 'dj',
            text: msg.message ?? '',
            timestamp: msg.timestamp,
          },
        ])
        break

      case 'dj_intro':
        setDjScript(msg.script ?? '')
        setDjAudioUrl(msg.audio_url ?? null)
        setDjSpeaking(true)
        break

      case 'chat_reply':
        setMessages((prev) => [
          ...prev,
          {
            id: `dj-${Date.now()}`,
            role: 'dj',
            text: msg.text ?? '',
            audio_url: msg.audio_url,
            timestamp: msg.timestamp,
          },
        ])
        if (msg.audio_url) {
          setDjAudioUrl(msg.audio_url)
          setDjSpeaking(true)
        }
        break
    }
  }, [])

  const wsUrl = import.meta.env.VITE_WS_URL
    ? `${import.meta.env.VITE_WS_URL}/ws`
    : `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`
  const { connected, send } = useWebSocket(wsUrl, handleWSMessage)

  const handlePlay = useCallback(() => {
    setPlaying(true)
    send({ type: 'now_playing', song: currentSong })
  }, [currentSong, send])

  const handleSongEnded = useCallback(() => {
    const nextIndex = playlist.length ? (currentIndex + 1) % playlist.length : 0
    const nextSong = playlist[nextIndex]
    setIndex(nextIndex)
    if (nextSong) {
      send({ type: 'song_ended', next_song: nextSong })
    }
  }, [currentIndex, playlist, send])

  const handleDJEnded = useCallback(() => {
    setDjSpeaking(false)
  }, [])

  const handlePrev = useCallback(() => {
    setIndex((i) => (i - 1 + playlist.length) % playlist.length)
  }, [playlist.length])

  const handleNext = useCallback(() => {
    handleSongEnded()
  }, [handleSongEnded])

  const sendMessage = useCallback(async (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: 'user', text, timestamp: new Date().toISOString() },
    ])
    await axios.post('/api/dj/chat', { message: text })
  }, [])

  const fmtTime = time.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <span className="logo-mark">&#127897;</span>
          <span className="logo-text">CLAUDIO</span>
          <span className="logo-sub">AI RADIO</span>
        </div>

        <div className="on-air-wrap">
          <div className={`on-air-badge ${playing ? 'active' : ''}`}>
            <span className="on-air-dot" />
            ON AIR
          </div>
          {djSpeaking && (
            <span className="dj-speaking-label">DJ 正在說話</span>
          )}
        </div>

        <div className="header-right">
          <div className={`ws-dot ${connected ? 'on' : 'off'}`}>
            <span className="ws-circle" />
            {connected ? 'LIVE' : 'OFFLINE'}
          </div>
          <div className="clock">{fmtTime}</div>
        </div>
      </header>

      {/* Main */}
      <main className="app-main">
        <div className="left-panel">
          <NowPlaying song={currentSong} playing={playing && !djSpeaking} />
          <RadioPlayer
            audioRef={audioRef}
            song={currentSong}
            playing={playing && !djSpeaking}
            onPlay={handlePlay}
            onPause={() => setPlaying(false)}
            onPrev={handlePrev}
            onNext={handleNext}
            onEnded={handleSongEnded}
          />
        </div>

        <div className="center-panel">
          <DJSpeech
            audioRef={djAudioRef}
            script={djScript}
            audioUrl={djAudioUrl}
            speaking={djSpeaking}
            onEnded={handleDJEnded}
          />
        </div>

        <div className="right-panel">
          <ChatPanel messages={messages} onSend={sendMessage} />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <ProgramSchedule program={program} />
      </footer>
    </div>
  )
}
