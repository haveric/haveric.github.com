var SoundManager = function() {
    this.sounds = [];
    this.volume = 1;
}

SoundManager.prototype.add = function(name, src, vol) {
    var sound = new Sound(name, src, vol);
    this.sounds.push(sound);
}

SoundManager.prototype.play = function(audioName, playVolume) {
    var self = this;
    
    if (!playVolume) {
        playVolume = 1;
    }

    var length = self.sounds.length;
    for (var i = 0; i < length; i++) {
        var sound = self.sounds[i];
        if (sound.name === audioName) {
            var audio = new Audio(sound.src);
            var actualVolume = self.volume * sound.vol * playVolume;
            if (actualVolume > 1) {
                actualVolume = 1;
            } else if (actualVolume < 0) {
                actualVolume = 0;
            }
            
            audio.volume = actualVolume;
            audio.play();
            
            return;
        }
    }
    
    console.error("Audio not found: " + audioName);
}

SoundManager.prototype.setVolume = function(newVolume) {
    if (newVolume >= 0 && newVolume <= 1) {
        this.volume = newVolume;
    }
}

SoundManager.prototype.getVolume = function() {
    return volume;
}

var Sound = function (name, src, vol) {
    this.name = name;
    this.src = src;
    this.vol = vol || 1;
}

var soundManager = new SoundManager();

soundManager.add('laser', 'assets/laser.wav', 0.4);
soundManager.add('land', 'assets/land.wav');
soundManager.add('attack', 'assets/attack.wav');