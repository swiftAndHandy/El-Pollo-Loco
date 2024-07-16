class BackgroundObject extends MovableObject {

    constructor(imagePath) {
        super(canvas.width, canvas.height).loadImage(imagePath)
        this.position.x = 0;
        this.position.y = 0;
    }

}