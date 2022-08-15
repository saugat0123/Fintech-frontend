import {Pipe, PipeTransform} from '@angular/core';

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
            return 'SUPPORTED';
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
        if ('DUAL_APPROVAL_PENDING' === value) {
            return 'FIRST APPROVED';
        }
        if ('HSOV_PENDING' === value) {
            return 'FIRST APPROVED';
        }
        if ('OFFER_PENDING' === value) {
            return 'SECURITY_DOCUMENT_PENDING';
        }
        if ('OFFER_APPROVED' === value) {
            return 'SECURITY_DOCUMENT_APPROVED';
        }
        return value;
    }

}
