"use client";

import { useState, useRef, useCallback } from "react";

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  maxDuration?: number;
  disabled?: boolean;
}

export default function VoiceRecorder({ onRecordingComplete, maxDuration = 30, disabled }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const stream = useRef<MediaStream | null>(null);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
    stream.current?.getTracks().forEach((t) => t.stop());
    clearInterval(timer.current);
    setRecording(false);
    setDuration(0);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];
      setDuration(0);

      mediaRecorder.current = new MediaRecorder(stream.current, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        onRecordingComplete(blob);
      };

      mediaRecorder.current.start(100);
      setRecording(true);

      timer.current = setInterval(() => {
        setDuration((d) => {
          if (d >= maxDuration - 1) {
            stopRecording();
            return 0;
          }
          return d + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  }, [maxDuration, onRecordingComplete, stopRecording]);

  return (
    <button
      type="button"
      onClick={recording ? stopRecording : startRecording}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
        recording
          ? "bg-red-500 hover:bg-red-600 animate-pulse"
          : "bg-rose-600 hover:bg-rose-700"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={recording ? `Stop recording (${duration}s)` : "Start voice recording"}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {recording ? (
          <rect x="6" y="6" width="12" height="12" rx="2" />
        ) : (
          <>
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
          </>
        )}
      </svg>
      <span className="text-sm font-medium">
        {recording ? `${duration}s` : "Voice"}
      </span>
    </button>
  );
}
