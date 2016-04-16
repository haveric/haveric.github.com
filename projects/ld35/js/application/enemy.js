var Enemy = function(lane, gear, velocity, y) {
    this.x = 75 + lane * 100;
    this.y = y || -100;
    this.velocity = velocity;

    this.lane = lane;
    this.gear = gear;
}

Enemy.prototype.move = function() {
    this.y += this.velocity;
}

Enemy.prototype.draw = function(context, frame) {
    var sprite = "player" + "-gear" + this.gear;

    spriteMapper.getImage(sprite).drawImage(context, this.x, this.y);
}