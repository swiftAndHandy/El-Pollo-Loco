/**
 * Prevent Context-Menu
 */

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[block-context]').forEach(element => {
        if (element.getAttribute('block-context') === 'true') {
            console.log(element.getAttribute('block-context'));
            element.addEventListener('contextmenu', function (event) {
                event.preventDefault();
            }, false);
        }
    })
})