var TextureMapper = function () {
    textures = [];
}

TextureMapper.prototype.addTexture = function(name, src) {
    var image = new Image();
    
    image.onload = function () {
        textures.push(new Texture(name, image));
    };
    image.src = src;
}

TextureMapper.prototype.getTexture = function(textureName) {
    var length = textures.length;
    for (var i = 0; i < length; i++) {
        if (textures[i].name === textureName) {
            return textures[i].image;
        }
    }
    return null;
}

var Texture = function (name, image) {
    this.name = name;
    this.image = image;
}



var SpriteMapper = function () {
    sprites = [];
}

SpriteMapper.prototype.addImage = function (imageName, textureName, x, y, w, h) {
    sprites.push(new Sprite(imageName, textureName, x, y, w, h));
}

SpriteMapper.prototype.getImage = function(imgName) {
    var length = sprites.length;
    for (var i = 0; i < length; i++) {
        if (sprites[i].imageName === imgName) {
            return sprites[i];
        }
    }
    return null;
}

var Sprite = function (imageName, textureName, x, y, w, h) {
    this.imageName = imageName;
    this.textureName = textureName;
    this.texture = textureMapper.getTexture(textureName);
    this.x = x;
    this.y = y;
    this.w = w || 32;
    this.h = h || 32;
}

Sprite.prototype.drawImage = function (context, i, j, degrees) {
    if (this.texture == null) {
        this.texture = textureMapper.getTexture(this.textureName);
    } else {
        if (degrees != null && degrees > 0) {
            context.save();
            context.translate(i+this.w/2, j+this.h/2);
            context.rotate(degrees * Math.PI / 180);
        
            context.drawImage(this.texture, this.x, this.y, this.w, this.h, -this.w/2, -this.h/2, this.w, this.h);

            context.restore();
        } else {
            context.drawImage(this.texture, this.x, this.y, this.w, this.h, i, j, this.w, this.h);
        }
    }
}


var textureMapper = new TextureMapper();
textureMapper.addTexture('player', 'img/player.png');
textureMapper.addTexture('objects', 'img/objects.png');
textureMapper.addTexture('enemies', 'img/enemies.png');
textureMapper.addTexture('projectiles', 'img/projectiles.png');

var spriteMapper = new SpriteMapper();
spriteMapper.addImage('path', 'sprites', 0, 0);
spriteMapper.addImage('player', 'player', 0, 0, 32, 64);
spriteMapper.addImage('player1', 'player', 32, 0, 32, 64);
spriteMapper.addImage('player2', 'player', 64, 0, 32, 64);
spriteMapper.addImage('player3', 'player', 96, 0, 32, 64);
spriteMapper.addImage('player4', 'player', 128, 0, 32, 64);

spriteMapper.addImage('player-boost', 'player', 0, 64, 32, 64);
spriteMapper.addImage('player-boost1', 'player', 32, 64, 32, 64);
spriteMapper.addImage('player-boost2', 'player', 64, 64, 32, 64);
spriteMapper.addImage('player-boost3', 'player', 96, 64, 32, 64);
spriteMapper.addImage('player-boost4', 'player', 128, 64, 32, 64);


spriteMapper.addImage('asteroid', 'objects', 0, 0);
spriteMapper.addImage('projectile', 'objects', 32, 0);
spriteMapper.addImage('enemy', 'enemies', 0, 0);
spriteMapper.addImage('enemy1', 'enemies', 32, 0);
spriteMapper.addImage('enemy2', 'enemies', 64, 0);
spriteMapper.addImage('enemy3', 'enemies', 96, 0);
spriteMapper.addImage('spiralEnemy', 'enemies', 0, 32);
spriteMapper.addImage('spiralEnemy1', 'enemies', 32, 32);
spriteMapper.addImage('spiralEnemy2', 'enemies', 64, 32);
spriteMapper.addImage('spiralEnemy3', 'enemies', 96, 32);
spriteMapper.addImage('rapidEnemy', 'enemies', 0, 64);
spriteMapper.addImage('rapidEnemy1', 'enemies', 32, 64);
spriteMapper.addImage('rapidEnemy2', 'enemies', 64, 64);
spriteMapper.addImage('rapidEnemy3', 'enemies', 96, 64);
spriteMapper.addImage('bullet1', 'enemies', 128, 0, 6, 6);
spriteMapper.addImage('bullet2', 'enemies', 128, 32, 6, 6);
spriteMapper.addImage('bullet3', 'enemies', 128, 64, 6, 6);
spriteMapper.addImage('needlesItem', 'projectiles', 0, 0);
spriteMapper.addImage('fridgeItem', 'projectiles', 32, 0);
spriteMapper.addImage('turretItem', 'projectiles', 64, 0);

spriteMapper.addImage('airlockempty', 'projectiles', 0, 424, 40, 40);
spriteMapper.addImage('airlock0', 'projectiles', 0,464,40,40);
spriteMapper.addImage('airlock1', 'projectiles', 40,464,40,40);
spriteMapper.addImage('airlock2', 'projectiles', 80,464,40,40);
spriteMapper.addImage('airlock3', 'projectiles', 120,464,40,40);
spriteMapper.addImage('airlock4', 'projectiles', 160,464,40,40);
spriteMapper.addImage('airlock5', 'projectiles', 200,464,40,40);
spriteMapper.addImage('airlock6', 'projectiles', 240,464,40,40);
spriteMapper.addImage('airlock7', 'projectiles', 280,464,40,40);
spriteMapper.addImage('airlock8', 'projectiles', 320,464,40,40);