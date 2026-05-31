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
    
    // Add smooth scrolling to navigation
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

// Particle system
function initializeParticles() {
    const container = document.getElementById('particles');
    
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

// Section navigation
function showSection(sectionId) {
    // Hide current section with fade out
    const currentElement = document.getElementById(currentSection);
    if (currentElement) {
        currentElement.style.opacity = '0';
        currentElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            currentElement.classList.remove("visible");
            
            // Show new section with fade in
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

// Skill cards functionality
function initializeSkillCards() {
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(5deg)';
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
    
    // Reset all cards
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

// Comments system
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
    
    // Simulate API call delay
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
    }, 1000);
}

function likeComment(commentId, fromTop = false) {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
        comment.likes++;
        saveCommentsToStorage();
        updateComments();
        
        // Add visual feedback
        const likeBtn = event.target;
        likeBtn.style.transform = 'scale(1.2)';
        likeBtn.style.color = '#8B5CF6';
        
        setTimeout(() => {
            likeBtn.style.transform = 'scale(1)';
        }, 200);
    }
}

function updateComments() {
    const recentContainer = document.getElementById("recent-comments");
    const topContainer = document.getElementById("top-comments");
    
    recentContainer.innerHTML = "";
    topContainer.innerHTML = "";
    
    // Recent comments (chronological order)
    comments.slice(0, 5).forEach(comment => {
        const commentElement = createCommentElement(comment);
        recentContainer.appendChild(commentElement);
    });
    
    // Top comments (sorted by likes)
    const topComments = [...comments]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);
        
    topComments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        topContainer.appendChild(commentElement);
    });
    
    // Show empty state if no comments
    if (comments.length === 0) {
        recentContainer.innerHTML = '<div class="empty-state">No messages yet. Be the first to leave a message!</div>';
        topContainer.innerHTML = '<div class="empty-state">No messages yet.</div>';
    }
}

function createCommentElement(comment) {
    const div = document.createElement("div");
    div.className = "comment";
    div.style.opacity = "0";
    div.style.transform = "translateY(20px)";
    
    div.innerHTML = `
        <div class="comment-header">
            <i class="fas fa-user-circle"></i> ${escapeHtml(comment.user)}
            <span style="font-size: 0.8rem; color: var(--gray-400); font-weight: normal; margin-left: 0.5rem;">
                ${comment.timestamp}
            </span>
        </div>
        <p>${escapeHtml(comment.msg)}</p>
        <div class="comment-actions">
            <span class="like-btn" onclick="likeComment(${comment.id})" title="Like this message">
                <i class="fas fa-heart"></i> ${comment.likes}
            </span>
        </div>
    `;
    
    // Animate in
    setTimeout(() => {
        div.style.opacity = "1";
        div.style.transform = "translateY(0)";
    }, 100);
    
    return div;
}

// Utility functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--primary-purple)' : '#ef4444'};
        color: white;
        border-radius: 10px;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Local storage functions
function saveCommentsToStorage() {
    try {
        localStorage.setItem('portfolioComments', JSON.stringify(comments));
    } catch (e) {
        console.warn('Could not save comments to localStorage:', e);
    }
}

function loadCommentsFromStorage() {
    try {
        const stored = localStorage.getItem('portfolioComments');
        if (stored) {
            comments = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Could not load comments from localStorage:', e);
        comments = [];
    }
}

// Scroll animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements for animation
    document.querySelectorAll('.skill-card, .contact-card, .comment').forEach(el => {
        observer.observe(el);
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    const sections = ['menu', 'portfolio', 'contact', 'comments'];
    const currentIndex = sections.indexOf(currentSection);
    
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
        const prevSection = sections[currentIndex - 1];
        showSection(prevSection);
        updateActiveNavButton(document.querySelector(`[data-section="${prevSection}"]`));
    } else if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        showSection(nextSection);
        updateActiveNavButton(document.querySelector(`[data-section="${nextSection}"]`));
    }
});

// Handle form submission on Enter
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        if (currentSection === 'comments') {
            submitComment();
        }
    }
});

// Performance optimization
window.addEventListener('load', function() {
    // Remove loading states
    document.body.classList.add('loaded');
    
    // Preload images
    const images = [
        'https://i.ibb.co/qFg04mPh/output-1240335491-0.jpg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Handle visibility change for performance
document.addEventListener('visibilitychange', function() {
    const particles = document.getElementById('particles');
    if (document.hidden) {
        particles.style.animationPlayState = 'paused';
    } else {
        particles.style.animationPlayState = 'running';
    }
});
