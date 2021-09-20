import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';

@Component({
  selector: 'app-retail-mortgage-loan-template-data',
  templateUrl: './retail-mortgage-loan-template-data.component.html',
  styleUrls: ['./retail-mortgage-loan-template-data.component.scss']
})
export class RetailMortgageLoanTemplateDataComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  offerLetterTypes = [];
  offerLetterConst;
  offerLetterSelect;
  form: FormGroup;
  translatedValues: any = {};
  spinner = false;

  constructor(
      private formBuilder: FormBuilder,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private translateService: SbTranslateService,
  ) { }

  ngOnInit() {
    this.buildmortgage();
  }
  buildmortgage() {
    this.form = this.formBuilder.group({
      dateOfGeneration: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      applicationDateInAD: [undefined],
      loanAmount: [undefined],
      loanNameInWord: [undefined],
      drawingPowerRate: [undefined],
      signatureDate: [undefined],
      district: [undefined],
      witnessName: [undefined],
      wardNum: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      staffName: [undefined],
      floatingRate: [undefined],
      serviceCharge: [undefined],
      serviceChargeWords: [undefined],
      communicationFees: [undefined],
      emiAmount: [undefined],
      emiAmountInWords: [undefined],
      numberOfEMI: [undefined],
      firstEMIMonth: [undefined],
      loanCommitmentFee: [undefined],
      yearlyLoanRate: [undefined],
      ownerName: [undefined],
      ownersAddress: [undefined],
      loanAmountWords: [undefined],
      branchName: [undefined],
      propertyPlotNumber: [undefined],
      secondDisbursementAmountWords: [undefined],
      firstConstructionCompletionAmount: [undefined],
      firstDisbursementAmountWords: [undefined],
      secondDisbursementAmount: [undefined],
      firstDisbursementAmount: [undefined],
      secondConstructionCompletionAmount: [undefined],
      thirdConstructionCompletionAmount: [undefined],
      thirdDisbursementAmount: [undefined],
      thirdDisbursementAmountWords: [undefined],
      changeFeeBelow1Cr: [undefined],
      lateFee: [undefined],
      changeFeeAbove1Cr: [undefined],
      collateralReleaseFee: [undefined],
      pledgeAmount: [undefined],
      documentAccessFee: [undefined],
      promissoryNoteAmount: [undefined],
      sheetNumber: [undefined],
      propertyArea: [undefined],
      loanDeedAmount: [undefined],
      insuranceAmount: [undefined],
      insuranceAmountWords: [undefined],
      guarantorName1: [undefined],
      guarantorAmount1: [undefined],
      guarantorAmountWords1: [undefined],

      //For Translated Value
      dateOfGenerationTransVal: [undefined],
      customerNameTransVal: [undefined],
      customerAddressTransVal: [undefined],
      applicationDateInADTransVal: [undefined],
      loanAmountTransVal: [undefined],
      loanNameInWordTransVal: [undefined],
      drawingPowerRateTransVal: [undefined],
      signatureDateTransVal: [undefined],
      districtTransVal: [undefined],
      witnessNameTransVal: [undefined],
      wardNumTransVal: [undefined],
      baseRateTransVal: [undefined],
      premiumRateTransVal: [undefined],
      staffNameTransVal: [undefined],
      floatingRateTransVal: [undefined],
      serviceChargeTransVal: [undefined],
      serviceChargeWordsTransVal: [undefined],
      communicationFeesTransVal: [undefined],
      emiAmountTransVal: [undefined],
      emiAmountInWordsTransVal: [undefined],
      numberOfEMITransVal: [undefined],
      firstEMIMonthTransVal: [undefined],
      loanCommitmentFeeTransVal: [undefined],
      yearlyLoanRateTransVal: [undefined],
      ownerNameTransVal: [undefined],
      ownersAddressTransVal: [undefined],
      loanAmountWordsTransVal: [undefined],
      branchNameTransVal: [undefined],
      propertyPlotNumberTransVal: [undefined],
      secondDisbursementAmountWordsTransVal: [undefined],
      firstConstructionCompletionAmountTransVal: [undefined],
      firstDisbursementAmountWordsTransVal: [undefined],
      secondDisbursementAmountTransVal: [undefined],
      firstDisbursementAmountTransVal: [undefined],
      secondConstructionCompletionAmountTransVal: [undefined],
      thirdConstructionCompletionAmountTransVal: [undefined],
      thirdDisbursementAmountTransVal: [undefined],
      thirdDisbursementAmountWordsTransVal: [undefined],
      changeFeeBelow1CrTransVal: [undefined],
      lateFeeTransVal: [undefined],
      changeFeeAbove1CrTransVal: [undefined],
      collateralReleaseFeeTransVal: [undefined],
      pledgeAmountTransVal: [undefined],
      documentAccessFeeTransVal: [undefined],
      promissoryNoteAmountTransVal: [undefined],
      sheetNumberTransVal: [undefined],
      propertyAreaTransVal: [undefined],
      loanDeedAmountTransVal: [undefined],
      insuranceAmountTransVal: [undefined],
      insuranceAmountWordsTransVal: [undefined],
      guarantorName1TransVal: [undefined],
      guarantorAmount1TransVal: [undefined],
      guarantorAmountWords1TransVal: [undefined],

    });
  }
  async translate() {
    this.spinner = true;
    this.translatedValues = await this.translateService.translateForm(this.form);
    this.spinner = false;
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

  checkboxVal(event, formControlName) {
    // if (!ObjectUtil.isEmpty(this.translatedValues[formControlName])) {
    //   const val = this.translatedValues[formControlName];
    //   this.form.get(formControlName + 'TransVal').patchValue(val);
    // }
    const checkVal = event.target.checked;
    this[formControlName + 'Check'] = checkVal;
    console.log('checked Value', this[formControlName + 'Check']);
    if (!checkVal) {
      this.clearForm(formControlName + 'TransVal');
    }
  }
  clearForm(controlName) {
    this.form.get(controlName).setValue(null);
  }
  submit() {

  }

}
