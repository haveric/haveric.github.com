var TILE_SIZE = 32;

var TileMap = function(numXTiles, numYTiles) {
    this.numXTiles = numXTiles;
    this.numYTiles = numYTiles;
    this.map = create2DArray(numXTiles);
}

TileMap.prototype.draw = function(width, height, xTile, yTile, xOffset, yOffset) {
    
}

function create2DArray(rows) {
    var arr = [];
    for (var i = 0; i < rows; i++) {
        arr[i] = [];
    }
    return arr;
}