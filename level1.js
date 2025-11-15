let timer = 15;
let score = 0;
let interval, heartInterval;
const totalHearts = 6;

const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const popup = document.getElementById("popup");
const bucketWrapper = document.getElementById("bucketWrapper");
const bucket = document.getElementById("bucket");
const gameArea = document.getElementById("gameArea");

// Move bucket with mouse/touch
document.addEventListener("mousemove", e => {
  bucketWrapper.style.left = e.clientX - bucketWrapper.offsetWidth / 2 + "px";
});
document.addEventListener("touchmove", e => {
  bucketWrapper.style.left = e.touches[0].clientX - bucketWrapper.offsetWidth / 2 + "px";
});

// Create hearts
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = "💖";
  heart.style.position = "absolute";
  heart.style.left = Math.random() * (window.innerWidth - 50) + "px";
  heart.style.top = "-40px";
  gameArea.appendChild(heart);

  let currentTop = -40;
  const duration = 3 + Math.random() * 2; // 3-5 seconds
  const fallSpeed = (window.innerHeight + 40) / (duration * 1000); // pixels per millisecond

  const fallCheck = setInterval(() => {
    currentTop += fallSpeed * 30; // Move heart down
    heart.style.top = currentTop + "px";

    const rectHeart = heart.getBoundingClientRect();
    const rectBucket = bucketWrapper.getBoundingClientRect();

    // Check collision
    if (
      rectHeart.bottom >= rectBucket.top &&
      rectHeart.left < rectBucket.right &&
      rectHeart.right > rectBucket.left
    ) {
      // Heart caught!
      score++;
      scoreEl.textContent = `❤ ${score} / ${totalHearts}`;
      console.log("Heart caught! Score: " + score);

      heart.remove();
      clearInterval(fallCheck);

      if (score >= totalHearts) {
        endGame(true);
      }
    } else if (currentTop > window.innerHeight) {
      // Heart fell below screen
      heart.remove();
      clearInterval(fallCheck);
    }
  }, 30);
}

// Start game
function startGame() {
  // Display initial score
  scoreEl.textContent = `❤ ${score} / ${totalHearts}`;
  
  heartInterval = setInterval(createHeart, 800);
  interval = setInterval(() => {
    timer--;
    timerEl.textContent = `⏳ ${timer}s`;
    if (timer <= 0) endGame(false);
  }, 1000);
}

// End game
function endGame(win) {
  clearInterval(interval);
  clearInterval(heartInterval);
  document.querySelectorAll(".heart").forEach(h => h.remove());

  if (win) {
    popup.textContent = "💫 Oh dear, you found the 1st key! 💕";
    popup.classList.remove("hidden");
    setTimeout(() => window.location.href = "level2.html", 3000);
  } else {
    popup.textContent = "💔 Oh dear, you tried so well! Don’t give up 🫶🏻";
    popup.classList.remove("hidden");
    setTimeout(() => window.location.reload(), 3000);
  }
}

startGame();