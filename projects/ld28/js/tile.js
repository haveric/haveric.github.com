var Tile = function(name, sprite) {
    this.name = name;
    this.sprite = sprite;
    this.canWalk = false;
}

Tile.prototype.draw = function(context, x, y, map, i, j) {
    if (this.name == "path") {
        var right = map.getTile(i+1, j);
        var top = map.getTile(i, j-1);
        var topRight = map.getTile(i+1, j-1);
        var sprite = this.sprite;

        if (right != null && top != null && topRight != null) {
            if (right.name == "grass" && top.name == "grass") {
                sprite = this.spriteShadowBL2;
            } else if (right.name == "grass" && topRight.name == "grass") {
                sprite = this.spriteShadowL;
            } else if (right.name == "grass") {
                sprite = this.spriteShadowL2;
            } else if (top.name == "grass" && topRight.name == "grass") {
                sprite = this.spriteShadowB;
            } else if (top.name == "grass") {
                sprite = this.spriteShadowB2;
            } else if (topRight.name == "grass") {
                sprite = this.spriteShadowBL;
            }
        }
        
        spriteMapper.getImage(sprite).drawImage(context, x*32, y*32);
    } else {
        spriteMapper.getImage(this.sprite).drawImage(context, x*32, y*32);
    }
}

Tile.prototype.getCanWalk = function() {
    return this.canWalk;
}
var Path = function() {
    Tile.call(this, "path", "path");
    this.canWalk = true;
    this.spriteShadowL = "pathsl";
    this.spriteShadowBL = "pathsbl";
    this.spriteShadowB = "pathsb";
    this.spriteShadowBL2 = "pathsbl2";
    this.spriteShadowL2 = "pathsl2";
    this.spriteShadowB2 = "pathsb2";
}

Path.prototype = new Tile();
Path.prototype.constructor = Path;

var Wall = function() {
    Tile.call(this, "grass", "grass");
    this.canWalk = false;
}

Wall.prototype = new Tile();
Wall.prototype.constructor = Wall;

