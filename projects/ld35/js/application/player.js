var Player = function(x, y, maxGear) {
    this.x = x;
    this.y = y;
    this.velocity = 0;

    this.speed = .5;
    this.maxVelocity = 5;
    this.maxGear = maxGear;
    this.setGear(3);
    this.setLane(3);
    this.collected = new Map();
    for (var i = 3; i <= 8; i++) {
        this.collected.set(i, 0);
    }
}

Player.prototype.moveUp = function() {
    if (this.y > 64) {
        if (this.velocity > 0) {
            this.velocity = 0;
        }

        this.velocity -= this.speed;
    } else {
         this.velocity = 0;
     }
}
Player.prototype.moveDown = function() {
    if (this.y < CANVAS_HEIGHT - 32 -48) {
        if (this.velocity < 0) {
            this.velocity = 0;
        }

        this.velocity += this.speed;
    } else {
        this.velocity = 0;
    }
}
Player.prototype.moveLeft = function() {
    this.setLane(this.lane - 1);
}

Player.prototype.moveRight = function() {
    this.setLane(this.lane + 1);
}

Player.prototype.move = function() {
    this.x = 75 + this.lane * 100;

    if (this.velocity < -this.maxVelocity) {
        this.velocity = -this.maxVelocity;
    } else if (this.velocity > this.maxVelocity) {
        this.velocity = this.maxVelocity;
    }
    this.y += this.velocity;
}

Player.prototype.getX = function() {
    return this.x;
}

Player.prototype.getY = function() {
    return this.y;
}

Player.prototype.draw = function(context, frame) {
    var sprite = "player" + "-gear" + this.gear;

    spriteMapper.getImage(sprite).drawImage(context, this.x, this.y);
}

Player.prototype.setSpeeds = function(speed, minVelocity, maxVelocity) {
    this.speed = speed;
    this.minVelocity = minVelocity;
    this.maxVelocity = maxVelocity;
}

Player.prototype.setGear = function(gear) {
    if (gear >= 3 && gear <= this.maxGear) {
        this.gear = gear;
    }
}

Player.prototype.shiftUp = function() {
    this.setGear(this.gear + 1);
}

Player.prototype.shiftDown = function() {
    this.setGear(this.gear - 1);
}

Player.prototype.setLane = function(lane) {
    if (lane >= 1 && lane <= 5) {
        this.lane = lane;
    }
}