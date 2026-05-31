document.addEventListener('DOMContentLoaded', function () {

  const quizData = [
    {
      question: "How many zeroes/solutions are there?",
      options: ["0", "1", "2", "3"],
      correct: "2",
      drawQ: (ctx, w, h) => {
        const img = new Image();
        img.src = 'https://lh3.googleusercontent.com/d/1SCpe1r-gRYuYgnio1BWnsbdwT5vBSj6F=w1000?authuser=0';
        img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      }
    },
    {
      question: "What are the zeroes or roots of this graph? (Write using the form x={a,b} where a and b represent the x-values of the roots",
      options: ["(-2,5)", "(1,4)", "(-1,3)", "(-1,2)"],
      correct: "(-1,3)",
      drawQ: (ctx, w, h) => {
        const img = new Image();
        img.src = 'https://lh3.googleusercontent.com/d/1SCpe1r-gRYuYgnio1BWnsbdwT5vBSj6F=w1000?authuser=0';
        img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      }
    },
    {
      question: "Identify the vertex of this graph: (Write using ordered pairs)",
      options: ["(2,7.5)", "(2.5,7)", "(1,7)", "(1,-8)"],
      correct: "(1,-8)",
      drawQ: (ctx, w, h) => {
        const img = new Image();
        img.src = 'https://lh3.googleusercontent.com/d/1SCpe1r-gRYuYgnio1BWnsbdwT5vBSj6F=w1000?authuser=0';
        img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      }
    },
    {
      question: "Identify the axis of symmetry for this graph: (Write using the form x=a where a represents the axis of symmetry or the x-value of the vertex)",
      options: ["1", "x=3", "x=1", "x=-1"],
      correct: "x=1",
      drawQ: (ctx, w, h) => {
        const img = new Image();
        img.src = 'https://lh3.googleusercontent.com/d/1SCpe1r-gRYuYgnio1BWnsbdwT5vBSj6F=w1000?authuser=0';
        img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      }
    },
    {
      question: "What is the y-intercept of this graph?",
      options: ["(0,6)", "4", "-6", "(0,-6)"],
      correct: "(0,-6)",
      drawQ: (ctx, w, h) => {
        const img = new Image();
        img.src = 'https://lh3.googleusercontent.com/d/1SCpe1r-gRYuYgnio1BWnsbdwT5vBSj6F=w1000?authuser=0';
        img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      }
    },
    {
      question: "How many zeroes/solutions are there?",
      options: ["0", "1", "2", "3"],
      correct: "1",
      drawQ: (ctx, w, h) => {
        const img = new Image();
        img.src = 'https://lh3.googleusercontent.com/d/1FwTEAycWWmCf9PeKaUuQyT0FVhQKnGMu=w1000?authuser=0';
        img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      }
    },

    {
      question: "What is the zero or roots of this graph? (Write using the form x=b where b represents the x-value of the root)",
      options: ["x=3", "x=1.75", "x=4", "x=2"],
      correct: "x=3",
      drawQ: (ctx, w, h) => {
        const img = new Image();
        img.src = 'https://lh3.googleusercontent.com/d/1FwTEAycWWmCf9PeKaUuQyT0FVhQKnGMu=w1000?authuser=0';
        img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      }
    },

    {
      question: "Identify the vertex of this graph: (Write using ordered pairs)",
      options: ["(0,3)", "(3,0)", "(9,0)", "(0,3)"],
      correct: "(3,0)",
      drawQ: (ctx, w, h) => {
        const img = new Image();
        img.src = 'https://lh3.googleusercontent.com/d/1FwTEAycWWmCf9PeKaUuQyT0FVhQKnGMu=w1000?authuser=0';
        img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      }
    },

 {
      question: "Identify the axis of symmetry for this graph: (Write using the form x=a where a represents the axis of symmetry or the x-value of the vertex)",
      options: ["x=3", "x=9", "x=0", "x=4"],
      correct: "x=3",
      drawQ: (ctx, w, h) => {
        const img = new Image();
        img.src = 'https://lh3.googleusercontent.com/d/1FwTEAycWWmCf9PeKaUuQyT0FVhQKnGMu=w1000?authuser=0';
        img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      }
    },

 {
      question: "What is the y-intercept of this graph?",
      options: ["(0,6)", "(3,0)", "(0,9)", "(4,0)"],
      correct: "(0,9)",
      drawQ: (ctx, w, h) => {
        const img = new Image();
        img.src = 'https://lh3.googleusercontent.com/d/1FwTEAycWWmCf9PeKaUuQyT0FVhQKnGMu=w1000?authuser=0';
        img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      }
    },

	
    
  ];

  const TILES = 16;
  let currentQ = 0, score = 0, meltedTiles = [];
  let tileOrder = [];

  function shuffleArr(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function drawCharacter() {
    const canvas = document.getElementById('char-canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'https://lh3.googleusercontent.com/d/1VobqGVi2wBB_hsAycbKxd_Gl9N4kyXP_=w1000?authuser=0';
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  function buildIceGrid() {
    const grid = document.getElementById('ice-grid');
    grid.innerHTML = '';
    tileOrder = shuffleArr([...Array(TILES).keys()]);
    meltedTiles = [];
    for (let i = 0; i < TILES; i++) {
      const t = document.createElement('div');
      t.className = 'ice-tile';
      t.id = 'tile-' + i;
      grid.appendChild(t);
    }
  }

  function meltNextTiles() {
    const tilesPerQ = Math.floor(TILES / quizData.length);
    const start = currentQ * tilesPerQ;
    const end = (currentQ === quizData.length - 1) ? TILES : start + tilesPerQ;
    for (let i = start; i < end; i++) {
      const tileIdx = tileOrder[i];
      setTimeout(() => {
        document.getElementById('tile-' + tileIdx)?.classList.add('melted');
      }, (i - start) * 120);
    }
  }

  function flashWrong() {
    const remaining = tileOrder.filter(i => !meltedTiles.includes(i));
    if (remaining.length > 0) {
      const t = document.getElementById('tile-' + remaining[0]);
      if (t) { t.classList.add('wrong-flash'); setTimeout(() => t.classList.remove('wrong-flash'), 400); }
    }
  }

  function drawQuestionImg() {
    const canvas = document.getElementById('q-canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    quizData[currentQ].drawQ(ctx, w, h);
  }

  function loadQuestion() {
    document.getElementById('msg').textContent = '';
    document.getElementById('msg').className = 'msg';
    document.getElementById('q-text').textContent = quizData[currentQ].question;
    drawQuestionImg();
    const opts = document.getElementById('options');
    opts.innerHTML = '';
    quizData[currentQ].options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'opt-btn'; b.textContent = opt;
      b.onclick = () => selectAnswer(opt, b);
      opts.appendChild(b);
    });
  }

  function updateProgress() {
    document.getElementById('prog-label').textContent = `${currentQ} / ${quizData.length} revealed`;
    document.getElementById('prog-bar').style.width = `${(currentQ / quizData.length) * 100}%`;
    document.getElementById('score-label').textContent = `Score: ${score}`;
  }

  function selectAnswer(opt, btn) {
    const correct = quizData[currentQ].correct;
    const allBtns = document.querySelectorAll('.opt-btn');
    allBtns.forEach(b => b.disabled = true);
    if (opt === correct) {
      btn.classList.add('correct');
      document.getElementById('msg').textContent = 'Correct! The ice melts away...';
      document.getElementById('msg').className = 'msg ok';
      score++; meltNextTiles(); currentQ++;
      updateProgress();
      setTimeout(() => {
        if (currentQ < quizData.length) loadQuestion();
        else endGame();
      }, 1600);
    } else {
      btn.classList.add('wrong');
      allBtns.forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
      document.getElementById('msg').textContent = 'Incorrect. Moving to the next question.';
      document.getElementById('msg').className = 'msg err';
      flashWrong();
      setTimeout(() => {
        currentQ++;
        updateProgress();
        if (currentQ < quizData.length) loadQuestion();
        else endGame();
      }, 1600);
    }
  }

  function endGame() {
    // Mark level 1 complete in localStorage so welcome screen can update
    try { localStorage.setItem('mathgames_level1_done', '1'); } catch(e) {}

    document.getElementById('game-area').style.display = 'none';
    const es = document.getElementById('end-screen');
    es.style.display = 'block';
    const ec = document.getElementById('end-canvas');
    const ctx = ec.getContext('2d');
    const w = ec.width, h = ec.height;
    const src = document.getElementById('char-canvas');
    ctx.drawImage(src, 0, 0, w, h);
    ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#f5e642"; ctx.font = "bold 28px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("Pi the Spy!", w / 2, h / 2);
    document.getElementById('end-title').textContent = score === quizData.length ? "Ice wall destroyed!" : `You scored ${score} / ${quizData.length}`;
    document.getElementById('end-sub').textContent = score === quizData.length
      ? "Perfect score — Pi the Spy is fully revealed!"
      : "Pi the Spy is stuck! Play again to melt the rest!";
    document.getElementById('prog-bar').style.width = '100%';
    document.getElementById('prog-label').textContent = `${quizData.length} / ${quizData.length} revealed`;
  }

  function restart() {
    currentQ = 0; score = 0; meltedTiles = [];
    document.getElementById('end-screen').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    buildIceGrid(); drawCharacter(); updateProgress(); loadQuestion();
  }

  window.restart = restart;

  drawCharacter();
  buildIceGrid();
  updateProgress();
  loadQuestion();
});
