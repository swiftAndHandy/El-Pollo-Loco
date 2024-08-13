class CollectableItem {
    item = null;
    index = null;

    position = {
        x: null,
        y: null,
    }

    appearance = {
        img: new Image(),
        currentImg: 0,
        width: null,
        height: null,
    }

    hitboxes = [];


    constructor(item) {
        if (item === 'coin') {
            this.appearance.width = width;
            this.appearance.height = height;
        } else if (item === 'bottle') {
            this.appearance.width = width;
            this.appearance.height = height;
        }
        this.hitboxes.push(new Hitbox());
    }

    drawHitbox(ctx) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            this.hitboxes.forEach(hitbox => {
                ctx.rect(this.position.x + hitbox.x,
                    this.position.y + hitbox.y,
                    this.appearance.width - hitbox.width,
                    this.appearance.height - hitbox.height);
            });
            ctx.stroke();
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


    /**
     * checks if the current style is the targetStyle and the world is not paused.
     * @param {string} targetSound - string that contains the sound, that is required in the current situation.
     * @returns {boolean} - true, if the sound should become played, otherwise false
     */
    requiredSound(targetSound) {
        return this.appearance.currentStyle === `${targetSound}` && !world.time.paused;
    }

    /**
     * starts a specific audio, if it's not played allready. pushes it to an array,
     * that contains all currently played sounds, to use them when world gets paused.
     * @param {string} sound - name of the required sound
     */
    startSFX(sound) {
        try {
            this.sounds[sound].paused && world.audio.currentlyPlayed.push(this.sounds[sound]);
            this.sounds[sound].play();
        } catch (error) {
            sound.play();
            world.audio.currentlyPlayed.push(sound);
        }
    }

    /**
     * stops the specific sound and removes it from world.audio[].
     * @param {string} sound - name of the sound-type, that should be stopped.
     */
    stopSFX(sound) {
        const indexToRemove = world.audio.currentlyPlayed.indexOf(this.sounds[sound]);
        indexToRemove >= 0 && world.audio.currentlyPlayed.splice(indexToRemove, 1);
        this.sounds[sound].pause();
    }




    /**
     * @returns {boolean} - true, if the current frame of the animation is the last one.
     */
    lastFrameOfAnimation() {
        return this.appearance.currentImg % this.appearance[this.appearance.currentStyle].length === 0;
    }

    /**
     * checks conditions and only allows an image update, when the target animation speed is fitted.
     * If the current MO has the running ability and does use it while walking, speed up the animation.
     * @returns {boolean} 
     */
    frameUpdateRequired() {
        if (this instanceof Player) {
            if (this.abilities.run && this.appearance.currentStyle === 'walking') {
                return world.framerate.frame % (world.framerate.fps / 10) == 0;
            } else {
                return world.framerate.frame % (world.framerate.fps / 7.5) == 0;
            }
        } else {
            return world.framerate.frame % (world.framerate.fps / 7.5) == 0;
        }
    }

    /**
     * Updates the image to the required one, for the target animation
     * @param {string} animationType containing this.appearance.currentStyle
     */
    playAnimation(animationType) {
        const animationFrame = this.appearance.currentImg % this.appearance[animationType].length;
        this.appearance.img = this.appearance[animationType][animationFrame];
        if (this.frameUpdateRequired()) {
            this.appearance.currentImg++;
            if (this instanceof Player) {
                this.endSpecialAnimations();
                this.endIFrames();
            }
        }
    }
}