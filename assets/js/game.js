let canvas = null;
let canvasHeight = 480; // Base 480
let canvasWidth = 720; // Base 720
let world = null;
let gamepad = null;

function init() {
    canvas = document.getElementById('game-area');
    canvas.width = canvasWidth; canvas.height = canvasHeight;
    world = new World(canvas);
}