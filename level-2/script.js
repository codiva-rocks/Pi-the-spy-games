// ── Equation data ─────────────────────────────────────────────────
const equations = [
  { display:"x² − 5x + 6 = 0",  zeroes:[2,3],    decoys:[-1,4,5,-2,1,6], sol:"(x-3)(x-2)=0 && x-3=0; x=3, x-2=0; x=2" },
  { display:"x² − x − 6 = 0",   zeroes:[3,-2],   decoys:[2,-3,1,6,-1,4], sol:"(x-3)(x+2)=0 && x-3=0; x=3, x+2=0; x=-2" },
  { display:"x² + 3x + 2 = 0",  zeroes:[-1,-2],  decoys:[1,2,3,-3,0,4], sol:"(x+1)(x+2)=0 && x+1=0; x=-1, x+2=0; x=-2" },
  { display:"x² − 4 = 0",       zeroes:[2,-2],   decoys:[4,-4,1,3,0,-1], sol:"(x-2)(x+2)=0 && x-2=0; x=2, x+2=0; x=-2" },
  { display:"x² − 7x + 12 = 0", zeroes:[3,4],    decoys:[2,6,-3,1,5,-4], sol:"(x-3)(x-4)=0 && x-3=0; x=3, x-4=0; x=4" },
  { display:"x² + 5x + 6 = 0",  zeroes:[-2,-3],  decoys:[2,3,-1,1,6,-6], sol:"(x+2)(x+3)=0 && x+2=0; x=-2, x+3=0; x=-3" },
  { display:"x² − 9 = 0",       zeroes:[3,-3],   decoys:[9,-9,1,6,2,-1], sol:"(x-3)(x+3)=0 && x-3=0; x=3, x+3=0; x=-3" },
  { display:"x² − 2x − 8 = 0",  zeroes:[4,-2],   decoys:[2,-4,8,1,-1,3], sol:"(x-4)(x+2)=0 && x-4=0; x=4, x+2=0; x=-2" },
  { display:"x² + x − 12 = 0",  zeroes:[3,-4],   decoys:[-3,4,2,12,-2,1], sol:"(x-3)(x+4)=0 && x-3=0; x=3, x+4=0; x=-4" },
  { display:"x² − 6x + 9 = 0",  zeroes:[3,3],    decoys:[-3,6,9,2,4,1], sol:"(x-3)(x-3)=0 && x-3=0; x=3, x-3=0; x=3" },
];

const COLORS = [
  ['#f06090','#b0244a'],['#28c890','#0e8c5c'],['#f07820','#b04808'],
  ['#9050e0','#5820a0'],['#2090e0','#0860a8'],['#e83030','#a01010'],
  ['#f0b020','#b07808'],['#18b0a0','#0a7068'],['#e060c0','#a02890'],
  ['#60c040','#2a8010'],
];

// ── State ─────────────────────────────────────────────────────────
let gameRunning = false;
let score = 0, timeLeft = 60;
let timerInterval = null;
let fishList = [];
let currentEq = null, caughtZeroes = [];
let eqIndex = 0;
let hookX = 200, hookY = 300;
let isDragging = false, dragOffX = 0, dragOffY = 0;
let lastTS = null;
let roundResults = [];
const TOTAL_TIME = 60;

// ── DOM ───────────────────────────────────────────────────────────
const container  = document.getElementById('game-container');
const waterEl    = document.getElementById('water');
const hookEl     = document.getElementById('hook');
const rodLine    = document.getElementById('rod-line');
const eqDisplay  = document.getElementById('eq-display');
const needCount  = document.getElementById('need-count');
const scoreDisp  = document.getElementById('score-disp');
const timeDisp   = document.getElementById('time-disp');
const tbar       = document.getElementById('tbar');

// ── Helpers ───────────────────────────────────────────────────────
function waterRect() { return waterEl.getBoundingClientRect(); }
function contRect()  { return container.getBoundingClientRect(); }

// ── Environment setup ─────────────────────────────────────────────
function setupEnv() {
  const sky = document.getElementById('sky');
  sky.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const c = document.createElement('div');
    c.className = 'cloud';
    const w = 70 + Math.random() * 90;
    c.style.cssText = `width:${w}px;height:${w*0.38}px;top:${8+Math.random()*55}%;
      animation-duration:${16+Math.random()*22}s;animation-delay:${-Math.random()*22}s;`;
    sky.appendChild(c);
  }
  waterEl.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('div');
    s.className = 'shimmer';
    s.style.cssText = `top:${5+i*12}%;animation-duration:${2+Math.random()*3}s;animation-delay:${-Math.random()*3}s;`;
    waterEl.appendChild(s);
  }
  for (let i = 0; i < 14; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const sz = 4 + Math.random() * 9;
    b.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*98}%;
      top:${20+Math.random()*75}%;
      animation-duration:${3+Math.random()*4}s;animation-delay:${-Math.random()*4}s;`;
    waterEl.appendChild(b);
  }
}

// ── Hook ──────────────────────────────────────────────────────────
function placeHook() {
  const cr = contRect();
  hookX = cr.width * 0.18;
  hookY = cr.height * 0.45;
  renderHook();
}

function renderHook() {
  hookEl.style.left = (hookX - 20) + 'px';
  hookEl.style.top  = (hookY - 20) + 'px';
  const shore = document.getElementById('shore').getBoundingClientRect();
  const cr = contRect();
  const rx = cr.width * 0.1;
  const ry = shore.top - cr.top + 4;
  rodLine.setAttribute('x1', rx);
  rodLine.setAttribute('y1', ry);
  rodLine.setAttribute('x2', hookX);
  rodLine.setAttribute('y2', hookY);
}

hookEl.addEventListener('mousedown', e => {
  if (!gameRunning) return;
  isDragging = true;
  const r = hookEl.getBoundingClientRect();
  dragOffX = e.clientX - r.left - 20;
  dragOffY = e.clientY - r.top  - 20;
  e.preventDefault();
});
hookEl.addEventListener('touchstart', e => {
  if (!gameRunning) return;
  isDragging = true;
  const t = e.touches[0];
  const r = hookEl.getBoundingClientRect();
  dragOffX = t.clientX - r.left - 20;
  dragOffY = t.clientY - r.top  - 20;
  e.preventDefault();
}, { passive: false });

document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const cr = contRect();
  hookX = Math.max(10, Math.min(cr.width-10,  e.clientX - cr.left - dragOffX));
  hookY = Math.max(10, Math.min(cr.height-10, e.clientY - cr.top  - dragOffY));
  renderHook();
});
document.addEventListener('touchmove', e => {
  if (!isDragging) return;
  const t = e.touches[0];
  const cr = contRect();
  hookX = Math.max(10, Math.min(cr.width-10,  t.clientX - cr.left - dragOffX));
  hookY = Math.max(10, Math.min(cr.height-10, t.clientY - cr.top  - dragOffY));
  renderHook();
  e.preventDefault();
}, { passive: false });
document.addEventListener('mouseup',  () => { isDragging = false; });
document.addEventListener('touchend', () => { isDragging = false; });

// ── Fish SVG builder ──────────────────────────────────────────────
function fishSVG(c1, c2, label, goLeft) {
  const id = 'g' + Math.random().toString(36).slice(2,7);
  const bodyFlip = goLeft ? `transform="scale(-1,1) translate(-110,0)"` : '';
  return `<svg width="110" height="56" viewBox="0 0 110 56" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <filter id="sh${id}">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,.35)"/>
    </filter>
  </defs>
  <g ${bodyFlip}>
    <polygon points="80,12 110,2 110,54 80,44" fill="${c2}"/>
    <polygon points="30,6 50,6 40,18" fill="${c2}" opacity=".8"/>
    <ellipse cx="46" cy="28" rx="40" ry="22"
      fill="url(#${id})" stroke="rgba(0,0,0,.15)" stroke-width="1"
      filter="url(#sh${id})"/>
    <ellipse cx="38" cy="22" rx="18" ry="8" fill="rgba(255,255,255,.22)"/>
    <circle cx="16" cy="24" r="6" fill="white"/>
    <circle cx="17" cy="24" r="3.5" fill="#1a1a2e"/>
    <circle cx="18" cy="22" r="1.2" fill="white"/>
    <path d="M22 32 Q26 36 30 32" stroke="rgba(255,255,255,.5)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <rect x="28" y="18" width="38" height="18" rx="9" fill="rgba(0,0,0,.45)"/>
  </g>
  <text x="55" y="31" text-anchor="middle"
    font-family="Fredoka One,cursive" font-size="13" fill="white"
    paint-order="stroke" stroke="rgba(0,0,0,.4)" stroke-width="2">${label}</text>
</svg>`;
}

// ── Spawn fish ────────────────────────────────────────────────────
function spawnFish(value, isCorrect) {
  const cr  = contRect();
  const wr  = waterRect();
  const wTop = wr.top - cr.top + 10;
  const wBot = wr.bottom - cr.top - 20;
  const goLeft = Math.random() < 0.5;
  const startX = goLeft ? cr.width + 120 : -120;
  const y = wTop + Math.random() * Math.max(10, wBot - wTop - 56);
  const speed = 50 + Math.random() * 60;
  const ci = Math.floor(Math.random() * COLORS.length);
  const [c1, c2] = COLORS[ci];
  const div = document.createElement('div');
  div.className = 'fish ' + (goLeft ? 'going-left' : 'going-right');
  div.style.left = startX + 'px';
  div.style.top  = y + 'px';
  div.innerHTML  = fishSVG(c1, c2, 'x=' + value, goLeft);
  container.appendChild(div);
  const obj = { el: div, x: startX, y, goLeft, speed, value, isCorrect, alive: true };
  fishList.push(obj);
  div.addEventListener('click',      () => tryGrab(obj));
  div.addEventListener('touchstart', e => { tryGrab(obj); e.preventDefault(); }, { passive:false });
  return obj;
}

// ── Catch logic ───────────────────────────────────────────────────
function tryGrab(obj) {
  if (!obj.alive || !gameRunning) return;
  const fr = obj.el.getBoundingClientRect();
  const cr = contRect();
  const fx = fr.left - cr.left + fr.width  / 2;
  const fy = fr.top  - cr.top  + fr.height / 2;
  const dist = Math.hypot(fx - hookX, fy - hookY);
  if (dist > 130) { splash(fx, fy, '🎣 Too far!', '#fff'); return; }
  obj.alive = false;
  if (obj.isCorrect) {
    obj.el.classList.add('caught');
    score++;
    scoreDisp.textContent = score;
    caughtZeroes.push(obj.value);
    splash(fx, fy, '✓ x=' + obj.value, '#4caf50');
    updateNeed();
    setTimeout(() => { obj.el.remove(); }, 520);
    if (caughtZeroes.length >= currentEq.zeroes.length) { setTimeout(nextEq, 700); }
  } else {
    obj.el.classList.add('missed');
    timeLeft = Math.max(0, timeLeft - 5);
    splash(fx, fy, '✗ −5s', '#e53935');
    setTimeout(() => { obj.el.remove(); }, 500);
  }
}

function updateNeed() {
  needCount.textContent = Math.max(0, currentEq.zeroes.length - caughtZeroes.length);
}

// ── Splash ────────────────────────────────────────────────────────
function splash(x, y, txt, color) {
  const s = document.createElement('div');
  s.className = 'splash';
  s.textContent = txt;
  s.style.cssText = `left:${x}px;top:${y}px;color:${color};`;
  container.appendChild(s);
  setTimeout(() => s.remove(), 900);
}

// ── Spawn wave ────────────────────────────────────────────────────
let waveTimer = null;

function spawnWave() {
  if (!gameRunning) return;
  const vals = [...currentEq.zeroes];
  const dq = [...currentEq.decoys].sort(() => Math.random() - .5).slice(0, 4);
  vals.push(...dq);
  vals.sort(() => Math.random() - .5);
  vals.forEach((v, i) => {
    setTimeout(() => {
      if (!gameRunning) return;
      const alreadyCaught = caughtZeroes.includes(v);
      const correct = currentEq.zeroes.includes(v) && !alreadyCaught;
      spawnFish(v, correct);
    }, i * 500);
  });
  waveTimer = setTimeout(spawnWave, 9000);
}

function stopWaves() { clearTimeout(waveTimer); waveTimer = null; }

// ── Animation loop ────────────────────────────────────────────────
function animLoop(ts) {
  if (!gameRunning) return;
  if (!lastTS) lastTS = ts;
  const dt = (ts - lastTS) / 1000;
  lastTS = ts;
  const cr = contRect();
  fishList.forEach(f => {
    if (!f.alive) return;
    f.x += (f.goLeft ? -1 : 1) * f.speed * dt;
    f.el.style.left = f.x + 'px';
    if (f.x < -160 || f.x > cr.width + 160) { f.alive = false; f.el.remove(); }
  });
  fishList = fishList.filter(f => f.alive);
  requestAnimationFrame(animLoop);
}

// ── Equation management ───────────────────────────────────────────
function loadEq() {
  currentEq = equations[eqIndex % equations.length];
  eqIndex++;
  caughtZeroes = [];
  eqDisplay.textContent = currentEq.display;
  updateNeed();
  clearFish();
  stopWaves();
  setTimeout(spawnWave, 400);
}

function nextEq() {
  roundResults.push({ eq: currentEq.display, caught: caughtZeroes.length, needed: currentEq.zeroes.length, sol=currentEq.sol });
  loadEq();
}

function clearFish() {
  fishList.forEach(f => { try { f.el.remove(); } catch(e){} });
  fishList = [];
}

// ── Timer ─────────────────────────────────────────────────────────
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft = Math.max(0, timeLeft - 1);
    timeDisp.textContent = timeLeft;
    tbar.style.width = (timeLeft / TOTAL_TIME * 100) + '%';
    if (timeLeft <= 0) endGame();
  }, 1000);
}

// ── Game flow ─────────────────────────────────────────────────────
function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('end-screen').style.display   = 'none';
  gameRunning = true;
  score = 0; timeLeft = TOTAL_TIME;
  roundResults = [];
  scoreDisp.textContent = 0;
  timeDisp.textContent  = TOTAL_TIME;
  tbar.style.width = '100%';
  eqIndex = Math.floor(Math.random() * equations.length);
  clearFish();
  setupEnv();
  placeHook();
  loadEq();
  lastTS = null;
  requestAnimationFrame(animLoop);
  startTimer();
}

function endGame() {
  gameRunning = false;
  clearInterval(timerInterval);
  stopWaves();
  clearFish();

  // Mark level 2 complete
  try { localStorage.setItem('mathgames_level2_done', '1'); } catch(e) {}

  document.getElementById('end-score').textContent = score;
  document.getElementById('end-title').textContent =
    score >= 8 ? '🏆 Amazing Catch!' : score >= 4 ? '🐟 Good Fishing!' : '😅 Keep Practicing!';
  document.getElementById('end-msg').textContent =
    score >= 8 ? 'Pi the Spy and friends are feasting tonight!' :
    score >= 4 ? 'A decent haul — the crew is satisfied!' :
    'The crew is cranky and hungry... try again!';
  document.getElementById('end-soontocome').textContent = 'Solutions to come soon!';

  const list = document.getElementById('results-list');
  list.innerHTML = '';
  roundResults.forEach(r => {
    const row = document.createElement('div');
    row.className = 'result-row';
    row.innerHTML = `<span class="eq">${r.eq}</span><span class="ct">${r.caught}/${r.needed}</span><span class="sol">${r.solution}</span>`;
    list.appendChild(row);
  });

  document.getElementById('end-screen').style.display = 'flex';
}

// ── Boot ──────────────────────────────────────────────────────────
setupEnv();
placeHook();
renderHook();
