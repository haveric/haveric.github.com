var SoundMapper = function() {
    sounds = [];
}

SoundMapper.prototype.add = function(name, src) {
    var sound = new Sound(name, new Audio(src));
    sounds.push(sound);
}

SoundMapper.prototype.play = function(audioName) {
    var length = sounds.length;
    for (var i = 0; i < length; i++) {
        if (sounds[i].name === audioName) {
            sounds[i].audio.play();
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