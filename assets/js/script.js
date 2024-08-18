let controlIndex = 0;
const controls = {
    type: [
        'Touch Controls',
        'Keyboard Controls',
        'Gamepad Controls',
    ],
    move: [
        './assets/img/controls/move_left.png',
        './assets/img/controls/move_right.png',
        './assets/img/controls/a-button.png',
        './assets/img/controls/d-button.png',
        './assets/img/controls/move_left.png',
        './assets/img/controls/move_right.png',
    ],
    jump: [
        './assets/img/controls/jump.png',
        './assets/img/controls/space.png',
        './assets/img/controls/b-button.png',
    ],
    throw: [
        './assets/img/controls/throw.png',
        './assets/img/controls/enterkey.png',
        './assets/img/controls/x-button.png',
    ],
    run: [
        './assets/img/controls/run.png',
        './assets/img/controls/shift.png',
        './assets/img/controls/y-button.png',
    ],
    pause: [
        './assets/img/controls/pause.png',
        './assets/img/controls/p-key.png',
        './assets/img/controls/plus-button.png',
    ],
}

function previousControls() {
    controlIndex--;
    if (controlIndex < 0) {
        controlIndex = 2;
    }
    updateControls();
}

function nextControls() {
    controlIndex++;
    if (controlIndex >= 3) {
        controlIndex = 0;
    }
    updateControls();
}

function updateControls() {
    document.getElementById('control-type').innerText = controls.type[controlIndex];
    document.getElementById('manual-image-moveleft').src = controls.move[controlIndex * 2];
    document.getElementById('manual-image-moveright').src = controls.move[controlIndex * 2 + 1];
    document.getElementById('manual-image-jump').src = controls.jump[controlIndex];
    document.getElementById('manual-image-throw').src = controls.throw[controlIndex];
    document.getElementById('manual-image-run').src = controls.run[controlIndex];
    const pauseButton = document.getElementById('pause-button-two');
    if (pauseButton && controlIndex !== 0) {
        pauseButton.src = controls.pause[controlIndex];
    } else if (controlIndex !== 0) {
        updatePauseButton();
    } else if (pauseButton) {
        pauseButton.remove();
    }

}

function updatePauseButton() {
    document.getElementById('manual-list-pause').insertAdjacentHTML('beforeend', `
        <img draggable="false" src="${controls.pause[controlIndex]}" class="manual__icon"
        alt="pause" id="pause-button-two">
        `);
}

/**
 * Prevent Context-Menu
 */

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[block-context]').forEach(element => {
        if (element.getAttribute('block-context') === 'true') {
            element.addEventListener('contextmenu', function (event) {
                event.preventDefault();
            }, false);
        }
    })
})