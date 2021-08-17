import {Component, Input, OnInit} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {environment} from '../../../../../environments/environment';
import {Clients} from '../../../../../environments/Clients';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {CustomerType} from '../../../customer/model/customerType';
import {MicroCustomerType} from '../../../../@core/model/enum/micro-customer-type';

@Component({
    selector: 'app-micro-loan-detail-view-base',
    templateUrl: './micro-loan-detail-view-base.component.html',
    styleUrls: ['./micro-loan-detail-view-base.component.scss']
})
export class MicroLoanDetailViewBaseComponent implements OnInit {
    @Input() loanDataHolder: LoanDataHolder;
    @Input() loanHolder: CustomerInfoData;
    @Input() calendarType;
    @Input() loanId;
    @Input() customerAllLoanList;
    @Input() fiscalYearArray;
    client = environment.client;
    clientName = Clients;
    securityId: number;
    commentsSummary = false;
    dataFromComments;
    previousSecuritySummary = false;
    dataFromPreviousSecurity;
    isMicroCustomer: Boolean;
    financialView = false;
    financialData;
    // isMicro = false;
    @Input() isMicro;

    constructor() {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.loanHolder.security)) {
            this.securityId = this.loanHolder.security.id;
        }
        // Setting Comments data--
        if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.data)) {
            this.dataFromComments = JSON.parse(this.loanDataHolder.loanHolder.data);
            this.commentsSummary = true;
        }

        // Setting Previous Security Data
        if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.data)) {
            this.dataFromPreviousSecurity = JSON.parse(this.loanDataHolder.loanHolder.data);
            this.previousSecuritySummary = true;
        }

        // Micro financial Data
        if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.microOtherParameters)) {
            this.financialData = this.loanDataHolder.loanHolder.microOtherParameters;
            this.financialView = true;
        }
    }

    get otherMicroDetailsVisibility() {
        if (this.loanHolder.customerType === CustomerType.INDIVIDUAL && this.isMicroCustomer) {
            return true;
        } else {
            return this.loanHolder.customerType === CustomerType.INSTITUTION &&
                this.loanDataHolder.companyInfo.microCustomerType === MicroCustomerType.DIRECT;
        }
    }

}
