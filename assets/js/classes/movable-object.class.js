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
        currentStyle: null,
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

    moveLeft() {
        let maxSpeed = this.getMaxSpeed();
        if (this.frameUpdateRequired()) {
            this.velocity.x += this.acceleration.x;
        }

        this.velocity.x = this.velocity.x > maxSpeed ? maxSpeed : this.velocity.x;
        this.position.x -= this.velocity.x;
    }

    moveRight() {
        let maxSpeed = this.getMaxSpeed();
        if (this.frameUpdateRequired()) {
            this.velocity.x += this.acceleration.x;
        }

        this.velocity.x = this.velocity.x > maxSpeed ? maxSpeed : this.velocity.x;
        this.position.x += this.velocity.x;
    }

    getMaxSpeed() {
        try {
            return this.abilities.run ? this.velocity.xMax * 2 : this.velocity.xMax;
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