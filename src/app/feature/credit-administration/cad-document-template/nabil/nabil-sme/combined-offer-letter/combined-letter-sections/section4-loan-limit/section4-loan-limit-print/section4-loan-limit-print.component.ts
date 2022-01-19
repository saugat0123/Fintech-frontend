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
    if ((!ObjectUtil.isEmpty(tempD.letterOfCreditForm) && tempD.letterOfCreditForm.complementryOther === true) ||
        (!ObjectUtil.isEmpty(tempD.timeLetterCreditForm) && tempD.timeLetterCreditForm.complementryOther === true) ||
        (!ObjectUtil.isEmpty(tempD.importBillsDiscountForm) && tempD.importBillsDiscountForm.complementryOther === true) ||
        (!ObjectUtil.isEmpty(tempD.importLoanTrust) && tempD.importLoanTrust.complementryOther === true) ||
        (!ObjectUtil.isEmpty(tempD.revolvingShortTermLoan) && tempD.revolvingShortTermLoan.complementaryOther === true) ||
        (!ObjectUtil.isEmpty(tempD.demandLoanForm) && tempD.demandLoanForm.complementryOther === true) ||
        (!ObjectUtil.isEmpty(tempD.preExportForm) && tempD.preExportForm.complementryOther === true) ||
        (!ObjectUtil.isEmpty(tempD.documentaryBillPurchase) && tempD.documentaryBillPurchase.complementryOther === true) ||
        (!ObjectUtil.isEmpty(tempD.bridgeGapLoan) && tempD.bridgeGapLoan.complementryOther === true) ||
        (!ObjectUtil.isEmpty(tempD.termLoanForm) && tempD.termLoanForm.complementaryOther === true) ||
        (!ObjectUtil.isEmpty(tempD.mortgageEquityTermForm) && tempD.mortgageEquityTermForm.complimentaryOther === true) ||
        (!ObjectUtil.isEmpty(tempD.autoLoanMasterForm) && tempD.autoLoanMasterForm.complimentaryOther === true) ||
        (!ObjectUtil.isEmpty(tempD.bankGuarantee) && tempD.bankGuarantee.complementryOther === true) ||
        (!ObjectUtil.isEmpty(tempD.billPurchaseForm) && tempD.billPurchaseForm.complementryOther === true)) {
      return true;
    } else {
      return false;
    }
  }

}
