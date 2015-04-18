var PI_2 = 2 * Math.PI;
var Star = function(y) {
    this.x = Math.random() * 800;
    
    // Don't start with big stars 
    if (y) {
        var weighted = Math.random() * 10;
        if (weighted < 9) {
            this.radius = Math.random() * 1.5;
        } else {
            this.radius = (Math.random() * 2) + 1;
        }
    } else {
        var weighted = Math.random() * 10;
        if (weighted < 7) {
            this.radius = Math.random() * 1.5;
        } else if (weighted > 9.95 && weighted <= 9.99) {
            this.radius = (Math.random() * 25) + 25;
        } else if (weighted > 9.99) {
            this.radius = (Math.random() * 250) + 75;
        } else {
            this.radius = (Math.random() * 2) + 1;
        }
    }
    
    if (this.radius < 0.5) {
        this.radius = 0.5;
    }
    
    this.y = y || -50 - this.radius*2;
    this.velocity = this.radius * 0.8;
    
    if (this.velocity > 10) {
        this.velocity = 10;
    }
    
    this.color = "#ffffff";
    this.generateRandomColor(64, 196, 64);
}

Star.prototype.move = function(index) {
    this.y += this.velocity;
    
    if (this.y >= CANVAS_HEIGHT + 50 + this.radius*2) {
        killStar(index);
    }
}

Star.prototype.draw = function(context, frame) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, PI_2);
    context.fill();
}

Star.prototype.generateRandomColor = function(mixR, mixG, mixB) {
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);
    
    red = (red + mixR) / 2;
    green = (green + mixG) / 2;
    blue = (blue + mixB) / 2;
    
    this.color = "rgb(" + red + "," + green + "," + blue + ")";
}

function killStar(index) {
    if (index >= 0 && index < stars.length) {
        stars.splice(index, 1);
    }
    var star = new Star();
    stars.push(star);
}