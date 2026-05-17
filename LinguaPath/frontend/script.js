function profile(event) {
    event.preventDefault();
    document.querySelector('.profile').classList.toggle('active');
}
function edit(event) {
    event.preventDefault();
    document.querySelector('.pro-preview').style.display = 'none';
    document.querySelector('.pro-edit').style.display = 'flex';
}

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