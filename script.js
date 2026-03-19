// Global variables
let currentSection = "menu";
let comments = [];
let particleCount = 0;
const maxParticles = 50;
let isSwitching = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    loadCommentsFromStorage();
    updateComments();

    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', function() {
            const section = this.dataset.section;
            showSection(section);
            updateActiveNavButton(this);
        });
    });
});

// Particle system
function initializeParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    setInterval(() => {
        if (particleCount < maxParticles) {
            createParticle(container);
        }
    }, 300);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';

    container.appendChild(particle);
    particleCount++;

    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            particleCount--;
        }
    }, 25000);
}

// Section navigation
function showSection(sectionId) {
    if (isSwitching) return;
    isSwitching = true;

    const currentElement = document.getElementById(currentSection);

    if (currentElement) {
        currentElement.classList.remove("visible");
    }

    currentSection = sectionId;

    const newElement = document.getElementById(currentSection);
    if (newElement) {
        newElement.classList.add("visible");
    }

    setTimeout(() => {
        isSwitching = false;
    }, 300);
}

function updateActiveNavButton(activeButton) {
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Skill cards
function toggleDetails(card) {
    const isFlipped = card.classList.contains('flipped');

    document.querySelectorAll('.skill-card').forEach(c => {
        c.classList.remove('flipped');
    });

    if (!isFlipped) {
        card.classList.add('flipped');
    }
}

// Comments system
function submitComment() {
    const userInput = document.getElementById("user");
    const messageInput = document.getElementById("message");

    const user = userInput.value.trim();
    const msg = messageInput.value.trim();

    if (!user || !msg) return;

    const comment = {
        id: Date.now(),
        user: user,
        msg: msg,
        likes: 0
    };

    comments.unshift(comment);
    saveCommentsToStorage();
    updateComments();

    userInput.value = "";
    messageInput.value = "";
}

function likeComment(commentId, event) {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
        comment.likes++;
        saveCommentsToStorage();
        updateComments();
    }
}

function updateComments() {
    const container = document.getElementById("recent-comments");
    if (!container) return;

    container.innerHTML = "";

    comments.forEach(comment => {
        const div = document.createElement("div");
        div.className = "comment";

        div.innerHTML = `
            <b>${comment.user}</b>
            <p>${comment.msg}</p>
            <span onclick="likeComment(${comment.id}, event)">❤️ ${comment.likes}</span>
        `;

        container.appendChild(div);
    });
}

// Storage
function saveCommentsToStorage() {
    localStorage.setItem('portfolioComments', JSON.stringify(comments));
}

function loadCommentsFromStorage() {
    try {
        const stored = localStorage.getItem('portfolioComments');
        comments = stored ? JSON.parse(stored) : [];
    } catch {
        comments = [];
    }
}

// Keyboard navigation (UPDATED SECTIONS HERE)
document.addEventListener('keydown', function(e) {
    if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

    const sections = ['menu', 'portfolio', 'designs', 'voice', 'contact'];

    const currentIndex = sections.indexOf(currentSection);

    if (e.key === 'ArrowLeft' && currentIndex > 0) {
        const prevSection = sections[currentIndex - 1];
        showSection(prevSection);
        updateActiveNavButton(document.querySelector(`[data-section="${prevSection}"]`));
    } 
    else if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        showSection(nextSection);
        updateActiveNavButton(document.querySelector(`[data-section="${nextSection}"]`));
    }
});