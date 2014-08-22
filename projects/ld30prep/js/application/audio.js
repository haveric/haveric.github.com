var SoundMapper = function() {
    sounds = [];
    isPlaying = [];
}

SoundMapper.prototype.add = function(name, src) {
    var audio = new Audio(src);
    var sound = new Sound(name, audio);
    sounds.push(sound);
}

SoundMapper.prototype.play = function(audioName) {
    var length = sounds.length;
    for (var i = 0; i < length; i++) {
        var sound = sounds[i];
        if (sound.name === audioName) {
            var audio = sound.audio;
            audio.currentTime = 0; // Reset the audio
            audio.play();
            break;
        }
    }
}

var Sound = function (name, audio) {
    this.name = name;
    this.audio = audio;
}

var soundMapper = new SoundMapper();

soundMapper.add('blip', 'assets/placeholderBlip.wav');