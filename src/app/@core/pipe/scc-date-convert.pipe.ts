import { Pipe, PipeTransform } from '@angular/core';
import {ObjectUtil} from '../utils/ObjectUtil';

@Pipe({
  name: 'sccDateConvert'
})
export class SccDateConvertPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (ObjectUtil.isEmpty(value)) {
      return;
    }
    return value.split('/').pop().substring(0, 10).replaceAll('.', '-');
  }

}
