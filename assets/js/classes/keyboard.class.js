class Keyboard extends InputDevice {

    keys = {
        direction: [],
        shift: false,
        enter: false,
        space: false,
        esc: false,
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
        world.time.preventPause = !this.Keyboard.keys.esc ? false : true;
    }

    /**
     * 
     * @param {KeyboardEvent} event 
     */
    setInput(event) {
        if (event.code === 'Escape') {
            this.keys.esc = true;
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
    }

    removeInput(event) {
        if (event.code === 'Escape') {
            this.keys.esc = false;
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
    }

    handleKeyboardInput(gamepadUsed) {
        if (!gamepadUsed) {
            this.handlePauseMenu();

            if (this.keys.direction.at(-1) === 'KeyA') {
                const character = world.character.moveLeft();
                this.noImportantStyle() && character.setAppearanceTo('walking');
                character.appearance.mirrored = true;
            } else if (this.keys.direction.at(-1) === 'KeyD') {
                const character = world.character.moveRight();
                this.noImportantStyle() && character.setAppearanceTo('walking');
                character.appearance.mirrored = false;
            } else {
                if (world.gamepad.unallowedLatency()) {
                    world.character.stopMovement();
                }
            }

            world.character.abilities.run = this.keys.shift ? true : false;

            this.handeJumping();
        }
    }

    setPausePrevention() {
        world.time.preventPause = !this.keys.esc ? false : true;
    }


    /**
     * Pauses/Unpauses the Game by Pressing ESC
     */
    handlePauseMenu() {
        if (this.keys.esc) {
            if (!world.time.preventPause) {
                world.pause();
                this.setPausePrevention();
            }
        } else {
            this.setPausePrevention();
        }
    }

    handeJumping() {
        if (this.keys.space && !this.buttonsWithCooldown.jump) {
            world.character.jump(); this.buttonsWithCooldown.jump = true;
        }
    }
}