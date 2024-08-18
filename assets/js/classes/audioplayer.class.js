class Audioplayer {
    currentlyPlayed = [];

    /**
     * 
     * @param {*} soundArray 
     * @param {object} target - must be this of the object
     */
    playRandomVariant(soundArray, target, published = true) {
        const index = Math.floor(Math.random() * soundArray.length);
        Audioplayer.startSFX(target, soundArray[index], published);
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
    * starts a specific audio, if it's not played allready. can publish it to an array,
    * that contains all currently played sounds, to use them when world gets paused.
    * @param {string} sound - name of the required sound
    */
    static startSFX(self, sound, published = true) {
        try {
            if (published) {
                self.sounds[sound].paused && world.audio.currentlyPlayed.push(self.sounds[sound]);
            }
            !audioMuted && self.sounds[sound].play();
        } catch (error) {
            !audioMuted && sound.play();
            if (published) {
                world.audio.currentlyPlayed.push(sound);
            }
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


    /**
     * pauses Audio on pause and some audio on cutscenes
     */
    static pauseAudio(self) {
            self.audio.currentlyPlayed.forEach(audioElement => {
                audioElement.pause();
            });
    }


    /**
     * continues the playback of audio-files. 
     */
   static continueAudio(self) {
        self.audio.currentlyPlayed.forEach(audioElement => {
            audioElement.play();
        });
    }
}