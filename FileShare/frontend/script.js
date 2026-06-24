import { auth, db, googleProvider } from './firebaseconfig.js';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api';

// 頁面瀏覽量計數（靜默失敗）
fetch(API_BASE + '/pageview', { method: 'POST' }).catch(() => {});

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const folderInput = document.getElementById('folder-input');
const fileInfo = document.getElementById('file-info');
const fileName = document.getElementById('file-name');
const fileSize = document.getElementById('file-size');
const btnRemove = document.getElementById('btn-remove');
const btnUpload = document.getElementById('btn-upload');
const uploadResult = document.getElementById('upload-result');
const uploadError = document.getElementById('upload-error');
const uploadErrorMsg = document.getElementById('upload-error-msg');
const uploadPassword = document.getElementById('upload-password');
const btnCopy = document.getElementById('btn-copy');
const shareUrl = document.getElementById('share-url');
const btnCopyLink = document.getElementById('btn-copy-link');
const uploadToggles = document.querySelectorAll('.upload-toggle');

const downloadPassword = document.getElementById('download-password');
const btnDownload = document.getElementById('btn-download');
const downloadError = document.getElementById('download-error');
const downloadErrorMsg = document.getElementById('download-error-msg');
const downloadLoading = document.getElementById('download-loading');

const linkUrl = document.getElementById('link-url');
const btnUploadLink = document.getElementById('btn-upload-link');
const uploadLinkError = document.getElementById('upload-link-error');
const uploadLinkErrorMsg = document.getElementById('upload-link-error-msg');

const downloadLinkInput = document.getElementById('download-link-input');
const btnDownloadLink = document.getElementById('btn-download-link');
const downloadLinkError = document.getElementById('download-link-error');
const downloadLinkErrorMsg = document.getElementById('download-link-error-msg');

const timerRadios = document.querySelectorAll('input[name="expires_in"]');
const customMinutes = document.getElementById('custom-minutes');
const countdownBox = document.getElementById('countdown-box');
const countdownTime = document.getElementById('countdown-time');
const modeRadios = document.querySelectorAll('input[name="download_mode"]');
const dlModeHint = document.getElementById('dl-mode-hint');
const modeHints = { '1': '下載一次後連結自動失效', '0': '在有效時間內可無限次下載' };

const memberModal = document.getElementById('member-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnGoogleSignin = document.getElementById('btn-google-signin');
const paywallStatus = document.getElementById('paywall-status');
const userBar = document.getElementById('user-bar');
const userEmail = document.getElementById('user-email');
const btnSignout = document.getElementById('btn-signout');
const btnDeleteShare = document.getElementById('btn-delete-share');

let selectedFile = null;
let selectedFiles = null;
let isFolderMode = false;
let countdownInterval = null;
let currentShareId = null;
let isMember = false;

const MEMBER_TIMER_VALUES = ['900', '1800'];

// ── Member Modal ──────────────────────────────────────
function showMemberModal(msg = '') {
    memberModal.hidden = false;
    paywallStatus.textContent = msg;
}

function hideMemberModal() {
    memberModal.hidden = true;
}

btnCloseModal.addEventListener('click', hideMemberModal);
memberModal.addEventListener('click', (e) => {
    if (e.target === memberModal) hideMemberModal();
});

// ── Auth State (非阻塞，僅更新狀態) ─────────────────────
onAuthStateChanged(auth, async (user) => {
    if (user) {
        userBar.hidden = false;
        userEmail.textContent = user.email;
        paywallStatus.textContent = '驗證中...';
        try {
            const snap = await getDoc(doc(db, 'members', user.uid));
            isMember = snap.exists();
            paywallStatus.textContent = isMember
                ? '✓ 已開通會員'
                : `已登入，尚未開通會員資格，請等待管理員開通。`;
        } catch {
            isMember = false;
        }
    } else {
        userBar.hidden = true;
        isMember = false;
    }
});

btnGoogleSignin.addEventListener('click', async () => {
    btnGoogleSignin.disabled = true;
    paywallStatus.textContent = '登入中...';
    try {
        await signInWithPopup(auth, googleProvider);
        hideMemberModal();
    } catch {
        paywallStatus.textContent = '登入失敗，請重試。';
        btnGoogleSignin.disabled = false;
    }
});

btnSignout.addEventListener('click', () => signOut(auth));

timerRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        customMinutes.disabled = radio.value !== 'custom';
        if (radio.value === 'custom') customMinutes.focus();
    });
});

customMinutes.addEventListener('input', () => {
    const v = parseInt(customMinutes.value, 10);
    if (v > 30) customMinutes.value = 30;
    if (v < 1) customMinutes.value = 1;
});

// 下載次數模式切換
modeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        document.querySelectorAll('.dl-mode-option').forEach(o => o.classList.remove('active'));
        radio.closest('.dl-mode-option').classList.add('active');
        dlModeHint.textContent = modeHints[radio.value] || '';
    });
});

function getMaxDownloads() {
    const checked = document.querySelector('input[name="download_mode"]:checked');
    return checked ? parseInt(checked.value, 10) : 1;
}

// 攔截 15/30 分鐘選項，非會員則顯示升級 modal
timerRadios.forEach(radio => {
    if (MEMBER_TIMER_VALUES.includes(radio.value)) {
        radio.addEventListener('click', (e) => {
            if (!isMember) {
                e.preventDefault();
                showMemberModal();
            }
        });
    }
});

document.addEventListener('click', (e) => {
    if (e.target === customMinutes) {
        document.querySelector('input[name="expires_in"][value="custom"]').checked = true;
        customMinutes.disabled = false;
    }
});

function getExpiresIn() {
    const checked = document.querySelector('input[name="expires_in"]:checked');
    if (!checked) return 60;
    if (checked.value === 'custom') {
        const minutes = Math.min(parseInt(customMinutes.value, 10) || 1, 30);
        return minutes * 60;
    }
    return parseInt(checked.value, 10);
}

function formatCountdown(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function startCountdown(expiresIn) {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownBox.hidden = false;
    const endTime = Date.now() + expiresIn * 1000;

    function tick() {
        const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
        countdownTime.textContent = formatCountdown(remaining);

        if (remaining <= 0) {
            clearInterval(countdownInterval);
            countdownTime.textContent = '已過期';
        }
    }

    tick();
    countdownInterval = setInterval(tick, 1000);
}

uploadToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        uploadToggles.forEach(t => t.classList.remove('active'));
        toggle.classList.add('active');
        isFolderMode = toggle.dataset.mode === 'folder';
        selectedFile = null;
        selectedFiles = null;
        fileInfo.hidden = true;
        btnUpload.disabled = true;
        uploadResult.hidden = true;
        uploadError.hidden = true;
        if (isFolderMode) {
            folderInput.click();
        } else {
            fileInput.click();
        }
    });
});

const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(tab.dataset.tab + '-section').classList.add('active');

        selectedFile = null;
        selectedFiles = null;
        fileInput.value = '';
        folderInput.value = '';
        fileInfo.hidden = true;
        btnUpload.disabled = true;
        uploadResult.hidden = true;
        uploadError.hidden = true;
        downloadError.hidden = true;
        downloadLoading.hidden = true;
        uploadLinkError.hidden = true;
        downloadLinkError.hidden = true;
        if (countdownInterval) clearInterval(countdownInterval);
    });
});

dropZone.addEventListener('click', () => {
    document.querySelector('.upload-toggle.active').click();
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    if (files.length > 1 || files[0].webkitRelativePath) {
        handleFolderSelect(files);
    } else {
        handleFileSelect(files[0]);
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        handleFileSelect(fileInput.files[0]);
    }
});

folderInput.addEventListener('change', () => {
    if (folderInput.files.length > 0) {
        handleFolderSelect(folderInput.files);
    }
});

function handleFileSelect(file) {
    isFolderMode = false;
    selectedFile = file;
    selectedFiles = null;
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.hidden = false;
    btnUpload.disabled = false;
    uploadResult.hidden = true;
    uploadError.hidden = true;
    countdownBox.hidden = true;
}

function handleFolderSelect(files) {
    isFolderMode = true;
    selectedFiles = files;
    selectedFile = null;

    const folderName = files[0].webkitRelativePath.split('/')[0];
    let totalSize = 0;
    for (const f of files) {
        totalSize += f.size;
    }

    fileName.textContent = folderName + '/';
    fileSize.textContent = files.length + ' 個檔案，總計 ' + formatFileSize(totalSize);
    fileInfo.hidden = false;
    btnUpload.disabled = false;
    uploadResult.hidden = true;
    uploadError.hidden = true;
    countdownBox.hidden = true;
}

btnRemove.addEventListener('click', () => {
    selectedFile = null;
    selectedFiles = null;
    fileInput.value = '';
    folderInput.value = '';
    fileInfo.hidden = true;
    btnUpload.disabled = true;
    uploadResult.hidden = true;
    uploadError.hidden = true;
    countdownBox.hidden = true;
    if (countdownInterval) clearInterval(countdownInterval);
});

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

btnUpload.addEventListener('click', async () => {
    if (!selectedFile && !selectedFiles) return;

    btnUpload.disabled = true;
    btnUpload.textContent = '上傳中...';
    uploadResult.hidden = true;
    uploadError.hidden = true;

    try {
        let response;

        if (isFolderMode) {
            const formData = new FormData();
            for (const file of selectedFiles) {
                formData.append('files', file, file.webkitRelativePath);
            }
            formData.append('expires_in', getExpiresIn());
            formData.append('max_downloads', getMaxDownloads());
            response = await fetch(API_BASE + '/upload-folder', {
                method: 'POST',
                body: formData,
            });
        } else {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('expires_in', getExpiresIn());
            formData.append('max_downloads', getMaxDownloads());
            response = await fetch(API_BASE + '/upload', {
                method: 'POST',
                body: formData,
            });
        }

        const data = await response.json();

        if (response.ok) {
            currentShareId = data.share_id || null;
            uploadPassword.textContent = data.password;
            shareUrl.textContent = window.location.origin + '/?password=' + data.password;
            uploadResult.hidden = false;
            startCountdown(data.expires_in);
        } else {
            uploadErrorMsg.textContent = data.error || '上傳失敗';
            uploadError.hidden = false;
        }
    } catch (err) {
        uploadErrorMsg.textContent = '無法連接到伺服器，請確認後端已啟動';
        uploadError.hidden = false;
    } finally {
        btnUpload.disabled = false;
        btnUpload.textContent = '上傳檔案';
    }
});

async function copyToClipboard(text, button, originalText) {
    try {
        await navigator.clipboard.writeText(text);
        button.textContent = '已複製!';
        button.classList.add('copied');
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    } catch {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        button.textContent = '已複製!';
        button.classList.add('copied');
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }
}

btnDeleteShare.addEventListener('click', async () => {
    if (!currentShareId) return;
    if (!confirm('確定要刪除此分享連結嗎？刪除後無法還原。')) return;
    btnDeleteShare.disabled = true;
    btnDeleteShare.textContent = '刪除中...';
    try {
        const res = await fetch(`${API_BASE}/share/${currentShareId}`, { method: 'DELETE' });
        if (res.ok) {
            uploadResult.hidden = true;
            currentShareId = null;
            if (countdownInterval) clearInterval(countdownInterval);
            showToast('分享連結已成功刪除');
        } else {
            const data = await res.json();
            showToast(data.error || '刪除失敗');
        }
    } catch {
        showToast('無法連接到伺服器');
    } finally {
        btnDeleteShare.disabled = false;
        btnDeleteShare.textContent = '🗑 刪除連結';
    }
});

btnCopy.addEventListener('click', () => {
    copyToClipboard(uploadPassword.textContent, btnCopy, '複製');
});

btnCopyLink.addEventListener('click', () => {
    copyToClipboard(shareUrl.textContent, btnCopyLink, '複製連結');
});

btnUploadLink.addEventListener('click', uploadLink);

linkUrl.addEventListener('input', () => {
    uploadLinkError.hidden = true;
});

btnDownloadLink.addEventListener('click', downloadLink);

downloadLinkInput.addEventListener('input', () => {
    downloadLinkError.hidden = true;
});

downloadPassword.addEventListener('input', () => {
    btnDownload.disabled = downloadPassword.value.trim() === '';
    downloadError.hidden = true;
});

function getFilenameFromDisposition(contentDisposition) {
    if (!contentDisposition) return null;

    let match;

    match = contentDisposition.match(/filename\*=UTF-8''([^;\n]+)/i);
    if (match) return decodeURIComponent(match[1]);

    match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match) return match[1].replace(/['"]/g, '').trim();

    return null;
}

btnDownload.addEventListener('click', async () => {
    const password = downloadPassword.value.trim();
    if (!password) return;

    btnDownload.disabled = true;
    btnDownload.textContent = '驗證中...';
    downloadError.hidden = true;
    downloadLoading.hidden = false;

    try {
        const response = await fetch(API_BASE + '/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            const blob = await response.blob();
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = getFilenameFromDisposition(contentDisposition) || 'download';

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            downloadLoading.hidden = true;
            downloadPassword.value = '';
            btnDownload.disabled = true;
            showToast('檔案下載成功！');
        } else {
            downloadLoading.hidden = true;
            const data = await response.json();
            downloadErrorMsg.textContent = data.error || '下載失敗';
            downloadError.hidden = false;
        }
    } catch (err) {
        downloadLoading.hidden = true;
        downloadErrorMsg.textContent = '無法連接到伺服器，請確認後端已啟動';
        downloadError.hidden = false;
    } finally {
        btnDownload.disabled = false;
        btnDownload.textContent = '下載檔案';
    }
});

async function uploadLink() {
    const url = linkUrl.value.trim();
    if (!url) {
        uploadLinkErrorMsg.textContent = '請輸入檔案連結';
        uploadLinkError.hidden = false;
        return;
    }

    btnUploadLink.disabled = true;
    btnUploadLink.textContent = '處理中...';
    uploadLinkError.hidden = true;

    try {
        const response = await fetch(API_BASE + '/upload-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (response.ok) {
            showToast('連結上傳成功！');
            linkUrl.value = '';
        } else {
            uploadLinkErrorMsg.textContent = data.error || '上傳失敗';
            uploadLinkError.hidden = false;
        }
    } catch (err) {
        uploadLinkErrorMsg.textContent = '無法連接到伺服器';
        uploadLinkError.hidden = false;
    } finally {
        btnUploadLink.disabled = false;
        btnUploadLink.textContent = '上傳連結';
    }
}

async function downloadLink() {
    const link = downloadLinkInput.value.trim();
    if (!link) {
        downloadLinkErrorMsg.textContent = '請輸入下載連結';
        downloadLinkError.hidden = false;
        return;
    }

    btnDownloadLink.disabled = true;
    btnDownloadLink.textContent = '處理中...';
    downloadLinkError.hidden = true;

    try {
        const response = await fetch(API_BASE + '/download-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ link }),
        });

        if (response.ok) {
            const blob = await response.blob();
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = getFilenameFromDisposition(contentDisposition) || 'download';
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            downloadLinkInput.value = '';
        } else {
            const data = await response.json();
            downloadLinkErrorMsg.textContent = data.error || '下載失敗';
            downloadLinkError.hidden = false;
        }
    } catch (err) {
        downloadLinkErrorMsg.textContent = '無法連接到伺服器';
        downloadLinkError.hidden = false;
    } finally {
        btnDownloadLink.disabled = false;
        btnDownloadLink.textContent = '下載連結';
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--surface)',
        color: 'var(--font)',
        padding: '12px 24px',
        borderRadius: '8px',
        border: '1px solid var(--success)',
        zIndex: '1000',
        fontSize: '14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

document.addEventListener("contextmenu", function(e){
    e.preventDefault();
});

const params = new URLSearchParams(window.location.search);
const sharedPassword = params.get('password');
if (sharedPassword) {
    downloadPassword.value = sharedPassword;
    btnDownload.disabled = false;
    document.querySelector('.tab[data-tab="download"]').click();
    btnDownload.click();
}