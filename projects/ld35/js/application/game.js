var CANVAS_WIDTH = 800,
    CANVAS_HEIGHT = 640;

(function () {
    var keysDown = [],
        keyDownListener,
        keyUpListener,
        canvas,
        context;

    var player,
        track,
        enemies,
        maxGear = 5;
        numRenders = 0,
        keyDownListener,
        keyUpListener;

    var init = function() {
        keyDownListener = addEventListener("keydown", function (e) {
            //console.log("Keycode: " + e.keyCode);
            keysDown[e.keyCode] = true;
        }, false);

        keyUpListener = addEventListener("keyup", function (e) {
            delete keysDown[e.keyCode];
        }, false);

        canvas = document.getElementById("gameCanvas");
        canvas.setAttribute("width", CANVAS_WIDTH);
        canvas.setAttribute("height", CANVAS_HEIGHT);

        context = canvas.getContext('2d');
        track = new Track(150,0);
        player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 200, maxGear);
        enemies = new Enemies(15, maxGear);

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
    }

    var handleInput = function() {
        if (65 in keysDown) { //A
            player.shiftUp();
            delete keysDown["65"];
        } else if (90 in keysDown) { //Z
            player.shiftDown();
            delete keysDown["90"];
        }

        if (38 in keysDown) { // Player holding up
            player.moveUp();
        } else if (40 in keysDown) { // Player holding down
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

        if (37 in keysDown) { // Player holding left
            player.moveLeft();
            delete keysDown["37"];
        } else if (39 in keysDown) { // Player holding right
            player.moveRight();
            delete keysDown["39"];
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
        console.log("Death: " + death);
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

        numRenders++;
        if (numRenders == 60) {
            numRenders = 0;
        }
    }

    init();
}());