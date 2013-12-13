var Paddle = function(x, y) {
    this.x = x || 350;
    this.y = y || 500;
    this.width = 100;
    this.height = 20;
    this.speed = 10;
}

Paddle.prototype.moveLeft = function() {
    this.x -= this.speed;
    if (this.x < 0) {
        this.x = 0;
    }
}

Paddle.prototype.moveRight = function() {
    this.x += this.speed;
    if (this.x + this.width > CANVAS_WIDTH) {
        this.x = CANVAS_WIDTH - this.width;
    }
}

Paddle.prototype.draw =  function(context) {
    context.fillStyle = 'rgba(0, 80, 0, 1)';
    context.fillRect(this.x, this.y, this.width, this.height);
}