import {AbstractControl, ValidatorFn} from '@angular/forms';

export class CustomValidator {
    static notEmpty(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const isEmpty = control.value === undefined || control.value === null || control.value.toString().trim().length <= 1;
            return isEmpty ? {'empty': {value: control.value}} : null;
        };
    }
}
