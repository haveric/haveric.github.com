var enemies = [];

var Enemy = function(name, map, player) {
    this.name = name;
    var randX = -1; 
    var randY = -1;
    
    while (randX == -1 || randY == -1) {
        var tempX = getRandBetween(2, map.rows-2);
        var tempY = getRandBetween(2, map.cols-2);
        
        
        var tile = map.getTile(tempX,tempY);
        if (tile.canWalk && tempX != player.x && tempY != player.y) {
            randX = tempX;
            randY = tempY;
        }
    }
    
    this.x = randX;
    this.y = randY;
}

Enemy.prototype.draw = function(context, i, j) {
    var left = i - 12;
    var right = i + 13;
    var top = j - 10;
    var bot = j + 10;
    
    if (this.x >= left && this.x <= right && this.y >= top && this.y <= bot) {
        spriteMapper.getImage(this.name).drawImage(context, (this.x-left)*32, (this.y-top)*32);
    }
}

Enemy.prototype.moveRandomly = function(map) { 
    var rand = Math.floor(Math.random()*4);

    if (rand == 0) {
        this.moveLeft(map);
    } else if (rand == 1) {
        this.moveRight(map);
    } else if (rand == 2) {
        this.moveUp(map);
    } else if (rand == 3) {
        this.moveDown(map);
    }
}

Enemy.prototype.moveUp = function(map) {
    if (this.y > 0) {
        var tile = map.getTile(this.x, this.y-1);
        if (tile == null) {
            
        } else if (tile.canWalk){
            this.y--;
        }
    }
}
Enemy.prototype.moveDown = function(map) {
    if (this.y < map.cols) {
        var tile = map.getTile(this.x, this.y+1);
        if (tile == null) {
            
        } else if (tile.canWalk){
            this.y++;
        }
    }
}
Enemy.prototype.moveLeft = function(map) {
    if (this.x > 0) {
        var tile = map.getTile(this.x-1, this.y);
        if (tile == null) {
            
        } else if (tile.canWalk){
            this.x--;
        }
    }
}

Enemy.prototype.moveRight = function(map) {
    if (this.x < map.rows) {
        var tile = map.getTile(this.x+1, this.y);
        if (tile == null) {
            
        } else if (tile.canWalk){
            this.x++;
        }
    }
}

function getRandBetween(from, to) {
    return Math.floor(Math.random()*(to-from+1) + from);
}

function killEnemy(index) {
    if (index > 0 && index < enemies.length) {
        enemies.splice(index, 1);
    }
}