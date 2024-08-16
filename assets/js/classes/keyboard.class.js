class Keyboard extends InputDevice {

    keys = {
        direction: [],
        shift: false,
        enter: false,
        space: false,
        p: false,
        enter: false,
    }


    constructor() {
        super();
        document.addEventListener('keydown', (event) => {
            this.setInput(event);
        });

        document.addEventListener('keyup', (event) => {
            this.removeInput(event);
        });
    }

    setPausePrevention() {
        world.time.preventPause = !this.Keyboard.keys.p ? false : true;
    }

    /**
     * 
     * @param {KeyboardEvent} event 
     */
    setInput(event) {
        if (event.code === 'KeyP') {
            this.keys.p = true;
        }

        if (event.code === 'KeyA' || event.code === 'KeyD') {
            if (this.keys.direction.indexOf(event.code) === -1) {
                this.keys.direction.push(event.code);
            }
        }

        if (event.key === 'Shift') {
            this.keys.shift = true;
        }

        if (event.code === 'Space') {
            this.keys.space = true;
        }

        if (event.code === 'Enter') {
            this.keys.enter = true;
        }
        
    }

    removeInput(event) {
        if (event.code === 'KeyP') {
            this.keys.p = false;
        }

        if (event.code === 'KeyA' || event.code === 'KeyD') {
            let index = this.keys.direction.indexOf(event.code);
            this.keys.direction.splice(index, 1);
        }

        if (event.key === 'Shift') {
            this.keys.shift = false;
        }

        if (event.code === 'Space') {
            this.keys.space = false;
        }

        if (event.code === 'Enter') {
            this.keys.enter = false;
        }
    }

    handleKeyboardInput(gamepadUsed) {
        if (!gamepadUsed) {
            this.handlePauseMenu();

            if (this.keys.direction.at(-1) === 'KeyA') {
                const player = world.player.moveLeft();
                this.noImportantStyle() && player.setAppearanceTo('walking');
                player.appearance.mirrored = true;
            } else if (this.keys.direction.at(-1) === 'KeyD') {
                const player = world.player.moveRight();
                this.noImportantStyle() && player.setAppearanceTo('walking');
                player.appearance.mirrored = false;
            } else {
                if (world.gamepad.unallowedLatency()) {
                    world.player.stopMovement();
                }
            }

            world.player.abilities.run = this.keys.shift ? true : false;

            this.handleJumping();
            this.handleThrowing();
        }
    }

    setPausePrevention() {
        world.time.preventPause = !this.keys.p ? false : true;
    }


    /**
     * Pauses/Unpauses the Game by Pressing P
     */
    handlePauseMenu() {
        if (this.keys.p) {
            if (!world.time.preventPause) {
                world.pause();
                this.setPausePrevention();
            }
        } else {
            this.setPausePrevention();
        }
    }

    handleJumping() {
        if (this.keys.space && !this.buttonsWithCooldown.jump) {
            world.player.jump(); this.buttonsWithCooldown.jump = true;
        }
    }

    handleThrowing() {
        if (this.keys.enter && !this.buttonsWithCooldown.throw) {
            this.buttonsWithCooldown.throw = true;
            ThrowableObject.throwBottle();
        } else if (!this.keys.enter) {
            this.buttonsWithCooldown.throw = false;
        }
    }
}