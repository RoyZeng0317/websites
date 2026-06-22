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
  const [playlist, setPlaylist]         = useState<Song[]>([])
  const [currentIndex, setIndex]        = useState(0)
  const [playing, setPlaying]           = useState(false)
  const [djSpeaking, setDjSpeaking]     = useState(false)
  const [djScript, setDjScript]         = useState('')
  const [djAudioUrl, setDjAudioUrl]     = useState<string | null>(null)
  const [messages, setMessages]         = useState<ChatMessage[]>([])
  const [program, setProgram]           = useState<ProgramSegment[]>([])
  const [time, setTime]                 = useState(new Date())
  const [resolving, setResolving]       = useState(false)
  const [resolvedSong, setResolvedSong] = useState<Song | null>(null)

  const audioRef   = useRef<HTMLAudioElement>(null!)
  const djAudioRef = useRef<HTMLAudioElement>(null!)

  // Clock
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  // Bootstrap: try YT Music → fall back to local files
  useEffect(() => {
    axios.get('/api/ytmusic/songs?source=history&limit=60')
      .then((r) => setPlaylist(r.data.files as Song[]))
      .catch(() =>
        axios.get('/api/music').then((r) => setPlaylist(r.data.files as Song[]))
      )

    axios.post('/api/program/generate')
      .then((r) => setProgram((r.data.program as ProgramSegment[]) ?? []))
      .catch(() => {})
  }, [])

  // Resolve stream URL whenever currentIndex changes (YouTube Music songs have empty url)
  useEffect(() => {
    const song = playlist[currentIndex]
    if (!song) return

    if (song.videoId && !song.url) {
      setResolving(true)
      axios.get(`/api/ytmusic/stream/${song.videoId}`)
        .then((r) => {
          const updated: Song = { ...song, url: r.data.url }
          setResolvedSong(updated)
          // Cache the resolved URL in playlist so we don't re-fetch
          setPlaylist((prev) => {
            const next = [...prev]
            next[currentIndex] = updated
            return next
          })
        })
        .catch(() => setResolvedSong(song))
        .finally(() => setResolving(false))
    } else {
      setResolvedSong(song)
    }
  }, [currentIndex, playlist.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-fetch next song's stream URL while current song is playing
  useEffect(() => {
    if (!playlist.length) return
    const nextIdx = (currentIndex + 1) % playlist.length
    const next = playlist[nextIdx]
    if (next?.videoId && !next.url) {
      axios.get(`/api/ytmusic/stream/${next.videoId}`)
        .then((r) => {
          setPlaylist((prev) => {
            if (prev[nextIdx]?.url) return prev  // already resolved
            const copy = [...prev]
            copy[nextIdx] = { ...copy[nextIdx], url: r.data.url }
            return copy
          })
        })
        .catch(() => {})
    }
  }, [currentIndex, playlist.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // WebSocket
  const handleWSMessage = useCallback((msg: WSMessage) => {
    switch (msg.type) {
      case 'welcome':
        setMessages((prev) => [
          ...prev,
          { id: `ws-${Date.now()}`, role: 'dj', text: msg.message ?? '', timestamp: msg.timestamp },
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
          { id: `dj-${Date.now()}`, role: 'dj', text: msg.text ?? '', audio_url: msg.audio_url, timestamp: msg.timestamp },
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
    send({ type: 'now_playing', song: resolvedSong })
  }, [resolvedSong, send])

  const handleSongEnded = useCallback(() => {
    const nextIndex = playlist.length ? (currentIndex + 1) % playlist.length : 0
    const nextSong = playlist[nextIndex]
    setIndex(nextIndex)
    if (nextSong) send({ type: 'song_ended', next_song: nextSong })
  }, [currentIndex, playlist, send])

  const handleDJEnded = useCallback(() => setDjSpeaking(false), [])

  const handlePrev = useCallback(() => {
    setIndex((i) => (i - 1 + playlist.length) % playlist.length)
  }, [playlist.length])

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
          {resolving && <span className="dj-speaking-label">載入音樂中…</span>}
          {djSpeaking && !resolving && <span className="dj-speaking-label">DJ 正在說話</span>}
        </div>

        <div className="header-right">
          <div className={`ws-dot ${connected ? 'on' : 'off'}`}>
            <span className="ws-circle" />
            {connected ? 'LIVE' : 'OFFLINE'}
          </div>
          <div className="clock">{fmtTime}</div>
        </div>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <NowPlaying song={resolvedSong} playing={playing && !djSpeaking && !resolving} />
          <RadioPlayer
            audioRef={audioRef}
            song={resolvedSong}
            playing={playing && !djSpeaking && !resolving}
            onPlay={handlePlay}
            onPause={() => setPlaying(false)}
            onPrev={handlePrev}
            onNext={handleSongEnded}
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

      <footer className="app-footer">
        <ProgramSchedule program={program} />
      </footer>
    </div>
  )
}
