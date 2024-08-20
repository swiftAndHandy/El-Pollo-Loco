class Cloud extends MovableObject {

    constructor(width, height, x) {
        super(width * (Math.random() + 1), height * (Math.random() + 1)).loadImage('assets/img/5_background/layers/4_clouds/1.png');
        this.position.x = x;
        this.position.y = (Math.ceil(Math.random()*6)) * 12;
        this.velocity.xMax = 0.15; this.acceleration.x = 1;
    }

    animate() {
        this.moveLeft();
    }
}