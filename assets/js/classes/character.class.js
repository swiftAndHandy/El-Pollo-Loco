class Character extends MovableObject {

    lastFrameOfMovement = 0;

    position = {
        x: 50,
        y: 222,
    }

    abilities = {
        jump: {
            cooldown: false,
        },
        run: false,
        runBonus: 1.3,
    }

    sounds = {
        walking: null,
        snoring: new Audio(),
    }

    WALKING_ANIMATION = [
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png',
    ]

    IDLE_ANIMATION = [
        'assets/img/2_character_pepe/1_idle/idle/I-1.png',
        'assets/img/2_character_pepe/1_idle/idle/I-2.png',
        'assets/img/2_character_pepe/1_idle/idle/I-3.png',
        'assets/img/2_character_pepe/1_idle/idle/I-4.png',
        'assets/img/2_character_pepe/1_idle/idle/I-5.png',
        'assets/img/2_character_pepe/1_idle/idle/I-6.png',
        'assets/img/2_character_pepe/1_idle/idle/I-7.png',
        'assets/img/2_character_pepe/1_idle/idle/I-8.png',
        'assets/img/2_character_pepe/1_idle/idle/I-9.png',
        'assets/img/2_character_pepe/1_idle/idle/I-10.png',
    ]

    LONG_IDLE_ANIMATION = [
        'assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-20.png',
    ]

    constructor() {
        super(100, 200).loadImage('./assets/img/2_character_pepe/1_idle/idle/I-1.png');
        this.cacheImage('walking', this.WALKING_ANIMATION); delete this.WALKING_ANIMATION;
        this.appearance.idle = []; this.cacheImage('idle', this.IDLE_ANIMATION); delete this.IDLE_ANIMATION;
        this.appearance.longIdle = []; this.cacheImage('longIdle', this.LONG_IDLE_ANIMATION); delete this.LONG_IDLE_ANIMATION;
        this.velocity.xMax = 2.5; this.acceleration.x = 0.5;
        this.velocity.yMax = 40; this.acceleration.y = 40;
        this.appearance.currentStyle = 'idle';
    }

    jump() {
        console.log('Character jumps');
        this.position.y -= this.velocity.y;
    }

    stopMovement() {
        this.velocity.x = 0;
        this.appearance.currentStyle = this.appearance.currentStyle == 'longIdle' ? 'longIdle' : 'idle';
        this.startedIdleAtFrame = world.framerate.frame;
    }

    timeToEnterLongIdle() {
        return (world.framerate.frame - this.lastFrameOfMovement) > (world.framerate.fps * 10);
    }

    animate() {
        const animationType = this.appearance.currentStyle;
        if (this.timeToEnterLongIdle()) {
            if (this.appearance.currentStyle !== 'longIdle') {
                console.log('longidle');
                this.appearance.currentStyle = 'longIdle';
            }
        }
        // if (this.appearance.currentStyle === 'walking') {
        const animationFrame = this.appearance.currentImg % this.appearance[animationType].length;
        this.appearance.img = this.appearance[animationType][animationFrame];
        if (this.frameUpdateRequired()) {
            this.appearance.currentImg++;
        }
        // } else if(this.appearance.currentStyle === 'idle') {

        // }
    }

}