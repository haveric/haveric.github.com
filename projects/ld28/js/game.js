var CANVAS_WIDTH = 800,
    CANVAS_HEIGHT = 640;

(function () {
    var keysDown = [],
        gameRunning = false,
        keyDownListener,
        keyUpListener,
        canvas,
        context;
    
    var map,
        player,
        numRenders = 0,
        enemies = [];
    
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
        
    
    var animLoop = function(){
        if (gameRunning) {
            requestAnimFrame(animLoop);
            handleInput();
            render();
        }
    }
    
    var init = function() {
        console.log("init");
        var keyDownListener = addEventListener("keydown", function (e) {
            keysDown[e.keyCode] = true;
        }, false);

        var keyUpListener = addEventListener("keyup", function (e) {
            delete keysDown[e.keyCode];
        }, false);
        
        canvas = document.getElementById("gameCanvas");
        canvas.setAttribute("width", CANVAS_WIDTH);
        canvas.setAttribute("height", CANVAS_HEIGHT);
        
        context = canvas.getContext('2d');
        
        
        map = new Map(20, 20);
        map.generate();
        player = new Player(10,10);
        
        for (var i = 0; i < 20; i++) {
            enemies[enemies.length] = new Enemy("enemy", map, player);
        }
        
        gameRunning = true;
        animLoop();
    }
    
    var stop = function() {
        gameRunning = false;
        removeEventListener("keydown", keyDownListener);
        removeEventListener("keyup", keyUpListener);
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
        
        keysDown = [];
    }
    
    var render = function(){
        context.fillStyle="#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        map.draw(context, player.getX(), player.getY());
        player.draw(context);
        
        var enemyLength = enemies.length;
        
        if (numRenders == 30) {
            numRenders = 0;
            
            for (var i = 0; i < enemyLength; i++) {
                enemies[i].moveRandomly(map);
            }
        }
        for (var i = 0; i < enemyLength; i++) {
            enemies[i].draw(context, player.getX(), player.getY());
        }

        var items = 0;
        context.fillStyle = 'rgba(0,0,0,.5)';
        if (player.shovel) {
            context.beginPath();
            context.arc(760,600, 25, 0, 2 * Math.PI, false);
            context.fill();
            spriteMapper.getImage("icon-shovel").drawImage(context, 745,582);
            items ++;
        }
        if (player.ladder) {
            context.beginPath();
            context.arc(760-60*items,600, 25, 0, 2 * Math.PI, false);
            context.fill();
            spriteMapper.getImage("icon-ladder").drawImage(context, 745-60*items,582);
            items ++;
        }
        if (player.sword) {
            context.beginPath();
            context.arc(760-60*items,600, 25, 0, 2 * Math.PI, false);
            context.fill();
            spriteMapper.getImage("icon-sword").drawImage(context, 745-60*items,582);
            items ++;
        }
        if (player.jump) {
            context.beginPath();
            context.arc(760-60*items,600, 25, 0, 2 * Math.PI, false);
            context.fill();
            spriteMapper.getImage("icon-jump").drawImage(context, 745-60*items,582);
        }
        
        
        numRenders++;
    }

    init();
}());