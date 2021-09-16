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
      bankRepresentativeName: [undefined],
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

  submit() {

  }
}

