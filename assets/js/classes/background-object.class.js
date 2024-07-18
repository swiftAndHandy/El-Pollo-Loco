class BackgroundObject extends MovableObject {

    scrollSpeed = null;

    constructor(imagePath, scrollSpeed, screen = 0) {
        super(canvas.width, canvas.height).loadImage(imagePath)
        this.position.x = screen * (canvasWidth - 1);
        this.position.y = 0;
        this.scrollSpeed = scrollSpeed;
    }

    animate() {
        if (world.character.appearance.mirrored) {
            this.position.x -= world.character.velocity.x * this.scrollSpeed; 
        } else {
            this.position.x += world.character.velocity.x * this.scrollSpeed;
        }
    }
}