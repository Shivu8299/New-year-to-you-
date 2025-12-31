// --- INITIAL CANVAS SETUP ---
const sCanvas = document.getElementById('star-canvas');
const fCanvas = document.getElementById('firework-canvas');
const sCtx = sCanvas.getContext('2d');
const fCtx = fCanvas.getContext('2d');

// Adjust canvas size to fit screen
function resize() {
    sCanvas.width = fCanvas.width = window.innerWidth;
    sCanvas.height = fCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- TWINKLING STARS ---
let stars = [];
for(let i=0; i<180; i++) {
    stars.push({ 
        x: Math.random()*sCanvas.width, 
        y: Math.random()*sCanvas.height, 
        r: Math.random()*1.5, 
        alpha: Math.random() 
    });
}

function drawStars() {
    sCtx.clearRect(0,0,sCanvas.width,sCanvas.height);
    stars.forEach(s => {
        sCtx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        sCtx.beginPath(); 
        sCtx.arc(s.x, s.y, s.r, 0, Math.PI*2); 
        sCtx.fill();
        s.alpha += (Math.random()-0.5)*0.05;
        if(s.alpha < 0) s.alpha = 0; 
        if(s.alpha > 1) s.alpha = 1;
    });
    requestAnimationFrame(drawStars);
}
drawStars();

// --- FIREWORK LOGIC ---
let rocket = { x: fCanvas.width/2, y: fCanvas.height, tY: fCanvas.height/2.2, active: true, speed: 7 };
let particles = [];

function explode(x, y) {
    for(let i=0; i<100; i++) {
        particles.push({ 
            x, y, 
            angle: Math.random()*Math.PI*2, 
            speed: Math.random()*5+2, 
            a: 1 
        });
    }
}

function drawFirework() {
    fCtx.clearRect(0,0,fCanvas.width,fCanvas.height);
    if(rocket.active) {
        fCtx.fillStyle = "#f4c430";
        fCtx.beginPath(); 
        fCtx.arc(rocket.x, rocket.y, 3, 0, Math.PI*2); 
        fCtx.fill();
        rocket.y -= rocket.speed;
        if(rocket.y <= rocket.tY) { 
            rocket.active = false; 
            explode(rocket.x, rocket.y); 
            reveal(); 
        }
    }
    particles.forEach((p, i) => {
        p.x += Math.cos(p.angle)*p.speed; 
        p.y += Math.sin(p.angle)*p.speed;
        p.a -= 0.015; 
        p.speed *= 0.96;
        fCtx.fillStyle = `rgba(244, 196, 48, ${p.a})`;
        fCtx.beginPath(); 
        fCtx.arc(p.x, p.y, 2, 0, Math.PI*2); 
        fCtx.fill();
        if(p.a <= 0) particles.splice(i, 1);
    });
    requestAnimationFrame(drawFirework);
}
drawFirework();

function reveal() {
    setTimeout(() => {
        const intro = document.getElementById('intro-content');
        if(intro) intro.classList.add('visible-content');
    }, 400);
}

// --- NAVIGATION ---
function goToScene(n) {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    const nextScene = document.getElementById(`scene-${n}`);
    if(nextScene) nextScene.classList.add('active');
    
    if(n === 7) startLoading();
    if(n === 9) startTypewriter();
    
    // Stop music automatically if user leaves the music scene
    if(n !== 4) { 
        audio.pause(); 
        document.querySelectorAll('.cassette-container').forEach(c => c.classList.remove('playing'));
    }
}

// --- MUSIC TOGGLE & WAVE ---
let audio = document.getElementById('global-audio');

function toggleMusic(src, el) {
    if(!audio.paused && audio.src.includes(src)) {
        audio.pause();
        el.classList.remove('playing');
    } else {
        document.querySelectorAll('.cassette-container').forEach(c => {
            c.classList.remove('playing');
        });
        audio.src = src;
        audio.play();
        el.classList.add('playing');
        startWave(el);
    }
}

function startWave(el) {
    const cvs = el.querySelector('.wave-canvas');
    if(!cvs) return;
    const ctxW = cvs.getContext('2d');
    let offset = 0;
    
    function draw() {
        if(!el.classList.contains('playing')) return;
        ctxW.clearRect(0,0,cvs.width,cvs.height);
        ctxW.strokeStyle = "#fff";
        ctxW.lineWidth = 2;
        ctxW.beginPath();
        for(let x=0; x<cvs.width; x++) {
            let y = 12 + Math.sin(x*0.1 + offset)*5;
            ctxW.lineTo(x, y);
        }
        ctxW.stroke();
        offset += 0.2;
        requestAnimationFrame(draw);
    }
    draw();
}

// --- LOADING BAR ---
function startLoading() {
    let p = 0;
    const bar = document.querySelector('.loading-bar-fill');
    const txt = document.getElementById('perc');
    const inv = setInterval(() => {
        if(p >= 100) { 
            clearInterval(inv); 
            setTimeout(() => goToScene(8), 500); 
        } else { 
            p++; 
            if(bar) bar.style.width = p + '%'; 
            if(txt) txt.innerText = p + '%'; 
        }
    }, 40);
}

// --- TYPEWRITER ---
function startTypewriter() {
    // Universal message for everyone
    const text = "Happy New Year 2026! May this year bring you endless joy, success, and beautiful memories. Let's make every moment count! 🌟";
    const el = document.getElementById('type-text');
    if(!el) return;
    
    el.innerHTML = ""; 
    let i = 0;
    
    function type() {
        if(i < text.length) { 
            el.innerHTML += text.charAt(i); 
            i++; 
            setTimeout(type, 60); 
        } else { 
            const restartBtn = document.getElementById('restart');
            if(restartBtn) {
                restartBtn.style.opacity = "1"; 
                restartBtn.style.pointerEvents = "all"; 
            }
        }
    }
    type();
}
