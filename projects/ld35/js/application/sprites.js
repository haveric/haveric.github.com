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

spriteMapper.addImage('player-gear4-0', 'player', 0, 48, 48, 48);
spriteMapper.addImage('player-gear4-1', 'player', 48, 48, 48, 48);
spriteMapper.addImage('player-gear4-2', 'player', 96, 48, 48, 48);
spriteMapper.addImage('player-gear4-3', 'player', 144, 48, 48, 48);
spriteMapper.addImage('player-gear4-4', 'player', 0, 96, 48, 48);

spriteMapper.addImage('player-gear5-0', 'player', 0, 96, 48, 48);
spriteMapper.addImage('player-gear5-1', 'player', 48, 96, 48, 48);
spriteMapper.addImage('player-gear5-2', 'player', 96, 96, 48, 48);
spriteMapper.addImage('player-gear5-3', 'player', 144, 96, 48, 48);
spriteMapper.addImage('player-gear5-4', 'player', 0, 144, 48, 48);

spriteMapper.addImage('player-gear6-0', 'player', 0, 144, 48, 48);
spriteMapper.addImage('player-gear6-1', 'player', 48, 144, 48, 48);
spriteMapper.addImage('player-gear6-2', 'player', 96, 144, 48, 48);
spriteMapper.addImage('player-gear6-3', 'player', 144, 144, 48, 48);
spriteMapper.addImage('player-gear6-4', 'player', 0, 192, 48, 48);

spriteMapper.addImage('player-gear7-0', 'player', 0, 192, 48, 48);
spriteMapper.addImage('player-gear7-1', 'player', 48, 192, 48, 48);
spriteMapper.addImage('player-gear7-2', 'player', 96, 192, 48, 48);
spriteMapper.addImage('player-gear7-3', 'player', 144, 192, 48, 48);
spriteMapper.addImage('player-gear7-4', 'player', 0, 240, 48, 48);

spriteMapper.addImage('player-gear8-0', 'player', 0, 240, 48, 48);
spriteMapper.addImage('player-gear8-1', 'player', 0, 240, 48, 48);
spriteMapper.addImage('player-gear8-2', 'player', 0, 240, 48, 48);
spriteMapper.addImage('player-gear8-3', 'player', 0, 240, 48, 48);