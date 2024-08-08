class MovableObject extends Physics {
    position = {
        x: null,
        y: null,
        ground: 0,
        peak: 0,
        bouncingPeak: 0,
    }

    velocity = {
        x: 0,
        xMax: 0,
        y: 0,
        yMax: 0,
        jumpSpeed: 0,
    }

    acceleration = {
        x: null,
        y: null,
        isFalling: false,
        isJumping: false,
    }

    appearance = {
        img: new Image(),
        currentImg: 0,
        currentStyle: 'walking',
        mirrored: false,
        width: null,
        height: null,
        walking: [],
    }

    hitboxes = [];


    constructor(width, height) {
        super();
        this.appearance.width = width;
        this.appearance.height = height;
    }

    drawHitbox(ctx) {
        if (this instanceof Player || this instanceof Enemy) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            this.hitboxes.forEach(hitbox => {
                ctx.rect(this.position.x + hitbox.x,
                    this.position.y + hitbox.y,
                    this.appearance.width - hitbox.width,
                    this.appearance.height - hitbox.height);
            });
            ctx.stroke();
        }
    }

    loadImage(path) {
        this.appearance.img.src = path;
    }


    cacheImage(targetAnimation, arr) {
        arr.forEach(frame => {
            const img = new Image();
            img.src = frame;
            this.appearance[targetAnimation].push(img);
        });
    };


    /**
     * checks if the current style is the targetStyle and the world is not paused.
     * @param {string} targetSound - string that contains the sound, that is required in the current situation.
     * @returns {boolean} - true, if the sound should become played, otherwise false
     */
    requiredSound(targetSound) {
        return this.appearance.currentStyle === `${targetSound}` && !world.time.paused;
    }

    /**
     * starts a specific audio, if it's not played allready. pushes it to an array,
     * that contains all currently played sounds, to use them when world gets paused.
     * @param {string} sound - name of the required sound
     */
    startSFX(sound) {
        try {
            this.sounds[sound].paused && world.audio.currentlyPlayed.push(this.sounds[sound]);
            this.sounds[sound].play();
        } catch (error) {
            sound.play();
            world.audio.currentlyPlayed.push(sound);
        }
    }

    /**
     * stops the specific sound and removes it from world.audio[].
     * @param {string} sound - name of the sound-type, that should be stopped.
     */
    stopSFX(sound) {
        const indexToRemove = world.audio.currentlyPlayed.indexOf(this.sounds[sound]);
        indexToRemove >= 0 && world.audio.currentlyPlayed.splice(indexToRemove, 1);
        this.sounds[sound].pause();
    }

    /**
     * required methods, if the target is moving to the left side.
     */
    moveLeft() {
        if (!this.isDead) {
            this.getCurrentVelocityX();
            this.position.x -= this.velocity.x;
        }
        return this;
    }

    /**
     * required methods, if the target is moving to the right side.
     */
    moveRight() {
        if (!this.isDead) {
            this.getCurrentVelocityX();
            this.position.x += this.velocity.x;
        }
        return this;
    }


    /**
    * Allows die MO to jump.
    */
    jump() {
        if (!this.acceleration.isJumping && !this.isDead) {
            this.setAppearanceTo('startJump', 0);
            world.audio.playRandomVariant(this.sounds.jumping, this);
        }
    }


    /**
     * @returns {boolean} - true, if the current frame of the animation is the last one.
     */
    lastFrameOfAnimation() {
        return this.appearance.currentImg % this.appearance[this.appearance.currentStyle].length === 0;
    }

    /**
     * Calculates the mobjects max speed on y axis. Try is, if the mo is a character, otherwise use catch.
     * @returns {number}
     */
    getMaxSpeedX() {
        if (this instanceof Player) {
            return this.abilities.run ? this.velocity.xMax * this.abilities.runBonusX : this.velocity.xMax;
        }
        return this.velocity.xMax;
    }

    /**
     * Calculates the mobjects max speed on y axis. Try is, if the mo is a character, otherwise use catch.
     * @returns {number}
     */
    getMaxSpeedY() {
        if (this instanceof Player) {
            return this.abilities.run ? this.velocity.yMax * this.abilities.runBonusY : this.velocity.yMax;
        }
        return this.velocity.yMax;
    }

    /**
     * checks conditions and only allows an image update, when the target animation speed is fitted.
     * If the current MO has the running ability and does use it while walking, speed up the animation.
     * @returns {boolean} 
     */
    frameUpdateRequired() {
        if (this instanceof Player) {
            if (this.abilities.run && this.appearance.currentStyle === 'walking') {
                return world.framerate.frame % (world.framerate.fps / 10) == 0;
            } else {
                return world.framerate.frame % (world.framerate.fps / 7.5) == 0;
            }
        } else {
            return world.framerate.frame % (world.framerate.fps / 7.5) == 0;
        }
    }

    /**
     * @param {string} style - style that should be set for the movable object
     * @param {number} atFrame - can be any valid number of the array that is related to style. if it's not set, no special frame
     *                         is required. In this case, the counting is going straight forward.
     */
    setAppearanceTo(style, atFrame = -1) {
        this.appearance.currentStyle = style;
        this.appearance.currentImg = atFrame >= 0 ? atFrame : this.appearance.currentImg;
    }

    /**
     * Updates the image to the required one, for the target animation
     * @param {string} animationType containing this.appearance.currentStyle
     */
    playAnimation(animationType) {
        const animationFrame = this.appearance.currentImg % this.appearance[animationType].length;
        this.appearance.img = this.appearance[animationType][animationFrame];
        if (this.frameUpdateRequired()) {
            this.appearance.currentImg++;
            if (this instanceof Player) {
                this.endSpecialAnimations();
            }
        }
    }
}