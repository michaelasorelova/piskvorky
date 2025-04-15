const board = document.getElementById('game-board');
let currentPlayer = 'circle';
const playerSymbol = document.querySelector('.player__symbol');
const gameIconRestart = document.querySelector('.game__icon--restart');

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
squares.forEach((square) => {
  square.addEventListener('click', () => {
    if (square.disabled) return;

    const symbol = square.querySelector('.game__symbol');
    if (!symbol) return;

    if (currentPlayer === 'circle') {
      symbol.classList.add('game__symbol--circle');
      currentPlayer = 'cross';
      playerSymbol.classList.remove('player__symbol--circle');
      playerSymbol.classList.add('player__symbol--cross');
    } else {
      symbol.classList.add('game__symbol--cross');
      currentPlayer = 'circle';
      playerSymbol.classList.remove('player__symbol--cross');
      playerSymbol.classList.add('player__symbol--circle');
    }

    square.disabled = true;
  });
});

// Obnovení hry po restartu

gameIconRestart.addEventListener('click', (event) => {
  const confirmed = confirm('Opravdu chceš začít znovu?');
  if (!confirmed) {
    event.preventDefault();
  }
});