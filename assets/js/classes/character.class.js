class Character extends MovableObject {

    position = {
        x: 50,
        y: 222,
    }

    cooldowns = {
        jump: false,
    }

    WALKING_ANIMATION = [
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png',
    ]

    constructor(velocityX, velocityY) {
        super(100, 200).loadImage('./assets/img/2_character_pepe/1_idle/idle/I-1.png');
        this.cacheImage('walking', this.WALKING_ANIMATION); delete this.WALKING_ANIMATION;
        this.velocity.xBase = velocityX;
        this.velocity.yBase = velocityY;
    }

    jump() {
        console.log('Character jumps');
    }

    animate() {
        const animationFrame = this.appearance.currentImg % this.appearance.walking.length;
        this.appearance.img = this.appearance.walking[animationFrame];
        if (world.framerate.frame % (world.framerate.fps / 10) == 0) {
            this.appearance.currentImg++;
        }
    }

}