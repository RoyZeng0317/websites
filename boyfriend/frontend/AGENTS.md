<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Boyfriend - Project Structure

## Frontend (Next.js 16 App Router)
- `src/app/page.tsx` — Main chat interface
- `src/app/voice-setup/page.tsx` — Voice cloning setup
- `src/components/VoiceRecorder.tsx` — MediaRecorder voice input
- `src/components/ChatMessage.tsx` — Chat bubble component
- `src/components/AudioPlayer.tsx` — TTS audio playback
- `src/lib/firebase.ts` — Firebase Auth (Google Sign-In)
- `src/lib/api.ts` — Backend API client (SSE streaming)

## Backend (Genkit + Express)
- `backend/src/index.ts` — Express server with SSE, upload, TTS endpoints
- `backend/src/genkit.ts` — Genkit init with Google AI (Gemini 2.5 Flash)
- `backend/src/flows/chat.ts` — Chat flow (streaming support)
- `backend/src/flows/voice.ts` — Voice clone & TTS flows
- `backend/src/services/elevenlabs.ts` — ElevenLabs API client

## Setup
1. Fill in `.env.local` (frontend) and `.env` (backend)
2. Backend: `cd backend && npm run dev`
3. Frontend: `cd frontend && npm run dev`

## Required API Keys
- `GEMINI_API_KEY` — Google AI Studio
- `ELEVENLABS_API_KEY` — ElevenLabs (voice cloning + TTS)
- Firebase config (optional, for auth)
