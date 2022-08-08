import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appDocNameValidator]'
})
export class DocNameValidatorDirective {
  private regex: RegExp = new RegExp(/^[\s0-9A-Za-z()--:/]+$/);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'Arrows'];
  constructor(private el: ElementRef) {}
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
