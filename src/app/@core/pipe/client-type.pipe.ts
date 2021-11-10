import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'clientType'
})
export class ClientTypePipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        switch (value) {
            case 'CORPORATE':
                return 'Corporate';
            case 'INFRASTRUCTURE_AND_PROJECT':
                return 'Infrastructure & Project';
            case 'BUSINESS_DEVELOPMENT':
                return 'Business Development';
            case 'MID_MARKET':
                return 'Mid Market';
            case 'CONSUMER_FINANCE':
                return 'Consumer Finance';
            case 'DEPRIVED_SECTOR':
                return 'Deprived Sector';
            case 'SMALL_BUSINESS_FINANCIAL_SERVICES':
                return 'Small Business Financial Services';
            default:
                return '';
        }
    }

}
