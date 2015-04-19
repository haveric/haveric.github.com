var Airlock = function(x, y) {
    this.x = x;
    this.y = y;
    this.hp = 3;
    this.projectile = this.getNextProjectile();
    this.sprite = "airlock";
    
    this.curFrame = 8;
    this.open = true;
}

Airlock.prototype.getNextProjectile = function() {
    var projectile;
    var chance = Math.random() * 100;
    
    if (chance < 25) {
        projectile = new ControlPanel(this.x+3, this.y+6);
    } else if (chance < 50) {
        projectile = new Fridge(this.x+3, this.y+6);
    } else if (chance < 75) {
        projectile = new Crate(this.x+3, this.y+6);
    } else {
        projectile = new Turret(this.x+3, this.y+6);
    }
    
    return projectile;
}

Airlock.prototype.updateProjectile = function() {
    this.projectile = this.getNextProjectile();
}

Airlock.prototype.openDoor = function() {
    this.open = true;
}

Airlock.prototype.closeDoor = function() {
    this.open = false;
}

Airlock.prototype.draw = function(context, frame) {
    if (this.open) {
        if (this.curFrame < 8) {
            this.curFrame ++;
        }
    } else {
        if (this.curFrame > 0) {
            this.curFrame --;
        }
    }
    
    spriteMapper.getImage('airlockempty').drawImage(context, this.x, this.y);
    this.projectile.draw(context, frame);
    spriteMapper.getImage(this.sprite + this.curFrame).drawImage(context, this.x, this.y);
}