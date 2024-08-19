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

    DAMAGED = [
        './assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        './assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        './assets/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    isFighting = false;

    constructor() {
        super(280, 280);
        this.cacheImage('walking', this.WALKING_ANIMATION); delete this.WALKING_ANIMATION;
        this.appearance.alerta = []; this.appearance.currentStyle = 'walking';
        this.cacheImage('alerta', this.ALERT_ANIMATION); delete this.ALERT_ANIMATION;
        this.position.x = 300; this.position.y = 160; // x 3200
        this.velocity.xMax = 2; this.acceleration.x = 0.3;
        this.hitboxes.push(new Hitbox(20, 50, 170, 180, true));
    }

    animate() {
        const animationType = this.appearance.currentStyle;
        this.playAnimation(animationType);

        if (this.isFighting) {
            this.setAppearanceTo('walking');
            this.moveLeft();
        }
    }
}