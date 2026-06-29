"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "@/components/ChatMessage";
import VoiceRecorder from "@/components/VoiceRecorder";
import { Message, streamChat, sendChatMessage, synthesizeSpeech } from "@/lib/api";

const WELCOME_MESSAGE: Message = {
  role: "model",
  content:
    "Hi baby, I'm so happy to see you today! How are you feeling? Tell me everything! 💕",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceId, setVoiceId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioCache = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const saved = localStorage.getItem("voiceId");
    if (saved) setVoiceId(saved);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakResponse = useCallback(
    async (text: string): Promise<string | undefined> => {
      if (!voiceId) return;
      const cached = audioCache.current.get(text);
      if (cached) return cached;

      try {
        const buf = await synthesizeSpeech(text, voiceId);
        const blob = new Blob([buf], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        audioCache.current.set(text, url);
        return url;
      } catch {
        return undefined;
      }
    },
    [voiceId]
  );

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const chatHistory = updatedMessages.map((m) => ({
      role: m.role as "user" | "model",
      content: m.content,
    }));

    const replyMsg: Message = { role: "model", content: "" };
    setMessages((prev) => [...prev, replyMsg]);

    try {
      let full = "";
      for await (const chunk of streamChat(chatHistory)) {
        full += chunk;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], content: full };
          return next;
        });
      }

      const audioUrl = await speakResponse(full);
      if (audioUrl) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], content: full };
          return next;
        });
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "model",
          content: "Sorry baby, I need a moment to collect my thoughts. Can you say that again?",
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = async (blob: Blob) => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("audio", blob, "input.webm");

      const res = await fetch(
        "https://speech.googleapis.com/v1/speech:recognize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "",
          },
          body: JSON.stringify({
            config: {
              encoding: "WEBM_OPUS",
              sampleRateHertz: 48000,
              languageCode: "zh-TW",
              model: "latest_short",
            },
            audio: {
              content: await blobToBase64(blob),
            },
          }),
        }
      );

      const data = await res.json();
      const transcript = data.results?.[0]?.alternatives?.[0]?.transcript;
      if (transcript) {
        await handleSend(transcript);
      }
    } catch (err) {
      console.error("STT error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className="flex flex-col h-dvh bg-neutral-900 max-w-2xl mx-auto">
      <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-lg">
            🐻
          </div>
          <div>
            <h1 className="font-semibold text-sm">My Boyfriend</h1>
            <p className="text-xs text-neutral-400">{loading ? "Typing..." : "Online"}</p>
          </div>
        </div>
        <a
          href="/voice-setup"
          className="text-xs text-neutral-400 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-neutral-800"
        >
          {voiceId ? "Voice Set" : "Setup Voice"}
        </a>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            role={msg.role}
            content={msg.content}
            audioUrl={msg.role === "model" && msg.content ? undefined : undefined}
          />
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="border-t border-neutral-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <VoiceRecorder onRecordingComplete={handleVoiceInput} disabled={loading} />
          <div className="flex-1 flex items-center gap-2 bg-neutral-800 rounded-full px-4 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || loading}
              className="text-rose-400 hover:text-rose-300 disabled:text-neutral-600 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

async function blobToBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
