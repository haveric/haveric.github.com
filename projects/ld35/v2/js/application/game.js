var CANVAS_WIDTH = 800,
    CANVAS_HEIGHT = 600;

(function () {
    var canvas,
        context;

    var player,
        controls = new Controls(),
        track,
        enemies,
        points,
        messager,
        minGear = 3,
        maxGear = 3,
        enemyMaxGear = 4;
        numRenders = 0,
        enemySpawns = 4;
        spritesRendered = false,
        currentGameType = "none",
        gameHasEnded = false;

    var init = function(type) {
        currentGameType = type;
        gameHasEnded = false;
        var enemySpeed = 6;
        var maxEnemies = 15;
        if (currentGameType != "demo") {
            maxGear = parseInt($("#startGear").val());
            enemyMaxGear = parseInt($("#enemyStartMaxGear").val());
            enemySpeed = parseInt($("#enemySpeed").val());
            maxEnemies = parseInt($("#numEnemies").val());
            enemySpawns = parseInt($("#enemySpawns").val());
        }

        canvas = document.getElementById("gameCanvas");
        canvas.setAttribute("width", CANVAS_WIDTH);
        canvas.setAttribute("height", CANVAS_HEIGHT);

        context = canvas.getContext('2d');
        messager = new Messager();
        points = new Points();
        track = new Track(5);
        player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 100, minGear, maxGear, track.numLanes);
        if (currentGameType != "demo") {
            var shift4 = parseInt($("#shift4").val());
            if (shift4 == 0) {
                shift4 = -1;
            }
            var shift5 = parseInt($("#shift5").val());
            if (shift5 == 0) {
                shift5 = -1;
            }
            var shift6 = parseInt($("#shift6").val());
            if (shift6 == 0) {
                shift6 = -1;
            }
            var shift7 = parseInt($("#shift7").val());
            if (shift7 == 0) {
                shift7 = -1;
            }
            var shift8 = parseInt($("#shift8").val());
            if (shift8 == 0) {
                shift8 = -1;
            }
            player.setNeededToShift(3, shift4);
            player.setNeededToShift(4, shift5);
            player.setNeededToShift(5, shift6);
            player.setNeededToShift(6, shift7);
            player.setNeededToShift(7, shift8);
        }
        enemies = new Enemies(maxEnemies, enemyMaxGear, enemySpeed);

        MainLoop.setUpdate(handleUpdate).setDraw(render).setEnd().start();
    }

    var handleUpdate = function(delta) {
        handleInput();
        handleMovement(delta);
    }
    var handleInput = function() {
        controls.checkForGamepads();

        if (controls.isPressed("reset")) { // r
            if (!controls.isDelayed("reset")) {
                controls.deleteKey("reset", 250);
                $(".menu").removeClass("active");
                init("play");
            }
        }

        if (!player.isDying && currentGameType != "demo") {
            if (controls.isPressed("shiftUp")) { //A
                if (!controls.isDelayed("shiftUp")) {
                    player.shiftUp();
                    controls.deleteKey("shiftUp", 100);
                }
            } else if (controls.isPressed("shiftDown")) { //Z
                if (!controls.isDelayed("shiftDown")) {
                    player.shiftDown();
                    controls.deleteKey("shiftDown", 100);
                }
            }

            if (controls.isPressed("up")) { // Player holding up
                player.moveUp();
            } else if (controls.isPressed("down")) { // Player holding down
                player.moveDown();
            } else {
                if (player.velocity != 0) {
                    if (Math.abs(player.velocity) - .5 > 0) {
                        player.velocity *= .95;
                    } else {
                        player.velocity *= .75;
                    }


                    if (player.velocity <= .01 && player.velocity >= -.01) {
                        player.velocity = 0;
                    }
                }
            }

            if (controls.isPressed("left")) { // Player holding left
                if (!controls.isDelayed("left")) {
                    player.moveLeft();

                    controls.deleteKey("left", 100);
                }
            } else if (controls.isPressed("right")) { // Player holding right
                if (!controls.isDelayed("right")) {
                    player.moveRight();

                    controls.deleteKey("right", 100);
                }
            }
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
        if (numRenders % Math.floor(60 / enemySpawns) == 0) {
            enemies.spawn(track.numLanes);
        }

        points.move(delta, player);
        enemies.move(delta, player);
        player.move(delta);
        messager.watch(delta);

        if (currentGameType != "demo") {
            if (player.isDying) {
                if (player.gear < 8 && player.frame == 6 && points.getTotal() == 0) {
                    endGame("lose");
                } else if (player.gear == 8 && player.frame > 6 && !player.hasBlackHoleStarted) {
                    player.hasBlackHoleStarted = true;
                    player.velocity = 0;
                    endGame("win?");
                }
            } else if (!player.isDying) {
                var death = enemies.checkForCollision(player, points, messager);
                if (death) {
                    player.x -= 8;
                    player.y -= 8;
                    player.frame = 0;
                    player.isDying = true;
                }
            }
        }
    }

    var render = function(){
        if (!spritesRendered) {
            prerenderSprites();
        }

        if (numRenders == 0 && !player.isDying && currentGameType != "demo") {
            player.score += 1;
        }

        context.fillStyle="#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.textAlign="left";
        track.draw(context, numRenders);
        enemies.draw(context, numRenders);

        if (currentGameType != "demo") {
            player.draw(context, numRenders);
        }

        var bestScore = localStorage['bestscore'];
        context.fillStyle="#ffffff";
        context.font = '18px "Lucida Console", Monaco, monospace';
        context.fillText("Score", 50, CANVAS_HEIGHT - 50);
        if (bestScore) {
            context.fillText("Best Score", CANVAS_WIDTH - 125, CANVAS_HEIGHT - 50);
        }
        context.textAlign="center";
        context.fillText(player.score, 80, CANVAS_HEIGHT - 25);
        if (bestScore) {
            context.fillText(bestScore, CANVAS_WIDTH - 75, CANVAS_HEIGHT - 25);
        }
        context.textAlign="left";




        var gearsX = 15;
        var gearsY = 380;
        var space = 60;
        spriteMapper.getImage("player-gear3-0").drawImage(context, gearsX, gearsY);
        if (player.neededToShift.get(3) <= 0) {
            spriteMapper.getImage("player-gear4-0").drawImage(context, gearsX, gearsY - space);
        }
        if (player.neededToShift.get(4) <= 0) {
            spriteMapper.getImage("player-gear5-0").drawImage(context, gearsX, gearsY - space * 2);
        }
        if (player.neededToShift.get(5) <= 0) {
            spriteMapper.getImage("player-gear6-0").drawImage(context, gearsX, gearsY - space * 3);
        }
        if (player.neededToShift.get(6) <= 0) {
            spriteMapper.getImage("player-gear7-0").drawImage(context, gearsX, gearsY - space * 4);
        }
        if (player.neededToShift.get(7) <= 0) {
            spriteMapper.getImage("player-gear8-0").drawImage(context, gearsX, gearsY - space * 5);
        }

        spriteMapper.getImage("ui-select").drawImage(context, gearsX-1, gearsY - space * (player.gear - 3));

        var textX = gearsX + 65;
        var textY = gearsY + 32;
        if (player.neededToShift.get(3) > 0) {
            context.fillText(player.neededToShift.get(3), textX, textY);
        }
        if (player.neededToShift.get(3) <= 0 && player.neededToShift.get(4) > 0) {
            context.fillText(player.neededToShift.get(4), textX, textY - space);
        }
        if (player.neededToShift.get(4) <= 0 && player.neededToShift.get(5) > 0) {
            context.fillText(player.neededToShift.get(5), textX, textY - space * 2);
        }
        if (player.neededToShift.get(5) <= 0 && player.neededToShift.get(6) > 0) {
            context.fillText(player.neededToShift.get(6), textX, textY - space * 3);
        }
        if (player.neededToShift.get(6) <= 0 && player.neededToShift.get(7) > 0) {
            context.fillText(player.neededToShift.get(7), textX, textY - space * 4);
        }
        if (currentGameType != "demo") {
            points.draw(context, numRenders);
            messager.draw(context, numRenders);
        }

        numRenders++;
        if (numRenders == 60) {
            numRenders = 0;
        }
    }

    var endGame = function(type) {
        if (!gameHasEnded) {
            if (type == "lose") {
                $("#end").addClass("active");
            } else if (type == "win?") {
                $("#endTwo").addClass("active");
            }
            gameHasEnded = true;

            var bestScore = localStorage['bestscore'];
            if (!bestScore || bestScore < player.score) {
                localStorage['bestscore'] = player.score;
            }
        }
    }

    var updateDifficultyLabels = function() {
        $("#startGear + .value").text($("#startGear").val());
        $("#enemyStartMaxGear + .value").text($("#enemyStartMaxGear").val());
        $("#enemySpeed + .value").text($("#enemySpeed").val());
        $("#numEnemies + .value").text($("#numEnemies").val());
        $("#enemySpawns + .value").text($("#enemySpawns").val());

        $("#shift4 + .value").text($("#shift4").val());
        $("#shift5 + .value").text($("#shift5").val());
        $("#shift6 + .value").text($("#shift6").val());
        $("#shift7 + .value").text($("#shift7").val());
        $("#shift8 + .value").text($("#shift8").val());
    }

    var checkForLocalControls = function() {
        var localControls = localStorage["controls"];
        if (localControls) {
            if (localControls == 1) {
                controls.resetToDefault();
                $("#layout1").addClass("active").siblings(".layout").removeClass("active");
            } else if (localControls == 2) {
                controls.resetToDefault2();
                $("#layout2").addClass("active").siblings(".layout").removeClass("active");
            }
        }
    }
    checkForLocalControls();
    updateDifficultyLabels();
    init("demo");



    $("input[type=range]").on("input change", function() {
        $(this).siblings(".value").text($(this).val());
        $("#customLink").addClass("active").siblings(".difficulty").removeClass("active");
    });

    $("#startGear").on("input change", function() {
        var val = $(this).val();

        if (val > 3) {
            $("#shift4").val(0);
            $("#shift4 + .value").text(0);
            $("#shift4").prop('disabled', true);
            $("#shift4").parents(".rangeChoice").slideUp();
        } else {
            $("#shift4").prop('disabled', false);
            $("#shift4").parents(".rangeChoice").slideDown();
        }

        if (val > 4) {
            $("#shift5").val(0);
            $("#shift5 + .value").text(0);
            $("#shift5").prop('disabled', true);
            $("#shift5").parents(".rangeChoice").slideUp();
        } else {
            $("#shift5").prop('disabled', false);
            $("#shift5").parents(".rangeChoice").slideDown();
        }
    });

    $(".difficulty").on("click", function() {
        $(this).addClass("active").siblings().removeClass("active");

        return false;
    });

    $("#easyLink").on("click", function() {
        $("#startGear").val(4);
        $("#enemyStartMaxGear").val(4);
        $("#enemySpeed").val(4);
        $("enemySpawns").val(4);
        $("#numEnemies").val(10);

        $("#shift4").val(0);
        $("#shift5").val(5);
        $("#shift6").val(10);
        $("#shift7").val(20);
        $("#shift8").val(30);
        updateDifficultyLabels();

        return false;
    });

    $("#normalLink").on("click", function() {
        $("#startGear").val(3);
        $("#enemyStartMaxGear").val(4);
        $("#enemySpeed").val(6);
        $("enemySpawns").val(4);
        $("#numEnemies").val(15);

        $("#shift4").val(5);
        $("#shift5").val(10);
        $("#shift6").val(20);
        $("#shift7").val(25);
        $("#shift8").val(30);
        updateDifficultyLabels();

        return false;
    });

    $("#hardLink").on("click", function() {
        $("#startGear").val(3);
        $("#enemyStartMaxGear").val(5);
        $("#enemySpeed").val(8);
        $("enemySpawns").val(6);
        $("#numEnemies").val(20);

        $("#shift4").val(10);
        $("#shift5").val(20);
        $("#shift6").val(25);
        $("#shift7").val(30);
        $("#shift8").val(35);

        updateDifficultyLabels();

        return false;
    });

    $("#extremeLink").on("click", function() {
        $("#startGear").val(3);
        $("#enemyStartMaxGear").val(6);
        $("#enemySpeed").val(15);
        $("enemySpawns").val(15);
        $("#numEnemies").val(30);

        $("#shift4").val(15);
        $("#shift5").val(25);
        $("#shift6").val(30);
        $("#shift7").val(35);
        $("#shift8").val(40);
        updateDifficultyLabels();

        return false;
    });

    $("#customLink").on("click", function() {
        $("#difficulty").addClass("active");
        return false;
    });

    $("#playLink").on("click", function() {
        $(".menu").removeClass("active");
        init("play");

        return false;
    });

    $(".tryagain").on("click", function() {
        $(".menu").removeClass("active");
        init("play");

        return false;
    });

    $(".backtomenu").on("click", function() {
        $(".menu").removeClass("active");
        $("#startMenu").addClass("active");

        return false;
    });

    $("#settingsLink").on("click", function() {
        $("#settings").addClass("active").siblings(".menu").removeClass("active");

        return false;
    });

    $("#instructionsLink").on("click", function() {
        $("#instructions").addClass("active").siblings(".menu").removeClass("active");

        return false;
    });

    $("#aboutLink").on("click", function() {
        $("#about").addClass("active").siblings(".menu").removeClass("active");

        return false;
    });

    $("#layout1").on("click", function() {
        $(this).addClass("active").siblings(".layout").removeClass("active");
        controls.resetToDefault();
        localStorage["controls"] = 1;
        return false;
    });

    $("#layout2").on("click", function() {
        $(this).addClass("active").siblings(".layout").removeClass("active");
        controls.resetToDefault2();
        localStorage["controls"] = 2;
        return false;
    });
}());