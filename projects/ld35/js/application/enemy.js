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

Enemy.prototype.move = function(timeDelta, player) {
    if (player.hasBlackHoleStarted) {
        var diffX = this.x - player.x;
        var diffY = this.y - player.y;
        var percentX = Math.abs(diffX) / Math.abs(diffX + diffY);
        var percentY = 1 - percentX;

        if (this.x > player.x) {
            this.x -= percentX * this.velocity;
        } else {
            this.x += percentX * this.velocity;
        }

        if (this.y < player.y) {
            this.y += percentY * this.velocity;
        } else {
            this.y -= percentY * this.velocity;
        }
    } else {
        this.y += timeDelta * this.velocity;
    }
}

Enemy.prototype.draw = function(context, frame) {
    var sprite = "enemy" + "-gear" + this.gear + "-0";

    spriteMapper.getImage(sprite).drawImage(context, this.x, this.y);
}