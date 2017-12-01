var CanvasState = function(newWidth, newHeight) {
    this.width = newWidth || 800;
    this.height = newHeight || 600;

    this.canvas = document.getElementById("gameCanvas");
    this.context = this.canvas.getContext('2d');

    this.oldFillStyle = "none";

    this.init();
}

CanvasState.prototype.init = function() {
    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("height", this.height);
}

CanvasState.prototype.setFillStyle = function(newFillStyle) {
    if (newFillStyle != this.oldFillStyle) {
        this.context.fillStyle = newFillStyle;
        this.oldFillStyle = newFillStyle;
    }
}

CanvasState.prototype.clear = function() {
    this.setFillStyle("#000000");
    this.context.fillRect(0, 0, this.width, this.height);
}