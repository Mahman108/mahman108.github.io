// Global variables
let currentSection = "menu";
let comments = [];
let particleCount = 0;
const maxParticles = 50;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    loadCommentsFromStorage();
    updateComments();
    
    // Add smooth section navigation
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', function() {
            const section = this.dataset.section;
            showSection(section);
            updateActiveNavButton(this);
        });
    });
    
    // Initialize skill cards hover effects
    initializeSkillCards();
    
    // Add intersection observer for animations
    initializeScrollAnimations();
});

// --- Particle System ---
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
    
    // Random starting position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    // Random color variation
    const colors = ['#8B5CF6', '#A855F7', '#92400E', '#B45309'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    container.appendChild(particle);
    particleCount++;
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            particleCount--;
        }
    }, 25000);
}

// --- Navigation Logic ---
function showSection(sectionId) {
    const currentElement = document.getElementById(currentSection);
    
    if (currentElement) {
        // Fade out current section
        currentElement.style.opacity = '0';
        currentElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            currentElement.classList.remove("visible");
            
            // Fade in new section
            currentSection = sectionId;
            const newElement = document.getElementById(currentSection);
            if (newElement) {
                newElement.classList.add("visible");
                newElement.style.opacity = '0';
                newElement.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    newElement.style.opacity = '1';
                    newElement.style.transform = 'translateY(0)';
                }, 50);
            }
        }, 200);
    }
}

function updateActiveNavButton(activeButton) {
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// --- Skill Cards Logic ---
function initializeSkillCards() {
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('flipped')) {
                this.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('flipped')) {
                this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
            }
        });
    });
}

function toggleDetails(card) {
    const isFlipped = card.classList.contains('flipped');
    
    // ACCORDION EFFECT: Reset all cards before opening the new one
    document.querySelectorAll('.skill-card').forEach(c => {
        c.classList.remove('flipped');
        c.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
    
    // Toggle current card
    if (!isFlipped) {
        card.classList.add('flipped');
        card.style.transform = 'translateY(-5px) scale(1.02)';
        
        // Add click outside to close
        setTimeout(() => {
            document.addEventListener('click', function closeCard(e) {
                if (!card.contains(e.target)) {
                    card.classList.remove('flipped');
                    card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
                    document.removeEventListener('click', closeCard);
                }
            });
        }, 100);
    }
}

// --- Comments System ---
function submitComment() {
    const userInput = document.getElementById("user");
    const messageInput = document.getElementById("message");
    const submitBtn = document.querySelector('.submit-btn');
    
    const user = userInput.value.trim();
    const msg = messageInput.value.trim();
    
    if (!user || !msg) {
        showNotification("Please enter both name and message.", "error");
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div> Sending...';
    submitBtn.disabled = true;
    
    // Simulate slight API delay for realism
    setTimeout(() => {
        const comment = {
            id: Date.now(),
            user: user,
            msg: msg,
            likes: 0,
            timestamp: new Date().toLocaleString()
        };
        
        comments.unshift(comment);
        saveCommentsToStorage();
        updateComments();
        
        userInput.value = "";
        messageInput.value = "";
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        showNotification("Message sent successfully!", "success");
    }, 800);
}

function likeComment(commentId) {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
        comment.likes++;
        saveCommentsToStorage();
        updateComments();
    }
}

function updateComments() {
    const recentContainer = document.getElementById("recent-comments");
    const topContainer = document.getElementById("top-comments"); // Works if you have Top Comments in HTML
    
    if (recentContainer) {
        recentContainer.innerHTML = comments.slice(0, 5).map(c => createCommentHTML(c)).join('');
        if (comments.length === 0) {
            recentContainer.innerHTML = '<div class="empty-state" style="opacity:0.6; padding: 10px;">No messages yet. Be the first to leave one!</div>';
        }
    }

    if (topContainer) {
        const topComments = [...comments].sort((a, b) => b.likes - a.likes).slice(0, 5);
        topContainer.innerHTML = topComments.map(c => createCommentHTML(c)).join('');
        if (topComments.length === 0) {
            topContainer.innerHTML = '<div class="empty-state" style="opacity:0.6; padding: 10px;">No top messages yet.</div>';
        }
    }
}

function createCommentHTML(comment) {
    return `
        <div class="comment" style="animation: fadeIn 0.4s ease-in-out;">
            <div class="comment-header">
                <span><i class="fas fa-user-circle"></i> ${escapeHtml(comment.user)}</span>
                <span style="font-size: 0.8rem; color: #8B5CF6; font-weight: normal; margin-left: 0.5rem;">
                    ${comment.timestamp}
                </span>
            </div>
            <p style="margin-top: 8px;">${escapeHtml(comment.msg)}</p>
            <div class="comment-actions" style="margin-top: 10px; cursor: pointer;" onclick="likeComment(${comment.id})">
                <span class="like-btn" title="Like this message" style="transition: transform 0.2s ease; display: inline-block;">
                    <i class="fas fa-heart" style="color: ${comment.likes > 0 ? '#8B5CF6' : 'inherit'}"></i> ${comment.likes}
                </span>
            </div>
        </div>
    `;
}

// --- Utility Functions ---
function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#8B5CF6' : '#ef4444'};
        color: white; border-radius: 10px; z-index: 1000;
        opacity: 0; transform: translateX(100%); transition: all 0.3s ease;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3); font-weight: 500;
    `;
    
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => { notification.style.opacity = '1'; notification.style.transform = 'translateX(0)'; }, 100);
    setTimeout(() => {
        notification.style.opacity = '0'; notification.style.transform = 'translateX(100%)';
        setTimeout(() => { if (notification.parentNode) document.body.removeChild(notification); }, 300);
    }, 3000);
}

// --- Storage Functions ---
function saveCommentsToStorage() {
    try { localStorage.setItem('portfolioComments', JSON.stringify(comments)); } 
    catch (e) { console.warn('Could not save comments:', e); }
}

function loadCommentsFromStorage() {
    try {
        const stored = localStorage.getItem('portfolioComments');
        if (stored) comments = JSON.parse(stored);
    } catch (e) { console.warn('Could not load comments:', e); }
}

// --- Scroll & Keyboard Handlers ---
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('animated');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.skill-card, .contact-card, .comment').forEach(el => observer.observe(el));
}

document.addEventListener('keydown', function(e) {
    // Array updated to include the new Rubik's cube section
    const sections = ['menu', 'portfolio', 'logic', 'contact', 'comments']; 
    const currentIndex = sections.indexOf(currentSection);
    
    // Left & Right arrow key navigation
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
        const prevSection = sections[currentIndex - 1];
        showSection(prevSection);
        updateActiveNavButton(document.querySelector(`[data-section="${prevSection}"]`));
    } else if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        showSection(nextSection);
        updateActiveNavButton(document.querySelector(`[data-section="${nextSection}"]`));
    }
    
    // Ctrl + Enter to submit comment
    if (e.key === 'Enter' && e.ctrlKey && currentSection === 'comments') {
        submitComment();
    }
});

// Pause particles when tab is not active to save PC/Mobile resources
document.addEventListener('visibilitychange', function() {
    const particles = document.getElementById('particles');
    if (particles) {
        particles.style.animationPlayState = document.hidden ? 'paused' : 'running';
    }
});
