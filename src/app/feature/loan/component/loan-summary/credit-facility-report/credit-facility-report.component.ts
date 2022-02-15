import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CustomerLoanDto} from '../../../model/customerLoanDto';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';

@Component({
  selector: 'app-credit-facility-report',
  templateUrl: './credit-facility-report.component.html',
  styleUrls: ['./credit-facility-report.component.scss']
})
export class CreditFacilityReportComponent implements OnInit, OnChanges {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() nepaliDate;
  @Input() customerLoanList: LoanDataHolder[];
  customerLoanDtoList: CustomerLoanDto[];
  customerFundedLoanList: LoanDataHolder[];
  customerNonFundedLoanList: LoanDataHolder[];
  customerAllLoanList: LoanDataHolder[];
  RootUrl = ApiConfig.URL;
  array = [];
  dtoArray = [];
  signatureList;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes): void {
    this.customerAllLoanList = this.customerLoanList;
    if (!ObjectUtil.isEmpty(this.loanDataHolder.customerLoanDtoList)) {
      this.customerLoanDtoList = this.loanDataHolder.customerLoanDtoList;
    }
    this.getAllLoanConfig();
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

  private getAllLoanConfig() {
    if (!ObjectUtil.isEmpty(this.customerAllLoanList)) {
      this.customerAllLoanList.forEach(c => {
        const tenure = (((JSON.parse(c.proposal.data)).tenureDurationInMonths) / 12).toFixed(2);
        const config = {
          isFundable: c.loan.isFundable,
          fundableNonFundableSelcted: !ObjectUtil.isEmpty(c.loan.isFundable),
          isFixedDeposit: c.loan.loanTag === 'FIXED_DEPOSIT',
          isGeneral: c.loan.loanTag === 'GENERAL',
          isShare: c.loan.loanTag === 'SHARE_SECURITY',
          isVehicle: c.loan.loanTag === 'VEHICLE',
          loanNature: c.loan.loanNature,
          loanNatureSelected: false,
          isTerminating: false,
          isRevolving: false,
          tenureInMonth: tenure
        };
        if (!ObjectUtil.isEmpty(config.loanNature)) {
          config.loanNatureSelected = true;
          if (config.loanNature.toString() === 'Terminating') {
            config.isTerminating = true;
          } else {
            config.isRevolving = true;
          }
          if (config.isRevolving) {
            config.isGeneral = false;
          }
        }
        if (!config.isFundable) {
          config.isGeneral = false;
        }
        if (config.isFixedDeposit) {
          config.loanNatureSelected = false;
          config.fundableNonFundableSelcted = false;
        }
        this.array.push(config);
      });
    }
    if (!ObjectUtil.isEmpty(this.customerLoanDtoList)) {
      this.customerLoanDtoList.forEach(cd => {
        const dtoTenure = (((JSON.parse(cd.proposal.data)).tenureDurationInMonths) / 12).toFixed(2);
        const dtoCfonfig = {
          isFundable: cd.loanConfig.isFundable,
          fundableNonFundableSelcted: !ObjectUtil.isEmpty(cd.loanConfig.isFundable),
          isFixedDeposit: cd.loanConfig.loanTag === 'FIXED_DEPOSIT',
          isGeneral: cd.loanConfig.loanTag === 'GENERAL',
          isShare: cd.loanConfig.loanTag === 'SHARE_SECURITY',
          isVehicle: cd.loanConfig.loanTag === 'VEHICLE',
          loanNature: cd.loanConfig.loanNature,
          loanNatureSelected: false,
          isTerminating: false,
          isRevolving: false,
          tenureInMonth: dtoTenure
        };
        if (!ObjectUtil.isEmpty(dtoCfonfig.loanNature)) {
          dtoCfonfig.loanNatureSelected = true;
          if (dtoCfonfig.loanNature.toString() === 'Terminating') {
            dtoCfonfig.isTerminating = true;
          } else {
            dtoCfonfig.isRevolving = true;
          }
          if (dtoCfonfig.isRevolving) {
            dtoCfonfig.isGeneral = false;
          }
        }
        if (!dtoCfonfig.isFundable) {
          dtoCfonfig.isGeneral = false;
        }
        if (dtoCfonfig.isFixedDeposit) {
          dtoCfonfig.loanNatureSelected = false;
          dtoCfonfig.fundableNonFundableSelcted = false;
        }
        this.dtoArray.push(dtoCfonfig);
      });
    }
  }
}
