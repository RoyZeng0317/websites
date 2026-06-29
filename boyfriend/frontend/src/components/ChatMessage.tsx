"use client";

import AudioPlayer from "./AudioPlayer";

interface ChatMessageProps {
  role: "user" | "model";
  content: string;
  audioUrl?: string;
}

export default function ChatMessage({ role, content, audioUrl }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-rose-600 text-white rounded-br-md"
            : "bg-neutral-800 text-neutral-100 rounded-bl-md"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        {!isUser && audioUrl && (
          <div className="mt-2">
            <AudioPlayer audioUrl={audioUrl} autoPlay />
          </div>
        )}
      </div>
    </div>
  );
}
