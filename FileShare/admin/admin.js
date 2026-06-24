const API = 'http://localhost:8080/api';

const statusDot  = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

// ── Utils ─────────────────────────────────────────────

function fmtSize(bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + units[i];
}

function fmtTime(iso) {
    if (!iso || iso === '-') return '-';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleString('zh-TW', { hour12: false });
}

function mimeCategory(mime = '') {
    if (!mime) return 'other';
    if (mime.startsWith('image/')) return 'img';
    if (mime.startsWith('video/')) return 'video';
    if (['application/pdf','application/msword',
         'application/vnd.openxmlformats',
         'text/'].some(p => mime.startsWith(p))) return 'doc';
    return 'other';
}

const categoryLabel = { img: '圖片', video: '影片', doc: '文件', other: '其他' };

function setStatus(ok, msg) {
    statusDot.className = ok ? 'ok' : 'err';
    statusText.textContent = msg;
}

// ── Stats ─────────────────────────────────────────────

async function loadStats() {
    try {
        const res = await fetch(`${API}/stats`);
        if (!res.ok) throw new Error(res.status);
        const d = await res.json();
        document.getElementById('stat-files').textContent     = d.file_count.toLocaleString();
        document.getElementById('stat-size').textContent      = fmtSize(d.total_size);
        document.getElementById('stat-shares').textContent    = d.active_share_count.toLocaleString();
        document.getElementById('stat-members').textContent   = d.member_count.toLocaleString();
        document.getElementById('stat-pageviews').textContent = (d.pageviews || 0).toLocaleString();
        setStatus(true, '已連接');
    } catch {
        setStatus(false, '無法連接後台');
        document.querySelectorAll('.stat-value').forEach(el => el.textContent = '?');
    }
}

// ── Files ─────────────────────────────────────────────

async function loadFiles() {
    const loading = document.getElementById('files-loading');
    const table   = document.getElementById('files-table');
    const tbody   = document.getElementById('files-tbody');
    const count   = document.getElementById('files-count');

    loading.style.display = 'flex';
    table.style.display = 'none';
    tbody.innerHTML = '';

    try {
        const res = await fetch(`${API}/files`);
        const d = await res.json();
        const files = d.files || [];

        count.textContent = `共 ${files.length} 筆`;

        if (files.length === 0) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="6">尚無上傳記錄</td></tr>';
        } else {
            files.forEach(f => {
                const cat = mimeCategory(f.mime_type);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><div class="file-name" title="${f.original_name}">${f.original_name}</div></td>
                    <td>${fmtSize(f.file_size)}</td>
                    <td><span class="badge badge-${cat}">${categoryLabel[cat]}</span></td>
                    <td>${fmtTime(f.created_at)}</td>
                    <td style="text-align:center">${f.download_count ?? 0}</td>
                    <td><button class="btn-delete-file" data-id="${f.id}" data-name="${f.original_name}">🗑 刪除</button></td>
                `;
                tbody.appendChild(row);
            });
        }

        loading.style.display = 'none';
        table.style.display = 'table';
    } catch {
        loading.innerHTML = '<span style="color:var(--error)">載入失敗，請確認後台正在執行</span>';
    }
}

// ── Members ───────────────────────────────────────────

async function loadMembers() {
    const loading = document.getElementById('members-loading');
    const table   = document.getElementById('members-table');
    const tbody   = document.getElementById('members-tbody');
    const count   = document.getElementById('members-count');

    loading.style.display = 'flex';
    table.style.display = 'none';
    tbody.innerHTML = '';

    try {
        const res = await fetch(`${API}/members`);
        const d = await res.json();
        const members = d.members || [];

        count.textContent = `共 ${members.length} 位`;

        if (members.length === 0) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="3">尚無會員</td></tr>';
        } else {
            members.forEach(m => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="font-family:monospace;font-size:11px;color:var(--muted)">${m.uid}</td>
                    <td>${m.email || '-'}</td>
                    <td>${fmtTime(m.since)}</td>
                `;
                tbody.appendChild(row);
            });
        }

        loading.style.display = 'none';
        table.style.display = 'table';
    } catch {
        loading.innerHTML = '<span style="color:var(--error)">載入失敗</span>';
    }
}

// ── Tabs ─────────────────────────────────────────────

const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const panelId = btn.dataset.panel;
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById(`panel-${panelId}`).classList.add('active');
        if (panelId === 'members') loadMembers();
    });
});

// ── Refresh ───────────────────────────────────────────

async function refreshAll() {
    await loadStats();
    const activePanel = document.querySelector('.tab-btn.active')?.dataset.panel;
    if (activePanel === 'members') {
        await loadMembers();
    } else {
        await loadFiles();
    }
}

document.getElementById('btn-refresh').addEventListener('click', refreshAll);

// ── Delete（一次綁定，事件委派）────────────────────────

document.getElementById('files-tbody').addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-delete-file');
    if (!btn) return;

    const fileId   = btn.dataset.id;
    const fileName = btn.dataset.name;

    if (!confirm(`確定要刪除「${fileName}」？\n此操作無法還原。`)) return;

    btn.disabled = true;
    btn.textContent = '刪除中...';

    try {
        const res  = await fetch(`${API}/files/${fileId}`, { method: 'DELETE' });
        const data = await res.json();

        if (res.ok) {
            const row = btn.closest('tr');
            row.style.transition = 'opacity 0.3s';
            row.style.opacity = '0';
            setTimeout(() => {
                const tbody = document.getElementById('files-tbody');
                const count = document.getElementById('files-count');
                row.remove();
                const remaining = tbody.querySelectorAll('tr:not(.empty-row)').length;
                count.textContent = `共 ${remaining} 筆`;
                if (remaining === 0) {
                    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">尚無上傳記錄</td></tr>';
                }
            }, 300);
            loadStats();
        } else {
            alert(data.error || '刪除失敗');
            btn.disabled = false;
            btn.textContent = '🗑 刪除';
        }
    } catch {
        alert('無法連接後台');
        btn.disabled = false;
        btn.textContent = '🗑 刪除';
    }
});

// ── Init ─────────────────────────────────────────────

refreshAll();
