var Enemies = function(max, maxGear) {
    this.maxGear = maxGear || 8;
    this.maxEnemies = max;

    this.enemies = [];
}

Enemies.prototype.spawn = function(numLanes) {
    if (this.getNumEnemies() < this.maxEnemies) {
        var lane = getRandomInt(1, numLanes);
        var gear = getRandomInt(3, this.maxGear);
        var speed = 6;

        var enemy = this.addEnemy(numLanes, lane, gear, speed, -100);

        var rand = getRandomInt(1, 100);

        if (rand > 35) {
            this.addEnemy(numLanes, lane, gear, speed, enemy.y - 60);
        }

        if (rand > 65) {
            this.addEnemy(numLanes, lane, gear, speed, enemy.y - 120);
        }
    }
}

Enemies.prototype.addEnemy = function(numLanes, lane, gear, speed, y) {
    var lastYForLane = this.getLastYForLane(lane);

    if (y > lastYForLane - 60) {
        y = lastYForLane + y;
    }

    var enemy = new Enemy(numLanes, lane, gear, speed, y);
    this.enemies[this.enemies.length] = enemy;

    return enemy;
}

Enemies.prototype.getLastYForLane = function(lane) {
    var self = this;
    var lastY = 0;

    self.enemies.forEach(function(enemy, index) {
        if (enemy.lane == lane && enemy.y < lastY) {
            lastY = enemy.y;
        }
    });

    return lastY;
}


Enemies.prototype.getNumEnemies = function() {
    return this.enemies.length;
}

Enemies.prototype.move = function(delta, player) {
    var self = this;

    var normalDelta = 1000 / 60;
    var timeDelta = delta / normalDelta;

    var realIndex = 0;
    self.enemies.forEach(function(enemy, index) {
        enemy.move(timeDelta, player);

        if (player.hasBlackHoleStarted) {
            var offset = 20;
            if (enemy.y+48-offset > player.y && player.y + 48-offset > enemy.y) {
                if (enemy.x+48-offset > player.x && player.x + 48-offset > enemy.x) {
                    self.enemies.splice(realIndex, 1);
                    realIndex --;
                }
            }
        } else {
            if (enemy.y > CANVAS_HEIGHT + 100) {
                self.enemies.splice(realIndex, 1);
                realIndex --;
            }
        }

        realIndex ++;
    });
}

Enemies.prototype.checkForCollision = function(player, points, messager) {
    var self = this;
    var realIndex = 0;
    var isDead = false;
    self.enemies.forEach(function(enemy, index) {
        if (enemy.lane == player.lane) {
            var offset = 4;
            if (enemy.y+48-offset > player.y && player.y + 48-offset > enemy.y) {
                if (enemy.gear == player.gear) {
                    self.enemies.splice(realIndex, 1);
                    realIndex --;
                    var numCollected = player.collected.get(enemy.gear);
                    player.collected.set(enemy.gear, numCollected + 1);

                    var numNeededToShift = player.neededToShift.get(enemy.gear);
                    if (numNeededToShift > 0) {
                        numNeededToShift --;
                        player.neededToShift.set(enemy.gear, numNeededToShift);
                    }

                    if (numNeededToShift == 0) {
                        if (self.maxGear < 8) {
                            self.maxGear ++;
                        }
                        if (player.maxGear < 8) {
                            player.maxGear ++;
                        }
                        player.neededToShift.set(enemy.gear, numNeededToShift - 1);
                    }

                    var enemyPoints;
                    if (enemy.gear == 3) {
                        enemyPoints = 5;
                    } else if (enemy.gear == 4) {
                        enemyPoints = 20;
                    } else if (enemy.gear == 5) {
                        enemyPoints = 50;
                    } else if (enemy.gear == 6) {
                        enemyPoints = 100;
                    } else if (enemy.gear == 7) {
                        enemyPoints = 250;
                    } else if (enemy.gear == 8) {
                        enemyPoints = 750;
                    }

                    points.spawn(player.x, player.y, enemyPoints);
                    messager.spawn(230, 35, "NEW SHIFT AVAILABLE!", 60);
                    soundManager.play("collect");
                } else {
                    soundManager.play("explosion");
                    isDead = true;
                }
            }
        }

        realIndex ++;
    });

    return isDead;
}

Enemies.prototype.draw = function(context, frame) {
    this.enemies.forEach(function(enemy) {
        enemy.draw(context, frame);
    });
}

function getRandomInt(min, max) {
    max += 1;
    return Math.floor(Math.random() * (max - min)) + min;
}