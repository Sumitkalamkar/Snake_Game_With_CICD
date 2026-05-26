const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 500;
const canvasHeight = 500;
const numberOfCells = 25;
const cellSize = Math.floor(canvasWidth / numberOfCells);

const GREEN = 'rgb(173, 204, 96)';
const DARK_GREEN = 'rgb(43, 51, 24)';

let snake;
let direction;
let food;
let score;
let gameInterval;
let gameStarted = false;

// Sounds
const eatSound = new Audio("/static/eat.mp3");
const wallSound = new Audio("/static/wall.mp3");

eatSound.volume = 0.5;
wallSound.volume = 0.5;

// Create buttons
const startBtn = document.createElement("button");
startBtn.innerText = "Start Game";

const replayBtn = document.createElement("button");
replayBtn.innerText = "Replay";
replayBtn.style.display = "none";

document.body.appendChild(startBtn);
document.body.appendChild(replayBtn);

startBtn.onclick = startGame;
replayBtn.onclick = restartGame;

function initializeGame() {

    snake = [
        { x: 6, y: 9 },
        { x: 5, y: 9 },
        { x: 4, y: 9 }
    ];

    direction = { x: 1, y: 0 };

    food = generateRandomPos();

    score = 0;
}

function startGame() {

    if (gameStarted) return;

    gameStarted = true;

    startBtn.style.display = "none";

    initializeGame();

    draw();

    gameInterval = setInterval(update, 200);
}

function restartGame() {

    clearInterval(gameInterval);

    replayBtn.style.display = "none";

    gameStarted = false;

    startGame();
}

function draw() {

    ctx.fillStyle = GREEN;

    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = DARK_GREEN;

    snake.forEach(segment => {

        ctx.fillRect(
            segment.x * cellSize,
            segment.y * cellSize,
            cellSize,
            cellSize
        );
    });

    ctx.fillStyle = 'red';

    ctx.fillRect(
        food.x * cellSize,
        food.y * cellSize,
        cellSize,
        cellSize
    );

    // Score background
    ctx.fillStyle = 'white';

    ctx.fillRect(0, 0, 180, 50);

    ctx.fillStyle = DARK_GREEN;

    ctx.font = '40px Arial';

    ctx.fillText(`Score: ${score}`, 10, 40);
}

function update() {

    const head = { ...snake[0] };

    head.x += direction.x;

    head.y += direction.y;

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {

        score++;

        food = generateRandomPos();

        eatSound.currentTime = 0;

        eatSound.play();

    } else {

        snake.pop();
    }

    // Collision
    if (
        head.x < 0 ||
        head.x >= numberOfCells ||
        head.y < 0 ||
        head.y >= numberOfCells ||
        snake.slice(1).some(
            segment =>
                segment.x === head.x &&
                segment.y === head.y
        )
    ) {

        wallSound.currentTime = 0;

        wallSound.play();

        clearInterval(gameInterval);

        gameStarted = false;

        replayBtn.style.display = "inline-block";

        alert("Game Over!");

        return;
    }

    draw();
}

function generateRandomPos() {

    let pos;

    do {

        pos = {
            x: Math.floor(Math.random() * numberOfCells),
            y: Math.floor(Math.random() * numberOfCells)
        };

    } while (
        snake &&
        snake.some(
            segment =>
                segment.x === pos.x &&
                segment.y === pos.y
        )
    );

    return pos;
}

document.addEventListener('keydown', (e) => {

    switch (e.key) {

        case 'ArrowUp':
            if (direction.y === 0)
                direction = { x: 0, y: -1 };
            break;

        case 'ArrowDown':
            if (direction.y === 0)
                direction = { x: 0, y: 1 };
            break;

        case 'ArrowLeft':
            if (direction.x === 0)
                direction = { x: -1, y: 0 };
            break;

        case 'ArrowRight':
            if (direction.x === 0)
                direction = { x: 1, y: 0 };
            break;
    }
});
