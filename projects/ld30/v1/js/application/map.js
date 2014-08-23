var Map = function(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    
    this.tiles = create2dArray(rows);
    this.endX;
    this.endY;
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
            
            var rand = Math.floor(Math.random()*10);
            if (rand == 0 || i == 0 || j == 0 || i == this.rows-1 || j == this.cols-1) {
                this.tiles[i][j] = new Solid();
            } else {
                this.tiles[i][j] = new Path();
            }
        }
    }
    
    var startX = Math.floor(this.rows / 2);
    var startY = Math.floor(this.cols / 2);
}

Map.prototype.draw = function(context, frame, playerX, playerY) {
    var tileX = Math.floor(playerX / 32);
    var tileY = Math.floor(playerY / 32);

    var offsetX = playerX - (tileX * 32);
    var offsetY = playerY - (tileY * 32);
    
    var left = tileX - 12;
    var right = tileX + 14;
    var top = tileY - 10;
    var bot = tileY + 11;

    for (var i = left; i < right; i++) {
        for (var j = top; j < bot; j++) {
            if (i < 0 || j < 0 || i >= this.rows || j >= this.cols) {
                // draw nothing
            } else {
                var tile = this.tiles[i][j];
                tile.draw(context, frame, i-left, j-top, offsetX, offsetY);
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