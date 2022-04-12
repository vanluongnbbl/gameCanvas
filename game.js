const canvas = document.getElementById('game');

const context = canvas.getContext('2d');

let x = 25
let y = 25
let dx = 5, dy = 2
let radius = 10 
let BrickConfig = {
    offsetX: 25,
    offsetY: 25,
    margin: 25,
    width: 70,
    height: 15,
    totalRow: 3,
    totalCol: 5
}

let isGameOver = false
let isGameWin = false
let userScore = 0
let maxScore = BrickConfig.totalCol * BrickConfig.totalRow

let BrickList = []
for (let i = 0; i < BrickConfig.totalRow; i++){
    for(let j = 0; j < BrickConfig.totalCol; j++){
        BrickList.push({
            x: BrickConfig.offsetX + j * (BrickConfig.width + BrickConfig.margin),
            y: BrickConfig.offsetY + i * (BrickConfig.height + BrickConfig.margin),
            isBroken: false
        })
    }
}

let paddle = {
    width: 70,
    height: 10,
    x: 0,
    y: canvas.height - 10,
    speed: 10,

    isMovingLeft: false,
    isMovingRight: false,
}
document,addEventListener('keyup', function(e) {
    if(e.keyCode === 37 ) {
        paddle.isMovingLeft = false
    } else if(e.keyCode === 39 ) {
        paddle.isMovingRight = false
    }
})

document.addEventListener('keydown', function(e) {
    if(e.keyCode === 37 ) {
        paddle.isMovingLeft = true
    } else if(e.keyCode === 39 ) {
        paddle.isMovingRight = true
    }
})

function drawBall() {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI*2, true)
    context.stroke()
    context.fillStyle = '#ff0000'
    context.fill()
    context.closePath();

}

function drawPaddle() {
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height)
    context.stroke()
    context.fillStyle = 'green'
    context.fill()
    context.closePath();   
}

// vẽ chuyển động bóng
// setInterval(() => {
//     // xóa hình cũ
//     context.clearRect(0, 0, canvas.width, canvas.height)
//     drawBall()
//     x+= 10
//     y+= 10
// }, 100)


function handeBallCollideBounds() {
    if(x < radius || x > canvas.width - radius) {
        dx = -dx
    }

    if(y < radius) {
        dy = -dy
    }
}

function updateBallPosition() {
    x+= dx
    y+= dy
}

function updatePaddlePosition() {
    if(paddle.isMovingLeft) {
        paddle.x -= paddle.speed
    } else if (paddle.isMovingRight) {
        paddle.x += paddle.speed
    }

    if(paddle.x < 0) {
        paddle.x = 0
    }else if(paddle.x > canvas.width - paddle.width) {
        paddle.x = canvas.width - paddle.width
    }
}

function handeBallCollidePaddle() {
    if(x + radius >= paddle.x && 
        x + radius <= paddle.x + paddle.width && 
        y + radius >= canvas.height - paddle.height
    ) {
        dy = -dy
    }
}

function handleBallCollideBricks() {
    BrickList.forEach(function(b) {
        if(!b.isBroken) {
            if(x >= b.x && 
                x <= b.x + BrickConfig.width &&
                y + radius >= b.y && 
                y - radius <= b.y + BrickConfig.height) {
                    dy = -dy
                    b.isBroken = true
                    userScore += 1
                    if(userScore >= maxScore) {
                        isGameOver = true
                        isGameWin = true
                    }
                } 
        }
    })
}

function drawBricks() {
    BrickList.forEach(function(b) {
        if(!b.isBroken) {
            context.beginPath()
            context.rect(
                b.x, b.y, BrickConfig.width, BrickConfig.height
            )
            context.fill()
            context.closePath()
        }
    })
}

const handleGameOver = () => {
    if(isGameWin) {
        alert("Good job baby")
    } else{
        alert("Gameover kid")
    }
}


function draw() {
    if(!isGameOver) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        drawBall()
        drawPaddle()
        drawBricks()
        
        handeBallCollideBounds()
        handeBallCollidePaddle()
        handleBallCollideBricks()

        updateBallPosition()
        updatePaddlePosition()

        if(y > canvas.height -radius) {
            isGameOver = true
        }
        requestAnimationFrame(draw)
    } else {
        handleGameOver()
    }
}

draw()