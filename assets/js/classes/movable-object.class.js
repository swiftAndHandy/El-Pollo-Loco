class MovableObject {
    position = {
        x: null,
        y: null,
    }

    velocity = {
        x: null,
        y: null
    }

    appearance = {
        img: new Image(),
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
        console.log('Moving left');
    }

    moveRight() {
        console.log('Moving right');
    }

    constructor(width, height) {
        this.appearance.width = width;
        this.appearance.height = height;
    }
}