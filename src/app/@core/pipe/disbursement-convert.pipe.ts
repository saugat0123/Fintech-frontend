import {Pipe, PipeTransform} from '@angular/core';
import {ObjectUtil} from '../utils/ObjectUtil';

@Pipe({
    name: 'disbursementToLimit'
})
export class DisbursementConvertPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        if (ObjectUtil.isEmpty(value)) {
            return '';
        } else if ('disbursement pending' === value.toLowerCase()) {
            return 'LIMIT PENDING';
        } else {
            return value;
        }

    }

}
