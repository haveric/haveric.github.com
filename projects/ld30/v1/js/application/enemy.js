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

Enemy.prototype.draw = function(frame, index, playerX, playerY) {
    this.move(frame);
    
    var randAttack = Math.floor(Math.random() * 250);
    if (randAttack == 0) {
        this.attack(frame, playerX, playerY);
    }
    
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
    var bX = this.x;
    var bY = this.y + 14;
    
    if (this.direction == "left") {
        bX -= 3;
    } else {
        bX += 30;
    }
    
    bullets.push(new Bullet(bX, bY, this.direction, playerX, playerY))
}

Enemy.prototype.move = function(frame) {
    if (frame % this.frameModMove == 0) {
        var y = Math.floor(this.y / 32);
        
        var leftX = Math.floor((this.x - this.speed) / 32);
        var rightX = Math.floor((this.x + this.width + this.speed) / 32);
        var leftTile = map.getTile(leftX, y);
        var rightTile = map.getTile(rightX, y);
        var blTile = map.getTile(leftX, y+1);
        var brTile = map.getTile(rightX, y+1);
        
        if ((leftTile.isSolid || !blTile.isSolid) &&  (rightTile.isSolid || !brTile.isSolid)) {
            // Don't move
        } else if (this.direction == "left") {
            if (!leftTile.isSolid && blTile.isSolid) {
                this.x -= this.speed;
            } else {
                this.switchDirections();
            }
        } else {
            if (!rightTile.isSolid && brTile.isSolid) {
                this.x += this.speed;
            } else {
                this.switchDirections();
            }
        }
    }
}


var Bullet = function(x, y, direction, playerX, playerY) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.sprite = 'dalek-laser';
    this.speed = 5;
    
    var distX = Math.abs(playerX - x);
    var volume = 1 - (distX / 1000);
    if (volume > 1) {
        volume = 1;
    }
    
    soundManager.play('laser', volume);
}

Bullet.prototype.draw = function(frame, index, playerX, playerY) {
    var tileX = Math.floor(playerX / 32);
    var tileY = Math.floor(playerY / 32);

    var offsetX = playerX - (tileX * 32);
    var offsetY = playerY - (tileY * 32);
    
    var left = tileX - 12;
    var right = tileX + 14;
    var top = tileY - 15;
    var bot = tileY + 6;

    if (this.direction == "left") {
        this.x -= this.speed;
    } else {
        this.x += this.speed;
    }
    
    var bulletExists = true;
    
    var distX = Math.abs(playerX - this.x);
    var volume = 1 - (distX / 1000);
    if (volume > 1) {
        volume = 1;
    }
    
    // Check for out of bounds
    if (this.x < 0 || this.x > map.rows *32) {
        bulletExists = false;
    }
    
    // Check for player collisions
    if (bulletExists && this.x + 10 > playerX + 7 && this.x < playerX + 27 && this.y > playerY && this.y < playerY + 32) {
        bulletExists = false;
        // Bullet hits player
    }
    
    // Check for wall collisions
    if (bulletExists) {
        var tileX = Math.floor(this.x / 32);
        var tileY = Math.floor(this.y / 32);

        var hitTile = map.getTile(tileX, tileY);
        
        if (hitTile != null && hitTile.isSolid) {
            bulletExists = false;
            // Bullet hits wall
            soundManager.play('laser-hitwall', volume);
        }
        
        if (bulletExists) {
            var tileX2 = Math.floor((this.x + 10) / 32);
            var hitTile2 = map.getTile(tileX2, tileY);
            if (bulletExists && hitTile != null && hitTile2.isSolid) {
                bulletExists = false;
                // Bullet hits wall
                soundManager.play('laser-hitwall', volume);
            }
        }
    }
    
    if (bulletExists) {
        var drawX = (this.x - (left * 32)) - offsetX;
        var drawY = (this.y - (top * 32)) - offsetY;
        
        spriteMapper.getImage(this.sprite).drawImage(drawX, drawY);
    } else {
        killBullet(index);
    }
}

function killEnemy(index) {
    if (index > 0 && index < enemies.length) {
        enemies.splice(index, 1);
    }
}

function killBullet(index) {
    if (index > 0 && index < enemies.length) {
        bullets.splice(index, 1);
    }
}