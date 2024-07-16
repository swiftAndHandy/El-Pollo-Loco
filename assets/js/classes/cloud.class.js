class Cloud extends MovableObject {

    constructor() {
        super(300, 200).loadImage('assets/img/5_background/layers/4_clouds/1.png');
        this.position.x = Math.random() * canvas.width;
        this.position.y = 25;
        this.velocity.xMax = 0.15; this.acceleration.x = 1;
    }

    animate() {
        this.moveLeft();
    }
}