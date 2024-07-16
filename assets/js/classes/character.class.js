class Character extends MovableObject {

    position = {
        x: 50,
        y: 222,
    }

    abilities = {
        jump: {
            cooldown: false,
        },
        run: false,
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
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png',
    ]

    constructor() {
        super(100, 200).loadImage('./assets/img/2_character_pepe/1_idle/idle/I-1.png');
        this.cacheImage('walking', this.WALKING_ANIMATION); delete this.WALKING_ANIMATION;
        this.appearance.idle = []; this.cacheImage('idle', this.IDLE_ANIMATION); delete this.IDLE_ANIMATION;
        this.velocity.xMax = 5; this.acceleration.x = 1;
        this.velocity.yMax = 80; this.acceleration.y = 80;
    }

    jump() {
        console.log('Character jumps');
        this.position.y -= this.velocity.y;
    }

    stopMovement() {
        this.velocity.x = 0;
    }

    animate() {
        const animationFrame = this.appearance.currentImg % this.appearance.walking.length;
        this.appearance.img = this.appearance.walking[animationFrame];
        if (this.frameUpdateRequired()) {
            this.appearance.currentImg++;
        }
    }

}