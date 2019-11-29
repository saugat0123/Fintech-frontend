import {AbstractControl, ValidatorFn} from '@angular/forms';

export class MinimumAmountValidator {
  static minimumAmountValidator(min: number): ValidatorFn {

    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && (isNaN(control.value) || control.value < min)) {
        return {'amountRange': true};
      }
      return null;
    };
  }
}
