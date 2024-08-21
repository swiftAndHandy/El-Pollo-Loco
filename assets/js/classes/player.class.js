class Player extends Character {

    idleStartedAtFrame = 0;

    position = {
        x: 150,
        y: 225,
        ground: 225,
    };

    abilities = {
        isJumping: false,
        isFalling: false,
        jump: {
            cooldown: false,
            peak: 45,
            bouncePeak: 0,
        },
        throw: {
            cooldown: false,
        },
        run: false,
        runBonusX: 1.5,
        runBonusY: 1.5,
    };

    sounds = {
        walking: Object.assign(new Audio('./assets/audio/pepe/footsteps.mp3'), { loop: true, volume: 0.5 }),
        snoring: Object.assign(new Audio('./assets/audio/pepe/snoring.mp3'), { loop: true, volume: 1 }),
        jumping: [
            Object.assign(new Audio('./assets/audio/pepe/jump1.mp3'), { loop: false, volume: 1 }),
            Object.assign(new Audio('./assets/audio/pepe/jump2.mp3'), { loop: false, volume: 1 }),
            Object.assign(new Audio('./assets/audio/pepe/jump3.mp3'), { loop: false, volume: 1 }),
        ],
        damaged: [
            Object.assign(new Audio('./assets/audio/pepe/damaged1.mp3'), { loop: false, volume: 1 }),
            Object.assign(new Audio('./assets/audio/pepe/damaged2.mp3'), { loop: false, volume: 1 }),
            Object.assign(new Audio('./assets/audio/pepe/damaged3.mp3'), { loop: false, volume: 1 }),
        ],
        landing: Object.assign(new Audio('./assets/audio/pepe/hit_ground.mp3'), { loop: false, volume: 0.3 }),
        dying: Object.assign(new Audio('./assets/audio/pepe/dying.mp3'), { loop: false, volume: 0.5 }),
        cutscene: Object.assign(new Audio('./assets/audio/pepe/gallonator.mp3'), { loop: false, volume: 1 }),
        win: Object.assign(new Audio('./assets/audio/pepe/polloconsalsa.mp3'), { loop: false, volume: 1 }),
    };

    ANIMATION = new CharacterAnimations;

    constructor() {
        super(100, 200);
        this.bufferAnimations();
        this.velocity.xMax = 2.5; this.acceleration.x = 0.5;
        this.velocity.yMax = 20; this.acceleration.y = 1.75; this.velocity.jumpSpeed = 9;
        this.hitboxes.push(new Hitbox(this.appearance.width / 5, this.appearance.height / 2, this.appearance.width / 2, this.appearance.height / 1.75));
        this.setAppearanceTo('idle');
    }

    /**
     * @param {Object} self - Instance of an Player
     * @returns 
     */
    static isntMirrored(self) {
        return !self.appearance.mirrored && self instanceof Player;
    }

    bufferAnimations() {
        this.cacheImage('walking', this.ANIMATION.WALKING); delete this.ANIMATION.WALKING;
        this.appearance.idle = []; this.cacheImage('idle', this.ANIMATION.IDLE); delete this.ANIMATION.IDLE;
        this.appearance.longIdle = []; this.cacheImage('longIdle', this.ANIMATION.LONG_IDLE); delete this.ANIMATION.LONG_IDLE;
        this.appearance.startJump = []; this.cacheImage('startJump', this.ANIMATION.JUMP_START); delete this.ANIMATION.JUMP_START;
        this.appearance.jumping = []; this.cacheImage('jumping', this.ANIMATION.JUMP); delete this.ANIMATION.JUMP;
        this.appearance.falling = []; this.cacheImage('falling', this.ANIMATION.FALL); delete this.ANIMATION.FALL;
        this.appearance.landing = []; this.cacheImage('landing', this.ANIMATION.LANDING); delete this.ANIMATION.LANDING;
        this.appearance.damaged = []; this.cacheImage('damaged', this.ANIMATION.DAMAGED); delete this.ANIMATION.DAMAGED;
        this.appearance.dead = []; this.cacheImage('dead', this.ANIMATION.DEAD); delete this.ANIMATION.DEAD;
        this.appearance.hidden = []; this.cacheImage('hidden', this.ANIMATION.HIDDEN); delete this.ANIMATION.HIDDEN;
    }

    /**
     * saves the frame, at which idle started to keep track of long-idle
     */
    startIdle() {
        this.idleStartedAtFrame = world.framerate.frame;
    }


    /**
     * 
     */
    allowJumping() {
        if (this.abilities.isFalling) {
            this.endSpecialAnimations();
        }
    }

    /**
     * Ends important special animations like the start of a jump, 
     * landing scene and damage-appearance.
     */
    endSpecialAnimations() {
        if (this.lastFrameOfAnimation()) {
            if (this.currentAppearance() === 'dead') {
                this.setAppearanceTo('hidden');
                World.gameOver();
            } else if (this.currentAppearance() === 'startJump') {
                this.setAppearanceTo('jumping', 0);
                this.abilities.isJumping = true;
                this.velocity.y = this.velocity.jumpSpeed;
                world.audio.clearJumpSounds();
            } else if (this.currentAppearance() === 'landing') {
                world.keyboard.buttonsWithCooldown.jump = false;
                this.abilities.isJumping = false;
                this.setAppearanceTo('idle');
            }
        }
    }

    /**
     * @returns {boolean} - true if character isn't idleing, otherwise false
     */
    isntIdeling() {
        return this.appearance.currentStyle !== 'longIdle' && this.appearance.currentStyle !== 'idle';
    }

    /**
     * stops the movement by reducing velocity. Sets Appearance to idle.
     */
    stopMovement() {
        this.velocity.x = 0;
        if (this.isntIdeling()) {
            world.keyboard.noImportantStyle() && this.setAppearanceTo('idle', 0);
            Audioplayer.stopSFX(this, 'walking');
        }
    }

    /**
     * If the Character isn't in longIdle allready (to prevent )
     * @param {string} animationType - current Animation thats displayed on the character
     */
    checkForLongIdle(animationType) {
        if (this.timeToEnterLongIdle()) {
            if (animationType !== 'longIdle' && world.keyboard.noImportantStyle()) { //here
                this.setAppearanceTo('longIdle');
            }
        }
    }

    playSound() {
        if (this.requiredSound('longIdle')) {
            Audioplayer.startSFX(this, 'snoring');
        } else {
            Audioplayer.stopSFX(this, 'snoring');
        }

        if (this.requiredSound('walking')) {
            Audioplayer.startSFX(this, 'walking');
            world.player.sounds.walking.playbackRate = this.abilities.run ? this.abilities.runBonusX : 1;
        } else {
            Audioplayer.stopSFX(this, 'walking');
        }
    };

    /**
     * Compares the frames to check the duration the play isn't doing any input. 
     * The Number at the end represents the seconds to enter longIdle.
     * @returns {boolean}
     */
    timeToEnterLongIdle() {
        return (world.framerate.frame - this.idleStartedAtFrame) > (world.framerate.fps * 10);
    }

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

    requiresFastUpdate() {
        return (this.abilities.run && this.currentAppearance() === 'walking') || this.currentAppearance() === 'jumpStart' || this.currentAppearance() === 'landing';
    }

    
    animate() {
        const animationType = this.appearance.currentStyle;
        this.checkForLongIdle(animationType);
        if (this.isDead) {
            this.playAnimation(animationType);
        } else {
            this.playAnimation(animationType);
        }

        if (animationType !== 'idle' && animationType !== 'longIdle') {
            this.startIdle();
        }

        this.playSound();
        this.getCurrentVelocityY();
    }

}