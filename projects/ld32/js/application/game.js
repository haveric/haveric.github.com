var CANVAS_WIDTH = 600,
    CANVAS_HEIGHT = 600,
    STEP = 16,
    STORED_TIME;

var stars = [];
var projectiles = [];
var enemies = [];
var bullets = [];
var enemySpawnTimer = 10;
var projectileTimeout = [0, 0, 0];
var projectileMaxTimeout = 60;

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
                handleAI();
                handleMovement();
                handleCollision();
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

        populateBackground();
        
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
    
    var populateBackground = function() {
        var i = 400;
        while (i > 0) {
            var y = Math.random() * CANVAS_HEIGHT;
            var star = new Star(y);
            stars.push(star);
            
            i --;
        }
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
        
        if (65 in keysDown) { // A
            if (projectileTimeout[0] == 0) {
                var projectile = player.airlocks[0].projectile;
                projectile.x = player.x;
                projectile.y = player.y;
                projectile.dir = "sw";
                projectiles.push(projectile);
                player.airlocks[0].closeDoor();
                player.airlocks[0].updateProjectile();
            }
        }
        
        if (83 in keysDown) { // S
            if (projectileTimeout[1] == 0) {
                var projectile = player.airlocks[1].projectile;
                projectile.x = player.x;
                projectile.y = player.y;
                projectile.dir = "s"; 
                projectiles.push(projectile);
                player.airlocks[1].closeDoor();
                player.airlocks[1].updateProjectile();
            }
        }
        
        if (68 in keysDown) { // D
            if (projectileTimeout[2] == 0) {
                var projectile = player.airlocks[2].projectile;
                projectile.x = player.x;
                projectile.y = player.y;
                projectile.dir = "se";
                projectiles.push(projectile);
                player.airlocks[2].closeDoor();
                player.airlocks[2].updateProjectile();
            }
        }
        
        
        if (81 in keysDown) { // q
            stop("menu");
        }
        
        if (65 in keysDown || 17 in keysDown || projectileTimeout[0] > 0) {
            projectileTimeout[0] ++;
            
            if (projectileTimeout[0] == projectileMaxTimeout - 8) {
                player.airlocks[0].openDoor();
            }
            if (projectileTimeout[0] >= projectileMaxTimeout) {
                projectileTimeout[0] = 0;
            }
        }
        
        if (83 in keysDown || 17 in keysDown || projectileTimeout[1] > 0) {
            projectileTimeout[1] ++;
            
            if (projectileTimeout[1] == projectileMaxTimeout - 8) {
                player.airlocks[1].openDoor();
            }
            if (projectileTimeout[1] >= projectileMaxTimeout) {
                projectileTimeout[1] = 0;
            }
        }
        
        if (68 in keysDown || 17 in keysDown || projectileTimeout[2] > 0) {
            projectileTimeout[2] ++;
            
            if (projectileTimeout[0] == projectileMaxTimeout - 8) {
                player.airlocks[2].openDoor();
            }
            if (projectileTimeout[2] >= projectileMaxTimeout) {
                projectileTimeout[2] = 0;
            }
        }
    }
    
    var handleAI = function() {
        enemies.forEach(function(enemy) {
            var chance = Math.random() * 100;
            if (chance < 1) {
                enemy.shoot(player.x, player.y);
            }
        });
    }
    
    var handleMovement = function() {
        stars.forEach(function(star, index) {
            star.move(index);
        });
        
        projectiles.forEach(function(projectile, index) {
            projectile.move(index);
        });
        
        bullets.forEach(function(bullet, index) {
            bullet.move(index);
        });
        
        enemies.forEach(function(enemy, index) {
            enemy.move(index);
        });
        
        if (enemySpawnTimer >= 0) {
            enemySpawnTimer --;
        }
        if (enemies.length < 5 && enemySpawnTimer <= 0) {
            enemySpawnTimer = (Math.random() * 150) + 25;
            
            var chance = Math.random() * 20;
            if (chance < 5) {
                var enemy = new RapidFireEnemy((Math.random() * (CANVAS_WIDTH -64)) + 32, CANVAS_HEIGHT + 50);
                enemies.push(enemy);
            } else if (chance >= 5 && chance < 7) {
                var enemy = new SpiralFireEnemy((Math.random() * (CANVAS_WIDTH -64)) + 32, CANVAS_HEIGHT + 50);
                enemies.push(enemy);
            } else {
                var enemy = new Enemy((Math.random() * (CANVAS_WIDTH -64)) + 32, CANVAS_HEIGHT + 50);
                enemies.push(enemy);
            }
        }
    }
    
    var handleCollision = function() {
        projectiles.forEach(function(p, pIndex) {
            enemies.forEach(function(e, eIndex) {
                // dumb 2d collision
                if (!(p.x > e.x + 32 || p.x + 32 < e.x || p.y > e.y + 32 || p.y + 32 < e.y)) {
                    killProjectile(pIndex);
                    killEnemy(eIndex);
                }
            });
            
            bullets.forEach(function(b, bIndex) {
                if (!(p.x > b.x + 32 || p.x + 32 < b.x || p.y > b.y + 32 || p.y + 32 < b.y)) {
                    killProjectile(pIndex);
                    killBullet(bIndex);
                }
            });
        });
        
        bullets.forEach(function(b, bIndex) {
            if (!(b.x > player.x + 32 || b.x + 5 < player.x || b.y > player.y + 32 || b.y + 5 < player.y)) {
                killBullet(bIndex);
            }
        });
    }
    
    var render = function(){
        context.fillStyle="#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var bigStars = [];
        stars.forEach(function(star) {
            if (star.radius < 10) {
                star.draw(context, numRenders);
            } else {
                bigStars.push(star);
            }
        });
        
        bigStars.forEach(function(star) {
            star.draw(context, numRenders);
        });
        
        bigStars = [];
        
        projectiles.forEach(function(projectile) {
            projectile.draw(context, numRenders);
        });
        
        bullets.forEach(function(bullet) {
            bullet.draw(context, numRenders);
        });
        
        enemies.forEach(function(enemy) {
            enemy.draw(context, numRenders);
        });
        
        player.draw(context, numRenders);
        
        
        // UI
        
        player.airlocks.forEach(function(airlock) {
            airlock.draw(context, numRenders);
        });
        
        context.fillStyle="#ffffff";
        context.font = "16px Arial";
        context.fillText(projectileTimeout[0], 10,20);
        context.fillText(projectileTimeout[1], 10,40);
        context.fillText(projectileTimeout[2], 10,60);
        
        context.fillText(enemies.length, 10, 80);
        context.fillText(projectiles.length, 10, 100);
        context.fillText(stars.length, 10, 120);
        context.fillText(bullets.length, 10, 140);
        
        
        numRenders++;
        if (numRenders == 60) {
            numRenders = 0;
        }
    }
    
    init();
}());