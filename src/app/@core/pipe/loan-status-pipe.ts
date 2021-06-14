import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'loanStatusPipe'
})
export class LoanStatusPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        if ('Send Backward' === value) {
            return 'Return';
        }
        if ('BACKWARD' === value) {
            return 'RETURNED';
        }
        if ('FORWARD' === value) {
            return 'FORWARDED';
        }
        if ('RE_INITIATE' === value) {
            return 'RE INITIATED';
        }
        if ('REJECT' === value) {
            return 'REJECTED';
        }
        if ('TRANSFER' === value) {
            return 'TRANSFERRED';
        }
        return value;
    }

}
