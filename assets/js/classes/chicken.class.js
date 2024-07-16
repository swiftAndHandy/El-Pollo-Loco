class Chicken extends MovableObject{

    WALKING_ANIMATION = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ]

    constructor() {
        super(70,70).loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png');
        this.cacheImage('walking', this.WALKING_ANIMATION); delete this.WALKING_ANIMATION;
        this.position.x = Math.random() * canvas.width + 200; 
        this.position.y = 352;
    }

    animate() {
        const animationFrame = this.appearance.currentImg % this.appearance.walking.length;
        this.appearance.img = this.appearance.walking[animationFrame];
        if (world.framerate.frame % (world.framerate.fps / 10) == 0) {
            this.appearance.currentImg++;
        }
    }
}