var Settings = function() {
    this.scale = "95%";
    this.numStars = 400;

    this.loadOrStore();
}

Settings.prototype.setScale = function(scale) {
    this.scale = scale;
    setStorage("scale", scale);
}

Settings.prototype.setNumStars = function(numStars) {
    if (numStars >= 0) {
        this.numStars = numStars;
        setStorage("numStars", numStars);
    }
}

Settings.prototype.loadOrStore = function() {
    try {
        if (localStorage['scale']) {
            this.scale = localStorage['scale'];
        } else {
            localStorage['scale'] = this.scale;
        }

        if (localStorage['numStars']) {
            this.numStars = localStorage['numStars'];
        } else {
            localStorage['numStars'] = this.numStars;
        }
    } catch (e) { }
}

function setStorage(name, value) {
    try {
        localStorage[name] = value;
    } catch (e) { }
}
