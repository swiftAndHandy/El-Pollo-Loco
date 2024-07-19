class World {
    ctx = null;

    keyboard = new Keyboard();
    gamepad = new Gamepad();

    // speedLimiter = 30;

    camera = {
        x: 0,
        y: 0,
        offset: 150,
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
    enemies = level1.enemies;
    clouds = level1.clouds;
    backgroundObjects = level1.backgroundObjects;


    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.framerate.msPerFrame = 1000 / this.framerate.fps;
        this.time.msPrev = window.performance.now();
        // this.speedLimiter = this.framerate.fps / this.speedLimiter;
        // setInterval(() => {
        //     console.log(this.framerate.frame);
        // }, 1000);
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

    updateCamera(state) {
        this.camera.x = -this.character.position.x;
        if (state === 1) {
            this.ctx.translate(this.camera.x + this.camera.offset, 0);
        } else if (state === 0) {
            this.ctx.translate(-this.camera.x - this.camera.offset, 0);
        }
    }


    draw() {
        this.requestFrame();
        this.setUpTime();
        if (this.time.msPassed < this.framerate.msPerFrame) return;
        if (!this.time.paused) {
            this.updateTime();
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.drawWorld();
            this.getInputs();
            this.animateWorld();
        } else {
            this.checkForEndOfPause();
        }
    }

    getInputs() {
        const gamepadUsed = this.gamepad.checkInput();
        !gamepadUsed && this.keyboard.handleKeyboardInput();
    }

    drawWorld() {
        this.updateCamera(1);
        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.updateCamera(0);
    }

    animateWorld() {
        this.animateObjects(this.clouds);
        this.animate(this.character);
        this.animateObjects(this.backgroundObjects);
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