var SoundManager = function() {
    this.sounds = [];
    this.volume = 1;
}

SoundManager.prototype.add = function(name, src) {
    var sound = new Sound(name, src);
    this.sounds.push(sound);
}

SoundManager.prototype.play = function(audioName) {
    var self = this;
    var length = self.sounds.length;
    for (var i = 0; i < length; i++) {
        var sound = self.sounds[i];
        if (sound.name === audioName) {
            var audio = new Audio(sound.src);
            audio.volume = self.volume;
            audio.play();
            
            // Prevent memory leaks for audio
            audio.addEventListener("ended", function() {
                audio.src = null;
                audio.load();
            });
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

var Sound = function (name, src) {
    this.name = name;
    this.src = src;
}

var soundManager = new SoundManager();

soundManager.add('blip', 'assets/placeholderBlip.wav');