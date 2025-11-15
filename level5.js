// ------------------- MAZE GAME FULL JS ---------------------

let maze, playerEl;

// Maze layout: 0 = path, 1 = wall
const mazeLayout = [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0]
];

// Player starting position
let player = { r: 0, c: 0 };

// Goal position
const goal = { r: 4, c: 4 };

// Move counter
let movesCount = 0;


// ------------------- INIT GAME ---------------------
window.onload = function () {
    maze = document.getElementById("maze");
    generateMaze();
    placePlayer(player.r, player.c);
};

// Create the maze UI
function generateMaze() {
    maze.innerHTML = "";
    for (let r = 0; r < mazeLayout.length; r++) {
        for (let c = 0; c < mazeLayout[0].length; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";

            if (mazeLayout[r][c] === 1) {
                cell.classList.add("wall");
            }
            if (r === goal.r && c === goal.c) {
                cell.classList.add("goal");
            }

            cell.id = cell-${r}-${c};
            maze.appendChild(cell);
        }
    }
}

// Place player in UI
function placePlayer(r, c) {
    if (playerEl) {
        playerEl.classList.remove("player");
    }
    const cell = document.getElementById(cell-${r}-${c});
    cell.classList.add("player");
    playerEl = cell;
}

// Check maze boundaries
function inBounds(r, c) {
    return r >= 0 && r < mazeLayout.length && c >= 0 && c < mazeLayout[0].length;
}

// Main movement function
function tryMove(dr, dc) {
    const newR = player.r + dr;
    const newC = player.c + dc;

    if (!inBounds(newR, newC)) return;
    if (mazeLayout[newR][newC] !== 0 && !(newR === goal.r && newC === goal.c)) return;

    movesCount++;
    movePlayer(newR, newC);
}

// Move player and check for win
function movePlayer(newR, newC) {
    player.r = newR;
    player.c = newC;
    placePlayer(newR, newC);

    if (newR === goal.r && newC === goal.c) {
        setTimeout(() => {
            alert("💗 Congratulations Kittu! You completed the maze! 💗");
        }, 100);
    }
}


// ------------------- KEYBOARD CONTROLS ---------------------
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") tryMove(-1, 0);
    if (e.key === "ArrowDown") tryMove(1, 0);
    if (e.key === "ArrowLeft") tryMove(0, -1);
    if (e.key === "ArrowRight") tryMove(0, 1);
});


// ------------------- BUTTON CONTROLS ---------------------
document.querySelector(".up").addEventListener("click", () => tryMove(-1, 0));
document.querySelector(".down").addEventListener("click", () => tryMove(1, 0));
document.querySelector(".left").addEventListener("click", () => tryMove(0, -1));
document.querySelector(".right").addEventListener("click", () => tryMove(0, 1));


// ------------------- SWIPE CONTROLS (MOBILE) ---------------------
let sx = 0, sy = 0;

maze.addEventListener("touchstart", (e) => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
}, { passive: true });

maze.addEventListener("touchend", (e) => {
    const ex = e.changedTouches[0].clientX;
    const ey = e.changedTouches[0].clientY;

    const dx = ex - sx;
    const dy = ey - sy;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 25) tryMove(0, 1);      // swipe right
        else if (dx < -25) tryMove(0, -1); // left
    } else {
        if (dy > 25) tryMove(1, 0);      // down
        else if (dy < -25) tryMove(-1, 0); // up
    }
}, { passive: true });


// ------------------- END OF FILE ---------------------

