class ThrowableObject extends MovableObject {

    type = 'throwableObjects';

    canSplash = false;

    speed = {
        x: 20,
        y: 15,
    }

    THROW_RIGHT_ANIMATION = [
        './assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/5_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/6_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/7_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/8_bottle_rotation.png',
    ];

    THROW_LEFT_ANIMATION = [
        './assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/8_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/7_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/6_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/5_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    ];

    SPLASH_ANIMATION = [
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    generatedAtFrame = 0;

    constructor(x, y) {
        super(80, 80);
        this.generatedAtFrame = world.framerate.frame;
        this.position.x = x; this.position.y = y; this.position.ground = 370;
        this.appearance.throwLeft = []; this.cacheImage('throwLeft', this.THROW_LEFT_ANIMATION); delete this.THROW_LEFT_ANIMATION;
        this.appearance.throwRight = []; this.cacheImage('throwRight', this.THROW_RIGHT_ANIMATION); delete this.THROW_RIGHT_ANIMATION;
        this.appearance.splash = []; this.cacheImage('splash', this.SPLASH_ANIMATION); delete this.SPLASH_ANIMATION;
        this.appearance.mirrored = world.player.appearance.mirrored ? true : false;
        this.appearance.currentStyle = this.appearance.mirrored ? 'throwLeft' : 'throwRight';
        this.hitboxes.push(new Hitbox(10, 10, 20, 20));
    }

    static throwBottle() {
        const x = !world.player.appearance.mirrored ? world.player.position.x + world.player.appearance.width / 2 : world.player.position.x - world.player.appearance.width / 2;
        const y = world.player.position.y + world.player.appearance.height / 2;
        const cooldownLength = 30;
        const cooldownFrame = ThrowableObject.framesSinceLastBottle();
        if (ThrowableObject.throwAllowed(cooldownLength, cooldownFrame)) {
            world.level.throwableObjects.push(new ThrowableObject(x, y));
            world.player.stats.bottles--;
            Bottle.addBottles(1, world.level, world.player.position.x);
        }
    }

    static framesSinceLastBottle() {
        const index = world.level.throwableObjects.length - 1;
        if (index >= 0) {
            return world.level.throwableObjects[index].generatedAtFrame;
        } else {
            return 0;
        }
    }

    /**
     * 
     * @param {number} cooldownLength - Frames that have to be passed before a new Bottle can be thrown
     * @param {number} cooldownFrame - frame, when the last bottle was created
     * @returns {boolean} - true, when more frames are passed, than the cooldown lasts. also true, when no bottle was thrown during the 
     *                  duration of the cooldown right after the game started.
     */
    static throwAllowed(cooldownLength, cooldownFrame) {
        if (world.player.stats.bottles > 0) {
            return world.framerate.frame >= cooldownFrame + cooldownLength ||
                world.framerate.frame < cooldownLength && world.level.throwableObjects.length === 0;
        }
    }

    animate() {
        const animationType = this.appearance.currentStyle;
        const updateRequired = this.playAnimation(animationType);

        if (this.appearance.currentStyle !== 'splash') {
            this.moveBottle();
        } else {
            if (this.lastFrameOfAnimation()) {
                Level.remove(this);
            }
        }

    }

    /**
     * Moves the bottle on axis, applys gravity and updated speed.
     */
    moveBottle() {
        if (!this.appearance.mirrored) {
            this.position.x += this.speed.x;
        } else {
            this.position.x -= this.speed.x;
        }
        if (this.speed.x > 8) {
            this.speed.x--;
        }
        this.applyGravity();
    }

    hitsGround() {
        this.setAppearanceTo('splash', 0);
        this.position.y = this.position.ground;
    }


}