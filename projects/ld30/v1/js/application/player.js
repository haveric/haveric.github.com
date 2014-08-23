var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.direction = "up";
    this.speed = .8;
    this.maxSpeed = 8;
    this.fallSpeed = 7;
    this.jumpTimer = 0;
    this.jumpSpeed = 12;
    this.xVelocity = 0;
    
    this.jumpVelocity = .8;
    this.maxJumpSpeed = 12;
    this.yVelocity = 0;
}

Player.prototype.moveLeft = function(map) {
    this.direction = "left";
    
    var leftX = Math.floor((this.x - this.speed) / 32);
    var topTile = Math.floor(this.y / 32);
    var bottomTile = Math.ceil(this.y / 32);
    
    var canMove = true;
    if (topTile == bottomTile) {
        var tile = map.getTile(leftX, topTile);
        
        if (tile.isSolid) {
            canMove = false;
        }
    } else {
        var top = map.getTile(leftX, topTile);
        var bot = map.getTile(leftX, bottomTile);
        
        if (top.isSolid || bot.isSolid) {
            canMove = false;
        }
    }
    
    if (canMove) {
        this.xVelocity -= this.speed;
        if (this.xVelocity < -this.maxSpeed) {
            this.xVelocity = -this.maxSpeed;
        }
        this.x += this.xVelocity;
    } else {
        var left = ((leftX+1) * 32) - this.x;
        this.x += left;
    }
}

Player.prototype.moveRight = function(map) {
    this.direction = "right";
    if (this.x < (map.rows-1) * 32) {
        
        var rightX = Math.ceil((this.x + this.speed) / 32);
        var topTile = Math.floor(this.y / 32);
        var bottomTile = Math.ceil(this.y / 32);
        
        var canMove = true;
        if (topTile == bottomTile) {
            var tile = map.getTile(rightX, topTile);
            
            if (tile.isSolid) {
                canMove = false;
            }
        } else {
            var top = map.getTile(rightX, topTile);
            var bot = map.getTile(rightX, bottomTile);
            
            if (top.isSolid || bot.isSolid) {
                canMove = false;
            }
        }
        
        if (canMove) {
            this.xVelocity += this.speed;
            if (this.xVelocity > this.maxSpeed) {
                this.xVelocity = this.maxSpeed;
            }
            this.x += this.xVelocity;
        } else {
            var right = ((rightX-1) * 32) - this.x;
            this.x += right;
        }
    }
}

Player.prototype.jump = function() {
    if (this.jumpTimer == 0) {
        this.jumpTimer = 1;
    }
}

Player.prototype.getX = function() {
    return this.x;
}

Player.prototype.getY = function() {
    return this.y;
}

Player.prototype.draw = function(context, frame, map) {
    var sprite = "player-" + this.direction;
    
    var originalY = this.y;
    if (this.jumpTimer <= 1) { 
        var fallTileY = Math.ceil((this.y + this.fallSpeed) / 32);
        
        var leftTile = Math.floor(this.x / 32);
        var rightTile = Math.ceil(this.x / 32);
        
        var fall = true;
        if (leftTile == rightTile) {
            var tile = map.getTile(leftTile, fallTileY);
            
            if (tile.isSolid) {
                fall = false;
            }
        } else {
            var left = map.getTile(leftTile, fallTileY);
            var right = map.getTile(rightTile, fallTileY);
            
            if (left.isSolid || right.isSolid) {
                fall = false;
            }
        }
        
        if (fallTileY >= map.cols) {
            fall = false;
        }
        
        if (fall) {
            this.y += this.fallSpeed;
        } else {
            var left = (fallTileY -1) * 32 - this.y;
            this.y += left;
        }
    }
    var newY = this.y;
    
    if (this.jumpTimer == 1) {
        if (originalY != newY) {
            this.jumpTimer = 0;
        }
    }
    if (this.jumpTimer < 0) {
        this.jumpTimer ++;
    }
    if (this.jumpTimer > 0) {
        if (this.jumpTimer > 10) {
            this.jumpTimer = 0;
        } else {
            this.jumpTimer ++;
            
            var jumpTileY = Math.floor((this.y - this.fallSpeed) / 32);
            
            var leftTile = Math.floor(this.x / 32);
            var rightTile = Math.ceil(this.x / 32);
            
            var canJump = true;
            if (leftTile == rightTile) {
                var tile = map.getTile(leftTile, jumpTileY);
                
                if (tile.isSolid) {
                    canJump = false;
                }
            } else {
                var left = map.getTile(leftTile, jumpTileY);
                var right = map.getTile(rightTile, jumpTileY);
                
                if (left.isSolid || right.isSolid) {
                    canJump = false;
                }
            }
            
            if (canJump) {
                this.y -= this.jumpSpeed;
            } else {
                var left = (jumpTileY+1) * 32 - this.y;
                //if (left < 0) {
                    this.y += left;
                //}
            }
            
        }
    }

    spriteMapper.getImage(sprite).drawImage(context, 384, 320);
}