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
}


