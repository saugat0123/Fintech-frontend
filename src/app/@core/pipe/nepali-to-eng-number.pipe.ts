import { Pipe, PipeTransform } from '@angular/core';
import {ObjectUtil} from '../utils/ObjectUtil';

@Pipe({
    name: 'NepaliToEngNumber'
})
export class NepaliToEngNumberPipe implements PipeTransform {
    numbersObject: { [x: string]: string } = {
        '!': '1',
        '@': '2',
        '#': '3',
        '$': '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0',
        '.': '.',
        ',': ',',
        '/': '/',
        '-': '-',
        '=': '.'
    };
    transform(value: any, ...args: any[]): any {
        if (ObjectUtil.isEmpty(value)) {
            return '';
        }
        let nepNumber = '';
        for (let i = 0; i < value.length; i++) {
            if (this.numbersObject[value.charAt(i)]) {
                nepNumber += this.numbersObject[value.charAt(i)];
            } else { nepNumber += value.charAt(i); }
        }

        return nepNumber;

    }

}
