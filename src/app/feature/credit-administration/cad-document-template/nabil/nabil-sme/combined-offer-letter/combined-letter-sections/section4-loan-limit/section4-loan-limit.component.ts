import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {CurrencyFormatterPipe} from '../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../../../@core/pipe/nepali-currency-word.pipe';

@Component({
  selector: 'app-section4-loan-limit',
  templateUrl: './section4-loan-limit.component.html',
  styleUrls: ['./section4-loan-limit.component.scss']
})
export class Section4LoanLimitComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc;
  section4: FormGroup;
  tempData;
  isComplementaryLoan = false;

  constructor(private formBuilder: FormBuilder,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,


  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.fillForm();
      const tempD = this.tempData;
      if (!ObjectUtil.isEmpty(tempD)) {
        this.isComplementaryLoan = this.checkIsComplementary(tempD);
      }
    }
  }
  buildForm() {
    this.section4 = this.formBuilder.group({
      totalFundedLimitInFigure: [undefined],
      /*securities: this.formBuilder.array([]),
      freeTextVal : [undefined],*/
      totalFundedLimitInWords: [undefined],
      totalNonFundedLimitInFigure: [undefined],
      totalNonFundedLimitInWords: [undefined],
      totalLimitInFigure: [undefined],
      totalLimitInWords: [undefined],
    });
  }
  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.section4.get(numLabel).value);
    this.section4.get(wordLabel).patchValue(transformValue);
  }
  fillForm() {
    this.section4.patchValue({
      totalFundedLimitInFigure: this.tempData.smeGlobalForm.totalFundedLimitInFigure ? this.tempData.smeGlobalForm.totalFundedLimitInFigureCT : '',
      totalFundedLimitInWords: this.tempData.smeGlobalForm.totalFundedLimitInWords ? this.tempData.smeGlobalForm.totalFundedLimitInWordsCT : '',
      totalNonFundedLimitInFigure: this.tempData.smeGlobalForm.totalNonFundedLimitInFigure ? this.tempData.smeGlobalForm.totalNonFundedLimitInFigureCT : '',
      totalNonFundedLimitInWords: this.tempData.smeGlobalForm.totalNonFundedLimitInWords ? this.tempData.smeGlobalForm.totalNonFundedLimitInWordsCT : '',
      totalLimitInFigure: this.tempData.smeGlobalForm.totalLimitInFigure ? this.tempData.smeGlobalForm.totalLimitInFigureCT : '',
      totalLimitInWords: this.tempData.smeGlobalForm.totalLimitInWords ? this.tempData.smeGlobalForm.totalLimitInWordsCT : '',
    });
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
      console.log('term loan details:', tempD);
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
