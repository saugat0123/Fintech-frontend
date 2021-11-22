import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerLoanOptions} from '../../../../cad-constant/customer-loan-options';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';

@Component({
  selector: 'app-ddsl-without-subsidy-template-data',
  templateUrl: './ddsl-without-subsidy-template-data.component.html',
  styleUrls: ['./ddsl-without-subsidy-template-data.component.scss']
})
export class DdslWithoutSubsidyTemplateDataComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  ddslFormGroup: FormGroup;
  spinner = false;
  customerLoanOptions: Array<String> = new Array<String>();
  isLoanOptionSelected = false;
  isCustomerNew = false;
  ADSanctionLetterDate = false;
  BSSanctionLetterDate = false;
  ADApplication = false;
  BSApplication = false;
  ADPrevious = false;
  BSPrevious = false;
  displayNepali: boolean;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  loanOptions = CustomerLoanOptions;
  constructor(
      private formBuilder: FormBuilder,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private engToNepaliNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatterPipe: CurrencyFormatterPipe,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getLoanOptionsType();
  }
  buildForm() {
    this.ddslFormGroup = this.formBuilder.group({
      loanOption: [undefined],
      repaymentType: [undefined],
      dateOfApprovalType: [undefined],
      dateOfApprovalNepali: [undefined],
      dateOfApproval: [undefined],
      dateOfApplicationType: [undefined],
      dateOfApplicationNepali: [undefined],
      dateOfApplication: [undefined],
      previousSanctionType: [undefined],
      previousSanctionDateNepali: [undefined],
      purposeOfLoan: [undefined],
      loanAmountFigure: [undefined],
      loanAmountFigureWords: [undefined],
      marginInPercentage: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      serviceCharge: [undefined],
      totalTenureOfLoan: [undefined],
      commitmentFee: [undefined],
      nameOfStaff: [undefined],
      nameOfBranchManager: [undefined],
      EMIAmountFigure: [undefined],
      EMIAmountWord: [undefined],
    });
  }
  public sanctionLetterDate(value): void {
    this.ADSanctionLetterDate = value === 'AD';
    this.BSSanctionLetterDate = value === 'BS';
  }
  public dateOfApplication(value): void {
    this.ADApplication = value === 'AD';
    this.BSApplication = value === 'BS';
  }
  public previousSanctionDate(value): void {
    this.ADPrevious = value === 'AD';
    this.BSPrevious = value === 'BS';
  }
  getLoanOptionsType() {
    CustomerLoanOptions.enumObject().forEach(val => {
      this.customerLoanOptions.push(val);
    });
  }
  transferValue(val) {
    this.isLoanOptionSelected = !ObjectUtil.isEmpty(val);
    this.isCustomerNew = val === 'NEW';
  }
  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.ddslFormGroup.get(numLabel).value);
    this.ddslFormGroup.get(wordLabel).patchValue(transformValue);
  }
  translateNumber(source, target, currencyFormat?) {
    const formVal = this.ddslFormGroup.get(source).value;
    if (!ObjectUtil.isEmpty(formVal)) {
      let formattedVal;
      if (!ObjectUtil.isEmpty(currencyFormat)) {
        formattedVal = this.currencyFormatterPipe.transform(this.ddslFormGroup.get(source).value.toString());
      } else {
        formattedVal = this.ddslFormGroup.get(source).value.toString();
      }
      const wordLabelVar = this.engToNepaliNumberPipe.transform(formattedVal);
      this.ddslFormGroup.get(target).patchValue(wordLabelVar);
    }
  }
  calInterestRate() {
    const baseRate = this.ddslFormGroup.get('baseRate').value;
    const premiumRate = this.ddslFormGroup.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.ddslFormGroup.get('interestRate').patchValue(sum);
    // Converting value from existed pipe:
    this.translateNumber('baseRate', 'baseRateTrans');
    this.translateNumber('premiumRate', 'premiumRateTrans');
    this.translateNumber('interestRate', 'interestRateTrans');
  }
}
