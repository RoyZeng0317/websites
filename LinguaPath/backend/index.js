const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_PATH = path.join(__dirname, 'data', 'words.json');

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
