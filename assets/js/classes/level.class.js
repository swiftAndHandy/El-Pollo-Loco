class Level {

    enemies = [];
    clouds = [];
    backgroundObjects = [];
    levelStart = 0;
    levelEnd = 0;
    bottles = [];

    constructor(enemies, clouds, backgroundObjects, levelEnd, bottleAmount) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.levelEnd = levelEnd;
        this.addBottles(bottleAmount)
    }

    addBottles(amount) {
        for (let i = 0; i < amount; i++) {
            this.bottles.push(new Bottle());
        }
    }

}