import { findWinner } from 'https://unpkg.com/piskvorky@0.1.4'

const board = document.getElementById('game-board');
let currentPlayer = 'circle';
const playerSymbol = document.querySelector('.player__symbol');
const gameIconRestart = document.querySelector('.game__icon--restart');
const gameIconHome = document.querySelector('.game__icon--home');

// Herní pole
const gameBoard = new Array(100).fill('_');

// Tlačítka
for (let i = 1; i <= 100; i++) {
  const button = document.createElement('button');
  button.className = 'game__square';
  button.id = `square-${i}`;

  const symbolWrapper = document.createElement('span');
  symbolWrapper.className = 'game__symbol';

  button.appendChild(symbolWrapper);
  board.appendChild(button);
}

// Počáteční symbol
playerSymbol.classList.add('player__symbol--circle');

// Posluchač událostí pro kliknutí na tlačítka
const squares = document.querySelectorAll('.game__square');
squares.forEach((square, index) => {
  square.addEventListener('click', () => {
    if (square.disabled) return;

    const symbol = square.querySelector('.game__symbol');
    if (!symbol) return;

    // Symbol podle aktuálního hráče
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

    // Blokovat kliknutí na už obsazené políčko
    square.disabled = true;

    // Zkontrolovat vítěze po každém tahu
    const winner = findWinner(gameBoard);
    if (winner === 'o') {
      setTimeout(() => {
        alert('Vyhrálo kolečko!');
        location.reload();
      }, 1000);
    } else if (currentPlayer === 'cross') {
      // Volat API při každém tahu křížku
      (async () => {
        const response = await fetch('https://piskvorky.czechitas-podklady.cz/api/suggest-next-move', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            board: gameBoard,
            player: 'x',
          }),
        });
        const data = await response.json();
        const { x, y } = data.position;
        const index = squares[x + y * 10];
        index.click();
      })();
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

// Potvrzovací dialogy
gameIconRestart.addEventListener('click', (event) => {
  const confirmed = confirm('Opravdu chceš začít znovu?');
  if (!confirmed) {
    event.preventDefault();
  }
});

gameIconHome.addEventListener('click', (event) => {
  event.preventDefault();
  const confirmed = confirm('Opravdu chceš odejít na hlavní stránku?');
  if (confirmed) {
    window.location.href = gameIconHome.getAttribute('href');
  }
});