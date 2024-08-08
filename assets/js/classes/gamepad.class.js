class Gamepad extends InputDevice {

    controllerIndex = null;
    directionBuffer = null;
    gamepad = null;

    constructor() {
        super();
        window.addEventListener('gamepadconnected', (event) => {
            gamepad = event.gamepad; this.gamepad = event.gamepad;
            this.controllerIndex = gamepad.index;
            console.log('connected');
        });

        window.addEventListener('gamepaddisconnected', (event) => {
            this.controllerIndex = null;
            console.log('disconnected', event);
        });
    }

    /**
     * 
     * @returns {boolean} - true if a controller is active, otherwise false
     */
    checkInput() {
        if (this.controllerIndex != null) {
            gamepad = navigator.getGamepads()[this.controllerIndex];
            if (gamepad && !world.time.paused) {
                this.handleControllerInput(gamepad.buttons, gamepad.axes);
                this.setPausePrevention();
            } else if (gamepad && world.time.paused) {
                gamepad.buttons[9].pressed && world.pause();
                this.setPausePrevention();
            }
            return true;
        } else {
            return false;
        }
    }

    setPausePrevention() {
        world.time.preventPause = !gamepad.buttons[9].pressed ? false : true;
    }

    /**
     * If character isn't walking left/right don't stop the movement immediately, but start the idle Animation,
     * Update Players Position by using velocity.
     */
    noDirectionInput() {
        if (this.unallowedLatency()) {
            world.player.stopMovement();
        }
        if (world.player.appearance.currentStyle === 'walking') {
            world.player.startIdle();
            world.player.setAppearanceTo('idle', 0);
        };
        if (!world.player.appearance.mirrored) {
            world.player.position.x += world.player.velocity.x;
        } else if (world.player.appearance.mirrored) {
            world.player.position.x -= world.player.velocity.x;
        }
    }

    triggerRumble(delay, duration, weakMagnitude, strongMagnitude) {
        gamepad.vibrationActuator.playEffect('dual-rumble', {
            startDelay: delay,
            duration: duration,
            weakMagnitude: weakMagnitude,
            strongMagnitude: strongMagnitude
        });
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

        buttons[9].pressed && world.pause();

        this.handleJumping(buttons, leftStickUpDown);
        this.handleRunning(buttons);

        this.handleWalking(leftStickLeftRight, buttons);
    }

    /**
     * Let the character jump by pressing the jump button. When the character has jumped,
     * block rejump until the button got released.
     * @param {Array} buttons - an Array that contains all buttons of the gamepad.
     * @param {Number} leftStickUpDown - Position of the left Controll stick on up/down-Axis
     */
    handleJumping(buttons, leftStickUpDown) {
        if (buttons[0].pressed && !this.buttonsWithCooldown.jump) {
            world.player.jump();
            this.buttonsWithCooldown.jump = true;
        } else if (leftStickUpDown >= -0.7 && !buttons[0].pressed) {
            this.buttonsWithCooldown.jump = false;
        }
    }

    /**
     * 
     * @param {Array} buttons - an Array that contains all buttons of the gamepad.
     */
    handleRunning(buttons) {
        if (buttons[2].pressed) {
            world.player.abilities.run = true;
        } else {
            world.player.abilities.run = false;
        }
    }

    handleWalking(leftStickLeftRight, buttons) {
        if (leftStickLeftRight < -0.5 || buttons[14].pressed) {
            this.setDirectionBuffer();
            const character = world.player.moveLeft();
            this.noImportantStyle() && character.setAppearanceTo('walking');
            character.appearance.mirrored = true;
        } else if (leftStickLeftRight > 0.5 || buttons[15].pressed) {
            this.setDirectionBuffer();
            const character = world.player.moveRight();
            this.noImportantStyle() && character.setAppearanceTo('walking');
            character.appearance.mirrored = false;
        } else {
            world.player.getCurrentVelocityX();
            this.noDirectionInput();
        }
    }

}