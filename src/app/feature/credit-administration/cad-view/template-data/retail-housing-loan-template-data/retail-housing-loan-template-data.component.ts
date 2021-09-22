import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';

@Component({
  selector: 'app-retail-housing-loan-template-data',
  templateUrl: './retail-housing-loan-template-data.component.html',
  styleUrls: ['./retail-housing-loan-template-data.component.scss']
})
export class RetailHousingLoanTemplateDataComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  translatedValues: any = {};
  form: FormGroup;
  spinner = false;
  constructor(
      private formBuilder: FormBuilder,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private translateService: SbTranslateService
  ) { }

  ngOnInit() {
    this.buildhousing();
  }
  buildhousing() {
    this.form = this.formBuilder.group({
      dateOfGeneration: [undefined],
      referenceNumber: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      applicationDateInAD: [undefined],
      nameoftheVehicle: [undefined],
      loanAmount: [undefined],
      loanNameInWord: [undefined],
      percent: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyLoanRate: [undefined],
      loanadminFee: [undefined],
      loanadminFeeWords: [undefined],
      fees: [undefined],
      emiAmount: [undefined],
      emiAmountInWords: [undefined],
      emiNumber: [undefined],
      loanCommitmentFee: [undefined],
      nameofGuarantors: [undefined],
      guarantorsName: [undefined],
      nameofRelationshipOfficer: [undefined],
      guaranteedAmountFigure: [undefined],
      guaranteedAmountWords: [undefined],
      ownerName: [undefined],
      ownersAddress: [undefined],
      propertyPlotNumber: [undefined],
      propertyArea: [undefined],
      sheetNumber: [undefined],
      nameofBranchManager: [undefined],
      nameofBranch: [undefined],
      loanAmountInWord: [undefined],
      loanAmountInFigure: [undefined],
      guaranteedAmountinFigure: [undefined],
      insuranceAmountinFigure: [undefined],
      textFill: [undefined],
      signatureDate: [undefined],
      district: [undefined],
      wardNum: [undefined],
      witnessName: [undefined],
      staffName: [undefined],
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
