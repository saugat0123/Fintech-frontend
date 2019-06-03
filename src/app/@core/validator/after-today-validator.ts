import {AbstractControl} from '@angular/forms';

export class AfterTodayValidator {
    static isValid(control: AbstractControl): { [key: string]: boolean } | null {
        const valueString = control.value;
        console.log(valueString);
        const value = new Date(valueString);

        console.log(value);

        if (value < new Date()) {
            console.log(valueString);
            return {afterToday: valueString};
        }
        return null;
    }
}
