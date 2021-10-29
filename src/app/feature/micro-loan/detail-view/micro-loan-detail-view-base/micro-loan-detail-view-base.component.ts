import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {CustomerType} from '../../../customer/model/customerType';
import {MicroCustomerType} from '../../../../@core/model/enum/micro-customer-type';
// tslint:disable-next-line:max-line-length
import {SiteVisitDocument} from '../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';

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
    securityId: number;
    commentsSummary = false;
    dataFromComments;
    previousSecuritySummary = false;
    dataFromPreviousSecurity;
    isMicroCustomer: Boolean;
    financialView = false;
    financialData;
    @Input() isMicro;
  @Output() documents = new EventEmitter();
  siteVisitDocuments: Array<SiteVisitDocument>;

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

  checkSiteVisitDocument(event: any) {
    this.siteVisitDocuments = event;
    this.documents.emit(this.siteVisitDocuments);
  }

}
