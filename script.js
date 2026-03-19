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
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    const colors = ['#8B5CF6', '#A855F7', '#92400E', '#B45309'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
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
    const currentElement = document.getElementById(currentSection);
    if (currentElement) {
        currentElement.style.opacity = '0';
        currentElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            currentElement.classList.remove("visible");
            
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
    
    document.querySelectorAll('.skill-card').forEach(c => {
        c.classList.remove('flipped');
        c.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
    
    if (!isFlipped) {
        card.classList.add('flipped');
        card.style.transform = 'translateY(-5px) scale(1.02)';
        
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
    
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div> Sending...';
    submitBtn.disabled = true;
    
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
    }
}

function updateComments() {
    const recentContainer = document.getElementById("recent-comments");
    const topContainer = document.getElementById("top-comments");
    
    if (!recentContainer || !topContainer) return;
    
    recentContainer.innerHTML = "";
    topContainer.innerHTML = "";
    
    comments.slice(0, 5).forEach(comment => {
        const commentElement = createCommentElement(comment);
        recentContainer.appendChild(commentElement);
    });
    
    const topComments = [...comments]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);
        
    topComments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        topContainer.appendChild(commentElement);
    });
}

function createCommentElement(comment) {
    const div = document.createElement("div");
    div.className = "comment";
    
    div.innerHTML = `
        <div class="comment-header">
            ${comment.user}
        </div>
        <p>${comment.msg}</p>
        <span onclick="likeComment(${comment.id})">❤️ ${comment.likes}</span>
    `;
    
    return div;
}

// Storage
function saveCommentsToStorage() {
    localStorage.setItem('portfolioComments', JSON.stringify(comments));
}

function loadCommentsFromStorage() {
    try {
        const stored = localStorage.getItem('portfolioComments');
        if (stored) {
            comments = JSON.parse(stored);
        }
    } catch {
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
    });

    document.querySelectorAll('.skill-card, .contact-card').forEach(el => {
        observer.observe(el);
    });
}

// ✅ ONLY CHANGE IS HERE
document.addEventListener('keydown', function(e) {
    const sections = ['menu', 'portfolio', 'designs', 'voice', 'contact', 'comments'];

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