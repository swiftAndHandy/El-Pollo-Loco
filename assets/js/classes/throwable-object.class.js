class ThrowableObject extends MovableObject {

    speed = {
        x: 30,
        y: 10,
    }

    static throwBottle() {
        const x = world.player.position.x;
        const y = world.player.position.y;
        world.level.throwableObjects.push(new ThrowableObject(x, y));
    }


}