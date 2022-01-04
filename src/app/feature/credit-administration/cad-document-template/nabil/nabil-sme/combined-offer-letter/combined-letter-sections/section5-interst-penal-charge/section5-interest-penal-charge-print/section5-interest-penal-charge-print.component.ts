import {Component, Input, OnInit} from '@angular/core';
import {LoanNameConstant} from '../../../../../../../cad-view/template-data/nabil-sme-template-data/sme-costant/loan-name-constant';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {LoanDataHolder} from '../../../../../../../../loan/model/loanData';

@Component({
  selector: 'app-section5-interest-penal-charge-print',
  templateUrl: './section5-interest-penal-charge-print.component.html',
  styleUrls: ['./section5-interest-penal-charge-print.component.scss']
})
export class Section5InterestPenalChargePrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;
  loanNameConst = LoanNameConstant;
  isAutoLoanSelected = false;
  isAutoLoanEmiSelected = false;
  isTermLoanSelected = false;
  isTermLoanEmiSelected = false;
  isMortgageTermLoanSelected = false;
  loanName: any = [];
  loanScheme;
  loanSchemeSelected;
  subsidyAgricultureSelected;
  selectedInterestRate;
  subsidyOrAgricultureLoan;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.letterData)) {
      this.getLoanName();
      if (this.loanName.length > 0) {
        this.setLoanFlags(this.loanName);
      }
    }
  }
  getLoanName() {
    const globalData = this.letterData.smeGlobalForm;
    this.loanScheme = globalData.loanSchemeType;
    this.loanSchemeSelected = globalData.loanScheme;
    this.subsidyAgricultureSelected = globalData.subsidyOrAgricultureLoan;
    this.selectedInterestRate = globalData.interestRateType;
    this.customerApprovedDoc.assignedLoan.forEach((loanDataHolder: LoanDataHolder) => {
      this.loanName.push(loanDataHolder.loan.name);
    });
  }

  setLoanFlags(selectedLoanLists) {
    selectedLoanLists.forEach((data) => {
      if (data === this.loanNameConst.AUTO_LOAN) {
        this.isAutoLoanSelected = true;
        const autoLoanKey = this.letterData.autoLoanMasterForm;
        if (autoLoanKey.autoLoanType === 'NEW_EMI_TERM_LOAN') {
          this.isAutoLoanEmiSelected = true;
        }
      }
      if (data === this.loanNameConst.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE) {
        const termLoanKey = this.letterData.termLoanForm;
        this.isTermLoanSelected = termLoanKey.termLoanFor === 'VEHICLE';
        // const termLoanKey = this.tempData.termLoanForm;
        if (termLoanKey.termLoanType === 'NEW_EMI' || termLoanKey.termLoanType === 'NEW_ANNUAL_REVIEW') {
          this.isTermLoanEmiSelected = true;
        }
      }
      if (data === this.loanNameConst.MORTGAGE_TERM_LOAN_EQUITY_MORTGAGE_TERM_LOAN) {
        const tempTermMortgageKey = this.letterData.mortgageEquityTermForm;
        if (tempTermMortgageKey.termLoanType === 'NEW_EMI_TERM_LOAN' || tempTermMortgageKey.termLoanType === 'NEW_ANNUAL_REVIEW') {
          this.isMortgageTermLoanSelected = true;
        }
      }
    });
  }

}
