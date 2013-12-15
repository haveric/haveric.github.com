var ladders = [];

var Ladder = function(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
}

Ladder.prototype.draw = function(context, i, j) {
    var left = i - 12;
    var right = i + 13;
    var top = j - 10;
    var bot = j + 10;
    
    if (this.x >= left && this.x <= right && this.y >= top && this.y <= bot) {
        spriteMapper.getImage("ladder-" + this.direction).drawImage(context, (this.x-left)*32, (this.y-top)*32);
    }
}