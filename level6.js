// ------- PUZZLE 1 : PATTERN LOCK -------
let correctPattern = ["1","3","5","8"];
let userPattern = [];

const dots = document.querySelectorAll(".dot");
const patternStatus = document.getElementById("patternStatus");
const checkPattern = document.getElementById("checkPattern");

dots.forEach(dot => {
    dot.addEventListener("click", () => {
        dot.classList.add("active");
        userPattern.push(dot.getAttribute("data-id"));
    });
});

checkPattern.addEventListener("click", () => {
    if(JSON.stringify(userPattern) === JSON.stringify(correctPattern)){
        patternStatus.textContent = "💗 Pattern Unlocked!";
        setTimeout(()=>{
            document.getElementById("puzzle1").style.display="none";
            document.getElementById("puzzle2").style.display="block";
        },1000);
    } else {
        patternStatus.textContent = "❌ Wrong Pattern, Try Again!";
        userPattern = [];
        dots.forEach(d => d.classList.remove("active"));
    }
});

// ------- PUZZLE 2 : CODE LOCK -------
const checkCode = document.getElementById("checkCode");
const codeStatus = document.getElementById("codeStatus");

checkCode.addEventListener("click", ()=> {
    let val = document.getElementById("codeInput").value;
    if(val == 36){
        codeStatus.textContent = "✔ Code Correct!";
        setTimeout(()=>{
            document.getElementById("puzzle2").style.display="none";
            document.getElementById("puzzle3").style.display="block";
        },1000);
    } else {
        codeStatus.textContent = "❌ Wrong Code!";
    }
});

// ------- PUZZLE 3 : SYMBOL MATCH -------
const cards = document.querySelectorAll(".card");
const matchStatus = document.getElementById("matchStatus");

let first = null;
let second = null;
let matched = 0;

cards.forEach(card=>{
    card.addEventListener("click", ()=> {
        if(card.textContent !== "❓") return;

        card.textContent = card.getAttribute("data-symbol");

        if(first === null){
            first = card;
        } 
        else {
            second = card;

            if(first.getAttribute("data-symbol") === second.getAttribute("data-symbol")){
                matched++;
                first = null;  
                second = null;

                if(matched === 2){
                    matchStatus.textContent = "💘 All matched!";

                    setTimeout(()=>{
                        window.location.href = "final.html";
                    },1200);
                }
            }
            else {
                setTimeout(()=>{
                    first.textContent="❓";
                    second.textContent="❓";
                    first = null;
                    second = null;
                },700);
            }
        }
    });
});