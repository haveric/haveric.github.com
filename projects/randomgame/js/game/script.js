// Create the canvas
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

var buffer = document.createElement('canvas');
buffer.width = canvas.width;
buffer.height = canvas.height;

var bufferCtx = buffer.getContext('2d');
bufferCtx.font = "24px Helvetica";
bufferCtx.textAlign = "left";
bufferCtx.textBaseline = "top";

var MAP_WIDTH = 800;
var MAP_HEIGHT = 600;
var TILE_WIDTH = 32;
var TILE_HEIGHT = 32;
var numXTiles = Math.ceil(MAP_WIDTH / TILE_WIDTH) + 1;
var numYTiles = Math.ceil(MAP_HEIGHT / TILE_HEIGHT) + 1;

var leftTile = -Math.floor(numXTiles / 2);
var rightTile = numXTiles + leftTile;

var topTile = -Math.floor(numYTiles / 2);
var bottomTile = numYTiles + topTile;


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
    } else {
        mouseX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mouseY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    
    mouseX -= canvas.offsetLeft;
    mouseY -= canvas.offsetTop;
    mouseTileX = Math.floor((mouseX+offX) / TILE_WIDTH) + xTile + leftTile;
    mouseTileY = Math.floor((mouseY+offY) / TILE_HEIGHT) + yTile + topTile;
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
    var pX = player.x;
    var pY = player.y;
    
    xTile = Math.floor(pX / TILE_WIDTH);
    yTile = Math.floor(pY / TILE_HEIGHT);
    
    
    offX = pX - (xTile * TILE_WIDTH);
    offY = pY - (yTile * TILE_HEIGHT);
    
    var drawLeft = xTile + leftTile;
    var drawRight = xTile + rightTile;
    var drawTop = yTile + topTile;
    var drawBottom = yTile + bottomTile;
    
    bufferCtx.fillStyle = "rgb(0, 0, 0)";
    bufferCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (var i = drawLeft; i < drawRight; i++) {
        for (var j = drawTop; j < drawBottom; j++) {
            
            // Outside of the map
            if (i < 0 || j < 0 || i >= map.length || j >= map[0].length) {
                //bufferCtx.fillStyle = "rgb(0, 0, 0)";
                //bufferCtx.fillRect((i-drawLeft)*32-offX, (j-drawTop)*32-offY, 32, 32);
            } else {
                if (map[i][j] == 0) {
                    spriteMapper.getImage('grass1').drawImage((i-drawLeft) * TILE_WIDTH - offX, (j-drawTop) * TILE_HEIGHT - offY);
                } else {
                    spriteMapper.getImage('dirt1').drawImage((i-drawLeft) * TILE_WIDTH - offX, (j-drawTop) * TILE_HEIGHT - offY);
                }
            }
        }
    }

    
    


    var monsterImage = textureMapper.getTexture('monster');
    if (monsterImage != null) {
        if (monster1.x >= drawLeft*TILE_WIDTH && monster1.x <= drawRight*TILE_WIDTH && monster1.y >= drawTop*TILE_HEIGHT && monster1.y <= drawBottom*TILE_HEIGHT) {
            bufferCtx.drawImage(monsterImage, monster1.x-(drawLeft*TILE_WIDTH)-offX, monster1.y-(drawTop*TILE_HEIGHT)-offY);
        }
        if (monster2.x >= drawLeft*TILE_WIDTH && monster2.x <= drawRight*TILE_WIDTH && monster2.y >= drawTop*TILE_HEIGHT && monster2.y <= drawBottom*TILE_HEIGHT) {
            bufferCtx.drawImage(monsterImage, monster2.x-(drawLeft*TILE_WIDTH)-offX, monster2.y-(drawTop*TILE_HEIGHT)-offY);
        }
    }    
    
    
    soldier.draw(drawLeft*TILE_WIDTH, drawRight*TILE_WIDTH, drawTop*TILE_HEIGHT, drawBottom*TILE_HEIGHT, offX, offY);
    pirate.draw(drawLeft*TILE_WIDTH, drawRight*TILE_WIDTH, drawTop*TILE_HEIGHT, drawBottom*TILE_HEIGHT, offX, offY);
    
    var heroImage = textureMapper.getTexture('hero');
    if (heroImage != null) {
        bufferCtx.drawImage(heroImage, player.x-(drawLeft*TILE_WIDTH)-offX, player.y-(drawTop*TILE_HEIGHT)-offY);
    }    

    
    // Score
    bufferCtx.fillStyle = "rgb(250, 250, 250)";
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