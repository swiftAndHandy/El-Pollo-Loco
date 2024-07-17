class MovableObject {
    position = {
        x: null,
        y: null,
    }

    velocity = {
        x: 0,
        xMax: 0,
        y: 0,
        yMax: 0,
    }

    acceleration = {
        x: null,
        y: null,
    }

    appearance = {
        img: new Image(),
        currentImg: 0,
        currentStyle: 'walking',
        width: null,
        height: null,
        walking: [],
    }

    loadImage(path) {
        this.appearance.img.src = path;
    }

    cacheImage(targetAnimation, arr) {
        arr.forEach(frame => {
            const img = new Image();
            img.src = frame;
            this.appearance[targetAnimation].push(img);
        });
    };

    getCurrentVelocity() {
        let maxSpeed = this.getMaxSpeed();

        if (this.frameUpdateRequired()) {
            this.velocity.x += this.acceleration.x;
        }
        this.velocity.x = this.velocity.x > maxSpeed ? maxSpeed : this.velocity.x;
    }

    moveLeft() {
        this.getCurrentVelocity();
        this.position.x -= this.velocity.x;
        this.appearance.currentStyle = 'walking';
    }

    moveRight() {
        this.getCurrentVelocity();
        this.position.x += this.velocity.x;
        this.appearance.currentStyle = 'walking';
    }

    getMaxSpeed() {
        try {
            return this.abilities.run ? this.velocity.xMax * this.abilities.runBonus : this.velocity.xMax;
        } catch (error) {
            return this.velocity.xMax;
        }
    }

    frameUpdateRequired() {
        return world.framerate.frame % (world.framerate.fps / 10) == 0
    }

    constructor(width, height) {
        this.appearance.width = width;
        this.appearance.height = height;
    }
}