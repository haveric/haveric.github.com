var Points = function() {
    this.points = [];

    this.scoreX = 50;
    this.scoreY = CANVAS_HEIGHT - 25;
}

Points.prototype.getTotal = function() {
    return this.points.length;
}
Points.prototype.spawn = function(x, y, score) {
    var point = new Point(x, y, score);
    this.points[this.points.length] = point;
}

Points.prototype.move = function(delta, player) {
    var self = this;

    var normalDelta = 1000 / 60;
    var timeDelta = delta / normalDelta;

    var realIndex = 0;
    self.points.forEach(function(point, index) {
        point.move(timeDelta, player, self.scoreX, self.scoreY);

        if (Math.abs(point.x - self.scoreX) < 10 && Math.abs(point.y - self.scoreY) < 10) {
            player.score += point.score;
            self.points.splice(realIndex, 1);
            realIndex --;
        }

        realIndex ++;
    });
}

Points.prototype.draw = function(context, frame) {
    this.points.forEach(function(point) {
        point.draw(context, frame);
    });
}

var Point = function(x, y, score) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.velocity = (Math.random() * 3) + 3;
}

Point.prototype.move = function(delta, player, scoreX, scoreY) {
    var diffX = Math.abs(this.x - scoreX);
    var diffY = Math.abs(this.y - scoreY);
    var percentX = diffX / (diffX + diffY);
    var percentY = 1 - percentX;

    if (this.x > scoreX) {
        this.x -= percentX * this.velocity;
    } else {
        this.x += percentX * this.velocity;
    }

    if (this.y < scoreY) {
        this.y += percentY * this.velocity;
    } else {
        this.y -= percentY * this.velocity;
    }
}

Point.prototype.draw = function(context, frame) {
    context.fillStyle="#00cc00";
    context.font = '18px "Lucida Console", Monaco, monospace';
    context.fillText(this.score, this.x, this.y);
}

