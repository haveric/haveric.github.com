var Player = function(x, y) {
    this.x = x;
    this.y = y;
    //this.isJumping = false;
    this.shovel = true;
    this.ladder = true;
    this.sword = true;
    this.jump = true;
    this.activeItem = "sword";
    this.direction = "up";
    this.height = 0;
}

Player.prototype.canWalkUpLadder = function() {
    var canWalk = false;
    
    var ladderLength = ladders.length;
    for (var i = 0; i < ladderLength; i++) {
        var ladder = ladders[i];
        if (ladder.x == this.x && ladder.y == this.y && ladder.direction == this.direction) {
            canWalk = true;
            break;
        }
    }
    
    return canWalk;
}

Player.prototype.moveUp = function(map) {
    this.direction = "up";
    if (this.y > 0) {
        var tile = map.getTile(this.x, this.y-1);
        if (tile == null) {
            
        } else if (tile.canWalk){
            this.y--;
            this.height = 0;
        } else if (tile.name == "grass") {
            if (this.height == 0 && this.canWalkUpLadder()) {
                this.height = 1;
                this.y--;
            } else if (this.height == 1) {
                this.y--;
            }
        }
    }
}
Player.prototype.moveDown = function(map) {
    this.direction = "down";
    if (this.y < map.cols-1) {
        var tile = map.getTile(this.x, this.y+1);
        if (tile == null) {
            
        } else if (tile.canWalk){
            this.y++;
            this.height = 0;
        } else if (tile.name == "grass") {
            if (this.height == 0 && this.canWalkUpLadder()) {
                this.height = 1;
                this.y++;
            } else if (this.height == 1) {
                this.y++;
            }
        }
    }
}
Player.prototype.moveLeft = function(map) {
    this.direction = "left";
    if (this.x >= 1) {
        var tile = map.getTile(this.x-1, this.y);
        if (tile == null) {
            
        } else if (tile.canWalk){
            this.x--;
            this.height = 0;
        } else if (tile.name == "grass") {
            if (this.height == 0 && this.canWalkUpLadder()) {
                this.height = 1;
                this.x--;
            } else if (this.height == 1) {
                this.x--;
            }
        }
    }
}

Player.prototype.moveRight = function(map) {
    this.direction = "right";
    if (this.x < map.rows-1) {
        var tile = map.getTile(this.x+1, this.y);
        if (tile == null) {
            
        } else if (tile.canWalk){
            this.x++;
            this.height = 0;
        } else if (tile.name == "grass") {
            if (this.height == 0 && this.canWalkUpLadder()) {
                this.height = 1;
                this.x++;
            } else if (this.height == 1) {
                this.x++;
            }
        }
    }
}

Player.prototype.getX = function() {
    return this.x;
}

Player.prototype.getY = function() {
    return this.y;
}

Player.prototype.setActiveItem = function(action) {
    this.activeItem = action;
}
Player.prototype.performAction = function(map) {
    var action = this.activeItem;
    if (action == "none") {
        
    } else if (action == "ladder") {
        this.useLadder(map);
    } else if (action == "sword") {
        this.useSword(map);
    } else if (action == "jump") {
        this.useJump(map);
    } else if (action == "shovel") {
        this.useShovel(map);
    }
}
Player.prototype.useLadder = function(map) {
    if (this.ladder) {
        var tile = map.getTile(this.x, this.y);
        if (tile.name == "path") {
            
            var tileGrass;
            if (this.direction == "up") {
                tileGrass = map.getTile(this.x, this.y-1);
            } else if (this.direction == "down") {
                tileGrass = map.getTile(this.x, this.y+1);
            } else if (this.direction == "left") {
                tileGrass = map.getTile(this.x-1, this.y);
            } else if (this.direction == "right") {
                tileGrass = map.getTile(this.x+1, this.y);
            }
            if (tileGrass.name == "grass") {
                ladders[ladders.length] = new Ladder(this.x, this.y, this.direction);
                
                this.ladder = false;
                this.activeItem = "none";
            }
        }
    }
}

Player.prototype.useSword = function(map) {
    if (this.sword) {
        var tempX = this.x;
        var tempY = this.y;
        
        if (this.direction == "up") {
            tempY = this.y - 1;
        } else if (this.direction == "down") {
            tempY = this.y + 1;
        } else if (this.direction == "left") {
            tempX = this.x - 1;
        } else if (this.direction == "right") {
            tempX = this.x + 1;
        }
        var enemyLength = enemies.length;
        var enemyToKill = -1;
        for (var i = 0; i < enemyLength; i++) {
            var enemy = enemies[i];
            if (enemy.x == tempX && enemy.y == tempY) {
                enemyToKill = i;
                break;
            }
        }
        if (enemyToKill != -1) {
            killEnemy(enemyToKill);
            this.sword = false;
            this.activeItem = "none";
        }
    }
}

Player.prototype.useJump = function(map) {
    if (this.jump) {
        
        if (this.height == 1) {
            var tile = null;
            var tile2 = null;
            var tempX = this.x;
            var tempY = this.y;
            if (this.direction == "up") {
                tempY = this.y - 2;
                tile = map.getTile(tempX, tempY);
                tile2 = map.getTile(tempX, tempY+1);
            } else if (this.direction == "down") {
                tempY = this.y + 2;
                tile = map.getTile(tempX, tempY);
                tile2 = map.getTile(tempX, tempY-1);
            } else if (this.direction == "left") {
                tempX = this.x - 2;
                tile = map.getTile(tempX, tempY);
                tile2 = map.getTile(tempX+1, tempY);
            } else if (this.direction == "right") {
                tempX = this.x + 2;
                tile = map.getTile(tempX, tempY);
                tile2 = map.getTile(tempX-1, tempY);
            }
            
            if (tile.name == "grass" && tile2.name == "path") {
                this.x = tempX;
                this.y = tempY;
                this.jump = false;
                this.activeItem = "none";
            }
        }
        
    }
}

Player.prototype.useShovel = function(map) {
    if (this.shovel) {
        var tile = null;

        var tempX = this.x;
        var tempY = this.y;
        if (this.direction == "up") {
            tempY = this.y - 1;
            tile = map.getTile(tempX, tempY);
        } else if (this.direction == "down") {
            tempY = this.y+1;
            tile = map.getTile(tempX, tempY);
        } else if (this.direction == "left") {
            tempX = this.x - 1;
            tile = map.getTile(tempX, tempY);
        } else if (this.direction == "right") {
            tempX = this.x + 1;
            tile = map.getTile(tempX, tempY);
        }
        
        if (tile.name == "grass") {
            this.shovel = false;
            this.activeItem = "none";
            
            map.tiles[tempX][tempY] = new Path();
            
        }
    }
}

Player.prototype.draw = function(context) {
    var sprite = "player-" + this.direction;
    if (this.activeItem == "sword") {
        sprite += "-sword";
    }

    spriteMapper.getImage(sprite).drawImage(context, 384, 320);
}