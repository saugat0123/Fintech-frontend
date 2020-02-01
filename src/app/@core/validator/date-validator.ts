import {AbstractControl} from '@angular/forms';

export class DateValidator {
    static isValidAfter(control: AbstractControl): { [key: string]: boolean } | null {
        const valueString = control.value;
        const value = new Date(valueString);
        if (value < new Date()) {
            return {afterToday: valueString};
        }
        return null;
    }

    static isValidBefore(control: AbstractControl): { [key: string]: boolean } | null {
        const valueString = control.value;
        const value = new Date(valueString);
        if (value > new Date()) {
            return {beforeToday: valueString};
        }
        return null;
    }
}
