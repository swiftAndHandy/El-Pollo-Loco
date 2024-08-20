class CollectableItem {
    type = null;
    index = null;

    refreshRate = 30;
    lastRefreshFrame = 0;

    position = {
        x: null,
        y: null,
    }

    appearance = {
        img: new Image(),
        currentImg: 0,
        design: [],
        width: null,
        height: null,
    }

    hitboxes = [];

    drawHitbox(ctx, color = 'green') {
        ctx.beginPath();
        ctx.lineWidth = '5';
        ctx.strokeStyle = color;
        this.hitboxes.forEach(hitbox => {
            ctx.rect(this.position.x + hitbox.x,
                this.position.y + hitbox.y,
                this.appearance.width - hitbox.width,
                this.appearance.height - hitbox.height);
        });
        ctx.stroke();
    }


    cacheImage(arr) {
        arr.forEach(frame => {
            const img = new Image();
            img.src = frame;
            this.appearance['design'].push(img);
        });
    };


    /**
     * checks if the current style is the targetStyle and the world is not paused.
     * @param {string} targetSound - string that contains the sound, that is required in the current situation.
     * @returns {boolean} - true, if the sound should become played, otherwise false
     */
    requiredSound(targetSound) {
        return this.currentAppearance() === `${targetSound}` && !world.time.paused;
    }

    /**
     * checks conditions and only allows an image update, when the target animation speed is fitted.
     * If the current MO has the running ability and does use it while walking, speed up the animation.
     * @returns {boolean} 
     */
    frameUpdateRequired() {
        if (world.framerate.frame >= this.lastRefreshFrame + this.refreshRate) {
            this.lastRefreshFrame = world.framerate.frame;
            return true;
        } else {
            return false
        }
    }

    /**
     * Updates the image to the required one, for the target animation
     */
    animate() {
        const animationType = this.appearance.design;
        const animationFrame = this.appearance.currentImg % this.appearance.design.length;
        this.appearance.img = animationType[animationFrame];
        if (this.frameUpdateRequired()) {
                this.appearance.currentImg++;
        }
    }
}