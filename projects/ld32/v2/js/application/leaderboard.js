var Leaderboard = function() {
    this.scores = [{
        {
            name: "AAA",
            score: 100000
        },
        {
            name: "AAA",
            score: 90000
        },
        {
            name: "AAA",
            score: 80000
        },
        {
            name: "AAA",
            score: 70000
        },
        {
            name: "AAA",
            score: 60000
        },
        {
            name: "AAA",
            score: 50000
        },
        {
            name: "AAA",
            score: 40000
        },
        {
            name: "AAA",
            score: 30000
        },
        {
            name: "AAA",
            score: 20000
        },
        {
            name: "AAA",
            score: 10000
        }
    }];

    this.loadOrStore();
}

Leaderboard.prototype.loadOrStore = function() {
    try {
        if (localStorage['scores']) {
            this.scores = JSON.parse(localStorage['scores']);
        } else {
            localStorage['scores'] = JSON.stringify(this.scores);
        }
    catch (e) { }
}

Leaderboard.prototype.store = function() {
    localStorage['scores'] = JSON.stringify(this.scores);
}

Leaderboard.prototype.isHighScore = function(newScore) {
    var highScore = false;

    for (var i = 0; i < this.scores.length; i++) {
        var score = this.scores[i].score;
        if (newScore > score) {
            highScore = true;
            break;
        }
    }

    return highScore;
}

Leaderboard.prototype.addScore = function(name, score) {
    for (var i = 0; i < this.scores.length; i++) {
        var score = this.scores[i].score;

        if (newScore > score) {
            this.scores.splice(i, 0, {"name": name, "score": score});
            this.scores.pop();
            this.store();

            break;
        }
    }
}
