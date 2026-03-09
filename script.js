// ============================================
// PHASE 1: GIFT ENTRANCE
// ============================================
const music = document.getElementById("music");
const toggle = document.getElementById("musicToggle");
const phase1 = document.getElementById("phase1");
const giftBox = document.getElementById("giftBox");
const giftBow = document.getElementById("giftBow");
const musicModal = document.getElementById("musicModal");
const musicToggle2 = document.getElementById("musicToggle2");
const beginJourneyBtn = document.getElementById("beginJourneyBtn");
const stardustCanvas = document.getElementById("stardustCanvas");
const bigBangCanvas = document.getElementById("bigBangCanvas");

let playing = false;
let isUnwrapped = false;
let isHovering = false;
let stardustAnimationId = null;

// Stardust Particle System
const stardustCtx = stardustCanvas.getContext("2d");
let stardustParticles = [];

function resizeStardustCanvas() {
    stardustCanvas.width = window.innerWidth;
    stardustCanvas.height = window.innerHeight;
}
resizeStardustCanvas();
window.addEventListener("resize", resizeStardustCanvas);

class StardustParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.color = `hsl(${Math.random() * 60 + 30}, 100%, ${Math.random() * 30 + 60}%)`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.98;
    }
    draw() {
        stardustCtx.beginPath();
        stardustCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        stardustCtx.fillStyle = this.color;
        stardustCtx.globalAlpha = this.life;
        stardustCtx.fill();
        stardustCtx.globalAlpha = 1;
    }
}

function createStardustTrail() {
    if (!isHovering || isUnwrapped) return;
    const rect = giftBox.getBoundingClientRect();
    for (let i = 0; i < 3; i++) {
        stardustParticles.push(new StardustParticle(
            rect.left + rect.width / 2 + (Math.random() - 0.5) * 100,
            rect.top + rect.height / 2 + (Math.random() - 0.5) * 100
        ));
    }
}

function animateStardust() {
    stardustCtx.clearRect(0, 0, stardustCanvas.width, stardustCanvas.height);
    createStardustTrail();
    stardustParticles = stardustParticles.filter(p => p.life > 0);
    stardustParticles.forEach(p => { p.update(); p.draw(); });
    if (isHovering && !isUnwrapped) {
        stardustAnimationId = requestAnimationFrame(animateStardust);
    }
}

function startStardust() {
    stardustCanvas.classList.add("active");
    isHovering = true;
    animateStardust();
}

function stopStardust() {
    isHovering = false;
    if (stardustAnimationId) cancelAnimationFrame(stardustAnimationId);
    setTimeout(() => stardustCanvas.classList.remove("active"), 500);
}

// Proximity Sensor
document.addEventListener("mousemove", (e) => {
    if (isUnwrapped) return;
    const rect = giftBox.getBoundingClientRect();
    const boxCenterX = rect.left + rect.width / 2;
    const boxCenterY = rect.top + rect.height / 2;
    const distance = Math.sqrt(Math.pow(e.clientX - boxCenterX, 2) + Math.pow(e.clientY - boxCenterY, 2));
    if (distance < 200) {
        if (!isHovering) { startStardust(); giftBox.style.transform = "scale(1.2)"; }
    } else {
        if (isHovering) { stopStardust(); giftBox.style.transform = "scale(1)"; }
    }
});

// Bow Click
giftBow.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isUnwrapped) return;
    isUnwrapped = true;
    stopStardust();
    document.querySelector(".gift-hint").style.display = "none";
    
    const segmentLeft = document.querySelector(".segment-left");
    const segmentRight = document.querySelector(".segment-right");
    const giftLid = document.getElementById("giftLid");
    
    segmentLeft.style.left = "25%";
    segmentRight.style.left = "75%";
    segmentLeft.classList.add("falling");
    segmentRight.classList.add("falling");
    giftBow.style.opacity = "0";
    
    setTimeout(() => giftLid.classList.add("opening"), 500);
    setTimeout(() => musicModal.classList.add("active"), 2000);
});

// Music Toggle
musicToggle2.addEventListener("change", () => {
    if (musicToggle2.checked) {
        music.play().catch(() => {});
        toggle.innerText = "🔊";
        playing = true;
        beginJourneyBtn.classList.add("visible");
    } else {
        music.pause();
        toggle.innerText = "🔈";
        playing = false;
        beginJourneyBtn.classList.remove("visible");
    }
});

toggle.onclick = () => {
    if (!playing) {
        music.play().catch(() => {});
        toggle.innerText = "🔊";
        playing = true;
        musicToggle2.checked = true;
        if (isUnwrapped) beginJourneyBtn.classList.add("visible");
    } else {
        music.pause();
        toggle.innerText = "🔈";
        playing = false;
        musicToggle2.checked = false;
        beginJourneyBtn.classList.remove("visible");
    }
};

// Big Bang Transition
const bigBangCtx = bigBangCanvas.getContext("2d");
let bigBangParticles = [];
let bigBangPhase = "idle";

function resizeBigBangCanvas() {
    bigBangCanvas.width = window.innerWidth;
    bigBangCanvas.height = window.innerHeight;
}
resizeBigBangCanvas();
window.addEventListener("resize", resizeBigBangCanvas);

class BigBangParticle {
    constructor(x, y, angle, speed, isExplosion = false) {
        this.x = x; this.y = y; this.angle = angle; this.speed = speed;
        this.size = isExplosion ? Math.random() * 4 + 2 : Math.random() * 8 + 4;
        this.life = 1;
        this.decay = isExplosion ? 0.015 : 0.03;
        this.isExplosion = isExplosion;
    }
    update() {
        if (this.isExplosion) {
            this.x += Math.cos(this.angle) * this.speed * 3;
            this.y += Math.sin(this.angle) * this.speed * 3;
            this.size *= 1.02;
        } else {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
        }
        this.life -= this.decay;
    }
    draw() {
        const gradient = bigBangCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        gradient.addColorStop(0, `rgba(255, 215, 0, ${this.life})`);
        gradient.addColorStop(1, "transparent");
        bigBangCtx.beginPath();
        bigBangCtx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        bigBangCtx.fillStyle = gradient;
        bigBangCtx.fill();
    }
}

function triggerBigBang() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    bigBangCanvas.classList.add("active");
    bigBangPhase = "implosion";
    
    for (let i = 0; i < 100; i++) {
        const angle = (Math.PI * 2 / 100) * i;
        bigBangParticles.push(new BigBangParticle(
            centerX + Math.cos(angle) * (200 + Math.random() * 500),
            centerY + Math.sin(angle) * (200 + Math.random() * 500),
            angle, -5, false
        ));
    }
    
    setTimeout(() => {
        bigBangPhase = "explosion";
        bigBangParticles = [];
        for (let i = 0; i < 300; i++) {
            bigBangParticles.push(new BigBangParticle(
                centerX, centerY, Math.random() * Math.PI * 2,
                Math.random() * 15 + 5, true
            ));
        }
    }, 1000);
    
    animateBigBang();
}

function animateBigBang() {
    bigBangCtx.clearRect(0, 0, bigBangCanvas.width, bigBangCanvas.height);
    
    if (bigBangPhase === "implosion") {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const whitePoint = bigBangCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
        whitePoint.addColorStop(0, "rgba(255, 255, 255, 1)");
        whitePoint.addColorStop(1, "transparent");
        bigBangCtx.beginPath();
        bigBangCtx.arc(centerX, centerY, 30, 0, Math.PI * 2);
        bigBangCtx.fillStyle = whitePoint;
        bigBangCtx.fill();
    }
    
    bigBangParticles = bigBangParticles.filter(p => p.life > 0);
    bigBangParticles.forEach(p => { p.update(); p.draw(); });
    
    if (bigBangParticles.length > 0 || bigBangPhase === "implosion") {
        requestAnimationFrame(animateBigBang);
    } else {
        setTimeout(cleanupAndProceed, 500);
    }
}

function cleanupAndProceed() {
    bigBangCanvas.classList.remove("active");
    phase1.classList.add("hidden");
    setTimeout(() => {
        phase1.style.display = "none";
        document.body.style.overflowY = "auto";
        document.getElementById("journey").style.display = "block";
        initJourney();
    }, 800);
}

beginJourneyBtn.addEventListener("click", () => {
    document.body.style.overflowY = "hidden";
    triggerBigBang();
});

// ============================================
// PHASE 2: ASYMMETRICAL JOURNEY
// ============================================
const journey = document.getElementById("journey");
const stations = document.querySelectorAll(".quote-station");
let stationsVisible = 0;
let scrollTimeout;

// Initialize Journey with IntersectionObserver
function initJourney() {
    // Start observing stations
    stations.forEach(station => {
        station.style.opacity = "0";
        station.style.transform = "translateY(50px)";
        observer.observe(station);
    });
    
    // Setup mouse tilt for photo stacks
    setupMouseTilt();
}

// IntersectionObserver for scroll-based animations
const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Station entering viewport - animate in
            entry.target.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            stationsVisible++;
        } else if (entry.target.getBoundingClientRect().top < 0 && !entry.target.classList.contains("dissolved")) {
            // Station leaving top of viewport - dissolve and remove
            dissolveStation(entry.target);
        }
    });
}, observerOptions);

// Dissolve station when scrolled past
function dissolveStation(station) {
    if (station.classList.contains("dissolved")) return;
    
    station.classList.add("dissolved");
    
    // After animation, remove element and scroll lock
    setTimeout(() => {
        station.style.display = "none";
        station.remove();
        
        // Force scroll position to prevent seeing blank space
        window.scrollTo(0, window.scrollY);
        
        // Check if all stations are dissolved
        const remainingStations = document.querySelectorAll(".quote-station:not(.dissolved)");
        if (remainingStations.length === 0) {
            showLibraryButton();
        }
    }, 1000);
}

// Mouse tilt effect for photo stacks
function setupMouseTilt() {
    const photoStacks = document.querySelectorAll(".photo-stack");
    
    photoStacks.forEach(stack => {
        const topPolaroid = stack.querySelector(".polaroid.top");
        
        stack.addEventListener("mousemove", (e) => {
            const rect = stack.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate tilt based on mouse position
            const tiltX = (y / rect.height - 0.5) * 20;
            const tiltY = (x / rect.width - 0.5) * -20;
            
            topPolaroid.style.transform = `rotate(${5 + tiltY}deg) translateZ(40px) scale(1.1)`;
        });
        
        stack.addEventListener("mouseleave", () => {
            topPolaroid.style.transform = "rotate(5deg) translateZ(20px)";
        });
    });
}

// Show library button when all stations are gone
function showLibraryButton() {
    journey.classList.add("show-library");
}

// Library button handler
document.getElementById("toLibraryBtn").onclick = () => {
    journey.style.display = "none";
    document.getElementById("memory").style.display = "flex";
};

// ============================================
// PHASE 3: MEMORY BOOK
// ============================================
const memoriesBook = document.getElementById("memoriesBook");
const book = document.getElementById("book");
const bookCover = document.getElementById("bookCover");
const pages = document.querySelectorAll(".page");
const memorySection = document.getElementById("memory");
let bookOpen = false;
let currentPage = 0;

const pageControls = document.querySelectorAll(".book-controls");
pageControls.forEach(ctrl => ctrl.classList.remove("visible"));

memoriesBook.onclick = (e) => {
    e.stopPropagation();
    memorySection.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
        memoriesBook.style.opacity = "0";
        memoriesBook.style.pointerEvents = "none";
        setTimeout(() => book.classList.add("visible"), 300);
    }, 300);
};

bookCover.onclick = (e) => {
    e.stopPropagation();
    if (!bookOpen) {
        bookOpen = true;
        book.classList.add("open");
        bookCover.querySelector(".open-hint").style.display = "none";
        setTimeout(() => pageControls[0].classList.add("visible"), 1000);
    }
};

function closeBook() {
    bookOpen = false;
    book.classList.remove("open");
    pageControls.forEach(ctrl => ctrl.classList.remove("visible"));
    pages.forEach(page => page.classList.remove("active"));
    currentPage = 0;
    pages[0].classList.add("active");
    memorySection.classList.add("hidden");
    setTimeout(() => {
        memorySection.style.display = "none";
        showFinale();
    }, 1000);
}

function nextPage() {
    pageControls[currentPage].classList.remove("visible");
    pages[currentPage].classList.remove("active");
    currentPage = (currentPage + 1) % pages.length;
    pages[currentPage].classList.add("active");
    setTimeout(() => pageControls[currentPage].classList.add("visible"), 100);
}

document.querySelectorAll("#closeBook, #closeBook2, #closeBook3").forEach(btn => {
    btn.onclick = (e) => { e.stopPropagation(); closeBook(); };
});

document.querySelectorAll("#nextPage, #nextPage2, #nextPage3").forEach(btn => {
    btn.onclick = (e) => { e.stopPropagation(); nextPage(); };
});

// ============================================
// PHASE 4: HEART FINALE
// ============================================
function showFinale() {
    const finale = document.getElementById("finale");
    finale.classList.add("visible");
    finale.style.display = "flex";
}

// Lantern Canvas
const lanternCanvas = document.getElementById("lanternCanvas");
const lanternCtx = lanternCanvas.getContext("2d");
let lanterns = [];

function resizeLantern() {
    lanternCanvas.width = window.innerWidth;
    lanternCanvas.height = window.innerHeight;
}
resizeLantern();
window.addEventListener("resize", resizeLantern);

for (let i = 0; i < 150; i++) {
    lanterns.push({
        x: Math.random() * lanternCanvas.width,
        y: Math.random() * lanternCanvas.height,
        size: 2 + Math.random() * 3,
        speed: 0.3 + Math.random() * 0.7,
        flicker: Math.random() * Math.PI * 2
    });
}

function animateLanterns() {
    lanternCtx.clearRect(0, 0, lanternCanvas.width, lanternCanvas.height);
    lanterns.forEach(l => {
        l.flicker += 0.05;
        const flicker = Math.sin(l.flicker) * 0.2 + 0.8;
        
        const gradient = lanternCtx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.size * 8);
        gradient.addColorStop(0, `rgba(255, 215, 0, ${flicker})`);
        gradient.addColorStop(1, "transparent");
        
        lanternCtx.beginPath();
        lanternCtx.arc(l.x, l.y, l.size * 8, 0, Math.PI * 2);
        lanternCtx.fillStyle = gradient;
        lanternCtx.fill();
        
        lanternCtx.beginPath();
        lanternCtx.arc(l.x, l.y, l.size, 0, Math.PI * 2);
        lanternCtx.fillStyle = `rgba(255, 230, 150, ${flicker})`;
        lanternCtx.fill();
        
        l.y -= l.speed;
        if (l.y < -20) {
            l.y = lanternCanvas.height + 20;
            l.x = Math.random() * lanternCanvas.width;
        }
    });
    requestAnimationFrame(animateLanterns);
}
animateLanterns();

// Fireworks
const fireCanvas = document.getElementById("fireworks");
const fireCtx = fireCanvas.getContext("2d");
let fireworks = [];
let particles = [];

function resizeFire() {
    fireCanvas.width = window.innerWidth;
    fireCanvas.height = window.innerHeight;
}
resizeFire();
window.addEventListener("resize", resizeFire);

class Firework {
    constructor(x, y) {
        this.x = x; this.y = y; this.exploded = false;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = -8 - Math.random() * 4;
    }
    update() {
        if (!this.exploded) {
            this.vy += 0.15;
            this.x += this.vx;
            this.y += this.vy;
            for (let i = 0; i < 3; i++) {
                particles.push(new Particle(this.x, this.y, true));
            }
            if (this.vy >= 0) this.explode();
        }
    }
    explode() {
        this.exploded = true;
        for (let i = 0; i < 60; i++) {
            const angle = (Math.PI * 2 / 60) * i;
            const speed = 2 + Math.random() * 5;
            particles.push(new Particle(this.x, this.y, false, {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            }));
        }
    }
    draw() {
        if (!this.exploded) {
            fireCtx.beginPath();
            fireCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            fireCtx.fillStyle = "#FFD700";
            fireCtx.fill();
        }
    }
}

class Particle {
    constructor(x, y, isTrail, velocity) {
        this.x = x; this.y = y; this.life = 1;
        this.isTrail = isTrail;
        this.decay = isTrail ? 0.05 : 0.02;
        this.velocity = velocity || { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
    }
    update() {
        this.velocity.y += 0.05;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life -= this.decay;
    }
    draw() {
        fireCtx.beginPath();
        fireCtx.arc(this.x, this.y, this.isTrail ? 2 : 3, 0, Math.PI * 2);
        fireCtx.fillStyle = `rgba(255, 215, 0, ${this.life})`;
        fireCtx.fill();
    }
}

function animateFireworks() {
    fireCtx.fillStyle = "rgba(0, 0, 0, 0.1)";
    fireCtx.fillRect(0, 0, fireCanvas.width, fireCanvas.height);
    
    if (Math.random() < 0.02) {
        fireworks.push(new Firework(
            Math.random() * fireCanvas.width * 0.8 + fireCanvas.width * 0.1,
            fireCanvas.height * 0.3 + Math.random() * fireCanvas.height * 0.3
        ));
    }
    
    fireworks = fireworks.filter(fw => !fw.exploded);
    fireworks.forEach(fw => { fw.update(); fw.draw(); });
    
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    
    requestAnimationFrame(animateFireworks);
}
animateFireworks();

// Heart Photo Interactions
const heartPhotos = document.querySelectorAll(".heart-photo");

heartPhotos.forEach((photo) => {
    photo.addEventListener("click", (e) => {
        e.stopPropagation();
        photo.classList.add("clicked");
        setTimeout(() => photo.classList.remove("clicked"), 500);
        
        const rect = photo.getBoundingClientRect();
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                fireworks.push(new Firework(
                    rect.left + rect.width / 2 + (Math.random() - 0.5) * 100,
                    rect.top + rect.height / 2 + (Math.random() - 0.5) * 50
                ));
            }, i * 150);
        }
        
        if (photo.id === "finalPhoto") {
            triggerFinale();
        }
    });
});

function triggerFinale() {
    startBalloons();
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            fireworks.push(new Firework(
                window.innerWidth / 2 + (Math.random() - 0.5) * window.innerWidth * 0.9,
                window.innerHeight / 3 + Math.random() * window.innerHeight / 3
            ));
        }, i * 150);
    }
    setTimeout(() => {
        document.getElementById("finalMessage").classList.add("visible");
        document.getElementById("finale").classList.add("sunrise");
    }, 3000);
}

function startBalloons() {
    const finale = document.getElementById("finale");
    setInterval(() => {
        if (!document.getElementById("finalMessage").classList.contains("visible")) return;
        
        const balloon = document.createElement("div");
        balloon.className = "floating-balloon";
        balloon.innerHTML = Math.random() > 0.5 ? "❤️" : "🎈";
        balloon.style.left = Math.random() * 100 + "vw";
        balloon.style.animationDuration = (8 + Math.random() * 4) + "s";
        finale.appendChild(balloon);
        setTimeout(() => balloon.remove(), 12000);
    }, 500);
}

console.log("Kovidha's Birthday Journey Loaded!");
