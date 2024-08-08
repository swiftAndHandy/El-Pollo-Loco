class Chicken extends Enemy {

    WALKING_ANIMATION = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    DEAD_ANIMATION = [
        'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png',
    ];

    constructor() {
        super(70,70);
        this.cacheImage('walking', this.WALKING_ANIMATION); delete this.WALKING_ANIMATION;
        this.appearance.dead = []; this.cacheImage('dead', this.DEAD_ANIMATION); delete this.DEAD_ANIMATION;
        this.position.x = Math.random() * canvasWidth + 200; 
        this.position.y = 350;
        this.velocity.xMax = 0.25 + Math.random() * 0.25; this.acceleration.x = 0.1 + Math.random() * 0.125;
        this.hitboxes.push(new Hitbox(5, 0, 20, 10));
    }

    animate() {
        const animationType = this.appearance.currentStyle;
        this.playAnimation(animationType);
        this.moveLeft();
    }
}