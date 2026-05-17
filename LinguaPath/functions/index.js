const functions = require('firebase-functions');
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.speechToText = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { audio, mimeType } = req.body;
    if (!audio) {
      res.status(400).json({ error: 'No audio data provided' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY || functions.config().gemini?.api_key;
    if (!apiKey) {
      res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent([
      { text: 'Transcribe the speech in this audio. Return only the transcribed text, nothing else.' },
      { inlineData: { mimeType: mimeType || 'audio/ogg', data: audio } }
    ]);

    const transcript = result.response.text().trim();
    if (!transcript) {
      res.status(500).json({ error: 'Empty transcript from Gemini' });
      return;
    }

    res.json({ transcript });
  } catch (err) {
    console.error('Gemini STT error:', err.message, err.status);
    if (err.message && err.message.includes('API_KEY')) {
      res.status(500).json({ error: 'Invalid Gemini API key' });
      return;
    }
    if (err.status === 429) {
      res.status(429).json({ error: 'Gemini API quota exceeded. Please wait and try again.' });
      return;
    }
    res.status(500).json({ error: err.message || 'Speech-to-text failed' });
  }
});
