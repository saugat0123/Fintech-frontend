import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-hire-purchase-template-data',
  templateUrl: './hire-purchase-template-data.component.html',
  styleUrls: ['./hire-purchase-template-data.component.scss']
})
export class HirePurchaseTemplateDataComponent implements OnInit {
  translatedValues: any = {};
  form: FormGroup;
  spinner = false;
  selectedSecurity;
  selectedFlag = false;

  constructor(
      private formBuilder: FormBuilder,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private translateService: SbTranslateService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      dateOfGeneration: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      applicationDateInAd: [undefined],
      vehicleDescription: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      drawingPower: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      floatingRate: [undefined],
      serviceCharge: [undefined],
      serviceChargeWords: [undefined],
      communicationFee: [undefined],
      emiAmount: [undefined],
      emiAmountWords: [undefined],
      numberOfEmi: [undefined],
      loanCommitmentFee: [undefined],
      ownersName: [undefined],
      ownersProperty: [undefined],
      propertyPlotNumber: [undefined],
      propertyArea: [undefined],
      branchName: [undefined],
      dealerName: [undefined],
      lateFee: [undefined],
      changeFeeBelow1Cr: [undefined],
      changeFeeAbove1Cr: [undefined],
      CollateralReleaseFee: [undefined],
      documentAccessFee: [undefined],
      promissoryNoteAmount: [undefined],
      loanDeedAmount: [undefined],
      pledgeAmount: [undefined],
      guaranteeAmount: [undefined],
      signatureDate: [undefined],
      witnessDistrict: [undefined],
      witnessMunicipality: [undefined],
      witnessWardNo: [undefined],
      witnessName: [undefined],
      approvalStaffName: [undefined],
      selectedSecurity: [undefined],
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

  transferValue() {
    const selectedData = this.form.get('selectedSecurity').value;
    if (!ObjectUtil.isEmpty(selectedData)) {
      this.selectedSecurity = selectedData;
      this.selectedFlag = true;
    }
  }
}
