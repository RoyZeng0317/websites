const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api';

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
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

const downloadPassword = document.getElementById('download-password');
const btnDownload = document.getElementById('btn-download');
const downloadError = document.getElementById('download-error');
const downloadErrorMsg = document.getElementById('download-error-msg');
const downloadLoading = document.getElementById('download-loading');

const timerRadios = document.querySelectorAll('input[name="expires_in"]');
const customMinutes = document.getElementById('custom-minutes');
const countdownBox = document.getElementById('countdown-box');
const countdownTime = document.getElementById('countdown-time');

let selectedFile = null;
let countdownInterval = null;

timerRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        customMinutes.disabled = radio.value !== 'custom';
        if (radio.value === 'custom') {
            customMinutes.focus();
        }
    });
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
        const minutes = parseInt(customMinutes.value, 10) || 1;
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

const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(tab.dataset.tab + '-section').classList.add('active');

        uploadResult.hidden = true;
        uploadError.hidden = true;
        downloadError.hidden = true;
        downloadLoading.hidden = true;
        if (countdownInterval) clearInterval(countdownInterval);
    });
});

dropZone.addEventListener('click', () => fileInput.click());

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
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        handleFileSelect(fileInput.files[0]);
    }
});

function handleFileSelect(file) {
    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.hidden = false;
    btnUpload.disabled = false;
    uploadResult.hidden = true;
    uploadError.hidden = true;
    countdownBox.hidden = true;
}

btnRemove.addEventListener('click', () => {
    selectedFile = null;
    fileInput.value = '';
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
    if (!selectedFile) return;

    btnUpload.disabled = true;
    btnUpload.textContent = '上傳中...';
    uploadResult.hidden = true;
    uploadError.hidden = true;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('expires_in', getExpiresIn());

    try {
        const response = await fetch(API_BASE + '/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            uploadPassword.textContent = data.password;
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

btnCopy.addEventListener('click', async () => {
    const password = uploadPassword.textContent;
    try {
        await navigator.clipboard.writeText(password);
        btnCopy.textContent = '已複製!';
        btnCopy.classList.add('copied');
        setTimeout(() => {
            btnCopy.textContent = '複製';
            btnCopy.classList.remove('copied');
        }, 2000);
    } catch {
        const textArea = document.createElement('textarea');
        textArea.value = password;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        btnCopy.textContent = '已複製!';
        btnCopy.classList.add('copied');
        setTimeout(() => {
            btnCopy.textContent = '複製';
            btnCopy.classList.remove('copied');
        }, 2000);
    }
});

downloadPassword.addEventListener('input', () => {
    btnDownload.disabled = downloadPassword.value.trim() === '';
    downloadError.hidden = true;
});

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
            let filename = 'download';
            if (contentDisposition) {
                const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match) filename = match[1].replace(/['"]/g, '');
            }

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
})