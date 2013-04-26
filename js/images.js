var TextureMapper = function () {
    textures = [];
}

TextureMapper.prototype.addTexture = function(name, src) {
    var image = new Image();
    image.src = src;
    image.onload = function () {
        textures.push(new Texture(name, image));
    };
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
/*
SpriteMapper.prototype.addImage = function (imageName, textureName) {
    sprites.push(new Sprite(imageName, textureName, 0, 0, 32, 32));
}
*/
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
    this.w = w;
    this.h = h;
}

Sprite.prototype.drawImage = function (x, y, context) {
    if (this.texture == null) {
        this.texture = textureMapper.getTexture(this.textureName);
    } else if (context == null) {
        bufferCtx.drawImage(this.texture, this.x, this.y, this.w, this.h, x, y, this.w, this.h);
    } else {
        context.drawImage(this.texture, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h);
    }
}



var textureMapper = new TextureMapper();
textureMapper.addTexture('monster','img/monster.png');
textureMapper.addTexture('stone','img/newgame/stone.png');

var spriteMapper = new SpriteMapper();
spriteMapper.addImage('grass1','stone', 0, 0, 32, 32);
spriteMapper.addImage('dirt1','stone', 32, 0, 32, 32);