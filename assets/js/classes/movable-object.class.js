class MovableObject extends Physics {
    position = {
        x: null,
        y: null,
        ground: 0,
    }

    refreshRate = 12;
    lastRefreshFrame = 0;

    abilities = {
        isFalling: false,
        isJumping: false,
        jump: {
            peak: 0,
            bouncePeak: 0,
        }
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

    drawHitbox(ctx, color = 'blue') {
        if (this instanceof Player || this instanceof Enemy || this instanceof ThrowableObject) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = color;
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
     * required methods, if the target is moving to the left side.
     */
    moveLeft() {
        if (!this.isDead) {
            this.getCurrentVelocityX();
            this.position.x -= this.velocity.x;
            if (!(this instanceof ElGallonatorBoss) && this.position.x < -180) {
                this.position.x = 3500;
            } else if (this.position.x === Infinity) {
                this.position.x = world.player.position.x;
            }
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
            Level.triggerCutscene();
        }
        return this;
    }


    /**
    * Allows die MO to jump.
    */
    jump() {
        if (!this.abilities.isJumping && !this.isDead && !this.iFrames.active) {
            this.setAppearanceTo('startJump', 0);
            const sound = world.audio.playRandomVariant(this.sounds.jumping, this);
            Audioplayer.clearSound(sound);
        }
    }


    /**
     * @returns {boolean} - true, if the current frame of the animation is the last one.
     */
    lastFrameOfAnimation() {
        if (this.appearance.currentImg !== 0) {
            return this.appearance.currentImg % this.appearance[this.appearance.currentStyle].length === 0;
        } else {
            return false;
        }
    }


    /**
     * @param {Number} divisor - Increase the Refresh-Rate by Dividing
     * @param {Number} divisor - Increase the Refresh-Rate by substract a value
     * @returns {boolean} - true, if an update is required
     */
    fasterRefreshRate(divisor = 1.5, substractor = 0) {
        if (world.framerate.frame >= this.lastRefreshFrame + (this.refreshRate / divisor) - substractor) {
            this.lastRefreshFrame = world.framerate.frame;
            return true;
        } else {
            return false
        }
    }

    /**
     * Checks for refresh-Rate when player is running
     * @param {Object} self - Instance of Player, that should be evaluated
     * @returns {boolean} - true, if an update is required
     */
    regularRefreshRate() {
        if (world.framerate.frame >= this.lastRefreshFrame + this.refreshRate) {
            this.lastRefreshFrame = world.framerate.frame;
            return true;
        } else {
            return false
        }
    }

    /**
     * Calculates the mobjects max speed on y axis. Try is, if the mo is a character, otherwise use catch.
     * @returns {number}
     */
    getMaxSpeedX() {
        if (this instanceof Player || this instanceof ElGallonatorBoss) {
            return this.abilities.run ? this.velocity.xMax * this.abilities.runBonusX : this.velocity.xMax;
        }
        return this.velocity.xMax;
    }

    /**
     * checks conditions and only allows an image update, when the target animation speed is fitted.
     * If the current MO has the running ability and does use it while walking, speed up the animation.
     * @returns {boolean} 
     */
    frameUpdateRequired() {
        if (this instanceof Player) {
            if (this.abilities.run && this.currentAppearance() === 'walking') {
                return this.fasterRefreshRate();
            } else {
                return this.regularRefreshRate();
            }
        } else if (this instanceof ThrowableObject) {
            if (this.appearance.currentStyle == 'splash') {
                return this.regularRefreshRate();
            } else {
                return this.fasterRefreshRate(1, 9);
            }
        } else {
            return this.regularRefreshRate();
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
     * @returns - current style of movable Object
     */
    currentAppearance() {
        return this.appearance.currentStyle;
    }

    /**
     * Updates the image to the required one, for the target animation
     * @param {string} animationType - containing this.appearance.currentStyle
     */
    playAnimation(animationType) {
        const animationFrame = this.appearance.currentImg % this.appearance[animationType].length;
        this.appearance.img = this.appearance[animationType][animationFrame];
        if (this.frameUpdateRequired()) {
            this.appearance.currentImg++;
            if (this instanceof Player) {
                this.endSpecialAnimations();
            }
            if (this instanceof Character) {
                this.endIFrames();
            }
            return true;
        }
        return false;
    }
}