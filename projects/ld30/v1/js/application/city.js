var City = function(x,y) {
    this.x = x;
    this.y = y;
    
    this.death = 0;
    this.dying = false;
    this.sprite = 'city';
}

City.prototype.die = function() {
    if (!this.dying) {
        this.dying = true;
    }
}


City.prototype.draw = function(frame) {
    var newSprite = this.sprite + "-death" + this.death;
    if (this.dying) {
        if (this.death < 7) {
            
            this.death ++;
        } else {
            this.dying = false;
        }
    }
    
    spriteMapper.getImage(newSprite).drawImage(this.x, this.y);
}

function killCity(index) {
    if (index >= 0 && index < cities.length) {
        var killedCity = cities.splice(index, 1);

        deadCities.push(killedCity[0]);
    }
}