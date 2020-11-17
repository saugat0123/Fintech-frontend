import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
    selector: '[appMouseScrollDisable]'
})
export class MouseScrollDisableDirective {

    constructor(private el: ElementRef) {
    }

    @HostListener('focus', ['$event.target'])
    onFocus(target) {
        console.log(target.value);
    }

    @HostListener('blur', ['$event.target'])
    onBlur(target) {
        console.log(target.value);

    }

    @HostListener('input', ['$event.target.value'])
    onInput(value) {
        console.log(value);

    }

}
