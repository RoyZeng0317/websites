const sections = [
  {
    id: 'reading', label: 'Reading', icon: '📖',
    desc: 'Read the passages and answer the questions.',
    questions: [
      { level:'A1', passage:'Tom is a student. He is 10 years old. He likes dogs. He has a brown dog named Max.', q:'What is Max?', options:['A cat','A dog','A bird','A fish'], answer:1 },
      { level:'A2', passage:'Dear Sara,\nThank you for the invitation. I would love to come to your birthday party on Saturday. I will bring cake.\nSee you then!\nEmma', q:'When is the party?', options:['Friday','Sunday','Saturday','Monday'], answer:2 },
      { level:'B1', passage:'Many people enjoy cycling because it is good for their health and the environment. However, cycling in big cities can be dangerous. In recent years, more cities have built special bicycle lanes to make cycling safer. This has encouraged more people to ride bikes instead of driving cars.', q:'Why have cities built bicycle lanes?', options:['To make driving easier','To reduce air pollution','To make cycling safer','To save money'], answer:2 },
      { level:'B2', passage:'The concept of remote work has transformed dramatically over the past decade. Initially viewed as a temporary arrangement, it has evolved into a permanent fixture in many industries. Companies have discovered that productivity often increases when employees have flexibility in their work environment. However, challenges remain, including maintaining team cohesion and ensuring effective communication across digital platforms.', q:'What is the main challenge of remote work mentioned?', options:['Lower productivity','Higher costs','Team cohesion and communication','Lack of technology'], answer:2 },
      { level:'C1', passage:'The phenomenon of linguistic convergence occurs when languages in contact begin to share structural features, often resulting in the emergence of linguistic areas or sprachbunds. This process challenges the traditional view of languages as isolated systems and highlights the dynamic nature of linguistic evolution.', q:'What does "linguistic convergence" refer to?', options:['Languages becoming more different','Languages sharing structural features','Languages disappearing','Languages becoming simpler'], answer:1 },
      { level:'C2', passage:'The epistemological implications of quantum mechanics have precipitated considerable debate among philosophers of science. The Copenhagen interpretation, while pragmatically successful, raises profound questions about the nature of reality and the role of observation.', q:'What is the main topic of the passage?', options:['Quantum physics experiments','Philosophical debates about reality','The Copenhagen interpretation history','Scientific methodology'], answer:1 }
    ]
  },
  {
    id: 'writing', label: 'Writing', icon: '✍️',
    desc: 'Choose the best option for each question.',
    questions: [
      { level:'A1', q:'Choose the correct sentence:', options:['I like apples.','I likes apples.','I liking apples.','I am like apples.'], answer:0 },
      { level:'A2', q:'Which sentence is correct?', options:['Yesterday I go to the park.','Yesterday I went to the park.','Yesterday I going to the park.','Yesterday I goes to the park.'], answer:1 },
      { level:'B1', q:'Choose the best option:\n"If I ___ rich, I would travel the world."', options:['am','was','were','will be'], answer:2 },
      { level:'B2', q:'Which word best completes the sentence?\n"The results were ___; we had never seen such improvement."', options:['unprecedented','ordinary','predictable','minimal'], answer:0 },
      { level:'C1', q:'Choose the most appropriate for a formal email:\n"___ we would like to schedule a meeting to discuss further."', options:['Hey, can we talk?','I wanted to let you know','We are writing to propose','Just saying we should'], answer:2 },
      { level:'C2', q:'Which sentence uses the subjunctive mood correctly?', options:['It is essential that he is present.','I wish I was there.','She demanded that he leave immediately.','If I was you, I would go.'], answer:2 }
    ]
  },
  {
    id: 'listening', label: 'Listening', icon: '🎧',
    desc: 'Read the dialogues and answer the questions.',
    questions: [
      { level:'A1', passage:'A: "Hi! How are you?"\nB: "I am fine, thank you!"', q:'How is B?', options:['Sad','Fine','Tired','Angry'], answer:1 },
      { level:'A2', passage:'A: "Can I help you?"\nB: "Yes, how much is this T-shirt?"\nA: "$15."\nB: "I will take it."', q:'What is B buying?', options:['A book','A T-shirt','A bag','Shoes'], answer:1 },
      { level:'B1', passage:'A: "I think we should take the train."\nB: "Why? It takes longer."\nA: "Yes, but we can work and it is cheaper."\nB: "Good point. Let me check."', q:'Why does A prefer the train?', options:['It is faster','It is more comfortable','They can work and save money','No car'], answer:2 },
      { level:'B2', passage:'Manager: "Revenue is up 15%, but costs rose 20%."\nEmployee: "Should we outsource customer service?"\nManager: "That could reduce costs, but we must maintain quality."', q:'What is the concern about outsourcing?', options:['Too expensive','May affect quality','Job loss','Takes too long'], answer:1 },
      { level:'C1', passage:'Professor: "The correlation between SES and achievement is documented, but we must avoid attributing causation."\nStudent: "Other factors?"\nProfessor: "Exactly. Parental involvement, resources, school quality are interconnected."', q:'What is the professor warning against?', options:['Confusing correlation with causation','Socioeconomic inequality','Poor school quality','Student performance'], answer:0 },
      { level:'C2', passage:'Presenter: "The phenomenological approach prioritizes subjective experience. Critics say it lacks rigor, but proponents argue some aspects of consciousness cannot be quantified."\nAttendee: "What about reproducibility?"\nPresenter: "That assumes reproducibility is the gold standard."', q:'What position does the presenter defend?', options:['Scientific positivism','Empirical objectivity','The value of subjective experience','Quantitative analysis'], answer:2 }
    ]
  },
  {
    id: 'speaking', label: 'Speaking', icon: '🎤',
    desc: 'Choose the most natural response in each situation.',
    questions: [
      { level:'A1', q:'You meet someone for the first time. What do you say?', options:['What do you want?','Nice to meet you!','Go away!','I am busy.'], answer:1 },
      { level:'A2', q:'In a restaurant. How do you order?', options:['Give me food!','I would like the chicken, please.','You need to serve me.','Food, please.'], answer:1 },
      { level:'B1', q:'You disagree with a friend. What do you say?', options:['You are wrong.','I see your point, but I think differently.','That is stupid.','No.'], answer:1 },
      { level:'B2', q:'Starting a presentation. What do you say?', options:['Listen up!','Good morning. Today I will be discussing...','I have to talk about...','Let me begin.'], answer:1 },
      { level:'C1', q:'In a negotiation, the other party rejects your offer. How do you respond?', options:['We are done here.','I understand. Perhaps we could explore alternative terms.','You will regret this.','Make a better offer.'], answer:1 },
      { level:'C2', q:'Handling a challenging Q&A at a conference. How do you respond?', options:['That is an insightful question. Let me address it from three perspectives...','I already covered that.','Next question please.','Read my paper.'], answer:0 }
    ]
  }
];

const levelNames = ['A1','A2','B1','B2','C1','C2'];
const resultData = {
  C2: { label:'Proficient (C2)', desc:'You can understand virtually everything heard or read. You can express yourself spontaneously and precisely.', recommend:'You are ready for academic research, professional writing, or teaching English. Try our advanced writing and debate courses.' },
  C1: { label:'Advanced (C1)', desc:'You can understand complex topics and express ideas fluently. You can use language flexibly for social and professional purposes.', recommend:'Great foundation! Focus on academic writing, idiomatic expressions, and advanced listening.' },
  B2: { label:'Upper Intermediate (B2)', desc:'You can interact with fluency and spontaneity. You can understand the main ideas of complex texts.', recommend:'Strengthen your skills with our B2 courses: debate, essay writing, and news listening.' },
  B1: { label:'Intermediate (B1)', desc:'You can deal with most situations while traveling. You can describe experiences and opinions.', recommend:'Good progress! Our B1 courses build confidence in conversations, reading articles, and writing emails.' },
  A2: { label:'Elementary (A2)', desc:'You can communicate in simple and routine tasks. You can describe your background and needs.', recommend:'Keep going! Our A2 courses focus on daily conversations and real-life vocabulary.' },
  A1: { label:'Beginner (A1)', desc:'You can understand and use basic phrases. You can introduce yourself and ask simple questions.', recommend:'Welcome! Start with our A1 beginner courses: greetings, numbers, and simple sentences.' }
};

let state = {
  step: 0,
  sectionIdx: 0,
  qIdx: 0,
  answers: {},
  totalQuestions: 0
};

sections.forEach(s => state.totalQuestions += s.questions.length);

function getQKey(sectionIdx, qIdx) { return sectionIdx + '-' + qIdx; }

function renderWelcome() {
  const body = document.getElementById('test-body');
  body.innerHTML = `
    <div class="test-welcome">
      <h3>📋 Check Your English Level</h3>
      <p>This test assesses your skills across the four core areas based on the CEFR international standard (A1 → C2).</p>
      <div class="skills-summary">
        ${sections.map(s => `
          <div class="skill-card">
            <div class="icon">${s.icon}</div>
            <div class="name">${s.label}</div>
            <div class="desc">${s.desc}</div>
          </div>
        `).join('')}
      </div>
      <p class="duration">⏱ ${state.totalQuestions} questions · ~10 minutes</p>
      <p>Read each question carefully and choose the best answer.</p>
    </div>`;
  document.getElementById('test-footer').innerHTML = `
    <div></div>
    <button class="test-btn test-btn-next" id="test-start">Start Test →</button>`;
  document.getElementById('test-start').onclick = () => { state.step = 1; renderQuestion(); };
}

function renderProgress() {
  const total = state.totalQuestions;
  const done = Object.keys(state.answers).length;
  const currentSection = state.sectionIdx;
  return `<div class="test-progress">${sections.map((s, i) => {
    let cls = 'test-progress-step';
    if (i < currentSection) cls += ' done';
    else if (i === currentSection) cls += ' current';
    return `<div class="${cls}"></div>`;
  }).join('')}</div>`;
}

function renderQuestion() {
  const section = sections[state.sectionIdx];
  const q = section.questions[state.qIdx];
  const key = getQKey(state.sectionIdx, state.qIdx);
  const selected = state.answers[key];
  const body = document.getElementById('test-body');
  const totalInSection = section.questions.length;
  const globalNum = state.sectionIdx * 6 + state.qIdx + 1;

  body.innerHTML = `
    ${renderProgress()}
    <div class="test-section-label"><span>${section.icon}</span> ${section.label} · ${state.qIdx + 1}/${totalInSection}</div>
    ${q.passage ? `<div class="test-passage">${q.passage}</div>` : ''}
    <div class="test-question">${q.q}</div>
    <div class="test-options">
      ${q.options.map((opt, i) => `
        <button class="test-option${selected === i ? ' selected' : ''}" data-idx="${i}">
          <div class="radio"></div>
          ${opt}
        </button>
      `).join('')}
    </div>`;

  document.querySelectorAll('.test-option').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.test-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.answers[key] = parseInt(btn.dataset.idx);
      updateFooter();
    };
  });

  const footer = document.getElementById('test-footer');
  const isLast = globalNum === state.totalQuestions;
  const isSectionLast = state.qIdx === totalInSection - 1;
  const isFirst = state.sectionIdx === 0 && state.qIdx === 0;

  footer.innerHTML = `
    <div class="test-counter">${globalNum} / ${state.totalQuestions}</div>
    <div style="display:flex;gap:8px">
      ${!isFirst ? '<button class="test-btn test-btn-prev" id="test-prev">← Back</button>' : ''}
      ${isLast
        ? '<button class="test-btn test-btn-submit" id="test-submit" disabled>Submit</button>'
        : `<button class="test-btn test-btn-next" id="test-next" disabled>${isSectionLast ? 'Next Section →' : 'Next →'}</button>`
      }
    </div>`;

  if (document.getElementById('test-prev')) {
    document.getElementById('test-prev').onclick = prevQuestion;
  }
  if (document.getElementById('test-next')) {
    document.getElementById('test-next').onclick = nextQuestion;
  }
  if (document.getElementById('test-submit')) {
    document.getElementById('test-submit').onclick = showResults;
  }
  updateFooter();
}

function updateFooter() {
  const key = getQKey(state.sectionIdx, state.qIdx);
  const hasAnswer = state.answers[key] !== undefined;
  const nextBtn = document.getElementById('test-next');
  const submitBtn = document.getElementById('test-submit');
  if (nextBtn) nextBtn.disabled = !hasAnswer;
  if (submitBtn) submitBtn.disabled = !hasAnswer;
}

function nextQuestion() {
  const section = sections[state.sectionIdx];
  if (state.qIdx < section.questions.length - 1) {
    state.qIdx++;
  } else if (state.sectionIdx < sections.length - 1) {
    state.sectionIdx++;
    state.qIdx = 0;
  } else {
    showResults();
    return;
  }
  renderQuestion();
}

function prevQuestion() {
  if (state.qIdx > 0) {
    state.qIdx--;
  } else if (state.sectionIdx > 0) {
    state.sectionIdx--;
    state.qIdx = sections[state.sectionIdx].questions.length - 1;
  }
  renderQuestion();
}

function calcLevel(scores) {
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  return { levels: scores.map(s => levelNames[s]), total: levelNames[avg], avg };
}

function showResults() {
  const scores = sections.map(section => {
    let correct = 0;
    section.questions.forEach((q, qi) => {
      const key = getQKey(sections.indexOf(section), qi);
      if (state.answers[key] === q.answer) correct++;
    });
    return Math.min(correct, levelNames.length - 1);
  });

  const result = calcLevel(scores);
  const data = resultData[result.total];
  const body = document.getElementById('test-body');
  const footer = document.getElementById('test-footer');

  body.innerHTML = `
    <div class="test-results">
      <div style="font-size:1.1rem;margin-bottom:4px">Your CEFR Level</div>
      <div class="big-level">${result.total}</div>
      <div class="level-label">${data.label}</div>
      <div class="level-desc">${data.desc}</div>
      <div class="skill-breakdown">
        ${sections.map((s, i) => `
          <div class="skill-item">
            <span class="skill-name">${s.icon} ${s.label}</span>
            <span class="skill-level">${levelNames[scores[i]]}</span>
          </div>
        `).join('')}
      </div>
      <div class="recommend-box">
        <h4>💡 Recommendation</h4>
        <p>${data.recommend}</p>
      </div>
      <button class="test-btn-start" id="go-path">Start Learning Now</button>
    </div>`;

  footer.innerHTML = `<div></div>
    <button class="test-btn test-btn-prev" id="test-retake">Retake Test</button>`;

  document.getElementById('test-retake').onclick = resetTest;
  document.getElementById('go-path').onclick = () => {
    document.getElementById('test-overlay').classList.remove('open');
    window.location.href = 'path.html';
  };
}

function resetTest() {
  state = { step: 0, sectionIdx: 0, qIdx: 0, answers: {}, totalQuestions: state.totalQuestions };
  renderWelcome();
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('check-btn');
  const overlay = document.getElementById('test-overlay');
  const closeBtn = document.getElementById('test-close');

  if (!btn || !overlay) return;

  btn.onclick = () => {
    overlay.classList.add('open');
    resetTest();
  };

  closeBtn.onclick = () => overlay.classList.remove('open');
  overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove('open'); };
});
