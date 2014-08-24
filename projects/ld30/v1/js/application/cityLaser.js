var CityLaser = function(x, y, tX, tY) {
    this.x = x;
    this.y = y;
    this.tX = tX + 32;
    this.tY = tY + 32;
    this.progress = 0;
}

CityLaser.prototype.draw = function(frame, index) {
    var oldLineWidth = context.lineWidth;
    
    context.beginPath();
    context.strokeStyle = "#eeeeee";
    context.lineWidth = 10;
    context.moveTo(this.x, this.y);
    
    var currentX = this.x + (this.tX - this.x) * this.progress / 100;
    var currentY = this.y + (this.tY - this.y) * this.progress / 100;
    context.lineTo(currentX, currentY);
    context.stroke();
    if (this.progress < 100) {
        
        this.progress ++;
    } else {
        killCityLaser(index);
        for (var i = 0; i < cities.length; i ++) {
            var city = cities[i];
            if (city.x === this.tX-32 && city.y === this.tY-32) {
                killCity(index);
                city.die();
                break;
            }
        }
    }
    
    context.lineWidth = oldLineWidth;
}

function killCityLaser(index) {
    if (index > 0 && index < cityLasers.length) {
        cityLasers.splice(index, 1);
    }
}