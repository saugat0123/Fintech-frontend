import {
    NG_VALIDATORS,
    FormControl,
    ValidatorFn,
    Validator
} from '@angular/forms';

import { Directive } from '@angular/core';

@Directive({
    selector: '[app-valid-email][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: EmailValidatorDirective,
            multi: true
        }
    ]
})
export class EmailValidatorDirective implements Validator {
    validator: ValidatorFn;
    constructor() {
        this.validator = this.validEmail();
    }
    validate(c: FormControl) {
        return this.validator(c);
    }

    validEmail(): ValidatorFn {
        return (c: FormControl) => {
            const isValid = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(c.value);
            if (isValid) {
                return null;
            } else {
                return {
                    validEmail: {
                        valid: false
                    }
                };
            }
        };
    }
}
