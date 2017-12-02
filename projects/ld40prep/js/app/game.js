(function () {
    var player,
        controls = new Controls(),
        gameState = new GameState(),
        canvasState = new CanvasState(),
        numRenders = 0,
        FPS = 60;

    var map;

    var init = function(type) {
        canvasState.init();
        gameState.init(type);

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

        if (controls.testPressed("up")) {
            player.moveUp(map);
        } else if (controls.testPressed("down")) {
            player.moveDown(map);
        }

        if (controls.testPressed("left")) {
            player.moveLeft(map);
        } else if (controls.testPressed("right")) {
            player.moveRight(map);
        }
    }

    var handleMovement = function(delta) {
        // TODO: Move stuff

    }

    var render = function() {
        if (spriteMapper.preloadSprites()) {

            // TODO: Draw Stuff
            canvasState.clear();

            map.draw(canvasState.context, numRenders, player.getX(), player.getY());

            player.draw(canvasState.context, numRenders);

            numRenders++;
            if (numRenders == FPS) {
                numRenders = 0;
            }
        }
    }

    init("demo");
}());