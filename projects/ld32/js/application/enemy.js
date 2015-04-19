var Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = Math.floor((Math.random() * 2) + 1); 
    this.sprite = "enemy";
}

Enemy.prototype.move = function(index) {
    this.y -= this.velocity;
    
    if (this.y < -50) {
        killEnemy(index);
    }
}

Enemy.prototype.shoot = function(playerX, playerY) {
    var randX = (Math.random() * 100) - 50;
    var randY = (Math.random() * 100) - 50;
    var angle = Math.atan2(playerY + randX - this.y, playerX + randY - this.x) * 180 / Math.PI;
    var bullet = new Bullet(this.x+16, this.y+16, angle);

    bullets.push(bullet);
}

Enemy.prototype.draw = function(context, frame) {
    spriteMapper.getImage(this.sprite).drawImage(context, this.x, this.y);
}

var RapidFireEnemy = function(x, y) {
    Enemy.call(this, x, y);
    this.sprite = "rapidEnemy";
}

RapidFireEnemy.prototype = new Enemy();
RapidFireEnemy.prototype.constructor = RapidFireEnemy;

RapidFireEnemy.prototype.shoot = function(playerX, playerY) {
    this.shootHelper(this, playerX, playerY, 3);
}

RapidFireEnemy.prototype.shootHelper = function(enemy, playerX, playerY, times) {
    Enemy.prototype.shoot.call(enemy, playerX, playerY);
    
    setTimeout(function(){        
        if (times > 1) {
            enemy.shootHelper(enemy, playerX, playerY, times-1);
        }
    },20);
}

var SpiralFireEnemy = function(x, y) {
    Enemy.call(this, x, y);
    this.sprite = "spiralEnemy";
}

SpiralFireEnemy.prototype = new Enemy();
SpiralFireEnemy.prototype.constructor = SpiralFireEnemy;

SpiralFireEnemy.prototype.shoot = function(playerX, playerY) {
    this.shootHelper(this, playerX, playerY+300, 4);
}

SpiralFireEnemy.prototype.shootHelper = function(enemy, x, y, times) {
    Enemy.prototype.shoot.call(enemy, x, y);
    
    setTimeout(function() {
        if (times > 1) {
            enemy.shootHelper(enemy, x, y-150, times - 1);
        }
    },30);
}


function killEnemy(index) {
    if (index >= 0 && index < enemies.length) {
        enemies.splice(index, 1);
    }
}