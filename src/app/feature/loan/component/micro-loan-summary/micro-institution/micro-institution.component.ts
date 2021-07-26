import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {CompanyInfo} from '../../../../admin/modal/company-info';
import {BusinessType} from '../../../../admin/modal/businessType';
import {CompanyJsonData} from '../../../../admin/modal/CompanyJsonData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-micro-institution',
    templateUrl: './micro-institution.component.html',
    styleUrls: ['./micro-institution.component.scss']
})
export class MicroInstitutionComponent implements OnInit {

    @Input() companyInfo: CompanyInfo;
    @Input() loanDataHolder: LoanDataHolder;
    businessType = BusinessType;
    companyJsonData: CompanyJsonData = new CompanyJsonData();
    contact = [];
    additionalInfoJsonData;
    companyLocationData;
    microCustomerType = null;

    constructor() {
    }

    ngOnInit() {
        this.microCustomerType = this.companyInfo.microCustomerType;
        if (!ObjectUtil.isEmpty(this.companyJsonData)) {
            this.companyJsonData = JSON.parse(this.companyInfo.companyJsonData);
            this.companyLocationData = JSON.parse(this.companyInfo.companyLocations.address);
            this.contact = JSON.parse(this.companyInfo.contactPersons);
        }
    }

}
