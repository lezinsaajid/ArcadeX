// Global Game State
let gameState = {
    currentGame: null,
    theme: 'dark'
};

// Game Data Storage
let gameData = {
    ticTacToe: {
        board: Array(9).fill(''),
        currentPlayer: 'X',
        gameMode: 'single',
        score: { X: 0, O: 0 },
        gameActive: true
    },
    snake: {
        snake: [{ x: 10, y: 10 }],
        food: { x: 15, y: 15 },
        direction: { x: 0, y: 0 },
        score: 0,
        gameRunning: false,
        gameLoop: null,
        speed: 150
    },
    memory: {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        startTime: null,
        gameActive: false,
        timer: null
    },
    flappy: {
        bird: { x: 50, y: 300, velocity: 0 },
        pipes: [],
        score: 0,
        gameRunning: false,
        gameLoop: null,
        gravity: 0.5,
        jumpPower: -8
    },
    clickTest: {
        clicks: 0,
        timeLeft: 10,
        gameActive: false,
        startTime: null,
        timer: null
    },
    whackMole: {
        score: 0,
        timeLeft: 30,
        gameActive: false,
        moles: [],
        timer: null,
        moleTimer: null
    },
    puzzle2048: {
        board: Array(16).fill(0),
        score: 0,
        size: 4
    },
    slidingPuzzle: {
        tiles: [],
        emptyIndex: 15,
        moves: 0,
        solved: false
    },
    sudoku: {
        board: Array(81).fill(0),
        solution: Array(81).fill(0),
        difficulty: 'easy',
        mistakes: 0
    },
    rps: {
        playerScore: 0,
        aiScore: 0,
        ties: 0,
        choices: ['rock', 'paper', 'scissors'],
        emojis: { rock: '🪨', paper: '📄', scissors: '✂️' }
    },
    guess: {
        targetNumber: 0,
        attempts: 0,
        guesses: [],
        gameActive: false
    },
    colorMatch: {
        colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
        sequence: [],
        playerSequence: [],
        level: 1,
        gameActive: false,
        showingSequence: false
    },
    chess: {
        board: [],
        currentPlayer: 'white',
        selectedSquare: null,
        gameActive: true
    },
    solitaire: {
        piles: [],
        moves: 0
    },
    mahjong: {
        tiles: [],
        selectedTile: null,
        pairsFound: 0
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
    setupEventListeners();
    showHome();
});

function setupEventListeners() {
    document.addEventListener('keydown', handleGlobalKeyPress);

    const guessInput = document.getElementById('guess-input');
    if (guessInput) {
        guessInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') makeGuess();
        });
    }

    const clickArea = document.getElementById('click-area');
    if (clickArea) {
        clickArea.addEventListener('click', handleClickTestClick);
    }
}

// Global key handler
function handleGlobalKeyPress(e) {
    if (gameState.currentGame === 'snake' && gameData.snake.gameRunning) {
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (gameData.snake.direction.y === 0) {
                    gameData.snake.direction = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (gameData.snake.direction.y === 0) {
                    gameData.snake.direction = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (gameData.snake.direction.x === 0) {
                    gameData.snake.direction = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (gameData.snake.direction.x === 0) {
                    gameData.snake.direction = { x: 1, y: 0 };
                }
                break;
        }
        e.preventDefault();
    }

    if (gameState.currentGame === '2048') {
        switch (e.key) {
            case 'ArrowUp':
                move2048('up');
                e.preventDefault();
                break;
            case 'ArrowDown':
                move2048('down');
                e.preventDefault();
                break;
            case 'ArrowLeft':
                move2048('left');
                e.preventDefault();
                break;
            case 'ArrowRight':
                move2048('right');
                e.preventDefault();
                break;
        }
    }

    if (gameState.currentGame === 'flappy' && gameData.flappy.gameRunning) {
        if (e.key === ' ' || e.key === 'Spacebar') {
            flapBird();
            e.preventDefault();
        }
    }
}

// Theme toggle
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');

    if (body.dataset.theme === 'dark') {
        body.dataset.theme = 'light';
        themeIcon.className = 'fas fa-moon';
        gameState.theme = 'light';
    } else {
        body.dataset.theme = 'dark';
        themeIcon.className = 'fas fa-sun';
        gameState.theme = 'dark';
    }
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--accent);
                color: var(--bg-primary);
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: 600;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function showGameDetails(gameName) {
    showNotification(`${gameName} game details - Click Play Game to start!`);
}

// Navigation Functions
function showHome() {
    hideAllScreens();
    document.getElementById('home-screen').classList.add('active');
    gameState.currentGame = null;
}

function hideAllScreens() {
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.remove('active');
    });
}

function startGame(gameName) {
    hideAllScreens();
    document.getElementById(`${gameName}-game`).classList.add('active');
    gameState.currentGame = gameName;

    switch (gameName) {
        case 'tic-tac-toe': initTicTacToe(); break;
        case 'snake': initSnakeGame(); break;
        case 'memory': initMemoryGame(); break;
        case 'flappy': initFlappyGame(); break;
        case 'click-test': initClickTest(); break;
        case 'whack-mole': initWhackMole(); break;
        case '2048': init2048Game(); break;
        case 'sliding-puzzle': initSlidingPuzzle(); break;
        case 'sudoku': initSudoku(); break;
        case 'rock-paper-scissors': initRPS(); break;
        case 'guess-number': initGuessGame(); break;
        case 'color-match': initColorMatch(); break;
        case 'chess': initChess(); break;
        case 'solitaire': initSolitaire(); break;
        case 'mahjong': initMahjong(); break;
    }
}

// Tic-Tac-Toe Game
function initTicTacToe() {
    resetTicTacToe();
    createTicTacToeBoard();
}

function createTicTacToeBoard() {
    const board = document.getElementById('tic-tac-toe-board');
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'tic-tac-toe-cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => makeTicTacToeMove(i));
        board.appendChild(cell);
    }
}

function setGameMode(mode) {
    gameData.ticTacToe.gameMode = mode;

    const singleBtn = document.getElementById('single-player-btn');
    const twoBtn = document.getElementById('two-player-btn');

    if (mode === 'single') {
        singleBtn.className = 'btn mr-4';
        twoBtn.className = 'btn-secondary';
    } else {
        singleBtn.className = 'btn-secondary mr-4';
        twoBtn.className = 'btn';
    }

    resetTicTacToe();
}

function makeTicTacToeMove(index) {
    const game = gameData.ticTacToe;

    if (!game.gameActive || game.board[index] !== '') return;

    game.board[index] = game.currentPlayer;
    updateTicTacToeDisplay();

    if (checkTicTacToeWin()) {
        game.score[game.currentPlayer]++;
        updateTicTacToeScore();
        showNotification(`Player ${game.currentPlayer} wins! 🎉`);
        game.gameActive = false;
        setTimeout(resetTicTacToe, 2000);
        return;
    }

    if (game.board.every(cell => cell !== '')) {
        showNotification("It's a tie! 🤝");
        setTimeout(resetTicTacToe, 2000);
        return;
    }

    game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('current-player').textContent = game.currentPlayer;

    if (game.gameMode === 'single' && game.currentPlayer === 'O' && game.gameActive) {
        setTimeout(makeAIMove, 500);
    }
}

function makeAIMove() {
    const game = gameData.ticTacToe;
    const availableMoves = game.board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);

    if (availableMoves.length === 0) return;

    let move = findWinningMove('O') || findWinningMove('X') || availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeTicTacToeMove(move);
}

function findWinningMove(player) {
    const game = gameData.ticTacToe;
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const line = [game.board[a], game.board[b], game.board[c]];

        if (line.filter(cell => cell === player).length === 2 && line.includes('')) {
            return pattern[line.indexOf('')];
        }
    }
    return null;
}

function checkTicTacToeWin() {
    const game = gameData.ticTacToe;
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return game.board[a] && game.board[a] === game.board[b] && game.board[a] === game.board[c];
    });
}

function updateTicTacToeDisplay() {
    const cells = document.querySelectorAll('.tic-tac-toe-cell');
    cells.forEach((cell, index) => {
        cell.textContent = gameData.ticTacToe.board[index];
    });
}

function updateTicTacToeScore() {
    const game = gameData.ticTacToe;
    document.getElementById('tic-score').textContent = `X: ${game.score.X} | O: ${game.score.O}`;
}

function resetTicTacToe() {
    gameData.ticTacToe.board = Array(9).fill('');
    gameData.ticTacToe.currentPlayer = 'X';
    gameData.ticTacToe.gameActive = true;
    document.getElementById('current-player').textContent = 'X';
    updateTicTacToeDisplay();
}

function clearTicTacToeScore() {
    gameData.ticTacToe.score = { X: 0, O: 0 };
    updateTicTacToeScore();
}

// Snake Game
function initSnakeGame() {
    resetSnakeGame();
    updateSnakeDisplay();
}

function startSnakeGame() {
    const game = gameData.snake;
    if (game.gameRunning) return;

    game.gameRunning = true;
    document.getElementById('snake-start-btn').textContent = 'Game Running...';
    document.getElementById('snake-start-btn').disabled = true;

    game.gameLoop = setInterval(updateSnake, game.speed);
}

function updateSnake() {
    const game = gameData.snake;

    const head = {
        x: game.snake[0].x + game.direction.x,
        y: game.snake[0].y + game.direction.y
    };

    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 ||
        game.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endSnakeGame();
        return;
    }

    game.snake.unshift(head);

    if (head.x === game.food.x && head.y === game.food.y) {
        game.score += 10;
        generateSnakeFood();
        updateSnakeScore();

        if (game.speed > 80) {
            game.speed -= 2;
            clearInterval(game.gameLoop);
            game.gameLoop = setInterval(updateSnake, game.speed);
        }
    } else {
        game.snake.pop();
    }

    updateSnakeDisplay();
}

function generateSnakeFood() {
    const game = gameData.snake;
    do {
        game.food = {
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20)
        };
    } while (game.snake.some(segment => segment.x === game.food.x && segment.y === game.food.y));
}

function updateSnakeDisplay() {
    const board = document.getElementById('snake-board');
    board.innerHTML = '';
    const game = gameData.snake;

    game.snake.forEach((segment, index) => {
        const element = document.createElement('div');
        element.className = `snake-cell ${index === 0 ? 'snake-head' : 'snake-body'}`;
        element.style.left = segment.x * 20 + 'px';
        element.style.top = segment.y * 20 + 'px';
        board.appendChild(element);
    });

    const food = document.createElement('div');
    food.className = 'snake-cell snake-food';
    food.style.left = game.food.x * 20 + 'px';
    food.style.top = game.food.y * 20 + 'px';
    board.appendChild(food);
}

function updateSnakeScore() {
    document.getElementById('snake-score').textContent = gameData.snake.score;
}

function endSnakeGame() {
    const game = gameData.snake;
    clearInterval(game.gameLoop);
    game.gameRunning = false;

    document.getElementById('snake-start-btn').textContent = 'Start Game';
    document.getElementById('snake-start-btn').disabled = false;

    showNotification(`Game Over! Score: ${game.score}`);
}

function pauseSnakeGame() {
    const game = gameData.snake;
    if (game.gameRunning) {
        clearInterval(game.gameLoop);
        game.gameRunning = false;
        document.getElementById('snake-start-btn').textContent = 'Resume';
        document.getElementById('snake-start-btn').disabled = false;
    }
}

function resetSnakeGame() {
    const game = gameData.snake;
    clearInterval(game.gameLoop);

    game.snake = [{ x: 10, y: 10 }];
    game.direction = { x: 0, y: 0 };
    game.score = 0;
    game.gameRunning = false;
    game.speed = 150;

    generateSnakeFood();
    updateSnakeScore();
    updateSnakeDisplay();

    document.getElementById('snake-start-btn').textContent = 'Start Game';
    document.getElementById('snake-start-btn').disabled = false;
}

// Memory Game
function initMemoryGame() {
    startMemoryGame();
}

function startMemoryGame() {
    const game = gameData.memory;

    game.matchedPairs = 0;
    game.moves = 0;
    game.flippedCards = [];
    game.startTime = Date.now();
    game.gameActive = true;

    const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🌟'];
    game.cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

    createMemoryBoard();
    updateMemoryStats();

    clearInterval(game.timer);
    game.timer = setInterval(updateMemoryTimer, 1000);
}

function createMemoryBoard() {
    const board = document.getElementById('memory-board');
    board.innerHTML = '';

    gameData.memory.cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.innerHTML = `
                    <div class="card-front">❓</div>
                    <div class="card-back" style="display: none;">${symbol}</div>
                `;
        card.addEventListener('click', () => flipMemoryCard(index));
        board.appendChild(card);
    });
}

function flipMemoryCard(index) {
    const game = gameData.memory;
    if (!game.gameActive || game.flippedCards.length >= 2 || game.flippedCards.includes(index)) return;

    const card = document.querySelector(`[data-index="${index}"]`);
    card.classList.add('flipped');
    const front = card.querySelector('.card-front');
    const back = card.querySelector('.card-back');
    front.style.display = 'none';
    back.style.display = 'flex';

    game.flippedCards.push(index);

    if (game.flippedCards.length === 2) {
        game.moves++;
        updateMemoryStats();
        setTimeout(checkMemoryMatch, 1000);
    }
}

function checkMemoryMatch() {
    const game = gameData.memory;
    const [first, second] = game.flippedCards;

    if (game.cards[first] === game.cards[second]) {
        const firstCard = document.querySelector(`[data-index="${first}"]`);
        const secondCard = document.querySelector(`[data-index="${second}"]`);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        game.matchedPairs++;
        updateMemoryStats();

        if (game.matchedPairs === 8) {
            endMemoryGame();
        }
    } else {
        [first, second].forEach(index => {
            const card = document.querySelector(`[data-index="${index}"]`);
            card.classList.remove('flipped');
            const front = card.querySelector('.card-front');
            const back = card.querySelector('.card-back');
            front.style.display = 'flex';
            back.style.display = 'none';
        });
    }

    game.flippedCards = [];
}

function updateMemoryStats() {
    const game = gameData.memory;
    document.getElementById('memory-moves').textContent = game.moves;
    document.getElementById('memory-matches').textContent = `${game.matchedPairs}/8`;
}

function updateMemoryTimer() {
    const game = gameData.memory;
    if (!game.gameActive) return;

    const elapsed = Math.floor((Date.now() - game.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    document.getElementById('memory-time').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function endMemoryGame() {
    const game = gameData.memory;
    clearInterval(game.timer);
    game.gameActive = false;

    const totalTime = Math.floor((Date.now() - game.startTime) / 1000);
    showNotification(`Completed in ${totalTime}s with ${game.moves} moves! 🎉`);
}

function showMemoryHint() {
    const cards = document.querySelectorAll('.memory-card:not(.matched)');
    cards.forEach(card => {
        card.classList.add('flipped');
        const front = card.querySelector('.card-front');
        const back = card.querySelector('.card-back');
        front.style.display = 'none';
        back.style.display = 'flex';
    });

    setTimeout(() => {
        cards.forEach(card => {
            if (!card.classList.contains('matched')) {
                card.classList.remove('flipped');
                const front = card.querySelector('.card-front');
                const back = card.querySelector('.card-back');
                front.style.display = 'flex';
                back.style.display = 'none';
            }
        });
    }, 2000);
}

// Flappy Bird Game
function initFlappyGame() {
    resetFlappyGame();
}

function startFlappyGame() {
    const game = gameData.flappy;
    if (game.gameRunning) return;

    game.gameRunning = true;
    game.bird = { x: 50, y: 300, velocity: 0 };
    game.pipes = [];
    game.score = 0;

    updateFlappyScore();
    document.getElementById('flappy-start-btn').style.display = 'none';

    game.gameLoop = setInterval(updateFlappy, 20);

    const board = document.getElementById('flappy-board');
    board.addEventListener('click', flapBird);
    board.style.cursor = 'pointer';
}

function flapBird() {
    if (gameData.flappy.gameRunning) {
        gameData.flappy.bird.velocity = gameData.flappy.jumpPower;
    }
}

function updateFlappy() {
    const game = gameData.flappy;

    game.bird.velocity += game.gravity;
    game.bird.y += game.bird.velocity;

    if (game.bird.y < 0 || game.bird.y > 560) {
        endFlappyGame();
        return;
    }

    game.pipes.forEach(pipe => {
        pipe.x -= 2;
    });

    game.pipes = game.pipes.filter(pipe => pipe.x > -60);

    if (game.pipes.length === 0 || game.pipes[game.pipes.length - 1].x < 200) {
        const gap = 150;
        const gapStart = Math.random() * (400 - gap) + 50;
        game.pipes.push({
            x: 400,
            topHeight: gapStart,
            bottomY: gapStart + gap,
            bottomHeight: 600 - (gapStart + gap),
            scored: false
        });
    }

    game.pipes.forEach(pipe => {
        if (game.bird.x + 40 > pipe.x && game.bird.x < pipe.x + 60) {
            if (game.bird.y < pipe.topHeight || game.bird.y + 40 > pipe.bottomY) {
                endFlappyGame();
                return;
            }
        }

        if (!pipe.scored && game.bird.x > pipe.x + 60) {
            pipe.scored = true;
            game.score++;
            updateFlappyScore();
        }
    });

    updateFlappyDisplay();
}

function updateFlappyDisplay() {
    const game = gameData.flappy;
    const board = document.getElementById('flappy-board');

    const bird = document.getElementById('flappy-bird');
    bird.style.left = game.bird.x + 'px';
    bird.style.top = game.bird.y + 'px';

    board.querySelectorAll('.flappy-pipe').forEach(pipe => pipe.remove());

    game.pipes.forEach(pipe => {
        const topPipe = document.createElement('div');
        topPipe.className = 'flappy-pipe';
        topPipe.style.cssText = `
                    left: ${pipe.x}px;
                    top: 0px;
                    height: ${pipe.topHeight}px;
                    background: var(--text-secondary);
                    position: absolute;
                    width: 60px;
                    border-radius: 8px;
                `;
        board.appendChild(topPipe);

        const bottomPipe = document.createElement('div');
        bottomPipe.className = 'flappy-pipe';
        bottomPipe.style.cssText = `
                    left: ${pipe.x}px;
                    top: ${pipe.bottomY}px;
                    height: ${pipe.bottomHeight}px;
                    background: var(--text-secondary);
                    position: absolute;
                    width: 60px;
                    border-radius: 8px;
                `;
        board.appendChild(bottomPipe);
    });
}

function updateFlappyScore() {
    document.getElementById('flappy-score').textContent = gameData.flappy.score;
}

function endFlappyGame() {
    const game = gameData.flappy;
    clearInterval(game.gameLoop);
    game.gameRunning = false;

    const board = document.getElementById('flappy-board');
    board.removeEventListener('click', flapBird);
    board.style.cursor = 'default';

    document.getElementById('flappy-start-btn').style.display = 'inline-block';

    showNotification(`Game Over! Score: ${game.score}`);
}

function resetFlappyGame() {
    const game = gameData.flappy;
    clearInterval(game.gameLoop);

    game.bird = { x: 50, y: 300, velocity: 0 };
    game.pipes = [];
    game.score = 0;
    game.gameRunning = false;

    updateFlappyScore();
    updateFlappyDisplay();

    document.getElementById('flappy-start-btn').style.display = 'inline-block';
}

// Click Speed Test
function initClickTest() {
    resetClickTest();
}

function handleClickTestClick() {
    const game = gameData.clickTest;
    if (!game.gameActive) {
        startClickTest();
        return;
    }

    game.clicks++;
    updateClickTestDisplay();
}

function startClickTest() {
    const game = gameData.clickTest;
    game.clicks = 0;
    game.timeLeft = 10;
    game.gameActive = true;
    game.startTime = Date.now();

    updateClickTestDisplay();

    const area = document.getElementById('click-area');
    area.innerHTML = `
                <div class="text-center">
                    <div class="text-4xl mb-4">👆</div>
                    <div class="text-2xl font-bold">Click Fast!</div>
                    <div class="opacity-70 mt-2">Time: <span id="click-timer">10</span>s</div>
                </div>
            `;

    clearInterval(game.timer);
    game.timer = setInterval(() => {
        game.timeLeft--;
        const timerEl = document.getElementById('click-timer');
        if (timerEl) timerEl.textContent = game.timeLeft;

        if (game.timeLeft <= 0) {
            clearInterval(game.timer);
            endClickTest();
        }
    }, 1000);
}

function updateClickTestDisplay() {
    const game = gameData.clickTest;
    document.getElementById('click-count').textContent = game.clicks;
    document.getElementById('click-time').textContent = game.timeLeft;

    const cps = game.timeLeft < 10 ? (game.clicks / (10 - game.timeLeft)).toFixed(1) : '0.0';
    document.getElementById('click-cps').textContent = cps;
}

function endClickTest() {
    const game = gameData.clickTest;
    game.gameActive = false;

    const cps = (game.clicks / 10).toFixed(1);
    const rating = getClickRating(parseFloat(cps));

    document.getElementById('final-clicks').textContent = game.clicks;
    document.getElementById('final-cps').textContent = cps;
    document.getElementById('click-rating').textContent = rating;

    document.getElementById('click-results').classList.remove('hidden');

    showNotification(`Test complete! ${cps} CPS - ${rating}`);
}

function getClickRating(cps) {
    if (cps >= 12) return 'Lightning Fast ⚡';
    if (cps >= 10) return 'Very Fast 🚀';
    if (cps >= 8) return 'Fast 💨';
    if (cps >= 6) return 'Good 👍';
    if (cps >= 4) return 'Average 😐';
    return 'Slow 🐌';
}

function resetClickTest() {
    const game = gameData.clickTest;
    clearInterval(game.timer);
    game.clicks = 0;
    game.timeLeft = 10;
    game.gameActive = false;

    updateClickTestDisplay();

    document.getElementById('click-results').classList.add('hidden');

    const area = document.getElementById('click-area');
    area.innerHTML = `
                <div class="text-center">
                    <div class="text-4xl mb-4">👆</div>
                    <div class="text-2xl font-bold">Click to Start!</div>
                    <div class="opacity-70 mt-2">Click as fast as you can for 10 seconds</div>
                </div>
            `;
}

// Whack A Mole Game
function initWhackMole() {
    resetWhackMole();
    createWhackBoard();
}

function createWhackBoard() {
    const board = document.getElementById('whack-board');
    board.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const hole = document.createElement('div');
        hole.className = 'mole-hole';
        hole.dataset.index = i;

        const mole = document.createElement('div');
        mole.className = 'mole';
        mole.textContent = '🐹';
        mole.addEventListener('click', () => whackMole(i));

        hole.appendChild(mole);
        board.appendChild(hole);
    }
}

function startWhackMole() {
    const game = gameData.whackMole;
    if (game.gameActive) return;

    game.gameActive = true;
    game.score = 0;
    game.timeLeft = 30;

    updateWhackDisplay();

    document.getElementById('whack-start-btn').textContent = 'Playing...';
    document.getElementById('whack-start-btn').disabled = true;

    game.timer = setInterval(() => {
        game.timeLeft--;
        updateWhackDisplay();

        if (game.timeLeft <= 0) {
            endWhackMole();
        }
    }, 1000);

    game.moleTimer = setInterval(showRandomMole, 800);
}

function showRandomMole() {
    const game = gameData.whackMole;
    if (!game.gameActive) return;

    const holes = document.querySelectorAll('.mole');
    holes.forEach(mole => mole.classList.remove('up'));

    const randomIndex = Math.floor(Math.random() * 9);
    const mole = holes[randomIndex];
    mole.classList.add('up');

    setTimeout(() => {
        if (mole.classList.contains('up')) {
            mole.classList.remove('up');
        }
    }, 600);
}

function whackMole(index) {
    const game = gameData.whackMole;
    if (!game.gameActive) return;

    const mole = document.querySelector(`[data-index="${index}"] .mole`);
    if (mole.classList.contains('up')) {
        mole.classList.remove('up');
        game.score += 10;
        updateWhackDisplay();
        showNotification('+10 points! 🔨');
    }
}

function updateWhackDisplay() {
    const game = gameData.whackMole;
    document.getElementById('whack-score').textContent = game.score;
    document.getElementById('whack-time').textContent = game.timeLeft;
}

function endWhackMole() {
    const game = gameData.whackMole;
    clearInterval(game.timer);
    clearInterval(game.moleTimer);
    game.gameActive = false;

    document.getElementById('whack-start-btn').textContent = 'Start Game';
    document.getElementById('whack-start-btn').disabled = false;

    const holes = document.querySelectorAll('.mole');
    holes.forEach(mole => mole.classList.remove('up'));

    showNotification(`Game Over! Final Score: ${game.score}`);
}

function resetWhackMole() {
    const game = gameData.whackMole;
    clearInterval(game.timer);
    clearInterval(game.moleTimer);

    game.score = 0;
    game.timeLeft = 30;
    game.gameActive = false;

    updateWhackDisplay();

    document.getElementById('whack-start-btn').textContent = 'Start Game';
    document.getElementById('whack-start-btn').disabled = false;
}

// 2048 Game
function init2048Game() {
    start2048Game();
}

function start2048Game() {
    const game = gameData.puzzle2048;
    game.board = Array(16).fill(0);
    game.score = 0;

    addRandom2048Tile();
    addRandom2048Tile();

    update2048Display();
    update2048Score();
}

function addRandom2048Tile() {
    const game = gameData.puzzle2048;
    const emptyCells = game.board.map((cell, index) => cell === 0 ? index : null).filter(val => val !== null);

    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        game.board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    }
}

function update2048Display() {
    const board = document.getElementById('2048-board');
    board.innerHTML = '';

    gameData.puzzle2048.board.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.className = 'puzzle-2048-cell';
        cell.textContent = value > 0 ? value : '';
        cell.style.background = value === 0 ? 'var(--bg-tertiary)' : getTileColor(value);
        cell.style.color = value <= 4 ? 'var(--bg-primary)' : 'var(--text-primary)';
        cell.style.fontSize = value >= 1024 ? '1rem' : value >= 128 ? '1.2rem' : '1.5rem';
        board.appendChild(cell);
    });
}

function getTileColor(value) {
    const colors = {
        2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563',
        32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61',
        512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'
    };
    return colors[value] || '#3c3a32';
}

function update2048Score() {
    document.getElementById('2048-score').textContent = gameData.puzzle2048.score;
}

function move2048(direction) {
    const game = gameData.puzzle2048;
    let moved = false;
    const size = 4;

    let board2D = [];
    for (let i = 0; i < size; i++) {
        board2D[i] = game.board.slice(i * size, (i + 1) * size);
    }

    if (direction === 'up') board2D = rotateMatrix(board2D, 3);
    else if (direction === 'down') board2D = rotateMatrix(board2D, 1);
    else if (direction === 'right') board2D = rotateMatrix(board2D, 2);

    for (let row = 0; row < size; row++) {
        const oldRow = [...board2D[row]];

        board2D[row] = board2D[row].filter(val => val !== 0);

        for (let col = 0; col < board2D[row].length - 1; col++) {
            if (board2D[row][col] === board2D[row][col + 1]) {
                board2D[row][col] *= 2;
                game.score += board2D[row][col];
                board2D[row].splice(col + 1, 1);
            }
        }

        while (board2D[row].length < size) {
            board2D[row].push(0);
        }

        if (JSON.stringify(oldRow) !== JSON.stringify(board2D[row])) {
            moved = true;
        }
    }

    if (direction === 'up') board2D = rotateMatrix(board2D, 1);
    else if (direction === 'down') board2D = rotateMatrix(board2D, 3);
    else if (direction === 'right') board2D = rotateMatrix(board2D, 2);

    game.board = board2D.flat();

    if (moved) {
        addRandom2048Tile();
        update2048Display();
        update2048Score();

        if (game.board.includes(2048)) {
            showNotification('You reached 2048! 🎉');
        }
    }
}

function rotateMatrix(matrix, times) {
    let result = matrix;
    for (let i = 0; i < times; i++) {
        result = result[0].map((_, index) => result.map(row => row[index]).reverse());
    }
    return result;
}

// Sliding Puzzle
function initSlidingPuzzle() {
    const game = gameData.slidingPuzzle;

    game.tiles = Array.from({ length: 15 }, (_, i) => i + 1).concat([0]);
    game.emptyIndex = 15;
    game.moves = 0;
    game.solved = false;

    shufflePuzzle();
    updateSlidingPuzzleDisplay();
}

function shufflePuzzle() {
    const game = gameData.slidingPuzzle;

    for (let i = 0; i < 1000; i++) {
        const validMoves = getValidMoves();
        if (validMoves.length > 0) {
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            swapTiles(game.emptyIndex, randomMove);
        }
    }
}

function getValidMoves() {
    const game = gameData.slidingPuzzle;
    const moves = [];
    const row = Math.floor(game.emptyIndex / 4);
    const col = game.emptyIndex % 4;

    if (row > 0) moves.push((row - 1) * 4 + col);
    if (row < 3) moves.push((row + 1) * 4 + col);
    if (col > 0) moves.push(row * 4 + (col - 1));
    if (col < 3) moves.push(row * 4 + (col + 1));

    return moves;
}

function swapTiles(index1, index2) {
    const game = gameData.slidingPuzzle;
    [game.tiles[index1], game.tiles[index2]] = [game.tiles[index2], game.tiles[index1]];

    if (game.tiles[index1] === 0) game.emptyIndex = index1;
    else if (game.tiles[index2] === 0) game.emptyIndex = index2;
}

function slidingPuzzleClick(index) {
    const game = gameData.slidingPuzzle;
    if (game.solved) return;

    const validMoves = getValidMoves();
    if (validMoves.includes(index)) {
        swapTiles(game.emptyIndex, index);
        game.moves++;
        updateSlidingPuzzleDisplay();

        if (checkSlidingPuzzleSolved()) {
            game.solved = true;
            showNotification(`Puzzle solved in ${game.moves} moves! 🎉`);
        }
    }
}

function updateSlidingPuzzleDisplay() {
    const board = document.getElementById('sliding-puzzle-board');
    board.innerHTML = '';

    gameData.slidingPuzzle.tiles.forEach((value, index) => {
        const tile = document.createElement('div');
        tile.className = `sliding-tile ${value === 0 ? 'empty' : ''}`;
        tile.textContent = value === 0 ? '' : value;
        if (value !== 0) {
            tile.addEventListener('click', () => slidingPuzzleClick(index));
        }
        board.appendChild(tile);
    });

    document.getElementById('sliding-moves').textContent = gameData.slidingPuzzle.moves;
}

function checkSlidingPuzzleSolved() {
    const game = gameData.slidingPuzzle;
    for (let i = 0; i < 15; i++) {
        if (game.tiles[i] !== i + 1) return false;
    }
    return game.tiles[15] === 0;
}

function solveSlidingPuzzle() {
    const game = gameData.slidingPuzzle;
    game.tiles = Array.from({ length: 15 }, (_, i) => i + 1).concat([0]);
    game.emptyIndex = 15;
    game.solved = true;
    updateSlidingPuzzleDisplay();
    showNotification('Puzzle solved!');
}

// Sudoku Game
function initSudoku() {
    generateSudokuPuzzle();
    updateSudokuDisplay();
}

function generateSudokuPuzzle() {
    const game = gameData.sudoku;

    game.solution = generateCompleteSudoku();
    game.board = [...game.solution];
    const cellsToRemove = game.difficulty === 'easy' ? 40 : 55;

    for (let i = 0; i < cellsToRemove; i++) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * 81);
        } while (game.board[randomIndex] === 0);

        game.board[randomIndex] = 0;
    }

    game.mistakes = 0;
}

function generateCompleteSudoku() {
    const board = Array(81).fill(0);

    for (let box = 0; box < 3; box++) {
        fillBox(board, box * 3, box * 3);
    }

    solveSudokuBoard(board);
    return board;
}

function fillBox(board, row, col) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(numbers);

    let index = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[(row + i) * 9 + (col + j)] = numbers[index++];
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function solveSudokuBoard(board) {
    for (let i = 0; i < 81; i++) {
        if (board[i] === 0) {
            for (let num = 1; num <= 9; num++) {
                if (isValidSudokuMove(board, i, num)) {
                    board[i] = num;
                    if (solveSudokuBoard(board)) return true;
                    board[i] = 0;
                }
            }
            return false;
        }
    }
    return true;
}

function isValidSudokuMove(board, index, num) {
    const row = Math.floor(index / 9);
    const col = index % 9;

    for (let c = 0; c < 9; c++) {
        if (board[row * 9 + c] === num) return false;
    }

    for (let r = 0; r < 9; r++) {
        if (board[r * 9 + col] === num) return false;
    }

    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            if (board[r * 9 + c] === num) return false;
        }
    }

    return true;
}

function updateSudokuDisplay() {
    const board = document.getElementById('sudoku-board');
    board.innerHTML = '';

    gameData.sudoku.board.forEach((value, index) => {
        const cell = document.createElement('input');
        cell.className = `sudoku-cell ${gameData.sudoku.solution[index] !== 0 && value !== 0 ? 'given' : ''}`;
        cell.type = 'number';
        cell.min = '1';
        cell.max = '9';
        cell.value = value === 0 ? '' : value;

        if (gameData.sudoku.solution[index] !== 0 && value !== 0) {
            cell.readOnly = true;
        }

        cell.addEventListener('input', (e) => {
            sudokuCellInput(index, e.target.value);
        });

        board.appendChild(cell);
    });

    document.getElementById('sudoku-mistakes').textContent = gameData.sudoku.mistakes;
}

function sudokuCellInput(index, value) {
    const game = gameData.sudoku;
    const num = parseInt(value);

    if (isNaN(num) || num < 1 || num > 9) {
        game.board[index] = 0;
        return;
    }

    if (num === game.solution[index]) {
        game.board[index] = num;

        if (game.board.every((cell, i) => cell === game.solution[i])) {
            showNotification(`Sudoku solved with ${game.mistakes} mistakes! 🎉`);
        }
    } else {
        game.mistakes++;
        updateSudokuDisplay();
        showNotification('Incorrect number!');
    }
}

function setSudokuDifficulty(difficulty) {
    gameData.sudoku.difficulty = difficulty;
    initSudoku();
}

function solveSudoku() {
    const game = gameData.sudoku;
    game.board = [...game.solution];
    updateSudokuDisplay();
    showNotification('Sudoku solved!');
}

// Rock Paper Scissors
function initRPS() {
    resetRPS();
}

function playRPS(playerChoice) {
    const game = gameData.rps;
    const aiChoice = game.choices[Math.floor(Math.random() * 3)];

    document.getElementById('player-choice').textContent = game.emojis[playerChoice];
    document.getElementById('ai-choice').textContent = game.emojis[aiChoice];

    let result = '';

    if (playerChoice === aiChoice) {
        result = "It's a tie! 🤝";
        game.ties++;
    } else if (
        (playerChoice === 'rock' && aiChoice === 'scissors') ||
        (playerChoice === 'paper' && aiChoice === 'rock') ||
        (playerChoice === 'scissors' && aiChoice === 'paper')
    ) {
        result = 'You win! 🎉';
        game.playerScore++;
    } else {
        result = 'AI wins! 🤖';
        game.aiScore++;
    }

    document.getElementById('rps-result').textContent = result;
    updateRPSScore();
}

function updateRPSScore() {
    const game = gameData.rps;
    document.getElementById('rps-player-score').textContent = game.playerScore;
    document.getElementById('rps-ai-score').textContent = game.aiScore;
    document.getElementById('rps-ties').textContent = game.ties;
}

function resetRPS() {
    const game = gameData.rps;
    game.playerScore = 0;
    game.aiScore = 0;
    game.ties = 0;

    document.getElementById('player-choice').textContent = '❓';
    document.getElementById('ai-choice').textContent = '❓';
    document.getElementById('rps-result').textContent = 'Make your choice!';

    updateRPSScore();
}

// Guess the Number
function initGuessGame() {
    startGuessGame();
}

function startGuessGame() {
    const game = gameData.guess;
    game.targetNumber = Math.floor(Math.random() * 100) + 1;
    game.attempts = 0;
    game.guesses = [];
    game.gameActive = true;

    document.getElementById('guess-hint').textContent = 'Make your first guess!';
    document.getElementById('guess-attempts').textContent = '0';
    document.getElementById('guess-input').value = '';
    document.getElementById('guess-history').innerHTML = '<div class="opacity-70 text-center">No guesses yet</div>';
}

function makeGuess() {
    const game = gameData.guess;
    if (!game.gameActive) return;

    const input = document.getElementById('guess-input');
    const guess = parseInt(input.value);

    if (isNaN(guess) || guess < 1 || guess > 100) {
        showNotification('Please enter a number between 1 and 100');
        return;
    }

    game.attempts++;
    game.guesses.push(guess);

    let hint = '';
    if (guess === game.targetNumber) {
        hint = `🎉 Correct! You found ${game.targetNumber} in ${game.attempts} attempts!`;
        game.gameActive = false;
    } else if (guess < game.targetNumber) {
        hint = '📈 Too low! Try a higher number.';
    } else {
        hint = '📉 Too high! Try a lower number.';
    }

    document.getElementById('guess-hint').textContent = hint;
    document.getElementById('guess-attempts').textContent = game.attempts;

    addGuessToHistory(guess, hint);

    input.value = '';
    input.focus();
}

function addGuessToHistory(guess, result) {
    const history = document.getElementById('guess-history');

    if (history.children.length === 1 && history.children[0].textContent === 'No guesses yet') {
        history.innerHTML = '';
    }

    const entry = document.createElement('div');
    entry.className = 'text-sm';
    entry.textContent = `${gameData.guess.attempts}. ${guess} - ${result.replace(/[🎉📈📉]/g, '').trim()}`;

    history.insertBefore(entry, history.firstChild);
}

// Color Match Game
function initColorMatch() {
    startColorMatch();
}

function startColorMatch() {
    const game = gameData.colorMatch;
    game.level = 1;
    game.sequence = [];
    game.playerSequence = [];
    game.gameActive = true;
    game.showingSequence = false;

    document.getElementById('color-level').textContent = game.level;
    showNotification('Watch the sequence and repeat it!');
    setTimeout(() => nextColorLevel(), 1000);
}

function nextColorLevel() {
    const game = gameData.colorMatch;

    const randomColor = game.colors[Math.floor(Math.random() * game.colors.length)];
    game.sequence.push(randomColor);
    game.playerSequence = [];

    showColorSequence();
}

function showColorSequence() {
    const game = gameData.colorMatch;
    game.showingSequence = true;

    let index = 0;
    const interval = setInterval(() => {
        if (index < game.sequence.length) {
            flashColor(game.sequence[index]);
            index++;
        } else {
            clearInterval(interval);
            game.showingSequence = false;
            document.getElementById('color-instruction').textContent = 'Now repeat the sequence!';
        }
    }, 800);
}

function flashColor(color) {
    document.getElementById('color-instruction').textContent = `Flash: ${color.toUpperCase()}`;
}

function colorClicked(color) {
    const game = gameData.colorMatch;
    if (game.showingSequence || !game.gameActive) return;

    game.playerSequence.push(color);

    const currentIndex = game.playerSequence.length - 1;
    if (game.playerSequence[currentIndex] !== game.sequence[currentIndex]) {
        showNotification('Wrong sequence! Game Over!');
        game.gameActive = false;
        return;
    }

    if (game.playerSequence.length === game.sequence.length) {
        game.level++;
        document.getElementById('color-level').textContent = game.level;
        showNotification(`Level ${game.level}! Great job!`);
        setTimeout(() => nextColorLevel(), 1500);
    }
}