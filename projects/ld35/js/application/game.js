var CANVAS_WIDTH = 800,
    CANVAS_HEIGHT = 640;


(function () {
    var canvas,
        context;

    var player,
        controls = new Controls(),
        track,
        enemies,
        maxGear = 5,
        numRenders = 0;

    //var audioBG;

    var init = function() {
        canvas = document.getElementById("gameCanvas");
        canvas.setAttribute("width", CANVAS_WIDTH);
        canvas.setAttribute("height", CANVAS_HEIGHT);

        context = canvas.getContext('2d');
        track = new Track(150,0);
        player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 200, maxGear);
        enemies = new Enemies(15, maxGear);

        //audioBG = soundManager.play("bg",0.5, true);

        MainLoop.setUpdate(function() {
            handleMenuInput();
            handleInput();
        }).setDraw(render).setEnd(handleMenuInput()).start();
    }

    var stop = function(type) {
        MainLoop.stop();
        //audioBG.pause();
    }

    var handleMenuInput = function() {
        controls.checkForGamepads();

        if (controls.isPressed("stop")) { // p
            if (!controls.isDelayed("stop")) {
                controls.deleteKey("stop", 250);

                stop("menu");
            }
        }

        if (controls.isPressed("reset")) { // r
            if (!controls.isDelayed("reset")) {
                controls.deleteKey("reset", 250);
                init();
            }
        }
    }

    var handleInput = function() {
        if (controls.isPressed("shiftUp")) { //A
            if (!controls.isDelayed("shiftUp")) {
                player.shiftUp();
                controls.deleteKey("shiftUp", 100);
            }
        } else if (controls.isPressed("shiftDown")) { //Z
            if (!controls.isDelayed("shiftDown")) {
                player.shiftDown();
                controls.deleteKey("shiftDown", 100);
            }
        }

        if (controls.isPressed("up")) { // Player holding up
            player.moveUp();
        } else if (controls.isPressed("down")) { // Player holding down
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

        if (controls.isPressed("left")) { // Player holding left
            if (!controls.isDelayed("left")) {
                player.moveLeft();

                controls.deleteKey("left", 100);
            }
        } else if (controls.isPressed("right")) { // Player holding right
            if (!controls.isDelayed("right")) {
                player.moveRight();

                controls.deleteKey("right", 100);
            }
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