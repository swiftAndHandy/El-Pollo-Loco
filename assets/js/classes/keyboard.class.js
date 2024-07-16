class Keyboard {

    keys = {
        direction: [],
        shift: false,
        enter: false,
        space: false,
    }


    constructor() {
        document.addEventListener('keydown', (event) => {
            this.setInput(event);
        });

        document.addEventListener('keyup', (event) => {
            this.removeInput(event);
        });
    }

    setInput(event) {
        if (event.code === 'KeyA' || event.code === 'KeyD') {
            if(this.keys.direction.indexOf(event.code) === -1) {
                this.keys.direction.push(event.code);
            }
        }

        if (event.key === 'Shift') {
            this.keys.shift = true;
        }
    }

    removeInput(event) {
        if (event.code === 'KeyA' || event.code === 'KeyD') {
            let index = this.keys.direction.indexOf(event.code);
            this.keys.direction.splice(index, 1);
        }

        if (event.key === 'Shift') {
            this.keys.shift = false;
        }
    }

    handleKeyboardInput() {
        // if (this.keys.direction.at(-1) === 'KeyA') {
        //     world.character.moveLeft();
        // } else if (this.keys.direction.at(-1) === 'KeyD') {
        //     world.character.moveRight();
        // } else {
        //     world.character.stopMovement();
        // }

        world.character.abilities.run = this.keys.shift ? true : false; 
    }
}