import { useState } from 'react';
import NavBar from './NavBar';
import { useTheme } from '../hooks/useTheme';
import styles from './PathPage.module.css';

const SKILLS: Record<string, { color: string; levels: { title: string; subtitle: string; topics: string[] }[] }> = {
  listening: {
    color: '#a78bfa',
    levels: [
      { title: 'Beginner', subtitle: 'Sound Foundations', topics: ['Recognize all English phonemes and minimal pairs (ship/sheep, light/right)', 'Understand basic vocabulary: numbers 1–100, colors, days, family, animals', 'Identify common classroom objects and everyday items by sound', 'Follow simple one-step instructions ("Stand up", "Open your book")', 'Recognize basic question words (what, where, who, when, why, how)'] },
      { title: 'Elementary', subtitle: 'Simple Contexts', topics: ['Understand slow, clearly-spoken phrases about daily routines', 'Follow short audio descriptions of people, places, and activities', 'Identify the main topic in a 30-second simple conversation', 'Understand prices, times, dates, and weather descriptions', 'Catch key details from short announcements (airport, store, school)'] },
      { title: 'Intermediate', subtitle: 'Everyday Fluency', topics: ['Follow conversations on familiar topics (work, travel, hobbies, food)', 'Understand clear phone calls and voicemail messages', 'Extract main ideas and key details from short news clips', 'Follow multi-step directions and instructions', 'Understand different regional accents at moderate speed'] },
      { title: 'Upper-Intermediate', subtitle: 'Complex Content', topics: ['Follow TV shows and movies with minimal subtitle support', 'Understand interviews, debates, and group discussions', 'Comprehend academic lectures on introductory topics', 'Identify tone, attitude, and implied meaning in conversations', 'Follow fast-paced conversations between native speakers'] },
      { title: 'Advanced', subtitle: 'Native-Level', topics: ['Understand rapid native speech across all major accents (US, UK, AU, IN)', 'Comprehend academic lectures and conference presentations', 'Grasp subtle humor, sarcasm, irony, and cultural references', 'Follow specialized discussions in professional and academic fields', 'Understand implicit meaning and inference in complex audio'] },
    ],
  },
  speaking: {
    color: '#f59e0b',
    levels: [
      { title: 'Beginner', subtitle: 'First Words', topics: ['Produce all English phonemes correctly (focus on problem sounds for your language)', 'Use basic greetings and introductions ("Hello, my name is...")', 'Count from 1 to 100 and say basic personal information (age, phone number)', 'Name common objects, colors, and animals', 'Form simple affirmative and negative statements with "to be"'] },
      { title: 'Elementary', subtitle: 'Daily Life', topics: ['Describe daily routines and habits using present simple', 'Ask and answer simple questions about familiar topics', 'Order food and drinks, shop for items, ask for prices', 'Express likes, dislikes, preferences, and opinions simply', 'Make polite requests and ask for help or directions'] },
      { title: 'Intermediate', subtitle: 'Confident Conversation', topics: ['Give opinions and make suggestions with reasons', 'Describe past experiences and future plans using appropriate tenses', 'Make and receive phone calls with confidence', 'Engage in small talk about travel, work, hobbies, and current events', 'Handle common situations (restaurant complaints, doctor visits, hotel bookings)'] },
      { title: 'Upper-Intermediate', subtitle: 'Nuanced Expression', topics: ['Participate in debates and group discussions on abstract topics', 'Give structured presentations with clear introduction, body, and conclusion', 'Discuss hypothetical situations using conditionals', 'Use idiomatic expressions and phrasal verbs naturally', 'Express agreement, disagreement, and compromise diplomatically'] },
      { title: 'Advanced', subtitle: 'Mastery', topics: ['Speak fluently and spontaneously on any topic without visible effort', 'Persuade, negotiate, and advocate positions effectively', 'Deliver speeches and presentations to large audiences', 'Use professional and academic register appropriately', 'Adapt speaking style for different contexts (formal, casual, humorous)'] },
    ],
  },
  reading: {
    color: '#34d399',
    levels: [
      { title: 'Beginner', subtitle: 'Letters & Sounds', topics: ['Recognize all 26 letters in uppercase and lowercase', 'Learn letter-sound correspondence (phonics) for consonants and short vowels', 'Read CVC words (cat, dog, sit, run, map) and common sight words', 'Understand simple signs, labels, and environmental print', 'Read very short sentences with familiar vocabulary'] },
      { title: 'Elementary', subtitle: 'Building Blocks', topics: ['Read simple sentences and short paragraphs with basic vocabulary', 'Understand simple children\'s stories and graded readers', 'Find specific information in menus, schedules, ads, and forms', 'Follow simple written instructions and recipes', 'Recognize common prefixes and suffixes to guess word meanings'] },
      { title: 'Intermediate', subtitle: 'Independent Reading', topics: ['Read news headlines and short articles on familiar topics', 'Understand narrative stories with clear plot and characters', 'Follow multi-step written instructions and user manuals', 'Identify main ideas and supporting details in paragraphs', 'Use context clues to understand unfamiliar vocabulary'] },
      { title: 'Upper-Intermediate', subtitle: 'Critical Reading', topics: ['Read longer magazine and news articles with complex sentence structures', 'Analyze opinion pieces and recognize the author\'s perspective', 'Read short stories and simplified literary works', 'Understand academic paragraphs with topic sentences and evidence', 'Infer meaning from context and predict outcomes'] },
      { title: 'Advanced', subtitle: 'Academic & Literary', topics: ['Read academic papers, research articles, and technical documents', 'Comprehend literary texts (novels, poems, plays) with stylistic awareness', 'Analyze complex arguments and evaluate evidence critically', 'Read rapidly with high comprehension across all genres', 'Understand nuanced vocabulary, idioms, and cultural references'] },
    ],
  },
  writing: {
    color: '#f472b6',
    levels: [
      { title: 'Beginner', subtitle: 'First Marks', topics: ['Form all 26 letters in uppercase and lowercase (printing)', 'Copy simple words and phrases with correct spacing', 'Spell basic CVC words and common sight words correctly', 'Write personal information: name, address, age, nationality', 'Punctuate simple sentences with capital letters and periods'] },
      { title: 'Elementary', subtitle: 'Sentences', topics: ['Write simple affirmative, negative, and interrogative sentences', 'Fill out forms with personal details (name, email, phone)', 'Write short notes, messages, and invitations', 'Describe daily routines, family, and hobbies in simple sentences', 'Use basic punctuation (period, comma, question mark, exclamation)'] },
      { title: 'Intermediate', subtitle: 'Paragraphs', topics: ['Write well-structured paragraphs with topic sentences and supporting details', 'Compose personal emails and friendly letters', 'Write short opinion essays with clear reasons and examples', 'Describe events and experiences using past tenses coherently', 'Use linking words (first, then, however, because, therefore)'] },
      { title: 'Upper-Intermediate', subtitle: 'Essays & Reports', topics: ['Write structured essays with introduction, body paragraphs, and conclusion', 'Compose formal letters and professional emails', 'Write compare-contrast and cause-effect essays', 'Produce short reports with data and analysis', 'Use a variety of sentence structures and transitional phrases'] },
      { title: 'Advanced', subtitle: 'Professional Writing', topics: ['Write academic essays and research papers with citations', 'Produce creative writing (short stories, descriptive pieces)', 'Compose professional correspondence and business documents', 'Write persuasive arguments with evidence and rhetorical devices', 'Adapt tone, style, and register for different audiences and purposes'] },
    ],
  },
};

const SKILL_ICONS: Record<string, string> = { listening: 'L', speaking: 'S', reading: 'R', writing: 'W' };

const COURSE_MAP: Record<string, string> = { listening: 'skill-listening', speaking: 'skill-speaking', reading: 'skill-reading', writing: 'skill-writing' };

export default function PathPage() {
  const { icon, toggle } = useTheme();
  const [activeSkill, setActiveSkill] = useState('listening');
  const skill = SKILLS[activeSkill];

  return (
    <>
      <NavBar user={null} onSignIn={() => {}} onSignUp={() => {}} onSignOut={() => {}} onThemeToggle={toggle} themeIcon={icon} />
      <section className={styles.hero}>
        <div className={styles.heroTag}>Structured Learning</div>
        <h1>Your <em>Four-Skill</em> Journey</h1>
        <p>Master English through Listening, Speaking, Reading, and Writing — progressing from absolute beginner to advanced fluency.</p>
      </section>
      <div className={styles.container}>
        <div className={styles.tabs}>
          {Object.keys(SKILLS).map((key) => (
            <button
              key={key}
              className={`${styles.tab} ${activeSkill === key ? styles.tabActive : ''}`}
              onClick={() => setActiveSkill(key)}
            >
              <span className={styles.tabIcon} style={{ color: SKILLS[key].color }}>{SKILL_ICONS[key]}</span>
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
            </button>
          ))}
        </div>
        <div className={styles.levels}>
          {skill.levels.map((level, i) => (
            <div key={i} className={styles.card} style={{ borderLeftColor: skill.color }}>
              <div className={styles.badge} style={{ background: skill.color }}>L{i + 1}</div>
              <div className={styles.content}>
                <div className={styles.header}>
                  <div className={styles.title}>{level.title}</div>
                  <div className={styles.subtitle}>{level.subtitle}</div>
                </div>
                <ul className={styles.topics}>
                  {level.topics.map((t, j) => <li key={j}>{t}</li>)}
                </ul>
                <a href={`lesson.html?course=${COURSE_MAP[activeSkill]}&lesson=${i}`} className={styles.startLink} style={{ color: skill.color }}>Start Lesson →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footer}>Each level builds on the previous. Progress at your own pace — mastery comes with practice.</div>
      <footer style={{ padding: '1rem 2.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem', borderTop: '1px solid var(--border)' }}>
        Copyright &copy; 2026 Roy Zeng. All Rights Reserved.
      </footer>
    </>
  );
}
