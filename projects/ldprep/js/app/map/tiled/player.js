var PlayerTiled = function(x, y) {
    this.x = x;
    this.y = y;
    this.direction = "up";
}

PlayerTiled.prototype.moveUp = function(map) {
    this.direction = "up";
    if (this.y > 0) {
        var tile = map.getTile(this.x, this.y-1);
        if (tile == null) {

        } else if (tile.canWalk){
            this.y--;
        }
    } else {
        soundManager.play('blip');
    }
}
PlayerTiled.prototype.moveDown = function(map) {
    this.direction = "down";
    if (this.y < map.cols-1) {
        var tile = map.getTile(this.x, this.y+1);
        if (tile == null) {

        } else if (tile.canWalk){
            this.y++;
        }
    } else {
        soundManager.play('blip');
    }
}
PlayerTiled.prototype.moveLeft = function(map) {
    this.direction = "left";
    if (this.x >= 1) {
        var tile = map.getTile(this.x-1, this.y);
        if (tile == null) {

        } else if (tile.canWalk){
            this.x--;
        }
    } else {
        soundManager.play('blip');
    }
}

PlayerTiled.prototype.moveRight = function(map) {
    this.direction = "right";
    if (this.x < map.rows-1) {
        var tile = map.getTile(this.x+1, this.y);
        if (tile == null) {

        } else if (tile.canWalk){
            this.x++;
        }
    } else {
        soundManager.play('blip');
    }
}

PlayerTiled.prototype.getX = function() {
    return this.x;
}

PlayerTiled.prototype.getY = function() {
    return this.y;
}

PlayerTiled.prototype.draw = function(context, frame) {
    var sprite = "player";

    spriteMapper.getImage(sprite).drawImage(context, 384, 320);
}