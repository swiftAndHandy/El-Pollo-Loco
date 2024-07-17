class Character extends MovableObject {

    idleStartedAtFrame = 0;

    position = {
        x: 50,
        y: 222,
    };

    abilities = {
        jump: {
            cooldown: false,
        },
        run: false,
        runBonus: 1.5,
    };

    sounds = {
        walking: null,
        snoring: new Audio(),
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

    constructor() {
        super(100, 200);
        this.cacheImage('walking', this.WALKING_ANIMATION); delete this.WALKING_ANIMATION;
        this.appearance.idle = []; this.cacheImage('idle', this.IDLE_ANIMATION); delete this.IDLE_ANIMATION;
        this.appearance.longIdle = []; this.cacheImage('longIdle', this.LONG_IDLE_ANIMATION); delete this.LONG_IDLE_ANIMATION;
        this.velocity.xMax = 2.5; this.acceleration.x = 0.5;
        this.velocity.yMax = 40; this.acceleration.y = 40;
        this.appearance.currentStyle = 'idle';
    }

    startIdle() {
        this.idleStartedAtFrame = world.framerate.frame;
    }

    jump() {
        console.log('Character jumps');
        this.position.y -= this.velocity.y;
    }

    stopMovement() {
        this.velocity.x = 0;
        if (this.appearance.currentStyle !== 'longIdle' && this.appearance.currentStyle !== 'idle') {
            this.appearance.currentStyle = 'idle';
        }
    }

    timeToEnterLongIdle() {
        return (world.framerate.frame - this.idleStartedAtFrame) > (world.framerate.fps * 10);
    }

    animate() {
        const animationType = this.appearance.currentStyle;
        if (this.timeToEnterLongIdle()) {
            if (this.appearance.currentStyle !== 'longIdle') {
                this.appearance.currentStyle = 'longIdle';
            }
        }

        const animationFrame = this.appearance.currentImg % this.appearance[animationType].length;
        this.appearance.img = this.appearance[animationType][animationFrame];
        if (this.frameUpdateRequired()) {
            this.appearance.currentImg++;
        }
        if (this.appearance.currentStyle !== 'idle' && this.currentStyle !== 'longIdle') {
            this.startIdle();
        }

    }

}