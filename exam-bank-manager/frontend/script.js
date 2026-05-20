let currentUser = null;
let currentPage = 1;
let editingFileId = null;

const authPage = document.getElementById('auth-page');
const dashboardPage = document.getElementById('dashboard-page');
const loadingSpinner = document.getElementById('loading-spinner');

function showLoading(show) {
  loadingSpinner.classList.toggle('hidden', !show);
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.classList.toggle('visible', !!message);
}

function switchPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  page.classList.add('active');
}

function switchSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`section-${sectionId}`).classList.add('active');
  document.querySelector(`.nav-item[data-section="${sectionId}"]`).classList.add('active');
}

async function apiCall(endpoint, options = {}) {
  const token = await firebase.auth().currentUser?.getIdToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '請求失敗' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    showLoading(true);
    try {
      const data = await apiCall('/auth/me');
      renderDashboard(data.user);
      switchPage(dashboardPage);
    } catch (err) {
      console.error('Failed to load user data:', err);
      switchPage(dashboardPage);
    } finally {
      showLoading(false);
    }
  } else {
    currentUser = null;
    switchPage(authPage);
  }
});

document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
    showError('login-error', '');
    showError('register-error', '');
  });
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  showError('login-error', '');
  showLoading(true);
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (err) {
    const msg = err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
      ? '帳號或密碼錯誤' : err.code === 'auth/invalid-email' ? '無效的電子郵件格式' : '登入失敗，請稍後再試';
    showError('login-error', msg);
  } finally {
    showLoading(false);
  }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  showError('register-error', '');
  showLoading(true);
  try {
    const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
    if (name && cred.user) {
      await cred.user.updateProfile({ displayName: name });
    }
  } catch (err) {
    const msg = err.code === 'auth/email-already-in-use' ? '此電子郵件已被註冊'
      : err.code === 'auth/weak-password' ? '密碼長度至少需 6 個字元'
      : err.code === 'auth/invalid-email' ? '無效的電子郵件格式' : '註冊失敗，請稍後再試';
    showError('register-error', msg);
  } finally {
    showLoading(false);
  }
});

document.getElementById('google-login-btn').addEventListener('click', async () => {
  showLoading(true);
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
  } catch (err) {
    console.error('Google login error:', err);
    showError('login-error', 'Google 登入失敗: ' + (err.code || err.message));
  } finally {
    showLoading(false);
  }
});

document.getElementById('logout-btn').addEventListener('click', async () => {
  await firebase.auth().signOut();
});

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    switchSection(item.dataset.section);
    if (item.dataset.section === 'files') loadFiles();
    if (item.dataset.section === 'profile') renderProfile();
  });
});

async function renderDashboard(userData) {
  const name = currentUser.displayName || userData.display_name || userData.email.split('@')[0];
  document.getElementById('user-display-name').textContent = name;
  renderProfile();
  loadFiles();
}

function renderProfile() {
  if (!currentUser) return;
  const name = currentUser.displayName || '使用者';
  const initial = name.charAt(0).toUpperCase();
  document.getElementById('profile-avatar').textContent = initial;
  document.getElementById('profile-name').textContent = name;
  document.getElementById('profile-email').textContent = currentUser.email;
  document.getElementById('profile-joined').textContent = currentUser.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('zh-TW') : '未知';
}

async function loadFiles() {
  const grid = document.getElementById('files-grid');
  const pagination = document.getElementById('files-pagination');
  showLoading(true);
  try {
    const subject = document.getElementById('filter-subject').value;
    const params = new URLSearchParams({ page: currentPage, limit: 12 });
    if (subject) params.set('subject', subject);

    const data = await apiCall(`/files?${params}`);
    renderFiles(data);
    renderPagination(data, pagination, (page) => { currentPage = page; loadFiles(); });
  } catch (err) {
    grid.innerHTML = `<div class="empty-state"><h3>載入失敗</h3><p>${err.message}</p></div>`;
  } finally {
    showLoading(false);
  }
}

function renderFiles(data) {
  const grid = document.getElementById('files-grid');
  if (!data.files.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/></svg>
        <h3>尚無題庫</h3>
        <p>點擊左側「建立題庫」來建立您的第一個題庫</p>
      </div>`;
    return;
  }

  const subjectMap = { chinese: '國文', english: '英文', math: '數學', science: '自然', social: '社會', other: '其他' };
  const gradeMap = { grade1: '一年級', grade2: '二年級', grade3: '三年級', grade4: '四年級', grade5: '五年級', grade6: '六年級' };
  const typeMap = { choice: '選擇題', fill: '填充題', essay: '問答題', mixed: '混合題型' };

  grid.innerHTML = data.files.map(f => `
    <div class="file-card" data-id="${f.id}">
      <div class="file-card-header">
        <div class="file-card-title">${escapeHtml(f.filename)}</div>
        <span class="file-tag ${f.status === 'published' ? 'status-published' : 'status-draft'}">${f.status === 'published' ? '已發布' : '草稿'}</span>
      </div>
      <div class="file-card-tags">
        ${f.subject ? `<span class="file-tag subject">${subjectMap[f.subject] || f.subject}</span>` : ''}
        ${f.grade ? `<span class="file-tag grade">${gradeMap[f.grade] || f.grade}</span>` : ''}
        <span class="file-tag type">${typeMap[f.file_type] || f.file_type}</span>
      </div>
      ${f.description ? `<p style="font-size:13px;color:var(--text-secondary);margin-bottom:8px;">${escapeHtml(f.description)}</p>` : ''}
      <div class="file-card-meta">
        <span>題目數：${f.total_questions || 0}</span>
        <span>更新：${new Date(f.updated_at).toLocaleDateString('zh-TW')}</span>
      </div>
      <div class="file-card-actions">
        <button class="btn btn-secondary btn-sm edit-file-btn" data-id="${f.id}">編輯</button>
        <button class="btn btn-outline btn-sm view-file-btn" data-id="${f.id}">檢視</button>
        <button class="btn btn-danger btn-sm delete-file-btn" data-id="${f.id}">刪除</button>
      </div>
    </div>
  `).join('');
}

function renderPagination(data, container, onPageChange) {
  if (data.totalPages <= 1) { container.innerHTML = ''; return; }
  let html = '';
  html += `<button ${data.page <= 1 ? 'disabled' : ''} data-page="${data.page - 1}">上一頁</button>`;
  for (let i = 1; i <= data.totalPages; i++) {
    html += `<button class="${i === data.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  html += `<button ${data.page >= data.totalPages ? 'disabled' : ''} data-page="${data.page + 1}">下一頁</button>`;
  container.innerHTML = html;
  container.querySelectorAll('button:not(:disabled)').forEach(btn => {
    btn.addEventListener('click', () => onPageChange(parseInt(btn.dataset.page)));
  });
}

document.getElementById('refresh-files-btn').addEventListener('click', () => { currentPage = 1; loadFiles(); });
document.getElementById('filter-subject').addEventListener('change', () => { currentPage = 1; loadFiles(); });

document.getElementById('files-grid').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.classList.contains('edit-file-btn')) openEditModal(id);
  if (btn.classList.contains('view-file-btn')) openEditModal(id);
  if (btn.classList.contains('delete-file-btn')) deleteFile(id);
});

let questionCounter = 0;
let editQuestionCounter = 0;

document.getElementById('add-question-btn').addEventListener('click', () => {
  addQuestionToContainer('questions-container', ++questionCounter);
});

document.getElementById('edit-add-question-btn').addEventListener('click', () => {
  addQuestionToContainer('edit-questions-container', ++editQuestionCounter);
});

function addQuestionToContainer(containerId, index, data = null) {
  const container = document.getElementById(containerId);
  const div = document.createElement('div');
  div.className = 'question-item';
  div.dataset.index = index;

  const questionText = data ? escapeHtml(data.question || '') : '';
  const fileType = data ? (data.type || 'choice') : 'choice';
  const answer = data ? (data.answer || '') : '';

  let optionsHtml = '';
  if (fileType === 'choice' || !data) {
    const opts = data?.options || ['', '', '', ''];
    optionsHtml = `
      <div class="options-container">
        ${opts.map((opt, i) => `
          <div class="option-row">
            <input type="radio" name="q-${index}-correct" value="${String.fromCharCode(65 + i)}" ${answer === String.fromCharCode(65 + i) ? 'checked' : ''}>
            <input type="text" placeholder="選項 ${String.fromCharCode(65 + i)}" value="${escapeHtml(opt)}" class="option-input">
          </div>
        `).join('')}
      </div>`;
  }

  div.innerHTML = `
    <div class="question-item-header">
      <span class="question-number">第 ${index} 題</span>
      <button type="button" class="question-remove">&times;</button>
    </div>
    <textarea placeholder="輸入題目內容..." class="question-text">${questionText}</textarea>
    <div style="display:flex;gap:8px;margin-bottom:8px;align-items:center;">
      <label style="font-size:13px;font-weight:500;">題型：
        <select class="question-type-select" style="padding:4px 8px;border:1px solid var(--border);border-radius:4px;font-size:13px;">
          <option value="choice" ${fileType === 'choice' ? 'selected' : ''}>選擇題</option>
          <option value="fill" ${fileType === 'fill' ? 'selected' : ''}>填充題</option>
          <option value="essay" ${fileType === 'essay' ? 'selected' : ''}>問答題</option>
        </select>
      </label>
      ${fileType === 'fill' || fileType === 'essay' ? '' : ''}
    </div>
    <div class="options-section">${optionsHtml}</div>
    ${fileType !== 'choice' ? `<div style="margin-top:8px;"><input type="text" placeholder="答案" value="${escapeHtml(answer)}" class="answer-input" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:14px;"></div>` : ''}
  `;

  const removeBtn = div.querySelector('.question-remove');
  removeBtn.addEventListener('click', () => div.remove());

  const typeSelect = div.querySelector('.question-type-select');
  typeSelect.addEventListener('change', () => {
    const optionsSection = div.querySelector('.options-section');
    const answerDiv = div.querySelector('.answer-input')?.parentElement;
    if (typeSelect.value === 'choice') {
      optionsSection.innerHTML = `
        <div class="options-container">
          ${['A','B','C','D'].map((ch, i) => `
            <div class="option-row">
              <input type="radio" name="q-${index}-correct" value="${ch}">
              <input type="text" placeholder="選項 ${ch}" class="option-input">
            </div>
          `).join('')}
        </div>`;
      if (answerDiv) answerDiv.remove();
    } else {
      optionsSection.innerHTML = '';
      if (!answerDiv) {
        const inp = document.createElement('div');
        inp.style.marginTop = '8px';
        inp.innerHTML = '<input type="text" placeholder="答案" class="answer-input" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius);font-size:14px;">';
        div.appendChild(inp);
      }
    }
  });

  container.appendChild(div);
}

document.getElementById('create-file-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  await saveFile('published');
});

document.getElementById('save-draft-btn').addEventListener('click', async () => {
  await saveFile('draft');
});

async function saveFile(status) {
  const filename = document.getElementById('create-filename').value.trim();
  if (!filename) { alert('請輸入題庫名稱'); return; }

  const questions = collectQuestions('questions-container');
  const fileType = document.querySelector('input[name="fileType"]:checked')?.value || 'mixed';

  showLoading(true);
  try {
    await apiCall('/files', {
      method: 'POST',
      body: JSON.stringify({
        filename,
        description: document.getElementById('create-description').value.trim(),
        subject: document.getElementById('create-subject').value,
        grade: document.getElementById('create-grade').value,
        fileType,
        questions: questions.length > 0 ? questions : undefined,
        status
      })
    });
    document.getElementById('create-file-form').reset();
    document.getElementById('questions-container').innerHTML = '';
    questionCounter = 0;
    alert('題庫已儲存成功！');
    switchSection('files');
    loadFiles();
  } catch (err) {
    alert('儲存失敗：' + err.message);
  } finally {
    showLoading(false);
  }
}

function collectQuestions(containerId) {
  const items = document.querySelectorAll(`#${containerId} .question-item`);
  return Array.from(items).map(item => {
    const type = item.querySelector('.question-type-select')?.value || 'choice';
    const question = item.querySelector('.question-text')?.value || '';
    if (!question.trim()) return null;

    const q = { question: question.trim(), type };

    if (type === 'choice') {
      const opts = item.querySelectorAll('.option-row');
      q.options = Array.from(opts).map(row => row.querySelector('.option-input')?.value || '');
      q.answer = item.querySelector(`input[name="${item.querySelector('input[name$="-correct"]')?.name}"]:checked`)?.value || '';
    } else {
      q.answer = item.querySelector('.answer-input')?.value || '';
    }
    return q;
  }).filter(Boolean);
}

async function openEditModal(id) {
  editingFileId = id;
  showLoading(true);
  try {
    const data = await apiCall(`/files/${id}`);
    const file = data.file;
    document.getElementById('edit-modal-title').textContent = `編輯：${file.filename}`;
    document.getElementById('edit-filename').value = file.filename || '';
    document.getElementById('edit-subject').value = file.subject || '';
    document.getElementById('edit-grade').value = file.grade || '';
    document.getElementById('edit-description').value = file.description || '';

    const container = document.getElementById('edit-questions-container');
    container.innerHTML = '';
    editQuestionCounter = 0;

    if (data.questions && data.questions.length > 0) {
      data.questions.forEach(q => addQuestionToContainer('edit-questions-container', ++editQuestionCounter, q));
    }

    document.getElementById('edit-modal').classList.add('active');
  } catch (err) {
    alert('載入失敗：' + err.message);
  } finally {
    showLoading(false);
  }
}

document.getElementById('edit-modal-close').addEventListener('click', () => {
  document.getElementById('edit-modal').classList.remove('active');
  editingFileId = null;
});

document.getElementById('edit-modal-cancel').addEventListener('click', () => {
  document.getElementById('edit-modal').classList.remove('active');
  editingFileId = null;
});

document.getElementById('edit-modal-save').addEventListener('click', async () => {
  if (!editingFileId) return;
  const filename = document.getElementById('edit-filename').value.trim();
  if (!filename) { alert('請輸入題庫名稱'); return; }

  const questions = collectQuestions('edit-questions-container');

  showLoading(true);
  try {
    await apiCall(`/files/${editingFileId}`, {
      method: 'PUT',
      body: JSON.stringify({
        filename,
        description: document.getElementById('edit-description').value.trim(),
        subject: document.getElementById('edit-subject').value,
        grade: document.getElementById('edit-grade').value,
        questions: questions.length > 0 ? questions : undefined
      })
    });
    document.getElementById('edit-modal').classList.remove('active');
    editingFileId = null;
    loadFiles();
  } catch (err) {
    alert('儲存失敗：' + err.message);
  } finally {
    showLoading(false);
  }
});

async function deleteFile(id) {
  if (!confirm('確定要刪除此題庫嗎？此操作無法復原。')) return;
  showLoading(true);
  try {
    await apiCall(`/files/${id}`, { method: 'DELETE' });
    loadFiles();
  } catch (err) {
    alert('刪除失敗：' + err.message);
  } finally {
    showLoading(false);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener('contextmenu', e => e.preventDefault());

addQuestionToContainer('questions-container', ++questionCounter);
