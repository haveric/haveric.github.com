var TWO_PI = Math.PI * 2;

var Star = function(y) {
    this.x = Math.random() * 800;

    this.radius = (Math.random() * 250) + 75;

    // Don't start with big stars
    if (y) {
        var weighted = Math.random() * 10;
        if (weighted < 9) {
            this.radius = Math.random() * 1.5;
        } else {
            this.radius = (Math.random() * 1.75) + .25;
        }
    } else {
        var weighted = Math.random() * 10;
        if (weighted < 8) {
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

    if (this.velocity > 5) {
        this.velocity = 5;
    }

    this.color = {
        red: 255,
        green: 255,
        blue: 255
    }
    this.generateRandomColor(64, 196, 64);
    this.rgbColor = "rgb(" + this.color.red + "," + this.color.green + "," + this.color.blue + ")";

    if (this.radius >= 10) {
        var blendRed = Math.floor((this.color.red + 220) / 2);
        var blendGreen = Math.floor((this.color.green + 220) / 2);
        var blendBlue = Math.floor((this.color.blue + 220) / 2);

        this.blendColor = "rgb(" + blendRed + "," + blendGreen + "," + blendBlue + ")";
    }

    this.killY = CANVAS_HEIGHT + 50 + this.radius*2;
}

Star.prototype.move = function(index) {
    this.y += this.velocity;

    if (this.y >= this.killY) {
        killStar(index);
    }
}

Star.prototype.draw = function(context, frame) {
    context.beginPath();

    if (this.radius < 10) {
        context.fillStyle = this.rgbColor;
        context.arc(this.x, this.y, this.radius, 0, TWO_PI);
    } else {
        var gradient = context.createRadialGradient(this.x - this.radius*.3, this.y - this.radius*.3, this.radius*.2, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.blendColor);
        gradient.addColorStop(1, this.rgbColor);

        context.translate(this.x, this.y);
        context.fillStyle = gradient;
        context.arc(0, 0, this.radius, 0, TWO_PI);
        context.translate(-this.x, -this.y);
    }

    context.fill();
}

Star.prototype.generateRandomColor = function(mixR, mixG, mixB) {
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);

    red = Math.floor((red + mixR) / 2);
    green = Math.floor((green + mixG) / 2);
    blue = Math.floor((blue + mixB) / 2);

    this.color = {
        red: red,
        green: green,
        blue: blue
    }
}

function killStar(index) {
    if (index >= 0 && index < stars.length) {
        stars.splice(index, 1);
    }
    var star = new Star();
    stars.push(star);
}
