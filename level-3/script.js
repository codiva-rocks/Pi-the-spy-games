// ═══════════════════════════════════════════════════════════════════
// DOOR ROOMS — Error Analysis problems (no timer)
// Player reads all steps and taps which step is wrong.
// ═══════════════════════════════════════════════════════════════════
const DOOR_PROBLEMS = [
  {
    title: 'Solving x² + 2x = 8',
    problem: 'x² + 2x = 8',
    steps: [
      'Factor out x:  x(x + 2) = 8',
      'Set each factor equal to 8:  x = 8  and  x + 2 = 8',
      'Solve for x:  x = 8  and  x = 6'
    ],
    wrongStep: 1,
    explain: 'Step 1 is wrong. You cannot factor when the equation does not equal zero. First subtract 8 from both sides: x² + 2x − 8 = 0. Then factor as (x + 4)(x − 2) = 0, so x = −4 or x = 2.'
  },
  {
    title: 'Solving x² − 4x − 5 = 0  (Quadratic Formula)',
    problem: 'x² − 4x − 5 = 0,  so  a = 1,  b = −4,  c = −5',
    steps: [
      'Plug into formula:  x = (−(−4) ± √[(−4)² − 4(1)(−5)]) / 2(1)',
      'Simplify discriminant:  x = 4 ± √(−16 − (−20)) / 2',
      'Simplify square root:  x = 4 ± √4 / 2',
      'Solve:  x = 3  and  x = 1'
    ],
    wrongStep: 2,
    explain: 'Step 2 is wrong. (−4)² = 16 — squaring always gives a positive result. The discriminant should be 16 − (−20) = 36, not −16 − (−20) = 4. With √36 = 6, the correct answers are x = (4 + 6)/2 = 5  and  x = (4 − 6)/2 = −1.'
  },
  {
    title: 'Solving (x − 3)² = 25',
    problem: '(x − 3)² = 25',
    steps: [
      'Take the square root of both sides:  √[(x − 3)²] = √25',
      'Simplify:  x − 3 = 5',
      'Solve:  x = 8'
    ],
    wrongStep: 2,
    explain: 'Step 2 is wrong. √25 = ±5 — every positive number has two square roots. This gives two equations: x − 3 = 5 (so x = 8) AND x − 3 = −5 (so x = −2). Both solutions are valid and must be included.'
  }
];

// ═══════════════════════════════════════════════════════════════════
// COMBAT ROOMS — Hard word problems (10-second timer!)
// Same mechanic: find the wrong step under time pressure.
// ═══════════════════════════════════════════════════════════════════
const COMBAT_PROBLEMS = [
  {
    title: 'Consecutive Odd Integers',
    problem: 'The product of two consecutive positive odd integers is 99. Find the integers.',
    steps: [
      'Let the two integers be n and n + 1',
      'Set up the equation:  n(n + 1) = 99',
      'Expand:  n² + n − 99 = 0',
      'Using the quadratic formula:  no integer solutions exist'
    ],
    wrongStep: 1,
    explain: 'Step 1 is wrong. Consecutive odd integers differ by 2, not 1. Let the integers be n and n + 2. Then n² + 2n − 99 = 0, which factors as (n + 11)(n − 9) = 0. Since n must be positive, n = 9. The two integers are 9 and 11 (check: 9 × 11 = 99 ✓).'
  },
  {
    title: 'Model Rocket — Maximum Height',
    problem: 'A rocket\'s height (feet) is  h(t) = −16t² + 200t.  Find the maximum height and the initial height.',
    steps: [
      'Identify coefficients:  a = −16,  b = 200',
      'Time of maximum:  t = −b / (2a) = −200 / (2 × 16) = −6.25 seconds',
      'Since t is negative, the rocket has no maximum height',
      'Initial height:  h(0) = −16(0)² + 200(0) = 0 feet'
    ],
    wrongStep: 2,
    explain: 'Step 2 is wrong. The denominator uses 2a, and a = −16 (it is negative!). So t = −200 / (2 × −16) = −200 / −32 = 6.25 seconds. The maximum height is h(6.25) = −16(6.25)² + 200(6.25) = −625 + 1250 = 625 feet. Step 4 is correct — the initial height h(0) = 0 feet.'
  },
  {
    title: 'Cannonball — Time to Hit Ground',
    problem: 'A cannonball follows  h(t) = −16t² + 40t + 1.5.  After how many seconds does it hit the ground?',
    steps: [
      'Set h(t) = 0:  −16t² + 40t + 1.5 = 0,  so  a = −16,  b = 40,  c = 1.5',
      'Discriminant:  b² − 4ac = 1600 − 96 = 1504',
      't = (−40 ± √1504) / (2 × −16)  ≈  (−40 ± 38.8) / −32',
      'Discard negative t; the cannonball hits the ground at  t ≈ 0.04 seconds'
    ],
    wrongStep: 2,
    explain: 'Step 2 is wrong. −4ac = −4(−16)(1.5) = +96, not −96. The discriminant is 1600 + 96 = 1696. With √1696 ≈ 41.2, we get t = (−40 − 41.2) / −32 ≈ 2.54 seconds and t = (−40 + 41.2) / −32 ≈ −0.04 s (discard). The cannonball hits the ground after about 2.54 seconds.'
  }
];

const ENEMIES = [
  { icon:'👹', name:'A Goblin Mathmage' },
  { icon:'🐉', name:'A Quadratic Drake' },
  { icon:'💀', name:'A Restless Skeleton' },
  { icon:'👻', name:'A Wailing Specter' },
  { icon:'🧟', name:'A Lumbering Zombie' },
];

// ── Tunables ──────────────────────────────────────────────────────
const HP_MAX        = 100;
const CORRECT_HEAL  = 8;
const WRONG_DAMAGE  = 22;
const ROOM_COUNT    = 6;
const COMBAT_TIME   = 90; // seconds per combat room

// ── State ─────────────────────────────────────────────────────────
let gameRunning  = false;
let hp           = HP_MAX;
let rooms        = [];
let roomIndex    = 0;
let roomLog      = [];
let combatTimer  = null;
let combatTicks  = 0;
let activeRoom   = null; // { type, problem, enemy? }

// ── DOM ───────────────────────────────────────────────────────────
const hpBar     = document.getElementById('hp-bar');
const hpDisp    = document.getElementById('hp-disp');
const roomDisp  = document.getElementById('room-disp');
const roomTotal = document.getElementById('room-total');
const doorEl    = document.getElementById('door-room');
const combatEl  = document.getElementById('combat-room');

// ── Helpers ───────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── HP bar ────────────────────────────────────────────────────────
function updateHP(delta) {
  hp = Math.max(0, Math.min(HP_MAX, hp + delta));
  hpBar.style.width = hp + '%';
  hpDisp.textContent = hp;
  hpBar.style.background =
    hp > 55 ? 'linear-gradient(to right,#4caf50,#8bc34a)' :
    hp > 25 ? 'linear-gradient(to right,#ffb238,#ff7b29)' :
              'linear-gradient(to right,#e53935,#b71c1c)';
}

// ── Build room list ────────────────────────────────────────────────
// 3 door rooms + 3 combat rooms, shuffled into a random order
function buildRooms() {
  const doorRooms = shuffle(DOOR_PROBLEMS).map(p => ({
    type: 'door', problem: p
  }));
  const combatRooms = shuffle(COMBAT_PROBLEMS).map(p => ({
    type: 'combat', problem: p,
    enemy: ENEMIES[Math.floor(Math.random() * ENEMIES.length)]
  }));
  rooms = shuffle([...doorRooms, ...combatRooms]);
}

// ── Room flow ─────────────────────────────────────────────────────
function showRoom() {
  if (roomIndex >= rooms.length) { endGame(true); return; }
  roomDisp.textContent = roomIndex + 1;
  activeRoom = rooms[roomIndex];
  doorEl.style.display   = activeRoom.type === 'door'   ? 'flex' : 'none';
  combatEl.style.display = activeRoom.type === 'combat' ? 'flex' : 'none';
  if (activeRoom.type === 'door') renderDoorRoom(activeRoom.problem);
  else renderCombatRoom(activeRoom.problem, activeRoom.enemy);
}

function nextRoom() {
  if (hp <= 0) { endGame(false); return; }
  roomIndex++;
  showRoom();
}

// ── Shared step renderer ──────────────────────────────────────────
function renderSteps(listEl, steps) {
  listEl.innerHTML = '';
  steps.forEach((text, i) => {
    const div = document.createElement('div');
    div.className = 'step-item';
    div.innerHTML = `<span class="step-num">Step ${i + 1}</span><span class="step-text">${text}</span>`;
    listEl.appendChild(div);
  });
}

function renderStepButtons(gridEl, steps, onChoose) {
  gridEl.innerHTML = '';
  steps.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'btn step-btn';
    btn.textContent = `Step ${i + 1} is wrong`;
    btn.addEventListener('click', () => onChoose(i + 1));
    gridEl.appendChild(btn);
  });
  // "No error" option — always wrong in current dataset (teaches skepticism)
  const noErrBtn = document.createElement('button');
  noErrBtn.className = 'btn step-btn step-btn-noerr';
  noErrBtn.textContent = '✓ No error — all steps correct';
  noErrBtn.addEventListener('click', () => onChoose(null));
  gridEl.appendChild(noErrBtn);
}

// ── Door room ─────────────────────────────────────────────────────
function renderDoorRoom(prob) {
  document.getElementById('door-problem').textContent = prob.problem;
  renderSteps(document.getElementById('door-steps'), prob.steps);
  document.getElementById('door-step-btns').style.display = 'flex';
  renderStepButtons(
    document.getElementById('door-step-btns'),
    prob.steps,
    chosenStep => handleChoice(chosenStep, prob, 'door')
  );
  document.getElementById('door-result').style.display = 'none';
}

document.getElementById('door-continue').addEventListener('click', nextRoom);

// ── Combat room ───────────────────────────────────────────────────
function renderCombatRoom(prob, enemy) {
  document.getElementById('enemy-icon').textContent = enemy.icon;
  document.getElementById('enemy-name').textContent = enemy.name + ' blocks your path!';
  document.getElementById('combat-problem').textContent = prob.problem;
  renderSteps(document.getElementById('combat-steps'), prob.steps);
  document.getElementById('combat-step-btns').style.display = 'flex';
  renderStepButtons(
    document.getElementById('combat-step-btns'),
    prob.steps,
    chosenStep => handleChoice(chosenStep, prob, 'combat')
  );
  document.getElementById('combat-result').style.display = 'none';
  startCombatTimer(prob);
}

function startCombatTimer(prob) {
  clearInterval(combatTimer);
  const totalTicks = COMBAT_TIME * 10;
  combatTicks = totalTicks;
  const bar = document.getElementById('combat-timer-bar');
  bar.style.width = '100%';
  combatTimer = setInterval(() => {
    combatTicks--;
    bar.style.width = (combatTicks / totalTicks * 100) + '%';
    if (combatTicks <= 0) {
      clearInterval(combatTimer);
      handleChoice('timeout', prob, 'combat');
    }
  }, 100);
}

document.getElementById('combat-continue').addEventListener('click', nextRoom);

// ── Shared choice handler ─────────────────────────────────────────
function handleChoice(chosen, prob, roomType) {
  if (!gameRunning) return;
  clearInterval(combatTimer);

  // Hide buttons in the active room
  document.getElementById(roomType === 'door' ? 'door-step-btns' : 'combat-step-btns').style.display = 'none';

  const timedOut = chosen === 'timeout';
  const correct  = !timedOut && chosen === prob.wrongStep;

  let msg, delta = 0;
  if (correct) {
    delta = CORRECT_HEAL;
    updateHP(delta);
    msg = `✅ Correct! Step ${prob.wrongStep} was the error. (+${CORRECT_HEAL} HP)`;
  } else if (timedOut) {
    delta = -WRONG_DAMAGE;
    updateHP(delta);
    msg = `⏳ Time's up! Step ${prob.wrongStep} was the error — the guardian strikes. (−${WRONG_DAMAGE} HP)`;
  } else {
    delta = -WRONG_DAMAGE;
    updateHP(delta);
    const chosenLabel = chosen === null ? '"No error"' : `Step ${chosen}`;
    msg = `❌ ${chosenLabel} was not the mistake. Step ${prob.wrongStep} was wrong. (−${WRONG_DAMAGE} HP)`;
  }

  roomLog.push({ icon: roomType === 'door' ? '🚪' : (activeRoom.enemy ? activeRoom.enemy.icon : '👹'), label: prob.title, hpDelta: delta, explain: prob.explain });

  const prefix = roomType === 'door' ? 'door' : 'combat';
  document.getElementById(`${prefix}-result-msg`).textContent = msg;
  document.getElementById(`${prefix}-result-explain`).textContent = '📖 ' + prob.explain;
  document.getElementById(`${prefix}-result`).style.display = 'flex';
}

// ── Game flow ─────────────────────────────────────────────────────
function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('end-screen').style.display   = 'none';
  clearInterval(combatTimer);

  gameRunning = true;
  hp = HP_MAX;
  roomIndex = 0;
  roomLog = [];
  updateHP(0);

  buildRooms();
  roomTotal.textContent = ROOM_COUNT;
  showRoom();
}

function endGame(victory) {
  gameRunning = false;
  clearInterval(combatTimer);

  if (victory) {
    try { localStorage.setItem('mathgames_level3_done', '1'); } catch (e) {}
  }

  document.getElementById('end-title').textContent = victory
    ? (hp >= 80 ? '🏆 Perfect Run!' : '🚪 You Made It Out!')
    : '💀 The Dungeon Claims You...';

  document.getElementById('end-hp').textContent = Math.max(0, hp);

  document.getElementById('end-msg').textContent = victory
    ? (hp >= 80 ? 'Flawless error-catching — you spotted every mistake immediately!' : 'Sharp instincts — you worked through every room and escaped!')
    : 'Your torch flickers out... but every mistake is a lesson. Study the explanations below and try again!';

  const list = document.getElementById('results-list');
  list.innerHTML = '';
  roomLog.forEach(r => {
    const row = document.createElement('div');
    row.className = 'result-row';
    const sign = r.hpDelta > 0 ? '+' : '';
    const cls  = r.hpDelta > 0 ? 'gain' : r.hpDelta < 0 ? 'loss' : 'even';
    row.innerHTML =
      `<span class="r-icon">${r.icon}</span>` +
      `<span class="r-eq">${r.label}</span>` +
      `<span class="r-delta ${cls}">${r.hpDelta === 0 ? '—' : sign + r.hpDelta}</span>` +
      `<span class="r-explain">${r.explain}</span>`;
    list.appendChild(row);
  });

  document.getElementById('end-screen').style.display = 'flex';
}

// ── Boot ──────────────────────────────────────────────────────────
roomTotal.textContent = ROOM_COUNT;
hpBar.style.width = '100%';
hpDisp.textContent = HP_MAX;
