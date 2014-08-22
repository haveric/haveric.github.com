var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.direction = "up";
}

Player.prototype.moveUp = function(map) {
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
Player.prototype.moveDown = function(map) {
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
Player.prototype.moveLeft = function(map) {
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

Player.prototype.moveRight = function(map) {
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

Player.prototype.getX = function() {
    return this.x;
}

Player.prototype.getY = function() {
    return this.y;
}

Player.prototype.draw = function(context) {
    var sprite = "player-" + this.direction;

    spriteMapper.getImage(sprite).drawImage(context, 384, 320);
}