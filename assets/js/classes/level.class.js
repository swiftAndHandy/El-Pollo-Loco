class Level {

    enemies = [];
    clouds = [];
    backgroundObjects = [];
    levelStart = 0;
    levelEnd = 0;
    bottles = [];
    coins = [];

    constructor(enemies, clouds, backgroundObjects, levelEnd, bottleAmount, coinAmount) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.levelEnd = levelEnd;
        this.addBottles(bottleAmount);
        Coin.addCoins(coinAmount, this);
    }

    static remove(self) {
        const index = world.level[self['type']].indexOf(self)
        world.level.enemies.splice(index, 1)
    }

    addBottles(amount) {
        for (let i = 0; i < amount; i++) {
            this.bottles.push(new Bottle());
        }
    }
}