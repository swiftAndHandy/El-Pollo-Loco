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
        mirrored: false,
        width: null,
        height: null,
        walking: [],
    }

    constructor(width, height) {
        this.appearance.width = width;
        this.appearance.height = height;
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

    getCurrentVelocityX(direction) {
        let maxSpeed = this.getMaxSpeedX();
        if (this.frameUpdateRequired()) {
            this.velocity.x += this.acceleration.x;
        }
        this.velocity.x = this.velocity.x > maxSpeed ? maxSpeed : this.velocity.x;
        if ((this.velocity.x > this.position.x - level1.levelStart) && this.appearance.mirrored) {
            this.velocity.x = this.position.x - level1.levelStart;
        } else if ((this.velocity.x > level1.levelEnd - this.position.x) && !this.appearance.mirrored) {
            this.velocity.x = level1.levelEnd - this.position.x;
        }
    }

    getCurrentVelocityY() {
        let maxSpeed = this.getMaxSpeedY();

        if (this.frameUpdateRequired()) {
            this.velocity.y += this.acceleration.y;
        }
        this.velocity.y = this.velocity.y > maxSpeed ? maxSpeed : this.velocity.y;
        
    }

    moveLeft() {
        this.getCurrentVelocityX();
        this.position.x -= this.velocity.x;
        this.setAppearanceTo('walking');
        if (this.isCharacter && this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x = 0;
        }
    }

    moveRight() {
        this.getCurrentVelocityX();
        this.position.x += this.velocity.x;
        this.setAppearanceTo('walking');
    }

    getMaxSpeedX() {
        try {
            return this.abilities.run ? this.velocity.xMax * this.abilities.runBonusX : this.velocity.xMax;
        } catch (error) {
            return this.velocity.xMax;
        }
    }

    getMaxSpeedY() {
        try {
            return this.abilities.run ? this.velocity.yMax * this.abilities.runBonusY : this.velocity.yMax;
        } catch (error) {
            return this.velocity.yMax;
        }
    }

    frameUpdateRequired() {
        return world.framerate.frame % (world.framerate.fps / 10) == 0
    }

    setAppearanceTo(style, atFrame = -1) {
        this.appearance.currentStyle = style;
        this.appearance.currentImg = atFrame >= 0 ? atFrame : this.appearance.currentImg;
    }
}