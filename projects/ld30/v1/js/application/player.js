var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.direction = "left";
    this.speed = .8;
    this.maxSpeed = 8;
    this.fallSpeed = 7;
    this.jumpTimer = 0;
    this.jumpSpeed = 12;
    this.xVelocity = 0;
    
    this.jumpVelocity = 2;
    this.maxJumpSpeed = 7;
    this.yVelocity = 0;
    
    this.walk = 0;
    this.attack = 0;
    this.isAttacking = false;
    
    this.width = 32;
    this.height = 32;
    
    this.sonicMax = 100;
    this.sonic = 100;
    this.sonicCost = 15;
    this.regenSonic = 2;
    this.regenModFrames = 10;
}

Player.prototype.moveLeft = function() {
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
        if (this.xVelocity <= 0) {
            this.xVelocity -= this.speed;
            if (this.xVelocity < -this.maxSpeed) {
                this.xVelocity = -this.maxSpeed;
            }

            this.x += this.xVelocity;
        }
    } else {
        var left = ((leftX+1) * 32) - this.x;
        this.x += left;
    }
}

Player.prototype.moveRight = function() {
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
            if (this.xVelocity >= 0) {
                this.xVelocity += this.speed;
                if (this.xVelocity > this.maxSpeed) {
                    this.xVelocity = this.maxSpeed;
                }

                this.x += this.xVelocity;
            }
        } else {
            var right = ((rightX-1) * 32) - this.x;
            this.x += right;
        }
    }
}

Player.prototype.doAttack = function() {
    if (this.isAttacking == false) {
        this.isAttacking = true;
        
        if (this.sonic >= this.sonicCost) {
            this.sonic -= this.sonicCost;
            soundManager.play('attack');
            
            var diffRight = phoneBooth.x * 32 - this.x;
            if (diffRight <= 100 && diffRight >= 0 && this.direction == "right") {
                if (phoneBooth.opening == 0) {
                    phoneBooth.open();
                } else {
                    phoneBooth.close();
                }
            }
            
            var diffLeft = this.x - phoneBooth.x * 32;
            if (diffLeft <= 100 && diffLeft >= 0 && this.direction == "left") {
                if (phoneBooth.opening == 0) {
                    phoneBooth.open();
                } else {
                    phoneBooth.close();
                }
            }
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

Player.prototype.draw = function(frame) {
    var sprite = "player-" + this.direction;
    var frameAnim = 5;
    var originalY = this.y;
    if (this.jumpTimer <= 1) {
        if (this.jumpTimer == -1) {
            this.jumpTimer = 0;
        } else {
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
            
            if (fall) {
                this.y += this.fallSpeed;
            } else {
                var left = (fallTileY -1) * 32 - this.y;
                this.y += left;
                // Stop falling
                if (left > 0) {
                    soundManager.play('land');
                }
            }
        }
    }
    
    var newY = this.y;
    
    if (this.jumpTimer == 1) {
        if (originalY != newY) {
            this.jumpTimer = 0;
        } else {
            //soundManager.play('jump');
        }
    }

    if (this.jumpTimer > 0) {
        // Reached top of jump cycle, stop jumping
        if (this.jumpTimer > 15) {
            this.jumpTimer = -1;
            this.yVelocity = 0;
        } else {
            this.jumpTimer ++;
            
            this.yVelocity += -this.jumpVelocity;
            if (this.yVelocity < -this.maxJumpSpeed) {
                this.yVelocity = -this.maxJumpSpeed;
            }
            
            var jumpTileY = Math.floor((this.y + this.yVelocity) / 32);
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
                this.y += this.yVelocity;
            } else {
                var left = (jumpTileY+1) * 32 - this.y;
                this.y += left;
                // Jump cycle cut off early, stop jumping
                this.jumpTimer = -1;
                this.yVelocity = 0;
            }
        }
    }
    
    var walkSprite = sprite;
    var attackSprite = sprite;
    attackSprite += "-attack" + this.attack;
    if (this.isAttacking) {
        if (this.attack === 7) {
            this.attack = -1;
            this.isAttacking = false;
        }
        this.attack ++;
    }
    walkSprite += "-walk" + this.walk;
    if (this.jumpTimer === 0 && this.xVelocity != 0) {
        if (this.walk === 3) {
            this.walk = 0;
        }
        if (frame % frameAnim == 0) {
            this.walk ++;
        }
    }
    if (this.xVelocity === 0) {
        this.walk = 0;
    }
    
    if (frame % this.regenModFrames == 0) {
        this.sonic += this.regenSonic;
        if (this.sonic > this.sonicMax) {
            this.sonic = this.sonicMax;
        }
    }
    
    spriteMapper.getImage(attackSprite).drawImage(384, 480);
    spriteMapper.getImage(walkSprite).drawImage(384, 496);
    
    spriteMapper.getImage('sonic-empty').drawImage(20, 20);
    if (this.sonic > 0) {
        spriteMapper.getImage('sonic-full').drawImage(22, 22, this.sonic);
    }
}