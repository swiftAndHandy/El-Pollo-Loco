class Physics {

    constructor() {

    }

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
     * @param {string} [mo='character'] - character applies specific rules for inputs
     */
    isFalling(mo = 'character') {
        if (this.position.y <= this.position.peak || this.position.y <= this.position.bouncingPeak) {
            this.acceleration.isFalling = true;
            this.setAppearanceTo('falling', 0);
            this.acceleration.isJumping = false;
        } else if (this.position.y >= this.position.ground) {
            mo === 'character' && this.allowJumping();
            if (this.acceleration.isFalling) {
                this.setAppearanceTo('landing', 0);
                this.acceleration.isFalling = false;
                this.position.bouncingPeak = 0;
                this.startSFX('landing');
            }
        }
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
}