var Track = function(x, y) {
    this.x = x;
    this.y = y;
}

Track.prototype.draw = function(context, frame) {
    this.laneOpacity = 0.2;
    context.fillStyle="rgba(50,50,50,1)";
    context.fillRect(this.x, 62, 500, 2);
    context.fillRect(this.x, CANVAS_HEIGHT - 32, 500, 2);

    context.fillStyle="#cc0000";
    context.fillRect(this.x, 0, 2, CANVAS_HEIGHT);
    context.fillRect(this.x+98, 0, 2, CANVAS_HEIGHT);
    context.fillStyle="rgba(200, 0, 0," + this.laneOpacity + ")";
    context.fillRect(this.x+2, 0, 96, CANVAS_HEIGHT);

    context.fillStyle="#00cc00";
    context.fillRect(this.x+100, 0, 2, CANVAS_HEIGHT);
    context.fillRect(this.x+198, 0, 2, CANVAS_HEIGHT);
    context.fillStyle="rgba(0, 200, 0," + this.laneOpacity + ")";
    context.fillRect(this.x+102, 0, 96, CANVAS_HEIGHT);

    context.fillStyle="#0000cc";
    context.fillRect(this.x+200, 0, 2, CANVAS_HEIGHT);
    context.fillRect(this.x+298, 0, 2, CANVAS_HEIGHT);
    context.fillStyle="rgba(0, 0, 200," + this.laneOpacity + ")";
    context.fillRect(this.x+202, 0, 96, CANVAS_HEIGHT);

    context.fillStyle="#cccc00";
    context.fillRect(this.x+300, 0, 2, CANVAS_HEIGHT);
    context.fillRect(this.x+398, 0, 2, CANVAS_HEIGHT);
    context.fillStyle="rgba(200, 200, 0," + this.laneOpacity + ")";
    context.fillRect(this.x+302, 0, 96, CANVAS_HEIGHT);

    context.fillStyle="#00cccc";
    context.fillRect(this.x+400, 0, 2, CANVAS_HEIGHT);
    context.fillRect(this.x+498, 0, 2, CANVAS_HEIGHT);
    context.fillStyle="rgba(0, 200, 200," + this.laneOpacity + ")";
    context.fillRect(this.x+402, 0, 96, CANVAS_HEIGHT);
}