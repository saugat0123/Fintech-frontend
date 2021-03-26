import { Pipe, PipeTransform } from '@angular/core';
import {ObjectUtil} from '../utils/ObjectUtil';

@Pipe({
  name: 'engToNepaliNumber'
})
export class EngToNepaliNumberPipe implements PipeTransform {
  numbersObject: { [x: string]: string } = {
    1: '१',
    2: '२',
    3: '३',
    4: '४',
    5: '५',
    6: '६',
    7: '७',
    8: '८',
    9: '९',
    0: '०',
    '.': '.',
    ',': ',',
    '/': '/',
    '-': '-',
  };
  transform(value: any, ...args: any[]): any {
    if (ObjectUtil.isEmpty(value)) {
      return '';
    }
    let nepNumber = '';
    for (let i = 0; i < value.length; i++) {
      if (this.numbersObject[value.charAt(i)]) {
        nepNumber += this.numbersObject[value.charAt(i)];
      }
    }

    return nepNumber;

  }

}
