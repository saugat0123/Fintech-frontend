import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ObjectUtil} from '../../../../../../../../../../@core/utils/ObjectUtil';
import {CurrencyFormatterPipe} from '../../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {LoanNameConstant} from '../../../../../../../../cad-view/template-data/nabil-sme-template-data/sme-costant/loan-name-constant';

@Component({
  selector: 'app-mortgage-equity-term-loan-print',
  templateUrl: './mortgage-equity-term-loan-print.component.html',
  styleUrls: ['./mortgage-equity-term-loan-print.component.scss']
})
export class MortgageEquityTermLoanPrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;
  @Input() loanData;
  @Input() pointNumber;
  @Input() equityMortgageData;
  tempData;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
    }
    /*if (!ObjectUtil.isEmpty(this.tempData.mortgageEquityTermForm)) {
      this.termLoanForMortgageEquityTerm = this.tempData.mortgageEquityTermForm.termLoanFor;
      this.mortgageTypeMortgageEquityTerm = this.tempData.mortgageEquityTermForm.mortgageType;
      this.termLoanTypeMortgageEquityTerm = this.tempData.mortgageEquityTermForm.termLoanType;
      this.emiPaymentTypeMortgageEquityTerm = this.tempData.mortgageEquityTermForm.emiPaymentType;
      this.interestSubAgMortgageEquityTerm = this.tempData.mortgageEquityTermForm.subsidyOrAgricultureLoan;
      this.complementaryOtherMortgageEquityTermName = this.tempData.mortgageEquityTermForm.complimentaryLoanSelected;
      this.paymentTermMortgageEquityTerm = this.tempData.mortgageEquityTermForm.paymentTerms;
      this.drawingPowerMortgageEquityTerm = this.tempData.mortgageEquityTermForm.drawingPowerBasis;
      this.loanOptionMortgageEquityTerm = this.tempData.smeGlobalForm.loanOption;
      if (this.tempData.mortgageEquityTermForm.complementaryOther === true) {
        this.complementaryOtherMortgageEquityTerm = true;
      }
    }*/
  }

}
