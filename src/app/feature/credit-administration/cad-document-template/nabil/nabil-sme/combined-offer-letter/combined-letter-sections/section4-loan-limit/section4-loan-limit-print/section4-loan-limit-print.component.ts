import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section4-loan-limit-print',
  templateUrl: './section4-loan-limit-print.component.html',
  styleUrls: ['./section4-loan-limit-print.component.scss']
})
export class Section4LoanLimitPrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;
  tempData;
  isComplementaryLoan = false;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
      const tempD = this.tempData;
      if (!ObjectUtil.isEmpty(tempD)) {
        this.isComplementaryLoan = this.checkIsComplementary(tempD);
      }
    }
  }
  checkIsComplementary(tempD) {
    let letterFlag = false;
    let timeLetterFlag = false;
    let importBillsFlag = false;
    let importLoanFlag = false;
    let shortTermFlag = false;
    let demandFlag = false;
    let preExportFlag = false;
    let documentaryBillFlag = false;
    let bridgeGapFlag = false;
    let termLoanFlag = false;
    let equityMortgageTermFlag = false;
    let mortgageTermFlag = false;
    let autoLoanFlag = false;
    let bankFlag = false;
    let billPurchaseFlag = false;
    if (!ObjectUtil.isEmpty(tempD.letterOfCreditForm)) {
      tempD.letterOfCreditForm.letterOfCreditFormArray.forEach(val => {
        if (val.complementaryOther === true) {
          letterFlag = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(tempD.timeLetterCreditForm)) {
      tempD.timeLetterCreditForm.timeLetterCreditFormArray.forEach(val => {
        if (val.complementaryOther === true) {
          timeLetterFlag = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(tempD.importBillsDiscountForm)) {
      tempD.importBillsDiscountForm.importBillsDiscountFormArray.forEach(val => {
        if (val.complementaryOther === true) {
          importBillsFlag = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(tempD.importLoanTrust)) {
      tempD.importLoanTrust.importLoanTrustFormArray.forEach(val => {
        if (val.complementaryOther === true) {
          importLoanFlag = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(tempD.revolvingShortTermLoan)) {
      tempD.revolvingShortTermLoan.revolvingShortTermLoanFormArray.forEach(val => {
        if (val.complementaryOther === true) {
          shortTermFlag = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(tempD.demandLoanForm)) {
      tempD.demandLoanForm.demandLoanFormArray.forEach(val => {
        if (val.complementaryOther === true) {
          demandFlag = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(tempD.preExportForm)) {
      tempD.preExportForm.termLoanDetails.forEach(val => {
        if (val.complementaryOther === true) {
          preExportFlag = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(tempD.documentaryBillPurchase)) {
      tempD.documentaryBillPurchase.documentaryBillPurchaseFormArray.forEach(val => {
        if (val.complementaryOther === true) {
          documentaryBillFlag = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(tempD.bridgeGapLoan)) {
      tempD.bridgeGapLoan.bridgeGapDetails.forEach(val => {
        if (val.complementryOther === true) {
          bridgeGapFlag = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(tempD.termLoanForm)) {
      tempD.termLoanForm.termLoanDetails.forEach(val => {
        if (val.complementaryOther === true) {
          termLoanFlag = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(tempD.mortgageEquityTermForm) &&
        !ObjectUtil.isEmpty(tempD.mortgageEquityTermForm.mortgageEquityTermFormArray)) {
      tempD.mortgageEquityTermForm.mortgageEquityTermFormArray.forEach(val => {
        if (val.complementaryOther === true) {
          equityMortgageTermFlag = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(tempD.mortgageEquityTermForm) &&
        !ObjectUtil.isEmpty(tempD.mortgageEquityTermForm.mortgageTermFormArray)) {
      tempD.mortgageEquityTermForm.mortgageTermFormArray.forEach(val => {
        if (val.complementaryOther === true) {
          mortgageTermFlag = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(tempD.autoLoanMasterForm)) {
      tempD.autoLoanMasterForm.autoLoanFormArray.forEach(val => {
        if (val.complementaryOther === true) {
          autoLoanFlag = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(tempD.bankGuarantee)) {
      tempD.bankGuarantee.bankGuaranteeArray.forEach(val => {
        if (val.complementaryOther === true) {
          bankFlag = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(tempD.billPurchaseForm)) {
      tempD.billPurchaseForm.billPurchaseFormArray.forEach(val => {
        if (val.complementaryOther === true) {
          billPurchaseFlag = true;
        }
      });
    }
    if (letterFlag || timeLetterFlag || importBillsFlag || importLoanFlag || shortTermFlag || demandFlag || preExportFlag ||
        documentaryBillFlag || bridgeGapFlag || termLoanFlag || equityMortgageTermFlag || mortgageTermFlag || autoLoanFlag ||
        bankFlag || billPurchaseFlag) {
      return true;
    } else {
      return false;
    }
  }

}
