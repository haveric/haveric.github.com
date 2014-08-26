var Sky = function() {
    
}

Sky.prototype.draw = function(frame) {
    context.fillStyle="#000055";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.beginPath();
    context.strokeStyle="#115511";
    context.lineWidth = 1;
    context.fillStyle="#115511";
    context.arc(canvas.width/2, 4500 + canvas.height *2/3, 4500, Math.PI, 2*Math.PI);
    context.stroke();
    context.fill();
}