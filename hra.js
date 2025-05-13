import { findWinner } from 'https://unpkg.com/piskvorky@0.1.4';

const board = document.getElementById('game-board');
const playerSymbol = document.querySelector('.player__symbol');
const gameIconRestart = document.querySelector('.game__icon--restart');
const gameIconHome = document.querySelector('.game__icon--home');

const gameBoard = new Array(100).fill('_');
let currentPlayer = 'circle';

// Vytvoření herního pole
for (let i = 0; i < 100; i++) {
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

const squares = document.querySelectorAll('.game__square');

// Funkce pro kontrolu výhry nebo remízy
const checkGameEnd = (winner) => {
  if (winner === 'o') {
    setTimeout(() => {
      alert('Vyhrálo kolečko!');
      location.reload();
    }, 1000);
    return true;
  } else if (winner === 'x') {
    setTimeout(() => {
      alert('Vyhrál křížek!');
      location.reload();
    }, 1000);
    return true;
  } else if (!gameBoard.includes('_')) {
    setTimeout(() => {
      alert('Hra skončila remízou!');
      location.reload();
    }, 1000);
    return true;
  }
  return false;
};

// Tah AI (křížek)
const playAIMove = async () => {
  // Zablokování všech políček
  squares.forEach(square => square.disabled = true);

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
  const index = x + y * 10;

  const square = squares[index];
  const symbol = square.querySelector('.game__symbol');
  symbol.classList.add('game__symbol--cross');
  gameBoard[index] = 'x';
  square.disabled = true;

  currentPlayer = 'circle';
  playerSymbol.classList.remove('player__symbol--cross');
  playerSymbol.classList.add('player__symbol--circle');

  if (!checkGameEnd(findWinner(gameBoard))) {
    // Odemknutí všech volných políček
    squares.forEach((sq, i) => {
      if (gameBoard[i] === '_') {
        sq.disabled = false;
      }
    });
  }
};

// Kliknutí na políčko
squares.forEach((square, index) => {
  square.addEventListener('click', async () => {
    if (square.disabled || gameBoard[index] !== '_') return;

    const symbol = square.querySelector('.game__symbol');

    // Tah hráče (kolečko)
    symbol.classList.add('game__symbol--circle');
    gameBoard[index] = 'o';
    square.disabled = true;

    currentPlayer = 'cross';
    playerSymbol.classList.remove('player__symbol--circle');
    playerSymbol.classList.add('player__symbol--cross');

    if (!checkGameEnd(findWinner(gameBoard))) {
      await playAIMove();
    }
  });
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