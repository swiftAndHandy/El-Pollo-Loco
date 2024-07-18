class BackgroundObject extends MovableObject {

    scrollSpeed = null;

    constructor(imagePath, scrollSpeed) {
        super(canvas.width, canvas.height).loadImage(imagePath)
        this.position.x = 0;
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