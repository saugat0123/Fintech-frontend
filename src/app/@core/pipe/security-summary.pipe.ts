import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'securitySummary'
})
export class SecuritySummaryPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        switch (value) {
            case 'fmv':
                return 'Fair Market Value';
            case 'mv':
                return 'Market Value';
            case 'rv':
                return 'Realizable Value';
            case 'land':
                return 'Land';
            case 'landBuilding':
                return 'Land & Building';
            case 'apartment':
                return 'Apartment';
            case 'vehicle':
                return 'Vehicle';
            case 'lease':
                return 'Lease';
            case 'fd':
                return 'Fixed Deposit';
            case 'hypo':
                return 'Hypothecation of Stock & Receivables';
            case 'insurance':
                return 'Insurance';
            case 'other':
                return 'Other';
            case 'share':
                return 'Share';
            case 'plant':
                return 'Plane & Machinery';
            case 'total':
                return 'Total';
        }
    }

}
