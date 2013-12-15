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
        enemies = [],
        action1 = "none",
        action2 = "none",
        action3 = "none",
        action4 = "none";
    
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
            console.log("Keycode: " + e.keyCode);
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
        
        if (49 in keysDown) { // #1
            player.setActiveItem(action1);
        }
        if (50 in keysDown) { // #2
            player.setActiveItem(action2);
        }
        if (51 in keysDown) { // #3
            player.setActiveItem(action3);
        }
        if (52 in keysDown) { // #4
            player.setActiveItem(action4);
        }
        if (32 in keysDown) { // space
            player.performAction(map);
        }
        
        keysDown = [];
    }
    
    var render = function(){
        context.fillStyle="#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        map.draw(context, player.getX(), player.getY());
        
        var ladderLength = ladders.length;
        for (var i = 0; i < ladderLength; i++) {
            ladders[i].draw(context, player.getX(), player.getY());
        }
        
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
        
        var numItems = 0;
        if (player.shovel) {
            numItems ++;
        }
        if (player.ladder) {
            numItems ++;
        }
        if (player.sword) {
            numItems ++;
        }
        if (player.jump) {
            numItems ++;
        }
        var maxItems = 4;
        var offset = (maxItems - numItems) * 60;
        var items = 0;
        context.fillStyle = 'rgba(30,30,30,.5)';
        context.strokeStyle = 'rgba(0,200,200,.9)';
        if (player.shovel) {
            context.beginPath();
            context.arc(580+offset,600, 25, 0, 2 * Math.PI, false);
            context.fill();
            spriteMapper.getImage("icon-shovel").drawImage(context, 565+offset,582);
            items ++;
            if (player.activeItem == "shovel") {
                 context.stroke();
            }
            action1 = "shovel";
        }
        if (player.ladder) {
            context.beginPath();
            context.arc(580+offset+60*items,600, 25, 0, 2 * Math.PI, false);
            context.fill();
            spriteMapper.getImage("icon-ladder").drawImage(context, 565+offset+60*items,582);
            items ++;
            if (player.activeItem == "ladder") {
                context.stroke();
            }
            if (items == 1) {
                action1 = "ladder";
            } else {
                action2 = "ladder";
            }
        }
        if (player.sword) {
            context.beginPath();
            context.arc(580+offset+60*items,600, 25, 0, 2 * Math.PI, false);
            context.fill();
            spriteMapper.getImage("icon-sword").drawImage(context, 565+offset+60*items,582);
            items ++;
            if (player.activeItem == "sword") {
                context.stroke();
            }
            if (items == 1) {
                action1 = "sword";
            } else if (items == 2){
                action2 = "sword";
            } else {
                action3 = "sword";
            }
        }
        if (player.jump) {
            context.beginPath();
            context.arc(580+offset+60*items,600, 25, 0, 2 * Math.PI, false);
            context.fill();
            spriteMapper.getImage("icon-jump").drawImage(context, 565+offset+60*items,582);
            if (player.activeItem == "jump") {
                context.stroke();
            }
            items ++;
            if (items == 1) {
                action1 = "jump";
            } else if (items == 2){
                action2 = "jump";
            } else if (items == 3) {
                action3 = "jump";
            } else {
                action4 = "jump";
            }
        }
        
        context.fillStyle = 'rgba(200,200,200,.9)';
        context.font = "bold 16px Arial";
        
        if (items == 0) {
            action1 = "none";
            action2 = "none";
            action3 = "none";
            action4 = "none";
        } else if (items == 1) {
            action2 = "none";
            action3 = "none";
            action4 = "none";
        } else if (items == 2){
            action3 = "none";
            action4 = "none";
        } else if (items == 3) {
            action4 = "none";
        }
        
        for (var i = items; i > 0; i--) {
            var x = 755+(i-items)*60;
            context.fillText(i, x,570)
        }
        
        numRenders++;
    }

    init();
}());