// Create the canvas
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 640;

var buffer = document.createElement('canvas');
buffer.width = canvas.width;
buffer.height = canvas.height;

var bufferCtx = buffer.getContext('2d');



(function () {
    var lastTime = 0;
    var vendors = ['ms','moz','webkit','o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}())

function Create2DArray(rows) {
  var arr = [];
  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }
  return arr;
}

var mapWith = 40;
var mapHeight = 20;

var map = Create2DArray(40);


for (var i = 0; i < 40; i++) {
    for (var j = 0; j < 20; j++) {
        if (i== 6 || j == 16){
            map[i][j] = 1;
        } else {
            map[i][j] = 0;
        }
    }
}

var player = new Player(64,64);
var monster1 = new Monster(256, 256);
var monster2 = new Monster(128, 150);

var soldier = new Soldier(320, 128, 'm');
var pirate = new Pirate(256, 128, 'f');

var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

var mouseX,
    mouseY,
    mouseTileX,
    mouseTileY;
    
addEventListener("click", function (e) {
    if (e.pageX || e.pageY) {
      mouseX = e.pageX;
      mouseY = e.pageY;
    }
    else {
      mouseX = e.clientX + document.body.scrollLeft +
           document.documentElement.scrollLeft;
      mouseY = e.clientY + document.body.scrollTop +
           document.documentElement.scrollTop;
    }
    
    mouseX -= canvas.offsetLeft;
    mouseY -= canvas.offsetTop;
    mouseTileX = Math.floor((mouseX+offX) / 32) + xTile - 10;
    mouseTileY = Math.floor((mouseY+offY) / 32) + yTile - 10;
}, false);

// Update game objects
var update = function () {
    if (38 in keysDown) { // Player holding up
        player.y -= player.speed;
    }
    if (40 in keysDown) { // Player holding down
        player.y += player.speed;
    }
    if (37 in keysDown) { // Player holding left
        player.x -= player.speed;
    }
    if (39 in keysDown) { // Player holding right
        player.x += player.speed;
    }

    // Are they touching?
    if (
        player.x <= (monster1.x + 32)
        && monster1.x <= (player.x + 32)
        && player.y <= (monster1.y + 32)
        && monster1.y <= (player.y + 32)
    ) {
        ++monstersCaught;
    }
    
    if (
        player.x <= (monster2.x + 32)
        && monster2.x <= (player.x + 32)
        && player.y <= (monster2.y + 32)
        && monster2.y <= (player.y + 32)
    ) {
        ++monstersCaught;
    }
};

var xTile,
    yTile,
    offX,
    offY;
// Draw everything
var render = function () {
    xTile = Math.floor(player.x/32);
    yTile = Math.floor(player.y/32);
    
    var pX = player.x;
    var pY = player.y;
    
    offX = pX - (xTile * 32);
    offY = pY - (yTile * 32);
    
    for (var i = xTile-10; i < xTile+11; i++) {
        for (var j = yTile-10; j < yTile+11; j++) {
            
            if (i < 0 || j < 0 || i >= map.length || j >= map[0].length) {
                bufferCtx.fillStyle = "rgb(0, 0, 0)";
                bufferCtx.fillRect((i-(xTile-10))*32-offX, (j-(yTile-10))*32-offY, 32, 32);
            } else {
                if (map[i][j] == 0) {
                    spriteMapper.getImage('grass1').drawImage((i-(xTile-10))*32-offX, (j-(yTile-10))*32-offY);
                } else {
                    spriteMapper.getImage('dirt1').drawImage((i-(xTile-10))*32-offX, (j-(yTile-10))*32-offY);
                }
            }
        }
    }

    
    


    var monsterImage = textureMapper.getTexture('monster');
    if (monsterImage != null) {
        if (monster1.x >= (xTile-10)*32 && monster1.x <= (xTile+11)*32 && monster1.y >= (yTile-10)*32 && monster1.y <= (yTile+11)*32) {
            bufferCtx.drawImage(monsterImage, monster1.x-((xTile-10)*32)-offX, monster1.y-((yTile-10)*32)-offY);
        }
        if (monster2.x >= (xTile-10)*32 && monster2.x <= (xTile+11)*32 && monster2.y >= (yTile-10)*32 && monster2.y <= (yTile+11)*32) {
            bufferCtx.drawImage(monsterImage, monster2.x-((xTile-10)*32)-offX, monster2.y-((yTile-10)*32)-offY);
        }
    }    
    
    
    soldier.draw((xTile-10)*32, (xTile+11)*32, (yTile-10)*32, (yTile+11)*32, offX, offY);
    pirate.draw((xTile-10)*32, (xTile+11)*32, (yTile-10)*32, (yTile+11)*32, offX, offY);
    
    var heroImage = textureMapper.getTexture('hero');
    if (heroImage != null) {
        bufferCtx.drawImage(heroImage, 320, 320);
    }    

    
    // Score
    bufferCtx.fillStyle = "rgb(250, 250, 250)";
    bufferCtx.font = "24px Helvetica";
    bufferCtx.textAlign = "left";
    bufferCtx.textBaseline = "top";
    bufferCtx.fillText("Goblins caught: " + monstersCaught + " x: " + mouseX + ", y: " + mouseY + ", tX: " + mouseTileX + ", tY: " + mouseTileY, 32, 32);
    ctx.drawImage(buffer, 0, 0);
    
};

function gameLoop() {
    update();
    render();
    
    requestAnimationFrame(gameLoop);
}



// Let's play this game!
gameLoop();