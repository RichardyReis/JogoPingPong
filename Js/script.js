const canvasE1 = document.querySelector("canvas");
const canvasCtx = canvasE1.getContext("2d");
const gapX = 10;
const mouse = {x: 0, y: 0}

const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function () {
        canvasCtx.fillStyle = "#286047";
        canvasCtx.fillRect(0, 0, this.w, this.h);
    }
}

const line = {
    w: 15,
    h: field.h,
    draw: function () {
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h)
    }
}

const score = {
    human: 0,
    computer: 0,
    increaseHuman: function () {
        this.human++;
    },
    increaseComputer: function () {
        this.computer++
    },
    draw: function () {
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.textAlign = "center"
        canvasCtx.textBaseline = "top"
        canvasCtx.fillStyle = "#01341D"
        canvasCtx.fillText(this.human, field.w / 4, 50)
        canvasCtx.fillText(this.computer, field.w / 2 + field.w / 4, 50)
    },
}

const leftPaddle = {
    x: gapX,
    y: field.h / 2,
    w: line.w,
    h: 200,
    _move: function () {
        this.y = mouse.y;
    },
    draw: function () {
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);
        this._move();
    }
}

const rightPaddle = {
    x: field.w - line.w - gapX,
    y: field.h / 2,
    w: line.w,
    h: 200,
    speed: 5,
    _move: function () {
        if (this.y + this.h / 2 < ball.y + ball.r) {
            this.y += this.speed;
        } else {
            this.y -= this.speed;
        }
        this.y = ball.y
    },
    speedUp: function () {
        this.speed++;
    },
    draw: function () {
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);
        this._move();
    }
}

const ball = {
    x: field.w / 2,
    y: field.h / 2,
    r: 20,
    speed: 5,
    directionX: 1,
    directionY: 1,
    _calcPosition: function() {
        //verifica se o jogador 1 (humano) fez um ponto
        if (this.x > field.w - this.r -rightPaddle.w - gapX) {
            //calcula a posição da raquete no eixo y
            if (this.y + this.r > rightPaddle.y && this.y - this.r < rightPaddle.y + rightPaddle.h) {
                //rebater a bolinha
                this._reverseX();
            } else {
                //fazer o ponto
                score.increaseHuman();
                this._pointUp();
            }
        }
        //verifica se o jogador 2 (computador) fez um ponto
        if (this.x < this.r + leftPaddle.w + gapX) {
            //calcula a posição vertical da bola (eixo y)
            if (this.y + this.r > leftPaddle.y && this.y - this.r < leftPaddle.y + leftPaddle.h) {
              //rebate a bola
              this._reverseX();
            } else {
                //fazer o ponto
                score.increaseComputer();
                this._pointUp();
            }
        }
        if (
            (this.y - this.r < 0 && this.directionY < 0) ||
            (this.y > field.h - this.r && this.directionY > 0)
        ) {
            this._reverseY()
        }
    },
    _reverseX: function () {
        this.directionX *= -1;
    },
    _reverseY: function () {
        this.directionY *= -1;
    },
    _speedUp: function () {
        this.speed += 3;
    },
    _pointUp: function () {
        this.x = field.w / 2;
        this.y = field.h / 2;
        this._reverseX();
        this._speedUp();
        rightPaddle.speedUp();
    },
    _move: function () {
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;
    },
    draw: function () {
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.beginPath();
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        canvasCtx.fill();
        this._calcPosition();
        this._move();
    }
}

function setup () {
    canvasE1.width = window.innerWidth;
    canvasE1.height = window.innerHeight;
    canvasCtx.width = window.innerWidth;
    canvasCtx.height = window.innerHeight;
}

function draw () {
    field.draw();
    line.draw();
    score.draw();
    leftPaddle.draw();
    rightPaddle.draw();
    ball.draw();    
}

window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        }
    )
})()

function main () {
    animateFrame(main);
    draw();
}

setup();
main();

canvasE1.addEventListener('mousemove', function (e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
})