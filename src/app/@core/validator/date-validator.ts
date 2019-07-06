import {AbstractControl} from '@angular/forms';

export class DateValidator {
    static isValid(control: AbstractControl): { [key: string]: boolean } | null {
        const valueString = control.value;
        const value = new Date(valueString);
        if (value < new Date()) {
            return {afterToday: valueString};
        } else if (value > new Date()) {
            return {beforeToday: valueString};
        }
        return null;
    }
}
