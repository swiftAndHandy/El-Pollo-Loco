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
        return soundArray[index];
    }

    clearJumpSounds() {
        world.player.sounds.jumping.forEach(audioFile => {
            const index = this.currentlyPlayed.indexOf(audioFile);
            if (index >= 0) {
                this.currentlyPlayed.splice(index, 1);
            }
        });
    }

    static clearSound(sound, delay = 0) {
        setTimeout(() => {
            const index = world.audio.currentlyPlayed.indexOf(sound);
            index > -1 && world.audio.currentlyPlayed.splice(index, 1);
            console.log('spliced', index);

        }, delay);
    }

    /**
    * starts a specific audio, if it's not played allready. can publish it to an array,
    * that contains all currently played sounds, to use them when world gets paused.
    * @param {Audio} sound - Element of the required sound
    */
    static startSFX(self, sound, published = true) {
        if (!world.time.pause) {
        try {
            if (published) {
                self.sounds[sound].paused && world.audio.currentlyPlayed.push(self.sounds[sound]);
            }
            if (!audioMuted) {
                self.sounds[sound].play()
            };
            return self.sounds[sound];
        } catch (error) {
            !audioMuted && sound.play();
            if (published) {
                world.audio.currentlyPlayed.push(sound);
            }
        }
            return sound;
        }
    }


    /**
     * Controls fade of Audio
     * @param {string} method - fade your Audio-Element 'in' our 'out'.
     * @param {Audio} audio - Audio Element that should be affected
     * @param {number} targetVolume - final volume. has to be between 0 and 1
     */
    static fade(method, audio, targetVolume) {
        if (method === 'out') {
            if (audio.volume < 0.02) {
                this.stopMusic(audio);
            } else if (audio.volume > targetVolume && audio.volume > 0.02) {
                audio.volume -= 0.01;
                console.log(audio.volume);
            }
        } else if (method === 'in', audio, targetVolume) {
            audio.paused && Audioplayer.startSFX('', MUSIC.boss, true);
            if (audio.volume >= 0.98) {
                audio.volume = targetVolume;
            } else if (audio.volume < targetVolume && audio.volume < 0.98) {
                audio.volume += 0.01;
            }
        }
    }


    /**
     * stops the specific sound and removes it from world.audio[].
     * @param {string} sound - name of the sound-type, that should be stopped.
     */
    static stopSFX(self, sound) {
        const indexToRemove = world.audio.currentlyPlayed.indexOf(self.sounds[sound]);
        indexToRemove > 0 && world.audio.currentlyPlayed.splice(indexToRemove, 1);
        self.sounds[sound].pause();
    }

    static stopMusic(music) {
        const indexToRemove = world.audio.currentlyPlayed.indexOf(music);
        indexToRemove > -1 && world.audio.currentlyPlayed.splice(indexToRemove, 1);
        music.pause();
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