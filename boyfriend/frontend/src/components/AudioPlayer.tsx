"use client";

import { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  audioUrl: string;
  autoPlay?: boolean;
}

export default function AudioPlayer({ audioUrl, autoPlay }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoPlay && audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play().catch(() => {});
      setPlaying(true);
      audio.onended = () => setPlaying(false);
    }
    return () => {
      audioRef.current?.pause();
    };
  }, [audioUrl, autoPlay]);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
    }
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <button
      type="button"
      onClick={togglePlay}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        {playing ? (
          <>
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </>
        ) : (
          <polygon points="5,3 19,12 5,21" />
        )}
      </svg>
      <span>{playing ? "Playing" : "Play"}</span>
    </button>
  );
}
