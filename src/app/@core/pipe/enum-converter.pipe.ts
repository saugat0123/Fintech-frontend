import {Pipe, PipeTransform} from '@angular/core';
import {ObjectUtil} from "../utils/ObjectUtil";


@Pipe({
    name: 'enumConvertPipe'
})
export class EnumConverterPipe implements PipeTransform {

    transform(value: unknown, ...args: unknown[]): unknown {

        if (ObjectUtil.isEmpty(value)) {
            return '';
        }
        switch (value) {
            case 'BANK':
                value = 'Bank';
                break;
            case 'MICRO_FINANCE':
                value = 'Micro Finance';
                break;
            default:
                break;
        }
        return value;
    }

}
