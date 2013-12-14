var TextureMapper = function () {
    textures = [];
}

TextureMapper.prototype.addTexture = function(name, src) {
    console.log("Name: " + name + ", src: " + src);
    var image = new Image();
    
    image.onload = function () {
        console.log("Texture added");
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
    this.w = w;
    this.h = h;
}

Sprite.prototype.drawImage = function (context, i, j) {
    if (this.texture == null) {
        this.texture = textureMapper.getTexture(this.textureName);
    } else {
        context.drawImage(this.texture, this.x, this.y, this.w, this.h, i, j, this.w, this.h);
    }
}


var textureMapper = new TextureMapper();
textureMapper.addTexture('sprites', 'img/sprites.png');

var spriteMapper = new SpriteMapper();
spriteMapper.addImage('grass', 'sprites', 0, 0, 32, 32);
spriteMapper.addImage('path', 'sprites', 32, 0, 32, 32);
spriteMapper.addImage('pathsl', 'sprites', 0, 32, 32, 32);
spriteMapper.addImage('pathsbl', 'sprites', 32, 32, 32, 32);
spriteMapper.addImage('pathsb', 'sprites', 64, 32, 32, 32);
spriteMapper.addImage('pathsbl2', 'sprites', 96, 32, 32, 32);
spriteMapper.addImage('pathsl2', 'sprites', 128, 32, 32, 32);
spriteMapper.addImage('pathsb2', 'sprites', 160, 32, 32, 32);
spriteMapper.addImage('player', 'sprites', 64, 0, 32, 32);