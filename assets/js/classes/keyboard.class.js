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

        this.addTouchControls();
    }


    addTouchControls() {
        this.startTouchcontrol();
        this.endTouchcontrol();
    }

    startTouchcontrol() {
        document.getElementById('move-left').addEventListener('touchstart', (event) => {
            this.addDirection('KeyA');
        });
        document.getElementById('move-right').addEventListener('touchstart', (event) => {
            this.addDirection('KeyD');
        });
        document.getElementById('jump').addEventListener('touchstart', (event) => {
            this.keys.space = true;
        });
        document.getElementById('throw').addEventListener('touchstart', (event) => {
            this.keys.enter = true;
        });
        document.getElementById('run').addEventListener('touchstart', (event) => {
            this.keys.shift = true;
        });
    }

    endTouchcontrol() {
        document.getElementById('move-left').addEventListener('touchend', (event) => {
            this.removeDirection('KeyA');
        });
        document.getElementById('move-right').addEventListener('touchend', (event) => {
            this.removeDirection('KeyD');
        });
        document.getElementById('jump').addEventListener('touchend', (event) => {
            this.keys.space = false;
        });
        document.getElementById('throw').addEventListener('touchend', (event) => {
            this.keys.enter = false;
        });
        document.getElementById('run').addEventListener('touchend', (event) => {
            this.keys.shift = false;
        });
    }


    setPausePrevention() {
        world.time.preventPause = !this.Keyboard.keys.p ? false : true;
    }

    addDirection(direction) {
        if (this.keys.direction.indexOf(direction) === -1) {
            this.keys.direction.push(direction);
        }
    }

    removeDirection(direction) {
        let index = this.keys.direction.indexOf(direction);
        this.keys.direction.splice(index, 1);
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
            this.addDirection(event.code);
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
            this.removeDirection(event.code);
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