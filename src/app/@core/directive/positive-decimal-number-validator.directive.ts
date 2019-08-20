import {FormControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';
import {Directive} from '@angular/core';

@Directive({
    selector: '[app-positive-decimal-number][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: PositiveDecimalNumberValidatorDirective,
            multi: true
        }
    ]
})
export class PositiveDecimalNumberValidatorDirective implements Validator {
    validator: ValidatorFn;

    constructor() {
        this.validator = this.validNumber();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

    validNumber(): ValidatorFn {
        return (c: FormControl) => {
            const isValid = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(c.value);
            if (isValid) {
                return null;
            } else {
                return {
                    validNumber: {
                        valid: false
                    }
                };
            }
        };
    }
}
