import type { Word } from '../App';

const API_URL = 'http://localhost:5000/api';

export const getWords = async (): Promise<Word[]> => {
    const response = await fetch(`${API_URL}/words`);
    return response.json();
};

export const getWordOfTheDay = async (): Promise<Word> => {
    const response = await fetch(`${API_URL}/word-of-the-day`);
    return response.json();
};

export const addWord = async (word: Partial<Word>): Promise<Word> => {
    const response = await fetch(`${API_URL}/words`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(word),
    });
    return response.json();
};

export const updateWordMastery = async (id: number, mastered: boolean): Promise<Word> => {
    const response = await fetch(`${API_URL}/words/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mastered }),
    });
    return response.json();
};

export const deleteWord = async (id: number): Promise<void> => {
    await fetch(`${API_URL}/words/${id}`, { method: 'DELETE' });
};
