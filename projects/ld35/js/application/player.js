var Player = function(x, y, minGear, maxGear, numLanes) {
    this.x = x;
    this.y = y;
    this.velocity = 0;

    this.speed = .5;
    this.maxVelocity = 5;
    this.frame = 0;
    this.minGear = minGear;
    this.maxGear = 8;//maxGear;
    this.setGear(this.minGear);
    this.numLanes = numLanes;
    if (numLanes == 3) {
        this.setLane(2);
    } else {
        this.setLane(3);
    }

    this.collected = new Map();
    for (var i = 3; i <= 8; i++) {
        this.collected.set(i, 0);
    }

    this.shiftingUp = false;
    this.shiftingDown = false;
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

Player.prototype.move = function(delta) {
    if (this.numLanes == 3) {
        this.x = 175 + this.lane * 100;
    } else {
        this.x = 75 + this.lane * 100;
    }

    if (this.velocity < -this.maxVelocity) {
        this.velocity = -this.maxVelocity;
    } else if (this.velocity > this.maxVelocity) {
        this.velocity = this.maxVelocity;
    }

    var normalDelta = 1000 / 60;
    var timeDelta = delta / normalDelta;

    this.y += timeDelta * this.velocity;
}

Player.prototype.getX = function() {
    return this.x;
}

Player.prototype.getY = function() {
    return this.y;
}

Player.prototype.draw = function(context, frame) {
    var displayGear = this.gear;

    if (frame % 3 == 0) {
        if (this.shiftingUp) {
            if (this.frame < 3) {
                this.frame ++;
            } else {
                this.frame = 0;
                this.shiftingUp = false;
            }
        } else if (this.shiftingDown) {
            if (this.frame > 0) {
                this.frame --;
            } else {
                this.frame = 0;
                this.shiftingDown = false;
            }
        }
    }

    if (this.shiftingUp) {
        displayGear -= 1;
    } else if (this.shiftingDown) {
        //displayGear += 1;
    }

    var sprite = "player" + "-gear" + displayGear + "-" + this.frame;

    spriteMapper.getImage(sprite).drawImage(context, this.x, this.y);
}

Player.prototype.setSpeeds = function(speed, minVelocity, maxVelocity) {
    this.speed = speed;
    this.minVelocity = minVelocity;
    this.maxVelocity = maxVelocity;
}

Player.prototype.setGear = function(gear) {
    if (gear >= this.minGear && gear <= this.maxGear) {
        this.gear = gear;
    }
}

Player.prototype.shiftUp = function() {
    if (this.gear + 1 <= this.maxGear) {
        this.setGear(this.gear + 1);
        this.shiftingUp = true;
    }
}

Player.prototype.shiftDown = function() {
    if (this.gear - 1 >= this.minGear) {
        this.setGear(this.gear - 1);
        this.shiftingDown = true;
        this.frame = 4;
    }
}

Player.prototype.setLane = function(lane) {
    if (lane >= 1 && lane <= this.numLanes) {
        this.lane = lane;
    }
}