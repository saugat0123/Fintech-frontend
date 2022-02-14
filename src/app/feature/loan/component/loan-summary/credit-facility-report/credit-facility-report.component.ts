import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CustomerLoanDto} from '../../../model/customerLoanDto';

@Component({
  selector: 'app-credit-facility-report',
  templateUrl: './credit-facility-report.component.html',
  styleUrls: ['./credit-facility-report.component.scss']
})
export class CreditFacilityReportComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() nepaliDate;
  @Input() loanConfig;
  customerLoanDtoList: Array<CustomerLoanDto>;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder.customerLoanDtoList)) {
      this.customerLoanDtoList = this.loanDataHolder.customerLoanDtoList;
    }
  }

}
