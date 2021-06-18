import {Directive, HostListener} from '@angular/core';

@Directive({
    selector: '[appMouseScrollDisable]'
})
export class MouseScrollDisableDirective {

    constructor() {
    }

    @HostListener('click', ['$event.target'])
    onClick(target) {
        const ele: HTMLElement = target;
        if (ele.tagName.toLocaleLowerCase() === 'input') {
            this.disableMouseEventOnScrollAndKeyUpAndDown(target);
        }

    }

    @HostListener('input', ['$event.target'])
    onInput(target) {
        this.disableMouseEventOnScrollAndKeyUpAndDown(target);

    }


    disableMouseEventOnScrollAndKeyUpAndDown(target) {
        const key = {};
        target.addEventListener('mousewheel',
            function () {
                this.blur();
            });
        // target.addEventListener('keydown', function (e) {
        //     key[e.keyCode] = true;
        //     switch (e.keyCode) {
        //         case 38:
        //         case 40:
        //             e.preventDefault();
        //             break;
        //         default:
        //             break;
        //     }
        // }, false);
        //
        // target.addEventListener('keyup', function (e) {
        //     key[e.keyCode] = false;
        // }, false);
    }

}
