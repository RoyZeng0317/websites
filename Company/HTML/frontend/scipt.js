const QR_IMG = document.getElementById('qrcode-img');
const INTERVAL = 15;

function refreshQR() {
    QR_IMG.src = '/qrcode?' + Date.now();
}

refreshQR();
setInterval(refreshQR, INTERVAL * 1000);