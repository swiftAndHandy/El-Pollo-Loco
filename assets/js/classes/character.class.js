class Character extends MovableObject {

    idleStartedAtFrame = 0;
    isCharacter = true;

    position = {
        x: 150,
        y: 225,
        ground: 225,
        peak: 80,
        bouncingPeak: 0,
    };

    abilities = {
        jump: {
            cooldown: false,
        },
        run: false,
        runBonusX: 1.5,
        runBonusY: 1.5,
    };

    sounds = {
        walking: Object.assign(new Audio('../assets/audio/pepe/footsteps.mp3'), { loop: true, volume: 0.5 }),
        snoring: Object.assign(new Audio('../assets/audio/pepe/snoring.mp3'), { loop: true, volume: 1 }),
        jumping: [
            Object.assign(new Audio('../assets/audio/pepe/jump1.mp3'), { loop: false, volume: 1 }),
            Object.assign(new Audio('../assets/audio/pepe/jump2.mp3'), { loop: false, volume: 1 }),
            Object.assign(new Audio('../assets/audio/pepe/jump3.mp3'), { loop: false, volume: 1 }),
        ],
        cutscene: Object.assign(new Audio('../assets/audio/pepe/gallonator.mp3'), { loop: false, volume: 1 }),
    };

    ANIMATION = new CharacterAnimations;

    constructor() {
        super(100, 200);
        this.cacheImage('walking', this.ANIMATION.WALKING); delete this.ANIMATION.WALKING;
        this.appearance.idle = []; this.cacheImage('idle', this.ANIMATION.IDLE); delete this.ANIMATION.IDLE;
        this.appearance.longIdle = []; this.cacheImage('longIdle', this.ANIMATION.LONG_IDLE); delete this.ANIMATION.LONG_IDLE;
        this.appearance.startJump = []; this.cacheImage('startJump', this.ANIMATION.JUMP_START); delete this.ANIMATION.JUMP_START;
        this.appearance.jumping = []; this.cacheImage('jumping', this.ANIMATION.JUMP); delete this.ANIMATION.JUMP;
        this.appearance.falling = []; this.cacheImage('falling', this.ANIMATION.FALL); delete this.ANIMATION.FALL;
        this.appearance.landing = []; this.cacheImage('landing', this.ANIMATION.LANDING); delete this.ANIMATION.LANDING;
        this.velocity.xMax = 2.5; this.acceleration.x = 0.5;
        this.velocity.yMax = 20; this.acceleration.y = 1.75; this.velocity.jumpSpeed = 13;
        this.hitboxes.push(new Hitbox(this.appearance.width/5, this.appearance.height/2, this.appearance.width/2, this.appearance.height/1.75));
        this.setAppearanceTo('idle');
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
        if (this.acceleration.isFalling) {
            this.endSpecialAnimations();
        }
    }


    /**
     * Ends important special animations like the start of a jump, 
     * landing scene and damage-appearance.
     */
    endSpecialAnimations() {
        if (this.appearance.currentStyle === 'startJump') {
            if (this.lastFrameOfAnimation()) {
                this.setAppearanceTo('jumping', 0);
                this.acceleration.isJumping = true;
                this.velocity.y = this.velocity.jumpSpeed;
                world.audio.clearJumpSounds();

            }
        } else if (this.appearance.currentStyle === 'landing') {
            if (this.lastFrameOfAnimation()) {
                world.keyboard.buttonsWithCooldown.jump = false;
                this.acceleration.isJumping = false;
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
            this.startSFX('snoring');
        } else {
            this.stopSFX('snoring');
        }

        if (this.requiredSound('walking')) {
            this.startSFX('walking');
            world.character.sounds.walking.playbackRate = this.abilities.run ? this.abilities.runBonusX : 1;
        } else {
            this.stopSFX('walking');
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

    animate() {
        const animationType = this.appearance.currentStyle;
        this.checkForLongIdle(animationType);

        this.playAnimation(animationType);

        if (animationType !== 'idle' && animationType !== 'longIdle') {
            this.startIdle();
        }

        this.playSound();
        this.getCurrentVelocityY();
    }

}