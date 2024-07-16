class Character extends MovableObject {

    position = {
        x: 50,
        y: 222,
    }

    velocity = {
        x: null,
        y: null,
    }

    cooldowns = {
        jump: false,
    }



    constructor(velocityX, velocityY) {
        super(100, 200).loadImage('./assets/img/2_character_pepe/1_idle/idle/I-1.png');
        this.cacheImage('walking', [
            'assets/img/2_character_pepe/2_walk/W-21.png',
            'assets/img/2_character_pepe/2_walk/W-22.png',
            'assets/img/2_character_pepe/2_walk/W-23.png',
            'assets/img/2_character_pepe/2_walk/W-24.png',
            'assets/img/2_character_pepe/2_walk/W-25.png',
            'assets/img/2_character_pepe/2_walk/W-26.png',
        ]); 
        this.velocity.x = velocityX;
        this.velocity.y = velocityY;
    }

    jump() {
        console.log('Character jumps');
    }

}