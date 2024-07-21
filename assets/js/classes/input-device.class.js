class InputDevice {

    buttonsWithCooldown = {
        jump: false,
        throw: false,
    }

    /**
     * if the current style is one of the allowed styles, there is no reason to block the appearance switch
     * @returns {boolean}
     */
    noImportantStyle() {
        const allowedStyles = [
            'longIdle', 
            'idle', 
            'walking',
        ];
        return allowedStyles.includes(world.character.appearance.currentStyle);
    }

}