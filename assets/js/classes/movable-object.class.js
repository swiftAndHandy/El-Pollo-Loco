class MovableObject {
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
        this.appearance.width = width;
        this.appearance.height = height;
    }

    drawHitbox(ctx) {
        if (this instanceof Character || this instanceof Enemy) {
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
     * This function compares the hitboxes of the current movableobject with the hitboxes
     * of the provided object to determine if there is any overlap, indicating a collision.
     * @param {Object} obj - The object to check for collisions with.
     * @returns {boolean} - Returns true if a collision is detected, otherwise false.
     */
    isColliding(obj) {
        return this.hitboxes.some(hitbox => {
            const leftArea = this.position.x + hitbox.x;
            const rightArea = leftArea + this.appearance.width - hitbox.width;
            const topArea = this.position.y + hitbox.y;
            const bottomArea = topArea + this.appearance.height - hitbox.height;
            return obj.hitboxes.some(objHitbox => {
                const objLeftArea = obj.position.x + objHitbox.x;
                const objRightArea = objLeftArea + obj.appearance.width - objHitbox.width;
                const objTopArea = obj.position.y + objHitbox.y;
                const objBottomArea = objTopArea + obj.appearance.height - objHitbox.height;
                if (rightArea >= objLeftArea && leftArea <= objRightArea && topArea <= objBottomArea && bottomArea >= objTopArea) {
                    return true;
                }
                return false;
            });
        });
    }


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
     * Sets the MOs velocity to the required value and limits it to the maxX-Speed.
     * The last if-statement is only for the character, since enemys can't walk to the right and 
     * they are not mirrored, when they walk left. It's only to restrict the characters movement and limit
     * the maps size.
     */
    getCurrentVelocityX() {
        if (this.appearance.currentStyle !== 'landing') {
            let maxSpeed = this.getMaxSpeedX();
            if (this.frameUpdateRequired()) {
                this.velocity.x += this.acceleration.x;
            }
            this.velocity.x = this.velocity.x > maxSpeed ? maxSpeed : this.velocity.x;
            if ((this.velocity.x > this.position.x - world.level.levelStart) && this.appearance.mirrored) {
                this.velocity.x = this.position.x - world.level.levelStart;
            } else if ((this.velocity.x > world.level.levelEnd - this.position.x) && !this.appearance.mirrored) {
                this.velocity.x = world.level.levelEnd - this.position.x;
            }
        } else {
            this.velocity.x = 0;
        }
    }

    /**
     * Sets the MOs velocity to the required value and limits it to the maxY-Speed.
     */
    getCurrentVelocityY() {
        let maxSpeed = this.getMaxSpeedY();
        if (this.acceleration.isJumping) {
            if (this.frameUpdateRequired()) {
                this.velocity.y -= this.acceleration.y * 2;
                this.velocity.y = this.velocity.y < 3 ? 3 : this.velocity.y;
            }
        } else if (this.acceleration.isFalling) {
            if (this.frameUpdateRequired()) {
                this.velocity.y += this.acceleration.y;
            }
            this.velocity.y = this.velocity.y > maxSpeed ? maxSpeed : this.velocity.y;
        }
        this.applyGravity();
    }


    /**
     * @param {string} [mo='character'] - character applies specific rules for inputs
     */
    isFalling(mo = 'character') {
        if (this.position.y <= this.position.peak || this.position.y <= this.position.bouncingPeak) {
            this.acceleration.isFalling = true;
            this.setAppearanceTo('falling', 0);
            this.acceleration.isJumping = false;
        } else if (this.position.y >= this.position.ground) {
            mo === 'character' && this.allowJumping();
            this.acceleration.isFalling && this.setAppearanceTo('landing', 0);
            this.acceleration.isFalling = false;
            this.position.bouncingPeak = 0;
        }
    }

    /**
     * applys gravity on the mo, based on falling (or jumping).
     */
    applyGravity() {
        this.isFalling();
        this.velocity.y = this.acceleration.isFalling || this.acceleration.isJumping ? this.velocity.y : 0;
        if (this.acceleration.isFalling) {
            this.position.y += this.velocity.y * 0.8;
            this.position.y = this.isTouchingGround() ? this.position.ground : this.position.y;
        } else if (this.acceleration.isJumping) {
            this.position.y -= this.velocity.y;
        } else if (this.position.y == this.position.ground) {
            this.position.y -= this.velocity.y;
        }
    }


    /**
     * @returns {boolean} - true if the mo stands on ground (or below)
     */
    isTouchingGround() {
        return this.position.y >= this.position.ground;
    }


    /**
     * required methods, if the target is moving to the left side.
     */
    moveLeft() {
        this.getCurrentVelocityX();
        this.position.x -= this.velocity.x;
        return this;
    }

    /**
     * required methods, if the target is moving to the right side.
     */
    moveRight() {
        this.getCurrentVelocityX();
        this.position.x += this.velocity.x;
        return this;
    }


    /**
    * Allows die MO to jump.
    */
    jump() {
        if (!this.acceleration.isJumping) {
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
        if (this instanceof Character) {
            return this.abilities.run ? this.velocity.xMax * this.abilities.runBonusX : this.velocity.xMax;
        }
        return this.velocity.xMax;
    }

    /**
     * Calculates the mobjects max speed on y axis. Try is, if the mo is a character, otherwise use catch.
     * @returns {number}
     */
    getMaxSpeedY() {
        if (this instanceof Character) {
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
        if (this instanceof Character) {
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
            if (this instanceof Character) {
                this.endSpecialAnimations();
            }
        }
    }
}