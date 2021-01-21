import { Pipe, PipeTransform } from '@angular/core';
import {ObjectUtil} from './ObjectUtil';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: string, regexValue: string, replaceValue: string): any {
    const regex = new RegExp(regexValue, 'g');
    if(ObjectUtil.isEmpty(value)){
      return value;
    }
    return value.replace(regex, replaceValue);
  }

}
