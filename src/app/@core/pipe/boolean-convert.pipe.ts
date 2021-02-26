import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'booleanConvert'
})
export class BooleanConvertPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value === true) {
      return 'Yes';
    } else {
      return 'No';
    }
  }

}
