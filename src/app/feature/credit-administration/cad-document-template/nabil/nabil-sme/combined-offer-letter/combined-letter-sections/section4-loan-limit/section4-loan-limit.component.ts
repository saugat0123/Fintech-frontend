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
      totalFundedLimitInFigure: this.tempData.smeGlobalForm.totalFundedLimitInFigureCT ? this.tempData.smeGlobalForm.totalFundedLimitInFigureCT : '',
      totalFundedLimitInWords: this.tempData.smeGlobalForm.totalFundedLimitInWordsCT ? this.tempData.smeGlobalForm.totalFundedLimitInWordsCT : '',
      totalNonFundedLimitInFigure: this.tempData.smeGlobalForm.totalNonFundedLimitInFigureCT ? this.tempData.smeGlobalForm.totalNonFundedLimitInFigureCT : '',
      totalNonFundedLimitInWords: this.tempData.smeGlobalForm.totalNonFundedLimitInWordsCT ? this.tempData.smeGlobalForm.totalNonFundedLimitInWordsCT : '',
      totalLimitInFigure: this.tempData.smeGlobalForm.totalLimitInFigureCT ? this.tempData.smeGlobalForm.totalLimitInFigureCT : '',
      totalLimitInWords: this.tempData.smeGlobalForm.totalLimitInWordsCT ? this.tempData.smeGlobalForm.totalLimitInWordsCT : '',
    });
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
