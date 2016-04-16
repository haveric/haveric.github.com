var CANVAS_WIDTH = 800,
    CANVAS_HEIGHT = 640;

(function () {
    var keysDown = [],
        keysDelayed = [],
        keyDownListener,
        keyUpListener,
        canvas,
        context;

    var player,
        track,
        enemies,
        maxGear = 5,
        numRenders = 0,
        keyDownListener,
        keyUpListener;

    //var audioBG;

    var init = function() {
        keyDownListener = addEventListener("keydown", function (e) {
            //console.log("Keycode: " + e.keyCode);
            keysDown[e.keyCode] = true;
        }, false);

        keyUpListener = addEventListener("keyup", function (e) {
            delete keysDown[e.keyCode];
            delete keysDelayed[e.keyCode];
        }, false);

        canvas = document.getElementById("gameCanvas");
        canvas.setAttribute("width", CANVAS_WIDTH);
        canvas.setAttribute("height", CANVAS_HEIGHT);

        context = canvas.getContext('2d');
        track = new Track(150,0);
        player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 200, maxGear);
        enemies = new Enemies(15, maxGear);

        //audioBG = soundManager.play("bg",0.5, true);

        MainLoop.setUpdate(handleInput).setDraw(render).start();
    }
    var reset = function() {
        player = null;
    }
    var stop = function(type) {
        MainLoop.stop();
        removeEventListener("keydown", keyDownListener, false);
        removeEventListener("keyup", keyUpListener, false);
        keyDownListener = undefined;
        keyUpListener = undefined;
        //audioBG.pause();
    }

    var hasControllerSupport = function() {
        return "getGamepads" in navigator;
    }

    var checkForGamepads = function() {
        if (hasControllerSupport()) {
            var numGamepads = navigator.getGamepads().length;
            for (var i = 0; i < numGamepads; i++) {
                var gamepad = navigator.getGamepads()[i];
                if (gamepad) {
                    gamepad.axes.forEach(function(axis, axisIndex) {

                        if (axis <= -0.5) {
                            keysDown["axis" + axisIndex + "-left"] = true;
                        } else if (axis >= 0.5) {
                            keysDown["axis" + axisIndex + "-right"] = true;
                        } else {
                            delete keysDown["axis" + axisIndex + "-left"];
                            delete keysDown["axis" + axisIndex + "-right"];
                            delete keysDelayed["axis" + axisIndex + "-left"];
                            delete keysDelayed["axis" + axisIndex + "-right"];
                        }
                    });

                    gamepad.buttons.forEach(function(button, buttonIndex) {
                        if (button.pressed) {
                            keysDown["gamepad"+ buttonIndex] = true;
                        } else {
                            delete keysDown["gamepad" + buttonIndex];
                            delete keysDelayed["gamepad" + buttonIndex];
                        }
                    });
                }
            }
        }
    }

    var handleInput = function() {
        checkForGamepads();

        if (65 in keysDown || "gamepad1" in keysDown) { //A
            if (!("65" in keysDelayed) && !("gamepad1" in keysDelayed)) {
                player.shiftUp();
                delete keysDown["65"];
                delete keysDown["gamepad1"];
                keysDelayed["65"] = true;
                keysDelayed["gamepad1"] = true;
                setTimeout(function() {
                    delete keysDelayed["65"];
                    delete keysDelayed["gamepad1"];
                },100);
            }
        } else if (90 in keysDown || "gamepad0" in keysDown) { //Z
            if (!("90" in keysDelayed) && !("gamepad0" in keysDelayed)) {
                player.shiftDown();
                delete keysDown["90"];
                delete keysDown["gamepad0"];
                keysDelayed["90"] = true;
                keysDelayed["gamepad0"] = true;
                setTimeout(function() {
                    delete keysDelayed["90"];
                    delete keysDelayed["gamepad0"];
                },100);
            }
        }

        if (38 in keysDown || "axis1-left" in keysDown) { // Player holding up
            player.moveUp();
        } else if (40 in keysDown || "axis1-right" in keysDown) { // Player holding down
            player.moveDown();
        } else {
            if (player.velocity != 0) {
                if (Math.abs(player.velocity) - .5 > 0) {
                    player.velocity *= .95;
                } else {
                    player.velocity *= .75;
                }


                if (player.velocity <= .01 && player.velocity >= -.01) {
                    player.velocity = 0;
                }
            }
        }

        if (37 in keysDown || "gamepad14" in keysDown || "axis0-left" in keysDown) { // Player holding left
            if (!("37" in keysDelayed) && !("gamepad14" in keysDelayed) && !("axis0-left" in keysDelayed)) {
                player.moveLeft();

                delete keysDown["37"];
                delete keysDown["gamepad14"];
                delete keysDown["axis0-left"];
                keysDelayed["37"] = true;
                keysDelayed["gamepad14"] = true;
                keysDelayed["axis0-left"] = true;
                setTimeout(function() {
                    delete keysDelayed["37"];
                    delete keysDelayed["gamepad14"];
                    delete keysDelayed["axis0-left"];
                },100);
            }
        } else if (39 in keysDown || "gamepad15" in keysDown || "axis0-right" in keysDown) { // Player holding right
            if (!("39" in keysDelayed) && !("gamepad15" in keysDelayed) && !("axis0-right" in keysDelayed)) {
                player.moveRight();
                delete keysDown["39"];
                delete keysDown["gamepad15"];
                delete keysDown["axis0-right"];
                keysDelayed["39"] = true;
                keysDelayed["gamepad15"] = true;
                keysDelayed["axis0-right"] = true;
                setTimeout(function() {
                    delete keysDelayed["39"];
                    delete keysDelayed["gamepad15"];
                    delete keysDelayed["axis0-right"];
                },100);
            }
        }

        if (81 in keysDown) { // q
            stop("menu");
        }
    }

    var render = function(){
        context.fillStyle="#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var spawnsPerSecond = 4;
        if (numRenders % (60 / spawnsPerSecond) == 0) {
            enemies.spawn();
        }

        enemies.move();
        player.move();

        var death = enemies.checkForCollision(player);
        //console.log("Death: " + death);
        if (death) {
            stop();
        }


        track.draw(context, numRenders);
        enemies.draw(context, numRenders);
        player.draw(context, numRenders);

        context.fillStyle="#ffffff";
        context.font = '18px "Lucida Console", Monaco, monospace';
        context.fillText("Gear: " + player.gear, 20, CANVAS_HEIGHT - 50);
        context.fillText("Speed: " + Math.abs(Math.round(player.velocity * 12)), 20, CANVAS_HEIGHT - 25);
        context.fillText(player.collected.get(3), 20, 40);
        context.fillText(player.collected.get(4), 20, 60);
        context.fillText(player.collected.get(5), 20, 80);
        context.fillText(player.collected.get(6), 20, 100);
        context.fillText(player.collected.get(7), 20, 120);
        context.fillText(player.collected.get(8), 20, 140);

        numRenders++;
        if (numRenders == 60) {
            numRenders = 0;
        }
    }

    init();
}());