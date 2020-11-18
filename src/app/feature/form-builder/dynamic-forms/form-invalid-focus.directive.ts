import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
    selector: '[appFormInvalidFocus]'
})
export class FormInvalidFocusDirective {

    constructor(private el: ElementRef) {
    }

    @HostListener('submit')
    onFormSubmit() {
        const invalidControl = this.el.nativeElement.querySelector('.is-invalid');
        if (invalidControl) {
            invalidControl.scrollIntoView({
                behavior: 'smooth'
            });
            invalidControl.focus();
        }
    }
}


