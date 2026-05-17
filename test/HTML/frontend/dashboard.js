const WI_NAMES = {
    1:'工作項目01：電機電子識圖',2:'工作項目02：零組件',3:'工作項目03：儀表與檢修測試',
    4:'工作項目04：電子工作法',5:'工作項目05：電子學與電子電路',6:'工作項目06：數位系統設計',
    7:'工作項目07：電腦與周邊設備',8:'工作項目08：程式語言',9:'工作項目09：網路技術與應用',
    10:'工作項目10：嵌入式系統'
};
const WI_RANGES = [{s:1,e:28},{s:29,e:61},{s:62,e:131},{s:132,e:189},{s:190,e:311},{s:312,e:451},{s:452,e:580},{s:581,e:661},{s:662,e:703},{s:704,e:743}];

let abilityChart = null;
let currentUser = null;
let scoreData = {};
let allScores = [];

let db = null;
if (typeof _fbReady !== 'undefined' && _fbReady) {
    try { db = firebase.firestore(); } catch(e) { console.warn("Firestore init failed", e.message); }
}

// ─── Auth ──────────────────────────────────────────────────────
function login() {
    if (!firebase.apps.length || !db) return alert('請先前往 firebase-config.js 設定 Firebase 專案');
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(e => alert('登入失敗：' + e.message));
}

function logout() {
    firebase.auth().signOut();
}

function getWI(id) {
    for(let i=0;i<WI_RANGES.length;i++) if(id>=WI_RANGES[i].s&&id<=WI_RANGES[i].e) return i+1;
    return 0;
}

try {
    firebase.auth().onAuthStateChanged(user => {
        currentUser = user;
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const scoreSection = document.getElementById('score-section');
        const loginPrompt = document.getElementById('login-prompt');
        const scoreContent = document.getElementById('score-content');

        if (user) {
            loginBtn.style.display = 'none';
            userInfo.style.display = 'flex';
            document.getElementById('user-avatar').src = user.photoURL || '';
            document.getElementById('user-name').textContent = user.displayName || user.email;
            scoreSection.style.display = 'block';
            loginPrompt.style.display = 'none';
            scoreContent.style.display = 'block';
            loadScores();
        } else {
            loginBtn.style.display = 'inline-flex';
            userInfo.style.display = 'none';
            if (scoreSection) {
                scoreSection.style.display = 'block';
                loginPrompt.style.display = 'block';
                scoreContent.style.display = 'none';
            }
        }
    });
} catch(e) { console.warn('Auth init failed', e); }

// ─── Score Tracking ────────────────────────────────────────────
async function saveScore(result) {
    // result: { subject, type, total, correct, wiScores: { wi: {correct,total} } }
    if (!currentUser || !db) return;
    try {
        await db.collection('users').doc(currentUser.uid).collection('scores').add({
            ...result,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch(e) {
        console.error('Save score error:', e);
    }
}

function recordAnswer(questionId, isCorrect) {
    const wi = getWI(questionId);
    if (!scoreData[wi]) scoreData[wi] = { correct: 0, total: 0 };
    scoreData[wi].total++;
    if (isCorrect) scoreData[wi].correct++;
}

async function flushScores(type) {
    const total = Object.values(scoreData).reduce((s, v) => s + v.total, 0);
    const correct = Object.values(scoreData).reduce((s, v) => s + v.correct, 0);
    if (total === 0) return;
    const wiScores = {};
    for (const [wi, v] of Object.entries(scoreData)) wiScores[wi] = { correct: v.correct, total: v.total };
    await saveScore({ subject: '11700', type, total, correct, wiScores });
    scoreData = {};
}

// ─── Load & Display Scores ────────────────────────────────────
async function loadScores() {
    if (!currentUser || !db) return;
    try {
        const snap = await db.collection('users').doc(currentUser.uid)
            .collection('scores').orderBy('timestamp', 'desc').limit(50).get();
        allScores = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderScoreSummary();
        renderHistory();
        renderChart();
    } catch(e) {
        console.error('Load scores error:', e);
    }
}

function renderScoreSummary() {
    let totalQ = 0, totalC = 0;
    for (const s of allScores) { totalQ += s.total || 0; totalC += s.correct || 0; }
    document.getElementById('total-answered').textContent = totalQ;
    document.getElementById('total-correct').textContent = totalC;
    document.getElementById('total-rate').textContent = totalQ ? Math.round(totalC / totalQ * 100) + '%' : '0%';
}

function renderHistory() {
    const tbody = document.getElementById('score-history-body');
    if (allScores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-secondary);">尚無作答記錄</td></tr>';
        return;
    }
    const typeMap = { single: '單選題', multiple: '複選題', all: '全部' };
    tbody.innerHTML = allScores.slice(0, 20).map(s => {
        const date = s.timestamp?.toDate?.() || new Date();
        const rate = s.total ? Math.round(s.correct / s.total * 100) : 0;
        return `<tr>
            <td>${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</td>
            <td>${typeMap[s.type] || s.type}</td>
            <td style="color:var(--success);">${s.correct}</td>
            <td>${s.total}</td>
            <td class="correct-rate" style="color:${rate>=60?'var(--success)':'var(--error)'};">${rate}%</td>
        </tr>`;
    }).join('');
}

function renderChart() {
    const canvas = document.getElementById('ability-chart');
    if (allScores.length === 0) {
        canvas.style.display = 'none';
        return;
    }
    canvas.style.display = 'block';

    const wiAgg = {};
    for (const s of allScores) {
        if (!s.wiScores) continue;
        for (const [wi, v] of Object.entries(s.wiScores)) {
            if (!wiAgg[wi]) wiAgg[wi] = { correct: 0, total: 0 };
            wiAgg[wi].correct += v.correct;
            wiAgg[wi].total += v.total;
        }
    }

    const labels = [];
    const rates = [];

    for (let wi = 1; wi <= 10; wi++) {
        const shortName = WI_NAMES[wi]?.replace(/工作項目\d+：/, '') || `工作項目${wi}`;
        labels.push(shortName);
        const d = wiAgg[wi];
        rates.push(d && d.total ? Math.round(d.correct / d.total * 100) : 0);
    }

    if (abilityChart) abilityChart.destroy();

    abilityChart = new Chart(canvas, {
        type: 'radar',
        data: {
            labels,
            datasets: [{
                label: '正確率 (%)',
                data: rates,
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                borderColor: 'rgba(56, 189, 248, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(56, 189, 248, 1)',
                pointRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    angleLines: { color: 'rgba(255,255,255,0.1)' },
                    pointLabels: { color: '#94a3b8', font: { size: 11 } },
                    ticks: { color: '#94a3b8', backdropColor: 'transparent', stepSize: 20 }
                }
            },
            plugins: {
                legend: { labels: { color: '#f8fafc' } }
            }
        }
    });
}

// ─── Integrate with existing quiz ──────────────────────────────
const origCheckAnswer = window.checkAnswer;
window.checkAnswer = function(qId, isMultiple) {
    const question = questions.find(q => q.id === qId);
    const inputs = document.querySelectorAll(`input[name="q-${qId}"]:checked`);
    const selectedIndices = Array.from(inputs).map(i => parseInt(i.value));
    const sortedSelected = [...selectedIndices].sort();
    const sortedAnswer = [...question.answer].sort();
    const isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedAnswer);

    if (origCheckAnswer) origCheckAnswer(qId, isMultiple);
    recordAnswer(qId, isCorrect);
};

// ─── Submit quiz button ────────────────────────────────────────
const submitBtn = document.createElement('button');
submitBtn.textContent = '提交本次作答';
submitBtn.className = 'btn-google';
submitBtn.style.cssText = 'margin:20px auto;display:block;background:var(--accent);color:#fff;';
submitBtn.onclick = async () => {
    const type = document.getElementById('quiz-type').value;
    await flushScores(type);
    loadScores();
    alert('成績已儲存！');
};
quizContainer.parentNode.insertBefore(submitBtn, quizContainer.nextSibling);

console.log('Dashboard ready — Google login & score tracking enabled');