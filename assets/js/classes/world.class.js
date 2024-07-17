class World {
    ctx = null;

    keyboard = new Keyboard();
    gamepad = new Gamepad();

    speedLimiter = 30;

    framerate = {
        fps: 60, 
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

    character = new Character();
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
        this.speedLimiter = this.framerate.fps / this.speedLimiter;
        // setInterval(() => {
        //     console.log(this.framerate.frame);
        // }, 1000);
        this.draw();
    }

    setLastInput() {
        this.character.lastFrameOfMovement = this.framerate.frame;
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

    requestFrame() {
        window.requestAnimationFrame(() => {
            this.draw();
        });
    }


    draw() {
        this.requestFrame();
        this.setUpTime();
        if (this.time.msPassed < this.framerate.msPerFrame) return;
        if (!this.time.paused) {
            this.updateTime();
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.drawWorld();
            this.animateWorld();
            this.getInputs();
        }
    }

    getInputs() {
        const gamepadUsed = this.gamepad.checkInput();
        !gamepadUsed && this.keyboard.handleKeyboardInput();
    }

    drawWorld() {
        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.clouds);
        this.addObjectsToMap(this.enemies);
        this.addToMap(this.character);
    }

    animateWorld() {
        this.animateObjects(this.clouds);
        this.animate(this.character);
        this.animateObjects(this.enemies);
    }


    addObjectsToMap(object) {
        object.forEach(o => {
            this.addToMap(o);
        })
    }

    addToMap(mo) {
        this.ctx.drawImage(mo.appearance.img, mo.position.x, mo.position.y, mo.appearance.width, mo.appearance.height);
    }

    animateObjects(object) {
        object.forEach(o => {
            o.animate();
        });
    }

    animate(target) {
        target.animate();
    }


}