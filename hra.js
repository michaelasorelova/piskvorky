const board = document.getElementById('game-board');
let currentPlayer = 'circle';
const gameSymbol = document.querySelector('.game__symbol');
const gameIconRestart = document.querySelector('.game__icon--restart');

// Vytváření tlačítek

for (let i = 1; i <= 100; i++) {
  const button = document.createElement('button');
  button.className = 'game__square';
  button.id = `square-${i}`;
  board.appendChild(button);
}

// Nastavení počátečního symbolu

gameSymbol.classList.add('circle'); 
gameSymbol.classList.remove('cross');


// Nastavení posluchače událostí pro kliknutí na tlačítka

const squares = document.querySelectorAll('.game__square');
squares.forEach((square) => {
  square.addEventListener('click', (event) => {
    if (event.target.disabled) return;

    if (currentPlayer === 'circle') {
      event.target.classList.add('board__field--circle');
      currentPlayer = 'cross'
      gameSymbol.classList.remove('circle');
      gameSymbol.classList.add('cross');
    } else {
      event.target.classList.add('board__field--cross');
      currentPlayer = 'circle';
      gameSymbol.classList.remove('cross');
      gameSymbol.classList.add('circle');
    }

    event.target.disabled = true;
  });
});

// Obnovení hry po restartu

gameIconRestart.addEventListener('click', (event) => {
  const confirmed = confirm('Opravdu chceš začít znovu?');
  if (!confirmed) {
    event.preventDefault();
  }
});