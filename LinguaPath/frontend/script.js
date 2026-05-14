function profile(event) {
    event.preventDefault();
    document.querySelector('.profile').classList.toggle('active');
}
function edit(event) {
    event.preventDefault();
    document.querySelector('.pro-preview').style.display = 'none';
    document.querySelector('.pro-edit').style.display = 'flex';
}

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBh-ugjnWXOIFgaujjvEoHJ4jx_KfcXezU",
  authDomain: "english-language-platform.firebaseapp.com",
  projectId: "english-language-platform",
  storageBucket: "english-language-platform.firebasestorage.app",
  messagingSenderId: "398558443265",
  appId: "1:398558443265:web:7cca79b438a3994e9bcd00",
  measurementId: "G-MSNCYB2MTZ"
};

function themeToggle() {
    const themeIcon = document.querySelector('.theme-toggle-icon');
    document.body.classList.toggle('dark');

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    if (themeIcon) {
        themeIcon.textContent = isDark ? "🌙" : "☀️";
    }
}

// Initial theme check
function applyInitialTheme() {
    const savedTheme = localStorage.getItem("theme");
    const themeIcon = document.querySelector('.theme-toggle-icon');
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        if (themeIcon) themeIcon.textContent = "🌙";
    } else {
        document.body.classList.remove("dark");
        if (themeIcon) themeIcon.textContent = "☀️";
    }
}

document.addEventListener('DOMContentLoaded', applyInitialTheme);