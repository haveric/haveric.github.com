var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.xSpeed = .5;
    this.ySpeed = .5;
    this.maxXVelocity = 5;
    this.maxYVelocity = 5;
    
    this.hp = 15;
    this.numAirlocks = 3;
    this.airlocks = [];
    
    for (var i = 0; i < this.numAirlocks; i++) {
        this.airlocks[i] = new Airlock(CANVAS_WIDTH - 150 + (50 * i), 10);
    }
    
    this.frameMod = 10;
    this.curFrame = 1;
}

Player.prototype.moveUp = function() {
    if (this.y > 0) {
        if (this.yVelocity > 0) {
            this.yVelocity = 0;
        }
        
        this.yVelocity -= this.ySpeed;
        if (this.yVelocity < -this.maxYVelocity) {
            this.yVelocity = -this.maxYVelocity;
        }
        this.y += this.yVelocity;
    } else {
        soundManager.play('blip');
    }
}
Player.prototype.moveDown = function() {
    if (this.y < CANVAS_HEIGHT - 32) {
        if (this.yVelocity < 0) {
            this.yVelocity = 0;
        }
        
        this.yVelocity += this.ySpeed;
        if (this.yVelocity > this.maxYVelocity) {
            this.yVelocity = this.maxYVelocity;
        }
        this.y += this.yVelocity;
    } else {
        soundManager.play('blip');
    }
}
Player.prototype.moveLeft = function() {
    if (this.x > 0) {
        if (this.xVelocity > 0) {
            this.xVelocity = 0;
        }
        
        this.xVelocity -= this.xSpeed;
        if (this.xVelocity < -this.maxXVelocity) {
            this.xVelocity = -this.maxXVelocity;
        }
        this.x += this.xVelocity;
    } else {
        soundManager.play('blip');
    }
}

Player.prototype.moveRight = function() {
    if (this.x < CANVAS_WIDTH - 32) {
        if (this.xVelocity < 0) {
            this.xVelocity = 0;
        }
        
        this.xVelocity += this.xSpeed;
        if (this.xVelocity > this.maxXVelocity) {
            this.xVelocity = this.maxXVelocity;
        }
        this.x += this.xVelocity;
    } else {
        soundManager.play('blip');
    }
}

Player.prototype.getX = function() {
    return this.x;
}

Player.prototype.getY = function() {
    return this.y;
}

Player.prototype.draw = function(context, frame) {
    var sprite = "player";
    
    if (frame % this.frameMod == 0) {
        this.curFrame ++;
        
        if (this.curFrame > 4) {
            this.curFrame = 1;
        }
    }
    
    if (this.yVelocity < 0) {
        sprite += "-boost";
    }
    
    if (this.curFrame > 0) {
        sprite += this.curFrame;
    }

    spriteMapper.getImage(sprite).drawImage(context, this.x, this.y);
}