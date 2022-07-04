import {Component, Input, OnInit} from '@angular/core';
import {CoreCapitalService} from '../../../../../../admin/service/core-capital.service';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {LoanDataHolder} from '../../../../../model/loanData';
import {CustomerInfoData} from '../../../../../model/customerInfoData';

@Component({
  selector: 'app-above-bank-sol',
  templateUrl: './above-bank-sol.component.html',
  styleUrls: ['./above-bank-sol.component.scss']
})
export class AboveBankSolComponent implements OnInit {

  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerInfo: CustomerInfoData;
  commonData;
  nrpValue: any;
  asOnDate: any;

  constructor(
      private coreCapitalService: CoreCapitalService
  ) { }

  ngOnInit() {
    this.commonData = !ObjectUtil.isEmpty(this.customerInfo) ?
        JSON.parse(this.customerInfo.commonLoanData) : this.customerInfo;
    this.commonData = !ObjectUtil.isEmpty(this.loanDataHolder.loanHolder) ?
        JSON.parse(this.loanDataHolder.loanHolder.commonLoanData) : this.loanDataHolder.loanHolder;
    this.coreCapitalService.getActiveBaseRate().subscribe(rs => {
      if (!ObjectUtil.isEmpty(rs.detail)) {
        this.nrpValue = rs.detail.rate;
        this.asOnDate = rs.detail.createdAt;
      }
    });
  }

}
