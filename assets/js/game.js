let canvas = null;
let canvasHeight = 480; // Base 480
let canvasWidth = 720; // Base 720
let world = null;
let gamepad = null;
let animationID = null;
let hitboxMode = false;
let audioMuted = false;

function init() {
    canvas = document.getElementById('game-area');
    canvas.width = canvasWidth; canvas.height = canvasHeight;
    world = new World(canvas);
    setupMenu();
}

function setupMenu() {
    document.getElementById('pause').addEventListener('click', (event) => {
        world.pause();
    });

    document.getElementById('audio').addEventListener('click', (event) => {
        audioMuted = !audioMuted;
        document.getElementById('audio').classList.toggle('muted');
        
    });

    document.getElementById('fullscreen').addEventListener('click', (event) => {
        if (!document.fullscreenElement) {
            document.getElementById('game').requestFullscreen();
            // canvas.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
}