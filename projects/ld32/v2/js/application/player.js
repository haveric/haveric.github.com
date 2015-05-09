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
    
    this.dying = false;
}

Player.prototype.moveUp = function() {
    if (this.y > 0 && !this.dying) {
        if (this.yVelocity > 0) {
            this.yVelocity = 0;
        }
        
        this.yVelocity -= this.ySpeed;
        if (this.yVelocity < -this.maxYVelocity) {
            this.yVelocity = -this.maxYVelocity;
        }
        this.y += this.yVelocity;
    }
}
Player.prototype.moveDown = function() {
    if (this.y < CANVAS_HEIGHT - 64 && !this.dying) {
        if (this.yVelocity < 0) {
            this.yVelocity = 0;
        }
        
        this.yVelocity += this.ySpeed;
        if (this.yVelocity > this.maxYVelocity) {
            this.yVelocity = this.maxYVelocity;
        }
        this.y += this.yVelocity;
    }
}
Player.prototype.moveLeft = function() {
    if (this.x > 0 && !this.dying) {
        if (this.xVelocity > 0) {
            this.xVelocity = 0;
        }
        
        this.xVelocity -= this.xSpeed;
        if (this.xVelocity < -this.maxXVelocity) {
            this.xVelocity = -this.maxXVelocity;
        }
        this.x += this.xVelocity;
    }
}

Player.prototype.moveRight = function() {
    if (this.x < CANVAS_WIDTH - 32 && !this.dying) {
        if (this.xVelocity < 0) {
            this.xVelocity = 0;
        }
        
        this.xVelocity += this.xSpeed;
        if (this.xVelocity > this.maxXVelocity) {
            this.xVelocity = this.maxXVelocity;
        }
        this.x += this.xVelocity;
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
        
        if (!this.dying && this.curFrame > 4) {
            this.curFrame = 1;
        }
        
        if (this.dying && this.curFrame > 12) {
            this.curFrame = 12;
        }
    }
    
    if (!this.dying && this.yVelocity < 0) {
        sprite += "-boost";
    }
    
    if (this.dying) {
        sprite += "-death";
    }
    
    if (this.curFrame > 0) {
        sprite += this.curFrame;
    }
    
    if (!this.dying || this.curFrame <= 12) {
        spriteMapper.getImage(sprite).drawImage(context, this.x, this.y);
    }
    
    if (!this.dying && this.hp <= 0) {
        this.dying = true;
        this.curFrame = 0;
        soundManager.play('shipExplode');
    }
}