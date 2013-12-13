var SpriteManager = function() {
    var sprites = [];
}

SpriteManager.prototype.addImage = function(imageName, textureName, x, y, width, height) {
    sprites[sprites.length] = new Sprite(imageName, textureName, x, y, width, height);
}

SpriteManager.prototype.getImage = function(imageName) {
    var sprite = null;
    
    var length = sprites.length;
    for (var i = 0; i < length; i++) {
        if (sprites[i].imageName == imageName) {
            sprite = sprites[i];
            break;
        }
    }
    return sprite;
}

var Sprite = function(imageName, textureName, x, y, width, height) {
    this.imageName = imageName;
    this.textureName = textureName;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

var spriteManager = new SpriteManager();