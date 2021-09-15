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
