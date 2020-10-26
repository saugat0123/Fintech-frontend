import {AbstractControl, FormControl, ValidationErrors} from '@angular/forms';

export class WhiteSpaceValidation {

  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if (control && control.value && (control.value as string).match('\\s')) {
      return {cannotContainSpace: true};
    }

    return null;
  }


}
