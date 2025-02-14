class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 8;
        this.dy = (Math.random() - 0.5) * 8;
        this.mass = radius;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(canvas, balls) {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        balls.forEach(ball => {
            if (ball === this) return;

            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius + ball.radius) {
                const normalX = dx / distance;
                const normalY = dy / distance;

                const relativeVelocityX = this.dx - ball.dx;
                const relativeVelocityY = this.dy - ball.dy;

                const speed = relativeVelocityX * normalX + relativeVelocityY * normalY;
                if (speed < 0) return;

                const impulse = 2 * speed / (this.mass + ball.mass);

                this.dx -= impulse * ball.mass * normalX;
                this.dy -= impulse * ball.mass * normalY;
                ball.dx += impulse * this.mass * normalX;
                ball.dy += impulse * this.mass * normalY;

                const overlap = (this.radius + ball.radius - distance) / 2;
                this.x -= overlap * normalX;
                this.y -= overlap * normalY;
                ball.x += overlap * normalX;
                ball.y += overlap * normalY;
            }
        });

        this.x += this.dx;
        this.y += this.dy;
    }
}

const canvas = document.getElementById('bouncingCanvas');
const ctx = canvas.getContext('2d');

// Canvas 크기 설정을 수정
canvas.width = 800;
canvas.height = 400;

const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#00ff00'];
const balls = [];
const BALL_SPEED = 3;
const BALLS_PER_COLOR = 3;

// Modified ball creation
colors.forEach(color => {
    for (let i = 0; i < BALLS_PER_COLOR; i++) {
        // Calculate random angle for initial direction
        const angle = Math.random() * Math.PI * 2;
        const ball = new Ball(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            20,
            color
        );
        // Set consistent speed with random direction
        ball.dx = BALL_SPEED * Math.cos(angle);
        ball.dy = BALL_SPEED * Math.sin(angle);
        balls.push(ball);
    }
});

function animate() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    balls.forEach(ball => {
        ball.update(canvas, balls);
        ball.draw(ctx);
    });

    requestAnimationFrame(animate);
}

animate();

// 새로운 함수 추가
function startGame() {
    balls.length = 0;  // 기존 공들을 제거
    
    colors.forEach(color => {
        for (let i = 0; i < BALLS_PER_COLOR; i++) {
            const angle = Math.random() * Math.PI * 2;
            const ball = new Ball(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                15,
                color
            );
            ball.dx = BALL_SPEED * Math.cos(angle);
            ball.dy = BALL_SPEED * Math.sin(angle);
            balls.push(ball);
        }
    });
}

function showHighScores() {
    alert('HIGH SCORES\n\n1. AAA - 100000\n2. BBB - 90000\n3. CCC - 80000');
}

// 초기 공 생성
startGame(); 