import { Pipe, PipeTransform } from '@angular/core';
import {ObjectUtil} from '../utils/ObjectUtil';

@Pipe({
  name: 'englishDateTransform'
})
export class EnglishDateTransformPipe implements PipeTransform {
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
    let transformedDate;
    let monthName;
    const dateArray = [];
    const splittedDate = value.split(' ');
    if (splittedDate[0] === 'Jan') {
      monthName = 'जनवरी';
    } else if (splittedDate[0] === 'Feb') {
      monthName = 'फेब्रुअरी';
    } else if (splittedDate[0] === 'Mar') {
      monthName = 'मार्च';
    } else if (splittedDate[0] === 'Apr') {
      monthName = 'अप्रिल';
    } else if (splittedDate[0] === 'May') {
      monthName = 'मे';
    } else if (splittedDate[0] === 'Jun') {
      monthName = 'जुन';
    } else if (splittedDate[0] === 'Jul') {
      monthName = 'जुलाई';
    } else if (splittedDate[0] === 'Aug') {
      monthName = 'अगष्ट';
    } else if (splittedDate[0] === 'Sep') {
      monthName = 'सेप्टेम्बर';
    } else if (splittedDate[0] === 'Oct') {
      monthName = 'अक्टुबर';
    } else if (splittedDate[0] === 'Nov') {
      monthName = 'नोभेम्बर';
    } else {
      monthName = 'डिसेम्बर';
    }
    const firstNumber = this.transFormEngNumber(splittedDate[1].slice(0, -1));
    dateArray.push(firstNumber);
    dateArray.push(monthName + ',');
    const dateNumber = this.transFormEngNumber(splittedDate[2]);
    dateArray.push(dateNumber);
    transformedDate = dateArray.join(' ');
    return transformedDate;
  }
  transFormEngNumber(value) {
    let nepNumber = '';
    for (let i = 0; i < value.length; i++) {
      if (this.numbersObject[value.charAt(i)]) {
        nepNumber += this.numbersObject[value.charAt(i)];
      }
    }
    return nepNumber;
  }
}
