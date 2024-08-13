class Audioplayer {
    currentlyPlayed = [];

    /**
     * 
     * @param {*} soundArray 
     * @param {object} target - must be this of the object
     */
    playRandomVariant(soundArray, target) {
        const index = Math.floor(Math.random() * soundArray.length);
        Audioplayer.startSFX(target, soundArray[index]);
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

    /**
    * starts a specific audio, if it's not played allready. pushes it to an array,
    * that contains all currently played sounds, to use them when world gets paused.
    * @param {string} sound - name of the required sound
    */
    static startSFX(self, sound) {
        try {
            self.sounds[sound].paused && world.audio.currentlyPlayed.push(self.sounds[sound]);
            self.sounds[sound].play();
        } catch (error) {
            sound.play();
            world.audio.currentlyPlayed.push(sound);
        }
    }


    /**
     * stops the specific sound and removes it from world.audio[].
     * @param {string} sound - name of the sound-type, that should be stopped.
     */
    static stopSFX(self, sound) {
        const indexToRemove = world.audio.currentlyPlayed.indexOf(self.sounds[sound]);
        indexToRemove >= 0 && world.audio.currentlyPlayed.splice(indexToRemove, 1);
        self.sounds[sound].pause();
    }
}