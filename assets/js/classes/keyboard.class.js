class Keyboard {

    keys = {
        w: false,
        a: false,
        d: false,
        enter: false,
        space: false,
        directionBuffer: null,
    }


    constructor() {
        document.addEventListener('keypress', (event) =>
        {
            this.checkInput(event);
        })
    }

    checkInput(event) {
        console.log(event);
    }
}