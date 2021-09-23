import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-personal-overdraft-template-data',
  templateUrl: './personal-overdraft-template-data.component.html',
  styleUrls: ['./personal-overdraft-template-data.component.scss']
})
export class PersonalOverdraftTemplateDataComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  offerLetterTypes = [];
  offerLetterConst;
  offerLetterSelect;
  translatedValues: any = {};
  form: FormGroup;
  spinner = false;

  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private translateService: SbTranslateService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      referenceNumber: [undefined],
      dateofApproval: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      dateofApplication: [undefined],
      nameoftheVehicle: [undefined],
      loanCommitmentFee: [undefined],
      loanAmountinFigure: [undefined],
      loanAmountInWords: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyInterestRate: [undefined],
      loanadminFee: [undefined],
      loanadminFeeWords: [undefined],
      dateofExpiry: [undefined],
      ownerName: [undefined],
      ownersAddress: [undefined],
      propertyPlotNumber: [undefined],
      ownersName: [undefined],
      ownersProperty: [undefined],
      freeText: [undefined],
      propertyArea: [undefined],
      nameofBranch: [undefined],
      nameofCompanyCustomerWorking: [undefined],
      nameofGuarantors: [undefined],
      guaranteedamountinFigure: [undefined],
      guaranteedamountinWords: [undefined],
      insuranceAmountinFigure: [undefined],
      relationshipofficerName: [undefined],
      branchName: [undefined],
      district: [undefined],
      wardNum: [undefined],
      witnessName: [undefined],
      staffName: [undefined],
      // fortranslatedvalue
      referenceNumberTransVal: [undefined],
      dateofApprovalTransVal: [undefined],
      customerNameTransVal: [undefined],
      customerAddressTransVal: [undefined],
      dateofApplicationTransVal: [undefined],
      nameoftheVehicleTransVal: [undefined],
      loanCommitmentFeeTransVal: [undefined],
      loanAmountinFigureTransVal: [undefined],
      loanAmountInWordsTransVal: [undefined],
      baseRateTransVal: [undefined],
      premiumRateTransVal: [undefined],
      yearlyInterestRateTransVal: [undefined],
      loanadminFeeTransVal: [undefined],
      loanadminFeeWordsTransVal: [undefined],
      dateofExpiryTransVal: [undefined],
      ownerNameTransVal: [undefined],
      ownersAddressTransVal: [undefined],
      propertyPlotNumberTransVal: [undefined],
      ownersNameTransVal: [undefined],
      ownersPropertyTransVal: [undefined],
      freeTextTransVal: [undefined],
      propertyAreaTransVal: [undefined],
      nameofBranchTransVal: [undefined],
      nameofCompanyCustomerWorkingTransVal: [undefined],
      nameofGuarantorsTransVal: [undefined],
      guaranteedamountinFigureTransVal: [undefined],
      guaranteedamountinWordsTransVal: [undefined],
      insuranceAmountinFigureTransVal: [undefined],
      relationshipofficerNameTransVal: [undefined],
      branchNameTransVal: [undefined],
      districtTransVal: [undefined],
      wardNumTransVal: [undefined],
      witnessNameTransVal: [undefined],
      staffNameTransVal: [undefined],
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
