var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.isJumping = false;
    this.shovel = true;
    this.ladder = true;
    this.sword = true;
    this.jump = true;
}

Player.prototype.moveUp = function(map) {
    if (this.y > 0) {
    //var tile = map.getTile(this.x, this.y-1);
    //if (tile == null) {
        
    //} else if (tile.canWalk){
        this.y--;
    //}
    }
}
Player.prototype.moveDown = function(map) {
    if (this.y < map.cols-1) {
    //var tile = map.getTile(this.x, this.y+1);
    //if (tile == null) {
        
    //} else if (tile.canWalk){
        this.y++;
    //}
    }
}
Player.prototype.moveLeft = function(map) {
    if (this.x >= 1) {
    //var tile = map.getTile(this.x-1, this.y);
    //if (tile == null) {
        
    //} else if (tile.canWalk){
        this.x--;
    //}
    }
}

Player.prototype.moveRight = function(map) {
    if (this.x < map.rows-1) {
    //var tile = map.getTile(this.x+1, this.y);
    //if (tile == null) {
        
    //} else if (tile.canWalk){
        this.x++;
    //}
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