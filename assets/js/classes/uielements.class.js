class UIElements {
    health = {
        design: new Image(),
        posX: 0,
        posY: 0,
        width: 75,
        height: 75,
    };
    coins = {
        design: new Image(),
        posX: 75,
        posY: 0,
        width: 75,
        height: 75,
    };
    bottles = {
        design: new Image(),
        posX: 150,
        posY: 0,
        width: 75,
        height: 75,
    };

    bossHealth = {
        design: new Image(),
        posX: 750,
        posY: 750,
        width: 75,
        height: 75,
    };

    constructor() {
        this.health.design.src = './assets/img/7_statusbars/3_icons/icon_health.png';
        this.coins.design.src = './assets/img/7_statusbars/3_icons/icon_coin.png';
        this.bottles.design.src = './assets/img/7_statusbars/3_icons/icon_salsa_bottle.png';
        this.bossHealth.design.src = './assets/img/7_statusbars/3_icons/icon_health_endboss.png';
    }

    calcOffset() {
        return world.player.position.x - world.camera.offset;
    }

    update() {
        world.ctx.drawImage(this.health.design, this.health.posX + this.calcOffset(), this.health.posY, this.health.width, this.health.height);
        world.ctx.drawImage(this.coins.design, this.coins.posX + this.calcOffset(), this.coins.posY, this.coins.width, this.coins.height);
        world.ctx.drawImage(this.bottles.design, this.bottles.posX + this.calcOffset(), this.bottles.posY, this.bottles.width, this.bottles.height);
        world.ctx.drawImage(this.bossHealth.design, this.bossHealth.posX + this.calcOffset(), this.bossHealth.posY, this.bossHealth.width, this.bossHealth.height);
    }
}