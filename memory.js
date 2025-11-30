const allSymbols = ["🍎", "⭐", "🎵", "⚡", "🔥", "🌙", "🍀", "💎", "🐱", "🚗", "🎮"];

let level = "easy";

// Define pairs per level
const levelConfig = {
    easy: 6,
    medium: 8,
    hard: 10
};

let cardsArray = [];
let gameBoard = document.getElementById("gameBoard");
let moves = 0, matchedCount = 0, firstCard = null, lockBoard = false;
let timer = 0, interval = null;

document.getElementById("restartBtn").onclick = restartGame;

/* ---------------- LEVEL CHANGE ---------------- */
function changeLevel() {
    level = document.getElementById("levelSelect").value;
    restartGame();
}

/* ---------------- SHUFFLE ---------------- */
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

/* ---------------- TIMER ---------------- */
function startTimer() {
    interval = setInterval(() => {
        timer++;
        document.getElementById("time").textContent = timer;
    }, 1000);
}

/* ---------------- GENERATE CARDS ---------------- */
function generateCards() {
    const pairs = levelConfig[level];

    // Select symbols based on level
    const selected = allSymbols.slice(0, pairs);
    cardsArray = [...selected, ...selected];

    gameBoard.style.gridTemplateColumns =
        level === "hard" ? "repeat(5, 1fr)" :
        level === "medium" ? "repeat(4, 1fr)" :
        "repeat(4, 1fr)";

    gameBoard.innerHTML = "";
    shuffle(cardsArray).forEach(symbol => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="face front"></div>
            <div class="face back">${symbol}</div>
        `;
        card.onclick = () => flipCard(card, symbol);
        gameBoard.appendChild(card);
    });
}

/* ---------------- FLIP CARD ---------------- */
function flipCard(card, symbol) {
    if (lockBoard || card.classList.contains("flip")) return;

    if (moves === 0 && timer === 0) startTimer();

    card.classList.add("flip");

    if (!firstCard) {
        firstCard = { card, symbol };
        return;
    }

    moves++;
    document.getElementById("moves").textContent = moves;

    if (firstCard.symbol === symbol) {
        matchedCount++;
        firstCard = null;

        const totalPairs = levelConfig[level];
        if (matchedCount === totalPairs) winGame();

    } else {
        lockBoard = true;
        setTimeout(() => {
            card.classList.remove("flip");
            firstCard.card.classList.remove("flip");
            firstCard = null;
            lockBoard = false;
        }, 800);
    }
}

/* ---------------- WIN GAME ---------------- */
function winGame() {
    clearInterval(interval);
    document.getElementById("finalMoves").textContent = moves;
    document.getElementById("finalTime").textContent = timer;
    document.getElementById("winModal").style.display = "flex";
}

/* ---------------- RESTART ---------------- */
function restartGame() {
    matchedCount = 0;
    moves = 0;
    timer = 0;
    firstCard = null;
    lockBoard = false;

    clearInterval(interval);
    interval = null;

    document.getElementById("moves").textContent = "0";
    document.getElementById("time").textContent = "0";
    document.getElementById("winModal").style.display = "none";

    generateCards();
}

generateCards();