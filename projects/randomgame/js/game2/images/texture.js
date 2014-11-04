var TextureManager = function() {
    var textures = [];
}

TextureManager.prototype.addTexture = function(name, src) {
    var image = new Image();
    image.src = src;
    image.onload = function() {
        textures[textures.length] = new Texture(name, image);
    };
}

TextureManager.prototype.getTextureImage = function(textureName) {
    var image = null;
    
    var length = textures.length;
    for (var i = 0; i < length; i++) {
        if (textures[i].name == textureName) {
            image = textures[i].image;
            break;
        }
    }
    return image;
}

var Texture = function(name, image) {
    this.name = name;
    this.image = image;
}

var textureManager = new TextureManager();