import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CompanyInfo} from '../../../../../admin/modal/company-info';

@Component({
  selector: 'app-above-ten-million',
  templateUrl: './above-ten-million.component.html',
  styleUrls: ['./above-ten-million.component.scss'],
})
export class AboveTenMillionComponent implements OnInit {
  @Input() companyInfo: CompanyInfo;
  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerAllLoanList: LoanDataHolder[];
  @Input() fiscalYear;
  isUsedForAboveTenMillion: boolean;
  proposalData;
  tempData;
  guarantorData;
  constructor() {}

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      this.tempData = this.loanDataHolder.proposal;
      if (!ObjectUtil.isEmpty(this.tempData.data)) {
        this.proposalData = JSON.parse(this.tempData.data);
      }
      if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder) &&
      !ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.guarantors) &&
          !ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.guarantors.guarantorList)) {
        this.guarantorData = this.loanDataHolder.loanHolder.guarantors.guarantorList;
      }
    }
  }
}