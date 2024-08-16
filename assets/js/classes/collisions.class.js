class Collisions {
    /**
    * self function compares the hitboxes of the current movableobject with the hitboxes
    * of the provided object to determine if there is any overlap, indicating a collision.
    * @param {Object} obj - The object to check for collisions with.
    * @returns {boolean} - Returns true if a collision is detected, otherwise false.
    */

    static isColliding(self, obj) {
        return self.hitboxes.some(hitbox => {
            const leftArea = self.position.x + hitbox.x;
            const rightArea = leftArea + self.appearance.width - hitbox.width;
            const topArea = self.position.y + hitbox.y;
            const bottomArea = topArea + self.appearance.height - hitbox.height;
            return obj.hitboxes.some(objHitbox => {
                const objLeftArea = obj.position.x + objHitbox.x;
                const objRightArea = objLeftArea + obj.appearance.width - objHitbox.width;
                const objTopArea = obj.position.y + objHitbox.y;
                const objBottomArea = objTopArea + obj.appearance.height - objHitbox.height;
                if (rightArea >= objLeftArea && leftArea <= objRightArea && topArea <= objBottomArea && bottomArea >= objTopArea) {
                    return true;
                }
                return false;
            });
        });
    }


    /**
     * Compares the players hitboxes with every enemy. 
     * When the player is falling, the enemy will die, otherwise the player will recive dmg.
     * @param {Object} self - instance of the world
     */
    static enemyCollisions(self) {
        self.level.enemies.forEach(enemy => {
            if (this.isColliding(self.player, enemy) && !enemy.isDead) {
                if (self.player.appearance.currentStyle !== 'falling') {
                    self.player.reciveDamage(1);
                } else {
                    self.player.bounce(enemy);
                    enemy.reciveDamage(100);
                }
            }
        });
    }

    static coinCollisions(self) {
        self.level.coins.forEach(coin => {
            if (this.isColliding(self.player, coin)) {
                Coin.collect(coin);
            }
        });
    }

    static bottleCollisions(self) {
        self.level.bottles.forEach(bottle => {
            if (this.isColliding(self.player, bottle)) {
                Bottle.collect(bottle);
            }
        });
    }

    static throwableObjectCollision(self) {
        self.level.throwableObjects.forEach(bottle => {
            if (bottle.appearance.currentStyle !== 'splash') {
                if (bottle.position.y < bottle.position.ground) {
                    self.level.enemies.forEach(enemy => {
                        if (this.isColliding(bottle, enemy) && !enemy.isDead) {
                            enemy.reciveDamage(100);
                            bottle.setAppearanceTo('splash', 0)
                        }
                    });
                } else {
                    bottle.hitsGround();
                }
            }
        });
    }
}