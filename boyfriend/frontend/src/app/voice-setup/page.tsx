"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import { uploadVoiceSamples, cloneVoice } from "@/lib/api";

export default function VoiceSetupPage() {
  const [step, setStep] = useState<"record" | "name" | "cloning" | "done">("record");
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [name, setName] = useState("");
  const [result, setResult] = useState<{ voiceId: string; name: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("voiceId");
    if (saved) {
      setResult({ voiceId: saved, name: localStorage.getItem("voiceName") ?? "My Voice" });
      setStep("done");
    }
  }, []);

  const handleRecording = useCallback((blob: Blob) => {
    setRecordings((prev) => [...prev, blob]);
  }, []);

  const handleClone = async () => {
    if (recordings.length < 2) return;
    setStep("cloning");
    try {
      const { name: uploadName } = await uploadVoiceSamples(name || "My Voice", recordings);
      const voice = await cloneVoice(uploadName, "AI Boyfriend voice clone", recordings.length);
      setResult(voice);
      localStorage.setItem("voiceId", voice.voiceId);
      localStorage.setItem("voiceName", voice.name);
      setStep("done");
    } catch (err) {
      console.error("Clone failed:", err);
      alert("Voice cloning failed. Please try again.");
      setStep("record");
    }
  };

  const resetAll = () => {
    setRecordings([]);
    setName("");
    setResult(null);
    setStep("record");
    localStorage.removeItem("voiceId");
    localStorage.removeItem("voiceName");
  };

  const playSample = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play().catch(() => {});
    } else {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play().catch(() => {});
    }
  };

  return (
    <div className="min-h-dvh bg-neutral-900 max-w-2xl mx-auto px-4 py-8">
      <header className="flex items-center gap-3 mb-8">
        <a href="/" className="text-neutral-400 hover:text-white transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m7-7-7 7 7 7" />
          </svg>
        </a>
        <h1 className="text-xl font-bold">Voice Setup</h1>
      </header>

      {step === "record" && (
        <div className="space-y-6">
          <div className="bg-neutral-800 rounded-2xl p-6 text-center space-y-4">
            <p className="text-4xl">🎤</p>
            <h2 className="text-lg font-semibold">Record Your Voice</h2>
            <p className="text-sm text-neutral-400">
              Record 3-5 short clips (5-10 seconds each) reading anything in a natural tone.
              This helps create a clone that sounds like you.
            </p>
          </div>

          <VoiceRecorder onRecordingComplete={handleRecording} maxDuration={15} />

          {recordings.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-neutral-400">
                Recorded {recordings.length} samples
                {recordings.length < 2 ? " (need at least 2)" : ""}
              </p>
              {recordings.map((blob, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-neutral-800 rounded-xl px-4 py-3"
                >
                  <span className="text-sm">Sample {i + 1}</span>
                  <button
                    onClick={() => playSample(blob)}
                    className="text-rose-400 hover:text-rose-300 text-sm"
                  >
                    &#9654; Play
                  </button>
                </div>
              ))}
            </div>
          )}

          {recordings.length >= 2 && (
            <button
              onClick={() => setStep("name")}
              className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-700 font-medium transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      )}

      {step === "name" && (
        <div className="space-y-6">
          <div className="bg-neutral-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Name Your Voice</h2>
            <p className="text-sm text-neutral-400">
              Give this voice a name so you can recognize it.
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Gentle Voice"
              className="w-full bg-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 outline-none"
            />
          </div>

          <button
            onClick={handleClone}
            disabled={!name.trim()}
            className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-700 font-medium transition-colors disabled:opacity-50"
          >
            Start Cloning
          </button>
        </div>
      )}

      {step === "cloning" && (
        <div className="bg-neutral-800 rounded-2xl p-8 text-center space-y-4">
          <div className="text-4xl animate-pulse">🔮</div>
          <h2 className="text-lg font-semibold">Cloning Your Voice...</h2>
          <p className="text-sm text-neutral-400">
            This may take a minute. We&apos;re training an AI model with your samples.
          </p>
          <div className="w-16 h-1 bg-neutral-700 rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-rose-500 rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {step === "done" && result && (
        <div className="space-y-6">
          <div className="bg-neutral-800 rounded-2xl p-8 text-center space-y-4">
            <div className="text-4xl">✨</div>
            <h2 className="text-lg font-semibold">Voice Ready!</h2>
            <p className="text-sm text-neutral-400">
              Your voice clone &quot;{result.name}&quot; is ready to use.
            </p>
            <div className="inline-block px-4 py-2 bg-neutral-700 rounded-xl text-xs font-mono">
              ID: {result.voiceId}
            </div>
          </div>

          <a
            href="/"
            className="block w-full py-3 rounded-full bg-rose-600 hover:bg-rose-700 font-medium text-center transition-colors"
          >
            Start Chatting
          </a>

          <button
            onClick={resetAll}
            className="w-full py-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Re-record Voice
          </button>
        </div>
      )}
    </div>
  );
}
