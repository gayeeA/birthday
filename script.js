/**
 * Midnight Pastel - Luxury Birthday Experience
 * Comprehensive Interactive Script
 */

// ============================================
// GLOBAL VARIABLES
// ============================================
const state = {
    currentPhase: 1,
    musicPlaying: false,
    phases: [],
    isTransitioning: false,
    hasBegun: false
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    body: document.body,
    musicToggle: document.getElementById('music-toggle'),
    bgMusic: document.getElementById('bg-music'),
    cursorTrail: document.getElementById('cursor-trail'),
    stardustCanvas: document.getElementById('stardust-canvas'),
    fireworksCanvas: document.getElementById('fireworks-canvas'),
    giftBox: document.getElementById('gift-box'),
    giftBow: document.getElementById('gift-bow'),
    giftLid: document.getElementById('gift-lid'),
    giftModal: document.getElementById('gift-modal'),
    beginBtn: document.getElementById('begin-btn'),
    bigBang: document.getElementById('big-bang'),
    book: document.getElementById('book'),
    closeBookBtn: document.getElementById('close-book'),
    lanternsContainer: document.getElementById('lanterns'),
    heartWall: document.getElementById('heart-wall'),
    finalMessage: document.getElementById('final-message'),
    phase1: document.getElementById('phase-1'),
    phase2: document.getElementById('phase-2'),
    phase3: document.getElementById('phase-3'),
    phase4: document.getElementById('phase-4')
};

// Canvas contexts
let stardustCtx, fireworksCtx;
let fireworks = [];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initCursor();
    initMusicToggle();
    initGiftBox();
    initStations();
    initBook();
    initLanterns();
    initHeartPolaroids();
    initScrollDissolution();
    
    // Store last scroll position
    state.lastScrollPosition = window.pageYOffset;
    
    // Disable upward scrolling
    window.addEventListener('scroll', handleScroll);
    
    console.log('Midnight Pastel - Birthday Experience Loaded!');
});

// ============================================
// CANVAS SETUP
// ============================================
function initCanvas() {
    // Stardust Canvas
    stardustCtx = elements.stardustCanvas.getContext('2d');
    resizeCanvas(elements.stardustCanvas, stardustCtx);
    
    // Fireworks Canvas
    fireworksCtx = elements.fireworksCanvas.getContext('2d');
    resizeCanvas(elements.fireworksCanvas, fireworksCtx);
    
    window.addEventListener('resize', () => {
        resizeCanvas(elements.stardustCanvas, stardustCtx);
        resizeCanvas(elements.fireworksCanvas, fireworksCtx);
    });
    
    // Start animation loops
    animateStardust();
    animateFireworks();
}

function resizeCanvas(canvas, ctx) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.canvas.width = canvas.width;
    ctx.canvas.height = canvas.height;
}

// ============================================
// CUSTOM CURSOR WITH STARDUST TRAIL
// ============================================
function initCursor() {
    const trail = elements.cursorTrail;
    
    document.addEventListener('mousemove', (e) => {
        // Move cursor trail container
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        
        // Create particle
        createCursorParticle(e.clientX, e.clientY);
    });
    
    // Hide default cursor on the body, show on interactive elements
    elements.body.style.cursor = 'none';
    trail.style.display = 'block';
}

function createCursorParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.position = 'fixed';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9998';
    
    document.body.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
        particle.remove();
    }, 600);
}

// ============================================
// STARDUST PARTICLE SYSTEM
// ============================================
let stardustParticles = [];

function animateStardust() {
    stardustCtx.clearRect(0, 0, elements.stardustCanvas.width, elements.stardustCanvas.height);
    
    // Add new particle occasionally
    if (Math.random() < 0.08) {
        stardustParticles.push(createStardustParticle());
    }
    
    // Update and draw particles
    stardustParticles = stardustParticles.filter(p => {
        p.y -= p.speed;
        p.opacity -= 0.003;
        p.size *= 0.995;
        
        if (p.opacity <= 0 || p.size <= 0.5) {
            return false;
        }
        
        stardustCtx.beginPath();
        stardustCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        stardustCtx.fillStyle = `rgba(255, 215, 0, ${p.opacity})`;
        stardustCtx.fill();
        
        return true;
    });
    
    requestAnimationFrame(animateStardust);
}

function createStardustParticle() {
    return {
        x: Math.random() * elements.stardustCanvas.width,
        y: elements.stardustCanvas.height + 10,
        size: Math.random() * 2.5 + 0.5,
        speed: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.4
    };
}

// ============================================
// FIREWORKS SYSTEM
// ============================================
function animateFireworks() {
    fireworksCtx.clearRect(0, 0, elements.fireworksCanvas.width, elements.fireworksCanvas.height);
    
    // Update and draw fireworks
    fireworks = fireworks.filter(fw => {
        fw.update();
        fw.draw(fireworksCtx);
        return fw.life > 0;
    });
    
    requestAnimationFrame(animateFireworks);
}

function createFirework(x, y) {
    const particles = [];
    const colors = ['#ff4d4d', '#F8C8DC', '#E6E6FA', '#ffd700', '#ff6b6b', '#ffa500'];
    
    for (let i = 0; i < 80; i++) {
        const angle = (Math.PI * 2 * i) / 80;
        const speed = Math.random() * 4 + 1.5;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1,
            decay: Math.random() * 0.015 + 0.008
        });
    }
    
    return {
        particles,
        update() {
            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.04;
                p.life -= p.decay;
            });
            this.particles = this.particles.filter(p => p.life > 0);
        },
        draw(ctx) {
            this.particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2.5 * p.life, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.fill();
                ctx.globalAlpha = 1;
            });
        },
        get life() {
            return this.particles.length > 0 ? this.particles[0].life : 0;
        }
    };
}

function triggerFireworkShow() {
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const x = Math.random() * (elements.fireworksCanvas.width * 0.7) + (elements.fireworksCanvas.width * 0.15);
            const y = Math.random() * (elements.fireworksCanvas.height * 0.4) + (elements.fireworksCanvas.height * 0.1);
            fireworks.push(createFirework(x, y));
        }, i * 250);
    }
}

// ============================================
// MUSIC TOGGLE
// ============================================
function initMusicToggle() {
    elements.musicToggle.addEventListener('click', toggleMusic);
}

function toggleMusic() {
    if (state.musicPlaying) {
        elements.bgMusic.pause();
        elements.musicToggle.classList.remove('playing');
        state.musicPlaying = false;
    } else {
        elements.bgMusic.play().then(() => {
            elements.musicToggle.classList.add('playing');
            state.musicPlaying = true;
        }).catch(() => {
            console.log('Click to enable music');
        });
    }
}

// ============================================
// PHASE 1: GIFT BOX INTERACTIONS
// ============================================
function initGiftBox() {
    // Bow click - untie animation
    elements.giftBow.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!state.hasBegun) {
            untieRibbon();
        }
    });
    
    // Also allow clicking the gift box
    elements.giftBox.addEventListener('click', (e) => {
        if (!state.hasBegun && e.target === elements.giftBox || e.target.closest('.gift-box')) {
            untieRibbon();
        }
    });
    
    // Begin button
    elements.beginBtn.addEventListener('click', () => {
        triggerBigBang();
    });
    
    // Magnetic hover effect
    elements.giftBox.addEventListener('mousemove', handleMagneticHover);
    elements.giftBox.addEventListener('mouseleave', handleMagneticLeave);
}

function untieRibbon() {
    const bow = elements.giftBow;
    const ribbonV = document.getElementById('ribbon-vertical');
    const ribbonH = document.getElementById('ribbon-horizontal');
    
    // Animate bow falling
    bow.classList.add('untying');
    ribbonV.classList.add('untying');
    ribbonH.classList.add('untying');
    
    // Open lid after ribbon animation
    setTimeout(() => {
        elements.giftLid.classList.add('open');
        
        // Show modal after lid opens
        setTimeout(() => {
            elements.giftModal.classList.add('show');
        }, 600);
    }, 500);
}

function handleMagneticHover(e) {
    const rect = elements.giftBox.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + 
        Math.pow(e.clientY - centerY, 2)
    );
    
    if (distance < 200) {
        const scale = 1 + (200 - distance) / 600;
        elements.giftBox.style.transform = `translate(-50%, -50%) scale(${Math.min(scale, 1.15)})`;
    }
}

function handleMagneticLeave() {
    elements.giftBox.style.transform = 'translate(-50%, -50%) scale(1)';
}

function triggerBigBang() {
    state.hasBegun = true;
    
    // Hide modal
    elements.giftModal.classList.remove('show');
    
    // Implode gift box
    elements.giftBox.style.transition = 'all 0.4s ease';
    elements.giftBox.style.transform = 'translate(-50%, -50%) scale(0)';
    elements.giftBox.style.opacity = '0';
    
    // Hide intro text
    const introText = document.querySelector('.intro-text');
    if (introText) {
        introText.style.opacity = '0';
    }
    
    // Trigger big bang
    setTimeout(() => {
        elements.bigBang.classList.add('explode');
        
        // Transition to Phase 2
        setTimeout(() => {
            state.currentPhase = 2;
            // Remove phase 1 from DOM
            if (elements.phase1) {
                elements.phase1.style.display = 'none';
            }
            elements.bigBang.classList.remove('explode');
            
            // Scroll to phase 2
            if (elements.phase2) {
                elements.phase2.scrollIntoView({ behavior: 'auto' });
            }
        }, 1400);
    }, 300);
}

// ============================================
// PHASE 2: STATIONS (PARALLAX)
// ============================================
function initStations() {
    const polaroids = document.querySelectorAll('.polaroid[data-tilt]');
    
    document.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        polaroids.forEach(polaroid => {
            const rect = polaroid.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const deltaX = (e.clientX - centerX) / centerX;
                const deltaY = (e.clientY - centerY) / centerY;
                
                const moveX = deltaX * 8;
                const moveY = deltaY * 8;
                
                polaroid.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
    });
}

// ============================================
// PHASE 3: 3D BOOK
// ============================================
function initBook() {
    elements.book.addEventListener('click', toggleBook);
    elements.closeBookBtn.addEventListener('click', closeBook);
}

function toggleBook() {
    if (elements.book.classList.contains('opened')) {
        return;
    }
    
    elements.book.classList.add('opened');
    
    // Show close button
    setTimeout(() => {
        elements.closeBookBtn.classList.add('show');
    }, 800);
}

function closeBook() {
    elements.closeBookBtn.classList.remove('show');
    
    // Close book
    elements.book.classList.remove('opened');
    
    // Dissolve phase 3 and go to phase 4
    setTimeout(() => {
        if (elements.phase3) {
            elements.phase3.style.transition = 'opacity 0.8s ease, filter 0.8s ease';
            elements.phase3.style.opacity = '0';
            elements.phase3.style.filter = 'blur(20px)';
        }
        
        setTimeout(() => {
            if (elements.phase3) {
                elements.phase3.style.display = 'none';
            }
            state.currentPhase = 4;
            
            if (elements.phase4) {
                elements.phase4.style.display = 'flex';
                elements.phase4.scrollIntoView({ behavior: 'auto' });
            }
        }, 800);
    }, 500);
}

// ============================================
// PHASE 4: LANTERNS & HEART POLAROIDS
// ============================================
function initLanterns() {
    const container = elements.lanternsContainer;
    
    for (let i = 0; i < 40; i++) {
        const lantern = document.createElement('div');
        lantern.className = 'lantern';
        lantern.style.left = Math.random() * 100 + '%';
        lantern.style.animationDelay = Math.random() * 10 + 's';
        lantern.style.animationDuration = (Math.random() * 3 + 7) + 's';
        container.appendChild(lantern);
    }
}

function initHeartPolaroids() {
    const polaroids = document.querySelectorAll('.heart-photo');
    
    polaroids.forEach((polaroid) => {
        // Sparkle effect on click
        polaroid.addEventListener('click', (e) => {
            if (polaroid.classList.contains('final-trigger')) {
                // Trigger firework show and final message
                triggerFireworkShow();
                showFinalMessage();
            } else {
                // Sparkle effect
                triggerSparkle(e.clientX, e.clientY);
            }
        });
    });
}

function triggerSparkle(x, y) {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const sparkleX = x + (Math.random() - 0.5) * 80;
            const sparkleY = y + (Math.random() - 0.5) * 80;
            fireworks.push(createFirework(sparkleX, sparkleY));
        }, i * 40);
    }
}

function showFinalMessage() {
    // Show the final message after a delay
    setTimeout(() => {
        elements.finalMessage.classList.add('show');
    }, 1500);
}

// ============================================
// SCROLL DISSOLUTION
// ============================================
function initScrollDissolution() {
    // For Phase 2 stations
    const stations = document.querySelectorAll('.station');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                // Station has been scrolled past - dissolve it
                const station = entry.target;
                if (!station.classList.contains('dissolved')) {
                    dissolveStation(station);
                }
            }
        });
    }, { threshold: 0 });
    
    stations.forEach(station => {
        observer.observe(station);
    });
    
    // Observe Phase 2 container
    if (elements.phase2) {
        const phase2Observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && entry.boundingClientRect.top < -100) {
                    // Phase 2 is fully scrolled past
                    if (!elements.phase2.classList.contains('dissolved')) {
                        dissolvePhase(elements.phase2);
                    }
                }
            });
        }, { threshold: 0 });
        
        phase2Observer.observe(elements.phase2);
    }
}

function dissolveStation(station) {
    station.style.transition = 'all 0.6s ease';
    station.style.opacity = '0';
    station.style.transform = 'scale(1.1)';
    station.style.filter = 'blur(15px)';
    
    setTimeout(() => {
        station.style.display = 'none';
    }, 600);
}

function dissolvePhase(phase) {
    phase.classList.add('dissolved');
    phase.style.transition = 'all 0.8s ease';
    phase.style.opacity = '0';
    phase.style.filter = 'blur(20px)';
    
    setTimeout(() => {
        phase.style.display = 'none';
    }, 800);
}

// ============================================
// SCROLL HANDLING - ONE WAY JOURNEY
// ============================================
function handleScroll() {
    const currentScroll = window.pageYPosition || document.documentElement.scrollTop;
    
    // Prevent upward scrolling after passing sections
    if (currentScroll < state.lastScrollPosition && !state.isTransitioning) {
        // Get all visible phases
        const visiblePhases = Array.from(document.querySelectorAll('.phase')).filter(p => {
            const rect = p.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0 && p.style.display !== 'none';
        });
        
        // Only allow if transitioning
        if (visiblePhases.length <= 1) {
            window.scrollTo(0, state.lastScrollPosition);
        }
    }
    
    state.lastScrollPosition = currentScroll;
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const nextPhase = state.currentPhase + 1;
        if (nextPhase <= 4) {
            const phase = document.querySelector(`[data-phase="${nextPhase}"]`);
            if (phase) {
                phase.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
    
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        const prevPhase = state.currentPhase - 1;
        if (prevPhase >= 1) {
            const phase = document.querySelector(`[data-phase="${prevPhase}"]`);
            if (phase) {
                phase.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

// ============================================
// VISIBILITY HANDLING
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (state.musicPlaying) {
            elements.bgMusic.pause();
        }
    } else {
        if (state.musicPlaying) {
            elements.bgMusic.play();
        }
    }
});

console.log('All systems initialized!');

