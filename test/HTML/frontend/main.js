let allQuestions = [];
let filteredQuestions = [];
let currentIndex = 0;
let examMode = false;
let examQuestions = [];
let examSubmitted = false;
let examOverviewVisible = false;
let answeredMap = {};
let submittedMap = {};
let currentSubject = '11700';
let currentUser = null;
let db = null;
if (typeof _fbReady !== 'undefined' && _fbReady) {
    try { db = firebase.firestore(); } catch(e) { console.warn('Firestore init failed', e.message); }
}
try {
    firebase.auth().onAuthStateChanged(user => {
        currentUser = user;
        const el = document.getElementById('top-user');
        const btn = document.getElementById('top-login-btn');
        if (user && el && btn) {
            el.style.display = 'inline';
            el.textContent = user.displayName || user.email;
            btn.textContent = '登出';
            btn.onclick = () => firebase.auth().signOut();
        } else if (el && btn) {
            el.style.display = 'none';
            btn.textContent = '登入';
            btn.onclick = topLogin;
        }
    });
} catch(e) {}
function topLogin() {
    if (!firebase.apps.length) return;
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(() => {});
}

const subjectConfig = {
    '11700': {
        name: '11700 數位電子乙級',
        files: ['../../backend/data/11700_Single.sql', '../../backend/data/11700_Mutpile.sql'],
        wiNames: {1:'工作項目01：電機電子識圖',2:'工作項目02：零組件',3:'工作項目03：儀表與檢修測試',4:'工作項目04：電子工作法',5:'工作項目05：電子學與電子電路',6:'工作項目06：數位系統設計',7:'工作項目07：電腦與周邊設備',8:'工作項目08：程式語言',9:'工作項目09：網路技術與應用',10:'工作項目10：嵌入式系統'},
        wiRanges: [{s:1,e:28},{s:29,e:61},{s:62,e:131},{s:132,e:189},{s:190,e:311},{s:312,e:451},{s:452,e:580},{s:581,e:661},{s:662,e:703},{s:704,e:743}],
        wiCount: 10
    },
    '11800': {
        name: '11800 電腦軟體應用乙級',
        files: ['../../backend/data/11800_Single.sql'],
        wiNames: {1:'工作項目01：電腦概論',2:'工作項目02：應用軟體使用',3:'工作項目03：系統軟體使用',4:'工作項目04：資訊安全'},
        wiRanges: [{s:1,e:334},{s:335,e:388},{s:389,e:631},{s:632,e:748}],
        wiCount: 4
    },
    'common': {
        name: '共同科目',
        files: ['../../backend/data/90006_Common.sql','../../backend/data/90007_Common.sql','../../backend/data/90008_Common.sql','../../backend/data/90009_Common.sql'],
        wiNames: {1:'90006 職業安全衛生',2:'90007 工作倫理與職業道德',3:'90008 環境保護',4:'90009 節能減碳'},
        wiRanges: [{s:9000601,e:90006100},{s:9000701,e:90007100},{s:9000801,e:90008100},{s:9000901,e:90009100}],
        wiCount: 4
    }
};

async function loadQuestions(path) {
    const r = await fetch(path);
    return parseSQL(await r.text());
}

function splitOptions(str) {
    const result = [];
    let depth = 0, cur = '';
    for (const ch of str) {
        if (ch === '(' || ch === '（') depth++;
        else if (ch === ')' || ch === '）') depth--;
        if (ch === ',' && depth === 0) { result.push(cur.trim()); cur = ''; }
        else cur += ch;
    }
    if (cur) result.push(cur.trim());
    return result;
}

function parseSQL(t) {
    const r7 = /VALUES\s*\(\s*(\d+)\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']*)'\s*\)/;
    const r6 = /VALUES\s*\(\s*(\d+)\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']*)'\s*\)/;
    const r5 = /VALUES\s*\(\s*(\d+)\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/;
    return t.split('\n').reduce((acc, line) => {
        let m = line.match(r7), c=7, img = false;
        if (!m) { m = line.match(r6); c=6; }
        if (!m) { m = line.match(r5); c=5; }
        if (m) {
            const id = +m[1], type = m[2];
            let off = c === 7 ? 1 : 0; // skip subject column for 7-column format
            const question = m[3+off];
            const options = splitOptions(m[4+off]);
            const answer = m[5+off].split(',').map(x=>+x.trim());
            const image = (c >= 6 && m[6+off]) ? '../../' + m[6+off] : null;
            acc.push({ id, type, question, options, answer, image });
        }
        return acc;
    }, []);
}

function renderQuestionText(q) {
    const wi = getWI(q.id);
    const baseDir = `../../backend/data/img/${currentSubject}_img`;
    return q.question.replace(/([a-zA-Z])\s*圖/g, (m, letter) => {
        const n = letter.toLowerCase().charCodeAt(0) - 96;
        return `${letter}圖<img src="${baseDir}/${wi}-${q.id}-${n}.jpg" style="max-width:120px;max-height:120px;vertical-align:middle;border:1px solid #555;border-radius:4px;margin:0 4px;" onerror="this.style.display='none'">`;
    });
}

function getWI(id) {
    const cfg = subjectConfig[currentSubject];
    for(let i=0;i<cfg.wiRanges.length;i++) if(id>=cfg.wiRanges[i].s&&id<=cfg.wiRanges[i].e) return i+1;
    return 0;
}

async function loadSubject() {
    currentSubject = document.getElementById('subject').value;
    const cfg = subjectConfig[currentSubject];
    answeredMap = {};
    submittedMap = {};

    // Populate work item dropdown
    const wiSel = document.getElementById('work-item');
    wiSel.innerHTML = '<option value="0">全部工作項目</option>';
    for(let i=1;i<=cfg.wiCount;i++){
        let o=document.createElement('option'); o.value=i; o.textContent=cfg.wiNames[i];
        wiSel.appendChild(o);
    }

    // Show/hide type filter: common subjects have only single-choice
    const typeSel = document.getElementById('question-type');
    const multiOpt = typeSel.querySelector('option[value="multiple"]');
    if (multiOpt) multiOpt.style.display = currentSubject === 'common' ? 'none' : '';
    typeSel.value = 'all';

    // Load questions
    const promises = cfg.files.map(f => loadQuestions(f));
    const results = await Promise.all(promises);
    allQuestions = results.flat().sort((a,b)=>a.id-b.id);

    document.getElementById('subtitle').textContent = '共 ' + allQuestions.length + ' 題 · ' + cfg.name;
    applyFilter();
}

function applyFilter() {
    const wi = +document.getElementById('work-item').value, type = document.getElementById('question-type').value;
    filteredQuestions = allQuestions.filter(q => (wi===0||getWI(q.id)===wi) && (type==='all'||q.type===type));
    currentIndex = 0; updateStats(); renderQuestion();
}

function updateStats() {
    document.getElementById('q-num').textContent = filteredQuestions.length ? currentIndex+1 : 0;
    document.getElementById('q-total').textContent = filteredQuestions.length;
    document.getElementById('progress-fill').style.width = filteredQuestions.length ? ((currentIndex+1)/filteredQuestions.length*100)+'%' : '0%';
    document.getElementById('prev-btn').disabled = currentIndex === 0;
    document.getElementById('next-btn').disabled = currentIndex >= filteredQuestions.length-1;
}

function renderQuestion() {
    const c = document.getElementById('question-container');
    if (!filteredQuestions.length) { c.innerHTML = '<div class="question-card"><p style="text-align:center;color:#888;">無符合條件的題目</p></div>'; return; }
    const q = filteredQuestions[currentIndex], wi = getWI(q.id), done = submittedMap[q.id];
    const selMap = answeredMap[q.id] || [];
    const wiName = wi ? subjectConfig[currentSubject].wiNames[wi] : '';
    let h = `<div class="question-card"><div class="question-number">第 ${currentIndex+1} / ${filteredQuestions.length} 題 (ID:${q.id})${wiName?'<span class="work-item">'+wiName+'</span>':''}</div>`;
    h += `<div class="question-text">${renderQuestionText(q)}</div>`;
    const qImgUrl = getQuestionImageUrl(q);
    if (qImgUrl) h += `<div class="question-img-wrap"><img src="${qImgUrl}" alt="題目圖片" onerror="this.parentElement.style.display='none'"></div>`;
    h += `<div class="options" id="opts-${q.id}">`;
    const type = q.type==='multiple'?'checkbox':'radio';
    for(let i=0;i<q.options.length;i++){
        const opt = q.options[i];
        const optLabel = String.fromCharCode(65+i);
        const selected = selMap.includes(i);
        const disabled = done ? 'disabled' : '';
        let cls = 'option';
        if (done) {
            if (q.answer.includes(i)) cls += ' correct disabled';
            else if (selected) cls += ' incorrect disabled';
            else cls += ' disabled';
        } else if (selected) {
            cls += ' selected';
        }
        h += `<div class="${cls}" onclick="${done?'':`toggleOpt(${q.id},${i},'${q.type}')`}">`;
        h += `<input type="${type}" name="q${q.id}" value="${i}" ${disabled} ${selected?'checked':''}>`;
        h += `<label>${optLabel}. ${opt || ''}<img src="${getOptionImageUrl(q, i)}" alt="" style="max-width:120px;max-height:120px;vertical-align:middle;margin-left:${opt?'6px':'0'};border:1px solid #555;border-radius:4px;background:#1a1a1a;" onerror="this.remove()"></label>`;
        h += `</div>`;
    }
    h += `</div>`;
    h += `<div class="submit-area"><button id="submit-btn" onclick="submitAnswer(${q.id})" ${done?'disabled':''}>${done?'已作答':'提交答案'}</button></div>`;
    let fbClass = 'feedback';
    if (done) {
        const correct = JSON.stringify([...selMap].sort()) === JSON.stringify([...q.answer].sort());
        fbClass += correct ? ' correct' : ' incorrect';
        if (correct) { h += `<div class="${fbClass}" id="fb-${q.id}">✓ 正確！`; } else {
            const a = q.answer.map(i=>String.fromCharCode(65+i)).join(', ');
            h += `<div class="${fbClass}" id="fb-${q.id}">✗ 錯誤！<div class="correct-answer">正確答案：${a}</div>`;
        }
    } else {
        h += `<div class="${fbClass}" id="fb-${q.id}">`;
    }
    h += `</div></div>`;
    c.innerHTML = h; updateStats();
}

function getQuestionImageUrl(q) {
    if (q.image) return q.image;
    const wi = getWI(q.id);
    const baseDir = `../../backend/data/img/${currentSubject}_img`;
    const m = q.question.match(/^(\d+)\.\s*\(/);
    if (m) return `${baseDir}/${wi}-${m[1]}-x.jpg`;
    return `${baseDir}/${wi}-${q.id}-x.jpg`;
}

function getOptionImageUrl(q, idx) {
    const wi = getWI(q.id);
    return `../../backend/data/img/${currentSubject}_img/${wi}-${q.id}-${idx + 1}.jpg`;
}

function toggleOpt(qId, idx, type) {
    if (submittedMap[qId]) return;
    if (!answeredMap[qId]) answeredMap[qId] = [];
    if (type==='single') { answeredMap[qId] = [idx]; renderQuestion(); return; }
    const p = answeredMap[qId].indexOf(idx);
    p>=0 ? answeredMap[qId].splice(p,1) : answeredMap[qId].push(idx);
    renderQuestion();
}

function submitAnswer(qId) {
    const sel = answeredMap[qId];
    if (!sel || !sel.length) { alert('請先選擇答案'); return; }
    const q = allQuestions.find(x=>x.id===qId);
    if (!q) return;
    submittedMap[qId] = true;
    renderQuestion();
}

function renderExam() {
    if (!examQuestions.length) return;
    const c = document.getElementById('question-container');
    const q = examQuestions[currentIndex];
    const selMap = answeredMap[q.id] || [];
    const done = examSubmitted;
    const wi = getWI(q.id);
    const wiName = wi ? subjectConfig[currentSubject].wiNames[wi] : '';
    const answeredCount = examQuestions.filter(qq => (answeredMap[qq.id] || []).length > 0).length;

    let h = `<div class="exam-bar">作答：<span class="count"><span>${answeredCount}</span>/${examQuestions.length}</span>　|　`;
    if (done) {
        const total = examQuestions.length;
        const correctCount = examQuestions.filter(qq => {
            const sel = answeredMap[qq.id] || [];
            return JSON.stringify([...sel].sort()) === JSON.stringify([...qq.answer].sort());
        }).length;
        h += `<span style="color:var(--success);">已提交　得分：${Math.round(correctCount/total*100)} (${correctCount}/${total})</span>`;
    } else {
        h += `<span style="color:var(--text-secondary);">未提交</span>`;
    }
    h += `</div>`;

    h += `<div class="question-card"><div class="question-number">${currentIndex+1} / ${examQuestions.length} (${q.type==='multiple'?'複選':'單選'})${wiName?'<span class="work-item">'+wiName+'</span>':''}</div>`;
    h += `<div class="question-text">${renderQuestionText(q)}</div>`;
    const qImgUrl = getQuestionImageUrl(q);
    if (qImgUrl) h += `<div class="question-img-wrap"><img src="${qImgUrl}" alt="題目圖片" onerror="this.parentElement.style.display='none'"></div>`;
    h += `<div class="options" id="opts-${q.id}">`;
    const itype = q.type==='multiple'?'checkbox':'radio';
    for(let i=0;i<q.options.length;i++){
        const opt = q.options[i];
        const optLabel = String.fromCharCode(65+i);
        const selected = selMap.includes(i);
        const disabled = done ? 'disabled' : '';
        let cls = 'option';
        if (done) {
            if (q.answer.includes(i)) cls += ' correct disabled';
            else if (selected) cls += ' incorrect disabled';
            else cls += ' disabled';
        } else if (selected) cls += ' selected';
        const clickHandler = done ? '' : `examToggleOpt(${q.id},${i},'${q.type}')`;
        h += `<div class="${cls}" onclick="${clickHandler}">`;
        h += `<input type="${itype}" name="q${q.id}" value="${i}" ${disabled} ${selected?'checked':''}>`;
        h += `<label>${optLabel}. ${opt || ''}<img src="${getOptionImageUrl(q, i)}" alt="" style="max-width:120px;max-height:120px;vertical-align:middle;margin-left:${opt?'6px':'0'};border:1px solid #555;border-radius:4px;background:#1a1a1a;" onerror="this.remove()"></label>`;
        h += `</div>`;
    }
    h += `</div>`;
    if (done) {
        const correct = JSON.stringify([...selMap].sort()) === JSON.stringify([...q.answer].sort());
        const fbClass = correct ? 'feedback correct' : 'feedback incorrect';
        h += `<div class="${fbClass}" style="display:block;">`;
        if (correct) h += `✓ 正確！ (+1.25分)`;
        else {
            const a = q.answer.map(i=>String.fromCharCode(65+i)).join(', ');
            h += `✗ 錯誤！<div class="correct-answer">正確答案：${a}</div>`;
        }
        h += `</div>`;
    }
    h += `</div>`;

    h += `<div class="nav-buttons"><button onclick="if(currentIndex>0){currentIndex--;renderExam();}" ${currentIndex===0?'disabled':''}>← 上一題</button>`;
    h += `<button onclick="if(currentIndex<examQuestions.length-1){currentIndex++;renderExam();}" ${currentIndex>=examQuestions.length-1?'disabled':''}>下一題 →</button></div>`;

    if (!done) {
        h += `<div class="exam-submit-area"><button onclick="submitExam()" style="background:#f44336;">提交答案</button></div>`;
    }
    c.innerHTML = h;
    document.getElementById('q-num').textContent = currentIndex+1;
    document.getElementById('q-total').textContent = examQuestions.length;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (examOverviewVisible) updateExamOverview();
}

function renderExamOverview() {
    let h = '<div class="exam-overview"><h3>作答總覽</h3><div class="grid">';
    examQuestions.forEach((q, i) => {
        const sel = answeredMap[q.id] || [];
        const hasAns = sel.length > 0;
        let cls = 'q';
        if (examSubmitted) {
            const correct = JSON.stringify([...sel].sort()) === JSON.stringify([...q.answer].sort());
            cls += hasAns ? (correct ? ' correct' : ' incorrect') : ' incorrect';
        } else if (hasAns) {
            cls += ' answered';
        }
        h += `<div class="${cls}" onclick="goToExamQuestion(${i})">${i+1}</div>`;
    });
    h += '</div></div>';
    return h;
}

function goToExamQuestion(idx) {
    if (idx >= 0 && idx < examQuestions.length) { currentIndex = idx; renderExam(); }
}

function toggleExamOverview() {
    if (!examQuestions.length) return;
    examOverviewVisible = !examOverviewVisible;
    document.getElementById('question-container').style.display = 'block';
    if (examOverviewVisible) {
        updateExamOverview();
        document.getElementById('exam-overview-container').style.display = 'block';
    } else {
        document.getElementById('exam-overview-container').style.display = 'none';
    }
}

function updateExamOverview() {
    if (!examOverviewVisible || !examQuestions.length) return;
    const container = document.getElementById('exam-overview-container');
    container.innerHTML = renderExamOverview();
}

function examToggleOpt(qId, idx, type) {
    if (examSubmitted) return;
    if (!answeredMap[qId]) answeredMap[qId] = [];
    if (type==='single') { answeredMap[qId] = [idx]; }
    else {
        const p = answeredMap[qId].indexOf(idx);
        p>=0 ? answeredMap[qId].splice(p,1) : answeredMap[qId].push(idx);
    }
    renderExam();
}

function submitExam() {
    const total = examQuestions.length;
    const correct = examQuestions.filter(q => {
        const sel = answeredMap[q.id] || [];
        return JSON.stringify([...sel].sort()) === JSON.stringify([...q.answer].sort());
    }).length;
    const score = (correct / total) * 100;
    examSubmitted = true;
    if (examOverviewVisible) { examOverviewVisible = false; document.getElementById('exam-overview-container').style.display = 'none'; }
    currentIndex = 0;
    renderExam();
    saveExamResult(correct, total, score);
    renderResultPanel(correct, total, score);
}

function renderResultPanel(correct, total, score) {
    const container = document.getElementById('question-container');
    const cfg = subjectConfig[currentSubject];
    const wiScores = {};
    for (let wi = 1; wi <= cfg.wiCount; wi++) {
        const wiQs = examQuestions.filter(q => getWI(q.id) === wi);
        const wiCorrect = wiQs.filter(q => {
            const sel = answeredMap[q.id] || [];
            return JSON.stringify([...sel].sort()) === JSON.stringify([...q.answer].sort());
        }).length;
        if (wiQs.length) wiScores[wi] = { correct: wiCorrect, total: wiQs.length, rate: Math.round(wiCorrect/wiQs.length*100) };
    }

    const pass = score >= 60;
    let h = `<div class="result-panel"><div class="result-header">
        <div class="big-score ${pass?'pass':'fail'}">${Math.round(score)}<span style="font-size:1rem;">分</span></div>
        <div class="score-label">${pass?'✓ 及格':'✗ 不及格'}</div>
        <div class="score-detail">${correct} / ${total} 題正確</div>
    </div>`;

    if (Object.keys(wiScores).length > 1) {
        h += `<div class="wi-breakdown"><h4><i class="fas fa-chart-simple"></i> 各工作項目能力分布</h4>`;
        for (const [wi, v] of Object.entries(wiScores)) {
            const name = cfg.wiNames[wi]?.replace(/工作項目\d+：/, '') || `工作項目 ${wi}`;
            const barClass = v.rate >= 60 ? 'good' : v.rate >= 40 ? 'mid' : 'poor';
            h += `<div class="wi-row">
                <div class="wi-label" title="${cfg.wiNames[wi]||''}">${name}</div>
                <div class="wi-bar-bg"><div class="wi-bar-fill ${barClass}" style="width:${v.rate}%"></div></div>
                <div class="wi-stat">${v.rate}% (${v.correct}/${v.total})</div>
            </div>`;
        }
        h += `</div>`;
    }

    h += `<div class="result-actions">
        <a href="dashboard.html" class="btn-dash"><i class="fas fa-chart-bar"></i> 查看完整分析</a>
        <button class="btn-retry" onclick="retryExam()"><i class="fas fa-redo"></i> 再考一次</button>
    </div></div>`;

    container.insertAdjacentHTML('afterend', h);
}

function retryExam() {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    examQuestions = shuffled.slice(0, Math.min(80, shuffled.length));
    answeredMap = {};
    submittedMap = {};
    examSubmitted = false;
    currentIndex = 0;
    document.querySelector('.result-panel')?.remove();
    renderExam();
}

function saveExamResult(correct, total, score) {
    if (!currentUser || !db) return;
    const wiScores = {};
    const wiCount = subjectConfig[currentSubject].wiCount || 1;
    for (let wi = 1; wi <= wiCount; wi++) {
        const wiQs = examQuestions.filter(q => getWI(q.id) === wi);
        const wiCorrect = wiQs.filter(q => {
            const sel = answeredMap[q.id] || [];
            return JSON.stringify([...sel].sort()) === JSON.stringify([...q.answer].sort());
        }).length;
        wiScores[wi] = { correct: wiCorrect, total: wiQs.length };
    }
    db.collection('users').doc(currentUser.uid).collection('scores').add({
        subject: currentSubject,
        type: examQuestions[0]?.type || 'mixed',
        total, correct, score,
        wiScores,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(e => console.error('Save exam error:', e));
    // Save each answer individually
    examQuestions.forEach(q => {
        const sel = answeredMap[q.id] || [];
        db.collection('users').doc(currentUser.uid).collection('answers').doc(`${currentSubject}_${q.id}`).set({
            subject: currentSubject,
            questionId: q.id,
            selected: sel,
            correct: JSON.stringify([...sel].sort()) === JSON.stringify([...q.answer].sort()),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(() => {});
    });
}

function nextQuestion() { if(currentIndex<filteredQuestions.length-1){ currentIndex++; renderQuestion(); } }
function prevQuestion() { if(currentIndex>0){ currentIndex--; renderQuestion(); } }
function goToQuestion() { const v=+document.getElementById('goto-input').value; if(v>0&&v<=filteredQuestions.length){ currentIndex=v-1; renderQuestion(); } document.getElementById('goto-input').value=''; }
function toggleMode() {
    examMode = !examMode;
    examSubmitted = false;
    examOverviewVisible = false;
    document.getElementById('mode-toggle').textContent = examMode ? '練習模式' : '考試模式';
    document.getElementById('mode-toggle').style.borderColor = examMode ? '#f44336' : '#444';
    document.getElementById('overview-btn').style.display = examMode ? '' : 'none';
    document.getElementById('exam-overview-container').style.display = 'none';
    document.getElementById('exam-overview-container').innerHTML = '';
    document.getElementById('practice-nav').style.display = examMode ? 'none' : 'flex';
    if (examMode) {
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        examQuestions = shuffled.slice(0, Math.min(80, shuffled.length));
        answeredMap = {};
        submittedMap = {};
        currentIndex = 0;
        renderExam();
    } else {
        examQuestions = [];
        applyFilter();
    }
}

document.getElementById('work-item').addEventListener('change', applyFilter);
document.getElementById('question-type').addEventListener('change', applyFilter);
document.addEventListener('keydown', e=>{
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (examMode && examQuestions.length) {
        if(e.key==='ArrowRight'||e.key===' '){ e.preventDefault(); if(currentIndex<examQuestions.length-1){ currentIndex++; renderExam(); } return; }
        if(e.key==='ArrowLeft'){ e.preventDefault(); if(currentIndex>0){ currentIndex--; renderExam(); } return; }
        if(e.key>='1'&&e.key<='4'&&!examSubmitted){ const q=examQuestions[currentIndex]; if(q) examToggleOpt(q.id,+e.key-1,q.type); }
        return;
    }
    if(e.key==='ArrowRight'||e.key===' '){ e.preventDefault(); nextQuestion(); }
    if(e.key==='ArrowLeft'){ e.preventDefault(); prevQuestion(); }
    if(e.key>='1'&&e.key<='4'){ const q=filteredQuestions[currentIndex]; if(q&&!submittedMap[q.id]) toggleOpt(q.id,+e.key-1,q.type); }
});
loadSubject();

document.addEventListener("contextmenu", function(e){
    e.preventDefault();
})