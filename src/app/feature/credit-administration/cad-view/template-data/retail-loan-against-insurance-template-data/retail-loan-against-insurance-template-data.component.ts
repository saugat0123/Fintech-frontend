import {Component, Input, OnInit} from '@angular/core';
import  { CustomerApprovedLoanCadDocumentation } from '../../../model/customerApprovedLoanCadDocumentation'
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {FormBuilder, FormGroup} from '@angular/forms';
import { SbTranslateService } from '../../../../../@core/service/sbtranslate.service';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';

@Component({
  selector: 'app-retail-loan-against-insurance-template-data',
  templateUrl: './retail-loan-against-insurance-template-data.component.html',
  styleUrls: ['./retail-loan-against-insurance-template-data.component.scss']
})
export class RetailLoanAgainstInsuranceTemplateDataComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  offerLetterTypes = [];
  offerLetterConst;
  offerLetterSelect;
  buildRetailIns: FormGroup;
  translatedValues: any = {};
  spinner = false;

  constructor(
      private formBuilder: FormBuilder,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private translateService: SbTranslateService,
      )
  {}

  ngOnInit() {
    this.buildInsForm();
  }

  buildInsForm() {
    this.buildRetailIns = this.formBuilder.group({
      dateofGeneration: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      applicationDateInAD: [undefined],
      LoanType: [undefined],
      LoanAmount: [undefined],
      LoanAmountWords: [undefined],
      drawingPowerRate: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyFloatingInterestRate: [undefined],
      serviceCharge: [undefined],
      serviceChargeWords: [undefined],
      communicationFee: [undefined],
      emiAmount: [undefined],
      emiAmountWords: [undefined],
      emiCount: [undefined],
      loanCommitmentFee: [undefined],
      ownersName : [undefined],
      ownersAddress: [undefined],
      propertyPlotNumber: [undefined],
      propertyArea: [undefined],
      sheetNumber: [undefined],
      GuarantorName: [undefined],
      changeFeeBelow1Cr: [undefined],
      changeFeeAbove1Cr: [undefined],
      collateralReleaseFee: [undefined],
      documentAccessFee: [undefined],
      promissoryNoteAmount : [undefined],
      loanDeedAmount : [undefined],
      pledgeAmount : [undefined],
      guarantorName1 : [undefined],
      guarantorAmount1 : [undefined],
      guarantorAmountWords1 : [undefined],
      signatureDate : [undefined],
      sakshiDistrict: [undefined],
      sakshiMunicipality: [undefined],
      sakshiWardNum: [undefined],
      sakshiName: [undefined],
      employeeName : [undefined]
    });
  }

  async translate() {
    this.spinner = true;
    this.translatedValues = await this.translateService.translateForm(this.buildRetailIns);
    this.spinner = false;
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.buildRetailIns.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.buildRetailIns.get(wordLabel).patchValue(returnVal);
  }
  submit() {

  }

}
