import './genkit.js';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { chatFlow, streamChat } from './flows/chat.js';
import { cloneVoiceFlow, ttsFlow } from './flows/voice.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000' }));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const result = await chatFlow({ messages });
    res.json({ text: result });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat failed' });
  }
});

app.post('/api/chat/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const { messages } = req.body;
    const { stream, response } = await streamChat(messages);

    for await (const chunk of stream) {
      const text = chunk.text ?? '';
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    const finalResponse = await response;
    res.write(`data: ${JSON.stringify({ text: '', done: true, full: finalResponse.text })}\n\n`);
    res.end();
  } catch (err) {
    console.error('Chat stream error:', err);
    res.write(`data: ${JSON.stringify({ error: 'Chat failed' })}\n\n`);
    res.end();
  }
});

app.post('/api/voice/upload', upload.array('audio', 10), async (req, res) => {
  try {
    const name = req.body.name ?? `voice-${randomUUID()}`;
    const sessionDir = join(process.env.UPLOAD_DIR ?? '/tmp/voice-samples', name);
    await mkdir(sessionDir, { recursive: true });

    const files = req.files as Express.Multer.File[];
    for (const file of files) {
      await writeFile(join(sessionDir, file.originalname), file.buffer);
    }

    res.json({ name, fileCount: files.length });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.post('/api/voice/clone', async (req, res) => {
  try {
    const { name, description, audioCount } = req.body;
    const result = await cloneVoiceFlow({ name, description, audioCount });
    res.json(result);
  } catch (err) {
    console.error('Clone error:', err);
    res.status(500).json({ error: 'Voice clone failed' });
  }
});

app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceId } = req.body;
    const result = await ttsFlow({ text, voiceId });
    const audio = Buffer.from(result.audio, 'base64');
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audio);
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ error: 'TTS failed' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
