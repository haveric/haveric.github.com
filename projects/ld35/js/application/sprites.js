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

SpriteMapper.prototype.getSprites = function() {
    return sprites;
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

var spriteMapper = new SpriteMapper();
spriteMapper.addImage('player-gear3-0', 'player', 0, 0, 48, 48);
spriteMapper.addImage('player-gear3-1', 'player', 48, 0, 48, 48);
spriteMapper.addImage('player-gear3-2', 'player', 96, 0, 48, 48);
spriteMapper.addImage('player-gear3-3', 'player', 144, 0, 48, 48);
spriteMapper.addImage('player-gear3-4', 'player', 0, 48, 48, 48);

spriteMapper.addImage('player-gear3-death0', 'player', 240, 0, 64, 64);
spriteMapper.addImage('player-gear3-death1', 'player', 304, 0, 64, 64);
spriteMapper.addImage('player-gear3-death2', 'player', 368, 0, 64, 64);
spriteMapper.addImage('player-gear3-death3', 'player', 432, 0, 64, 64);
spriteMapper.addImage('player-gear3-death4', 'player', 496, 0, 64, 64);
spriteMapper.addImage('player-gear3-death5', 'player', 560, 0, 64, 64);
spriteMapper.addImage('player-gear3-death6', 'player', 560, 560, 64, 64);

spriteMapper.addImage('player-gear4-0', 'player', 0, 48, 48, 48);
spriteMapper.addImage('player-gear4-1', 'player', 48, 48, 48, 48);
spriteMapper.addImage('player-gear4-2', 'player', 96, 48, 48, 48);
spriteMapper.addImage('player-gear4-3', 'player', 144, 48, 48, 48);
spriteMapper.addImage('player-gear4-4', 'player', 0, 96, 48, 48);

spriteMapper.addImage('player-gear4-death0', 'player', 240, 64, 64, 64);
spriteMapper.addImage('player-gear4-death1', 'player', 304, 64, 64, 64);
spriteMapper.addImage('player-gear4-death2', 'player', 368, 64, 64, 64);
spriteMapper.addImage('player-gear4-death3', 'player', 432, 64, 64, 64);
spriteMapper.addImage('player-gear4-death4', 'player', 496, 64, 64, 64);
spriteMapper.addImage('player-gear4-death5', 'player', 560, 64, 64, 64);
spriteMapper.addImage('player-gear4-death6', 'player', 560, 560, 64, 64);

spriteMapper.addImage('player-gear5-0', 'player', 0, 96, 48, 48);
spriteMapper.addImage('player-gear5-1', 'player', 48, 96, 48, 48);
spriteMapper.addImage('player-gear5-2', 'player', 96, 96, 48, 48);
spriteMapper.addImage('player-gear5-3', 'player', 144, 96, 48, 48);
spriteMapper.addImage('player-gear5-4', 'player', 0, 144, 48, 48);

spriteMapper.addImage('player-gear5-death0', 'player', 240, 128, 64, 64);
spriteMapper.addImage('player-gear5-death1', 'player', 304, 128, 64, 64);
spriteMapper.addImage('player-gear5-death2', 'player', 368, 128, 64, 64);
spriteMapper.addImage('player-gear5-death3', 'player', 432, 128, 64, 64);
spriteMapper.addImage('player-gear5-death4', 'player', 496, 128, 64, 64);
spriteMapper.addImage('player-gear5-death5', 'player', 560, 128, 64, 64);
spriteMapper.addImage('player-gear5-death6', 'player', 560, 560, 64, 64);

spriteMapper.addImage('player-gear6-0', 'player', 0, 144, 48, 48);
spriteMapper.addImage('player-gear6-1', 'player', 48, 144, 48, 48);
spriteMapper.addImage('player-gear6-2', 'player', 96, 144, 48, 48);
spriteMapper.addImage('player-gear6-3', 'player', 144, 144, 48, 48);
spriteMapper.addImage('player-gear6-4', 'player', 0, 192, 48, 48);

spriteMapper.addImage('player-gear6-death0', 'player', 240, 192, 64, 64);
spriteMapper.addImage('player-gear6-death1', 'player', 304, 192, 64, 64);
spriteMapper.addImage('player-gear6-death2', 'player', 368, 192, 64, 64);
spriteMapper.addImage('player-gear6-death3', 'player', 432, 192, 64, 64);
spriteMapper.addImage('player-gear6-death4', 'player', 496, 192, 64, 64);
spriteMapper.addImage('player-gear6-death5', 'player', 560, 192, 64, 64);
spriteMapper.addImage('player-gear6-death6', 'player', 560, 560, 64, 64);

spriteMapper.addImage('player-gear7-0', 'player', 0, 192, 48, 48);
spriteMapper.addImage('player-gear7-1', 'player', 48, 192, 48, 48);
spriteMapper.addImage('player-gear7-2', 'player', 96, 192, 48, 48);
spriteMapper.addImage('player-gear7-3', 'player', 144, 192, 48, 48);
spriteMapper.addImage('player-gear7-4', 'player', 0, 240, 48, 48);

spriteMapper.addImage('player-gear7-death0', 'player', 240, 256, 64, 64);
spriteMapper.addImage('player-gear7-death1', 'player', 304, 256, 64, 64);
spriteMapper.addImage('player-gear7-death2', 'player', 368, 256, 64, 64);
spriteMapper.addImage('player-gear7-death3', 'player', 432, 256, 64, 64);
spriteMapper.addImage('player-gear7-death4', 'player', 496, 256, 64, 64);
spriteMapper.addImage('player-gear7-death5', 'player', 560, 256, 64, 64);
spriteMapper.addImage('player-gear7-death6', 'player', 560, 560, 64, 64);

spriteMapper.addImage('player-gear8-0', 'player', 0, 240, 48, 48);
spriteMapper.addImage('player-gear8-1', 'player', 0, 240, 48, 48);
spriteMapper.addImage('player-gear8-2', 'player', 0, 240, 48, 48);
spriteMapper.addImage('player-gear8-3', 'player', 0, 240, 48, 48);

spriteMapper.addImage('player-gear8-death0', 'player', 240, 320, 64, 64);
spriteMapper.addImage('player-gear8-death1', 'player', 304, 320, 64, 64);
spriteMapper.addImage('player-gear8-death2', 'player', 368, 320, 64, 64);
spriteMapper.addImage('player-gear8-death3', 'player', 432, 320, 64, 64);
spriteMapper.addImage('player-gear8-death4', 'player', 496, 320, 64, 64);
spriteMapper.addImage('player-gear8-death5', 'player', 560, 320, 64, 64);
spriteMapper.addImage('player-gear8-death6', 'player', 560, 560, 64, 64);

spriteMapper.addImage('enemy-gear8-0', 'player', 0, 288, 48, 48);
spriteMapper.addImage('enemy-gear7-0', 'player', 0, 336, 48, 48);
spriteMapper.addImage('enemy-gear6-0', 'player', 0, 384, 48, 48);
spriteMapper.addImage('enemy-gear5-0', 'player', 0, 432, 48, 48);
spriteMapper.addImage('enemy-gear4-0', 'player', 0, 480, 48, 48);
spriteMapper.addImage('enemy-gear3-0', 'player', 0, 528, 48, 48);