let currentSection = "menu";
let comments = [];
let particleCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Particles
    const pContainer = document.getElementById('particles');
    if (pContainer) {
        setInterval(() => {
            if (particleCount < 40) createParticle(pContainer);
        }, 500);
    }

    // Navigation
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', function() {
            const target = this.dataset.section;
            showSection(target);
            document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    loadComments();
    updateComments();
});

function createParticle(container) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 10 + 8) + 's';
    container.appendChild(p);
    particleCount++;
    setTimeout(() => { p.remove(); particleCount--; }, 15000);
}

function showSection(id) {
    const current = document.getElementById(currentSection);
    const next = document.getElementById(id);
    if (current) current.classList.remove("visible");
    if (next) {
        next.classList.add("visible");
        currentSection = id;
    }
}

// Accordion Logic: Closes others when one opens
function toggleDetails(card) {
    const alreadyOpen = card.classList.contains('flipped');
    document.querySelectorAll('.skill-card').forEach(c => c.classList.remove('flipped'));
    if (!alreadyOpen) card.classList.add('flipped');
}

// Comments Logic
function submitComment() {
    const u = document.getElementById("user");
    const m = document.getElementById("message");
    if (!u.value.trim() || !m.value.trim()) return;

    const newC = {
        id: Date.now(),
        user: u.value,
        msg: m.value,
        likes: 0,
        date: new Date().toLocaleDateString()
    };

    comments.unshift(newC);
    localStorage.setItem('portfolioComments', JSON.stringify(comments));
    u.value = ""; m.value = "";
    updateComments();
}

function likeComment(id) {
    const c = comments.find(x => x.id === id);
    if (c) {
        c.likes++;
        localStorage.setItem('portfolioComments', JSON.stringify(comments));
        updateComments();
    }
}

function updateComments() {
    const container = document.getElementById("recent-comments");
    if (!container) return;
    
    container.innerHTML = comments.map(c => `
        <div class="comment" style="background:rgba(255,255,255,0.05); padding:15px; margin-top:10px; border-radius:8px; border-left:4px solid #8B5CF6;">
            <div style="display:flex; justify-content:space-between; font-weight:bold; color:#8B5CF6;">
                <span>${c.user}</span> <small style="color:#aaa;">${c.date}</small>
            </div>
            <p style="margin:10px 0;">${c.msg}</p>
            <div onclick="likeComment(${c.id})" style="cursor:pointer; display:inline-block;">
                <i class="fas fa-heart" style="color:${c.likes > 0 ? '#8B5CF6' : '#555'}"></i> ${c.likes}
            </div>
        </div>
    `).join('');
}

function loadComments() {
    const saved = localStorage.getItem('portfolioComments');
    if (saved) comments = JSON.parse(saved);
}
