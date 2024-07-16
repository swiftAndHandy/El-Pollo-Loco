class World {
    ctx = null;

    gamepad = new Gamepad();

    framerate = {
        fps: 30,
        msPerFrame: 0,
        frame: 0,
    }

    time = {
        msNow: null,
        msPrev: window.performance.now(),
        msPassed: null,
        bufferTime: null,
        paused: false,
    }

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
        this.framerate.msPerFrame = 1000 / this.framerate.fps;
        this.time.msPrev = window.performance.now();
        // setInterval(() => {
        //     console.log(this.framerate.frame);
        // }, 1000);
        this.draw();
    }

    pause() {
        this.time.paused = !this.time.paused;
    }

    setUpTime() {
        this.time.msNow = window.performance.now();
        this.time.msPassed = this.time.msNow - this.time.msPrev;
    }

    updateTime() {
        this.time.bufferTime = this.time.msPassed % this.framerate.msPerFrame;
        this.time.msPrev = this.time.msNow - this.time.bufferTime;
        this.framerate.frame++;
    }


    draw() {
        window.requestAnimationFrame(() => {
            this.draw();
        });

        this.setUpTime();
        if (this.time.msPassed < this.framerate.msPerFrame) return;
        if (!this.time.paused) {
            this.updateTime();

            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.addObjectsToMap(this.backgroundObjects);
            this.addObjectsToMap(this.clouds);
            this.addObjectsToMap(this.enemies);
            this.addToMap(this.character);
            this.animate(this.clouds);

            this.gamepad.checkGamepad();
        }
    }


    addObjectsToMap(object) {
        object.forEach(o => {
            this.addToMap(o);
        })
    }

    addToMap(mo) {
        this.ctx.drawImage(mo.appearance.img, mo.position.x, mo.position.y, mo.appearance.width, mo.appearance.height);
    }

    animate(object) {
        object.forEach(o => {
            o.animate();
        });
    }


}