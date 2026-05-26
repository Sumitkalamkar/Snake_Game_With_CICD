const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 500;
const canvasHeight = 500;
const numberOfCells = 25;
const cellSize = Math.floor(canvasWidth / numberOfCells);
const OFFSET = 0;

const GREEN = 'rgb(173, 204, 96)';
const DARK_GREEN = 'rgb(43, 51, 24)';

let snake = [{ x: 6, y: 9 }, { x: 5, y: 9 }, { x: 4, y: 9 }];
let direction = { x: 1, y: 0 };
let food = generateRandomPos();
let score = 0;
let gameInterval;

// Load sounds
const eatSound = new Audio("/static/eat.mp3");
const wallSound = new Audio("/static/wall.mp3");

// Optional volume control
eatSound.volume = 0.5;
wallSound.volume = 0.5;

function draw() {
    ctx.fillStyle = GREEN;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = DARK_GREEN;

    snake.forEach(segment => {
        ctx.fillRect(
            OFFSET + segment.x * cellSize,
            OFFSET + segment.y * cellSize,
            cellSize,
            cellSize
        );
    });

    ctx.fillStyle = 'red';

    ctx.fillRect(
        OFFSET + food.x * cellSize,
        OFFSET + food.y * cellSize,
        cellSize,
        cellSize
    );

    // Score background
    ctx.fillStyle = 'white';
    ctx.fillRect(OFFSET - 10, 10, 180, 50);

    ctx.fillStyle = DARK_GREEN;
    ctx.font = '40px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.fillText(`Score: ${score}`, OFFSET, 20);
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

        // Restart sound before playing
        eatSound.currentTime = 0;
        eatSound.play();

    } else {

        snake.pop();
    }

    // Wall hit or self collision
    if (
        head.x < 0 ||
        head.x >= numberOfCells ||
        head.y < 0 ||
        head.y >= numberOfCells ||
        snake.slice(1).some(
            segment => segment.x === head.x && segment.y === head.y
        )
    ) {

        wallSound.currentTime = 0;
        wallSound.play();

        clearInterval(gameInterval);

        setTimeout(() => {
            alert('Game Over!');
        }, 100);
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
        snake.some(
            segment => segment.x === pos.x && segment.y === pos.y
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

draw();

gameInterval = setInterval(update, 200);
