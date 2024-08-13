class Coin extends CollectableItem {

    ANIMATION = [
        'assets/img/8_coin/coin_1.png',
        'assets/img/8_coin/coin_2.png',
    ];

    constructor(x, y) {
        super();
        this.appearance.width = 120;
        this.appearance.height = 120;
        this.position.x = x;
        this.position.y = y;
        this.type = 'coins';
        this.hitboxes.push(new Hitbox(40, 40, 80, 80));
        this.cacheImage(this.ANIMATION); delete this.ANIMATION;
    }

    static addCoins(amount, toLevel) {
        let lastPosition = 0;
        for (let i = 0; i < amount; i++) {
            const x = lastPosition + Math.ceil(Math.random() * 150) + 40;
            const y = Math.floor(Math.random() * 200 + 100);
            lastPosition = x;
            toLevel.coins.push(new Coin(x, y));
        }
    }

    static collect(self) {
        const index = world.level.coins.indexOf(self);
        world.level.coins.splice(index, 1)
        world.player.stats.coins++;
           
    }
}