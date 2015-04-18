var Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = Math.floor((Math.random() * 5) + 5); 
    this.sprite = "enemy";
}

Enemy.prototype.move = function(index) {
    this.y -= this.velocity;
    
    if (this.y < -50) {
        killEnemy(index);
    }
}

Enemy.prototype.draw = function(context, frame) {
    spriteMapper.getImage(this.sprite).drawImage(context, this.x, this.y);
}

function killEnemy(index) {
    if (index >= 0 && index < enemies.length) {
        enemies.splice(index, 1);
    }
}