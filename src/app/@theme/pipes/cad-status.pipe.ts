import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'cadStatus'
})
export class CadStatusPipe implements PipeTransform {

  transform(value: any): any {
    if (value === 'DISBURSEMENT_PENDING') {
        return 'LEGAL_&_DISBURSEMENT_PENDING';
    } else if (value === 'OFFER_APPROVED') {
      return 'OFFER_&_LEGAL_VERIFIED';
    } else if (value === 'OFFER_PENDING') {
      return 'OFFER_&_LEGAL_PENDING';
    }
    return value;
  }

}
