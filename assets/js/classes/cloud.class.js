class Cloud extends MovableObject {

    constructor(x, y) {
        super(300, 200).loadImage('assets/img/5_background/layers/4_clouds/1.png');
        this.position.x = Math.random() * canvas.width;
        this.position.y = 25;
    }

}