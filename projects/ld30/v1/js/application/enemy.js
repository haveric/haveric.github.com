var Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = "dalek";
    
    var rand = Math.round(Math.random());
    if (rand === 0) {
        this.direction = "left";
    } else {
        this.direction = "right";
    }
}

Enemy.prototype.draw = function(frame, playerX, playerY) {
    var newSprite = this.sprite + "-" + this.direction;
    
    var tileX = Math.floor(playerX / 32);
    var tileY = Math.floor(playerY / 32);

    var offsetX = playerX - (tileX * 32);
    var offsetY = playerY - (tileY * 32);
    
    var left = tileX - 12;
    var right = tileX + 14;
    var top = tileY - 15;
    var bot = tileY + 6;

    spriteMapper.getImage(newSprite).drawImage((this.x-left)*32 - offsetX, (this.y-top)*32 - offsetY);
}

Enemy.prototype.move = function() {
    
}