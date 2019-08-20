import {
  NG_VALIDATORS,
  FormControl,
  ValidatorFn,
  Validator
} from '@angular/forms';

import { Directive } from '@angular/core';

@Directive({
  selector: '[app-natural-number][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NaturalNumberValidatorDirective,
      multi: true
    }
  ]
})
export class NaturalNumberValidatorDirective implements Validator {
  validator: ValidatorFn;
  constructor() {
    this.validator = this.validNumber();
  }
  validate(c: FormControl) {
    return this.validator(c);
  }

  validNumber(): ValidatorFn {
    return (c: FormControl) => {
      const isValid = /^[1-9][0-9]*$/.test(c.value);
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

