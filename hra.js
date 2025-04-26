import { findWinner } from 'https://unpkg.com/piskvorky@0.1.4'

const board = document.getElementById('game-board');
let currentPlayer = 'circle';
const playerSymbol = document.querySelector('.player__symbol');
const gameIconRestart = document.querySelector('.game__icon--restart');

// Herní pole
const gameBoard = new Array(100).fill('_');

// Vytváření tlačítek
for (let i = 1; i <= 100; i++) {
  const button = document.createElement('button');
  button.className = 'game__square';
  button.id = `square-${i}`;

  const symbolWrapper = document.createElement('span');
  symbolWrapper.className = 'game__symbol';

  button.appendChild(symbolWrapper);
  board.appendChild(button);
}

// Nastavení počátečního symbolu
playerSymbol.classList.add('player__symbol--circle');

// Nastavení posluchače událostí pro kliknutí na tlačítka
const squares = document.querySelectorAll('.game__square');
squares.forEach((square, index) => {
  square.addEventListener('click', () => {
    if (square.disabled) return;

    const symbol = square.querySelector('.game__symbol');
    if (!symbol) return;

    // Přidání symbolu podle aktuálního hráče
    if (currentPlayer === 'circle') {
      symbol.classList.add('game__symbol--circle');
      gameBoard[index] = 'o';
      currentPlayer = 'cross';
      playerSymbol.classList.remove('player__symbol--circle');
      playerSymbol.classList.add('player__symbol--cross');
    } else {
      symbol.classList.add('game__symbol--cross');
      gameBoard[index] = 'x';
      currentPlayer = 'circle';
      playerSymbol.classList.remove('player__symbol--cross');
      playerSymbol.classList.add('player__symbol--circle');
    }

    // Zablokování kliknutí na už obsazené políčko
    square.disabled = true;

    // Zkontroluj vítěze po každém tahu
    const winner = findWinner(gameBoard);
    if (winner === 'o') {
      setTimeout(() => {
        alert('Vyhrálo kolečko!');
        location.reload();
      }, 1000);
    } else if (winner === 'x') {
      setTimeout(() => {
        alert('Vyhrál křížek!');
        location.reload();
      }, 1000);
    } else if (!gameBoard.includes('_')) {
      setTimeout(() => {
        alert('Hra skončila remízou!');
        location.reload();
      }, 1000);
    }
  })
});

// Obnovení hry po restartu
gameIconRestart.addEventListener('click', (event) => {
  const confirmed = confirm('Opravdu chceš začít znovu?');
  if (!confirmed) {
    event.preventDefault();
  }
});