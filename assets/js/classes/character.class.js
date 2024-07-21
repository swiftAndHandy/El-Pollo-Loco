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
    };

    WALKING_ANIMATION = [
        './assets/img/2_character_pepe/2_walk/W-21.png',
        './assets/img/2_character_pepe/2_walk/W-22.png',
        './assets/img/2_character_pepe/2_walk/W-23.png',
        './assets/img/2_character_pepe/2_walk/W-24.png',
        './assets/img/2_character_pepe/2_walk/W-25.png',
        './assets/img/2_character_pepe/2_walk/W-26.png',
    ];

    IDLE_ANIMATION = [
        './assets/img/2_character_pepe/1_idle/idle/frame_001.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_002.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_003.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_004.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_005.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_006.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_007.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_008.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_009.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_010.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_011.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_012.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_013.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_014.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_015.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_016.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_017.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_018.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_019.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_007.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_006.png',
        './assets/img/2_character_pepe/1_idle/idle/frame_005.png',
    ];

    LONG_IDLE_ANIMATION = [
        './assets/img/2_character_pepe/1_idle/long_idle/frame_001.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_002.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_003.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_004.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_005.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_006.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_007.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_008.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_009.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_010.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_011.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_012.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_013.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_014.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_015.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_016.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_017.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_018.png',
        './assets/img/2_character_pepe/1_idle/long_idle/frame_019.png',
    ];

    JUMP_START_ANIMATION = [
        'assets/img/2_character_pepe/3_jump/J-31.png',
        'assets/img/2_character_pepe/3_jump/J-32.png',
        'assets/img/2_character_pepe/3_jump/J-33.png',
    ];

    constructor() {
        super(100, 200);
        this.cacheImage('walking', this.WALKING_ANIMATION); delete this.WALKING_ANIMATION;
        this.appearance.idle = []; this.cacheImage('idle', this.IDLE_ANIMATION); delete this.IDLE_ANIMATION;
        this.appearance.longIdle = []; this.cacheImage('longIdle', this.LONG_IDLE_ANIMATION); delete this.LONG_IDLE_ANIMATION;
        this.appearance.startJump = []; this.cacheImage('startJump', this.JUMP_START_ANIMATION); delete this.JUMP_START_ANIMATION;
        this.velocity.xMax = 2.5; this.acceleration.x = 0.5;
        this.velocity.yMax = 20; this.acceleration.y = 1.75;
        this.setAppearanceTo('idle');
    }

    startIdle() {
        this.idleStartedAtFrame = world.framerate.frame;
    }


    allowJumping() {
        world.keyboard.buttonsWithCooldown.jump = false;
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
            this.setAppearanceTo('idle', 0);
        }
    }

    /**
     * If the Character isn't in longIdle allready (to prevent )
     * @param {string} animationType - current Animation thats displayed on the character
     */
    checkForLongIdle(animationType) {
        if (this.timeToEnterLongIdle()) {
            if (animationType !== 'longIdle') {
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