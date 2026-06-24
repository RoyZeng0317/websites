export interface Lesson {
  title: string;
  duration: string;
  videoId?: string | null;
  body: string;
}

export interface Course {
  title: string;
  level: string;
  lessons: Lesson[];
}

export const COURSES: Record<string, Course> = {
  "beginner-foundations": {
    title: "Foundations of English", level: "Beginner",
    lessons: [
      { title: "The English Alphabet", duration: "6 min", videoId: "36IBDpTRVNE", body: `<h3>Introduction</h3><p>The English alphabet consists of 26 letters: 5 vowels (A, E, I, O, U) and 21 consonants. Understanding each letter's sound is the foundation of reading and speaking English.</p><h3>Vowels vs Consonants</h3><p>Vowels are the sounds produced with an open vocal tract. Every English syllable contains at least one vowel sound.</p><div class="example-box"><strong>Vowels:</strong> A, E, I, O, U<br><strong>Consonants:</strong> B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z</div><h3>Practice</h3><ul><li>Say each letter out loud slowly</li><li>Practice writing uppercase and lowercase forms</li><li>Identify vowels in common words like "apple", "engine", "island"</li></ul>` },
      { title: "Basic Greetings", duration: "5 min", videoId: null, body: `<h3>Saying Hello</h3><p>Greetings are the first words you'll use in any English conversation.</p><div class="example-box"><strong>Formal:</strong> "Good morning", "Good afternoon", "How do you do?"<br><strong>Informal:</strong> "Hi", "Hey", "What's up?"</div><h3>Common Responses</h3><ul><li>"I'm doing well, thank you." — polite response</li><li>"Not bad!" — casual, positive</li><li>"Fine, thanks. And you?" — standard reply</li></ul>` },
      { title: "Numbers 1-100", duration: "8 min", videoId: null, body: `<h3>Counting in English</h3><p>Numbers are essential for shopping, telling time, and everyday life.</p><div class="example-box">One, Two, Three … Ten<br>Eleven … Twenty<br>Thirty, Forty … One Hundred</div>` },
      { title: "Colors & Shapes", duration: "7 min", videoId: null, body: `<h3>Basic Colors</h3><div class="example-box"><strong>Primary:</strong> Red, Blue, Yellow<br><strong>Secondary:</strong> Green, Orange, Purple<br><strong>Neutral:</strong> Black, White, Gray</div>` },
      { title: "Days & Months", duration: "6 min", videoId: null, body: `<h3>Days of the Week</h3><div class="example-box">Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday</div><h3>Months of the Year</h3><div class="example-box">January … December</div>` },
      { title: "Common Nouns", duration: "9 min", videoId: null, body: `<h3>What is a Noun?</h3><p>A noun names a person, place, thing, or idea.</p><div class="example-box"><strong>People:</strong> teacher, doctor<br><strong>Places:</strong> school, park<br><strong>Things:</strong> book, phone</div>` },
      { title: "Simple Sentences", duration: "10 min", videoId: null, body: `<h3>Subject → Verb → Object</h3><div class="example-box">"She eats an apple."<br>"The dog chases the ball."</div>` },
      { title: "Asking for Help", duration: "7 min", videoId: null, body: `<h3>Polite Requests</h3><div class="example-box">"Can you help me?" — casual<br>"Could you help me, please?" — polite<br>"Would you mind helping me?" — very polite</div>` },
    ],
  },
  "everyday-conversations": {
    title: "Everyday Conversations", level: "Elementary",
    lessons: [
      { title: "Introducing Yourself", duration: "7 min", videoId: null, body: `<h3>First Impressions</h3><div class="example-box">"Hi, my name is Sarah."<br>"I'm from Taiwan."<br>"Nice to meet you!"</div>` },
      { title: "At a Restaurant", duration: "8 min", videoId: null, body: `<h3>Ordering Food</h3><div class="example-box">"I'd like to order the grilled salmon, please."<br>"What do you recommend?"<br>"Can we get the bill, please?"</div>` },
      { title: "Shopping", duration: "6 min", videoId: null, body: `<h3>In a Store</h3><div class="example-box">"How much does this cost?"<br>"Is this on sale?"<br>"Can I try this on?"</div>` },
      { title: "Asking for Directions", duration: "9 min", videoId: null, body: `<h3>Getting Around</h3><div class="example-box">"Turn left at the traffic lights."<br>"Go straight ahead for two blocks."</div>` },
      { title: "Talking About Weather", duration: "5 min", videoId: null, body: `<h3>Weather Vocabulary</h3><div class="example-box">"It's a beautiful day today!"<br>"The weather is terrible this week."</div>` },
      { title: "Making Plans", duration: "8 min", videoId: null, body: `<h3>Scheduling & Inviting</h3><div class="example-box">"Would you like to go to the movies on Friday?"<br>"Let's meet at 7pm."</div>` },
      { title: "Talking on the Phone", duration: "7 min", videoId: null, body: `<h3>Phone Etiquette</h3><div class="example-box">"Hello, this is David speaking."<br>"May I speak with Mr. Chen?"</div>` },
    ],
  },
  "grammar-essentials": {
    title: "Grammar Essentials", level: "Intermediate",
    lessons: [
      { title: "Nouns & Pronouns", duration: "10 min", videoId: null, body: `<h3>What is a Noun?</h3><p>A noun names a person, place, thing, or idea.</p><div class="example-box"><strong>Subject pronouns:</strong> I, you, he, she, it, we, they<br><strong>Object pronouns:</strong> me, you, him, her, it, us, them</div>` },
      { title: "Verbs — Action & State", duration: "10 min", videoId: null, body: `<h3>What is a Verb?</h3><p>A verb describes an action, event, or state of being.</p><div class="example-box"><strong>Action:</strong> run, eat, write<br><strong>State:</strong> be, have, know, like</div>` },
      { title: "Subject-Verb Agreement", duration: "10 min", videoId: null, body: `<h3>The Golden Rule</h3><p>Singular subjects take singular verbs; plural subjects take plural verbs.</p><div class="example-box">"The dog barks." vs "The dogs bark."</div>` },
      { title: "Sentence Structure (SVO)", duration: "10 min", videoId: null, body: `<h3>Subject → Verb → Object</h3><div class="example-box">"She reads books."<br>"They bought a new car."</div>` },
      { title: "Adjectives & Adverbs", duration: "10 min", videoId: null, body: `<h3>Adjectives describe nouns; adverbs describe verbs.</h3><div class="example-box">"a beautiful day" (adj)<br>"She sings beautifully." (adv)</div>` },
      { title: "Tenses — Present, Past, Future", duration: "12 min", videoId: null, body: `<h3>Key Tenses</h3><div class="example-box"><strong>Present:</strong> "I work every day."<br><strong>Past:</strong> "She went to school."<br><strong>Future:</strong> "We will visit Japan."</div>` },
      { title: "Articles — A, An, The", duration: "8 min", videoId: null, body: `<h3>Articles</h3><div class="example-box"><strong>A</strong> — consonant sound: "a cat"<br><strong>An</strong> — vowel sound: "an apple"<br><strong>The</strong> — specific: "the door"</div>` },
      { title: "Prepositions — Place & Time", duration: "10 min", videoId: null, body: `<h3>Prepositions of Place</h3><div class="example-box">in, on, at, under, next to, between</div><h3>Prepositions of Time</h3><div class="example-box">at (times), on (days), in (months/years)</div>` },
      { title: "Conjunctions — Connecting Ideas", duration: "8 min", videoId: null, body: `<h3>Coordinating (FANBOYS)</h3><div class="example-box">For, And, Nor, But, Or, Yet, So</div>` },
      { title: "Review & Practice", duration: "12 min", videoId: null, body: `<h3>Lesson Summary</h3><p>Review all grammar essentials covered in this course.</p>` },
      { title: "Five Sentence Patterns", duration: "15 min", videoId: null, body: `<h3>Five Sentence Patterns</h3><div class="example-box"><strong>S+V</strong> — I run.<br><strong>S+V+O</strong> — I play badminton.<br><strong>S+V+C</strong> — I am tired.<br><strong>S+V+O+O</strong> — My parents give me money.<br><strong>S+V+O+C</strong> — He made me angry.</div>` },
    ],
  },
  "advanced-fluency": {
    title: "Advanced Fluency", level: "Advanced",
    lessons: Array.from({ length: 8 }, (_, i) => ({
      title: `Advanced Lesson ${i + 1}`,
      duration: "12 min",
      videoId: null,
      body: `<h3>Coming Soon</h3><p>This lesson is being prepared. Check back soon!</p>`,
    })),
  },
  "skill-listening": {
    title: "Listening", level: "All Levels",
    lessons: [
      { title: "Sound Foundations", duration: "12 min", videoId: null, body: `<h3>English Phonemes</h3><p>English has 44 distinct sounds: 24 consonant and 20 vowel sounds.</p>` },
      { title: "Listening for Key Information", duration: "10 min", videoId: null, body: `<h3>Numbers, Names & Instructions</h3><p>Learn to catch key information in spoken English.</p>` },
      { title: "Following Conversations", duration: "14 min", videoId: null, body: `<h3>Everyday Dialogues</h3><p>Practice following conversations with fillers and interruptions.</p>` },
      { title: "Interpreting Nuance", duration: "14 min", videoId: null, body: `<h3>Tone & Regional Accents</h3><p>Understand how tone and accent affect meaning.</p>` },
      { title: "Native-Level Comprehension", duration: "16 min", videoId: null, body: `<h3>Rapid Speech</h3><p>Understand connected speech patterns used by native speakers.</p>` },
    ],
  },
  "skill-speaking": {
    title: "Speaking", level: "All Levels",
    lessons: [
      { title: "Pronunciation & First Words", duration: "14 min", videoId: null, body: `<h3>Building Blocks of Speech</h3><p>Focus on key consonant pairs and self-introduction.</p>` },
      { title: "Everyday Interactions", duration: "14 min", videoId: null, body: `<h3>Ordering, Shopping, Asking Questions</h3><p>Practice common daily interactions in English.</p>` },
      { title: "Conversation Skills", duration: "16 min", videoId: null, body: `<h3>Giving Opinions & Small Talk</h3><p>Express opinions naturally and maintain conversations.</p>` },
      { title: "Advanced Expression", duration: "16 min", videoId: null, body: `<h3>Debates, Conditionals & Idioms</h3><p>Use structured arguments and idiomatic expressions.</p>` },
      { title: "Fluent Communication", duration: "18 min", videoId: null, body: `<h3>Persuasion & Public Speaking</h3><p>Speak with confidence in formal and informal settings.</p>` },
    ],
  },
  "skill-reading": {
    title: "Reading", level: "All Levels",
    lessons: [
      { title: "Phonics & Word Recognition", duration: "11 min", videoId: null, body: `<h3>Letter Sounds & Sight Words</h3><p>Build the foundation of English reading.</p>` },
      { title: "Reading Sentences & Signs", duration: "12 min", videoId: null, body: `<h3>Simple Texts</h3><p>Read short sentences, menus, schedules, and instructions.</p>` },
      { title: "Articles & Narratives", duration: "14 min", videoId: null, body: `<h3>News & Stories</h3><p>Understand news articles and narrative structure.</p>` },
      { title: "Analytical Reading", duration: "14 min", videoId: null, body: `<h3>Opinion & Inference</h3><p>Analyze perspective, implied meaning, and literary devices.</p>` },
      { title: "Academic & Literary Reading", duration: "16 min", videoId: null, body: `<h3>Complex Texts</h3><p>Navigate academic papers and literary works.</p>` },
    ],
  },
  "skill-writing": {
    title: "Writing", level: "All Levels",
    lessons: [
      { title: "Letters, Spelling & Punctuation", duration: "10 min", videoId: null, body: `<h3>Foundations of Written English</h3><p>Master spelling rules and basic punctuation.</p>` },
      { title: "Writing Sentences", duration: "12 min", videoId: null, body: `<h3>Simple & Compound Sentences</h3><p>Write clear, grammatically correct sentences.</p>` },
      { title: "Paragraph Structure", duration: "14 min", videoId: null, body: `<h3>Topic, Support & Conclusion</h3><p>Write well-organized paragraphs and emails.</p>` },
      { title: "Essays & Formal Writing", duration: "15 min", videoId: null, body: `<h3>Essay Structure & Formal Letters</h3><p>Write structured essays and professional correspondence.</p>` },
      { title: "Professional & Creative Writing", duration: "16 min", videoId: null, body: `<h3>Academic, Business & Creative</h3><p>Master different writing styles and audiences.</p>` },
      { title: "Essay", duration: "5 min", videoId: null, body: `<h3>Essay Practice</h3>` },
    ],
  },
};
