class Chicken extends MovableObject{

    constructor() {
        super(40, 40).loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png');
        this.position.x = Math.random() * canvas.width + 200; 
        this.position.y = 375;
    }
}