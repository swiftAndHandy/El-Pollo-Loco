class MovableObject {
    position = {
        x: null,
        y: null,
    }

    velocity = {
        x: 0,
        y: 0,
        xBase: null,
        yBase: null,
    }

    appearance = {
        img: new Image(),
        currentImg: 0,
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
        console.log('Moving left:' + (this.velocity.x = -this.velocity.xBase));
    }

    moveRight() {
        console.log('Moving right:' + (this.velocity.x = +this.velocity.xBase));
    }

    constructor(width, height) {
        this.appearance.width = width;
        this.appearance.height = height;
    }
}