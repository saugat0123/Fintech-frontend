import {AbstractControl} from '@angular/forms';

export class BeforeTodayValidator {
    static tenureValidator(control: AbstractControl): { [key: string]: boolean } | null {
        const dateString = control.value;
        const newDate = new Date(dateString);
        if (newDate < new Date()) {
            return {invalidTenure: true};
        }
        return null;
    }
}