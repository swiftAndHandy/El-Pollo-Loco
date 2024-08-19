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
        if (world.level.cutsceneTriggered === false && world.player.position.x > 2800) { // 2800
            world.pause();
            world.camera.cutscenePlays = true;
            world.level.cutsceneTriggered = true;
            Audioplayer.startSFX(world.player, 'cutscene', false);
            setTimeout(() => {
                Audioplayer.fade('in', MUSIC.boss, 1);
                world.camera.cutscenePlays = false;
                world.pause();
                // Level.setBossAppearance('walking');
                Level.triggerBossfight();
            }, 3800);
        }
    }

    static lastCoinPosition() {
        const lastCoin = world.level.coins.length - 1;
        const posX = world.level.coins[lastCoin].position.x;
        return posX;
    }

    static remove(self) {
        const type = self['type'];
        const index = world.level[type].indexOf(self)
        world.level[type].splice(index, 1)
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

    /**
     * Boss is the last Enemy on enemies-Array. Activate the fight.
     */
    static triggerBossfight() {
        const boss = world.level.enemies[world.level.enemies.length - 1];
        boss.isFighting = true;

    }
}