const words = ["love", "kiss", "heart"]; 
let currentIndex = 0;
let score = 0;
const total = words.length;
let timer = 15;
let interval;

const timerEl = document.getElementById("timer");
const jumbledWordEl = document.getElementById("jumbledWord");
const userInput = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");
const scoreEl = document.getElementById("score");
const popup = document.getElementById("popup");

// Function to jumble word
function jumbleWord(word) {
  return word.split('').sort(() => Math.random() - 0.5).join('');
}

// Display word
function displayWord() {
  jumbledWordEl.textContent = "🔀 " + jumbleWord(words[currentIndex]);
  userInput.value = "";
  userInput.focus();
}

// Magical sparkle effect
function sparkleWord() {
  jumbledWordEl.classList.add("sparkle");
  setTimeout(() => jumbledWordEl.classList.remove("sparkle"), 800);

  // Create confetti hearts
  for(let i=0;i<10;i++){
    const heart = document.createElement("div");
    heart.textContent = "💖";
    heart.style.position = "absolute";
    const rect = jumbledWordEl.getBoundingClientRect();
    heart.style.left = rect.left + rect.width/2 + "px";
    heart.style.top = rect.top + "px";
    heart.style.fontSize = "1.2rem";
    heart.style.opacity = 1;
    document.body.appendChild(heart);

    const animDuration = 800 + Math.random()*400;
    heart.animate([
      { transform: "translateY(0px) translateX(0px)", opacity: 1 },
      { transform: `translateY(-80px) translateX(${Math.random()*60-30}px)`, opacity: 0 }
    ], { duration: animDuration, easing: "ease-out" });

    setTimeout(() => heart.remove(), animDuration);
  }
}

// Check answer
function checkAnswer() {
  const answer = userInput.value.trim().toLowerCase();
  if(answer === words[currentIndex]) {
    score++;
    scoreEl.textContent = `${score} / ${total}`;
    sparkleWord();
    currentIndex++;

    if(currentIndex >= total) {
      endGame(true);
    } else {
      setTimeout(displayWord, 500); // wait sparkle to finish
    }
  } else {
    userInput.value = "";
  }
}

// Submit button & Enter
submitBtn.addEventListener("click", checkAnswer);
userInput.addEventListener("keypress", (e) => {
  if(e.key === "Enter") checkAnswer();
});

// Timer
function startTimer() {
  interval = setInterval(() => {
    timer--;
    timerEl.textContent = `⏳ ${timer}s`;
    if(timer <= 0) endGame(false);
  }, 1000);
}

// End game
function endGame(win) {
  clearInterval(interval);
  jumbledWordEl.style.display = "none";
  userInput.style.display = "none";
  submitBtn.style.display = "none";

  if(win) {
    popup.textContent = "💫 Congrats! You guessed all cute words! 💖";
    popup.classList.remove("hidden");
    setTimeout(() => window.location.href = "level3.html", 3000);
  } else {
    popup.textContent = "💔 Time's up! Try again 🫶🏻";
    popup.classList.remove("hidden");
    setTimeout(() => window.location.reload(), 3000);
  }
}

// Start
displayWord();
startTimer();
scoreEl.textContent = `${score} / ${total}`;