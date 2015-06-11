var CANVAS_WIDTH = 600,
    CANVAS_HEIGHT = 576,
    STEP = 16,
    STORED_TIME;

var context;
var debug = false;
var stars = [];
var projectiles = [];
var enemies = [];
var bullets = [];
var explosions = [];

var enemySpawnTimer = 10;
var projectileTimeout = [0, 0, 0];
var projectileMaxTimeout = 60;
var spritesRendered = false;
var projectilesLaunched = [0,0,0,0,0]
var enemiesKilled = [0,0,0,0,0,0];
var enemyTypeKilled = [0,0,0];
var enemyBulletsFired = 0;
var maxEnemies = 5;
var enemiesDifficultyOriginal = 5;
var enemiesDifficulty = 5;
var enemiesDifficultyDelta = 1;
var playerRank = 0;
var gameOver = false;
var score = 0;
var time = 0;
var bulletsKilled = 0;

var mainMenuButton = 1;
var scoreMenuButton = 1;
var settings = new Settings();
var leaderboard = new Leaderboard();

(function () {
    var keysDown = [],
        gameRunning = false,
        keyDownListener,
        keyUpListener,
        canvas;

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
        $("#scoring .door").removeClass("closed");
        keyDownListener = addEventListener("keydown", function (e) {
            if (debug) {
                console.log("Keycode: " + e.keyCode);
            }
            keysDown[e.keyCode] = true;
        }, false);

        keyUpListener = addEventListener("keyup", function (e) {
            delete keysDown[e.keyCode];
        }, false);

        initGameSettings();

        canvas = document.getElementById("gameCanvas");
        canvas.setAttribute("width", CANVAS_WIDTH);
        canvas.setAttribute("height", CANVAS_HEIGHT);

        context = canvas.getContext('2d');

        player = new Player(275, 200);

        populateBackground();

        gameRunning = true;
        time = new Date();
        if (!requestId) {
            animLoop();
        }
    }

    var initGameSettings = function() {
        debug = false;
        stars = [];
        projectiles = [];
        enemies = [];
        bullets = [];
        explosions = [];

        enemySpawnTimer = 10;
        projectileTimeout = [0, 0, 0];
        projectileMaxTimeout = 60;
        spritesRendered = false;
        projectilesLaunched = [0,0,0,0,0]
        enemiesKilled = [0,0,0,0,0,0];
        enemyTypeKilled = [0,0,0];
        enemyBulletsFired = 0;
        maxEnemies = 5;
        enemiesDifficultyOriginal = 5;
        enemiesDifficulty = 5;
        enemiesDifficultyDelta = 1;
        playerRank = 0;
        gameOver = false;
        score = 0;
        time = 0;
        bulletsKilled = 0;
        requestId = null;
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

    var populateBackground = function() {
        var i = settings.numStars;
        while (i > 0) {
            var y = Math.random() * CANVAS_HEIGHT;
            var star = new Star(y);
            stars.push(star);

            i --;
        }
    }

    var handleInput = function() {
        if (115 in keysDown) {
            if (debug) {
                debug = false;
            } else {
                debug = true;
            }
            var index = keysDown['115'].index;
            keysDown.splice(index, 1);
        }

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
                projectilesLaunched[projectile.id] ++;
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
                projectilesLaunched[projectile.id] ++;
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
                projectilesLaunched[projectile.id] ++;
                projectile.x = player.x;
                projectile.y = player.y;
                projectile.dir = "se";
                projectiles.push(projectile);
                player.airlocks[2].closeDoor();
                player.airlocks[2].updateProjectile();
            }
        }

        if (65 in keysDown || projectileTimeout[0] > 0) {
            projectileTimeout[0] ++;

            if (projectileTimeout[0] == projectileMaxTimeout - 8) {
                player.airlocks[0].openDoor();
            }
            if (projectileTimeout[0] >= projectileMaxTimeout) {
                projectileTimeout[0] = 0;
            }
        }

        if (83 in keysDown || projectileTimeout[1] > 0) {
            projectileTimeout[1] ++;

            if (projectileTimeout[1] == projectileMaxTimeout - 8) {
                player.airlocks[1].openDoor();
            }
            if (projectileTimeout[1] >= projectileMaxTimeout) {
                projectileTimeout[1] = 0;
            }
        }

        if (68 in keysDown || projectileTimeout[2] > 0) {
            projectileTimeout[2] ++;

            if (projectileTimeout[2] == projectileMaxTimeout - 8) {
                player.airlocks[2].openDoor();
            }
            if (projectileTimeout[2] >= projectileMaxTimeout) {
                projectileTimeout[2] = 0;
            }
        }
    }

    var handleAI = function() {
        explosions.forEach(function(explosion, index) {
            explosion.update(index);
        })

        enemies.forEach(function(enemy) {
            var chance = Math.random() * 100;
            if (chance < 1) {
                enemy.shoot(player.x, player.y);
            }
        });
    }

    var updateScore = function() {
        if (!player.dying) {
            var enemyScore = enemyTypeKilled[0] * 50 + enemyTypeKilled[1] * 100 + enemyTypeKilled[2] * 150;

            var curTime = new Date();
            var seconds = Math.floor((curTime.getTime() - time.getTime()) / 1000);

            var pointsForTime = seconds * 5;

            var rankMultiplier = playerRank + 1;

            var bulletsScore = bulletsKilled * 15;
            score = (enemyScore + pointsForTime + bulletsScore) * rankMultiplier;
        }
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
        if (enemies.length < maxEnemies && enemySpawnTimer <= 0) {
            var rand = 150 - (playerRank * 15);
            if (rand < 0) {
                rand = 0;
            }

            var delay = 25;
            if (playerRank > 10) {
                delay -= (playerRank - 10);
            }

            if (delay < 0) {
                delay = 0;
            }

            enemySpawnTimer = (Math.random() * rand) + delay;

            var chance = Math.random() * 20;
            if (chance < maxEnemies) {
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

        var totalEnemiesKilled = enemiesKilled[0] + enemiesKilled[1] + enemiesKilled[2] + enemiesKilled[3] + enemiesKilled[4];

        if (totalEnemiesKilled >= enemiesDifficulty) {
            maxEnemies ++;
            playerRank ++;

            enemiesDifficulty += enemiesDifficultyOriginal;
            enemiesDifficulty += enemiesDifficultyDelta;
            enemiesDifficultyDelta ++;
        }
    }

    var handleCollision = function() {
        projectiles.forEach(function(p, pIndex) {
            enemies.forEach(function(e, eIndex) {
                // dumb 2d collision
                if (!(p.x + 4 > e.x + 32 || p.x + 28 < e.x || p.y + 4 > e.y + 32 || p.y + 28 < e.y)) {
                    enemiesKilled[p.id] ++;

                    if (e instanceof SpiralFireEnemy) {
                        enemyTypeKilled[2] ++;
                    } else if (e instanceof RapidFireEnemy) {
                        enemyTypeKilled[1] ++;
                    } else {
                        enemyTypeKilled[0] ++;
                    }

                    killProjectile(pIndex);
                    e.dying = true;
                    var explosion = new Explosion(e.x, e.y, e.id);
                    explosions.push(explosion);

                    updateScore();
                }
            });

            bullets.forEach(function(b, bIndex) {
                if (!(p.x + 4 > b.x + 6 || p.x + 28 < b.x || p.y + 4 > b.y + 6 || p.y + 28 < b.y)) {
                    p.bulletHits --;
                    if (p.bulletHits <= 0) {
                        killProjectile(pIndex);
                    }
                    killBullet(bIndex);
                    bulletsKilled ++;
                    updateScore();
                }
            });
        });

        bullets.forEach(function(b, bIndex) {
            if (!(b.x > player.x + 26 || b.x + 6 < player.x+6 || b.y > player.y + 58 || b.y + 6 < player.y+6)) {
                player.hp --;
                killBullet(bIndex);
                bulletsKilled ++;
                updateScore();
                soundManager.play('shipHit');
            }
        });

        enemies.forEach(function(e, eIndex) {
            if (!e.dying && !(e.x + 5 > player.x + 26 || e.x + 27 < player.x + 6 || e.y + 5 > player.y + 58 || e.y + 5 < player.y + 6)) {
                player.hp -= 2;
                enemiesKilled[5] ++;

                if (e instanceof SpiralFireEnemy) {
                    enemyTypeKilled[2] ++;
                } else if (e instanceof RapidFireEnemy) {
                    enemyTypeKilled[1] ++;
                } else {
                    enemyTypeKilled[0] ++;
                }

                e.dying = true;
                var explosion = new Explosion(e.x, e.y, e.id);
                explosions.push(explosion);
                updateScore();
            }
        });

        if (player.hp <= 0 && player.curFrame == 0) {
            if (!gameOver) {
                preShowScoreMenu();
            }
        }

        if (player.hp <= 0 && player.curFrame >= 12) {
            if (!gameOver) {
                showScoreMenu();
                gameOver = true;
                stop();
            }
        }
    }

    var render = function() {
        if (!spritesRendered) {
            prerenderSprites();
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

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

        explosions.forEach(function(explosion) {
            explosion.draw(context, numRenders);
        })

        player.draw(context, numRenders);


        // UI

        player.airlocks.forEach(function(airlock) {
            airlock.draw(context, numRenders);
        });

        var displayHp = player.hp;

        if (displayHp < 0) {
            displayHp = 0;
        }
        var hpSprite = "hp";
        if (displayHp > 5 || displayHp == 0) {
            hpSprite += displayHp;
        } else {
            if (numRenders > 50) {
                hpSprite += "0";
            } else {
                hpSprite += displayHp;
            }
        }
        spriteMapper.getImage(hpSprite).drawImage(context, 10, 10);

        context.fillStyle="#ffffff";
        context.font = '18px "Lucida Console", Monaco, monospace';
        context.fillText("Score: ", 260, 35);
        context.fillText(score, 330, 35);

        context.fillStyle="#cccc00"
        var rankMultiplier = playerRank + 1;
        context.fillText("x" + rankMultiplier, 220, 35);

        if (debug) {
            context.fillStyle="#ffffff";
            context.font = "16px Arial";
            context.fillText(projectileTimeout[0], 10,20);
            context.fillText(projectileTimeout[1], 10,40);
            context.fillText(projectileTimeout[2], 10,60);

            context.fillText(enemies.length, 10, 80);
            context.fillText(projectiles.length, 10, 100);
            context.fillText(stars.length, 10, 120);
            context.fillText(bullets.length, 10, 140);

            context.fillText(player.airlocks[0].curFrame + ", " + player.airlocks[0].open, 10, 180);
            context.fillText(player.airlocks[1].curFrame + ", " + player.airlocks[1].open, 10, 200);
            context.fillText(player.airlocks[2].curFrame + ", " + player.airlocks[2].open, 10, 220);
            context.fillText(player.hp, 10, 240);
            context.fillText(enemiesKilled, 10, 260);
            context.fillText(projectilesLaunched, 10, 280);
            context.fillText(enemyBulletsFired, 10, 300);
            context.fillText(enemiesDifficulty, 10, 320);
        }

        numRenders++;
        if (numRenders == 60) {
            numRenders = 0;
            updateScore();
        }
    }
    var playClick = function() {
        soundManager.play('buttonClick');
    }

    var showMainMenu = function() {
        $(document).off("keydown");
        $("#mainMenu .mainLinks a").eq(mainMenuButton - 1).addClass("selected").siblings().removeClass("selected");
        $("#mainMenu").show();
        $("#mainMenu .door").addClass("closed");
        $("#scoring .door").removeClass("closed");

        $(document).on("keydown.mainMenu", function(e) {
            if (e.which == '13' || e.which == '65') {
                $("#mainMenu .mainLinks a").eq(mainMenuButton - 1).click();

                $(document).off("keydown.mainMenu");
            }

            if (e.which == '38') {
                mainMenuButton --;

                if (mainMenuButton < 1) {
                    mainMenuButton = 4;
                }
            } else if (e.which == '40') {
                mainMenuButton ++;

                if (mainMenuButton > 4) {
                    mainMenuButton = 1;
                }
            }

            if (e.which == '79') {
                if (settings.scale == "none") {
                    settings.setScale("95%");
                } else if (settings.scale == "95%") {
                    settings.setScale("fill");
                } else if (settings.scale == "fill") {
                    settings.setScale("none");
                }
                console.log("Scale: " + settings.scale);

                updateGameSize();
            } else if (e.which == '80') {
                if (settings.numStars == 0) {
                    settings.setNumStars(100);
                } else if (settings.numStars == 100) {
                    settings.setNumStars(200);
                } else if (settings.numStars == 200) {
                    settings.setNumStars(400);
                } else if (settings.numStars == 400) {
                    settings.setNumStars(800);
                } else if (settings.numStars == 800) {
                    settings.setNumStars(0);
                }

                console.log("Num Stars: " + settings.numStars);
            }

            $("#mainMenu .mainLinks a").eq(mainMenuButton - 1).addClass("selected").siblings().removeClass("selected");
        });
    }

    var preShowScoreMenu = function() {
        $("#scoring").show();
    }
    var showScoreMenu = function() {
        $(document).off("keydown");
        $("#scoring .mainLinks a").eq(scoreMenuButton - 1).addClass("selected").siblings().removeClass("selected");

        $(document).on("keydown.scoreMenu", function(e) {
            if (e.which == '13' || e.which == '65') {
                $("#scoring .mainLinks a").eq(scoreMenuButton - 1).click();

                $(document).off("keydown.scoreMenu");
            }

            if (e.which == '38') {
                scoreMenuButton --;

                if (scoreMenuButton < 1) {
                    scoreMenuButton = 2;
                }
            } else if (e.which == '40') {
                scoreMenuButton ++;

                if (scoreMenuButton > 2) {
                    scoreMenuButton = 1;
                }
            }

            $("#scoring .mainLinks a").eq(scoreMenuButton - 1).addClass("selected").siblings().removeClass("selected");
        });

        $("#enemyKilled1").text(enemyTypeKilled[0]);
        $("#enemyKilled2").text(enemyTypeKilled[1]);
        $("#enemyKilled3").text(enemyTypeKilled[2]);

        $("#numCrates").text(enemiesKilled[3]);
        $("#numTurrets").text(enemiesKilled[2]);
        $("#numFridges").text(enemiesKilled[1]);
        $("#numConsoles").text(enemiesKilled[4]);
        $("#numShipsHit").text(enemiesKilled[5]);
        $("#numTotalKilled").text(enemiesKilled[1] + enemiesKilled[2] + enemiesKilled[3] + enemiesKilled[4] + enemiesKilled[5]);

        $("#itemCrates").text(projectilesLaunched[3]);
        $("#itemTurrets").text(projectilesLaunched[2]);
        $("#itemFridges").text(projectilesLaunched[1]);
        $("#itemConsoles").text(projectilesLaunched[4]);

        $("#numTotalItems").text(projectilesLaunched[1] + projectilesLaunched[2] + projectilesLaunched[3] + projectilesLaunched[4]);
        $("#difficultyReached").text(playerRank);

        $("#score").text(score);

        try {
            var bestScore = localStorage['bestscore'];
            if (!bestScore || bestScore < score) {
                localStorage['bestscore'] = score;
                bestScore = score;
            }

            $("#bestScore").text(bestScore);
        } catch(e) {
            $("#bestScore").hide();
        }

        $("#scoring .door").addClass("closed");
        $("#mainMenu .door").removeClass("closed");
        $("#mainMenu").show();
    }

    $("#backToMenu").on("click", function() {
        showMainMenu();
        playClick();
        return false;
    });

    $("#startGame").on("click", function() {
        $(document).off("keydown");

        $(".menu:not(#mainMenu)").hide();
        $("#mainMenu .door").removeClass("closed");
        init();
        playClick();
        return false;
    });

    $("#playAgain").on("click", function() {
        $(document).off("keydown");

        $(".menu:not(#scoring)").hide();
        $("#scoring .door").removeClass("closed");
        init();
        playClick();
        return false;
    });

    $("#instructionsButton").on("click", function() {
        $(document).off("keydown");

        $(document).on("keydown.instructionsMenu", function(e) {
            if (e.which == '13' || e.which == '65') {
                $("#instructions .mainLinks .back").click();

                $(document).off("keydown.instructionsMenu");
            }
        });

        $(".menu:not(#mainMenu)").hide();
        $("#instructions").show();
        $("#instructions .door").addClass("closed");

        $("#mainMenu .door").removeClass("closed");
        playClick();
        return false;
    });

    $("#controlsButton").on("click", function() {
        $(document).off("keydown");

        $(document).on("keydown.controlsMenu", function(e) {
            if (e.which == '13' || e.which == '65') {
                $("#controls .mainLinks .back").click();

                $(document).off("keydown.controlsMenu");
            }
        });

        $(".menu:not(#mainMenu)").hide();
        $("#controls").show();
        $("#controls .door").addClass("closed");

        $("#mainMenu .door").removeClass("closed");
        playClick();
        return false;
    });

    $("#aboutButton").on("click", function() {
        $(document).off("keydown");

        $(document).on("keydown.aboutMenu", function(e) {
            if (e.which == '13' || e.which == '65') {
                $("#about .mainLinks .back").click();

                $(document).off("keydown.aboutMenu");
            }
        });

        $(".menu:not(#mainMenu)").hide();

        $("#about").show();
        $("#about .door").addClass("closed");

        $("#mainMenu .door").removeClass("closed");
        playClick();
        return false;
    });

    $(".back").on("click", function() {
        showMainMenu();
        playClick();
        return false;
    });

    var updateGameSize = function() {
        var $gameCanvas = $("#gameCanvas");

        if (settings.scale == "none") {
            $gameCanvas.width(CANVAS_WIDTH).height(CANVAS_HEIGHT);
            $("#gameWrapper").width(CANVAS_WIDTH);
            $("#menu-wrap").css("transform", "scale(" + 1 + ")");
        } else if (settings.scale == "fill" || settings.scale == "95%") {
            var ratio = CANVAS_HEIGHT / CANVAS_WIDTH;

            var height = window.innerHeight;
            var width = window.innerWidth;

            var newWidth = 0;
            var newHeight = 0;
            if (height > width) {
                if (settings.scale == "95%") {
                    width = .95 * width;
                }
                newWidth = width;
                newHeight = width * ratio;
            } else {
                if (settings.scale == "95%") {
                    height = .95 * height;
                }
                newWidth = 1 / ratio * height;
                newHeight = height;
            }
            $gameCanvas.width(newWidth).height(newHeight);
            $("#gameWrapper").width(newWidth);
            var scale = newWidth / CANVAS_WIDTH + .001;

            $("#menu-wrap").css("transform", "scale(" + scale + ")");
        }
    }

    $(window).on("resize", function() {
        updateGameSize();
    });



    updateGameSize();

    showMainMenu();
}());
