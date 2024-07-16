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
        runBonus: 1.3,
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
        this.velocity.xMax = 2.5; this.acceleration.x = 0.5;
        this.velocity.yMax = 40; this.acceleration.y = 40;
    }

    jump() {
        console.log('Character jumps');
        this.position.y -= this.velocity.y;
    }

    stopMovement() {
        this.velocity.x = 0;
        this.appearance.currentStyle = 'idle'
    }

    animate() {
        if (this.appearance.currentStyle === 'walking') {
            const animationFrame = this.appearance.currentImg % this.appearance.walking.length;
            this.appearance.img = this.appearance.walking[animationFrame];
            if (this.frameUpdateRequired()) {
                this.appearance.currentImg++;
            }
        } else if(this.appearance.currentStyle === 'idle') {
        }
    }

}