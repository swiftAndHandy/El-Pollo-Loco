class Chick extends Enemy {

    speed = {
        y: 0,
        jumpHeight: 15,
        jumpRate: 0.02, 
    }

    WALKING_ANIMATION = [
        './assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    DEAD_ANIMATION = [
        './assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];

    sounds = {
        dying: Object.assign(new Audio('./assets/audio/chicken/chicken_dead_1.mp3'), { loop: false, volume: 0.2 }),
    }; 

    constructor(worldSize = 4, width = 50, height = 50) {
        super(width,height);
        this.cacheImage('walking', this.WALKING_ANIMATION); delete this.WALKING_ANIMATION;
        this.appearance.dead = []; this.cacheImage('dead', this.DEAD_ANIMATION); delete this.DEAD_ANIMATION;
        this.position.x = Math.ceil(Math.random() * (canvasWidth * worldSize));
        if (this.position.x < 300) {
            this.position.x = 300;
        }
        this.position.y = 370; this.position.ground = this.position.y;
        this.velocity.xMax = 0.75 + Math.random() * 0.25; this.acceleration.x = 0.1 + Math.random() * 0.125;
        this.hitboxes.push(new Hitbox(5, 0, 20, 10));
    }

    jump() {
        this.speed.y = Math.ceil(Math.random() * this.speed.jumpHeight);
    }

    animate() {
        const animationType = this.appearance.currentStyle;
        const updateRequired = this.playAnimation(animationType);
        this.moveLeft();
        this.applyGravity();
        if (!this.isDead && Math.random() < this.speed.jumpRate && this.isTouchingGround() && updateRequired) {
            this.jump();
        }
    }
}