let currentSection = "menu";
let comments = [];
let particleCount = 0;
const maxParticles = 40;

document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    loadCommentsFromStorage();
    updateComments();
    
    // Navigation Logic
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', function() {
            const section = this.dataset.section;
            showSection(section);
            document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Particle Background Logic
function initializeParticles() {
    const container = document.getElementById('particles');
    setInterval(() => {
        if (particleCount < maxParticles) createParticle(container);
    }, 400);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particle.style.background = '#8B5CF6';
    container.appendChild(particle);
    particleCount++;
    setTimeout(() => { particle.remove(); particleCount--; }, 15000);
}

// Section Switching
function showSection(sectionId) {
    const current = document.getElementById(currentSection);
    const next = document.getElementById(sectionId);
    if (current) current.classList.remove("visible");
    if (next) next.classList.add("visible");
    currentSection = sectionId;
}

// Card Logic
function toggleDetails(card) {
    card.classList.toggle('flipped');
}

// Comment System
function submitComment() {
    const userInput = document.getElementById("user");
    const msgInput = document.getElementById("message");
    const btn = document.querySelector('.submit-btn');

    if (!userInput.value.trim() || !msgInput.value.trim()) return;

    btn.disabled = true;
    btn.innerHTML = '<div class="loading"></div> Sending...';

    setTimeout(() => {
        const newComment = {
            id: Date.now(),
            user: userInput.value,
            msg: msgInput.value,
            likes: 0,
            timestamp: new Date().toLocaleDateString()
        };

        comments.unshift(newComment);
        saveCommentsToStorage();
        updateComments();

        userInput.value = "";
        msgInput.value = "";
        btn.disabled = false;
        btn.innerHTML = "Send Message";
    }, 800);
}

function likeComment(id) {
    const comment = comments.find(c => c.id === id);
    if (comment) {
        comment.likes++;
        saveCommentsToStorage();
        updateComments();
    }
}

function updateComments() {
    const recent = document.getElementById("recent-comments");
    const top = document.getElementById("top-comments");
    
    const render = (data) => data.map(c => `
        <div class="comment">
            <div class="comment-header">
                <span><i class="fas fa-user-circle"></i> ${c.user}</span>
                <small>${c.timestamp}</small>
            </div>
            <p>${c.msg}</p>
            <div class="comment-actions" onclick="likeComment(${c.id})">
                <i class="fas fa-heart" style="color: ${c.likes > 0 ? '#8B5CF6' : 'inherit'}"></i> ${c.likes}
            </div>
        </div>
    `).join('');

    recent.innerHTML = render(comments.slice(0, 5));
    top.innerHTML = render([...comments].sort((a,b) => b.likes - a.likes).slice(0, 3));
    
    if (comments.length === 0) {
        recent.innerHTML = '<p style="opacity:0.5">No messages yet.</p>';
    }
}

function saveCommentsToStorage() { localStorage.setItem('portfolioComments', JSON.stringify(comments)); }
function loadCommentsFromStorage() {
    const stored = localStorage.getItem('portfolioComments');
    if (stored) comments = JSON.parse(stored);
}
    
