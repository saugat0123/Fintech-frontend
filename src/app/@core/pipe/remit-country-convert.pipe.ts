import {Pipe, PipeTransform} from '@angular/core';
@Pipe({
    name: 'remitCountryConvert'
})
export class RemitCountryConvertPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        if (value.toLowerCase() === 'malaysia') {
            return 'dn]lzof';
        } else if (value.toLowerCase() === 'united arab emirates') {
            return ';fpbL c/a';
        } else {
            return value;
        }
    }

}
