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

Sprite.prototype.drawImage = function (context, i, j) {
    if (this.texture == null) {
        this.texture = textureMapper.getTexture(this.textureName);
    } else {
        context.drawImage(this.texture, this.x, this.y, this.w, this.h, i, j, this.w, this.h);
    }
}


var textureMapper = new TextureMapper();
textureMapper.addTexture('sprites', 'img/placeholder.gif');
textureMapper.addTexture('player', 'img/player.png');
textureMapper.addTexture('solid', 'img/solid.gif');
textureMapper.addTexture('phonebooth', 'img/phonebooth.png');

var spriteMapper = new SpriteMapper();
spriteMapper.addImage('empty', 'sprites', 32, 0);
spriteMapper.addImage('player-left', 'player', 0, 0);
spriteMapper.addImage('player-right', 'player', 0, 32);

spriteMapper.addImage('player-left-walk0', 'player', 0, 0);
spriteMapper.addImage('player-left-walk1', 'player', 32, 0);
spriteMapper.addImage('player-left-walk2', 'player', 64, 0);
spriteMapper.addImage('player-left-walk3', 'player', 96, 0);

spriteMapper.addImage('player-right-walk0', 'player', 0, 32);
spriteMapper.addImage('player-right-walk1', 'player', 32, 32);
spriteMapper.addImage('player-right-walk2', 'player', 64, 32);
spriteMapper.addImage('player-right-walk3', 'player', 96, 32);

spriteMapper.addImage('solid', 'solid', 0, 0);

spriteMapper.addImage('phonebooth', 'phonebooth', 0, 0, 32, 64);
spriteMapper.addImage('phonebooth-open0', 'phonebooth', 0, 0, 32, 64);
spriteMapper.addImage('phonebooth-open1', 'phonebooth', 32, 0, 32, 64);
spriteMapper.addImage('phonebooth-open2', 'phonebooth', 64, 0, 32, 64);
spriteMapper.addImage('phonebooth-open3', 'phonebooth', 96, 0, 32, 64);
spriteMapper.addImage('phonebooth-open4', 'phonebooth', 128, 0, 32, 64);

spriteMapper.addImage('phonebooth-fade0', 'phonebooth', 0, 64, 32, 64);
spriteMapper.addImage('phonebooth-fade1', 'phonebooth', 32, 64, 32, 64);
spriteMapper.addImage('phonebooth-fade2', 'phonebooth', 64, 64, 32, 64);
spriteMapper.addImage('phonebooth-fade3', 'phonebooth', 96, 64, 32, 64);
spriteMapper.addImage('phonebooth-fade4', 'phonebooth', 128, 64, 32, 64);
spriteMapper.addImage('phonebooth-fade5', 'phonebooth', 160, 64, 32, 64);
spriteMapper.addImage('phonebooth-fade6', 'phonebooth', 192, 64, 32, 64);
spriteMapper.addImage('phonebooth-fade7', 'phonebooth', 224, 64, 32, 64);
spriteMapper.addImage('phonebooth-fade8', 'phonebooth', 256, 64, 32, 64);