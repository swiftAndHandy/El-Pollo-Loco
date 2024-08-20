class UIElements {
    health = {
        design: new Image(),
        posX: 10,
        posY: -5,
        width: 75,
        height: 75,
    };
    coins = {
        design: new Image(),
        posX: 80,
        posY: 0,
        width: 75,
        height: 75,
    };
    bottles = {
        design: new Image(),
        posX: 180,
        posY: 5,
        width: 75,
        height: 75,
    };

    bossHealth = {
        design: new Image(),
        posX: 220,
        posY: 400,
        width: 280,
        height: 75,
    };

    constructor() {
        this.health.design.src = './assets/img/7_statusbars/3_icons/icon_health.png';
        this.coins.design.src = './assets/img/7_statusbars/3_icons/icon_coin.png';
        this.bottles.design.src = './assets/img/7_statusbars/3_icons/icon_salsa_bottle.png';
        this.bossHealth.design.src = './assets/img/7_statusbars/2_statusbar_endboss/green/green100.png';
    }

    calcOffset() {
        return world.player.position.x - world.camera.offset;
    }

    update() {
        world.ctx.drawImage(this.health.design, this.health.posX + this.calcOffset(), this.health.posY, this.health.width, this.health.height);
        world.ctx.drawImage(this.coins.design, this.coins.posX + this.calcOffset(), this.coins.posY, this.coins.width, this.coins.height);
        world.ctx.drawImage(this.bottles.design, this.bottles.posX + this.calcOffset(), this.bottles.posY, this.bottles.width, this.bottles.height);
        this.updateBossBar();
        world.ctx.fillStyle = 'white';
        world.ctx.fillText(world.player.stats.health, this.health.posX + this.calcOffset() + 27, 55);
        world.ctx.fillText(world.player.stats.coins, this.coins.posX + this.calcOffset() + 70, 52);
        world.ctx.fillText(world.player.stats.bottles, this.bottles.posX + this.calcOffset() + 60, 52);
    }

    updateBossBar() {
        Level.getBoss().isFighting && world.ctx.drawImage(this.bossHealth.design, this.bossHealth.posX + this.calcOffset(), this.bossHealth.posY, this.bossHealth.width, this.bossHealth.height);
        if (Level.getBoss().stats.health === 400) {
            this.bossHealth.design.src = './assets/img/7_statusbars/2_statusbar_endboss/green/green100.png';
        } else if (Level.getBoss().stats.health === 300) {
            this.bossHealth.design.src = './assets/img/7_statusbars/2_statusbar_endboss/green/green75.png';
        } else if (Level.getBoss().stats.health === 200) {
            this.bossHealth.design.src = './assets/img/7_statusbars/2_statusbar_endboss/green/green50.png';
        } else if (Level.getBoss().stats.health === 100) {
            this.bossHealth.design.src = './assets/img/7_statusbars/2_statusbar_endboss/green/green25.png';
        } else {
            this.bossHealth.design.src = './assets/img/7_statusbars/2_statusbar_endboss/green/green0.png';
        }
    }
}