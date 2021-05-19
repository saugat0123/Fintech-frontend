import {Component, Input, OnInit} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {environment} from '../../../../../environments/environment';
import {Clients} from '../../../../../environments/Clients';
import {CollateralSiteVisit} from '../../../loan-information-template/security/security-initial-form/fix-asset-collateral/CollateralSiteVisit';
import {CollateralSiteVisitService} from '../../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

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

  constructor() { }

  ngOnInit() {
    console.log(this.loanHolder);
    if (!ObjectUtil.isEmpty(this.loanHolder.security)) {
      this.securityId = this.loanHolder.security.id;
    }
  }

}
