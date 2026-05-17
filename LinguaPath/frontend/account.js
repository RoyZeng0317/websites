import { 
    auth, db, googleProvider as provider, 
    onAuthStateChanged, signOut, signInWithPopup, 
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    doc, getDoc
} from "./firebase-config.js";

const courses = [
    { id: "beginner-foundations", level: "Beginner", title: "Foundations of English", desc: "Master the alphabet, basic grammar, and everyday vocabulary. Perfect for complete beginners.", lessons: 8, badge: "popular", videoUrl: "https://www.youtube.com/playlist?list=PLF4D61E68A7F2A0B5" },
    { id: "everyday-conversations", level: "Elementary", title: "Everyday Conversations", desc: "Learn to introduce yourself, ask for directions, and navigate common social situations.", lessons: 7, badge: null, videoUrl: "" },
    { id: "grammar-essentials", level: "Intermediate", title: "Grammar Essentials", desc: "Deep dive into tenses, conditionals, and sentence structures that elevate your writing.", lessons: 9, badge: "new", videoUrl: "" },
    { id: "advanced-fluency", level: "Advanced", title: "Advanced Fluency", desc: "Idioms, nuance, academic writing, and presentation skills for professional contexts.", lessons: 8, badge: null, videoUrl: "" },
    { id: "skill-listening", level: "All Levels", title: "Listening", desc: "Develop your ability to understand spoken English from basic sounds to native-speed conversations.", lessons: 5, badge: "new", videoUrl: "" },
    { id: "skill-speaking", level: "All Levels", title: "Speaking", desc: "Build confidence in spoken English from first words to fluent conversation and public speaking.", lessons: 5, badge: "new", videoUrl: "" },
    { id: "skill-reading", level: "All Levels", title: "Reading", desc: "Learn to read English effectively from phonics and simple texts to academic papers and literature.", lessons: 5, badge: "new", videoUrl: "" },
    { id: "skill-writing", level: "All Levels", title: "Writing", desc: "Master written expression in English from forming letters to writing essays and professional documents.", lessons: 5, badge: "new", videoUrl: "" },
];

// Render courses
const grid = document.getElementById('courses-grid');
    courses.forEach(c => {
const card = document.createElement('a');
    card.href = `lesson.html?course=${c.id}`;
    card.className = 'course-card';
    card.dataset.courseId = c.id;
    card.innerHTML = `
        <div class="course-level">${c.level}</div>
        <div class="course-title">${c.title} ${c.badge ? `<span class="badge badge-${c.badge}">${c.badge}</span>` : ''}</div>
        <div class="course-desc">${c.desc}</div>
        <div class="course-meta">
        <span class="course-lessons">${c.lessons} lessons</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" id="prog-${c.id}" style="width:0%"></div></div>
        <div class="progress-label" id="prog-label-${c.id}">Not started</div>
    `;
    grid.appendChild(card);
});

// Auth state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        document.getElementById('auth-buttons').style.display = 'none';
        document.getElementById('user-info').style.display = 'flex';
        document.getElementById('user-name').textContent = user.displayName || user.email.split('@')[0];
    if (user.photoURL) document.getElementById('user-avatar').src = user.photoURL;
    else document.getElementById('user-avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName||'U')}&background=e8c97e&color=0d0f14`;
    // Load progress
    const snap = await getDoc(doc(db, 'progress', user.uid));
    const progress = snap.exists() ? snap.data() : {};
    if (snap.exists()) {
        courses.forEach(c => {
        const completed = progress[c.id] ? Object.keys(progress[c.id]).filter(k => progress[c.id][k]).length : 0;
        const pct = Math.round((completed / c.lessons) * 100);
        const fill = document.getElementById(`prog-${c.id}`);
        const label = document.getElementById(`prog-label-${c.id}`);
        if (fill) fill.style.width = pct + '%';
        if (label) label.textContent = pct === 0 ? 'Not started' : pct === 100 ? '✓ Completed' : `${pct}% complete`;
        });
    }

    } else {
        document.getElementById('auth-buttons').style.display = 'flex';
        document.getElementById('user-info').style.display = 'none';
    }
});

// Modal logic
const overlay = document.getElementById('modal-overlay');
let isSignUp = false;

function openModal(signup = false) {
isSignUp = signup;
    overlay.classList.add('active');
    document.getElementById('tab-signin').classList.toggle('active', !signup);
    document.getElementById('tab-signup').classList.toggle('active', signup);
    document.getElementById('modal-title').textContent = signup ? 'Create account' : 'Welcome back';
    document.getElementById('modal-subtitle').textContent = signup ? 'Start tracking your progress today' : 'Sign in to track your progress';
    document.getElementById('auth-submit').textContent = signup ? 'Create Account' : 'Sign In';
}

    document.getElementById('signin-btn').onclick = () => openModal(false);
    document.getElementById('signup-btn').onclick = () => openModal(true);
    document.getElementById('cta-btn').onclick = () => openModal(true);
    document.getElementById('modal-close').onclick = () => overlay.classList.remove('active');
    overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove('active'); };
    document.getElementById('tab-signin').onclick = () => openModal(false);
    document.getElementById('tab-signup').onclick = () => openModal(true);

    document.getElementById('logout-btn').onclick = () => signOut(auth);

    document.getElementById('google-btn').onclick = async () => {
    try { await signInWithPopup(auth, provider); overlay.classList.remove('active'); }
    catch(e) { showError(e.message); }
};

document.getElementById('auth-submit').onclick = async () => {
const email = document.getElementById('email-input').value;
const pass = document.getElementById('password-input').value;
    try {
        if (isSignUp) await createUserWithEmailAndPassword(auth, email, pass);
        else await signInWithEmailAndPassword(auth, email, pass);
        overlay.classList.remove('active');
    } catch(e) {
        showError(e.code === 'auth/wrong-password' ? 'Incorrect password.' :
                e.code === 'auth/user-not-found' ? 'No account found with this email.' :
                e.code === 'auth/email-already-in-use' ? 'Email already in use.' :
                e.code === 'auth/weak-password' ? 'Password must be at least 6 characters.' :
                e.message);
    }
};

function showError(msg) {
    const el = document.getElementById('auth-error');
    el.textContent = msg; el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 4000);
}