var Unit = function (x, y, sex) {
    this.x = x;
    this.y = y;
    this.boots = 'none';
    this.chest = 'none';
    this.pants = 'none';
    this.helm = 'none';
    this.face = 'none'
    this.weapon = 'none';
    this.action = 'standing';
    this.sex = sex;
    this.direction = 0;
}

Unit.prototype.draw = function(xLeft, xRight, yLeft, yRight, offX, offY) {
    if (this.x >= xLeft && this.x <= xRight && this.y >= yLeft && this.y <= yRight) {
        bufferCtx.clearRect(0,0,bufferCtx.width, bufferCtx.height);
        var drawX = this.x-xLeft-offX;
        var drawY = this.y-yLeft-offY;
        
        if (this.sex == 'm') {
            spriteMapper.getImage('mFront').drawImage(drawX, drawY);
        } else if (this.sex == 'f') {
            spriteMapper.getImage('fFront').drawImage(drawX, drawY);
        }
        
        if (this.pants == 'mPants') {
            var buffer2 = document.createElement('canvas');
            buffer2.width = 64;
            buffer2.height = 64;

            var buffer2Ctx = buffer2.getContext('2d');
            
            spriteMapper.getImage('mPantsFront').drawImage(drawX, drawY, buffer2Ctx);
            
            buffer2Ctx.globalCompositeOperation = 'source-atop';
            
            buffer2Ctx.fillStyle = 'rgba(0, 80, 0, .7)';
            buffer2Ctx.fillRect(0, 0, 64, 64);
            
            buffer2Ctx.globalCompositeOperation = 'source-over';
            bufferCtx.drawImage(buffer2, drawX, drawY);
            
        }
        
        if (this.chest != 'none') {
            var buffer2 = document.createElement('canvas');
            buffer2.width = 64;
            buffer2.height = 64;

            var buffer2Ctx = buffer2.getContext('2d');
            
            if (this.chest == 'mShirt') {
                spriteMapper.getImage('mShirtFront').drawImage(drawX, drawY, buffer2Ctx);
            } else if (this.chest == 'fRobe') {
                spriteMapper.getImage('fRobeFront').drawImage(drawX, drawY, buffer2Ctx);
            }
            
            buffer2Ctx.globalCompositeOperation = 'source-atop';
            
            buffer2Ctx.fillStyle = 'rgba(0, 128, 128, .5)';
            buffer2Ctx.fillRect(0, 0, 64, 64);
            
            buffer2Ctx.globalCompositeOperation = 'source-over';
            bufferCtx.drawImage(buffer2, drawX, drawY);
        }
        if (this.face == 'mEyepatch') {
            spriteMapper.getImage('mEyepatchFront').drawImage(drawX, drawY);
        }
        
        if (this.helm == 'mRedBandana') {
            spriteMapper.getImage('mRedBandanaFront').drawImage(drawX, drawY)
        }
        if (this.weapon == 'mSword') {
            spriteMapper.getImage('mSwordFront').drawImage(drawX, drawY);
        }

    }
}

var Soldier = function(x, y, sex) {
    Unit.call(this, x, y, sex);
    this.pants = 'mPants';

    this.chest = 'mShirt';
    
}

Soldier.prototype = new Unit();
Soldier.prototype.constructor = Soldier;

var Pirate = function(x, y, sex) {
    Unit.call(this, x, y, sex);
    this.chest = 'fRobe';
    this.face = 'mEyepatch';
    this.helm = 'mRedBandana';
    this.weapon = 'mSword';
}

Pirate.prototype = new Unit();
Pirate.prototype.constructor = Pirate;

textureMapper.addTexture('mBase','img/maleAnimation.png');
textureMapper.addTexture('fBase','img/female_walkcycle.png');
textureMapper.addTexture('mPants','img/LEGS_pants.png');
textureMapper.addTexture('mRedBandana','img/red_bandana_in_walking_animation.png');
textureMapper.addTexture('mEyepatch','img/eyepatch_in_walking_animation.png');
textureMapper.addTexture('mSword','img/sword_in_walking_animation.png');
textureMapper.addTexture('mShirt','img/shirt_grayscale.png');
textureMapper.addTexture('fRobe','img/female_mage_whiterobe.png');

spriteMapper.addImage('mFront','mBase', 0, 128, 64, 64);
spriteMapper.addImage('fFront','fBase', 0, 128, 64, 64);
spriteMapper.addImage('mPantsFront','mPants', 0, 128, 64, 64);
spriteMapper.addImage('mRedBandanaFront','mRedBandana', 0, 128, 64, 64);
spriteMapper.addImage('mEyepatchFront','mEyepatch', 0, 128, 64, 64);
spriteMapper.addImage('mSwordFront','mSword', 0, 128, 64, 64);
spriteMapper.addImage('mShirtFront','mShirt', 0, 128, 64, 64);
spriteMapper.addImage('fRobeFront','fRobe', 0, 128, 64, 64);