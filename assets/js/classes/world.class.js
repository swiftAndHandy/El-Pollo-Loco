class World {
    ctx = null;

    keyboard = new Keyboard();
    gamepad = new Gamepad();


    camera = {
        x: 0,
        y: 0,
        offset: 150,
        cutscenePlays: false,
    };

    framerate = {
        fps: 60,
        msPerFrame: 0,
        frame: 0,
    }

    time = {
        msNow: null,
        msPrev: window.performance.now(),
        msPassed: null,
        bufferTime: null,
        paused: false,
        preventPause: false,
    }

    audio = new Audioplayer();
    character = new Character();

    level = level1;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.framerate.msPerFrame = 1000 / this.framerate.fps;
        this.time.msPrev = window.performance.now();
        // setInterval(() => {
        //     console.log(this.framerate.frame);
        // }, 1000);
        this.draw();
    }


    /**
     * toggles pause, if the pause-button is not blocked.
     * @returns {boolean}
     */
    pause() {
        if (!this.time.preventPause && !this.camera.cutscenePlays) {
            this.time.paused = !this.time.paused;
            this.time.paused ? this.pauseAudio() : this.continueAudio();
        } else if (this.camera.cutscenePlays && !this.time.paused) {
            this.time.paused = true;
            this.pauseAudio();
        }

        return this.time.paused;
    }


    /**
     * pauses Audio on pause and some audio on cutscenes
     */
    pauseAudio() {
        if (!this.camera.cutscenePlays) {
            this.audio.currentlyPlayed.forEach(audioElement => {
                audioElement.pause();
            });
        } else {

        }
    }


    /**
     * continues the playback of audio-files. 
     */
    continueAudio() {
        this.audio.currentlyPlayed.forEach(audioElement => {
            audioElement.play();
        });
    }


    /**
     * during the game is pause, allow to end the pause by checking for inputs of those two methods
     */
    checkForEndOfPause() {
        const gamepadUsed = this.gamepad.checkInput();
        !gamepadUsed && this.keyboard.handlePauseMenu();
    }


    /**
     * get the current ms the window exists, to calculate frames based on this information.
     */
    setUpTime() {
        this.time.msNow = window.performance.now();
        this.time.msPassed = this.time.msNow - this.time.msPrev;
    }


    /**
     * sets the time for the last frame and updates the current frames number
     */
    updateTime() {
        this.time.bufferTime = this.time.msPassed % this.framerate.msPerFrame;
        this.time.msPrev = this.time.msNow - this.time.bufferTime;
        this.framerate.frame++;
    }


    requestFrame() {
        window.requestAnimationFrame(() => {
            this.draw();
        });
    }

    /**
     * updates the camera, based on the characters position.
     * @param {number} state - 1 updates the camera, 0 sets it back to normal.
     */
    updateCamera(state) {
        this.camera.x = -this.character.position.x;
        if (state === 1) {
            this.ctx.translate(this.camera.x + this.camera.offset, 0);
        } else if (state === 0) {
            this.ctx.translate(-this.camera.x - this.camera.offset, 0);
        }
    }


    /**
     * Draws the canvas and starts methods to handle inputs, if the game is not paused and no cutscene is shown.
     * @returns {undefined} - used to interrupt the draw method, if no frame-update is required
     */
    draw() {
        this.requestFrame();
        this.setUpTime();
        if (this.time.msPassed < this.framerate.msPerFrame) return;
        if (!this.time.paused && !this.camera.cutscenePlays) {
            this.updateTime();
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.drawWorld();
            this.getInputs();
            this.animateWorld();
        } else if (this.camera.cutscenePlays) {

        } else {
            this.checkForEndOfPause();
        }
    }


    /**
     * Gets the input of the InputDevice
     */
    getInputs() {
        const gamepadUsed = this.gamepad.checkInput();
        !gamepadUsed && this.keyboard.handleKeyboardInput();
    }


    /**
     * Draws various objects to the canvas after updating the camera position. 
     * Set the camera back after drawing.
     */
    drawWorld() {
        this.updateCamera(1);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.updateCamera(0);
    }

    /**
     * animates some objects of the world.
     * background objects are animated if  the character is moving.
     * otherwise there is no need to do this, so the performance is saved.
     */
    animateWorld() {
        this.animateObjects(this.level.clouds);
        this.animate(this.character);
        if (this.character.position.x + this.character.velocity.x > 0) {
            this.animateObjects(this.level.backgroundObjects);
        }
        this.animateObjects(this.level.enemies);

    }


    /**
     * Helpmethod to draw arrays on the canvas
     * @param {Array} object - the object-Array thats need to be drawn.
     */
    addObjectsToMap(object) {
        object.forEach(o => {
            this.addToMap(o);
        })
    }


    /**
     * @param {object} mo - a single mobile-object
     * @param {boolean} flip - true if flip should start, false if a existing flip needs to be stopped
     */
    flipImage(mo, flip) {
        if (mo.appearance.mirrored && flip) {
            this.ctx.save();
            this.ctx.translate(mo.appearance.width, 0);
            this.ctx.scale(-1, 1);
            mo.position.x *= -1;
        } else if (mo.appearance.mirrored && !flip) {
            mo.position.x *= - 1;
            this.ctx.restore();
        }
    }

    /**
     * Draws mo on canvas. If the object is mirrored, transform it with scale(-1, 1) and translate to object to keep it on the correct place.
     * @param {Object} mo - a single Object, e. g. BackgroundObject/Character/Enemies, that needs to be drawn on canvas.
     */
    addToMap(mo) {
        this.flipImage(mo, true);
        this.ctx.drawImage(mo.appearance.img, mo.position.x, mo.position.y, mo.appearance.width, mo.appearance.height);
        mo.drawHitbox(this.ctx);
        this.flipImage(mo, false);
    }


    /**
     * Help method for animate
     * @param {Array} object - contains various Objects that needs to be animated.
     */
    animateObjects(object) {
        object.forEach(o => {
            o.animate();
        });
    }

    /**
     * Help method to trigger the animate function of an movable Object.
     * @param {Object} target - a ClassObject, that needs to be animated.
     */
    animate(target) {
        target.animate();
    }


}