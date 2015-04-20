var globalEnemyId = 0;

var Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = Math.floor((Math.random() * 2) + 1); 
    this.sprite = "enemy";
    
    this.curFrame = 1;
    this.frameMod = 10;
    this.dying = false;
    
    this.id = globalEnemyId;
    globalEnemyId ++;
}

Enemy.prototype.move = function(index) {
    if (!this.dying) {
        this.y -= this.velocity;
    }
    
    if (this.y < -50) {
        killEnemy(index);
    }
}

Enemy.prototype.shoot = function(playerX, playerY) {
    if (!this.dying) {
        var randX = (Math.random() * 100) - 50;
        var randY = (Math.random() * 100) - 50;
        var angle = Math.atan2(playerY + randX - this.y, playerX + randY - this.x) * 180 / Math.PI;
        
        if (this instanceof RapidFireEnemy) {
            var bullet = new Bullet3(this.x+16, this.y+16, angle);
            bullets.push(bullet);
        } else if (this instanceof SpiralFireEnemy) {
            var bullet = new Bullet2(this.x+16, this.y+16, angle);
            bullets.push(bullet);
        } else {
            var bullet = new Bullet(this.x+16, this.y+16, angle);
            bullets.push(bullet);
        }
        enemyBulletsFired ++;
        soundManager.play('enemyShoot');
    }
}

Enemy.prototype.draw = function(context, frame) {
    
    if (frame % this.frameMod == 0) {
        this.curFrame ++;
        
        if (this.curFrame > 3) {
            this.curFrame = 1;
        }
    }
    
    spriteMapper.getImage(this.sprite + this.curFrame).drawImage(context, this.x, this.y);
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