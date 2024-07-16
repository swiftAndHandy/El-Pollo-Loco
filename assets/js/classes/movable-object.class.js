class MovableObject {
    position = {
        x: null,
        y: null,
    }

    acceleration = {
        x: null,
        y: null
    }

    appearance = {
        img: new Image(),
        width: null,
        height: null,
    }

    loadImage(path) {
        this.appearance.img.src = path;
    }

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