var Enemy = function(numLanes, lane, gear, velocity, y) {
    if (numLanes == 3) {
        this.x = 175 + lane * 100;
    } else {
        this.x = 75 + lane * 100;
    }
    this.y = y || -100;
    this.velocity = velocity;

    this.lane = lane;
    this.gear = gear;
}

Enemy.prototype.move = function(timeDelta) {
    this.y += timeDelta * this.velocity;
}

Enemy.prototype.draw = function(context, frame) {
    var sprite = "enemy" + "-gear" + this.gear + "-0";

    spriteMapper.getImage(sprite).drawImage(context, this.x, this.y);
}