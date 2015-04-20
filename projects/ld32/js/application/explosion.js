var Explosion = function(x, y, enemyId) {
    this.x = x;
    this.y = y;
    this.curFrame = 0;
    this.frameMod = 10;
    this.enemyId = enemyId;
    this.killedEnemy = false;
    soundManager.play('enemyExplode');
}

Explosion.prototype.update = function(index) {
    var self = this;
    if (!this.killedEnemy && this.curFrame >= 4) {
        enemies.forEach(function(enemy, eIndex) {
            if (enemy.id == self.enemyId) {
                killEnemy(eIndex);
            }
        });
    }
    if (this.curFrame >= 8) {
        killExplosion(index);
    }
}
Explosion.prototype.draw = function(context, frame) {
    var sprite = "enemy-explosion";
    
    if (frame % this.frameMod == 0) {
        this.curFrame ++;
        
        if (this.curFrame > 8) {
            this.curFrame = 8;
        }
    }
    
    sprite += this.curFrame;
    
    if (this.curFrame <= 8) {
        spriteMapper.getImage(sprite).drawImage(context, this.x, this.y);
    }
}

function killExplosion(index) {
    if (index >= 0 && index < explosions.length) {
        explosions.splice(index, 1);
    }
}