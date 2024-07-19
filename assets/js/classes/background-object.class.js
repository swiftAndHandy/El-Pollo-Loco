class BackgroundObject extends MovableObject {

    scrollSpeed = null;

    constructor(imagePath, scrollSpeed, screen = 0, isAir = false) {
        super(canvasWidth, canvasHeight).loadImage(imagePath)
        this.position.x = screen * (canvasWidth - 1);
            if (isAir) {
                this.position.x -= 1 + 0;
                this.appearance.width += 2;
            }
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