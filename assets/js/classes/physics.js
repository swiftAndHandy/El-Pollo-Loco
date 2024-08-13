class Physics {

    constructor() {

    }


    /**
    * applys gravity on the mo, based on falling (or jumping).
    */
    applyGravity() {
        this.isFalling();
        this.velocity.y = this.abilities.isFalling || this.abilities.isJumping ? this.velocity.y : 0;
        if (this.abilities.isFalling) {
            this.position.y += this.velocity.y * 0.8;
            this.position.y = this.isTouchingGround() ? this.position.ground : this.position.y;
        } else if (this.abilities.isJumping) {
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
     * @param {string} [mo='character'] - character applies specific rules for inputs
     */
    isFalling(mo = 'character') {
        if (this.position.y <= this.abilities.jump.peak || this.position.y <= this.abilities.jump.bouncePeak || this.isAirstucked()) {
            this.abilities.isFalling = true;
            !this.isDead && this.setAppearanceTo('falling', 0);
            this.abilities.isJumping = false;
        } else if (this.position.y >= this.position.ground) {
            mo === 'character' && this.allowJumping();
            if (this.abilities.isFalling && !this.isDead) {
                this.setAppearanceTo('landing', 0);
                this.abilities.isFalling = false;
                this.abilities.jump.bouncePeak = 0;
                this.startSFX('landing');
            }
        }
    }

    /**
     * When the player is damaged during a jump and bounce right after, he could become airstucked. this check is preventing this behaviour.
     * @returns {boolean}
     */
    isAirstucked() {
        return this.position.y < this.position.ground && (this.appearance.currentStyle !== 'falling' && this.appearance.currentStyle !== 'jumping' && this.appearance.currentStyle !== 'startJump');
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
        if (this.abilities.isJumping) {
            if (this.frameUpdateRequired()) {
                this.velocity.y -= this.acceleration.y * 2;
                this.velocity.y = this.velocity.y < 3 ? 3 : this.velocity.y;
            }
        } else if (this.abilities.isFalling) {
            if (this.frameUpdateRequired()) {
                this.velocity.y += this.acceleration.y;
            }
            this.velocity.y = this.velocity.y > maxSpeed ? maxSpeed : this.velocity.y;
        }
        this.applyGravity();
    }
}