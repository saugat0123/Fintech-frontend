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
  isEquityMortgageTermLoanSelected = false;
  loanName: any = [];
  loanScheme;
  loanSchemeSelected;
  subsidyAgricultureSelected;
  selectedInterestRate;
  subsidyOrAgricultureLoan;
  typeOfServiceCharge;
  termSelected = false;
  mortgageTermSelected = false;
  equityMortgageSelected = false;
  isWorkingCapitalLoan = false;
  isAutoLoanOtherCreditSelected = false;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.letterData)) {
      this.getLoanName();
      if (this.loanName.length > 0) {
        this.setLoanFlags(this.loanName);
      }
      this.typeOfServiceCharge = this.letterData.smeGlobalForm.serviceChargeType;
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
      }
      if (data === this.loanNameConst.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE) {
        this.termSelected = true;
      }
      if (data === this.loanNameConst.MORTGAGE_TERM_LOAN) {
        this.mortgageTermSelected = true;
      }
      if (data === this.loanNameConst.EQUITY_MORTGAGE_TERM_LOAN) {
        this.equityMortgageSelected = true;
      }
      if (data === this.loanNameConst.DEMAND_LOAN_FOR_WORKING_CAPITAL ||
          data === this.loanNameConst.OVERDRAFT_LOAN_FOR_WORKING_CAPITAL_REQUIREMENT ||
          data === this.loanNameConst.MORTGAGE_OVERDRAFT ||
          data === this.loanNameConst.EQUITY_MORTGAGED_OVERDRAFT ||
          data === this.loanNameConst.BRIDGE_GAP_LOAN ||
          data === this.loanNameConst.SHORT_TERM_LOAN ||
          data === this.loanNameConst.IMPORT_LOAN_TRUST_RECEIPT_LOAN) {
        this.isWorkingCapitalLoan = true;
      }
    });
    if (this.isAutoLoanSelected === true) {
      const autoLoanKey = this.letterData.autoLoanMasterForm.autoLoanFormArray;
      autoLoanKey.forEach(val => {
        if (val.autoLoanType === 'NEW_EMI_TERM_LOAN') {
          this.isAutoLoanEmiSelected = true;
        }
      });
      if (this.isAutoLoanSelected === true) {
        const autoLoan = this.letterData.autoLoanMasterForm.autoLoanFormArray;
        autoLoan.forEach(val => {
          if (val.autoLoanType === 'OTHER_CREDIT_LIMITS') {
            this.isAutoLoanOtherCreditSelected = true;
          }
        });
      }
      if (this.termSelected === true) {
        const termLoanKey = this.letterData.termLoanForm.termLoanDetails;
        termLoanKey.forEach(val => {
          this.isTermLoanSelected = val.termLoanFor === 'VEHICLE';
          if (val.termLoanType === 'NEW_EMI' || val.termLoanType === 'NEW_ANNUAL_REVIEW') {
            this.isTermLoanEmiSelected = true;
          }
        });
      }
      if (this.mortgageTermSelected === true) {
        const tempTermMortgageKey = this.letterData.mortgageEquityTermForm.mortgageTermFormArray;
        tempTermMortgageKey.forEach(val => {
          if (val.termLoanType === 'NEW_EMI_TERM_LOAN' || val.termLoanType === 'NEW_ANNUAL_REVIEW') {
            this.isMortgageTermLoanSelected = true;
          }
        });
      }
      if (this.equityMortgageSelected === true) {
        const tempTermMortgageKey = this.letterData.mortgageEquityTermForm.mortgageEquityTermFormArray;
        tempTermMortgageKey.forEach(val => {
          if (val.termLoanType === 'NEW_EMI_TERM_LOAN' || val.termLoanType === 'NEW_ANNUAL_REVIEW') {
            this.isEquityMortgageTermLoanSelected = true;
          }
        });
      }
    }
  }
}
