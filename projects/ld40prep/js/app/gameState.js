var GameState = function() {
    this.currentGameType = "none";
    this.hasEnded = false;
}

GameState.prototype.init = function(gameType) {
    this.currentGameType = gameType;
    this.hasEnded = false;
}

GameState.prototype.endGame = function(callback) {
    if (!this.hasEnded) {
        this.hasEnded = true;

        if (callback) {
            callback();
        }
    }
}