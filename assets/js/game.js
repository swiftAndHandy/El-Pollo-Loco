let canvas = null;
let world = null;

function init() {
    canvas = document.getElementById('game-area');
    world = new World(canvas);
}