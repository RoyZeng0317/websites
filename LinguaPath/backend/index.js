const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_PATH = path.join(__dirname, 'data', 'words.json');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Helper to read data
const readWords = () => {
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper to write data
const writeWords = (words) => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(words, null, 2), 'utf8');
};

// GET all words
app.get('/api/words', (req, res) => {
    const words = readWords();
    res.json(words);
});

// GET Word of the Day
app.get('/api/word-of-the-day', (req, res) => {
    const words = readWords();
    if (words.length === 0) return res.status(404).json({ message: 'No words found' });
    
    // Simple deterministic word based on current date
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % words.length;
    res.json(words[dayIndex]);
});

// POST a new word
app.post('/api/words', (req, res) => {
    const { word, definition, example } = req.body;
    if (!word || !definition) {
        return res.status(400).json({ message: 'Word and definition are required' });
    }

    const words = readWords();
    const newWord = {
        id: Date.now(),
        word,
        definition,
        example: example || '',
        mastered: false
    };

    words.push(newWord);
    writeWords(words);
    res.status(201).json(newWord);
});

// PATCH a word (toggle mastered status)
app.patch('/api/words/:id', (req, res) => {
    const { id } = req.params;
    const { mastered } = req.body;

    let words = readWords();
    const wordIndex = words.findIndex(w => w.id === parseInt(id));

    if (wordIndex === -1) {
        return res.status(404).json({ message: 'Word not found' });
    }

    words[wordIndex].mastered = mastered;
    writeWords(words);
    res.json(words[wordIndex]);
});

// DELETE a word
app.delete('/api/words/:id', (req, res) => {
    const { id } = req.params;
    let words = readWords();
    const filteredWords = words.filter(w => w.id !== parseInt(id));

    if (words.length === filteredWords.length) {
        return res.status(404).json({ message: 'Word not found' });
    }

    writeWords(filteredWords);
    res.json({ message: 'Word deleted successfully' });
});

// POST speech-to-text via Gemini
app.post('/api/speech-to-text', async (req, res) => {
    try {
        const { audio, mimeType } = req.body;
        if (!audio) return res.status(400).json({ error: 'No audio data provided' });

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'GEMINI_API_KEY not set in .env' });
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const result = await model.generateContent([
            { text: 'Transcribe the speech in this audio. Return only the transcribed text, nothing else.' },
            { inlineData: { mimeType: mimeType || 'audio/ogg', data: audio } }
        ]);

        const transcript = result.response.text().trim();
        if (!transcript) {
            return res.status(500).json({ error: 'Empty transcript from Gemini' });
        }
        res.json({ transcript });
    } catch (err) {
        console.error('Gemini STT error:', err.message, err.status);
        if (err.message && err.message.includes('API_KEY')) {
            return res.status(500).json({ error: 'Invalid Gemini API key' });
        }
        if (err.status === 429) {
            return res.status(429).json({ error: 'Gemini API quota exceeded. Please wait and try again.' });
        }
        res.status(500).json({ error: err.message || 'Speech-to-text failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
