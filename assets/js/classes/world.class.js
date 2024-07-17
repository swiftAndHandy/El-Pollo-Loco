class World {
    ctx = null;

    keyboard = new Keyboard();
    gamepad = new Gamepad();

    speedLimiter = 30;

    camera = {
        x: 0,
        y: null,
    };

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
        preventPause: false,
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
        // setInterval(() => {
        //     console.log(this.time.preventPause);
        // }, 1);
        this.draw();
    }

    pause() {
        if (!this.time.preventPause) {
            this.time.paused = !this.time.paused;
        }
        return this.time.paused;
    }

    checkForEndOfPause() {
        const gamepadUsed = this.gamepad.checkInput();
        !gamepadUsed && this.keyboard.handlePauseMenu();
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

    updateCamera() {
        this.camera.x = -this.character.position.x;
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
        } else {
            this.checkForEndOfPause();
        }
    }

    getInputs() {
        const gamepadUsed = this.gamepad.checkInput();
        !gamepadUsed && this.keyboard.handleKeyboardInput();
    }

    drawWorld() {
        this.updateCamera(); this.ctx.translate(this.camera.x, 0);
        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.updateCamera(); this.ctx.translate(-this.camera.x, 0);
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
        if (mo.appearance.mirrored) {
            this.ctx.save();
            this.ctx.translate(mo.appearance.width, 0);
            this.ctx.scale(-1, 1);
            mo.position.x *= -1;
        }
        this.ctx.drawImage(mo.appearance.img, mo.position.x, mo.position.y, mo.appearance.width, mo.appearance.height);
        if (mo.appearance.mirrored) {
            mo.position.x *= - 1;
            this.ctx.restore();
        }
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