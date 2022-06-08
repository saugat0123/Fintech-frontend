import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {LoanDataHolder} from '../../loan/model/loanData';
import {Insurance} from '../../admin/modal/insurance';
import {LoanConfig} from '../../admin/modal/loan-config';

@Component({
  selector: 'app-site-visit-view',
  templateUrl: './site-visit-view.component.html',
  styleUrls: ['./site-visit-view.component.scss']
})
export class SiteVisitViewComponent implements OnInit {
  @Input() siteVisit: any;
  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerAllLoanList;
  currentResidentSummary = false;
  businessSiteVisitSummary = false;
  fixedAssetCollateralSummary = false;
  currentAssetsInspectionSummary = false;
  client = environment.client;
  clientName = Clients;
  insuranceData = [];
  loanNature;
  constructor() { }

  formData: any;
  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.siteVisit)) {
     this.formData = JSON.parse( this.siteVisit.data);
          switch (this.formData['checkboxSelected']) {
            case 'currentResidentFormChecked' :
              this.currentResidentSummary = true;
              break;
            case 'businessSiteVisitFormChecked' :
              this.businessSiteVisitSummary = true;
              break;
            case 'fixedAssetCollateralFormChecked' :
              this.fixedAssetCollateralSummary = true;
              break;
            case 'currentAssetsInspectionFormChecked' :
              this.currentAssetsInspectionSummary = true;
      }
    }
      if (!ObjectUtil.isEmpty(this.loanDataHolder.insurance)) {
        this.loanDataHolder.insurance.forEach((insurance: Insurance) => {
          this.insuranceData.push(insurance);
        });
      }
    }
  public getTotal(key: string): number {
    const filteredList = this.customerAllLoanList.filter(l => l.proposal.data !== null);
    const tempList = filteredList
        .filter(l => JSON.parse(l.proposal.data)[key]);
    const total = tempList
        .map(l => JSON.parse(l.proposal.data)[key])
        .reduce((a, b) => a + b, 0);
    return this.isNumber(total);
  }
  isNumber(value) {
    if (ObjectUtil.isEmpty(value)) {
      return 0;
    }
    if (Number.isNaN(value)) {
      return 0;
    } else {
      return value;
    }

  }
}
