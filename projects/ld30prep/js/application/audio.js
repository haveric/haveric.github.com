var SoundMapper = function() {
    sounds = [];
}

SoundMapper.prototype.add = function(name, src) {
    var sound = new Sound(name, src);
    sounds.push(sound);
}

SoundMapper.prototype.play = function(audioName) {
    var length = sounds.length;
    for (var i = 0; i < length; i++) {
        var sound = sounds[i];
        if (sound.name === audioName) {
            var audio = new Audio(sound.src);
            audio.play();
            
            // Prevent memory leaks for audio
            audio.addEventListener("ended", function() {
                audio.src = null;
                audio.load();
            });
            break;
        }
    }
}

var Sound = function (name, src) {
    this.name = name;
    this.src = src;
}

var soundMapper = new SoundMapper();

soundMapper.add('blip', 'assets/placeholderBlip.wav');