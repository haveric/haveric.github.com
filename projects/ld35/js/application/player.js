var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.velocity = 0;
    this.rotateSpeed = 2;

    this.speed = 0;
    this.minVelocity = 0;
    this.maxVelocity = 0;
    this.setGear(1);

}

Player.prototype.moveUp = function() {
    if (this.y > 0) {
        if (this.velocity > 0) {
            this.velocity = 0;
        }

        this.velocity -= this.speed;
        if (this.velocity < -this.maxVelocity) {
            this.velocity = -this.maxVelocity;
        }
    }
}
Player.prototype.moveDown = function() {
    if (this.y < CANVAS_HEIGHT - 64) {
        if (this.velocity < 0) {
            this.velocity = 0;
        }

        this.velocity += this.speed;
        if (this.velocity > -this.minVelocity) {
            this.velocity = -this.minVelocity;
        }
    }
}
Player.prototype.moveLeft = function() {
    this.angle -= this.rotateSpeed;

    if (this.angle < 0) {
        this.angle += 360;
    }
}

Player.prototype.moveRight = function() {
    this.angle += this.rotateSpeed;

    if (this.angle > 360) {
        this.angle -= 360;
    }
}

Player.prototype.move = function() {
    this.x += this.velocity * Math.cos((this.angle+90) * Math.PI / 180);
    this.y += this.velocity * Math.sin((this.angle+90) * Math.PI / 180);
}

Player.prototype.getX = function() {
    return this.x;
}

Player.prototype.getY = function() {
    return this.y;
}

Player.prototype.draw = function(context, frame) {
    var sprite = "player";

    spriteMapper.getImage(sprite).drawImage(context, 384, 320, this.angle);
}

Player.prototype.setSpeeds = function(speed, minVelocity, maxVelocity) {
    this.speed = speed;
    this.minVelocity = minVelocity;
    this.maxVelocity = maxVelocity;
}

Player.prototype.setGear = function(gear) {
    if (gear >= -1 && gear <= 4) {
        this.gear = gear;
    }

    // Reverse
    if (gear == -1) {
        this.setSpeeds(.5, -2.5, 0);
    } else if (gear == 0) {
        this.setSpeeds(0, 0, 0);
    } else if (gear == 1) {
        this.setSpeeds(.5, 0, 2.5);
    } else if (gear == 2) {
        this.setSpeeds(.6, 0, 4);
    } else if (gear == 3) {
        this.setSpeeds(.7, 0, 6);
    } else if (gear == 4) {
        this.setSpeeds(.8, 0, 8.5);
    }
}

Player.prototype.shiftUp = function() {
    this.setGear(this.gear + 1);
}

Player.prototype.shiftDown = function() {
    this.setGear(this.gear - 1);
}