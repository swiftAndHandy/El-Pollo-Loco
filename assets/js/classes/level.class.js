class Level {

    enemies = [];
    clouds = [];
    backgroundObjects = [];
    levelStart = 0;
    levelEnd = 0; 

    constructor(enemies, clouds, backgroundObjects, levelEnd, levelStart  = 0) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.levelEnd = levelEnd;
    }

}