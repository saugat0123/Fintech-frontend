import {DmsLoanFileComponent} from '../../loan-main-template/dms-loan-file/dms-loan-file.component';
import {BasicInfoComponent} from '../../loan-main-template/basic-info/basic-info.component';
import {CompanyInfoComponent} from '../../loan-main-template/company-info/company-info.component';
import {ViewChild} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';

export class LoanChildService {

    loanDocument: LoanDataHolder = new LoanDataHolder();

    @ViewChild('basicInfo')
    basicInfo: BasicInfoComponent;

    @ViewChild('dmsLoanFile')
    dmsLoanFile: DmsLoanFileComponent;

    @ViewChild('entityInfo')
    entityInfo: CompanyInfoComponent;

    selectChild(name, action) {

        if (name === 'Customer Info' && action) {
            this.basicInfo.onSubmit();
            this.loanDocument.customerInfo = this.basicInfo.basicInfo.value;
        }

        if (name === 'General' && action) {
            this.dmsLoanFile.onProceed();
            this.loanDocument.dmsLoanFile = this.dmsLoanFile.loanForm.value;
            this.loanDocument.priority = this.dmsLoanFile.loanForm.get('priority').value;
        }

        if (name === 'Company Info' && action) {
            this.entityInfo.onSubmit();
            this.loanDocument.entityInfo = this.entityInfo.companyInfo.value;
        }
    }


}
