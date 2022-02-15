import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CustomerLoanDto} from '../../../model/customerLoanDto';

@Component({
  selector: 'app-credit-facility-report',
  templateUrl: './credit-facility-report.component.html',
  styleUrls: ['./credit-facility-report.component.scss']
})
export class CreditFacilityReportComponent implements OnInit, OnChanges {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerLoanList: LoanDataHolder[];
  customerLoanDtoList: Array<CustomerLoanDto>;
  customerFundedLoanList: LoanDataHolder[];
  customerNonFundedLoanList: LoanDataHolder[];
  customerAllLoanList: LoanDataHolder[];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes): void {
    console.log('loanDataHolder', this.loanDataHolder);
    this.customerAllLoanList = this.customerLoanList;
    console.log('customerAllLoanList', this.customerAllLoanList);
    if (!ObjectUtil.isEmpty(this.loanDataHolder.customerLoanDtoList)) {
      this.customerLoanDtoList = this.loanDataHolder.customerLoanDtoList;
    }
  }

  public getTotal(key: string): number {
    const tempList = this.customerAllLoanList
        .filter(l => JSON.parse(l.proposal.data)[key]);
    let total = tempList
        .map(l => JSON.parse(l.proposal.data)[key])
        .reduce((a, b) => a + b, 0);
    if (this.customerLoanDtoList !== null && !ObjectUtil.isEmpty(this.customerLoanDtoList)) {
      this.customerLoanDtoList.forEach(cdl => {
        total += JSON.parse(cdl.proposal.data)[key];
      });
    }
    return this.isNumber(total);
  }

  public getTotalFundable(key: string, funded: boolean, loanList: LoanDataHolder[]): number {
    this.fundedAndNonfundedList(loanList);
    let numb;
    if (funded) {
      if (!ObjectUtil.isEmpty(this.customerFundedLoanList)) {
        const tempList = this.customerFundedLoanList
            .filter(l => JSON.parse(l.proposal.data)[key]);
        numb = tempList
            .map(l => JSON.parse(l.proposal.data)[key])
            .reduce((a, b) => a + b, 0);
        if (this.customerLoanDtoList !== null && !ObjectUtil.isEmpty(this.customerLoanDtoList)) {
          const tempCustomerLoanDtoList = this.customerLoanDtoList
              .filter(l => l.isFundable);
          tempCustomerLoanDtoList.forEach(cdl => {
            numb = numb + JSON.parse(cdl.proposal.data)[key];
          });
        }
      }
    } else {
      if (!ObjectUtil.isEmpty(this.customerNonFundedLoanList)) {
        const tempList = this.customerNonFundedLoanList
            .filter(l => JSON.parse(l.proposal.data)[key]);
        numb = tempList
            .map(l => JSON.parse(l.proposal.data)[key])
            .reduce((a, b) => a + b, 0);
        if (this.customerLoanDtoList !== null && !ObjectUtil.isEmpty(this.customerLoanDtoList)) {
          const tempCustomerLoanDtoList = this.customerLoanDtoList
              .filter(l => !l.isFundable);
          tempCustomerLoanDtoList.forEach(cdl => {
            numb = numb + JSON.parse(cdl.proposal.data)[key];
          });
        }
      }
    }
    return this.isNumber(numb);
  }

  fundedAndNonfundedList(loanList: LoanDataHolder[]) {
    console.log('loanList', loanList);
    if (!ObjectUtil.isEmpty(loanList)) {
      this.customerFundedLoanList = loanList.filter((l) => l.loan.isFundable);
      if (ObjectUtil.isEmpty(this.customerFundedLoanList)) {
        this.customerFundedLoanList = [];
      }
      this.customerNonFundedLoanList = this.customerAllLoanList.filter((l) => !l.loan.isFundable);
      if (ObjectUtil.isEmpty(this.customerNonFundedLoanList)) {
        this.customerNonFundedLoanList = [];
      }
    }
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
