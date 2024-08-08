class Character extends MovableObject {
    stats = {
        health: 100,
    }

    constructor(width, height) {
        super(width, height)
    }

    reciveDamage(value) {
        this.stats.health -= value;
        if (this.stats.health < 0) {
            this.stats.health = 0;
        }
    }
}