import { z } from 'genkit';
import { ai } from '../genkit.js';
import { cloneVoice, textToSpeech } from '../services/elevenlabs.js';

export const cloneVoiceFlow = ai.defineFlow({
  name: 'cloneVoiceFlow',
  inputSchema: z.object({
    name: z.string(),
    description: z.string().optional(),
    audioCount: z.number(),
  }),
  outputSchema: z.object({
    voiceId: z.string(),
    name: z.string(),
  }),
}, async (input) => {
  const dir = `${process.env.UPLOAD_DIR ?? '/tmp/voice-samples'}/${input.name}`;
  const fs = await import('fs/promises');
  const files = await fs.readdir(dir);
  const audioBlobs: Blob[] = [];
  for (const file of files.slice(0, input.audioCount)) {
    const buf = await fs.readFile(`${dir}/${file}`);
    audioBlobs.push(new Blob([buf]));
  }
  const result = await cloneVoice(input.name, audioBlobs, input.description);
  await fs.rm(dir, { recursive: true, force: true });
  return { voiceId: result.voice_id, name: result.name };
});

export const ttsFlow = ai.defineFlow({
  name: 'ttsFlow',
  inputSchema: z.object({
    text: z.string(),
    voiceId: z.string(),
  }),
  outputSchema: z.any(),
}, async (input) => {
  const response = await textToSpeech(input.text, input.voiceId);
  const buffer = Buffer.from(await response.arrayBuffer());
  return { audio: buffer.toString('base64'), format: 'mp3' };
});
