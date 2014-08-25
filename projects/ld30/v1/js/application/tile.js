var Tile = function(name, sprite) {
    this.name = name;
    this.sprite = sprite;
    this.canWalk = false;
    this.isSolid = false;
}

Tile.prototype.draw = function(frame, ax, ay, x, y, i, j) {
    var newSprite = this.sprite;
    if (this instanceof Solid) {
        var topTile = map.getTile(ax,ay-1);
        
        var leftTile = map.getTile(ax-1, ay);
        var rightTile = map.getTile(ax+1, ay);
        if (topTile instanceof Empty) {
            if (leftTile instanceof Empty && rightTile instanceof Empty) {
                newSprite += "-tm";
            } else if (leftTile instanceof Empty) {
                newSprite += "-tl";
            } else if (rightTile instanceof Empty) {
                newSprite += "-tr";
            } else {
                newSprite += "-top";
            }
        }
    }
    
    spriteMapper.getImage(newSprite).drawImage(x*32 - i, y*32 - j);
}

Tile.prototype.getCanWalk = function() {
    return this.canWalk;
}

var Empty = function() {
    Tile.call(this, "empty", "empty");
    this.canWalk = true;
}

Empty.prototype = new Tile();
Empty.prototype.constructor = Empty;

var Solid = function() {
    Tile.call(this, "solid", "solid");
    this.canWalk = true;
    this.isSolid = true;
}

Solid.prototype = new Tile();
Solid.prototype.constructor = Solid;