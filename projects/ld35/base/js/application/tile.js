var Tile = function(name, sprite) {
    this.name = name;
    this.sprite = sprite;
    this.canWalk = false;
}

Tile.prototype.draw = function(context, frame, x, y, map, i, j) {
    spriteMapper.getImage(this.sprite).drawImage(context, x*32, y*32);
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