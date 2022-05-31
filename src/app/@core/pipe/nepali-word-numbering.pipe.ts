import { Pipe, PipeTransform } from '@angular/core';
import {ObjectUtil} from '../utils/ObjectUtil';

@Pipe({
  name: 'nepaliWordNumbering'
})
export class NepaliWordNumberingPipe implements PipeTransform {
  numbersObject: {[x: string]: string} = {
    1: 'पहिलो',
    2: 'दोस्रो',
    3: 'तेस्रो',
    4: 'चौथो',
    5: 'पाँचौं',
    6: 'छैटौं',
    7: 'सातौं',
    8: 'आठौं',
    9: 'नवौं',
    0: 'दशौं',
    11: 'एघारौं',
    12: 'बाह्रौं',
    13: 'तेरहौं',
    14: 'चौधौं',
    15: 'पन्ध्रौं'
  };

  transform(value: any, ...args: any[]): any {
    if (ObjectUtil.isEmpty(value)) {
      return null;
    } else {
      return this.numbersObject[value];
    }
  }
}
