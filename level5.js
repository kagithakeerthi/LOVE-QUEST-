// Maze Layout: 0 = empty, 1 = wall
// 8x8 cute mini maze
const mazeLayout = [
    [0,1,1,1,1,1,1,1],
    [0,0,0,0,1,0,0,1],
    [1,0,1,0,1,0,1,1],
    [1,0,1,0,0,0,0,0],
    [1,0,1,1,1,1,1,0],
    [1,0,0,0,0,0,1,0],
    [1,1,1,1,1,0,1,0],
    [1,1,1,1,1,0,0,0] // Goal at (7,7)
];

const ROWS = mazeLayout.length;
const COLS = mazeLayout[0].length;

// Maze Container
const maze = document.getElementById("maze");
const popup = document.getElementById("popup");

// hide popup at start (robust)
if (popup) {
    popup.classList.add("hidden");
    popup.style.display = "none";
}

if (!maze) {
    console.error("Maze container (#maze) not found in DOM.");
} else {
    // Clear any existing content (useful during hot-reload)
    maze.innerHTML = "";
}

// keep a 2D array of cell elements for safe access
const cellEls = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

// Create Maze Grid (do NOT mark player here)
mazeLayout.forEach((row, r) => {
    row.forEach((cell, c) => {
        const div = document.createElement("div");
        div.classList.add("cell");
        div.dataset.r = r;
        div.dataset.c = c;
        if (cell === 1) div.classList.add("wall");
        if (r === ROWS - 1 && c === COLS - 1) div.classList.add("goal");
        if (maze) maze.appendChild(div);
        cellEls[r][c] = div;
    });
});

// find a safe starting cell (first empty cell that's not the goal)
function findStart() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (mazeLayout[r][c] === 0 && !(r === ROWS - 1 && c === COLS - 1)) {
                return { r, c };
            }
        }
    }
    // fallback to any non-wall cell
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (mazeLayout[r][c] === 0) return { r, c };
        }
    }
    // final fallback
    return { r: 0, c: 0 };
}

// Player Position (initialized to safe start)
let player = findStart();

// place player class on DOM
function placePlayer() {
    // clear any previous player classes
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const el = cellEls[r][c];
            if (el) el.classList.remove("player");
        }
    }
    const startCell = cellEls[player.r] && cellEls[player.r][player.c];
    if (startCell) startCell.classList.add("player");
}

// initialize player on the grid
placePlayer();

// Utility: check if position is inside maze
function inBounds(r, c) {
    return r >= 0 && r < ROWS && c >= 0 && c < COLS;
}

// Only mark the game as started after the first valid move
let gameStarted = false;
let movesCount = 0; // explicit move counter

// Movement handler (named so it can be removed if needed)
function handleKeydown(e) {
    // ignore if maze not present
    if (!maze) return;

    let newR = player.r;
    let newC = player.c;

    if (e.key === "ArrowUp") newR--;
    else if (e.key === "ArrowDown") newR++;
    else if (e.key === "ArrowLeft") newC--;
    else if (e.key === "ArrowRight") newC++;
    else return;

    // Bounds + wall check
    if (!inBounds(newR, newC)) return;
    if (mazeLayout[newR][newC] !== 0) return; // blocked (wall)

    // valid movement -> mark game started and move
    gameStarted = true;
    movesCount++;
    movePlayer(newR, newC);
}

// ensure we don't add multiple listeners
document.removeEventListener("keydown", handleKeydown);
document.addEventListener("keydown", handleKeydown);

// Move Player Function
function movePlayer(newR, newC) {
    // guard against invalid indices
    if (!inBounds(newR, newC)) return;

    const oldCell = cellEls[player.r] && cellEls[player.r][player.c];
    const newCell = cellEls[newR] && cellEls[newR][newC];

    if (oldCell) oldCell.classList.remove("player");
    if (newCell) newCell.classList.add("player");

    // Update position
    player.r = newR;
    player.c = newC;

    // Check win only after the game has actually started via movement
    // require at least one move (movesCount > 0) to avoid auto-win on load
    if (movesCount > 0 && player.r === ROWS - 1 && player.c === COLS - 1) {
        if (popup) {
            popup.classList.remove("hidden");
            popup.style.display = "block";
        } else {
            // fallback: simple alert
            alert("You reached the goal! 🎉");
        }
    }
}

// Safety: if for any reason player was placed on goal, move them to a safe start
if (player.r === ROWS - 1 && player.c === COLS - 1) {
    player = findStart();
    placePlayer();
}