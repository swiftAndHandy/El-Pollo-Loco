class Gamepad {

    controllerIndex = null;
    directionBuffer = null;

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

    checkInput() {
        if (this.controllerIndex != null) {
            const gamepad = navigator.getGamepads()[this.controllerIndex];
            if (gamepad) {
                this.handleControllerInput(gamepad.buttons, gamepad.axes);
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     * If character isn't walking left/right don't stop the movement immediately, but start the idle Animation,
     * Maybe needs to be global if further animations are added and 
     */
    noDirectionInput() {
        if (this.unallowedLatency()) {
            world.character.stopMovement();
        }
        if (world.character.appearance.currentStyle === 'walking') {
            world.character.startIdle();
            world.character.appearance.currentStyle = 'idle'
        };
    }

    unallowedLatency() {
        return world.framerate.frame - this.directionBuffer >= world.framerate.fps / 10;
    }

    setDirectionBuffer() {
        this.directionBuffer = world.framerate.frame;
        return true;
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

        this.handleWalking(buttons, axes);
        this.handleJumping(buttons);

        if (leftStickUpDown < -0.7) {
            world.character.jump();
        }


        if (leftStickLeftRight < -0.5) {
            this.directionBuffer = world.framerate.frame;
            this.setDirectionBuffer();
            world.character.moveLeft();
        } else if (leftStickLeftRight > 0.5) {
            this.setDirectionBuffer();
            world.character.moveRight();
        } else {
            this.noDirectionInput();
        }
    }

    handleWalking(buttons, leftStickUpDown) {
        if (buttons[0]['pressed']) {
            world.character.jump();
        } else if (leftStickUpDown >= -0.7) {
            // player.jumps.cooldown = false;
        }
    }

    handleJumping(buttons) {
        if (buttons[2].pressed) {
            world.character.abilities.run = true;
        } else {
            world.character.abilities.run = false;
        }
    }

}