let isActive = false;
let intervalId = null;

const btn = document.getElementById('toggle-btn');
const icon = document.getElementById('toggle-icon');
const text = document.getElementById('toggle-text');
const container = document.getElementById('qrcode-container');
const img = document.getElementById('qrcode-img');
const status = document.getElementById('qrcode-status');

function toggleQR() {
    isActive = !isActive;

    if (isActive) {
        icon.textContent = '⏸';
        text.textContent = '開啟簽到';
        container.style.display = '';
        status.textContent = '掃描 QR Code 進行簽到';
        refreshQR();
        intervalId = setInterval(refreshQR, 15000);
    } else {
        icon.textContent = '▶';
        text.textContent = '打開簽到';
        container.style.display = 'none';
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }
}

function refreshQR() {
    img.src = '/qrcode?' + Date.now();
}
