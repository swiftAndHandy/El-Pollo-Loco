class ThrowableObject extends MovableObject {

    speed = {
        x: 30,
        y: 10,
    }

    generatedAtFrame = 0;

    constructor() {
        super();
        this.generatedAtFrame = world.framerate.frame;
    }

    static throwBottle() {
        const x = world.player.position.x;
        const y = world.player.position.y;
        const cooldownLength = 30;
        const cooldownFrame = ThrowableObject.lastBottle();
    
        
        if (ThrowableObject.throwAllowed(cooldownLength, cooldownFrame)) {
            world.level.throwableObjects.push(new ThrowableObject(x, y));
            console.log(world.level.throwableObjects);
        }
    }

    static lastBottle() {
        const index = world.level.throwableObjects.length - 1;
        if (index >= 0) {
            return world.level.throwableObjects[index].generatedAtFrame;
        } else {
            return 0;
        }
    }

    /**
     * 
     * @param {number} cooldownLength - Frames that have to be passed before a new Bottle can be thrown
     * @param {number} cooldownFrame - frame, when the last bottle was created
     * @returns {boolean} - true, when more frames are passed, than the cooldown lasts. also true, when no bottle was thrown during the 
     *                  duration of the cooldown right after the game started.
     */
    static throwAllowed(cooldownLength, cooldownFrame) {
        return world.framerate.frame >= cooldownFrame + cooldownLength || 
        world.framerate.frame < cooldownLength && world.level.throwableObjects.length === 0;
    }


}