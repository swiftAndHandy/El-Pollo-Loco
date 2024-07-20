class BackgroundObject extends MovableObject {

    scrollSpeed = null;

    /**
     * Setup of the BackgroundObject
     * @param {string} imagePath - src of the image, that should appear
     * @param {number} scrollSpeed - required for parallax-effect on background. Can be positive or negative.
     * @param {number} screen for faster positioning of images. a single screen is equal to canvasWidth + some calc for perfect fit
     * @param {boolean} isAir true, if air schould become displayed, since there is a tiny bit more math required, since there is only 1 BG.
     */
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

    /**
     * Scrolls the background related to the players position.
     */
    animate() {
        if (world.character.appearance.mirrored) {
            this.position.x -= world.character.velocity.x * this.scrollSpeed; 
        } else {
            this.position.x += world.character.velocity.x * this.scrollSpeed;
        }
    }
}