var CANVAS_WIDTH = 800,
    CANVAS_HEIGHT = 640;

var map;
var canvas,
    context,
    phoneBooth,
    sky;

var enemies = [];
var bullets = [];
var cities = [];
var deadCities = [];
var cityLasers = [];

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
            console.log("Keycode: " + e.keyCode);
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
        
        var mapX = 100;
        var mapY = 46;

        map = new Map(mapX, mapY);
        map.generate();
        var midPointX = Math.floor(mapX/2);
        var midPointY = Math.floor(mapY/2);

        player = new Player(midPointX*32, midPointY*32);
        map.setTile(midPointX, midPointY, new Empty());
        map.setTile(midPointX-1, midPointY, new Empty());
        map.setTile(midPointX+1, midPointY, new Empty());
        map.setTile(midPointX, midPointY-1, new Empty());
        map.setTile(midPointX, midPointY+1, new Solid());
        
        sky = new Sky();
        
        var pbX = Math.floor(Math.random() * (mapX - 33)) + 16;
        var pbY = mapY - 18;
        phoneBooth = new PhoneBooth(pbX,pbY);
        
        map.setTile(pbX, pbY, new Empty());
        map.setTile(pbX, pbY+1, new Empty());
        
        var numCities = 5;
        for (var i = 0; i < numCities; i++) {
            createCity();
        }
        
        var numEnemies = 10;
        
        for (var i = 0; i < numEnemies; i++) {
            createRandomEnemy(midPointX, midPointY, mapX, mapY);
        }
        
        gameRunning = true;
        if (!requestId) {
            animLoop();
        }
    }
    
    var createCity = function() {
        var x = Math.floor(Math.random() * CANVAS_WIDTH);
        var y = (canvas.height * 2/3) + Math.floor(Math.random() * 160);
        
        // Prevent city from appearing behind player
        if (x > 300 && x < 450 || x > CANVAS_WIDTH - 60) {
            createCity();
        } else {
            cities.push(new City(x, y));
        }
    }
    
    var createRandomEnemy = function(mx, my, mapX, mapY) {
        var randX = Math.floor(Math.random() * (mapX - 33)) + 16;
        var randY = Math.floor(Math.random() * (mapY - 33)) + 16;
        
        var landed = false;
        var j = 1;
        while (!landed) {
            var tile = map.getTile(randX, randY + j);
            if (tile.isSolid) {
                var placeY = randY + j - 1;
                if (randX == mx && placeY == my) {
                    createRandomEnemy(mx, my, mapX, mapY);
                    break;
                } else {
                    var enemy = new Enemy(randX*32, placeY*32);
    
                    map.setTile(randX, placeY, new Empty());
                    enemies.push(enemy);
                    landed= true;
                }
            }
            j ++;
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
        if (38 in keysDown || 32 in keysDown) { // Player holding up
            player.jump();
        }
        
        if (40 in keysDown || 17 in keysDown) { // Player holding down
            player.doAttack();
        }
        
        if (76 in keysDown) { // L is for LAZZZZERS
            var cityNum = Math.floor(Math.random() * cities.length);
            var city = cities[cityNum];
            var startX = Math.random() * 800;
            var startY = -50;
            
            cityLasers.push(new CityLaser(startX, startY, city.x, city.y));
            
            delete keysDown[76];
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
        sky.draw(numRenders);
        cities.forEach(function(city, index) {
            city.draw(numRenders);
        });
        
        deadCities.forEach(function(city, index) {
            //city.draw(numRenders);
        });
        
        cityLasers.forEach(function(laser, index) {
            laser.draw(numRenders, index);
        });
        
        map.draw(numRenders, player.getX(), player.getY());
        
        phoneBooth.draw(numRenders, player.getX(), player.getY());
        
        enemies.forEach(function(enemy, index) {
            enemy.draw(numRenders, index, player.getX(), player.getY());
        });
        
        bullets.forEach(function(bullet, index) {
            bullet.draw(numRenders, index, player.getX(), player.getY());
        });
        
        player.draw(numRenders);
        

        
        numRenders++;
        if (numRenders == 60) {
            numRenders = 0;
        }
    }
    
    init();
}());