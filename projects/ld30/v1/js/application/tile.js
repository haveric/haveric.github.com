var Tile = function(name, sprite) {
    this.name = name;
    this.sprite = sprite;
    this.canWalk = false;
    this.isSolid = false;
}

Tile.prototype.draw = function(context, frame, x, y, i, j) {
    spriteMapper.getImage(this.sprite).drawImage(context, x*32 - i, y*32 - j);
}

Tile.prototype.getCanWalk = function() {
    return this.canWalk;
}

var Path = function() {
    Tile.call(this, "path", "path");
    this.canWalk = true;
}

Path.prototype = new Tile();
Path.prototype.constructor = Path;

var Solid = function() {
    Tile.call(this, "solid", "solid");
    this.canWalk = true;
    this.isSolid = true;
}

Solid.prototype = new Tile();
Solid.prototype.constructor = Solid;