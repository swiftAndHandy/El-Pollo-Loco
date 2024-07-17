let canvas = null;
let world = null;
let gamepad = null;

function init() {
    canvas = document.getElementById('game-area');
    world = new World(canvas);
}