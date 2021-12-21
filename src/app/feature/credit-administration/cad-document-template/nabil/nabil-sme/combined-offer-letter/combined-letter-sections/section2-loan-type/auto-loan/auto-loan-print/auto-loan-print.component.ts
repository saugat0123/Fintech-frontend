import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ObjectUtil} from '../../../../../../../../../../@core/utils/ObjectUtil';
import {CurrencyFormatterPipe} from '../../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {LoanNameConstant} from '../../../../../../../../cad-view/template-data/nabil-sme-template-data/sme-costant/loan-name-constant';

@Component({
  selector: 'app-auto-loan-print',
  templateUrl: './auto-loan-print.component.html',
  styleUrls: ['./auto-loan-print.component.scss']
})
export class AutoLoanPrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;
  @Input() loanData;
  @Input() index;
  tempData;
  autoLoanFreeText: any = {};
  complementaryOtherAutoLoan = false; vehiclePurchaseAutoLoan = false; vehicleRegistrationAutoLoan = false;
  loanOptionAutoLoan; autoLoanTypeAutoLoan; emiPaymentTypeAutoLoan; paymentsTermsAutoLoan;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
    }
    if (!ObjectUtil.isEmpty(this.tempData.autoLoanMasterForm)) {
      this.loanOptionAutoLoan = this.tempData.smeGlobalForm.loanOption;
      this.autoLoanTypeAutoLoan = this.tempData.autoLoanMasterForm.autoLoanType;
      this.emiPaymentTypeAutoLoan = this.tempData.autoLoanMasterForm.emiPaymentType;
      this.paymentsTermsAutoLoan = this.tempData.autoLoanMasterForm.paymentTerms;
      if (this.tempData.autoLoanMasterForm.complementaryOther === true) {
        this.complementaryOtherAutoLoan = true;
      }
      if (this.tempData.autoLoanMasterForm.vehiclePurchased === true) {
        this.vehiclePurchaseAutoLoan = true;
      }
      if (this.tempData.autoLoanMasterForm.vehicleRegistered === true) {
        this.vehicleRegistrationAutoLoan = true;
      }
    }
  }

}
