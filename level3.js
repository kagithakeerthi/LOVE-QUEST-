// heart_click_game2.js — easier mode adjustments
// Changes made to make the game more forgiving:
// - Longer target lifespan, slower spawn rate
// - Much fewer fake (broken) hearts
// - More allowed misses (lives)
// - Slower/less aggressive difficulty scaling
// - Smaller target movement so they are easier to click

let interval = null;
let targetInterval = null;
let difficulty = 1;

// Game state (easier settings)
let timer = 10;         // seconds
let score = 0;
let missed = 0;
const maxMisses = 5;    // more lives for an easier game
const totalTargets = 6;

// Configure easy-mode probabilities / timings
const fakeRate = 0.10;           // only 10% fake hearts (was ~25%)
const spawnIntervalBase = 1400;  // spawn a bit slower (was 1200)
const minAutoRemove = 2500;      // targets stay longer (was ~1200..)
const baseAutoRemove = 4000;     // base lifespan for a target

// Collect outstanding timeouts so we can clear them on end
const autoRemoveTimeouts = new Set();

// Elements
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const popup = document.getElementById("popup");
const arrowWrapper = document.getElementById("arrowWrapper");
const arrow = document.getElementById("arrow");
const gameArea = document.getElementById("gameArea");

// Safe helpers
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
function safeSetText(el, text) { if (el) el.textContent = text; }

// Move arrow horizontally (guard the wrapper exists)
if (arrowWrapper) {
  document.addEventListener("mousemove", e => {
    const left = clamp(e.clientX - arrowWrapper.offsetWidth / 2, 0, window.innerWidth - arrowWrapper.offsetWidth);
    arrowWrapper.style.left = left + "px";
  });

  document.addEventListener("touchmove", e => {
    if (!e.touches || !e.touches[0]) return;
    const left = clamp(e.touches[0].clientX - arrowWrapper.offsetWidth / 2, 0, window.innerWidth - arrowWrapper.offsetWidth);
    arrowWrapper.style.left = left + "px";
  }, { passive: true });
}

// Initialize UI values (safe)
safeSetText(timerEl, `⏳ ${timer}s`);
safeSetText(scoreEl, `${score} / ${totalTargets}`);
updateLives();

// Create random target with increasing difficulty (but mild)
function createTarget() {
  if (!gameArea) return;

  const target = document.createElement("div");
  target.classList.add("target");
  target.style.position = "absolute";
  target.style.userSelect = "none";
  target.style.cursor = "pointer";

  // Much lower fake heart chance for easier play
  const isFake = Math.random() < fakeRate;

  if (isFake) {
    target.textContent = "💔"; // Broken heart - don't click!
    target.style.opacity = "0.85";
  } else {
    target.textContent = "💖";
  }

  // Random position (within viewport)
  const maxLeft = Math.max(0, window.innerWidth - 60);
  const maxTop = Math.max(0, window.innerHeight - 140);
  target.style.left = Math.random() * maxLeft + "px";
  target.style.top = Math.random() * maxTop + "px";

  // Smaller moving animation for easier clicking
  const moveX = (Math.random() - 0.5) * 60; // was 150
  const moveY = (Math.random() - 0.5) * 30; // was 80
  target.style.animation = `floatTarget ${2 + Math.random()}s infinite`;
  target.style.setProperty('--moveX', moveX + 'px');
  target.style.setProperty('--moveY', moveY + 'px');

  gameArea.appendChild(target);

  // Named handler so we can remove it safely
  function onHit(e) {
    e.stopPropagation();

    if (isFake) {
      // Clicked on broken heart - lose a life
      missed++;
      target.style.filter = "grayscale(100%)";
      target.textContent = "❌";
      updateLives();

      if (missed >= maxMisses) {
        endGame(false, "❌ Out of lives! Try again 🫶🏻");
      }
    } else {
      // Hit real heart
      score++;
      safeSetText(scoreEl, `${score} / ${totalTargets}`);

      // Very gentle difficulty increase (every 4 hits)
      if (score % 4 === 0) {
        difficulty += 0.1;
        updateDifficulty();
      }

      sparkleTarget(target);
    }

    // remove handler and target
    target.removeEventListener("pointerdown", onHit);
    setTimeout(() => target.remove(), 200);

    if (score >= totalTargets) endGame(true);
  }

  // Prefer pointer events (works for mouse & touch)
  target.addEventListener("pointerdown", onHit);

  // Auto-remove target after time (decreases slightly with difficulty but stays generous)
  const duration = Math.max(minAutoRemove, Math.round(baseAutoRemove - difficulty * 150));
  const autoId = setTimeout(() => {
    autoRemoveTimeouts.delete(autoId);
    if (target.parentElement) {
      if (!isFake) {
        // missing a real heart counts as a mistake
        missed++;
        updateLives();
        if (missed >= maxMisses) {
          endGame(false, "⏱️ You missed too many hearts!");
        }
      }
      target.removeEventListener("pointerdown", onHit);
      target.remove();
    }
  }, duration);

  autoRemoveTimeouts.add(autoId);
  return { target, autoId };
}

// Update lives display
function updateLives() {
  const remaining = Math.max(0, maxMisses - missed);
  safeSetText(livesEl, `❤️ Lives: ${remaining}`);
}

// Update difficulty display and adjust spawn rate (gentler)
function updateDifficulty() {
  const speedBoost = Math.min(difficulty * 5, 20); // much smaller boost
  if (targetInterval) clearInterval(targetInterval);
  const newInterval = Math.max(800, spawnIntervalBase - speedBoost);
  targetInterval = setInterval(createTarget, newInterval);
}

// Sparkle + confetti effect when hitting a real heart
function sparkleTarget(target) {
  if (!target) return;
  target.classList.add("sparkle");
  setTimeout(() => target.classList.remove("sparkle"), 800);

  for (let i = 0; i < 8; i++) {
    const heart = document.createElement("div");
    heart.textContent = "💖";
    heart.style.position = "absolute";
    heart.style.pointerEvents = "none";
    const rect = target.getBoundingClientRect();
    heart.style.left = (rect.left + rect.width / 2 - 8) + "px";
    heart.style.top = (rect.top + rect.height / 2 - 8) + "px";
    heart.style.fontSize = "1rem";
    heart.style.opacity = "1";
    heart.style.zIndex = "9999";
    document.body.appendChild(heart);

    const animDuration = 700 + Math.random() * 300;
    heart.animate([
      { transform: "translateY(0px) translateX(0px)", opacity: 1 },
      { transform: `translateY(-60px) translateX(${Math.random() * 40 - 20}px)`, opacity: 0 }
    ], { duration: animDuration, easing: "ease-out" });

    setTimeout(() => heart.remove(), animDuration);
  }
}

// Start game (resets state)
function startGame() {
  // Stop previous intervals/timeouts if any
  if (interval) { clearInterval(interval); interval = null; }
  if (targetInterval) { clearInterval(targetInterval); targetInterval = null; }
  autoRemoveTimeouts.forEach(id => clearTimeout(id));
  autoRemoveTimeouts.clear();
  document.querySelectorAll(".target").forEach(t => t.remove());

  // Reset state
  difficulty = 1;
  timer = 10;   // set to 20s at start
  score = 0;
  missed = 0;

  safeSetText(timerEl, `⏳ ${timer}s`);
  safeSetText(scoreEl, `${score} / ${totalTargets}`);
  updateLives();

  // Initial spawn interval (easier/slower)
  targetInterval = setInterval(createTarget, spawnIntervalBase);
  // Spawn one immediately so the player sees a target right away
  createTarget();

  // Timer
  interval = setInterval(() => {
    timer--;
    safeSetText(timerEl, `⏳ ${timer}s`);
    if (timer <= 0) {
      if (score >= totalTargets) {
        endGame(true, "⏳💖 Time’s up but you WON!");
      } else {
        endGame(false, "⏳💔 Time’s up! Try again!");
      }
    }
  }, 1000);
}

// End game
function endGame(win, message = "") {
  // Prevent multiple calls doing duplicate work
  if (interval) { clearInterval(interval); interval = null; }
  if (targetInterval) { clearInterval(targetInterval); targetInterval = null; }

  // Clear pending auto-remove timeouts
  autoRemoveTimeouts.forEach(id => clearTimeout(id));
  autoRemoveTimeouts.clear();

  // Remove all targets
  document.querySelectorAll(".target").forEach(t => t.remove());

  if (popup) {
    if (win) {
      popup.textContent = "💫 Master Cupid! You beat the challenge! 💖";
      popup.classList.remove("hidden");
      setTimeout(() => window.location.href = "level4.html", 3000);
    } else {
      popup.textContent = `💔 ${message || "Oh no! Try again 🫶🏻"}`;
      popup.classList.remove("hidden");
      setTimeout(() => window.location.reload(), 3000);
    }
  } else {
    // fallback behavior
    if (win) {
      setTimeout(() => window.location.href = "level4.html", 2000);
    } else {
      setTimeout(() => window.location.reload(), 1500);
    }
  }
}

// Start automatically
startGame();