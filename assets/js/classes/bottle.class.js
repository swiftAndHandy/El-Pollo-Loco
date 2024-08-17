class Bottle extends CollectableItem {

    ANIMATION = [
        './assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        './assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
    ];

    sounds = {
        collected: Object.assign(new Audio('./assets/audio/collectables/bottle_collected.wav'), { loop: false, volume: 0.1 }),
    };

    constructor(x, y) {
        super();
        this.appearance.width = 110;
        this.appearance.height = 110;
        this.position.x = x;
        this.position.y = y;
        this.type = 'bottles';
        this.hitboxes.push(new Hitbox(30,20, 50, 30));
        this.cacheImage(this.ANIMATION); delete this.ANIMATION;
    }


    /**
     * 
     * @param {number} amount - the amount of bottles that should be generated
     * @param {Object} toLevel - the Level-Object that is targeted
     * @param {number} positionModification - in some situations (e. g. Bottle-Respawn last Position does not work,
     *                                       so you can submit another modificator)
     */
    static addBottles(amount, toLevel, positionModification = 0) {
        let lastPosition = 0;
        for (let i = 0; i < amount; i++) {
            let x = positionModification == 0 ? positionModification + lastPosition + Math.ceil(Math.random() * 200) + 300 : Math.ceil(Math.random() * 100 * positionModification);
            if (x > 3000) x = Math.ceil(Math.random() * positionModification); 
            const y = 320;
            lastPosition = x;
            toLevel.bottles.push(new Bottle(x, y));
            console.log(x, y);
            
        }
    }

    /**
     * 
     * @param {Object} self - Adds the Object to the Players Item-Bool and removes it from the map
     */
    static collect(self) {
        const index = world.level.bottles.indexOf(self);
        world.level.bottles.splice(index, 1)
        world.player.stats.bottles++;
        Audioplayer.startSFX(self, 'collected', false);
    }

}