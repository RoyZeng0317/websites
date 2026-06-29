const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1';

function getApiKey(): string {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('ELEVENLABS_API_KEY environment variable is required');
  return key;
}

export async function getVoices() {
  const res = await fetch(`${ELEVENLABS_BASE}/voices`, {
    headers: { 'xi-api-key': getApiKey() },
  });
  return res.json();
}

export async function cloneVoice(name: string, audioBlobs: Blob[], description?: string) {
  const form = new FormData();
  form.append('name', name);
  if (description) form.append('description', description);
  audioBlobs.forEach((blob, i) => {
    form.append('files', blob, `sample-${i}.webm`);
  });

  const res = await fetch(`${ELEVENLABS_BASE}/voices/add`, {
    method: 'POST',
    headers: { 'xi-api-key': getApiKey() },
    body: form,
  });
  if (!res.ok) throw new Error(`Voice clone failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function textToSpeech(text: string, voiceId: string) {
  const res = await fetch(`${ELEVENLABS_BASE}/text-to-speech/${voiceId}/stream`, {
    method: 'POST',
    headers: {
      'xi-api-key': getApiKey(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });
  if (!res.ok) throw new Error(`TTS failed: ${res.status} ${await res.text()}`);
  return res;
}
