import { useState, useEffect } from 'react';
import { getWords, getWordOfTheDay, addWord, updateWordMastery, deleteWord } from './services/api';
import './App.css';

export type Word = {
    id: number;
    word: string;
    definition: string;
    example: string;
    mastered: boolean;
};

function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [wordOfTheDay, setWordOfTheDay] = useState<Word | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newWord, setNewWord] = useState({ word: '', definition: '', example: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const allWords = await getWords();
      setWords(allWords);
      const wotd = await getWordOfTheDay();
      setWordOfTheDay(wotd);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.word || !newWord.definition) return;
    try {
      await addWord(newWord);
      setNewWord({ word: '', definition: '', example: '' });
      fetchData();
    } catch (err) {
      console.error('Failed to add word', err);
    }
  };

  const toggleMastery = async (id: number, mastered: boolean) => {
    try {
      await updateWordMastery(id, !mastered);
      fetchData();
    } catch (err) {
      console.error('Failed to update mastery', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteWord(id);
      fetchData();
    } catch (err) {
      console.error('Failed to delete word', err);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % words.length);
    }, 150);
  };

  const currentWord = words[currentCardIndex];

  return (
    <div className="container">
      <header>
        <h1>English Learning Hub</h1>
        <p>Master new vocabulary every day</p>
      </header>

      {wordOfTheDay && (
        <section className="word-of-the-day">
          <h3>🌟 Word of the Day</h3>
          <h2>{wordOfTheDay.word}</h2>
          <p><strong>Definition:</strong> {wordOfTheDay.definition}</p>
          {wordOfTheDay.example && <p><em>"{wordOfTheDay.example}"</em></p>}
          <button onClick={() => speak(wordOfTheDay.word)}>🔊 Pronounce</button>
        </section>
      )}

      {words.length > 0 && (
        <section className="learning-mode">
          <h3>📚 Flashcards</h3>
          <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
              <div className="flashcard-front">
                <h2>{currentWord.word}</h2>
                <p>(Click to flip)</p>
              </div>
              <div className="flashcard-back">
                <p><strong>Definition:</strong> {currentWord.definition}</p>
                {currentWord.example && <p><em>"{currentWord.example}"</em></p>}
                <button onClick={(e) => { e.stopPropagation(); speak(currentWord.word); }}>🔊 Pronounce</button>
              </div>
            </div>
          </div>
          <div className="controls">
            <button className="secondary" onClick={nextCard}>Next Word</button>
          </div>
        </section>
      )}

      <section className="word-list">
        <h3>📝 Vocabulary List</h3>
        {words.map((w) => (
          <div key={w.id} className={`word-item ${w.mastered ? 'mastered' : ''}`}>
            <div>
              <strong>{w.word}</strong> - {w.definition}
            </div>
            <div className="controls">
              <button onClick={() => toggleMastery(w.id, w.mastered)}>
                {w.mastered ? 'Undo' : 'Mastered'}
              </button>
              <button className="secondary" onClick={() => handleDelete(w.id)}>Delete</button>
            </div>
          </div>
        ))}
      </section>

      <section className="add-word">
        <h3>➕ Add New Word</h3>
        <form onSubmit={handleAddWord}>
          <input
            type="text"
            placeholder="Word"
            value={newWord.word}
            onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
          />
          <textarea
            placeholder="Definition"
            value={newWord.definition}
            onChange={(e) => setNewWord({ ...newWord, definition: e.target.value })}
          />
          <input
            type="text"
            placeholder="Example sentence (optional)"
            value={newWord.example}
            onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
          />
          <button type="submit">Add to List</button>
        </form>
      </section>
    </div>
  );
}

export default App;
