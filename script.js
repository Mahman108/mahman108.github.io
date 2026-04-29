let currentSection = "menu";
let comments = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Logic
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.section;
            
            // Swap Sections
            const currEl = document.getElementById(currentSection);
            const nextEl = document.getElementById(target);

            if (currEl && nextEl) {
                currEl.classList.remove('visible');
                nextEl.classList.add('visible');
                
                // Update Nav UI
                document.querySelectorAll('.nav-button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                currentSection = target;
                window.scrollTo(0, 0); // Reset scroll when switching
            }
        });
    });

    // 2. Particle Effect (Minimal & Stable)
    const pContainer = document.getElementById('particles');
    if (pContainer) {
        for (let i = 0; i < 30; i++) {
            createParticle(pContainer);
        }
    }

    // 3. Load Comments
    const saved = localStorage.getItem('portfolio_msgs');
    if (saved) {
        comments = JSON.parse(saved);
        renderComments();
    }
});

function createParticle(container) {
    const p = document.createElement('div');
    p.style.position = 'absolute';
    p.style.width = '2px';
    p.style.height = '2px';
    p.style.background = '#8B5CF6';
    p.style.opacity = Math.random();
    p.style.top = Math.random() * 100 + '%';
    p.style.left = Math.random() * 100 + '%';
    container.appendChild(p);
}

// Card Flip Function
function toggleCard(card) {
    card.classList.toggle('flipped');
}

// Comment Board Functions
function sendComment() {
    const u = document.getElementById('user');
    const m = document.getElementById('message');
    
    if(!u.value.trim() || !m.value.trim()) return;

    const newMsg = {
        name: u.value.trim(),
        text: m.value.trim(),
        date: new Date().toLocaleDateString()
    };

    comments.unshift(newMsg);
    localStorage.setItem('portfolio_msgs', JSON.stringify(comments));
    
    u.value = '';
    m.value = '';
    renderComments();
}

function renderComments() {
    const list = document.getElementById('comment-list');
    if(!list) return;

    if (comments.length === 0) {
        list.innerHTML = '<p style="opacity:0.5; text-align:center;">No messages yet.</p>';
        return;
    }

    list.innerHTML = comments.map(c => `
        <div style="background:rgba(255,255,255,0.03); padding:15px; margin-bottom:15px; border-radius:10px; border-left:4px solid #8B5CF6; animation: fadeIn 0.5s ease;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <strong style="color:#8B5CF6;">${escapeHtml(c.name)}</strong>
                <small style="opacity:0.5;">${c.date}</small>
            </div>
            <p style="line-height:1.5;">${escapeHtml(c.text)}</p>
        </div>
    `).join('');
}

// Prevent HTML injection in comments
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
