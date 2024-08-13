class Coin extends CollectableItem {

    ANIMATION = [
        'assets/img/8_coin/coin_1.png',
        'assets/img/8_coin/coin_2.png',
    ];

    constructor() {
        super();
        this.appearance.width = 50;
        this.appearance.height = 50;
        this.position.x = 50;
        this.position.y = 250;
        this.type = 'coins';
        this.hitboxes.push(new Hitbox(10, 10, 20, 20));
        this.cacheImage(this.ANIMATION); delete this.ANIMATION;
    }

    static addCoins(amount, toLevel) {
        // while (amount > 0) {
        //     if (amount >= 5) {
        //         const pattern = Math.floor(Math.random()*5);
        //         console.log(pattern);
        //         amount -= pattern;
                
        //     } else {
        //         amount--;
        //     }
        // }
        for (let i = 0; i < amount; i++) {
            toLevel.coins.push(new Coin());
        }
    }
}