var Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = "dalek";
    this.speed = 5;
    this.frameModMove = 5;
    
    this.width = 32;
    this.height = 32;
    
    var rand = Math.round(Math.random());
    if (rand === 0) {
        this.direction = "left";
    } else {
        this.direction = "right";
    }
}

Enemy.prototype.draw = function(frame, playerX, playerY) {
    this.move(frame);
    
    var tileX = Math.floor(playerX / 32);
    var tileY = Math.floor(playerY / 32);

    var offsetX = playerX - (tileX * 32);
    var offsetY = playerY - (tileY * 32);
    
    var left = tileX - 12;
    var right = tileX + 14;
    var top = tileY - 15;
    var bot = tileY + 6;
    
    var rand = Math.floor(Math.random() * 100);
    if (rand === 0) {
        this.switchDirections();
    }
    
    var newSprite = this.sprite + "-" + this.direction;
    
    spriteMapper.getImage(newSprite).drawImage((this.x-left*32) - offsetX, (this.y-top*32) - offsetY);
}

Enemy.prototype.switchDirections = function() {
    if (this.direction == "left") {
        this.direction = "right";
    } else {
        this.direction = "left";
    }
}

Enemy.prototype.attack = function(frame, playerX, playerY) {
    var bX = this.x * 32;
    var bY = (this.y * 32) + 15;
    
    if (this.direction == "left") {
        bX -= 3;
    } else {
        bX += 30;
    }
    
    bullets.push(new Bullet(this.x*32, bY, this.direction))
}

Enemy.prototype.move = function(frame) {
    if (frame % this.frameModMove == 0) {
        var y = Math.floor(this.y / 32);
        
        if (this.direction == "left") {
            var leftX = Math.floor((this.x - this.speed) / 32);

            var leftTile = map.getTile(leftX, y);
            var blTile = map.getTile(leftX, y+1);
            
            if (!leftTile.isSolid && blTile.isSolid) {
                this.x -= this.speed;
            } else {
                this.switchDirections();
            }
        } else {
            var rightX = Math.floor((this.x + this.width + this.speed) / 32);
            
            var rightTile = map.getTile(rightX, y);
            var brTile = map.getTile(rightX, y+1);
            
            if (!rightTile.isSolid && brTile.isSolid) {
                this.x += this.speed;
            } else {
                this.switchDirections();
            }
        }
    }
}


var Bullet = function(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.sprite = 'dalek-laser';
}

Bullet.prototype.draw = function(frame, playerX, playerY) {
    var tileX = Math.floor(playerX / 32);
    var tileY = Math.floor(playerY / 32);

    var offsetX = playerX - (tileX * 32);
    var offsetY = playerY - (tileY * 32);
    
    var left = tileX - 12;
    var right = tileX + 14;
    var top = tileY - 15;
    var bot = tileY + 6;

    if (direction == "left") {
        this.x --;
    } else {
        this.x ++;
    }
    
    var bulletExists = true;
    if (x < 0 || x > map.rows *32) {
        bulletExists = false;
    }
    if (bulletExists) {
        spriteMapper.getImage(this.sprite).drawImage((this.x-left)*32 - offsetX, (this.y-top)*32 - offsetY);
    }
}