class Physics {

    /**
    * applys gravity on the mo, based on falling (or jumping).
    */
    applyGravity() {
        this.position.y -= this.speed.y;
        this.speed.y--;
        if (this.position.y > this.position.ground) {
            this.position.y = this.position.ground;
        }
    }


    /**
     * @returns {boolean} - true if the mo stands on ground (or below)
     */
    isTouchingGround() {
        return this.position.y >= this.position.ground;
    }

    peakAtBounce() {
        return this.abilities.jump.peak < this.abilities.jump.bouncePeak || this.abilities.jump.bouncePeak === 0;
    }

    calculatePeak() {
        return this.peakAtBounce() ?
            this.abilities.jump.peak : this.abilities.jump.bouncePeak;
    }

    isFalling() {
        const peak = this.calculatePeak();
        if (this.position.y <= peak || this.isAirstucked()) {
            if (this.canPerformJumpAttack(peak)) { this.abilities.jump.isAttacking = true; };            
            this.abilities.isFalling = true;
            !this.isDead && this instanceof Player && this.setAppearanceTo('falling', 0);
            this.abilities.isJumping = false;
        } else if (this.position.y >= this.position.ground) {
            this.isLanding();
        }
    }

    canPerformJumpAttack(peak) {
        return this.position.y <= peak && this.abilities.jump.isAttacking !== undefined;
    }

    isLanding() {
        this instanceof Player && this.allowJumping();
        if (this.abilities.isFalling && !this.isDead) {
            if (this instanceof Player) {
                this.setAppearanceTo('landing', 0);
                const sound = Audioplayer.startSFX(this, 'landing');
                Audioplayer.clearSound(sound);
            }
            this.abilities.isFalling = false;
            this.abilities.jump.bouncePeak = 0;
        }
    }
    /**
     * When the player is damaged during a jump and bounce right after, he could become airstucked. this check is preventing this behaviour.
     * @returns {boolean}
     */
    isAirstucked() {
        return this.position.y < this.position.ground &&
            (this.appearance.currentStyle !== 'falling' &&
                this.appearance.currentStyle !== 'jumping' &&
                this.appearance.currentStyle !== 'startJump');
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
            if (this.lastRefreshFrame !== world.framerate.frame) {
                this.velocity.x += this.acceleration.x;
            }
            this.velocity.x = this.velocity.x > maxSpeed ? maxSpeed : this.velocity.x;
            if ((this.velocity.x > this.position.x - world.level.levelStart) && this.appearance.mirrored) {
                this.velocity.x = this.position.x - world.level.levelStart;
            } else if ((this.velocity.x > world.level.levelEnd - this.position.x) && Player.isntMirrored(this)) {
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
        let maxSpeed = this.velocity.yMax;
        const requiredUpdate = this.frameUpdateRequired();
        if (this.abilities.isJumping) {
            if (requiredUpdate) {
                this.velocity.y -= this.acceleration.y;
                this.velocity.y = this.velocity.y < 1 ? 1 : this.velocity.y;
            }
        } else if (this.abilities.isFalling) {
            if (requiredUpdate) {
                this.velocity.y += this.acceleration.y;
            }
            this.velocity.y = this.velocity.y > maxSpeed ? maxSpeed : this.velocity.y;
        }
        !requiredUpdate && this.applyGravity();
    }
}