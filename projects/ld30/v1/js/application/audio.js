var SoundManager = function() {
    this.sounds = [];
    this.volume = 1;
}

SoundManager.prototype.add = function(name, src, vol) {
    var sound = new Sound(name, src, vol);
    this.sounds.push(sound);
}

SoundManager.prototype.play = function(audioName) {
    var self = this;
    var length = self.sounds.length;
    for (var i = 0; i < length; i++) {
        var sound = self.sounds[i];
        if (sound.name === audioName) {
            var audio = new Audio(sound.src);
            audio.volume = self.volume * sound.vol;
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

soundManager.add('jump', 'assets/jump.wav');
soundManager.add('land', 'assets/land.wav');
soundManager.add('attack', 'assets/attack.wav');