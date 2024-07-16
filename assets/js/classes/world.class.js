class World {
    ctx = null;

    character = new Character(2, 40);
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
    ];
    clouds = [
        new Cloud(),
    ];
    backgroundObjects = [
        new BackgroundObject('assets/img/5_background/layers/air.png'),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png'),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png'),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png'),
    ];

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.draw();
    }

    pause() {
        this.time.paused = !this.time.paused;
    }


    draw() {
        window.requestAnimationFrame(() => {
            this.draw();
        });

        
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);

            this.addObjectsToMap(this.clouds);
            this.addObjectsToMap(this.backgroundObjects);
            this.addObjectsToMap(this.enemies);
            this.addToMap(this.character);
        
    }


    addObjectsToMap(object) {
        object.forEach(o => {
            this.addToMap(o);
        })
    }

    addToMap(mo) {
        this.ctx.drawImage(mo.appearance.img, mo.position.x, mo.position.y, mo.appearance.width, mo.appearance.height);
    }
}