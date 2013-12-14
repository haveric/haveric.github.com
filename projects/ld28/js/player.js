var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.isJumping = false;
}

Player.prototype.moveUp = function(map) {
    var tile = map.getTile(this.x, this.y-1);
    if (tile == null) {
        
    } else if (tile.canWalk){
        this.y--;
    }
}
Player.prototype.moveDown = function(map) {
    var tile = map.getTile(this.x, this.y+1);
    if (tile == null) {
        
    } else if (tile.canWalk){
        this.y++;
    }
}
Player.prototype.moveLeft = function(map) {
    var tile = map.getTile(this.x-1, this.y);
    if (tile == null) {
        
    } else if (tile.canWalk){
        this.x--;
    }
}

Player.prototype.moveRight = function(map) {
    var tile = map.getTile(this.x+1, this.y);
    if (tile == null) {
        
    } else if (tile.canWalk){
        this.x++;
    }
}

Player.prototype.getX = function() {
    return this.x;
}

Player.prototype.getY = function() {
    return this.y;
}

Player.prototype.draw = function(context) {
    spriteMapper.getImage("player").drawImage(context, 384, 320);
}