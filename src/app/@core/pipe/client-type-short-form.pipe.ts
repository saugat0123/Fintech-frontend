import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clientTypeShortForm'
})
export class ClientTypeShortFormPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    switch (value) {
      case 'CORPORATE':
        return 'CORP';
      case 'INFRASTRUCTURE_AND_PROJECT':
        return 'INFRA';
      case 'BUSINESS_DEVELOPMENT':
        return 'BUDS';
      case 'MID_MARKET':
        return 'MM';
      case 'CONSUMER_FINANCE':
        return 'CF';
      case 'DEPRIVED_SECTOR':
        return 'DEP';
      case 'SMALL_BUSINESS_FINANCIAL_SERVICES':
        return 'SBFS';
      case 'HR_DEPARTMENT':
        return 'HR';
      case 'MICRO_FINANCIAL_SERVICES':
        return 'MF';
      default:
        return '';
    }
  }
}
