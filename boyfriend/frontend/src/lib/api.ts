const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface Message {
  role: "user" | "model";
  content: string;
}

export async function sendChatMessage(messages: Message[]): Promise<string> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  return data.text;
}

export async function* streamChat(messages: Message[]): AsyncGenerator<string> {
  const res = await fetch(`${API_BASE}/api/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const reader = res.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = JSON.parse(line.slice(6));
        if (data.done) return;
        if (data.text) yield data.text;
        if (data.error) throw new Error(data.error);
      }
    }
  }
}

export async function uploadVoiceSamples(name: string, audioBlobs: Blob[]): Promise<{ name: string; fileCount: number }> {
  const form = new FormData();
  form.append("name", name);
  audioBlobs.forEach((blob, i) => {
    form.append("audio", blob, `sample-${i}.webm`);
  });

  const res = await fetch(`${API_BASE}/api/voice/upload`, {
    method: "POST",
    body: form,
  });
  return res.json();
}

export async function cloneVoice(name: string, description?: string, audioCount?: number): Promise<{ voiceId: string; name: string }> {
  const res = await fetch(`${API_BASE}/api/voice/clone`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description, audioCount }),
  });
  return res.json();
}

export async function synthesizeSpeech(text: string, voiceId: string): Promise<ArrayBuffer> {
  const res = await fetch(`${API_BASE}/api/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voiceId }),
  });
  return res.arrayBuffer();
}
