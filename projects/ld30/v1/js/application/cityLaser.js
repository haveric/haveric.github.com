var CityLaser = function(x, y, tX, tY) {
    this.x = x;
    this.y = y;
    this.tX = tX + 32;
    this.tY = tY + 32;
    this.progress = 0;
    this.audio = soundManager.play('city-laser');
}

CityLaser.prototype.draw = function(frame, index) {
    if (this.progress < 100) {
        var oldLineWidth = context.lineWidth;
        
        context.beginPath();
        context.strokeStyle = "#eeeeee";
        context.lineWidth = 10;
        context.moveTo(this.x, this.y);
        
        var currentX = this.x + (this.tX - this.x) * this.progress / 100;
        var currentY = this.y + (this.tY - this.y) * this.progress / 100;
        context.lineTo(currentX, currentY);
        context.stroke();
        context.lineWidth = oldLineWidth;
        this.progress ++;
    } else {
        for (var i = 0; i < cities.length; i ++) {
            var city = cities[i];
            var cityX = Math.abs(city.x + 32 - this.tX);
            var cityY = Math.abs(city.y + 32 - this.tY);

            if (cityX < 5 && cityY < 5) {
                killCityLaser(index);
                soundManager.play('explode');
                killCity(i);
                city.die();
                break;
            }
        }
    }
    if (this.progress == 101) {
        killCityLaser(index);
    }
    
    if (this.progress == 100) {
        this.progress ++;
    }
}

function killCityLaser(index) {
    if (index >= 0 && index < cityLasers.length) {
        var laser = cityLasers[index];
        laser.audio.src = "";
        cityLasers.splice(index, 1);
    }
}