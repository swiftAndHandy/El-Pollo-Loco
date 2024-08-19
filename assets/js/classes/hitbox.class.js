class Hitbox {

    y = 0;
    width = 0;
    height = 0;
    x = 0;

    invincible = false;

    constructor(l = 0, t = 0, r = 0, b = 0, invincible = false) {
        this.x = l;
        this.y = t;
        this.width = r;
        this.height = b;
        this.invincible = invincible;
    }
}