var ballArray = [];

var Ball = function(x, y) {
    this.x = x || 400;
    this.y = y || 300;
    this.radius = 10;
    this.speed = 2;
    this.angle = (Math.random()*90) - 45;
    if (this.angle < 0) {
        this.angle += 360;
    }
    this.toRemove = false;
}

Ball.prototype.move = function() {
    var radians = (Math.PI / 180) * (this.angle - 90);
    this.x += this.speed * Math.cos(radians);
    this.y += this.speed * Math.sin(radians);
}

Ball.prototype.checkCollisions = function(paddle) {
    var randomAngle = (Math.random()*10)-5;
    if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.angle = -this.angle + randomAngle;
    } else if (this.x + this.radius > CANVAS_WIDTH) {
        this.x = CANVAS_WIDTH - this.radius;
        this.angle = - this.angle + randomAngle;
    }
    if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.angle = 180 - this.angle + randomAngle;
    } else if (this.y > CANVAS_HEIGHT) {
        this.y = CANVAS_HEIGHT;
        this.angle = 180 - this.angle + randomAngle;
        //console.log("LOSE");
        //this.toRemove = true;
    }
    
    if (this.angle > 360) {
        this.angle -= 360;
    } else if (this.angle < 0) {
        this.angle += 360;
    }
    
}

Ball.prototype.draw = function(context) {
    
    context.beginPath();
    context.strokeStyle = 'rgba(255, 255, 255, 1)';
    context.fillStyle = 'rgba(50, 50, 50, 1)';
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fill();
    
    context.stroke();
}


var addBall = function(ball) {
    ballArray[ballArray.length] = ball;
}

var removeBall = function(index) {
    ballArray.splice(index,1);
}
