import { useState, useEffect, useRef, useCallback } from 'react';

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
type CefrLevel = typeof CEFR_LEVELS[number];

const CEFR_ORDER: Record<CefrLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };

interface VocabWord {
  id: number;
  word: string;
  part_of_speech: string;
  cefr_level: string;
  category: string;
  example: string;
  image_url: string | null;
}

interface Token {
  text: string;
  isWord: boolean;
  vocab?: VocabWord;
  unknown: boolean;
}

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  difficulty: CefrLevel;
  source: string;
  summary: string;
}

const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: "A Nice Day at the Park",
    content: "Today is a sunny day. A boy and his dog go to the park. The boy plays with a red ball. The dog runs fast. They are very happy. The boy sits on a green bench. He drinks water. The dog sleeps next to him. It is a quiet afternoon. The birds sing in the trees.",
    difficulty: 'A1',
    source: "LinguaPath News",
    summary: "Simple story about a boy and his dog at the park."
  },
  {
    id: 2,
    title: "My Morning Routine",
    content: "Every morning I wake up at six thirty. First I brush my teeth and wash my face. Then I eat breakfast. I usually have bread and eggs. I drink a glass of milk. After breakfast I put on my clothes. I take my bag and go to school. The school is near my house. I walk there with my friend. We talk about our homework on the way.",
    difficulty: 'A1',
    source: "LinguaPath News",
    summary: "Daily routine description with basic vocabulary."
  },
  {
    id: 3,
    title: "A Shopping Trip",
    content: "Last Saturday I went to the supermarket with my mother. We needed to buy food for the week. We bought some apples, bananas, bread, and milk. My mother also bought chicken and fish. I wanted to buy chocolate but my mother said no. The supermarket was very busy. Many people were shopping. We waited for ten minutes to pay. Then we took our bags and went home.",
    difficulty: 'A2',
    source: "LinguaPath News",
    summary: "A shopping trip story using everyday vocabulary."
  },
  {
    id: 4,
    title: "Learning a New Language",
    content: "Learning a new language can be difficult but also very fun. I started learning English two years ago. At first I could only say simple words like hello and goodbye. Now I can have short conversations. I practice every day. I read English books and watch movies with subtitles. My favorite way to learn is by talking to friends online. Sometimes I make mistakes but that is okay. Mistakes help me improve.",
    difficulty: 'A2',
    source: "LinguaPath News",
    summary: "A personal story about language learning experience."
  },
  {
    id: 5,
    title: "The Benefits of Regular Exercise",
    content: "Regular exercise is essential for maintaining good health. Experts recommend at least thirty minutes of physical activity every day. Exercise strengthens your heart, improves your mood, and helps you sleep better. There are many types of exercise to choose from. You can run, swim, cycle, or practice yoga. The key is to find an activity that you enjoy. When you enjoy something, you are more likely to do it consistently. Even a brisk walk in the park can make a significant difference to your wellbeing.",
    difficulty: 'B1',
    source: "Health & Wellness Weekly",
    summary: "An article discussing the importance of regular exercise."
  },
  {
    id: 6,
    title: "Technology in Modern Education",
    content: "Technology has transformed the way students learn in the modern classroom. Interactive whiteboards, tablets, and educational software have replaced traditional chalkboards and textbooks. Teachers can now create engaging multimedia lessons that cater to different learning styles. Online platforms allow students to access educational resources from anywhere in the world. However, some experts argue that excessive screen time may have negative effects on children's concentration. Finding a balance between digital and traditional learning methods remains an important challenge for educators.",
    difficulty: 'B1',
    source: "Education Today",
    summary: "How technology is changing education and its pros and cons."
  },
  {
    id: 7,
    title: "Climate Change and Its Global Impact",
    content: "Climate change continues to pose significant challenges to ecosystems worldwide. Rising global temperatures have led to melting polar ice caps and rising sea levels. Extreme weather events, such as hurricanes, droughts, and wildfires, have become more frequent and severe. Scientists warn that immediate action is necessary to prevent irreversible damage. Governments around the world are implementing policies to reduce carbon emissions and promote sustainable energy sources. Individuals can also contribute by reducing waste, conserving energy, and supporting environmentally friendly initiatives. The future of our planet depends on the choices we make today.",
    difficulty: 'B2',
    source: "Global Environmental Report",
    summary: "An overview of climate change challenges and solutions."
  },
  {
    id: 8,
    title: "The Rise of Remote Work Culture",
    content: "The pandemic fundamentally altered the landscape of professional employment, accelerating the shift toward remote work. Companies that were previously hesitant to embrace telecommuting were compelled to adapt almost overnight. Many organizations discovered that productivity actually increased when employees worked from home. However, remote work also presents unique challenges. Employees often struggle to maintain boundaries between their professional and personal lives. The lack of face-to-face interaction can lead to feelings of isolation and hinder spontaneous collaboration. Despite these drawbacks, flexible working arrangements have become a permanent feature of the modern workplace. Forward-thinking companies are now investing in digital infrastructure to support hybrid models that combine the best of both worlds.",
    difficulty: 'B2',
    source: "Business Insider",
    summary: "Analysis of the remote work revolution and its lasting effects."
  },
  {
    id: 9,
    title: "The Evolution of Artificial Intelligence",
    content: "Artificial intelligence has undergone a remarkable transformation over the past decade. What once seemed like science fiction is now an integral part of our daily lives. Machine learning algorithms power everything from search engines to recommendation systems. Recent breakthroughs in natural language processing have enabled AI to generate human-like text, translate languages with unprecedented accuracy, and even assist in medical diagnosis. Despite these impressive achievements, significant ethical concerns remain. Issues surrounding data privacy, algorithmic bias, and the potential displacement of jobs require careful consideration. Researchers emphasize the importance of developing AI systems that are transparent, accountable, and aligned with human values.",
    difficulty: 'C1',
    source: "Technology Review",
    summary: "A comprehensive look at AI's progress and ethical implications."
  },
  {
    id: 10,
    title: "The Renaissance of Urban Architecture",
    content: "Contemporary urban architecture is witnessing a paradigm shift toward sustainability and human-centric design. Architects and urban planners are increasingly prioritizing green spaces, pedestrian-friendly infrastructure, and energy-efficient buildings. The concept of biophilic design, which seeks to connect occupants more closely with nature, has gained considerable traction. Cities like Singapore and Copenhagen have emerged as exemplars of this movement, integrating vertical gardens, renewable energy systems, and innovative waste management solutions into their urban fabric. However, the challenge of retrofitting existing cities with sustainable infrastructure remains formidable. Policymakers must navigate complex economic, social, and political landscapes to implement meaningful change. The cities of tomorrow will be defined by our ability to harmonize technological innovation with environmental stewardship.",
    difficulty: 'C1',
    source: "Architecture Digest",
    summary: "How modern architecture is embracing sustainability and human-centric design."
  },
  {
    id: 11,
    title: "Quantum Computing: The Next Frontier",
    content: "Quantum computing represents a fundamental departure from classical computational paradigms, leveraging the principles of superposition and entanglement to perform calculations that would be infeasible for conventional computers. Unlike classical bits, which exist in a state of either zero or one, quantum bits or qubits can exist in multiple states simultaneously, enabling exponential computational parallelism. While practical quantum computers remain in their infancy, recent breakthroughs in error correction and qubit coherence have accelerated progress toward quantum supremacy. The implications span numerous fields, from cryptography and drug discovery to climate modeling and financial optimization. Nevertheless, substantial technical hurdles persist, including maintaining qubit stability at scale and developing quantum algorithms that outperform classical alternatives. The coming decade will be pivotal in determining whether quantum computing fulfills its transformative potential.",
    difficulty: 'C2',
    source: "Scientific Frontiers",
    summary: "An in-depth exploration of quantum computing's principles and potential."
  },
  {
    id: 12,
    title: "Epigenetics: Beyond the Genome",
    content: "The field of epigenetics has revolutionized our understanding of heredity and gene expression, revealing that our DNA sequence is not destiny. Epigenetic modifications, including DNA methylation and histone acetylation, regulate gene activity without altering the underlying genetic code. These modifications can be influenced by environmental factors such as diet, stress, and exposure to toxins. Intriguingly, some epigenetic changes may even be inherited across generations, challenging long-held assumptions about Lamarckian inheritance. Research has implicated epigenetic dysregulation in numerous pathologies, including cancer, neurodegenerative disorders, and metabolic diseases. The therapeutic potential of epigenetic drugs, which can reverse aberrant modifications, represents a promising avenue for precision medicine. However, the complexity of the epigenome demands sophisticated analytical approaches and raises profound questions about the interplay between nature and nurture.",
    difficulty: 'C2',
    source: "Nature Genetics Review",
    summary: "How epigenetics is reshaping our understanding of gene expression and disease."
  },
  {
    id: 13,
    title: "Jensen Huang Visits COMPUTEX 2026",
    content: "Jensen Huang, the CEO of NVIDIA, visited COMPUTEX 2026 in Taipei City. The exhibition was held from June 2 to June 5. COMPUTEX is one of the largest computer and technology exhibitions in the world, and many visitors come to Taiwan every year to attend this important event.Many famous computer brands and technology companies took part in the exhibition. Companies such as ASUS, Acer, Gigabyte, MSI, and many others displayed their latest products and technologies. Visitors had the chance to see new graphics cards, AI devices, gaming laptops, and other advanced computer products. Many people were excited about the future development of artificial intelligence and computer technology.One of the biggest highlights of COMPUTEX was the appearance of Jensen Huang. Because he is very popular among technology fans, many people gathered to see him in person. Some fans brought NVIDIA graphics cards, books, and other items for him to sign. Jensen Huang was very friendly and patiently signed autographs for many fans. He also answered questions and talked with people during the event.In addition, some fans even bought new graphics cards and souvenirs just to get his signature. Jensen Huang kindly accepted their requests and spent a lot of time interacting with everyone. His warm attitude made many people feel happy and excited.Overall, COMPUTEX 2026 was a huge success. It not only showed the latest trends in computer technology but also gave fans a chance to meet famous people in the industry. For many visitors, meeting Jensen Huang was one of the most unforgettable experiences of the exhibition.",
    difficulty: 'B1',
    source: "",
    summary: ""
  },
];

const ARTICLE_DETAILS: Record<number, string> = {
  1: "After a short rest, the boy opens his small bag. He has a sandwich, an apple, and a blue cup. He gives the dog some water in a bowl. A girl comes to the bench and smiles. She asks if she can throw the ball too. The boy says yes, and they play together. Soon the dog runs between them with the ball in its mouth. The children laugh because the dog does not want to stop. When the sun goes down, the boy puts the ball back in his bag. He waves goodbye to the girl and walks home slowly. The dog is tired, but it looks happy.",
  2: "When I arrive at school, I put my books on my desk. My first class is English, so I take out my notebook and pencil. The teacher writes new words on the board. We listen, repeat, and make short sentences. At break time, I eat a banana and talk with my classmates. We talk about games, family, and our plans after school. In the afternoon, I go home and do my homework before dinner. I check my school bag at night because I do not want to forget anything. This routine is simple, but it helps me feel ready every day.",
  3: "At the supermarket, we looked carefully at the prices on the shelves. My mother compared two kinds of rice because one bag was cheaper but smaller. I helped her read the shopping list and put the items into the cart. In the vegetable area, we chose tomatoes, carrots, and a large cabbage. Near the checkout counter, I saw a magazine about cooking and asked if we could try a new recipe. My mother said we could make soup on Sunday. After we paid, the bags were heavy, so we carried them together. At home, we put cold food in the refrigerator and dry food in the cupboard.",
  4: "One thing that helped me was keeping a small notebook. Every time I learned a useful word, I wrote it down with one example sentence. I also tried to use new words when I spoke, even if my sentences were not perfect. My teacher told me that language learning is like exercise: a little practice every day is better than studying for many hours only once a month. Now I can understand simple videos without reading every subtitle. I still feel nervous when I speak to native speakers, but I know that confidence grows slowly. My next goal is to read one short English article every week.",
  5: "For people who are just beginning, exercise does not need to be difficult or expensive. Taking the stairs, stretching after work, or walking to a nearby store can all count as movement. Doctors often remind patients that the most effective plan is the one they can repeat. A person who walks for twenty minutes five times a week may gain more benefits than someone who joins a gym but stops after a few days. Communities can also make healthy habits easier by building safe sidewalks, public parks, and bike lanes. When exercise becomes part of daily life, it feels less like a task and more like a normal routine.",
  6: "Many schools now use digital tools to give students faster feedback. For example, a learning app can show which questions students missed and suggest extra practice immediately. This helps teachers see patterns that may be hard to notice during a busy lesson. Still, technology works best when it supports good teaching instead of replacing it. Students also need quiet time to think, write by hand, discuss ideas, and solve problems without screens. Some schools have started creating clear rules for device use, such as screen-free reading periods or group projects that require face-to-face conversation. The goal is not to reject technology, but to use it with purpose.",
  7: "The effects of climate change are not experienced equally. Coastal communities may face flooding, while farming regions may struggle with heat, water shortages, and unpredictable harvests. In some countries, families are already moving because their homes or jobs are no longer secure. This is why climate policy is also a social and economic issue. Clean energy projects can create jobs, but workers in older industries need training and support during the transition. Cities can prepare by improving drainage systems, planting more trees, and designing buildings that stay cooler in extreme heat. Long-term progress will require cooperation among governments, businesses, scientists, and local communities.",
  8: "The next stage of remote work is likely to be more intentional than the emergency shift that happened during the pandemic. Some companies now ask employees to come to the office on specific days for meetings, mentoring, and team planning. Other days are reserved for focused work at home. This hybrid model can reduce commuting time while preserving some of the social benefits of an office. Managers also need new skills. They must judge performance by results rather than by how long someone sits at a desk. Clear communication, written documentation, and fair access to promotion opportunities are becoming essential parts of remote work culture.",
  9: "One important debate concerns how AI systems are trained. Large models often learn from enormous collections of text, images, and other data, and not all of that material is easy to trace. Artists, writers, and publishers have raised questions about consent, ownership, and compensation. At the same time, doctors, teachers, engineers, and small businesses are finding practical ways to use AI as an assistant. The challenge for society is to encourage useful innovation while setting limits that protect people from harm. This may include stronger privacy rules, clearer labeling of AI-generated content, and regular testing for bias. AI will not affect every job in the same way, but most workers will need to understand how to use it responsibly.",
  10: "Sustainable architecture also depends on the small decisions that shape daily comfort. A building can reduce energy use by placing windows carefully, improving natural ventilation, and choosing materials that last longer. Public spaces matter as much as private buildings. Shaded streets, benches, public transit access, and safe crossings can make a neighborhood more livable for older adults, children, and people with disabilities. In many cities, the biggest challenge is not designing impressive new towers, but improving older districts without forcing residents to leave. Successful urban renewal requires listening to local communities before construction begins. Architecture is therefore both a technical field and a civic responsibility.",
  11: "Researchers are also exploring how quantum computers might work together with classical computers rather than replace them completely. In many future systems, a classical machine could manage ordinary tasks while a quantum processor handles a narrow but difficult calculation. This approach may be especially useful in chemistry, where simulating molecules requires tracking complex interactions among particles. However, the field still needs better hardware, more reliable error correction, and a larger workforce trained in quantum information science. Governments and private companies are investing heavily because the strategic value could be enormous. Even so, experts caution that useful breakthroughs may arrive gradually, not as a single dramatic moment.",
  12: "Epigenetic research is also changing how scientists think about prevention. If environmental conditions can influence gene activity, then public health decisions may have biological effects that last for years. Nutrition, pollution exposure, chronic stress, and access to medical care can all shape patterns of risk in a population. This does not mean individuals are fully responsible for every health outcome. Instead, it shows that biology and society are deeply connected. Scientists are now developing tools to measure epigenetic age, track disease risk, and evaluate whether treatments can restore healthier gene regulation. The promise is significant, but researchers must be careful not to overstate early findings before they are validated in large studies."
};

function getTokens(text: string, vocabMap: Map<string, VocabWord>, userLevel: CefrLevel): Token[] {
  const words = text.split(/(\s+|(?=[.,!?;:'"()])|(?<=[.,!?;:'"()]))/).filter(Boolean);
  const tokens: Token[] = [];
  let i = 0;

  while (i < words.length) {
    const word = words[i];
    const trimmed = word.replace(/^[.,!?;:'"()]+|[.,!?;:'"()]+$/g, '');
    const isPunct = /^[.,!?;:'"()\s]+$/.test(word);

    if (isPunct || !trimmed) {
      tokens.push({ text: word, isWord: false, unknown: false });
      i++;
      continue;
    }

    const lower = trimmed.toLowerCase();
    let matched: { phrase: string; vocab: VocabWord } | null = null;

    for (let j = 4; j >= 2; j--) {
      if (i + j <= words.length) {
        const phraseWords = words.slice(i, i + j)
          .map(w => w.replace(/^[.,!?;:'"()]+|[.,!?;:'"()]+$/g, '').toLowerCase())
          .filter(w => w.length > 0);
        const phrase = phraseWords.join(' ');
        if (phrase.length > 0 && vocabMap.has(phrase)) {
          matched = { phrase, vocab: vocabMap.get(phrase)! };
          break;
        }
      }
    }

    if (!matched && vocabMap.has(lower)) {
      matched = { phrase: lower, vocab: vocabMap.get(lower)! };
    }

    if (matched) {
      const userOrder = CEFR_ORDER[userLevel];
      const wordOrder = CEFR_ORDER[matched.vocab.cefr_level as CefrLevel] || 99;
      const unknown = wordOrder > userOrder;

      if (matched.phrase.includes(' ')) {
        const phraseParts = matched.phrase.split(' ');
        const phraseText = words.slice(i, i + phraseParts.length).join('');
        tokens.push({ text: phraseText, isWord: true, vocab: matched.vocab, unknown });
        i += phraseParts.length;
      } else {
        const origWord = words[i];
        tokens.push({ text: origWord, isWord: true, vocab: matched.vocab, unknown });
        i++;
      }
    } else {
      tokens.push({ text: words[i], isWord: true, vocab: undefined, unknown: false });
      i++;
    }
  }

  return tokens;
}

function Tooltip({ vocab, x, y }: { vocab: VocabWord; x: number; y: number }) {
  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y + 12,
        backgroundColor: '#1e1e2e',
        color: '#cdd6f4',
        border: '1px solid #45475a',
        borderRadius: 10,
        padding: '12px 16px',
        zIndex: 9999,
        maxWidth: 320,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.85rem',
        lineHeight: 1.5,
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#89b4fa', marginBottom: 4 }}>
        {vocab.word}
        <span style={{ fontWeight: 400, fontSize: '0.75rem', color: '#a6adc8', marginLeft: 8 }}>
          {vocab.part_of_speech}
        </span>
        <span style={{
          display: 'inline-block',
          marginLeft: 8,
          padding: '1px 6px',
          borderRadius: 4,
          fontSize: '0.7rem',
          fontWeight: 600,
          backgroundColor: '#45475a',
          color: vocab.cefr_level === 'C1' || vocab.cefr_level === 'C2' ? '#f9e2af' :
                   vocab.cefr_level === 'B1' || vocab.cefr_level === 'B2' ? '#a6e3a1' : '#89dceb',
        }}>
          {vocab.cefr_level}
        </span>
      </div>
      {vocab.category && (
        <div style={{ color: '#a6adc8', fontSize: '0.75rem', marginBottom: 4 }}>
          {vocab.category}
        </div>
      )}
      {vocab.example && (
        <div style={{ color: '#bac2de', fontStyle: 'italic', fontSize: '0.8rem', borderTop: '1px solid #313244', marginTop: 6, paddingTop: 6 }}>
          "{vocab.example}"
        </div>
      )}
    </div>
  );
}

function getLevelColor(level: CefrLevel): string {
  const colors: Record<CefrLevel, string> = {
    A1: '#89dceb', A2: '#89dceb',
    B1: '#a6e3a1', B2: '#a6e3a1',
    C1: '#f9e2af', C2: '#f9e2af',
  };
  return colors[level];
}

export default function News() {
  const [vocabMap, setVocabMap] = useState<Map<string, VocabWord>>(new Map());
  const [userLevel, setUserLevel] = useState<CefrLevel>('A1');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tooltip, setTooltip] = useState<{ vocab: VocabWord; x: number; y: number } | null>(null);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/vocab.json?t=' + Date.now())
      .then(r => r.json())
      .then((data: VocabWord[]) => {
        const map = new Map<string, VocabWord>();
        for (const entry of data) {
          const key = entry.word.toLowerCase().trim();
          if (!map.has(key)) map.set(key, entry);
        }
        setVocabMap(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const base = NEWS_ARTICLES.map(a => ({
      ...a,
      content: `${a.content} ${ARTICLE_DETAILS[a.id] ?? ''}`.trim(),
    }));
    fetch('/news.json?t=' + Date.now())
      .then(r => r.ok ? r.json() : Promise.reject(new Error('not ok')))
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length > 0) {
          const daily = (data as Record<string, unknown>[]).map(a => ({
            id:         Number(a.id),
            title:      String(a.title   ?? ''),
            content:    String(a.content ?? ''),
            difficulty: (a.difficulty as CefrLevel) ?? 'B1',
            source:     String(a.source  ?? ''),
            summary:    String(a.summary ?? ''),
          }));
          setArticles([...base, ...daily]);
        } else {
          setArticles(base);
        }
      })
      .catch(() => setArticles(base));
  }, []);

  const filteredArticles = articles.filter(a => a.difficulty === userLevel);

  useEffect(() => {
    if (filteredArticles.length > 0) {
      const article = selectedArticle
        ? filteredArticles.find(a => a.id === selectedArticle.id) ?? filteredArticles[0]
        : filteredArticles[0];
      setSelectedArticle(article);
    } else {
      setSelectedArticle(null);
    }
  }, [userLevel, articles]);

  useEffect(() => {
    if (selectedArticle && vocabMap.size > 0) {
      setTokens(getTokens(selectedArticle.content, vocabMap, userLevel));
    }
  }, [selectedArticle, vocabMap, userLevel]);

  const handleWordHover = useCallback((e: React.MouseEvent, vocab: VocabWord) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({ vocab, x: rect.left, y: rect.bottom });
  }, []);

  const handleWordLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const knownWordsCount = tokens.filter(t => t.isWord && t.vocab && !t.unknown).length;
  const unknownWordsCount = tokens.filter(t => t.isWord && t.unknown).length;

  return (
    <div style={{
      maxWidth: 900,
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'DM Sans', sans-serif",
      color: '#cdd6f4',
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#89b4fa', marginBottom: 4 }}>
          News Reader
        </h1>
        <p style={{ color: '#a6adc8', fontSize: '0.9rem' }}>
          Read articles matched to your English level — hover unknown words to see annotations
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
      }}>
        <label style={{ color: '#cdd6f4', fontWeight: 500, fontSize: '0.9rem' }}>
          Your CEFR Level:
        </label>
        <div style={{ display: 'flex', gap: 4 }}>
          {CEFR_LEVELS.map(level => (
            <button
              key={level}
              onClick={() => {
                setUserLevel(level);
                setTooltip(null);
              }}
              style={{
                padding: '6px 16px',
                border: `2px solid ${userLevel === level ? getLevelColor(level) : '#45475a'}`,
                borderRadius: 8,
                backgroundColor: userLevel === level ? '#313244' : 'transparent',
                color: userLevel === level ? getLevelColor(level) : '#a6adc8',
                fontWeight: userLevel === level ? 700 : 400,
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.15s',
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {filteredArticles.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}>
          {filteredArticles.map(article => (
            <button
              key={article.id}
              onClick={() => {
                setSelectedArticle(article);
                setTooltip(null);
              }}
              style={{
                padding: '8px 14px',
                border: `1px solid ${selectedArticle?.id === article.id ? '#89b4fa' : 'transparent'}`,
                borderRadius: 8,
                backgroundColor: selectedArticle?.id === article.id ? '#313244' : '#1e1e2e',
                color: selectedArticle?.id === article.id ? '#89b4fa' : '#a6adc8',
                cursor: 'pointer',
                fontSize: '0.8rem',
                textAlign: 'left',
                maxWidth: 200,
              }}
              title={article.summary}
            >
              <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{article.title}</div>
              <div style={{ fontSize: '0.7rem', color: getLevelColor(article.difficulty), marginTop: 2 }}>
                {article.difficulty}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedArticle && (
        <div style={{
          backgroundColor: '#1e1e2e',
          borderRadius: 16,
          padding: '2rem',
          border: '1px solid #313244',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#cdd6f4', margin: 0 }}>
                {selectedArticle.title}
              </h2>
              <span style={{
                fontSize: '0.75rem',
                color: getLevelColor(selectedArticle.difficulty),
                backgroundColor: '#313244',
                padding: '2px 8px',
                borderRadius: 4,
                marginTop: 6,
                display: 'inline-block',
              }}>
                {selectedArticle.difficulty} · {selectedArticle.source}
              </span>
            </div>
            <div style={{
              display: 'flex',
              gap: '1rem',
              fontSize: '0.8rem',
              color: '#a6adc8',
            }}>
              <span>Known: <span style={{ color: '#a6e3a1', fontWeight: 600 }}>{knownWordsCount}</span></span>
              <span>New: <span style={{ color: '#f38ba8', fontWeight: 600 }}>{unknownWordsCount}</span></span>
            </div>
          </div>

          <div
            ref={articleRef}
            style={{
              lineHeight: 2,
              fontSize: '1.05rem',
              color: '#cdd6f4',
              position: 'relative',
            }}
          >
            {tokens.map((token, idx) => {
              if (!token.isWord) {
                return <span key={idx}>{token.text}</span>;
              }
              if (token.vocab && token.unknown) {
                return (
                  <span
                    key={idx}
                    onMouseEnter={(e) => handleWordHover(e, token.vocab!)}
                    onMouseLeave={handleWordLeave}
                    style={{
                      borderBottom: '2px dotted #f38ba8',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(243, 139, 168, 0.08)',
                      padding: '0 2px',
                      borderRadius: 3,
                      transition: 'background-color 0.15s',
                    }}
                  >
                    {token.text}
                  </span>
                );
              }
              if (token.vocab && !token.unknown) {
                return (
                  <span
                    key={idx}
                    onMouseEnter={(e) => handleWordHover(e, token.vocab!)}
                    onMouseLeave={handleWordLeave}
                    style={{
                      borderBottom: '1px dashed #585b70',
                      cursor: 'pointer',
                    }}
                  >
                    {token.text}
                  </span>
                );
              }
              return <span key={idx}>{token.text}</span>;
            })}
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#181825',
            borderRadius: 10,
            fontSize: '0.8rem',
            color: '#a6adc8',
          }}>
            <strong style={{ color: '#89b4fa' }}>Legend:</strong>{' '}
            <span style={{ borderBottom: '2px dotted #f38ba8', color: '#f38ba8' }}>Red dotted</span> = word above your level ·{' '}
            <span style={{ borderBottom: '1px dashed #585b70' }}>Grey dashed</span> = word in your vocabulary ·{' '}
            <span>Plain text</span> = word not in vocabulary
          </div>
        </div>
      )}

      {!selectedArticle && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: '#a6adc8',
          backgroundColor: '#1e1e2e',
          borderRadius: 16,
          border: '1px solid #313244',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📰</div>
          <p style={{ fontSize: '1.1rem' }}>No articles available for your current level.</p>
          <p style={{ fontSize: '0.9rem' }}>Try selecting a different CEFR level above.</p>
        </div>
      )}

      {tooltip && (
        <Tooltip vocab={tooltip.vocab} x={tooltip.x} y={tooltip.y} />
      )}
    </div>
  );
}
