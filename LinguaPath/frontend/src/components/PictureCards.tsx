import { useEffect, useState } from 'react';
import styles from './PictureCards.module.css';

// Picture decks live in /images/<deck>/manifest.json (built by scripts/build-image-vocab.mjs).
// The parent remounts this component (key) when deck or mode changes, so state starts fresh.

interface PictureEntry {
  word: string;
  image: string;
  zh?: string;
  example?: string;
}

interface Card extends PictureEntry { src: string }

function speak(text: string) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'en-US';
  utt.rate = 0.9;
  window.speechSynthesis.speak(utt);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function useDeck(deck: string) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`images/${deck}/manifest.json?t=${Date.now()}`)
      .then(r => (r.ok ? r.json() : []))
      .then((data: PictureEntry[]) => {
        const list = Array.isArray(data) ? data : [];
        setCards(list.map(e => ({ ...e, src: `images/${deck}/${encodeURIComponent(e.image)}` })));
      })
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, [deck]);
  return { cards, loading };
}

/* ── Picture flip card: picture first, guess the word, flip to check ── */
function PictureFlip({ card }: { card: Card }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`${styles.card} ${flipped ? styles.flipped : ''}`} onClick={() => setFlipped(f => !f)} title="Click to flip">
      <div className={styles.inner}>
        <div className={styles.front}>
          <img className={styles.bigImg} src={card.src} alt="What is this?" />
          <div className={styles.hint}>What is this in English? Tap to check.</div>
        </div>
        <div className={styles.back}>
          <img className={styles.smallImg} src={card.src} alt={card.word} />
          <div className={styles.word}>{card.word}</div>
          {card.zh && <div className={styles.zh}>{card.zh}</div>}
          {card.example && <div className={styles.example}>"{card.example}"</div>}
          <button className={styles.listen} onClick={(e) => { e.stopPropagation(); speak(card.word); }}>🔊 Listen</button>
        </div>
      </div>
    </div>
  );
}

function PictureCardsMode({ cards }: { cards: Card[] }) {
  const [order, setOrder] = useState(cards);
  const [i, setI] = useState(0);
  const total = order.length;
  const prev = () => setI(x => (x > 0 ? x - 1 : total - 1));
  const next = () => setI(x => (x < total - 1 ? x + 1 : 0));

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setI(x => (x > 0 ? x - 1 : total - 1));
      if (e.key === 'ArrowRight') setI(x => (x < total - 1 ? x + 1 : 0));
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [total]);

  const current = order[Math.min(i, total - 1)];
  return (
    <div className={styles.slider}>
      <button className={styles.navBtn} onClick={prev} title="Previous (←)">‹</button>
      <div className={styles.area}>
        <PictureFlip key={current.image} card={current} />
        <div className={styles.page}>
          {i + 1} / {total}
          <button className={styles.linkBtn} onClick={() => { setOrder(shuffle(cards)); setI(0); }}>🔀 Shuffle</button>
        </div>
      </div>
      <button className={styles.navBtn} onClick={next} title="Next (→)">›</button>
    </div>
  );
}

/* ── Matching quiz: picture → word, or word → picture ── */
type Direction = 'pic2word' | 'word2pic';

interface Question { answer: Card; options: Card[] }

function makeQuestion(cards: Card[], prevWord?: string): Question {
  const pool = cards.length > 1 ? cards.filter(c => c.word !== prevWord) : cards;
  const answer = pool[Math.floor(Math.random() * pool.length)];
  const distractors = shuffle(cards.filter(c => c.word !== answer.word)).slice(0, 3);
  return { answer, options: shuffle([answer, ...distractors]) };
}

function MatchMode({ cards }: { cards: Card[] }) {
  const [dir, setDir] = useState<Direction>('pic2word');
  const [q, setQ] = useState<Question>(() => makeQuestion(cards));
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const [missed, setMissed] = useState<Set<string>>(new Set());

  const choose = (opt: Card) => {
    if (picked) return;
    setPicked(opt.word);
    const ok = opt.word === q.answer.word;
    setScore(s => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
    if (!ok) setMissed(m => new Set(m).add(q.answer.word));
    speak(q.answer.word);
  };

  const nextQ = () => { setQ(makeQuestion(cards, q.answer.word)); setPicked(null); };

  const optClass = (opt: Card) => {
    if (!picked) return styles.option;
    if (opt.word === q.answer.word) return `${styles.option} ${styles.correct}`;
    if (opt.word === picked) return `${styles.option} ${styles.wrong}`;
    return `${styles.option} ${styles.dim}`;
  };

  return (
    <div className={styles.quiz}>
      <div className={styles.quizTop}>
        <div className={styles.toggle}>
          <button className={dir === 'pic2word' ? styles.on : ''} onClick={() => { setDir('pic2word'); nextQ(); }}>Picture → Word</button>
          <button className={dir === 'word2pic' ? styles.on : ''} onClick={() => { setDir('word2pic'); nextQ(); }}>Word → Picture</button>
        </div>
        <span className={styles.score}>✓ {score.right} / {score.total}</span>
      </div>

      {dir === 'pic2word' ? (
        <>
          <img className={styles.quizImg} src={q.answer.src} alt="Which word matches this picture?" />
          <div className={styles.prompt}>Which word matches this picture?</div>
          <div className={styles.wordGrid}>
            {q.options.map(o => (
              <button key={o.word} className={optClass(o)} onClick={() => choose(o)}>{o.word}</button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className={styles.quizWord}>
            {q.answer.word}
            <button className={styles.linkBtn} onClick={() => speak(q.answer.word)}>🔊</button>
          </div>
          <div className={styles.prompt}>Which picture is "{q.answer.word}"?</div>
          <div className={styles.picGrid}>
            {q.options.map(o => (
              <button key={o.word} className={optClass(o)} onClick={() => choose(o)}>
                <img src={o.src} alt={picked ? o.word : 'option'} />
                {picked && <span className={styles.caption}>{o.word}</span>}
              </button>
            ))}
          </div>
        </>
      )}

      {picked && (
        <div className={styles.feedback}>
          <span>
            {picked === q.answer.word ? '🎉 Correct!' : `The answer is "${q.answer.word}".`}
            {q.answer.zh ? ` (${q.answer.zh})` : ''}
          </span>
          <button className={styles.nextBtn} onClick={nextQ}>Next →</button>
        </div>
      )}

      {missed.size > 0 && (
        <div className={styles.missed}>Review: {[...missed].join(', ')}</div>
      )}
    </div>
  );
}

export default function PictureCards({ deck, mode }: { deck: string; mode: 'cards' | 'match' }) {
  const { cards, loading } = useDeck(deck);
  if (loading) return <div className={styles.state}><span>⏳</span>Loading pictures…</div>;
  if (cards.length === 0) {
    return (
      <div className={styles.state}>
        <span>🖼️</span>
        No pictures in this deck yet. Add images to <code>images/{deck}/</code> and run
        <code> node scripts/build-image-vocab.mjs {deck}</code>.
      </div>
    );
  }
  if (mode === 'match' && cards.length < 2) {
    return <div className={styles.state}><span>🧩</span>Matching needs at least 2 pictures.</div>;
  }
  return mode === 'cards' ? <PictureCardsMode cards={cards} /> : <MatchMode cards={cards} />;
}
