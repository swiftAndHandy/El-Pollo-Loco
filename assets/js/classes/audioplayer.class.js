class Audioplayer {
    currentlyPlayed = [];

    /**
     * 
     * @param {*} soundArray 
     * @param {object} target - must be this of the object
     */
    playRandomVariant(soundArray, target) {
        const index = Math.floor(Math.random() * soundArray.length);
        target.startSFX(soundArray[index]);
    }

    clearJumpSounds() {
        world.player.sounds.jumping.forEach(audioFile => {
            const index = this.currentlyPlayed.indexOf(audioFile);
            if (index >= 0) {
                this.currentlyPlayed.splice(index, 1);
            }
        });
        this.currentlyPlayed
    }

    static clearSound(delay = 0) {
        const index = world.audio.currentlyPlayed.length - 1;
        setTimeout(() => {
            world.audio.currentlyPlayed.splice(index, 1);
        }, delay);
    }
}