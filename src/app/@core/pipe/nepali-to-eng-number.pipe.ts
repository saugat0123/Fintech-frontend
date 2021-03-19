import { Pipe, PipeTransform } from '@angular/core';
import {ObjectUtil} from '../utils/ObjectUtil';

@Pipe({
    name: 'NepaliToEngNumber'
})
export class NepaliToEngNumberPipe implements PipeTransform {
    numbersObject: { [x: string]: string } = {
        '१': '1',
        '२': '2',
        '३': '3',
        '४': '4',
        '५': '5',
        '६': '6',
        '७': '7',
        '८': '8',
        '९': '9',
        '०': '0',
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
            } else { nepNumber += value.charAt(i); }
        }

        return nepNumber;

    }

}
