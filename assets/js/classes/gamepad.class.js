class Gamepad {

    controllerIndex = null;

    constructor() {
        window.addEventListener('gamepadconnected', (event) => {
            const gamepad = event.gamepad;
            this.controllerIndex = gamepad.index;
            console.log('connected');
        });

        window.addEventListener('gamepaddisconnected', (event) => {
            this.controllerIndex = null;
            console.log('disconnected', event);
        });
    }

    checkGamepad() {
        if (this.controllerIndex != null) {
            const gamepad = navigator.getGamepads()[this.controllerIndex];
            gamepad && this.handleControllerInput(gamepad.buttons, gamepad.axes);
        }
    }


    /** 
     * Switch-Pro Controller-Buttons:
     * 
     * 0 = B-Button, 1 = A-Button
     * 2 = Y-Button, 3 = X-Button
     * 4 = L-Button, 5 = R-Button
     * 6 = ZL-Button, 7 = ZR-Button
     * 8 = MINUS-Button, 9 = PLUS-Button
     * 10 = LS-Button, 11 = RS-Button
     * 12 = D-Pad UP, 13 = D-Pad DOWN
     * 14 = D-Pad LEFT, 15 = D-Pad RIGHT
     * 16 = Home-Button, 17 = Capture-Button
     * 
     * Left-Stick: axes[0] + axes[1]
     * Right-Stick: axes[2] + axes[3]
     * 
     * @param {Array} buttons - An Array of all Controller-Buttons, that includes following information: pressed (bool), touched (bool), value (int)
     * * @param {Array} axes - and right- ([2] + [3]) controll-stick
     */
    handleControllerInput(buttons, axes) {
        const leftStickLeftRight = axes[0];
        const leftStickUpDown = axes[1];

        if (buttons[0]['pressed']) {
            world.character.jump();
        } else if (leftStickUpDown >= -0.7) {
            // player.jumps.cooldown = false;
        }

        if (leftStickUpDown < -0.7) {
            world.character.jump();
        }


        if (leftStickLeftRight < -0.5) {
            world.character.moveLeft();
        } else if (leftStickLeftRight > 0.5) {
            world.character.moveRight();
        } else {
        }
    }

}