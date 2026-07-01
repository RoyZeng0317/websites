import { useState, useEffect, useMemo } from 'react';
import NavBar from './NavBar';
import { useTheme } from '../hooks/useTheme';
import styles from './VocabularyPage.module.css';

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const POS_OPTIONS = ['noun', 'verb', 'adjective', 'adverb', 'phrase', 'other'];

interface VocabEntry {
  id: number;
  word: string;
  part_of_speech: string;
  cefr_level: string;
  category: string;
  example: string;
  image_url: string | null;
  exam_tags?: string;
}

function cefrBadge(lvl: string): string {
  const map: Record<string, string> = {
    A1: styles.cefrA1, A2: styles.cefrA2,
    B1: styles.cefrB1, B2: styles.cefrB2,
    C1: styles.cefrC1, C2: styles.cefrC2,
  };
  return map[lvl] || '';
}

function cefrColor(lvl: string): string {
  const map: Record<string, string> = { A1:'#7ec8a0', A2:'#9ed4b4', B1:'#7eb8e8', B2:'#9ecce8', C1:'#e8c97e', C2:'#e87e7e' };
  return map[lvl] || '#7a7870';
}

function examClass(tag: string): string {
  const map: Record<string, string> = { TOEIC: styles.examTOEIC, TOEFL: styles.examTOEFL, IELTS: styles.examIELTS, GRE: styles.examGRE };
  return map[tag] || '';
}

function FlipCard({ word }: { word: VocabEntry }) {
  const examTags = (word.exam_tags || '').split(',').filter(Boolean);
  const [flipped, setFlipped] = useState(false);
  const [selfCheck, setSelfCheck] = useState<'ok' | 'bad' | null>(null);

  const speak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  };

  return (
    <div
      className={`${styles.flipCard} ${flipped ? styles.flipped : ''} ${word.image_url ? styles.hasImage : ''}`}
      onClick={() => setFlipped(!flipped)}
      title="Click to flip"
    >
      <div className={styles.flipInner}>
        {/* Front */}
        <div className={styles.flipFront}>
          <div className={styles.cardBody}>
            {word.image_url && (
              <img className={styles.cardImg} src={word.image_url} alt={word.word} loading="lazy"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            )}
            <div className={styles.cardWord}>{word.word}</div>
            <div className={styles.cardMeta}>
              <span className={`${styles.tagCefr} ${cefrBadge(word.cefr_level)}`} style={{borderColor: cefrColor(word.cefr_level)}}>
                {word.cefr_level}
              </span>
              <span className={styles.tagPos}>{word.part_of_speech}</span>
              {word.category && <span className={styles.tagCat}>{word.category}</span>}
              {examTags.map(t => (
                <span key={t} className={`${styles.tagExam} ${examClass(t)}`}>{t}</span>
              ))}
            </div>
          </div>
          <div className={styles.cardActions}>
            <button onClick={(e) => speak(word.word, e)} title="Listen">🔊</button>
            <div className={styles.scWrap}>
              <button
                className={`${styles.scBtn} ${selfCheck === 'ok' ? styles.scOk : ''}`}
                onClick={(e) => { e.stopPropagation(); setSelfCheck('ok'); }}
                title="Got it right"
              >✓</button>
              <button
                className={`${styles.scBtn} ${selfCheck === 'bad' ? styles.scBad : ''}`}
                onClick={(e) => { e.stopPropagation(); setSelfCheck('bad'); }}
                title="Need practice"
              >✗</button>
            </div>
          </div>
        </div>
        {/* Back */}
        <div className={styles.flipBack}>
          <div className={styles.cardBody}>
            {word.image_url && (
              <img className={styles.backImg} src={word.image_url} alt="" loading="lazy"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            )}
            <div className={styles.backPos}>{word.part_of_speech} · {word.cefr_level}</div>
            {word.example ? (
              <div className={styles.backExample}>"{word.example}"</div>
            ) : (
              <div className={styles.backNoEx}>No example sentence</div>
            )}
          </div>
          <div className={styles.cardActions}>
            <button onClick={(e) => speak(word.example || word.word, e)} title="Read example">🔊 Read</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VocabularyPage() {
  const { icon, toggle } = useTheme();
  const [words, setWords] = useState<VocabEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cefrFilter, setCefrFilter] = useState('');
  const [posFilter, setPosFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch('vocab.json?t=' + Date.now())
      .then(r => r.json())
      .then((data: VocabEntry[]) => {
        setWords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    return [...new Set(words.map(w => w.category).filter(Boolean))].sort();
  }, [words]);

  const filtered = useMemo(() => {
    return words.filter(w => {
      if (cefrFilter && w.cefr_level !== cefrFilter) return false;
      if (posFilter && w.part_of_speech !== posFilter) return false;
      if (catFilter && w.category !== catFilter) return false;
      if (search && !w.word.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [words, search, cefrFilter, posFilter, catFilter]);

  const total = filtered.length;
  const current = total > 0 ? filtered[Math.min(index, total - 1)] : null;

  const goPrev = () => setIndex(i => (i > 0 ? i - 1 : total - 1));
  const goNext = () => setIndex(i => (i < total - 1 ? i + 1 : 0));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { setIndex(i => i > 0 ? i - 1 : total - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setIndex(i => i < total - 1 ? i + 1 : 0); e.preventDefault(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [total]);

  useEffect(() => { setIndex(0); }, [search, cefrFilter, posFilter, catFilter]);

  return (
    <>
      <NavBar user={null} onSignIn={() => {}} onSignUp={() => {}} onSignOut={() => {}}
        onThemeToggle={toggle} themeIcon={icon} />

      <div className={styles.header}>
        <h1>Vocabulary Cards</h1>
        <p>Click a card to flip and see the example sentence. Use 🔊 to listen.</p>
      </div>

      <div className={styles.filterBar}>
        <input type="text" placeholder="Search words…" value={search}
          onChange={(e) => setSearch(e.target.value)} className={styles.searchInput} />
        <select value={cefrFilter} onChange={(e) => setCefrFilter(e.target.value)} className={styles.select}>
          <option value="">All Levels</option>
          {CEFR_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={posFilter} onChange={(e) => setPosFilter(e.target.value)} className={styles.select}>
          <option value="">All Types</option>
          {POS_OPTIONS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className={styles.select}>
          <option value="">All Topics</option>
          {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <span className={styles.countLabel}>{total} word{total !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className={styles.stateMsg}><span className={styles.icon}>⏳</span>Loading vocabulary…</div>
      ) : total === 0 ? (
        <div className={styles.stateMsg}>
          <span className={styles.icon}>🔍</span>
          {words.length === 0
            ? 'No vocabulary yet. Add words in Admin and click Publish to Site.'
            : 'No words match your filter.'}
        </div>
      ) : (
        <div className={styles.sliderWrap}>
          <button className={styles.sliderBtn} onClick={goPrev} title="Previous (←)">‹</button>
          <div className={styles.sliderCardArea}>
            {current && <FlipCard key={current.id} word={current} />}
            <div className={styles.sliderPage}>{index + 1} / {total}</div>
          </div>
          <button className={styles.sliderBtn} onClick={goNext} title="Next (→)">›</button>
        </div>
      )}
    </>
  );
}
