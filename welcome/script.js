// ── Progress tracking ─────────────────────────────────────────────
// Levels store their completion in localStorage:
//   mathgames_level1_done = '1'
//   mathgames_level2_done = '1'
//   mathgames_level3_done = '1'

function getProgress() {
  try {
    return {
      level1: localStorage.getItem('mathgames_level1_done') === '1',
      level2: localStorage.getItem('mathgames_level2_done') === '1',
      level3: localStorage.getItem('mathgames_level3_done') === '1',
    };
  } catch (e) {
    return { level1: false, level2: false, level3: false };
  }
}

function resetProgress() {
  try {
    localStorage.removeItem('mathgames_level1_done');
    localStorage.removeItem('mathgames_level2_done');
    localStorage.removeItem('mathgames_level3_done');
  } catch (e) {}
  updateUI();
}

// ── UI update ─────────────────────────────────────────────────────
function updateUI() {
  const p = getProgress();

  const card1   = document.getElementById('card-1');
  const card2   = document.getElementById('card-2');
  const card3   = document.getElementById('card-3');
  const status1 = document.getElementById('status-1');
  const status2 = document.getElementById('status-2');
  const status3 = document.getElementById('status-3');
  const btn2    = document.getElementById('btn-2');
  const btn3    = document.getElementById('btn-3');

  // Remove dynamic classes first
  card1.classList.remove('locked', 'completed');
  card2.classList.remove('locked', 'completed');
  card3.classList.remove('locked', 'completed');

  // Remove any injected locked messages
  [card2, card3].forEach(c => {
    const existingMsg = c.querySelector('.locked-msg');
    if (existingMsg) existingMsg.remove();
  });

  // ── Level 1 ──
  if (p.level1) {
    card1.classList.add('completed');
    status1.textContent = '✅';
  } else {
    status1.textContent = '';
  }

  // ── Level 2 ──
  if (!p.level1) {
    // Lock level 2 until level 1 is done
    card2.classList.add('locked');
    btn2.removeAttribute('href');
    btn2.textContent = '🔒 Complete Level 1 first';
    status2.textContent = '🔒';

    // Insert helper message
    const msg = document.createElement('p');
    msg.className = 'locked-msg';
    msg.textContent = 'Finish Ice Peak to unlock this level.';
    card2.appendChild(msg);
  } else {
    // Unlocked
    card2.classList.remove('locked');
    btn2.href = '../level-2/index.html';
    btn2.textContent = 'Play Level 2 →';

    if (p.level2) {
      card2.classList.add('completed');
      status2.textContent = '✅';
      btn2.textContent = 'Play Again →';
    } else {
      status2.textContent = '';
    }
  }

  // ── Level 3 ──
  if (!p.level2) {
    // Lock level 3 until level 2 is done
    card3.classList.add('locked');
    btn3.removeAttribute('href');
    btn3.textContent = '🔒 Complete Level 2 first';
    status3.textContent = '🔒';

    // Insert helper message
    const msg = document.createElement('p');
    msg.className = 'locked-msg';
    msg.textContent = 'Finish Catching Zeroes to unlock this level.';
    card3.appendChild(msg);
  } else {
    // Unlocked
    card3.classList.remove('locked');
    btn3.href = '../level-3/index.html';
    btn3.textContent = 'Play Level 3 →';

    if (p.level3) {
      card3.classList.add('completed');
      status3.textContent = '✅';
      btn3.textContent = 'Play Again →';
    } else {
      status3.textContent = '';
    }
  }
}

// ── Boot ─────────────────────────────────────────────────────────
// Expose resetProgress for the onclick in HTML
window.resetProgress = resetProgress;

updateUI();
