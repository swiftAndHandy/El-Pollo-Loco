class Character extends MovableObject {

    position = {
        x: 50,
        y: 222,
    }

    acceleration = {
        x: null,
        y: null,
    }

    constructor(accelerationX, accelerationY) {
        super(100, 200).loadImage('./assets/img/2_character_pepe/1_idle/idle/I-1.png');
        this.acceleration.x = accelerationX;
        this.acceleration.y = accelerationY;
    }


    jump() {
        console.log('Character jumps');
    }

}