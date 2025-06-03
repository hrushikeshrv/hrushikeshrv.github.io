const canvas = document.querySelector('#obj-tracking-canvas');
const ctx = canvas.getContext('2d');
const playPauseButton = document.querySelector('#play-pause-button');
let playing = false;

playPauseButton.addEventListener('click', () => {
    playing = !playing;
    playPauseButton.textContent = playing ? 'Pause' : 'Play';
})

function getNewSpeed() {
    return (Math.random() * 4 + 1) * (Math.random() < 0.5 ? 1 : -1); // speed: 1–5
}

const SPEED_CHANGE_PROBABILITY = 0.005;
const DIRECTION_CHANGE_PROBABILITY = 0.007;
const COLOR_CHANGE_PROBABILITY = 0.001;
const ball = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 20,
    dx: getNewSpeed(),  // speed: 2–6
    dy: getNewSpeed(),
    color: '#AAAAAA'
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function updateBallPosition() {
    if (!playing) return;
    let randomNum = Math.random();

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Randomly change direction
    if (randomNum < DIRECTION_CHANGE_PROBABILITY) {  // 1% chance to change direction
        ball.dx *= -1;
    }
    if (randomNum < DIRECTION_CHANGE_PROBABILITY) {  // 1% chance to change direction
        ball.dy *= -1;
    }

    // Randomly change speed
    if (randomNum < SPEED_CHANGE_PROBABILITY) {  // 1% chance to change speed
        ball.dx = getNewSpeed()
    }
    if (randomNum < SPEED_CHANGE_PROBABILITY) {
        ball.dy = getNewSpeed()
    }

    // Randomly change color
    if (randomNum < COLOR_CHANGE_PROBABILITY) {  // 1% chance to change color
        ball.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    // Bounce off walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    updateBallPosition();
    requestAnimationFrame(animate);
}

animate();