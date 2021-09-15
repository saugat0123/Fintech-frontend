import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';

@Component({
  selector: 'app-retail-education-template-data',
  templateUrl: './retail-education-template-data.component.html',
  styleUrls: ['./retail-education-template-data.component.scss']
})
export class RetailEducationTemplateDataComponent implements OnInit {
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
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      dateofGeneration: [undefined],
      applicationDateInAD: [undefined],
      drawingPowerRate: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyFloatingInterestRate: [undefined],
      serviceCharge: [undefined],
      serviceChargeWords: [undefined],

      emiAmount: [undefined],
      emiAmountInWords: [undefined],
      numberOfEmi: [undefined],
      loanCommitmentFee: [undefined],

      ownersName: [undefined],
      ownersAddress: [undefined],
      propertyPlotNumber: [undefined],
      propertyArea: [undefined],
      sheetNumber: [undefined],

      branchName: [undefined],
      lateFee: [undefined],
      changeFeeBelow1Cr: [undefined],
      changeFeeAbove1Cr: [undefined],
      collateralReleaseFee: [undefined],
      documentAccessFee: [undefined],
      promissoryNoteAmount: [undefined],
      loanDeedAmount: [undefined],
      pledgeAmount: [undefined],
      guarantorName1: [undefined],
      guarantorAmount1: [undefined],
      guarantorAmountWords1: [undefined],
      signatureDate: [undefined],

      sakshiDistrict: [undefined],
      sakshiMunicipality: [undefined],
      sakshiWardNum: [undefined],

      sakshiName: [undefined],
      employeeName: [undefined]
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
