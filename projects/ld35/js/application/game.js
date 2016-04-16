var CANVAS_WIDTH = 800,
    CANVAS_HEIGHT = 640;

(function () {
    var keysDown = [],
        keyDownListener,
        keyUpListener,
        canvas,
        context;

    var map,
        player,
        numRenders = 0,
        keyDownListener,
        keyUpListener;

    var init = function() {
        keyDownListener = addEventListener("keydown", function (e) {
            keysDown[e.keyCode] = true;
        }, false);

        keyUpListener = addEventListener("keyup", function (e) {
            delete keysDown[e.keyCode];
        }, false);

        canvas = document.getElementById("gameCanvas");
        canvas.setAttribute("width", CANVAS_WIDTH);
        canvas.setAttribute("height", CANVAS_HEIGHT);

        context = canvas.getContext('2d');

        var mapSize = 20;

        map = new Map(mapSize, mapSize);
        map.generate();
        var midPoint = Math.floor(mapSize/2);

        player = new Player(midPoint,midPoint);

        MainLoop.setUpdate(handleInput).setDraw(render).start();
    }
    var reset = function() {
        map = null;
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
        if (38 in keysDown) { // Player holding up
            player.moveUp(map);
        }
        if (40 in keysDown) { // Player holding down
            player.moveDown(map);
        }
        if (37 in keysDown) { // Player holding left
            player.moveLeft(map);
        }
        if (39 in keysDown) { // Player holding right
            player.moveRight(map);
        }
        if (81 in keysDown) { // q
            stop("menu");
        }

        keysDown = [];
    }

    var render = function(){
        context.fillStyle="#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        map.draw(context, numRenders, player.getX(), player.getY());

        player.draw(context, numRenders);



        numRenders++;
        if (numRenders == 60) {
            numRenders = 0;
        }
    }

    init();
}());