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
}


