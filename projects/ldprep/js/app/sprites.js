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
    spritesPreloaded = false;
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

SpriteMapper.prototype.preloadSprites = function() {
    if (!spritesPreloaded) {
        var numSprites = sprites.length;
        var numLoaded = 0;

        sprites.forEach(function(sprite) {
            if (sprite.loadTexture()) {
                numLoaded ++;
            }
        });

        if (numLoaded == numSprites) {
            spritesPreloaded = true;
        }
    }

    return spritesPreloaded;
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

Sprite.prototype.loadTexture = function() {
    if (this.texture == null) {
        this.texture = textureMapper.getTexture(this.textureName);
    }

    return this.texture != null;
}

Sprite.prototype.drawImage = function (context, i, j, degrees) {
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


var textureMapper = new TextureMapper();
textureMapper.addTexture('sprites', 'img/placeholder.gif');
textureMapper.addTexture('player', 'img/player.gif');

var spriteMapper = new SpriteMapper();
spriteMapper.addImage('path', 'sprites', 0, 0);
spriteMapper.addImage('player', 'player', 0, 0);