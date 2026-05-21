const SUBJECTS = {
    '11700': {
        name: '11700 數位電子乙級',
        wiNames: {1:'工作項目01：電機電子識圖',2:'工作項目02：零組件',3:'工作項目03：儀表與檢修測試',4:'工作項目04：電子工作法',5:'工作項目05：電子學與電子電路',6:'工作項目06：數位系統設計',7:'工作項目07：電腦與周邊設備',8:'工作項目08：程式語言',9:'工作項目09：網路技術與應用',10:'工作項目10：嵌入式系統'},
        wiCount: 10
    },
    '11800': {
        name: '11800 電腦軟體應用丙級',
        wiNames: {1:'工作項目01：電腦概論',2:'工作項目02：應用軟體使用',3:'工作項目03：系統軟體使用',4:'工作項目04：資訊安全'},
        wiCount: 4
    },
    'common': {
        name: '共同科目',
        wiNames: {1:'90006 職業安全衛生',2:'90007 工作倫理與職業道德',3:'90008 環境保護',4:'90009 節能減碳'},
        wiCount: 4
    }
};

let currentUser = null;
let allScores = [];
let currentSubject = '11700';
let db = null;
let wiBarChart = null;
let abilityChart = null;
let trendChart = null;

if (typeof _fbReady !== 'undefined' && _fbReady) {
    try { db = firebase.firestore(); } catch(e) { console.warn('Firestore init failed', e.message); }
}

// ─── Auth ──────────────────────────────────────────────────────
function login() {
    if (!firebase.apps.length || !db) return alert('請先前往 firebase-config.js 設定 Firebase 專案');
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(e => alert('登入失敗：' + e.message));
}
function logout() { firebase.auth().signOut(); }

try {
    firebase.auth().onAuthStateChanged(user => {
        currentUser = user;
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const prompt = document.getElementById('login-prompt');
        const content = document.getElementById('dash-content');

        if (user) {
            loginBtn.style.display = 'none';
            userInfo.style.display = 'flex';
            document.getElementById('user-avatar').src = user.photoURL || '';
            document.getElementById('user-name').textContent = user.displayName || user.email;
            prompt.style.display = 'none';
            content.style.display = 'block';
            loadAllScores();
        } else {
            loginBtn.style.display = 'inline-flex';
            userInfo.style.display = 'none';
            prompt.style.display = 'block';
            content.style.display = 'none';
        }
    });
} catch(e) { console.warn('Auth init failed', e); }

// ─── Data Loading ──────────────────────────────────────────────
async function loadAllScores() {
    if (!currentUser || !db) return;
    try {
        const snap = await db.collection('users').doc(currentUser.uid)
            .collection('scores').orderBy('timestamp', 'desc').limit(100).get();
        allScores = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderDashboard();
    } catch(e) {
        console.error('Load scores error:', e);
    }
}

function getFilteredScores() {
    return allScores.filter(s => s.subject === currentSubject);
}

// ─── Subject switching ─────────────────────────────────────────
function switchSubject(subject) {
    currentSubject = subject;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.subject === subject));
    renderDashboard();
}

// ─── Render everything ─────────────────────────────────────────
function renderDashboard() {
    renderStats();
    renderWiBarChart();
    renderRadarChart();
    renderTrendChart();
    renderHistory();
}

// ─── Stats ─────────────────────────────────────────────────────
function renderStats() {
    const scores = getFilteredScores();
    const totalExams = scores.length;
    let totalQ = 0, totalC = 0;
    let best = 0, latest = null;

    for (const s of scores) {
        totalQ += s.total || 0;
        totalC += s.correct || 0;
        if (s.score > best) best = s.score;
        if (!latest) latest = s;
    }

    document.getElementById('stat-exams').textContent = totalExams;
    document.getElementById('stat-answered').textContent = totalQ;
    document.getElementById('stat-best').textContent = best ? Math.round(best) + '%' : '0%';
    document.getElementById('stat-avg').textContent = totalQ ? Math.round(totalC / totalQ * 100) + '%' : '0%';
    document.getElementById('stat-latest').textContent = latest ? Math.round(latest.score) + '%' : '0%';
}

// ─── WI Bar Chart ──────────────────────────────────────────────
function renderWiBarChart() {
    const canvas = document.getElementById('wi-bar-chart');
    const ctx = canvas.getContext('2d');
    const scores = getFilteredScores();
    const cfg = SUBJECTS[currentSubject];

    const wiAgg = {};
    for (const s of scores) {
        if (!s.wiScores) continue;
        for (const [wi, v] of Object.entries(s.wiScores)) {
            if (!wiAgg[wi]) wiAgg[wi] = { correct: 0, total: 0 };
            wiAgg[wi].correct += v.correct;
            wiAgg[wi].total += v.total;
        }
    }

    const labels = [];
    const rates = [];
    const totals = [];

    for (let wi = 1; wi <= cfg.wiCount; wi++) {
        const shortName = cfg.wiNames[wi]?.replace(/工作項目\d+：/, '') || `項目${wi}`;
        labels.push(shortName);
        const d = wiAgg[wi];
        const rate = d && d.total ? Math.round(d.correct / d.total * 100) : 0;
        rates.push(rate);
        totals.push(d ? d.total : 0);
    }

    if (wiBarChart) wiBarChart.destroy();

    wiBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: '正確率 (%)',
                data: rates,
                backgroundColor: rates.map(r => r >= 60 ? 'rgba(74,222,128,0.7)' : r >= 40 ? 'rgba(251,191,36,0.7)' : 'rgba(248,113,113,0.7)'),
                borderColor: rates.map(r => r >= 60 ? '#4ade80' : r >= 40 ? '#fbbf24' : '#f87171'),
                borderWidth: 1,
                borderRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8', callback: v => v + '%' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        afterLabel: function(ctx) {
                            const i = ctx.dataIndex;
                            const d = wiAgg[i+1];
                            return d ? `答題數: ${d.total} | 正確: ${d.correct}` : '無資料';
                        }
                    }
                }
            }
        }
    });
}

// ─── Radar Chart ───────────────────────────────────────────────
function renderRadarChart() {
    const canvas = document.getElementById('ability-chart');
    const ctx = canvas.getContext('2d');
    const scores = getFilteredScores();
    const cfg = SUBJECTS[currentSubject];

    if (abilityChart) abilityChart.destroy();

    if (scores.length === 0) {
        canvas.style.display = 'none';
        return;
    }
    canvas.style.display = 'block';

    const wiAgg = {};
    for (const s of scores) {
        if (!s.wiScores) continue;
        for (const [wi, v] of Object.entries(s.wiScores)) {
            if (!wiAgg[wi]) wiAgg[wi] = { correct: 0, total: 0 };
            wiAgg[wi].correct += v.correct;
            wiAgg[wi].total += v.total;
        }
    }

    const labels = [];
    const rates = [];

    for (let wi = 1; wi <= cfg.wiCount; wi++) {
        const shortName = cfg.wiNames[wi]?.replace(/工作項目\d+：/, '') || `項目${wi}`;
        labels.push(shortName);
        const d = wiAgg[wi];
        rates.push(d && d.total ? Math.round(d.correct / d.total * 100) : 0);
    }

    abilityChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels,
            datasets: [{
                label: '正確率 (%)',
                data: rates,
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                borderColor: 'rgba(56, 189, 248, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: rates.map(r => r >= 60 ? '#4ade80' : r >= 40 ? '#fbbf24' : '#f87171'),
                pointRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true, max: 100,
                    grid: { color: 'rgba(255,255,255,0.08)' },
                    angleLines: { color: 'rgba(255,255,255,0.08)' },
                    pointLabels: { color: '#94a3b8', font: { size: 11 } },
                    ticks: { color: '#94a3b8', backdropColor: 'transparent', stepSize: 20, callback: v => v + '%' }
                }
            },
            plugins: {
                legend: { labels: { color: '#f8fafc', font: { size: 12 } } }
            }
        }
    });
}

// ─── Trend Chart ───────────────────────────────────────────────
function renderTrendChart() {
    const canvas = document.getElementById('trend-chart');
    const ctx = canvas.getContext('2d');
    const scores = getFilteredScores();

    if (trendChart) trendChart.destroy();

    if (scores.length < 2) {
        canvas.style.display = 'none';
        return;
    }
    canvas.style.display = 'block';

    const reversed = [...scores].reverse();
    const labels = reversed.map((s, i) => {
        const d = s.timestamp?.toDate?.() || new Date();
        return `#${i+1} ${d.toLocaleDateString()}`;
    });
    const data = reversed.map(s => Math.round(s.score));

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: '正確率 (%)',
                data,
                fill: true,
                backgroundColor: 'rgba(56,189,248,0.1)',
                borderColor: 'rgba(56,189,248,0.8)',
                borderWidth: 2,
                pointBackgroundColor: '#38bdf8',
                pointRadius: 4,
                tension: 0.3,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8', callback: v => v + '%' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 }, maxRotation: 45 } }
            },
            plugins: {
                legend: { labels: { color: '#f8fafc' } }
            }
        }
    });
}

// ─── History ───────────────────────────────────────────────────
function renderHistory() {
    const tbody = document.getElementById('score-history-body');
    const scores = getFilteredScores();
    const typeFilter = document.getElementById('history-type-filter').value;

    let filtered = scores;
    if (typeFilter !== 'all') filtered = scores.filter(s => s.type === typeFilter);

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-secondary);padding:40px;">尚無作答記錄</td></tr>';
        return;
    }

    const cfg = SUBJECTS[currentSubject];
    const typeLabel = { single: '單選', multiple: '複選', mixed: '混合', all: '全部' };

    tbody.innerHTML = filtered.map((s, i) => {
        const date = s.timestamp?.toDate?.() || new Date();
        const rate = s.total ? Math.round(s.correct / s.total * 100) : 0;

        let wiSummary = '';
        if (s.wiScores) {
            const parts = Object.entries(s.wiScores)
                .filter(([, v]) => v.total > 0)
                .map(([wi, v]) => {
                    const name = cfg.wiNames[wi]?.replace(/工作項目\d+：/, '').slice(0, 8) || `W${wi}`;
                    const wr = Math.round(v.correct / v.total * 100);
                    return `<span class="wi-tag wi-${wr >= 60 ? 'good' : wr >= 40 ? 'mid' : 'poor'}">${name}: ${v.correct}/${v.total}</span>`;
                });
            wiSummary = parts.join(' ');
        }

        return `<tr>
            <td class="row-num">${filtered.length - i}</td>
            <td class="row-date">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</td>
            <td>${typeLabel[s.type] || s.type}</td>
            <td style="color:var(--success);font-weight:600;">${s.correct}</td>
            <td>${s.total}</td>
            <td><span class="rate-pill rate-${rate >= 60 ? 'good' : rate >= 40 ? 'mid' : 'poor'}">${rate}%</span></td>
            <td class="wi-cell">${wiSummary || '<span style="color:var(--text-secondary)">—</span>'}</td>
        </tr>`;
    }).join('');
}

// ─── Export CSV ────────────────────────────────────────────────
function exportHistory() {
    const scores = getFilteredScores();
    if (!scores.length) return alert('尚無資料可匯出');

    const typeLabel = { single: '單選', multiple: '複選', mixed: '混合', all: '全部' };
    let csv = '\uFEFF日期,題型,正確,總題數,正確率\n';

    for (const s of scores) {
        const date = s.timestamp?.toDate?.() || new Date();
        const ds = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;
        const rate = s.total ? Math.round(s.correct / s.total * 100) : 0;
        csv += `${ds},${typeLabel[s.type] || s.type},${s.correct},${s.total},${rate}%\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `成績記錄_${currentSubject}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
}

console.log('Dashboard v2 loaded — multi-subject, bar chart, trend, history');
