import {FormArray} from '@angular/forms';
import {ObjectUtil} from './ObjectUtil';

export class FormUtils {
  /**
   * Returns false if formArray any elements is null or '' or undefined.
   * @param formArray contains form arrays to be checked
   * @param excludeProperties is array of property to be excluded
   */

 public static checkEmptyProperties(formArray: FormArray , ...excludeProperties) {
    let invalid = false;
    for (const control of formArray.value) {
      const d = Object.entries(control).filter(value => {
        return ObjectUtil.isEmpty(value[1]);
      });
      if (d.length > 0) {
        invalid = true;
        break;
      }
    }
    return invalid;
  }

     static isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

}
