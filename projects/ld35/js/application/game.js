var CANVAS_WIDTH = 800,
    CANVAS_HEIGHT = 640;


(function () {
    var canvas,
        context;

    var player,
        controls = new Controls(),
        track,
        enemies,
        minGear = 3,
        maxGear = 3,
        enemyMaxGear = 4;
        numRenders = 0,
        spritesRendered = false;

    //var audioBG;

    var init = function() {
        canvas = document.getElementById("gameCanvas");
        canvas.setAttribute("width", CANVAS_WIDTH);
        canvas.setAttribute("height", CANVAS_HEIGHT);

        context = canvas.getContext('2d');
        track = new Track(5);
        player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 200, minGear, maxGear, track.numLanes);
        /*
        // Test data
        player.setNeededToShift(3, 1);
        player.setNeededToShift(4, 1);
        player.setNeededToShift(5, 1);
        player.setNeededToShift(6, 1);
        player.setNeededToShift(7, 1);
        */

        player.setNeededToShift(3, 10);
        player.setNeededToShift(4, 15);
        player.setNeededToShift(5, 20);
        player.setNeededToShift(6, 25);
        player.setNeededToShift(7, 30);
        
        enemies = new Enemies(15, enemyMaxGear);

        //audioBG = soundManager.play("bg",0.5, true);

        MainLoop.setUpdate(handleUpdate).setDraw(render).setEnd().start();
    }

    var stop = function(type) {
        MainLoop.stop();
        //audioBG.pause();
    }

    var handleUpdate = function(delta) {
        handleInput();
        handleMovement(delta);
    }
    var handleInput = function() {
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

        if (!player.isDying) {
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
    }

    var prerenderSprites = function() {
        var numSprites = spriteMapper.getSprites().length;
        var numLoaded = 0;

        spriteMapper.getSprites().forEach(function(sprite) {
            if (sprite.texture != null) {
                numLoaded ++;
            } else {
                sprite.drawImage(context, 0, 0);
            }
        });

        if (numLoaded == numSprites) {
            spritesRendered = true;
        }
    }

    var handleMovement = function(delta) {
        var spawnsPerSecond = 4;
        if (numRenders % (60 / spawnsPerSecond) == 0) {
            enemies.spawn(track.numLanes);
        }

        enemies.move(delta, player);
        player.move(delta);

        if (player.isDying) {
            if (player.gear < 8 && player.frame == 6) {
                stop();
            } else if (player.gear == 8 && player.frame > 6 && !player.hasBlackHoleStarted) {
                player.hasBlackHoleStarted = true;
                player.velocity = 0;
            }
        } else if (!player.isDying) {
            var death = enemies.checkForCollision(player);
            if (death) {
                player.x -= 8;
                player.y -= 8;
                player.frame = 0;
                player.isDying = true;
            }
        }
    }

    var render = function(){
        if (!spritesRendered) {
            prerenderSprites();

        }
        context.fillStyle="#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        track.draw(context, numRenders);
        enemies.draw(context, numRenders);
        player.draw(context, numRenders);

        context.fillStyle="#ffffff";
        context.font = '18px "Lucida Console", Monaco, monospace';
        context.fillText("Gear: " + player.gear, 20, CANVAS_HEIGHT - 50);
        context.fillText("Speed: " + Math.abs(Math.round(player.velocity * 12)), 20, CANVAS_HEIGHT - 25);

        var gearsX = 5;
        var gearsY = 40;
        var space = 60;
        spriteMapper.getImage("player-gear3-0").drawImage(context, gearsX, gearsY);
        if (player.neededToShift.get(3) <= 0) {
            spriteMapper.getImage("player-gear4-0").drawImage(context, gearsX, gearsY + space);
        }
        if (player.neededToShift.get(4) <= 0) {
            spriteMapper.getImage("player-gear5-0").drawImage(context, gearsX, gearsY + space * 2);
        }
        if (player.neededToShift.get(5) <= 0) {
            spriteMapper.getImage("player-gear6-0").drawImage(context, gearsX, gearsY + space * 3);
        }
        if (player.neededToShift.get(6) <= 0) {
            spriteMapper.getImage("player-gear7-0").drawImage(context, gearsX, gearsY + space * 4);
        }
        if (player.neededToShift.get(7) <= 0) {
            spriteMapper.getImage("player-gear8-0").drawImage(context, gearsX, gearsY + space * 5);
        }

        var textX = gearsX + 55;
        var textY = gearsY + 30;
        if (player.neededToShift.get(3) > 0) {
            context.fillText(player.neededToShift.get(3), textX, textY);
        }
        if (player.neededToShift.get(3) <= 0 && player.neededToShift.get(4) > 0) {
            context.fillText(player.neededToShift.get(4), textX, textY + space);
        }
        if (player.neededToShift.get(4) <= 0 && player.neededToShift.get(5) > 0) {
            context.fillText(player.neededToShift.get(5), textX, textY + space * 2);
        }
        if (player.neededToShift.get(5) <= 0 && player.neededToShift.get(6) > 0) {
            context.fillText(player.neededToShift.get(6), textX, textY + space * 3);
        }
        if (player.neededToShift.get(6) <= 0 && player.neededToShift.get(7) > 0) {
            context.fillText(player.neededToShift.get(7), textX, textY + space * 4);
        }

        numRenders++;
        if (numRenders == 60) {
            numRenders = 0;
        }
    }

    init();
}());