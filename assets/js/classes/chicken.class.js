class Chicken extends MovableObject{

    WALKING_ANIMATION = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ]

    constructor() {
        super(70,70).loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png');
        this.cacheImage('walking', this.WALKING_ANIMATION); delete this.WALKING_ANIMATION;
        this.position.x = Math.random() * canvasWidth + 200; 
        this.position.y = 350;
        this.velocity.xMax = 0.25 + Math.random() * 0.25; this.acceleration.x = 0.1 + Math.random() * 0.125;
    }

    animate() {
        const animationFrame = this.appearance.currentImg % this.appearance.walking.length;
        this.appearance.img = this.appearance.walking[animationFrame];
        if (this.frameUpdateRequired()) {
            this.appearance.currentImg++;
        }
        this.moveLeft();
    }
}