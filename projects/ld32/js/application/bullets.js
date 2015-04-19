var Bullet = function(x, y, rotation) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.velocity = 3;

    this.dx = Math.cos(this.rotation * Math.PI / 180) * this.velocity;
    this.dy = Math.sin(this.rotation * Math.PI / 180) * this.velocity;

    this.sprite = "bullet1";
}

Bullet.prototype.move = function(index) {
    this.x += this.dx;
    this.y += this.dy;
    
    if (this.x < -50 || this.x > CANVAS_WIDTH + 50 || this.y < -50 || this.y > CANVAS_HEIGHT) {
        killBullet(index);
    }
}

Bullet.prototype.draw = function(context, frame) {
    spriteMapper.getImage(this.sprite).drawImage(context, this.x, this.y, this.rotation);
}

var Bullet2 = function(x, y, rotation) {
    Bullet.call(this, x, y, rotation);
    this.sprite = "bullet2";
}

Bullet2.prototype = new Bullet();
Bullet2.prototype.constructor = Bullet2;

var Bullet3 = function(x, y, rotation) {
    Bullet.call(this, x, y, rotation);
    this.sprite = "bullet3";
}

Bullet3.prototype = new Bullet();
Bullet3.prototype.constructor = Bullet3;


function killBullet(index) {
    if (index >= 0 && index < bullets.length) {
        bullets.splice(index, 1);
    }
}