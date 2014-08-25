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

var cityDeathTimerMax = 10;
var cityDeathTimer = 10;

var Global = function() {
    this.screenShakeX = 0;
    this.screenShakeY = 0;
    this.screenShakeTimer = 0;
    this.isScreenShaking = false;
}

var global;
var player;
var isDemo = false;

var numStartCities = 5;

var stop;

var elapsedTime = 0;


(function () {
    var keysDown = [],
        gameRunning = false,
        keyDownListener,
        keyUpListener;
    
    var requestId,
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
    
    
    var init = function(type, numDaleks, laserTime, mapWidth, newCities, attack, regen) {
        if (type == 'demo') {
            isDemo = true;
        } else {
            isDemo = false;
        }
        
        // Reset game so we can play again
        gameRunning = false;
        cancelAnimFrame(requestId);
        requestId = undefined;
    
        keyDownListener = addEventListener("keydown", function (e) {
            console.log("Keycode: " + e.keyCode);
            keysDown[e.keyCode] = true;
        }, false);

        keyUpListener = addEventListener("keyup", function (e) {
            delete keysDown[e.keyCode];
            
            if (e.keyCode == 37 || e.keyCode == 65) { // Player holding left
                player.xVelocity = 0;
            }
            if (e.keyCode == 39 || e.keyCode == 68) { // Player holding right
                player.xVelocity = 0;
            }
        }, false);

        canvas = document.getElementById("gameCanvas");
        canvas.setAttribute("width", CANVAS_WIDTH);
        canvas.setAttribute("height", CANVAS_HEIGHT);
        
        context = canvas.getContext('2d');

        if (type == "same") {
            hideMenus();
            numDaleks = global.numDaleks;
            laserTime = global.laserTime;
            mapWidth = global.mapWidth;
            newCities = global.newCities;
            attack = global.attack;
            regen = global.regen;
        }
        
        global = new Global();
        
        elapsedTime = 0;
        
        var mapX = mapWidth || 100;
        global.mapWidth = mapX;
        var mapY = 46;

        cityDeathTimerMax = laserTime || 10;
        global.laserTimer = cityDeathTimerMax;
        
        map = new Map(mapX, mapY);
        map.generate();
        var midPointX = Math.floor(mapX/2);
        var midPointY = Math.floor(mapY/2);

        var sonicCost = attack || 15;
        var regenSonic = regen || 3;
        global.attack = sonicCost;
        global.regen = regenSonic;
        
        player = new Player(midPointX*32, midPointY*32, attack, regen);
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
        
        // Clear out all old stuff
        enemies = [];
        bullets = [];
        cities = [];
        deadCities = [];
        cityLasers = [];
        
        var numCities = newCities || 5;
        global.newCities = numCities;
        numStartCities = numCities;
        
        
        for (var i = 0; i < numCities; i++) {
            createCity();
        }
        
        var numEnemies = numDaleks || 10;
        global.numDaleks = numEnemies;
        
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
        var randY = Math.floor(Math.random() * (mapY - 33)) + 13;
        
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
    stop = function(type) {
        if (isDemo) {
            if (type == "menu") {
                hideMenus();
                $("#startMenu").addClass('active');
            } else {
                init('demo');
            }
        } else {
            gameRunning = false;
            removeEventListener("keydown", keyDownListener, false);
            removeEventListener("keyup", keyUpListener, false);
            keyDownListener = undefined;
            keyUpListener = undefined;
            
            if (type == "menu") {
                hideMenus();
                $("#startMenu").addClass('active');
            } else if (type == "win") {
                hideMenus();
                $("#winMenu").addClass("active");
                
                $("#winMenu .timeElapsed").text(elapsedTime);
                $("#winMenu .city-start").text(numStartCities);
                
                var remainingCities = cities.length;
                $("#winMenu .city-remain").text(remainingCities);
            } else if (type == "lose-cities") {
                hideMenus();
                $("#loseMenu .death").hide();
                $("#loseMenu .cities").show();
                $("#loseMenu").addClass("active");
                
                $("#loseMenu .timeElapsed").text(elapsedTime);
                $("#loseMenu .city-start").text(numStartCities);
                
                var remainingCities = cities.length;
                $("#loseMenu .city-remain").text(remainingCities);
            } else if (type == "lose-death") {
                hideMenus();
                $("#loseMenu .death").show();
                $("#loseMenu .cities").hide();
                $("#loseMenu").addClass("active");
                
                $("#loseMenu .timeElapsed").text(elapsedTime);
                $("#loseMenu .city-start").text(numStartCities);
                
                var remainingCities = cities.length;
                $("#loseMenu .city-remain").text(remainingCities);
            }
        }
    }
    
    var handleInput = function() {
        if (!isDemo) {
            if (38 in keysDown || 32 in keysDown || 87 in keysDown) { // Player holding up
                player.jump();
            }
            
            if (40 in keysDown || 17 in keysDown || 83 in keysDown) { // Player holding down
                player.doAttack();
            }
            
            if (37 in keysDown || 65 in keysDown) { // Player holding left
                player.moveLeft();
            }
            if (39 in keysDown || 68 in keysDown) { // Player holding right
                player.moveRight();
            }
        }
        if (81 in keysDown) { // q
            stop("menu");
        }
    }
    
    var spawnCityLaser = function() {
        if (cities.length > 0) {
            var cityNum = Math.floor(Math.random() * cities.length);
            var city = cities[cityNum];
            var startX = Math.random() * 800;
            var startY = -50;
            
            cityLasers.push(new CityLaser(startX, startY, city.x, city.y));
        }
    }
    
    var render = function(){
        sky.draw(numRenders);
        cities.forEach(function(city, index) {
            city.draw(numRenders);
        });
        
        var numFullyDeadCities = 0;
        deadCities.forEach(function(city, index) {
            city.draw(numRenders);
            if (!city.dying) {
                numFullyDeadCities ++;
            }
        });
        
        if (numFullyDeadCities == numStartCities) {
            stop('lose-cities');
        }
        
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
        
        if (global.isScreenShaking) {
            if (global.screenShakeTimer < 20) {
                global.screenShakeX = Math.floor(Math.random() * 10);
                global.screenShakeY = Math.floor(Math.random() * 10);
                
                global.screenShakeTimer ++;
            } else {
                global.screenShakeTimer = 0;
                global.isScreenShaking = false;
                global.screenShakeX = 0;
                global.screenShakeY = 0;
            }
        }
        
        var screenShakeX = 0;
        var screenShakeY = 0;
        var screenShakeTimer = 0;
        var isScreenShaking = false;
        
        numRenders++;
        if (numRenders == 60) {
            numRenders = 0;
            elapsedTime ++;
            
            cityDeathTimer --;
            
            if (cityDeathTimer < 0) {
                cityDeathTimer = cityDeathTimerMax;
                spawnCityLaser();
            }
        }
    }
    
    init('demo');
    
    var localVolume = localStorage.getItem('volume');
    if (localVolume != null) {
        soundManager.setVolume(localVolume);
        if (localVolume == 0) {
            $("#volume .note").addClass("muted");
        }
        
        $("#volume input").val(localVolume * 100);
    } else {
        soundManager.setVolume(0.5);
        $("#volume input").val(50);
    }
    
    $("#quickGame").on("click", function() {
        hideMenus();
        soundManager.play('click');
        init('easy');
    });
    
    $("#difficulty .startButton").on("click", function() {
        hideMenus();
        
        soundManager.play('click');
        
        var numDaleks = $("#dalekRange").val();
        var laserTime = $("#laserRange").val();
        var mapWidth = $("#mapRange").val();
        var numCities = $("#cityRange").val();
        var attack = $("#attackRange").val();
        var regen = $("#regenRange").val();
        
        init('normal', numDaleks, laserTime, mapWidth, numCities, attack, regen);
    });
    
    $("#chooseDifficulty").on("click", function() {
        $("#startMenu").removeClass("active");
        soundManager.play('click');
        
        $("#difficulty").addClass("active");
    });
    
    $(".diff").on("click", function() {
        var $this = $(this);
        $this.addClass("active").siblings('.active').removeClass('active');
        
        soundManager.play('click');
        
        var numDaleks = 0;
        var laserRange = 0;
        var mapWidth = 0;
        var numCities = 0;
        var attack = 0;
        var regen = 0;
        
        var setSliders = true;
        if ($this.hasClass("easyDiff")) {
            mapWidth = 100;
            numDaleks = 10;
            laserRange = 10;
            numCities = 5;
            attack = 15;
            regen = 3;
        } else if ($this.hasClass("normalDiff")) {
            mapWidth = 150;
            numDaleks = 25;
            laserRange = 5;
            numCities = 7;
            attack = 20;
            regen = 2;
        } else if ($this.hasClass("hardDiff")) {
            mapWidth = 250;
            numDaleks = 50;
            laserRange = 3;
            numCities = 10;
            attack = 30;
            regen = 1;
        } else {
            setSliders = false;
        }
        
        if (setSliders) {
            $("#dalekRange").val(numDaleks);
            $("#dalekRange").siblings('.value').text(numDaleks);
            
            $("#laserRange").val(laserRange);
            $("#laserRange").siblings('.value').text(laserRange);
            
            $("#mapRange").val(mapWidth);
            $("#mapRange").siblings('.value').text(mapWidth);
            
            $("#cityRange").val(numCities);
            $("#cityRange").siblings('.value').text(numCities);
            
            $("#attackRange").val(attack);
            $("#attackRange").siblings('.value').text(attack);
            
            $("#regenRange").val(regen);
            $("#regenRange").siblings('.value').text(regen);
        }
    });
    
    $("#difficulty input[type=range]").on("change", function() {
        var $this = $(this);
        $(".customDiff").addClass("active").siblings('.active').removeClass("active");
        
        soundManager.play('click');
        
        $this.siblings('.value').text($this.val());
    });
    
    $("#volume input").on("change", function() {
        var $this = $(this);
        
        var newVolume = $this.val();
        
        if (newVolume == 0) {
            $("#volume .note").addClass('muted');
        } else {
            $("#volume .note").removeClass('muted');
        }
        
        soundManager.setVolume(newVolume / 100);
        
        soundManager.play('click');
    });
    
    $("#instructionsLink").on("click", function() {
        $("#startMenu").removeClass("active");
        soundManager.play('click');
        
        $("#instructions").addClass("active");
    });
    
    $("#settingsLink").on("click", function() {
        $("#startMenu").removeClass("active");
        soundManager.play('click');
        
        $("#settings").addClass("active");
    });
    
    $("#aboutLink").on("click", function() {
        $("#startMenu").removeClass("active");
        soundManager.play('click');
        
        $("#about").addClass("active");
    });
    
    
    $(".backButton").on("click", function() {
        hideMenus();
        soundManager.play('click');
        $("#startMenu").addClass("active");
    });
    
    $(".playAgain").on("click", function() {
        init('same');
        soundManager.play('click');
    });
    
    function hideMenus() {
        $(".menu.active").removeClass("active");
    }
    
    
}());