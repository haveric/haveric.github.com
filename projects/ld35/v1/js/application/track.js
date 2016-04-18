var Track = function(numLanes) {
    this.x = 150;
    this.y = 0;
    this.colors = [];
    this.numLanes = numLanes;
}

Track.prototype.draw = function(context, frame) {
    this.laneOpacity = 0.2;
    this.borderOpacity = .7;

    context.fillStyle="rgba(50,50,50,1)";

    if (this.numLanes == 3) {
        context.fillRect(this.x+100, 62, this.numLanes*100, 2);
        context.fillRect(this.x+100, CANVAS_HEIGHT - 32, this.numLanes*100, 2);
    } else {
        context.fillRect(this.x, 62, this.numLanes*100, 2);
        context.fillRect(this.x, CANVAS_HEIGHT - 32, this.numLanes*100, 2);
    }

    if (this.numLanes == 5) {
        context.fillStyle="rgba(200, 0, 0, " + this.borderOpacity + ")";
        context.fillRect(this.x, 0, 2, CANVAS_HEIGHT);
        context.fillRect(this.x+98, 0, 2, CANVAS_HEIGHT);
        context.fillStyle="rgba(200, 0, 0," + this.laneOpacity + ")";
        context.fillRect(this.x+2, 0, 96, CANVAS_HEIGHT);
    }
    context.fillStyle="rgba(0, 200, 0, " + this.borderOpacity + ")";
    context.fillRect(this.x+100, 0, 2, CANVAS_HEIGHT);
    context.fillRect(this.x+198, 0, 2, CANVAS_HEIGHT);
    context.fillStyle="rgba(0, 200, 0," + this.laneOpacity + ")";
    context.fillRect(this.x+102, 0, 96, CANVAS_HEIGHT);

    context.fillStyle="rgba(0, 0, 200, " + this.borderOpacity + ")";
    context.fillRect(this.x+200, 0, 2, CANVAS_HEIGHT);
    context.fillRect(this.x+298, 0, 2, CANVAS_HEIGHT);
    context.fillStyle="rgba(0, 0, 200," + this.laneOpacity + ")";
    context.fillRect(this.x+202, 0, 96, CANVAS_HEIGHT);

    context.fillStyle="rgba(200, 200, 0, " + this.borderOpacity + ")";
    context.fillRect(this.x+300, 0, 2, CANVAS_HEIGHT);
    context.fillRect(this.x+398, 0, 2, CANVAS_HEIGHT);
    context.fillStyle="rgba(200, 200, 0," + this.laneOpacity + ")";
    context.fillRect(this.x+302, 0, 96, CANVAS_HEIGHT);
    if (this.numLanes == 5) {
        context.fillStyle="#00cccc";
        context.fillStyle="rgba(0, 200, 200, " + this.borderOpacity + ")";
        context.fillRect(this.x+400, 0, 2, CANVAS_HEIGHT);
        context.fillRect(this.x+498, 0, 2, CANVAS_HEIGHT);
        context.fillStyle="rgba(0, 200, 200," + this.laneOpacity + ")";
        context.fillRect(this.x+402, 0, 96, CANVAS_HEIGHT);
    }
}