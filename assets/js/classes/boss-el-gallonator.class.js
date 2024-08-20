class ElGallonatorBoss extends Enemy {

    WALKING_ANIMATION = [
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    ALERT_ANIMATION = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
    ];

    DAMAGE_ANIMATION = [
        './assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        './assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        './assets/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    ATTACK_ANIMATION = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    DEAD_ANIMATION = [
        './assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        './assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        './assets/img/4_enemie_boss_chicken/4_hurt/G23.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    sounds = {
        dying: Object.assign(new Audio('./assets/audio/chicken/chicken_dead_1.mp3'), { loop: false, volume: 0.2 }),
        damaged: [
            Object.assign(new Audio('./assets/audio/pepe/damaged1.mp3'), { loop: false, volume: 1 }),
            Object.assign(new Audio('./assets/audio/pepe/damaged2.mp3'), { loop: false, volume: 1 }),
            Object.assign(new Audio('./assets/audio/pepe/damaged3.mp3'), { loop: false, volume: 1 }),
        ],
    };

    isFighting = false;

    constructor() {
        super(280, 280);
        this.appearance.currentStyle = 'alerta';
        this.cacheImage('walking', this.WALKING_ANIMATION); delete this.WALKING_ANIMATION;
        this.appearance.alerta = [];
        this.cacheImage('alerta', this.ALERT_ANIMATION); delete this.ALERT_ANIMATION;
        this.appearance.idle = this.appearance.alerta;
        this.appearance.damaged = [];
        this.cacheImage('damaged', this.DAMAGE_ANIMATION); delete this.DAMAGE_ANIMATION;
        this.appearance.attacking = [];
        this.cacheImage('attacking', this.ATTACK_ANIMATION); delete this.ATTACK_ANIMATION;
        this.appearance.dead = [];
        this.cacheImage('dead', this.DEAD_ANIMATION); delete this.DEAD_ANIMATION;
        this.position.x = 3500; this.position.y = 160; // x 3200 3500cs
        this.velocity.xMax = 2.5; this.acceleration.x = 0.15;
        this.hitboxes.push(new Hitbox(20, 50, 200, 180), new Hitbox(40, 150, 70, 160, true), new Hitbox(100, 100, 110, 230, true));
        this.stats.health = 400;
        this.stats.shadowHealth = 0;
        this.iFrames.duration = 60;
        this.abilities.run = false; this.abilities.runBonus = 1.1;
    }

    move() {
        if (!this.appearance.mirrored) {
            if (this.position.x >= world.player.position.x - world.player.appearance.width * 2 && this.position.x > 30) {
                this.setAppearanceTo('walking');
                this.moveLeft();
            } else if (world.player.position.x > 150) {
                this.appearance.mirrored = true;
            }
        } else {
            if (this.position.x <= world.player.position.x + world.player.appearance.width / 3) {
                this.setAppearanceTo('walking');
                this.moveRight();
            } else {
                this.appearance.mirrored = false;
            }
        }
    }

    animate() {
        const animationType = this.appearance.currentStyle;
        const updateRequired = this.playAnimation(animationType);

        if (this.isFighting && this.currentAppearance() !== 'damaged' && this.currentAppearance() !== 'dead') {
            this.move();
        }

        if (this.lastFrameOfAnimation() && this.currentAppearance() === 'dead' && !world.gameOver) {
            World.gameOver(50);
        }
    }
}