var MapTiled = function(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    
    this.tiles = create2dArray(rows);
    this.endX;
    this.endY;
}

MapTiled.prototype.getTiles = function() {
    return this.tiles;
}

MapTiled.prototype.getTile = function(x,y) {
    return this.tiles[x][y];
}
MapTiled.prototype.generate = function() {
    var unvisited = [];
    
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
            this.tiles[i][j] = new Path();
        }
    }
    
    var startX = Math.floor(this.rows / 2);
    var startY = Math.floor(this.cols / 2);
}

MapTiled.prototype.draw = function(context, frame, x, y) {
    var left = x - 12;
    var right = x + 13;
    var top = y - 10;
    var bot = y + 10;
    
    for (var i = left; i < right; i++) {
        for (var j = top; j < bot; j++) {
            if (i < 0 || j < 0 || i >= this.rows || j >= this.cols) {
                // draw nothing
            } else {
                var tile = this.tiles[i][j];
                tile.draw(context, frame, i-left, j-top, this, i, j);
            }
        }
    }
}

function randomizeArray(array) {
    var currentIndex = array.length;
    var temp;
    var randomIndex;
    
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        
        temp = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = array[temp];
    }
    
    return array;
}

function create2dArray(numRows) {
    var array = [];
    
    for (var i = 0; i < numRows; i++) {
        array[i] = [];
    }
    return array;
}