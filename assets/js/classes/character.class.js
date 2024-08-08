class Character extends MovableObject {
    isDead = false;

    stats = {
        health: 100,
    }

    constructor(width, height) {
        super(width, height)
    }

    reciveDamage(value) {
        if (!this.isDead) {
            this.stats.health -= value;
            if (this.stats.health <= 0) {
                this.isDying();
            }
        }
    }

    isDying() {
        if (!this.isDead) {
            this.setAppearanceTo('dead', 0);
            this.isDead = true;
        }
    }
}