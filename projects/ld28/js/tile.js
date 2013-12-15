var Tile = function(name, sprite) {
    this.name = name;
    this.sprite = sprite;
    this.canWalk = false;
    this.castsShadow = false;
}

Tile.prototype.draw = function(context, x, y, map, i, j) {
    if (this.name == "path") {
        if (i < map.rows-1) {
            var right = map.getTile(i+1, j);
            var top = map.getTile(i, j-1);
            var topRight = map.getTile(i+1, j-1);
            var sprite = this.sprite;
    
            if (right != null && top != null && topRight != null) {
                if (right.castsShadow && top.castsShadow) {
                    sprite = this.spriteShadowBL2;
                } else if (right.castsShadow && topRight.castsShadow) {
                    sprite = this.spriteShadowL;
                } else if (right.castsShadow) {
                    sprite = this.spriteShadowL2;
                } else if (top.castsShadow && topRight.castsShadow) {
                    sprite = this.spriteShadowB;
                } else if (top.castsShadow) {
                    sprite = this.spriteShadowB2;
                } else if (topRight.castsShadow) {
                    sprite = this.spriteShadowBL;
                }
            } else if (j == 0 && right != null) {
                if (right.castsShadow) {
                    sprite = this.spriteShadowL2;
                }
            }
            
            spriteMapper.getImage(sprite).drawImage(context, x*32, y*32);
        } else if (i == map.rows-1) {
            var top = map.getTile(i, j-1);
            if (top.castsShadow) {
                spriteMapper.getImage(this.spriteShadowB).drawImage(context, x*32, y*32);
            } else {
                spriteMapper.getImage(this.sprite).drawImage(context, x*32, y*32);
            }
        }
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
    this.castsShadow = true;
}

Wall.prototype = new Tile();
Wall.prototype.constructor = Wall;

var Brick = function() {
    Tile.call(this, "brick", "brick")
    this.canWalk = false;
    this.castsShadow = true;
}

Brick.prototype = new Tile();
Brick.prototype.constructor = Brick;