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
        return value;
    }

}
