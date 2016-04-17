var Messager = function() {
    this.messages = [];
}

Messager.prototype.spawn = function(x, y, message, life) {
    var message = new Message(x, y, message, life);
    this.messages[this.messages.length] = message;
}

Messager.prototype.watch = function() {
    var self = this;
    var realIndex = 0;
    self.messages.forEach(function(message) {
        message.life --;

        if (message.life <= 0) {
            self.messages.splice(realIndex, 1);
            realIndex --;
        }

        realIndex ++;
    });
}

Messager.prototype.draw = function(context, frame) {
    this.messages.forEach(function(message) {
        message.draw(context, frame);
    });
}

var Message = function(x, y, message, life) {
    this.x = x;
    this.y = y;
    this.message = message;
    this.life = life;
}

Message.prototype.draw = function(context, frame) {
    context.fillStyle="#00cc00";
    context.font = '24px "Lucida Console", Monaco, monospace';
    context.fillText(this.message, this.x, this.y);
}