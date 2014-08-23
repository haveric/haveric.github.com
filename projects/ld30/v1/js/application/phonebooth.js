var PhoneBooth = function(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 64;
    
    this.sprite = "phonebooth";
    this.opening = 0;
    this.fading = 0;
    
    this.toOpen = false;
    this.toClose = false;
    this.toFadeIn = false;
    this.toFadeOut = false;
}

PhoneBooth.prototype.fadeIn = function() {
    if (this.fading === 8) {
        this.toFadeIn = true;
    }
}

PhoneBooth.prototype.fadeOut = function() {
    if (this.fading === 0) {
        this.toFadeOut = true;
    }
}

PhoneBooth.prototype.open = function() {
    if (this.opening === 0) {
        this.toOpen = true;
    }
}

PhoneBooth.prototype.close = function() {
    if (this.opening === 4) {
        this.toClose = true;
    }
}


PhoneBooth.prototype.draw = function(frame, playerX, playerY) {
    var tileX = Math.floor(playerX / 32);
    var tileY = Math.floor(playerY / 32);

    var offsetX = playerX - (tileX * 32);
    var offsetY = playerY - (tileY * 32);
    
    var left = tileX - 12;
    var right = tileX + 14;
    var top = tileY - 15;
    var bot = tileY + 6;
    
    if (this.x >= left && this.x <= right && this.y >= top && this.y <= bot) {
        var drawSprite = this.sprite;
        
        if (this.fading > 0) {
            drawSprite += "-fade" + this.fading;
        } else if (this.opening > 0) {
            drawSprite += "-open" + this.opening;
        }
        
        var animFrame = 15;
        
        if (this.toFadeIn) {
            if (this.fading > 0) {
                if (frame % animFrame == 0) {
                    this.fading --;
                }
            } else {
                this.fading = 0;
                this.toFadeIn = false;
            }
        } else if (this.toFadeOut) {
            if (this.fading < 8) {
                if (frame % animFrame == 0) {
                    this.fading ++;
                }
            } else {
                this.fading = 8;
                this.toFadeOut = false;
            }
        } else if (this.toOpen) {
            if (this.opening < 4) {
                if (frame % animFrame == 0) {
                    this.opening ++;
                }
            } else {
                this.opening = 4;
                this.toOpen = false;
            }
        } else if (this.toClose) {
            if (this.opening > 0) {
                if (frame % animFrame == 0) {
                    this.opening --;
                }
            } else {
                this.opening = 0;
                this.toClose = false;
            }
        }
        
        spriteMapper.getImage(drawSprite).drawImage(context, (this.x-left)*32 - offsetX, (this.y-top)*32 - offsetY);
    }
}