var Airlock = function() {
    this.hp = 3;
    this.projectile = this.getNextProjectile();
}

Airlock.prototype.getNextProjectile = function() {
    var projectile;
    var chance = Math.random() * 100;
    
    if (chance < 33) {
        projectile = new Needles();
    } else if (chance < 66) {
        projectile = new Fridge();
    } else {
        projectile = new Turret();
    }
    
    return projectile;
}

Airlock.prototype.updateProjectile = function() {
    this.projectile = this.getNextProjectile();
}