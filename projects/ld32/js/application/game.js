var CANVAS_WIDTH = 600,
    CANVAS_HEIGHT = 600,
    STEP = 16,
    STORED_TIME;

var projectiles = [];
var enemies = [];
var enemySpawnTimer = 10;

(function () {
    var keysDown = [],
        gameRunning = false,
        keyDownListener,
        keyUpListener,
        canvas,
        context;
    
    var player,
        requestId;
        numRenders = 0,
        keyDownListener,
        keyUpListener;
    
    var lastTime = null;
    
    
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
        
    
    var animLoop = function(timestamp){
        if (gameRunning) {
            if (lastTime == null) {
                lastTime = timestamp;
            }
            
            var dt = timestamp - lastTime;
            // Cap delta time to 1 second
            if (dt > 1000) {
                dt = 1000;
            }
            STORED_TIME += dt;

            if (dt >= STEP) {
                handleInput();
                handleMovement();
                dt -= STEP;
            }
            render();
            
            lastTime = timestamp;
            requestId = requestAnimFrame(animLoop);
        }
    }
    
    
    var init = function() {
        keyDownListener = addEventListener("keydown", function (e) {
            console.log("Keycode: " + e.keyCode);
            keysDown[e.keyCode] = true;
        }, false);

        keyUpListener = addEventListener("keyup", function (e) {
            delete keysDown[e.keyCode];
        }, false);

        canvas = document.getElementById("gameCanvas");
        canvas.setAttribute("width", CANVAS_WIDTH);
        canvas.setAttribute("height", CANVAS_HEIGHT);
        
        context = canvas.getContext('2d');

        player = new Player(375, 500);

        gameRunning = true;
        if (!requestId) {
            animLoop();
        }
    }
    var reset = function() {
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
            player.moveUp();
        } else if (40 in keysDown) { // Player holding down
            player.moveDown();
        } else {
            player.yVelocity = 0;
        }
        
        if (37 in keysDown) { // Player holding left
            player.moveLeft();
        } else if (39 in keysDown) { // Player holding right
            player.moveRight();
        } else {
            player.xVelocity = 0;
        }
        
        if (17 in keysDown) {
            var projectile = new Projectile(player.x, player.y);
            projectile.setRandomDirection();
            projectiles.push(projectile);
        }
        
        
        if (81 in keysDown) { // q
            stop("menu");
        }
    }
    
    var handleMovement = function() {
        projectiles.forEach(function(projectile) {
            projectile.move();
        });
        
        enemies.forEach(function(enemy, index) {
            enemy.move(index);
        });
        
        if (enemySpawnTimer >= 0) {
            enemySpawnTimer --;
        }
        if (enemies.length < 5 && enemySpawnTimer <= 0) {
            enemySpawnTimer = (Math.random() * 50) + 25;
            var enemy = new Enemy((Math.random() * (CANVAS_WIDTH -64)) + 32, CANVAS_HEIGHT + 50);
            enemies.push(enemy);
        }
    }
    
    var render = function(){
        context.fillStyle="#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        projectiles.forEach(function(projectile) {
            projectile.draw(context, numRenders);
        });
        
        enemies.forEach(function(enemy) {
            enemy.draw(context, numRenders);
        });
        
        player.draw(context, numRenders);
        
        
        numRenders++;
        if (numRenders == 60) {
            numRenders = 0;
        }
    }
    
    init();
}());