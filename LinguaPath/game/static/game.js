const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let state = null;
let gameId = null;
let keys = {};
let mouseX = 400;
let mouseY = 300;
let spellActive = false;
let commandActive = false;
let pollInterval = null;

const PLAYER_ID_KEY = 'lp-game-player-id';
const PROFILE_KEY = 'lp-game-profile';

function getPlayerId() {
    let pid = localStorage.getItem(PLAYER_ID_KEY);
    if (!pid) {
        pid = crypto.randomUUID ? crypto.randomUUID() : 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        localStorage.setItem(PLAYER_ID_KEY, pid);
    }
    return pid;
}

function getSavedProfile() {
    try {
        const raw = localStorage.getItem(PROFILE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

function saveProfileLocally(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

async function syncProfileToCloud(profile) {
    try {
        await fetch('/api/profile/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId: getPlayerId(), ...profile })
        });
    } catch { /* offline — local is enough */ }
}

async function loadProfileFromCloud() {
    try {
        const res = await fetch('/api/profile/load?playerId=' + encodeURIComponent(getPlayerId()));
        const data = await res.json();
        if (data.profile) {
            saveProfileLocally(data.profile);
            return data.profile;
        }
    } catch { /* offline */ }
    return getSavedProfile();
}

const STRINGS = {
    en: {
        roleTitle: 'Choose Your Role',
        you: 'YOU',
        energy: 'ENERGY',
        boss: 'BOSS',
        score: 'Score',
        sp: 'SP',
        hp: 'HP',
        spellTitle: 'Spell the word to survive!',
        spellCorrect: 'Correct! +30 HP',
        spellWrong: 'Wrong! No energy recovered.',
        bossDefeated: 'BOSS DEFEATED! +50 Score!',
        gameOver: 'Game Over',
        finalScore: 'Final Score',
        playAgain: 'Play Again',
        saveOk: 'Score saved!',
        saveOffline: 'Save unavailable (offline)',
        saveFail: 'Save failed',
        progress: 'Progress',
        games: 'Games',
        continue: 'Continue',
        newGame: 'New Game',
        startFresh: 'Start fresh — no saved progress found.',
        hint: 'Hint: starts with',
        npcDialogueDone: 'skill points!',
        shop: 'Skill Shop',
        spLabel: 'Skill Points',
        buy: 'Buy',
        owned: 'Owned',
        close: 'Close',
        language: 'Language',
        monstersKilled: 'Monsters Killed',
        wordsCorrect: 'Words Correct',
        duration: 'Duration'
    },
    ja: {
        roleTitle: 'ロールを選択',
        you: 'あなた',
        energy: 'エネルギー',
        boss: 'ボス',
        score: 'スコア',
        sp: 'スキルP',
        hp: 'HP',
        spellTitle: '単語を入力して生き残ろう！',
        spellCorrect: '正解！ +30 HP',
        spellWrong: '不正解！回復なし',
        bossDefeated: 'ボス撃破！ +50点！',
        gameOver: 'ゲームオーバー',
        finalScore: '最終スコア',
        playAgain: 'もう一度プレイ',
        saveOk: 'スコア保存完了',
        saveOffline: '保存不可（オフライン）',
        saveFail: '保存失敗',
        progress: '進捗',
        games: 'プレイ回数',
        continue: '続ける',
        newGame: '新規ゲーム',
        startFresh: '保存データはありません',
        hint: 'ヒント：最初の文字は',
        npcDialogueDone: 'スキルポイント！',
        shop: 'スキルショップ',
        spLabel: 'スキルポイント',
        buy: '購入',
        owned: '所有済み',
        close: '閉じる',
        language: '言語',
        monstersKilled: '倒したモンスター',
        wordsCorrect: '正解単語',
        duration: '経過時間'
    },
    ko: {
        roleTitle: '역할 선택',
        you: '당신',
        energy: '에너지',
        boss: '보스',
        score: '점수',
        sp: '스킬P',
        hp: 'HP',
        spellTitle: '단어를 입력하여 생존하세요!',
        spellCorrect: '정답! +30 HP',
        spellWrong: '오답! 회복 없음',
        bossDefeated: '보스 격파! +50점!',
        gameOver: '게임 오버',
        finalScore: '최종 점수',
        playAgain: '다시 플레이',
        saveOk: '점수 저장 완료',
        saveOffline: '저장 불가 (오프라인)',
        saveFail: '저장 실패',
        progress: '진행',
        games: '플레이 횟수',
        continue: '계속',
        newGame: '새 게임',
        startFresh: '저장된 진행이 없습니다',
        hint: '힌트: 첫 글자는',
        npcDialogueDone: '스킬 포인트!',
        shop: '스킬 상점',
        spLabel: '스킬 포인트',
        buy: '구매',
        owned: '보유 중',
        close: '닫기',
        language: '언어',
        monstersKilled: '처치한 몬스터',
        wordsCorrect: '정답 단어',
        duration: '경과 시간'
    }
};

let currentLang = localStorage.getItem('lp-lang') || 'en';

function getStr(key) {
    return (STRINGS[currentLang] && STRINGS[currentLang][key]) || (STRINGS.en[key]) || key;
}

function drawSquare(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - size / 2, y - size / 2, size, size);
}

function drawTriangle(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.lineTo(x + size, y + size);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawCircle(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawRectangle(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x - size.w / 2, y - size.h / 2, size.w, size.h);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - size.w / 2, y - size.h / 2, size.w, size.h);
}

function drawPentagon(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function getDrawFn(role) {
    if (role === 'square') return drawSquare;
    if (role === 'triangle') return drawTriangle;
    if (role === 'circle') return drawCircle;
    if (role === 'rectangle') return drawRectangle;
    if (role === 'pentagon') return drawPentagon;
    return drawSquare;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    if (!state) return;

    (state.monsters || []).forEach(m => {
        ctx.fillStyle = m.color;
        ctx.beginPath();
        if (m.type === 'circle') {
            ctx.arc(m.x, m.y, 15, 0, Math.PI * 2);
        } else if (m.type === 'triangle') {
            ctx.moveTo(m.x, m.y - 15);
            ctx.lineTo(m.x - 15, m.y + 15);
            ctx.lineTo(m.x + 15, m.y + 15);
            ctx.closePath();
        } else {
            ctx.fillRect(m.x - 12, m.y - 12, 24, 24);
        }
        ctx.fill();

        const barW = 30, barH = 4;
        const barX = m.x - barW / 2, barY = m.y - 25;
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = m.hp > 1 ? '#2ecc71' : '#e74c3c';
        ctx.fillRect(barX, barY, barW * (m.hp / m.maxHp), barH);
    });

    (state.energies || []).forEach(e => {
        const pulse = Math.sin(Date.now() / 200 + e.x) * 0.3 + 0.7;
        ctx.save();
        ctx.globalAlpha = pulse;
        ctx.shadowColor = '#f1c40f';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(e.x, e.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#fff';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(getStr('energy'), e.x, e.y + 20);
    });

    (state.npcs || []).forEach(n => {
        if (n.interacted) return;
        ctx.fillStyle = '#1abc9c';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(n.name, n.x, n.y - 22);
        const pulse = Math.sin(Date.now() / 300) * 0.2 + 0.8;
        ctx.save();
        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#f1c40f';
        ctx.font = '8px monospace';
        ctx.fillText('NPC', n.x, n.y + 28);
        ctx.restore();
    });

    if (state.boss) {
        const b = state.boss;
        const pulse = Math.sin(Date.now() / 150) * 0.15 + 0.85;
        ctx.save();
        ctx.globalAlpha = pulse;
        ctx.shadowColor = '#8e44ad';
        ctx.shadowBlur = 25;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (i * 2 * Math.PI / 6) - Math.PI / 2;
            const px = b.x + b.size * Math.cos(a);
            const py = b.y + b.size * Math.sin(a);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(getStr('boss'), b.x, b.y - b.size - 8);
        const barW = 80, barH = 6;
        const barX = b.x - barW / 2, barY = b.y - b.size - 16;
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = b.hp > b.maxHp * 0.3 ? '#e74c3c' : '#f1c40f';
        ctx.fillRect(barX, barY, barW * (b.hp / b.maxHp), barH);
        if (b.attackTimer > b.attackCooldown - 20) {
            ctx.fillStyle = '#fff';
            ctx.font = '10px monospace';
            ctx.fillText('⚡', b.x, b.y + b.size + 14);
        }
    }

    const p = state.player;
    if (p) {
        if (p.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.3;
        }
        const draw = getDrawFn(p.role);
        draw(p.x, p.y, p.size, p.color);
        ctx.globalAlpha = 1;

        if (state.player.slashTimer > 0) {
            const alpha = state.player.slashTimer / 10;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#f1c40f';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            const endX = p.x + p.lastDx * 100;
            const endY = p.y + p.lastDy * 100;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.restore();
        }

        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(getStr('you'), p.x, p.y + (p.size.w || p.size) + 18);
    }
}

function updateHUD() {
    if (!state || !state.player) return;
    const pct = Math.max(0, (state.player.hp / state.player.maxHp) * 100);
    document.getElementById('health-fill').style.width = pct + '%';
    document.getElementById('health-text').textContent = Math.ceil(state.player.hp);
    document.getElementById('score').textContent = state.score;
    document.getElementById('cefr-level').textContent = state.player.cefrLevel || 'A1';
    const xp = state.player.cefrXp || 0;
    const thr = state.player.cefrThreshold || 100;
    const xpPct = Math.min(100, (xp / thr) * 100);
    document.getElementById('cefr-xp-fill').style.width = xpPct + '%';
    document.getElementById('cefr-xp-text').textContent = xp + '/' + thr;
    document.getElementById('sp-label').textContent = getStr('sp');
    document.getElementById('score-label').textContent = getStr('score');
    document.getElementById('skill-points-display').textContent = state.player.skillPoints || 0;
}

async function sendUpdate() {
    if (!gameId) return;
    try {
        const res = await fetch('/api/game/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keys })
        });
        state = await res.json();
        updateHUD();

        if (state.spellActive && !spellActive) {
            spellActive = true;
            showSpellModal(state.currentWord);
        }
        if (!state.running && !document.getElementById('game-over-modal').style.display) {
            showGameOver();
        }
        if (state.nearNpc && !document.getElementById('npc-modal').style.display) {
            showNpcModal(state.nearNpc);
        } else if (!state.nearNpc) {
            document.getElementById('npc-modal').style.display = 'none';
        }
        updateSkillBar();
        draw();
    } catch (e) {
        console.error('Update error', e);
    }
}

async function sendAction(action, extra = {}) {
    if (!gameId) return;
    try {
        const res = await fetch('/api/game/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...extra })
        });
        state = await res.json();
        updateHUD();
        draw();
    } catch (e) {
        console.error('Action error', e);
    }
}

function showSpellModal(word) {
    document.getElementById('spell-word').textContent = word;
    document.getElementById('spell-result').textContent = '';
    document.getElementById('spell-hint').textContent = '';
    document.getElementById('spell-title').textContent = getStr('spellTitle');
    document.getElementById('spell-input').value = '';
    document.getElementById('spell-modal').style.display = 'flex';
    document.getElementById('spell-input').focus();
}

async function submitSpell() {
    const input = document.getElementById('spell-input');
    const given = input.value.trim().toLowerCase();
    try {
        const res = await fetch('/api/game/spell', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word: given })
        });
        const data = await res.json();
        state = data.state;
        if (data.correct) {
            const hadBoss = state.boss && state.boss.hp > 0;
            if (state.boss === null && hadBoss !== false) {
                document.getElementById('spell-result').textContent = getStr('bossDefeated');
                document.getElementById('spell-result').style.color = '#9b59b6';
            } else {
                document.getElementById('spell-result').textContent = getStr('spellCorrect');
                document.getElementById('spell-result').style.color = '#2ecc71';
            }
        } else {
            document.getElementById('spell-result').textContent = getStr('spellWrong');
            document.getElementById('spell-result').style.color = '#e74c3c';
        }
        setTimeout(() => {
            document.getElementById('spell-modal').style.display = 'none';
            spellActive = false;
            state = data.state;
            updateHUD();
        }, 800);
    } catch (e) {
        console.error('Spell error', e);
    }
}

async function saveScore() {
    const statusEl = document.getElementById('save-status');
    if (!state) return;
    try {
        const res = await fetch('/api/game/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.saved) {
            statusEl.textContent = '✓ ' + getStr('saveOk');
            statusEl.style.color = '#2ecc71';
        } else if (data.error === 'Firebase not available') {
            statusEl.textContent = getStr('saveOffline');
            statusEl.style.color = '#7a7870';
        } else {
            statusEl.textContent = getStr('saveFail');
            statusEl.style.color = '#e74c3c';
        }
    } catch (e) {
        statusEl.textContent = getStr('saveFail') + ' (connection error)';
        statusEl.style.color = '#e74c3c';
    }
}

async function saveProfile() {
    const p = state.player;
    const prev = getSavedProfile() || {};
    const profile = {
        cefrLevel: p.cefrLevel || 'A1',
        cefrXp: p.cefrXp || 0,
        cefrThreshold: p.cefrThreshold || 100,
        skillPoints: p.skillPoints || 0,
        totalScore: (prev.totalScore || 0) + (state.score || 0),
        gamesPlayed: (prev.gamesPlayed || 0) + 1,
        language: state.language || currentLang || 'en'
    };
    saveProfileLocally(profile);
    await syncProfileToCloud(profile);
}

function showNpcModal(npc) {
    const modal = document.getElementById('npc-modal');
    document.getElementById('npc-name').textContent = npc.name;
    document.getElementById('npc-dialogue').textContent = npc.line;
    document.getElementById('npc-next-btn').textContent = getStr('continue');
    modal.style.display = 'flex';
}

function closeNpcModal() {
    document.getElementById('npc-modal').style.display = 'none';
    if (state && state.running) {
        sendAction('interact_npc');
    }
}

function updateSkillBar() {
    const bar = document.getElementById('skill-bar');
    const sp = document.getElementById('skill-points-display');
    if (!state || !state.player) return;
    sp.textContent = 'SP: ' + (state.player.skillPoints || 0);
    const skills = state.unlockedSkills || [];
    const allSkills = state.availableSkills || [];
    bar.innerHTML = '';
    allSkills.forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'skill-btn';
        const owned = skills.includes(s.id);
        btn.textContent = s.name;
        btn.title = s.desc + ' (Cost: ' + s.cost + ')';
        if (owned) {
            btn.classList.add('owned');
            btn.addEventListener('click', () => activateSkill(s.id));
        } else {
            btn.classList.add('locked');
            btn.addEventListener('click', () => openShop());
        }
        bar.appendChild(btn);
    });
}

async function activateSkill(skillId) {
    if (!gameId) return;
    try {
        const res = await fetch('/api/game/skill/use', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skillId })
        });
        const data = await res.json();
        if (data.result === true || typeof data.result === 'string') {
            if (typeof data.result === 'string' && data.result.startsWith('hint:')) {
                document.getElementById('spell-hint').textContent = getStr('hint') + ' "' + data.result.slice(5) + '"';
                setTimeout(() => { document.getElementById('spell-hint').textContent = ''; }, 3000);
            }
        }
        state = data.state;
        updateHUD();
    } catch (e) {
        console.error('Skill error', e);
    }
}

function openShop() {
    const modal = document.getElementById('shop-modal');
    const list = document.getElementById('shop-list');
    list.innerHTML = '';
    const allSkills = (state && state.availableSkills) || [];
    const owned = (state && state.unlockedSkills) || [];
    const sp = (state && state.player && state.player.skillPoints) || 0;
    document.getElementById('shop-title').textContent = getStr('shop');
    document.getElementById('shop-sp-label').textContent = getStr('spLabel');
    document.getElementById('shop-sp').textContent = sp;
    document.getElementById('shop-close-btn').textContent = getStr('close');
    allSkills.forEach(s => {
        const div = document.createElement('div');
        div.className = 'shop-item';
        const owned_ = owned.includes(s.id);
        div.innerHTML = '<span><strong>' + s.name + '</strong> — ' + s.desc + '</span><span>Cost: ' + s.cost + ' ' + getStr('sp') + '</span>';
        if (owned_) {
            div.innerHTML += '<span style="color:#2ecc71">✓ ' + getStr('owned') + '</span>';
        } else {
            const buyBtn = document.createElement('button');
            buyBtn.textContent = getStr('buy');
            buyBtn.className = 'buy-btn';
            buyBtn.disabled = sp < s.cost;
            buyBtn.addEventListener('click', () => buySkill(s.id));
            div.appendChild(buyBtn);
        }
        list.appendChild(div);
    });
    modal.style.display = 'flex';
}

async function buySkill(skillId) {
    try {
        const res = await fetch('/api/game/shop/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skillId })
        });
        const data = await res.json();
        if (data.bought) {
            state = data.state;
            updateHUD();
            openShop();
        } else {
            alert(data.error || 'Purchase failed');
        }
    } catch (e) {
        console.error('Buy error', e);
    }
}

function showGameOver() {
    document.getElementById('game-over-modal').style.display = 'flex';
    document.getElementById('game-over-title').textContent = getStr('gameOver');
    document.getElementById('final-score-label').textContent = getStr('finalScore');
    document.getElementById('final-score').textContent = state ? state.score : 0;
    document.getElementById('restart-btn').textContent = getStr('playAgain');
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
    saveScore();
    saveProfile();
}

function initRoleSelection() {
    fetch('/api/roles').then(r => r.json()).then(roles => {
        const container = document.getElementById('role-options');
        const titleEl = document.getElementById('role-title');
        const savedProfile = getSavedProfile();
        const level = savedProfile ? savedProfile.cefrLevel : 'A1';
        currentLang = (savedProfile && savedProfile.language) || 'en';

        titleEl.textContent = getStr('roleTitle');

        const banner = document.getElementById('profile-banner');
        banner.innerHTML = '';
        if (savedProfile) {
            banner.innerHTML = '<span>' + getStr('progress') + ': <strong>' + level + '</strong> | ' + getStr('games') + ': ' + savedProfile.gamesPlayed + ' | ' + getStr('score') + ': ' + savedProfile.totalScore + ' | <label>' + getStr('language') + ': <select id="lang-selector"><option value="en">English</option><option value="ja">日本語</option><option value="ko">한국어</option></select></label></span>' +
                '<div><button id="continue-btn">' + getStr('continue') + '</button><button id="new-game-btn">' + getStr('newGame') + '</button></div>';
            setTimeout(() => {
                document.getElementById('continue-btn').addEventListener('click', () => startGame(roles[0].id, savedProfile));
                document.getElementById('new-game-btn').addEventListener('click', () => {
                    localStorage.removeItem(PROFILE_KEY);
                    initRoleSelection();
                });
                const sel = document.getElementById('lang-selector');
                if (sel) {
                    sel.value = currentLang;
                    sel.addEventListener('change', () => {
                        currentLang = sel.value;
                        const profile = getSavedProfile();
                        if (profile) {
                            profile.language = currentLang;
                            saveProfileLocally(profile);
                        }
                        titleEl.textContent = getStr('roleTitle');
                        banner.innerHTML = '';
                        initRoleSelection();
                    });
                }
            }, 0);
        } else {
            banner.innerHTML = '<span>' + getStr('startFresh') + ' | <label>' + getStr('language') + ': <select id="lang-selector"><option value="en">English</option><option value="ja">日本語</option><option value="ko">한국어</option></select></label></span>';
            setTimeout(() => {
                const sel = document.getElementById('lang-selector');
                if (sel) {
                    sel.value = currentLang;
                    sel.addEventListener('change', () => {
                        currentLang = sel.value;
                        localStorage.setItem('lp-lang', currentLang);
                        titleEl.textContent = getStr('roleTitle');
                        initRoleSelection();
                    });
                }
            }, 0);
        }

        container.innerHTML = '';
        roles.forEach(role => {
            const card = document.createElement('div');
            card.className = 'role-card';
            const shapeDiv = document.createElement('div');
            shapeDiv.className = `shape ${role.id}`;
            const name = document.createElement('h3');
            name.textContent = role.name;
            const desc = document.createElement('p');
            desc.textContent = role.desc;
            card.appendChild(shapeDiv);
            card.appendChild(name);
            card.appendChild(desc);
            card.addEventListener('click', () => startGame(role.id, savedProfile));
            container.appendChild(card);
        });
    });
}

async function startGame(roleId, savedProfile) {
    document.getElementById('role-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    const body = { role: roleId };
    if (savedProfile) body.profile = savedProfile;

    const res = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    gameId = data.gameId;
    state = data.state;
    updateHUD();
    draw();

    pollInterval = setInterval(sendUpdate, 1000 / 30);
}

function restartGame() {
    document.getElementById('game-over-modal').style.display = 'none';
    document.getElementById('npc-modal').style.display = 'none';
    document.getElementById('shop-modal').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('role-selection').style.display = 'block';
    state = null;
    gameId = null;
    spellActive = false;
    commandActive = false;
    const oldBanner = document.getElementById('profile-banner');
    if (oldBanner) oldBanner.remove();
    const container = document.getElementById('role-options');
    container.innerHTML = '';
    const oldCards = container.querySelectorAll('.role-card');
    oldCards.forEach(c => c.remove());
    initRoleSelection();
}

document.addEventListener('keydown', (e) => {
    if (spellActive) return;
    keys[e.key.toLowerCase()] = true;

    if (e.key === 'Enter' && !commandActive) {
        commandActive = true;
        document.getElementById('command-input-area').style.display = 'block';
        document.getElementById('command-input').focus();
    }
    if (e.key === 'Escape' && commandActive) {
        commandActive = false;
        document.getElementById('command-input-area').style.display = 'none';
        document.getElementById('command-input').value = '';
    }
    if (e.key === '-' && !commandActive) {
        openShop();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener('click', () => {
    if (state && state.running && !commandActive && !spellActive) {
        sendAction('attack', { mouseX, mouseY });
    }
});

document.getElementById('command-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = document.getElementById('command-input').value.trim().toLowerCase();
        if (cmd === '/super') {
            sendAction('super');
        } else if (cmd === '/shop') {
            openShop();
        } else if (cmd === '/talk' && state && state.nearNpc) {
            closeNpcModal();
        }
        commandActive = false;
        document.getElementById('command-input-area').style.display = 'none';
        document.getElementById('command-input').value = '';
    }
});

document.getElementById('spell-submit').addEventListener('click', submitSpell);
document.getElementById('spell-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitSpell();
});
document.getElementById('restart-btn').addEventListener('click', restartGame);
document.getElementById('npc-next-btn').addEventListener('click', () => {
    sendAction('interact_npc');
});
document.getElementById('shop-close-btn').addEventListener('click', () => {
    document.getElementById('shop-modal').style.display = 'none';
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('shop-modal').style.display = 'none';
        document.getElementById('npc-modal').style.display = 'none';
    }
});

initRoleSelection();
