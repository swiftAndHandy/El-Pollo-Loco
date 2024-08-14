class Level {

    enemies = [];
    clouds = [];
    backgroundObjects = [];
    levelStart = 0;
    levelEnd = 0;
    bottles = [];
    coins = [];
    throwableObjects = [];
    cutsceneTriggered = false;

    constructor(worldSize, chicks, chicken, boss, clouds, backgroundObjects, levelEnd, bottleAmount, coinAmount) {
        this.worldSize = worldSize;
        this.addEnemies(chicks, chicken, boss);
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.levelEnd = levelEnd;
        Coin.addCoins(coinAmount, this);
        Bottle.addBottles(bottleAmount, this);
    }

    static triggerCutscene() {
        if (world.level.cutsceneTriggered === false && world.player.position.x > 2900) { // 2800
            world.camera.cutscenePlays = true;
            world.level.cutsceneTriggered = true;
            Audioplayer.startSFX(world.player, 'cutscene', false);
            setTimeout(() => {
                world.camera.cutscenePlays = false;
            }, 3800);
        }
    }

    static lastCoinPosition() {
        const lastCoin = world.level.coins.length - 1;
        const posX = world.level.coins[lastCoin].position.x;
        return posX;
    }

    static remove(self) {
        const index = world.level[self['type']].indexOf(self)
        world.level.enemies.splice(index, 1)
    }

    addEnemies(chicks, chicken, boss) {
        for (let i = 0; i < chicks; i++) {
            this.enemies.push(new Chick(this.worldSize));
        }
        for (let i = 0; i < chicken; i++) {
            this.enemies.push(new Chicken(this.worldSize));
        }
        for (let i = 0; i < boss; i++) {
            this.enemies.push(new ElGallonatorBoss);
        }
    }
}