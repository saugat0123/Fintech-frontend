// import { Component, OnInit } from '@angular/core';
//
// @Component({
//   selector: 'app-sme-template-data',
//   templateUrl: './sme-template-data.component.html',
//   styleUrls: ['./sme-template-data.component.scss']
// })
// export class SmeTemplateDataComponent implements OnInit {
//
//   constructor() { }
//
//   ngOnInit() {
//   }
//
// }

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';

@Component({
  selector: 'app-sme-template-data',
  templateUrl: './sme-template-data.component.html',
  styleUrls: ['./sme-template-data.component.scss']
})
export class SmeTemplateDataComponent implements OnInit {
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
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      dateOfGeneration: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      applicationDateInAD: [undefined],
      vehicleDescription: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      drawingPower: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      annualInterestRate: [undefined],
      serviceCharge: [undefined],
      serviceChargeWords: [undefined],
      communicationFee: [undefined],
      emiAmount: [undefined],
      emiAmountWords: [undefined],
      numberOfEmi: [undefined],
      collateralReleaseFee: [undefined],
      loanCommitmentFee: [undefined],
      branchName: [undefined],
      lateFee: [undefined],
      dealerName: [undefined],
      changeFeeBelow1Cr: [undefined],
      changeFeeAbove1Cr: [undefined],
      documentAccessFee: [undefined],
      promissoryNoteAmount: [undefined],
      loanDeedAmount: [undefined],
      guaranteeAmount: [undefined],
      signatureDate: [undefined],
      sakshiDistrict: [undefined],
      sakshiMunicipality: [undefined],
      sakshiWard: [undefined],
      sakshiName: [undefined],
      bankRepresentativeName: [undefined],

      //For translated data
      dateOfGenerationTransVal: [undefined],
      customerNameTransVal: [undefined],
      customerAddressTransVal: [undefined],
      applicationDateInADTransVal: [undefined],
      vehicleDescriptionTransVal: [undefined],
      loanAmountTransVal: [undefined],
      loanAmountWordsTransVal: [undefined],
      drawingPowerTransVal: [undefined],
      baseRateTransVal: [undefined],
      premiumRateTransVal: [undefined],
      annualInterestRateTransVal: [undefined],
      serviceChargeTransVal: [undefined],
      serviceChargeWordsTransVal: [undefined],
      communicationFeeTransVal: [undefined],
      emiAmountTransVal: [undefined],
      emiAmountWordsTransVal: [undefined],
      numberOfEmiTransVal: [undefined],
      collateralReleaseFeeTransVal: [undefined],
      loanCommitmentFeeTransVal: [undefined],
      branchNameTransVal: [undefined],
      lateFeeTransVal: [undefined],
      dealerNameTransVal: [undefined],
      changeFeeBelow1CrTransVal: [undefined],
      changeFeeAbove1CrTransVal: [undefined],
      documentAccessFeeTransVal: [undefined],
      promissoryNoteAmountTransVal: [undefined],
      loanDeedAmountTransVal: [undefined],
      guaranteeAmountTransVal: [undefined],
      signatureDateTransVal: [undefined],
      sakshiDistrictTransVal: [undefined],
      sakshiMunicipalityTransVal: [undefined],
      sakshiWardTransVal: [undefined],
      sakshiNameTransVal: [undefined],
      bankRepresentativeNameTransVal: [undefined],
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

