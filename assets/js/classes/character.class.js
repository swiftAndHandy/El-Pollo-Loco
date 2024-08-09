class Character extends MovableObject {
    isDead = false;

    stats = {
        health: 100,
    }

    constructor(width, height) {
        super(width, height);
    }

    reciveDamage(value) {
        if (!this.isDead) {
            this.stats.health -= value;
            if (this.stats.health <= 0) {
                this.isDying();
            }
        }
    }

    bounce() {
        this.acceleration.isFalling = false;
        this.acceleration.isJumping = true; 
        this.position.bouncePeak = 60;  
        this.position.y = 150;
        this.velocity.y = 8;
    }

    isDying() {
        if (!this.isDead) {
            this.velocity.x = 0;
            this.setAppearanceTo('dead', 0);
            this.isDead = true;
        }
    }
}