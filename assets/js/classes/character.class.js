class Character extends MovableObject {
    isDead = false;
    iFrames = {
        active: false,
        startedAt: 0,
        duration: 60,
    }
    false;

    stats = {
        health: 5,
        coins: 0,
        bottles: 0,
    }

    constructor(width, height) {
        super(width, height);
    }

    reciveDamage(amount, bySource = '') {
        if (!this.isDead && !this.iFrames.active) {
            this.stats.health -= amount;
            if (this instanceof Player) {
                world.gamepad.triggerRumble(0, 200, 0.5, 0.5);
            } else if (this instanceof Enemy) {
                world.gamepad.triggerRumble(0, 100, 0.25, 0.25);
            }
            if (this.stats.health <= 0) {
                this.isDying(bySource);
            } else {
                this.reciveIFrames();
            }
        }
    }

    reciveIFrames() {
        this.setAppearanceTo('damaged');
        world.audio.playRandomVariant(this.sounds.damaged, this, false);
        Audioplayer.clearSound();
        this.iFrames.active = true;
        this.iFrames.startedAt = world.framerate.frame;

    }

    endIFrames() {
        if (this.iFrames.active && world.framerate.frame > (this.iFrames.startedAt + this.iFrames.duration)) {
            this.iFrames.active = false;
            if (this instanceof Player) {
                world.keyboard.buttonsWithCooldown.jump = false;
                this.abilities.isJumping = false;
            }
            this.setAppearanceTo('idle');
        }
    }

    bounce(atObject) {
        this.abilities.isFalling = false;
        this.abilities.isJumping = true;
        this.position.y = atObject.position.y - this.appearance.height;
        this.abilities.jump.bouncePeak = this.position.ground + this.appearance.height - atObject.position.y;
        // this.abilities.jump.bouncePeak = 80 - atObject.appearance.height / 2;
        console.log(this.abilities.jump.bouncePeak);
        
        this.velocity.y = 10;
    }

    isDying(sourceModificator = '') {
        if (!this.isDead) {
            this.velocity.x = 0;
            this.setAppearanceTo('dead', 0);
            Audioplayer.startSFX(this, `dying${sourceModificator}`, false);
            if (this instanceof Character) {
                setTimeout(() => {
                    if (this instanceof Enemy) {
                        Level.remove(this);
                    }
                }, 500);
            }
            this.isDead = true;
        }
    }
}