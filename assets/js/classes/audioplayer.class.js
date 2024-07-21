class Audioplayer {
    currentlyPlayed = [];

    playRandomVariant(soundArray) {
        const index = Math.floor(Math.random() * soundArray.length);
        soundArray[index].play();
    }
}


