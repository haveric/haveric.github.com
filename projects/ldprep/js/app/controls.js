var Controls = function() {
    var self = this;

    self.keysDown = [];
    self.keysDelayed = [];
    self.defaults = new Map();
    self.defaults2 = new Map();
    self.controls = new Map();
    self.defaults.set("left", ["37", "gamepad14", "axis0-left"]);
    self.defaults.set("right", ["39", "gamepad15", "axis0-right"]);
    self.defaults.set("up", ["38", "axis1-left"]);
    self.defaults.set("down", ["40", "axis1-right"]);
/*
    self.defaults.set("shiftUp", ["65", "gamepad1"]);
    self.defaults.set("shiftDown", ["90", "gamepad0"]);
*/
    self.defaults.set("reset", ["82", "gamepad9"]);


    self.defaults2.set("left", ["65", "gamepad14", "axis0-left"]);
    self.defaults2.set("right", ["68", "gamepad15", "axis0-right"]);
    self.defaults2.set("up", ["87", "axis1-left"]);
    self.defaults2.set("down", ["83", "axis1-right"]);
/*
    self.defaults2.set("shiftUp", ["38", "gamepad1"]);
    self.defaults2.set("shiftDown", ["40", "gamepad0"]);
*/
    self.defaults2.set("reset", ["82", "gamepad9"]);


    self.resetToDefault();

    self.keyDownListener = addEventListener("keydown", function (e) {
        //console.log("Keycode: " + e.keyCode);
        self.keysDown[e.keyCode] = true;
    }, false);

    self.keyUpListener = addEventListener("keyup", function (e) {
        delete self.keysDown[e.keyCode];
        delete self.keysDelayed[e.keyCode];
    }, false);
}

Controls.prototype.resetToDefault = function() {
    var self = this;

    self.defaults.forEach(function(value, key) {
        self.controls.set(key, value);
    });
}

Controls.prototype.resetToDefault2 = function() {
    var self = this;

    self.defaults2.forEach(function(value, key) {
        self.controls.set(key, value);
    });
}


Controls.prototype.setCustomKeys = function(name, keys) {
    this.controls.set(name, keys);
}

Controls.prototype.isPressed = function(key) {
    var self = this;
    var pressed = false;

    self.controls.get(key).forEach(function(keyToTest) {
        if (keyToTest in self.keysDown) {
            pressed = true;
        }
    });

    return pressed;
}

Controls.prototype.isDelayed = function(key) {
    var self = this;
    var delayed = false;

    this.controls.get(key).forEach(function(keyToTest) {
        if (keyToTest in self.keysDelayed) {
            delayed = true;
        }
    });

    return delayed;
}

Controls.prototype.deleteKey = function(key, delay) {
    var self = this;
    self.controls.get(key).forEach(function(keyToTest) {
        delete self.keysDown[keyToTest];
        if (delay) {
            self.keysDelayed[keyToTest] = true;
        }
    });

    if (delay) {
        setTimeout(function() {
            self.controls.get(key).forEach(function(keyToTest) {
                delete self.keysDelayed[keyToTest];
            });
        }, delay);
    }
}


Controls.prototype.hasControllerSupport = function() {
    return "getGamepads" in navigator;
}

Controls.prototype.checkForGamepads = function() {
    var self = this;
    if (this.hasControllerSupport()) {
        var numGamepads = navigator.getGamepads().length;
        for (var i = 0; i < numGamepads; i++) {
            var gamepad = navigator.getGamepads()[i];
            if (gamepad) {
                gamepad.axes.forEach(function(axis, axisIndex) {
                    if (axis <= -0.5) {
                        self.keysDown["axis" + axisIndex + "-left"] = true;
                    } else if (axis >= 0.5) {
                        self.keysDown["axis" + axisIndex + "-right"] = true;
                    } else {
                        delete self.keysDown["axis" + axisIndex + "-left"];
                        delete self.keysDown["axis" + axisIndex + "-right"];
                        delete self.keysDelayed["axis" + axisIndex + "-left"];
                        delete self.keysDelayed["axis" + axisIndex + "-right"];
                    }
                });

                gamepad.buttons.forEach(function(button, buttonIndex) {
                    if (button.pressed) {
                        self.keysDown["gamepad"+ buttonIndex] = true;
                    } else {
                        delete self.keysDown["gamepad" + buttonIndex];
                        delete self.keysDelayed["gamepad" + buttonIndex];
                    }
                });
            }
        }
    }
}