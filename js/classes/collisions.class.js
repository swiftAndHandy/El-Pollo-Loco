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
            const rightArea = leftArea + self.appearance.width - Collisions.calculateCollisionOffset(self, hitbox.width);
            const topArea = self.position.y + hitbox.y;
            const bottomArea = topArea + self.appearance.height - hitbox.height;
            return obj.hitboxes.some(objHitbox => {
                const objInvincible = objHitbox.invincible;
                const objLeftArea = obj.position.x + objHitbox.x;
                const objRightArea = objLeftArea + obj.appearance.width - objHitbox.width;
                const objTopArea = obj.position.y + objHitbox.y;
                const objBottomArea = objTopArea + obj.appearance.height - objHitbox.height;
                if (rightArea >= objLeftArea && leftArea <= objRightArea &&
                    topArea <= objBottomArea && bottomArea >= objTopArea) {
                    if (self instanceof ThrowableObject && objInvincible) {
                        return false;
                    }
                    return true;
                }
                return false;
            });
        });
    }

/**
 * 
 * @param {Object} instance - instance of a object, that is able to collide.
 * @param {Number} hitbox - width of an Hitbox-Object, that is assigned to that instance.
 * @returns 
 */
static calculateCollisionOffset(instance, hitbox) {
    if (instance.appearance.mirrored) {
        return hitbox - 8;
    } else {
        return hitbox;
    }
}


    /**
     * Compares the players hitboxes with every enemy. 
     * When the player is falling, the enemy will die, otherwise the player will recive dmg.
     * @param {Object} self - instance of the world
     */
    static enemyCollisions(self) {
        self.level.enemies.forEach(enemy => {
            if (this.isColliding(self.player, enemy) && !enemy.isDead) {
                if (!self.player.abilities.jump.isAttacking || enemy instanceof ElGallonatorBoss) {
                    self.player.reciveDamage(1);
                } else {
                    if (!(enemy instanceof ElGallonatorBoss)) {
                        self.player.bounce(enemy);
                        enemy.reciveDamage(100);
                    }
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
                            if (enemy instanceof ElGallonatorBoss) {
                                enemy.velocity.xMax +=  0.3;
                            }
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