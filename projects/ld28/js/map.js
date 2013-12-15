var Map = function(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    
    this.tiles = create2dArray(rows);
}

Map.prototype.getTiles = function() {
    return this.tiles;
}

Map.prototype.getTile = function(x,y) {
    return this.tiles[x][y];
}
Map.prototype.generate = function() {
    var unvisited = [];
    
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
            
            if (i != 0 && j != 0 && i != this.rows -1 && j != this.cols-1) {
                var rand = Math.floor(Math.random()*2);
                if (rand == 0) {
                    this.tiles[i][j] = new Wall();
                } else {
                    this.tiles[i][j] = new Path();
                }
            } else {
                this.tiles[i][j] = new Wall();
            }
        }
    }
    
    
    var startX = Math.floor(this.rows / 2);
    var startY = Math.floor(this.cols / 2);
    this.tiles[startX][startY] = new Path();
    
    var endX = 0;
    var endY = 0;
    var end = Math.floor(Math.random()*4);

    if (end == 0) {
        var rand = Math.floor(Math.random()*(this.rows-2)) + 1;
        endX = rand;
    } else if (end == 1) {
        var rand = Math.floor(Math.random()*(this.rows-2)) + 1;
        endX = rand;
        endY = this.cols-1;
    } else if (end == 2) {
        var rand = Math.floor(Math.random()*(this.cols-2)) + 1;
        endY = rand;
    } else {
        var rand = Math.floor(Math.random()*(this.cols-2)) + 1;
        endX = this.rows-1;
        endY = rand;
    }

    this.tiles[endX][endY] = new Path();
    
}

Map.prototype.draw = function(context, x, y) {
    var left = x - 12;
    var right = x + 13;
    var top = y - 10;
    var bot = y + 10;
    
    for (var i = left; i < right; i++) {
        for (var j = top; j < bot; j++) {
            if (i < 0 || j < 0 || i >= this.rows || j >= this.cols) {
                // draw nothing
            } else {
                var drawShadow = false;
                var tile = this.tiles[i][j];
                tile.draw(context, i-left, j-top, this, i, j);
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