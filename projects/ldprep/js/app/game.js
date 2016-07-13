var CANVAS_WIDTH = 800,
    CANVAS_HEIGHT = 600;

(function () {
    var canvas,
        context;

    var player,
        controls = new Controls(),
        numRenders = 0,
        spritesRendered = false,
        currentGameType = "none",
        gameHasEnded = false;

    var map;

    var init = function(type) {
        currentGameType = type;
        gameHasEnded = false;

        canvas = document.getElementById("gameCanvas");
        canvas.setAttribute("width", CANVAS_WIDTH);
        canvas.setAttribute("height", CANVAS_HEIGHT);

        context = canvas.getContext('2d');

        var mapSize = 20;

        map = new MapTiled(mapSize, mapSize);
        map.generate();
        var midPoint = Math.floor(mapSize/2);

        player = new PlayerTiled(midPoint, midPoint);


        MainLoop.setUpdate(handleUpdate).setDraw(render).setEnd().start();
    }

    var handleUpdate = function(delta) {
        handleInput();
        handleMovement(delta);
    }
    var handleInput = function() {
        controls.checkForGamepads();

        if (controls.testPressed("up", 100)) {
            player.moveUp(map);
        } else if (controls.testPressed("down", 100)) {
            player.moveDown(map);
        }

        if (controls.testPressed("left", 100)) {
            player.moveLeft(map);
        } else if (controls.testPressed("right", 100)) {
            player.moveRight(map);
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
        // TODO: Move stuff

    }

    var render = function(){
        if (!spritesRendered) {
            prerenderSprites();
        }

        // TODO: Draw Stuff
        context.fillStyle="#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        map.draw(context, numRenders, player.getX(), player.getY());

        player.draw(context, numRenders);

        numRenders++;
        if (numRenders == 60) {
            numRenders = 0;
        }
    }

    var endGame = function(type) {
        if (!gameHasEnded) {
            // TODO: End game
            gameHasEnded = true;
        }
    }

    init("demo");
}());