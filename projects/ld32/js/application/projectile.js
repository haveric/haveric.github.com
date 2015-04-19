var Projectile = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.dir = "n";
    this.velocity = 5;
    this.sqrtVelocity = Math.sqrt(this.velocity);
    this.sprite = 'projectile';
    this.rotation = 0;
    this.rotationSpeed = (Math.random() * 3) + .2;
    this.rotationDirection = Math.floor((Math.random() * 2) + 1);
    this.name = "";
    this.bulletHits = 1;
}

Projectile.prototype.setRandomDirection = function() {
    var rand = Math.floor((Math.random() * 8) + 1);
    switch (rand) {
        case 1: this.dir = "n"; break;
        case 2: this.dir = "ne"; break;
        case 3: this.dir = "e"; break;
        case 4: this.dir = "se"; break;
        case 5: this.dir = "s"; break;
        case 6: this.dir = "sw"; break;
        case 7: this.dir = "w"; break;
        case 8: this.dir = "nw"; break;
        default: this.dir = "n"; break;
    }
}

Projectile.prototype.move = function(index) {
    if (this.dir == "n") {
        this.y -= this.velocity;
    } else if (this.dir == "ne") {
        this.y -= this.sqrtVelocity;
        this.x += this.sqrtVelocity;
    } else if (this.dir == "e") {
        this.x += this.velocity;
    } else if (this.dir == "se") {
        this.x += this.sqrtVelocity;
        this.y += this.sqrtVelocity;
    } else if (this.dir == "s") {
        this.y += this.velocity;
    } else if (this.dir == "sw") {
        this.y += this.sqrtVelocity;
        this.x -= this.sqrtVelocity;
    } else if (this.dir == "w") {
        this.x -= this.velocity;
    } else if (this.dir == "nw") {
        this.x -= this.sqrtVelocity;
        this.y -= this.sqrtVelocity;
    }
    
    if (this.x < -50 || this.x > CANVAS_WIDTH + 50 || this.y < -50 || this.y > CANVAS_HEIGHT) {
        killProjectile(index);
    }
    
    this.rotate();
}

Projectile.prototype.rotate = function() {
    if (this.rotationDirection == 1) {
        this.rotation += this.rotationSpeed;

        if (this.rotation >= 360) {
            this.rotation -= 360;
        }
    } else {
        this.rotation -= this.rotationSpeed;
        
        if (this.rotation < 0) {
            this.rotation += 360;
        }
    }
}

Projectile.prototype.draw = function(context, frame) {
    spriteMapper.getImage(this.sprite).drawImage(context, this.x, this.y, this.rotation);
}

var Needles = function(x, y) {
    Projectile.call(this, x, y);
    this.name = "Needles";
    this.sprite = "needlesItem";
}

Needles.prototype = new Projectile();
Needles.prototype.constructor = Needles;

var Fridge = function(x, y) {
    Projectile.call(this, x, y);
    this.name = "Fridge";
    this.sprite = "fridgeItem";
    this.bulletHits = 5;
}

Fridge.prototype = new Projectile();
Fridge.prototype.constructor = Fridge;


var Turret = function(x, y) {
    Projectile.call(this, x, y);
    this.name = "Turret";
    this.sprite = "turretItem";
}

Turret.prototype = new Projectile();
Turret.prototype.constructor = Turret;

var Crate = function(x, y) {
    Projectile.call(this, x, y);
    this.name = "Crate";
    this.sprite = "crateItem";
}

Crate.prototype = new Projectile();
Crate.prototype.constructor = Crate;


var ControlPanel = function(x, y) {
    Projectile.call(this, x, y);
    this.name = "Control Panel";
    this.sprite = "controlpanelItem";
}

ControlPanel.prototype = new Projectile();
ControlPanel.prototype.constructor = ControlPanel;

function killProjectile(index) {
    if (index >= 0 && index < projectiles.length) {
        projectiles.splice(index, 1);
    }
}

