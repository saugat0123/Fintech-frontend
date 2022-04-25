import { Pipe, PipeTransform } from '@angular/core';
import {ObjectUtil} from '../utils/ObjectUtil';

@Pipe({
  name: 'wordNumbering'
})
export class WordNumberingPipe implements PipeTransform {
  numbersObject: { [x: string]: string } = {
    1: 'First',
    2: 'Second',
    3: 'Third',
    4: 'Fourth',
    5: 'Fifth',
    6: 'Sixth',
    7: 'Seventh',
    8: 'Eighth',
    9: 'Ninth',
    0: 'Tenth',
    11: 'Eleventh',
    12: 'Twelveth',
  };
  transform(value: any, ...args: any[]): any {
    if (ObjectUtil.isEmpty(value)) {
      return null;
    } else {
      return this.numbersObject[value];
    }
  }

}
