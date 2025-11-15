const grid = document.getElementById("grid");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const popup = document.getElementById("popup");

let timer = 80;
let score = 0;
const totalPairs = 12;

let firstCard = null;
let secondCard = null;
let lockBoard = false;

// Magical emojis
const emojis = ["💖","✨","🍓","🧁","🍫","🌸","💌","💫","🌈","🦄","🍬","🎀"];
const cardsArray = [...emojis, ...emojis]; // 12 pairs
shuffle(cardsArray);

// Create grid cards
cardsArray.forEach(emoji => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `<div class="card-inner">
                      <div class="card-front"></div>
                      <div class="card-back">${emoji}</div>
                    </div>`;
  grid.appendChild(card);

  card.addEventListener("click", () => flipCard(card));
});

// Shuffle function
function shuffle(array){
  array.sort(()=> Math.random() - 0.5);
}

// Flip card
function flipCard(card){
  if(lockBoard || card.classList.contains("flipped")) return;
  card.classList.add("flipped");

  if(!firstCard){
    firstCard = card;
  } else {
    secondCard = card;
    checkMatch();
  }
}

// Check match
function checkMatch(){
  lockBoard = true;
  const firstEmoji = firstCard.querySelector(".card-back").textContent;
  const secondEmoji = secondCard.querySelector(".card-back").textContent;

  if(firstEmoji === secondEmoji){
    score++;
     scoreEl.textContent = `${score} / ${totalPairs}`;
    sparkleCard(firstCard);
    sparkleCard(secondCard);
    resetCards();
    if(score >= totalPairs) endGame(true);
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetCards();
    }, 800);
  }
}

// Reset first and second
function resetCards(){
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Sparkle effect
function sparkleCard(card){
  card.classList.add("sparkle");
  setTimeout(()=> card.classList.remove("sparkle"), 800);
}

// Timer
const interval = setInterval(()=>{
  timer--;
  timerEl.textContent = `⏳ ${timer}s`;
  if(timer <= 0) endGame(false);
},1000);

// End game
function endGame(win){
  clearInterval(interval);
  if(win){
    popup.textContent = "💫 Wow! You found all magical pairs! 💖";
    popup.classList.remove("hidden");
    setTimeout(()=> window.location.href="level5.html",3000);
  } else {
    popup.textContent = "💔 Oops! Time's up, try again! 🫶🏻";
    popup.classList.remove("hidden");
    setTimeout(()=> window.location.reload(),3000);
  }

}




