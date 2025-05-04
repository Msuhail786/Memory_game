const board = document.getElementById('game-board');
const levelUpText = document.getElementById('level-up');
const restartButton = document.getElementById('restart-button');

const levels = [
 ['A', 'B', 'C', 'D', 'E', 'F'], // Level 1: Alphabets
 ['🐶', '🐱', '🦁', '🐸', '🐵', '🦊'], // Level 2: Animals
 ['🌹', '🌻', '🌼', '🌸', '🌷', '💐'] // Level 3: Flowers
];

let currentLevel = 0;
let cards = [];
let firstCard = null;
let lock = false;

function startLevel() {
 levelUpText.textContent = '';
 cards = [...levels[currentLevel], ...levels[currentLevel]];
 cards = cards.sort(() => 0.5 - Math.random());
 board.innerHTML = '';
 
 cards.forEach(symbol => {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.symbol = symbol;
  card.addEventListener('click', () => revealCard(card));
  board.appendChild(card);
 });
 
 firstCard = null;
 lock = false;
}

function revealCard(card) {
 if (lock || card.classList.contains('revealed')) return;
 card.textContent = card.dataset.symbol;
 card.classList.add('revealed');
 
 if (!firstCard) {
  firstCard = card;
 } else {
  if (firstCard.dataset.symbol === card.dataset.symbol) {
   firstCard = null;
   checkLevelUp();
  } else {
   lock = true;
   setTimeout(() => {
    firstCard.textContent = '';
    card.textContent = '';
    firstCard.classList.remove('revealed');
    card.classList.remove('revealed');
    firstCard = null;
    lock = false;
   }, 800);
  }
 }
}

function checkLevelUp() {
 const remaining = document.querySelectorAll('.card:not(.revealed)');
 if (remaining.length === 0) {
  setTimeout(() => {
   if (currentLevel < levels.length - 1) {
    currentLevel++;
    levelUpText.textContent = `Level ${currentLevel + 1} Unlocked!`;
    setTimeout(() => {
     startLevel();
    }, 1500);
   } else {
    levelUpText.textContent = 'You Won! All Levels Completed!';
   }
  }, 500);
 }
}

restartButton.addEventListener('click', () => {
 currentLevel = 0;
 startLevel();
});

startLevel();