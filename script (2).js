// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    });
    
    document.querySelectorAll('a, button, .skill-card-3d, .project-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursorFollower.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });
}

// Mobile Menu Toggle
const menuIcon = document.querySelector('.menu-icon');
const navLinks = document.querySelector('.nav-links');

if (menuIcon) {
    menuIcon.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.backgroundColor = 'rgba(15, 12, 41, 0.95)';
            navLinks.style.padding = '20px';
            navLinks.style.textAlign = 'center';
            navLinks.style.backdropFilter = 'blur(10px)';
            navLinks.style.gap = '15px';
        }
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Progress Bars Animation
const progressBars = document.querySelectorAll('.progress');
const observerOptions = { threshold: 0.5 };

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.getAttribute('data-width');
            entry.target.style.width = width;
            progressObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

progressBars.forEach(bar => {
    bar.style.width = '0';
    progressObserver.observe(bar);
});

// ========== TOAST NOTIFICATION ==========
function showNotification(title, message, type) {
    const notification = document.createElement('div');
    notification.className = `toast-notification ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: '💜'
    };
    
    notification.innerHTML = `
        <div class="toast-icon">${icons[type] || '💜'}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <div class="toast-progress"></div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ========== CONTACT FORM - FIXED ==========
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get all form values
        const name = this.querySelector('input[placeholder="Your Full Name"]')?.value || '';
        const email = this.querySelector('input[placeholder="Your Email Address"]')?.value || '';
        const subject = this.querySelector('input[placeholder="Subject (e.g., Project Inquiry)"]')?.value || 'No Subject';
        const message = this.querySelector('textarea')?.value || '';
        
        // Check if all required fields are filled
        if (name && email && message) {
            // Show success notification
            showNotification(
                '✨ Message Sent Successfully! ✨',
                `Thank you ${name}! Laiba will reply to you soon at ${email}`,
                'success'
            );
            
            // Reset form
            this.reset();
            
            // Log for debugging
            console.log('✅ Message sent from:', name);
            console.log('📧 Email:', email);
            console.log('📝 Subject:', subject);
            console.log('💬 Message:', message);
            
        } else {
            // Show error notification
            showNotification(
                '⚠️ Oops! Missing Information',
                'Please fill all fields before sending',
                'warning'
            );
        }
    });
}

// ========== CALCULATOR FUNCTIONS ==========
let calcDisplay = document.getElementById('calcDisplay');
let calcExpression = '';

function calcNumber(num) {
    calcExpression += num;
    updateCalcDisplay();
}

function calcOperator(op) {
    calcExpression += op;
    updateCalcDisplay();
}

function calcClear() {
    calcExpression = '';
    updateCalcDisplay();
}

function calcDelete() {
    calcExpression = calcExpression.slice(0, -1);
    updateCalcDisplay();
}

function calcResult() {
    try {
        let result = eval(calcExpression.replace(/×/g, '*').replace(/÷/g, '/'));
        calcExpression = result.toString();
        updateCalcDisplay();
    } catch (e) {
        calcDisplay.textContent = 'Error';
        setTimeout(() => {
            calcExpression = '';
            updateCalcDisplay();
        }, 1000);
    }
}

function updateCalcDisplay() {
    calcDisplay.textContent = calcExpression || '0';
}

// Open/Close Calculator
function openCalculator(e) {
    if (e) e.preventDefault();
    document.getElementById('calculatorModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCalculator() {
    document.getElementById('calculatorModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

// ========== MUSIC PLAYER FUNCTIONS ==========
let musicPlaylist = [
    { title: 'Calm Waves', artist: 'Laiba\'s Playlist' },
    { title: 'Chill Vibes', artist: 'Laiba\'s Playlist' },
    { title: 'Dreamscape', artist: 'Laiba\'s Playlist' }
];
let currentSong = 0;
let isPlaying = false;
let audioContext = null;
let audioSource = null;
let musicTimer = null;
let currentTime = 0;
let duration = 210;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = 'sine';
        oscillator.frequency.value = 440;
        gainNode.gain.value = 0.1;
        
        audioSource = {
            oscillator: oscillator,
            gainNode: gainNode,
            start: function() {
                this.oscillator.start();
                this.oscillator.frequency.value = 440 + Math.random() * 100;
            },
            stop: function() {
                this.oscillator.stop();
                this.oscillator = audioContext.createOscillator();
                this.oscillator.connect(this.gainNode);
                this.oscillator.type = 'sine';
            }
        };
    }
    return audioSource;
}

function musicToggle() {
    const playBtn = document.getElementById('playBtn');
    const cover = document.getElementById('musicCover');
    
    if (isPlaying) {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        cover.classList.remove('playing');
        if (audioSource) audioSource.stop();
        if (musicTimer) clearInterval(musicTimer);
    } else {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        cover.classList.add('playing');
        const source = initAudio();
        source.start();
        
        musicTimer = setInterval(() => {
            currentTime += 1;
            if (currentTime >= duration) {
                currentTime = 0;
                musicNext();
            }
            updateMusicTime();
        }, 1000);
    }
}

function musicNext() {
    currentSong = (currentSong + 1) % musicPlaylist.length;
    currentTime = 0;
    updateMusicInfo();
    updateMusicTime();
    if (isPlaying) {
        const source = initAudio();
        source.stop();
        setTimeout(() => {
            const newSource = initAudio();
            newSource.start();
        }, 100);
    }
}

function musicPrev() {
    currentSong = (currentSong - 1 + musicPlaylist.length) % musicPlaylist.length;
    currentTime = 0;
    updateMusicInfo();
    updateMusicTime();
    if (isPlaying) {
        const source = initAudio();
        source.stop();
        setTimeout(() => {
            const newSource = initAudio();
            newSource.start();
        }, 100);
    }
}

function updateMusicInfo() {
    const song = musicPlaylist[currentSong];
    document.getElementById('musicTitle').textContent = song.title;
    document.getElementById('musicArtist').textContent = song.artist;
}

function updateMusicTime() {
    const mins = Math.floor(currentTime / 60);
    const secs = Math.floor(currentTime % 60);
    document.getElementById('musicCurrentTime').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    
    const progress = (currentTime / duration) * 100;
    document.getElementById('musicProgressFill').style.width = `${Math.min(progress, 100)}%`;
}

// Open/Close Music Player
function openMusicPlayer(e) {
    if (e) e.preventDefault();
    document.getElementById('musicModal').classList.add('show');
    document.body.style.overflow = 'hidden';
    updateMusicInfo();
    updateMusicTime();
}

function closeMusicPlayer() {
    document.getElementById('musicModal').classList.remove('show');
    document.body.style.overflow = 'auto';
    if (isPlaying) {
        musicToggle();
    }
}

// ========== OTHER PROJECTS DEMO ==========
function openMarket(e) {
    if (e) e.preventDefault();
    showNotification(
        '🛒 Full Omni Market',
        'Marketplace demo coming soon! Check the live version.',
        'info'
    );
}

function openQuiz(e) {
    if (e) e.preventDefault();
    showNotification(
        '❓ Quiz Web',
        'Quiz demo coming soon! Check the live version.',
        'info'
    );
}

function openWeather(e) {
    if (e) e.preventDefault();
    showNotification(
        '☁️ Weather Web',
        'Weather demo coming soon! Check the live version.',
        'info'
    );
}

// Volume Control
const volumeSlider = document.getElementById('volumeSlider');
if (volumeSlider) {
    volumeSlider.addEventListener('input', function(e) {
        const volume = e.target.value / 100;
        if (audioSource && audioSource.gainNode) {
            audioSource.gainNode.gain.value = volume;
        }
    });
}

// Close modals on outside click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
            document.body.style.overflow = 'auto';
            if (this.id === 'musicModal' && isPlaying) {
                musicToggle();
            }
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.show').forEach(modal => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
            if (modal.id === 'musicModal' && isPlaying) {
                musicToggle();
            }
        });
    }
});

// ========== SCROLL ANIMATIONS ==========
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.2 });

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease';
    sectionObserver.observe(section);
});

// ========== PARTICLES EFFECT ==========
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: `rgba(102, 126, 234, ${Math.random() * 0.5})`
        });
    }
    
    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
    }
    
    animateParticles();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ========== RESUME BUTTON ==========
const resumeBtn = document.getElementById('resumeBtn');
if (resumeBtn) {
    resumeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification(
            '📄 Resume Download',
            'Resume download feature coming soon!',
            'info'
        );
    });
}

console.log('✨ Laiba Javed\'s Magical Portfolio Loaded! ✨');
console.log('📧 Email: laibajaved19@gmail.com');
console.log('📱 Phone: 0344 6676119');
// ========== MARKET DEMO ==========
function openMarket(e) {
    if (e) e.preventDefault();
    showNotification(
        '🛒 Full Omni Market',
        'Marketplace demo coming soon! Check the live version.',
        'info'
    );
}

// ========== QUIZ DEMO ==========
function openQuiz(e) {
    if (e) e.preventDefault();
    showNotification(
        '❓ Quiz Web',
        'Quiz demo coming soon! Check the live version.',
        'info'
    );
}

// ========== WEATHER DEMO ==========
function openWeather(e) {
    if (e) e.preventDefault();
    showNotification(
        '☁️ Weather Web',
        'Weather demo coming soon! Check the live version.',
        'info'
    );
}