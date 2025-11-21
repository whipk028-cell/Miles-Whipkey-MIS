const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = 20;
canvas.width = canvas.height = tileCount * gridSize;

let snake = [
    {x: 10, y: 10},
];
let food = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 150;
let gameLoop;
let gameRunning = false;

function drawGame() {
    clearCanvas();
    moveSnake();
    drawFood();
    drawSnake();
    updateScore();
    
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    if (gameRunning) {
        setTimeout(drawGame, gameSpeed);
    }
}

function clearCanvas() {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = '#4CAF50';
    snake.forEach((segment, index) => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        
        // Add gradient effect to snake head
        if (index === 0) {
            ctx.fillStyle = '#66BB6A';
            ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + 4, gridSize - 8, gridSize - 8);
        }
    });
}

function drawFood() {
    ctx.fillStyle = '#FF5252';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize/2,
        food.y * gridSize + gridSize/2,
        gridSize/2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        generateFood();
        increaseSpeed();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // Ensure food doesn't spawn on snake
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
    }
}

function checkCollision() {
    const head = snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

function increaseSpeed() {
    if (gameSpeed > 50) {
        gameSpeed -= 5;
    }
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function gameOver() {
    gameRunning = false;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
    ctx.font = '20px Poppins';
    ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 40);
    ctx.fillText('Press Space to Restart', canvas.width/2, canvas.height/2 + 80);
}

function startGame() {
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 150;
    generateFood();
    gameRunning = true;
    drawGame();
}

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
        case ' ':
            if (!gameRunning) {
                startGame();
            }
            break;
    }
});