class World {
    ctx = null;
    gameOver = false;

    keyboard = new Keyboard();
    gamepad = new Gamepad();

    UIElements = new UIElements();

    VSIMAGE = {
        player: {
            image: new Image(),
            x: 0
        },
        boss: {
            image: new Image(),
            x: 0
        },
        vs: new Image(),
    }


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
    player = new Player();

    level = level1();

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.ctx.font = '36px UIElements'
        this.framerate.msPerFrame = 1000 / this.framerate.fps;
        this.time.msPrev = window.performance.now();
        this.VSIMAGE.vs.src = 'assets/img/9_intro_outro_screens/vs.png';
        this.VSIMAGE.player.image.src = 'assets/img/9_intro_outro_screens/player.png';
        this.VSIMAGE.boss.image.src = 'assets/img/9_intro_outro_screens/boss.png';
    }

    /**
     * 
     * @param {number} delay - ends the current world after this
     */
    static gameOver(delay = 100) {
        world.gameOver = true;
        setTimeout(() => {
            if (!audioMuted && !world.player.isDead && Level.getBoss().isDead) {
                world.player.sounds.win.play();
            } else if (!audioMuted && world.player.isDead && !Level.getBoss().isDead) {
                // world.player.sounds.lose.play();
            }
            resetGame();
        }, delay);
    }


    /**
     * toggles pause, if the pause-button is not blocked.
     * @returns {boolean}
     */
    pause() {
        if (!this.time.preventPause && !this.camera.cutscenePlays) {
            this.time.paused = !this.time.paused;
            if (!audioMuted) {
                this.time.paused ? Audioplayer.pauseAudio(this) : Audioplayer.continueAudio(this);
            }
        } else if (this.camera.cutscenePlays && !this.time.paused) {
            this.time.paused = true;
            Audioplayer.pauseAudio(this);
        }

        return this.time.paused;
    }


    /**
     * during the game is pause, allow to end the pause by checking for inputs of those two methods
     */
    checkForEndOfPause() {
        const gamepadUsed = this.gamepad.checkInput();
        if (!gamepadUsed) {
            this.keyboard.handlePauseMenu();
        }
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
        animationID = window.requestAnimationFrame(() => {
            this.draw();
        });
    }

    /**
     * updates the camera, based on the characters position.
     * @param {number} state - 1 updates the camera, 0 sets it back to normal.
     */
    updateCamera(state) {
        this.camera.x = -world.player.position.x;
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
        if (this.gameOver === false) {
            this.requestFrame();
        }
        this.setUpTime();
        if (this.time.msPassed < this.framerate.msPerFrame) return;
        if (!this.time.paused && !this.camera.cutscenePlays) {
            this.updateTime();
            this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            this.drawWorld();
            this.getInputs();
            this.animateWorld();
            this.checkCollisions();
        } else if (this.camera.cutscenePlays) {
            this.updateTime();
            this.drawCutscene();
            Audioplayer.fade('out', MUSIC.regular, 0);
        } else {
            this.checkForEndOfPause();
        }
    }

    drawCutscene() {
        const boss = Level.getBoss();
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.drawWorld();
        this.ctx.drawImage(this.VSIMAGE.vs, 20, 100);
        this.ctx.drawImage(this.VSIMAGE.player.image, this.VSIMAGE.player.x, -100);
        this.VSIMAGE.player.x += 3;
        this.ctx.drawImage(this.VSIMAGE.boss.image, this.VSIMAGE.boss.x, 300);
        this.VSIMAGE.boss.x -= 3;
        if (boss.position.x > 3100) {
            boss.setAppearanceTo('walking');
            boss.moveLeft();
            boss.position.x -= 0.4;
        } else {
            boss.setAppearanceTo('alerta');
            !audioMuted && Audioplayer.fade('in', MUSIC.boss, 0.2);
        }
        boss.animate();
    }

    /**
     * Checks for collisions, needs adjustments to allow check for coins and other stuff
     * Ignore Enemy-Collisons, when Boss is going to be dead to prevent double-kills.
     */
    checkCollisions() {
        Collisions.coinCollisions(this);
        Collisions.bottleCollisions(this);
        Level.getBoss().appearance.currentStyle !== 'dead' && Collisions.enemyCollisions(this);
        Collisions.throwableObjectCollision(this);
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
        this.addToMap(this.player);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles, 'violet');
        this.addObjectsToMap(this.level.throwableObjects, 'orange');
        this.UIElements.update();
        this.updateCamera(0);
    }

    /**
     * animates some objects of the world.
     * background objects are animated if  the character is moving.
     * otherwise there is no need to do this, so the performance is saved.
     */
    animateWorld() {
        this.animateObjects(this.level.clouds);
        this.animate(world.player);
        if (world.player.position.x + world.player.velocity.x > 0) {
            this.animateObjects(this.level.backgroundObjects);
        }
        this.animateObjects(this.level.enemies);
        this.animateObjects(this.level.coins);
        this.animateObjects(this.level.bottles);
        this.animateObjects(this.level.throwableObjects);

    }


    /**
     * Helpmethod to draw arrays on the canvas
     * @param {Array} object - the object-Array thats need to be drawn.
     */
    addObjectsToMap(object, color = undefined) {
        object.forEach(o => {
            this.addToMap(o, color);
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
            mo.position.x *= -1;
            this.ctx.restore();
        }
    }

    /**
     * Draws mo on canvas. If the object is mirrored, transform it with scale(-1, 1) and translate to object to keep it on the correct place.
     * @param {Object} mo - a single Object, e. g. BackgroundObject/Character/Enemies, that needs to be drawn on canvas.
     */
    addToMap(mo, color = undefined) {
        this.flipImage(mo, true);
        this.ctx.drawImage(mo.appearance.img, mo.position.x, mo.position.y, mo.appearance.width, mo.appearance.height);
        hitboxMode && mo.drawHitbox(this.ctx, color);
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