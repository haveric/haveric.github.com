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
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
            this.tiles[i][j] = new Path();
        }
    }
}

MapTiled.prototype.draw = function(context, frame, x, y) {
    var initialLeft = x - 12;
    var initialTop = y - 10;
    var left = initialLeft;
    var right = x + 13;
    var top = initialTop;
    var bot = y + 10;

    if (left < 0) {
        left = 0;
    }

    if (right >= this.rows) {
        right = this.rows;
    }

    if (top < 0) {
        top = 0;
    }

    if (bot >= this.cols) {
        bot = this.cols;
    }

    for (var i = left; i < right; i++) {
        for (var j = top; j < bot; j++) {
            var tile = this.tiles[i][j];
            tile.draw(context, frame, i-initialLeft, j-initialTop, this, i, j);
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