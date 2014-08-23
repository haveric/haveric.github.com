var CANVAS_WIDTH = 800,
    CANVAS_HEIGHT = 640;

var map;
var canvas,
    context;
(function () {
    var keysDown = [],
        gameRunning = false,
        keyDownListener,
        keyUpListener;
    
    var player,
        requestId,
        numRenders = 0,
        keyDownListener,
        keyUpListener;
        
    var phoneBooth;
    var sky;
    
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.msRequestAnimationFrame     ||
              window.oRequestAnimationFrame      ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
    
    // TODO: Remove unnecessary calls here
    window.cancelAnimFrame = (function(){
      return  window.cancelAnimationFrame       ||
              window.webkitCancelAnimationFrame ||
              window.mozCancelAnimationFrame    ||
              window.msCancelAnimationFrame     ||
              window.oCancelAnimationFrame ||
              window.cancelRequestAnimationFrame       ||
              window.webkitCancelRequestAnimationFrame ||
              window.mozCancelRequestAnimationFrame    ||
              window.msCancelRequestAnimationFrame     ||
              window.oCancelRequestAnimationFrame;
    })();
        
    
    var animLoop = function(){
        if (gameRunning) {
            requestId = requestAnimFrame(animLoop);
            
            handleInput();
            
            render();
        }
    }
    
    
    var init = function() {
        keyDownListener = addEventListener("keydown", function (e) {
            keysDown[e.keyCode] = true;
        }, false);

        keyUpListener = addEventListener("keyup", function (e) {
            delete keysDown[e.keyCode];
            
            if (e.keyCode == 37) { // Player holding left
                player.xVelocity = 0;
            }
            if (e.keyCode == 39) { // Player holding right
                player.xVelocity = 0;
            }
        }, false);

        canvas = document.getElementById("gameCanvas");
        canvas.setAttribute("width", CANVAS_WIDTH);
        canvas.setAttribute("height", CANVAS_HEIGHT);
        
        context = canvas.getContext('2d');
        
        var mapSize = 50;

        map = new Map(mapSize, mapSize);
        map.generate();
        var midPoint = Math.floor(mapSize/2);

        player = new Player(midPoint*32, midPoint*32);
        
        sky = new Sky();
        
        phoneBooth = new PhoneBooth(20,32);

        gameRunning = true;
        if (!requestId) {
            animLoop();
        }
    }
    var reset = function() {
        map = null;
        player = null;
    }
    var stop = function(type) {
        gameRunning = false;
        removeEventListener("keydown", keyDownListener, false);
        removeEventListener("keyup", keyUpListener, false);
        keyDownListener = undefined;
        keyUpListener = undefined;
    }
    
    var handleInput = function() {
        if (38 in keysDown) { // Player holding up
            player.jump();
        }
        
        if (40 in keysDown) { // Player holding down
            /*
            if (phoneBooth.fading == 8) {
                phoneBooth.fadeIn();
            } else {
                phoneBooth.fadeOut();
            }
            */
            
            if (phoneBooth.opening == 0) {
                phoneBooth.open();
            } else {
                phoneBooth.close();
            }
        }
        
        if (37 in keysDown) { // Player holding left
            player.moveLeft();
        }
        if (39 in keysDown) { // Player holding right
            player.moveRight();
        }
        if (81 in keysDown) { // q
            stop("menu");
        }
        
        //keysDown = [];
    }
    
    var render = function(){
        //context.fillStyle="#000000";
        //context.fillRect(0, 0, canvas.width, canvas.height);

        sky.draw(numRenders);
        map.draw(numRenders, player.getX(), player.getY());
        
        phoneBooth.draw(numRenders, player.getX(), player.getY());
        
        player.draw(numRenders);
        

        
        numRenders++;
        if (numRenders == 60) {
            numRenders = 0;
        }
    }
    
    init();
}());