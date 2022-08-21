import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {EnglishDateTransformPipe} from '../../../../../../@core/pipe/english-date-transform.pipe';

@Component({
  selector: 'app-auto-loan-combined-template-data',
  templateUrl: './auto-loan-combined-template-data.component.html',
  styleUrls: ['./auto-loan-combined-template-data.component.scss']
})
export class AutoLoanCombinedTemplateDataComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  @Input() globalBaseRate;
  autoLoanCombinedForm: FormGroup;
  loanDetails: any = [];
  filteredList: any = [];
  filteredLoanIdList: any = [];
  initialInformation: any;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  translatedFormGroup: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private datePipe: DatePipe,
              private engToNepDatePipe: EngNepDatePipe,
              private engToNepWord: NepaliCurrencyWordPipe,
              private translateService: SbTranslateService) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
      this.filteredListDetails(this.loanDetails);
    }
    if (this.offerDocumentList.length > 0) {
      this.offerDocumentList.forEach(offerLetter => {
        this.initialInformation = JSON.parse(offerLetter.initialInformation);
      });
      if (!ObjectUtil.isEmpty(this.initialInformation)) {
        this.autoLoanCombinedForm.patchValue(this.initialInformation.autoLoanCombinedForm);
      }
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount.toFixed(2));
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', val, 'loanAmountInFigure']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', val, 'loanAmountInWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }
  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === 'AUTO LOAN COMBINED');
    this.filteredList.forEach((val, i) => {
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanName']).patchValue(
          this.filteredLoanIdList[i].loan.name);
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanNameNepali']).patchValue(
          this.filteredLoanIdList[i].loan.nepaliName);
    });
  }
  buildForm() {
    this.autoLoanCombinedForm = this.formBuilder.group({
      autoLoanCombinedFormArray: this.formBuilder.array([])
    });
  }
  filteredListDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === 'AUTO LOAN COMBINED');
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }
  addLoanFormArr() {
    (this.autoLoanCombinedForm.get('autoLoanCombinedFormArray') as FormArray).push(this.buildFormArray());
  }
  buildFormArray() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      purposeOfLoan: [undefined],
      numberOfVehicle: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      marginInPercentage: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInWords: [undefined],
      EMIAmountInFigure: [undefined],
      EMIAmountInWords: [undefined],
      numberOfInstallments: [undefined],
      nameOfBeneficiary: [undefined],

      loanAmountInFigureTrans: [undefined],
      loanAmountInWordsTrans: [undefined],
      purposeOfLoanTrans: [undefined],
      numberOfVehicleTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      marginInPercentageTrans: [undefined],
      loanAdminFeeInFigureTrans: [undefined],
      loanAdminFeeInWordsTrans: [undefined],
      EMIAmountInFigureTrans: [undefined],
      EMIAmountInWordsTrans: [undefined],
      numberOfInstallmentsTrans: [undefined],
      nameOfBeneficiaryTrans: [undefined],

      loanAmountInFigureCT: [undefined],
      loanAmountInWordsCT: [undefined],
      purposeOfLoanCT: [undefined],
      numberOfVehicleCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      marginInPercentageCT: [undefined],
      loanAdminFeeInFigureCT: [undefined],
      loanAdminFeeInWordsCT: [undefined],
      EMIAmountInFigureCT: [undefined],
      EMIAmountInWordsCT: [undefined],
      numberOfInstallmentsCT: [undefined],
      nameOfBeneficiaryCT: [undefined],

      autoLoanType: [undefined],
      interestRateType: [undefined],

      loanId: [undefined],
      loanName: [undefined],
      loanNameNepali: [undefined]
    });
  }

  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.autoLoanCombinedForm.get(
        [arrayName, index, numLabel]).value ? this.autoLoanCombinedForm.get(
        [arrayName, index, numLabel]).value.toFixed(2) : '');
    this.autoLoanCombinedForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }

  async translateAndSetVal(i) {
    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAmountInFigure']).value ?
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAmountInFigure']).value.toFixed(2) : '';
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAmountInFigureTrans']).patchValue(convertNumber);
    this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAmountInFigureCT']).patchValue(
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAmountInFigureTrans']).value);

    this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAmountInWordsTrans']).patchValue(
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAmountInWords']).value);
    this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAmountInWordsCT']).patchValue(
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAmountInWordsTrans']).value);

    this.translatedFormGroup = this.formBuilder.group({
      purposeOfLoan: this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'purposeOfLoan']).value ?
          this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'purposeOfLoan']).value : '',
      nameOfBeneficiary: this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'nameOfBeneficiary']).value ?
          this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'nameOfBeneficiary']).value : ''
    });
    const translatedValue = await this.translateService.translateForm(this.translatedFormGroup);
    if (!ObjectUtil.isEmpty(translatedValue)) {
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'purposeOfLoanTrans']).patchValue(
          translatedValue.purposeOfLoan);
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'purposeOfLoanCT']).patchValue(
          translatedValue.purposeOfLoan);

      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'nameOfBeneficiaryTrans']).patchValue(
          translatedValue.nameOfBeneficiary);
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'nameOfBeneficiaryCT']).patchValue(
          translatedValue.nameOfBeneficiary);
    }

    const convertNumberOfVehicle = this.convertNumbersToNepali(this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'numberOfVehicle']).value ?
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'numberOfVehicle']).value : '', false);
    if (!ObjectUtil.isEmpty(convertNumberOfVehicle)) {
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'numberOfVehicleTrans']).patchValue(
          convertNumberOfVehicle);
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'numberOfVehicleCT']).patchValue(
          this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'numberOfVehicleTrans']).value);
    }

    const convertPremiumRate = this.convertNumbersToNepali(this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'premiumRate']).value ?
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'premiumRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertPremiumRate)) {
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'premiumRateTrans']).patchValue(convertPremiumRate);
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'premiumRateCT']).patchValue(
          this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'premiumRateTrans']).value);
    }

    const convertInterestRate = this.convertNumbersToNepali(this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'interestRate']).value ?
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'interestRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertInterestRate)) {
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'interestRateTrans']).patchValue(
          convertInterestRate);
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'interestRateCT']).patchValue(
          this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'interestRateTrans']).value);
    }

    const convertMarginInPercent = this.convertNumbersToNepali(this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'marginInPercentage']).value ?
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'marginInPercentage']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertMarginInPercent)) {
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'marginInPercentageTrans']).patchValue(convertMarginInPercent);
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'marginInPercentageCT']).patchValue(
          this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'marginInPercentageTrans']).value);
    }

    const tempLoanAdminFee = this.autoLoanCombinedForm.get(
        ['autoLoanCombinedFormArray', i, 'loanAdminFeeInFigure']).value ?
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAdminFeeInFigure']).value.toFixed(2) : '';
    const convertLoanAdminFee = !ObjectUtil.isEmpty(tempLoanAdminFee) ?
        this.convertNumbersToNepali(tempLoanAdminFee, true) : '';
    this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).patchValue(
        convertLoanAdminFee);
    this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAdminFeeInFigureCT']).patchValue(
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).value);

    this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).patchValue(
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAdminFeeInWords']).value);
    this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAdminFeeInWordsCT']).patchValue(
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).value);

    const tempEMIAmount = this.autoLoanCombinedForm.get(
        ['autoLoanCombinedFormArray', i, 'EMIAmountInFigure']).value ?
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'EMIAmountInFigure']).value.toFixed(2) : '';
    const convertEMIAmount = !ObjectUtil.isEmpty(tempEMIAmount) ?
        this.convertNumbersToNepali(tempEMIAmount, true) : '';
    this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'EMIAmountInFigureTrans']).patchValue(
        convertEMIAmount);
    this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'EMIAmountInFigureCT']).patchValue(
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'EMIAmountInFigureTrans']).value);

    this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'EMIAmountInWordsTrans']).patchValue(
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'EMIAmountInWords']).value);
    this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'EMIAmountInWordsCT']).patchValue(
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'EMIAmountInWordsTrans']).value);

    const convertNumberOfInstallment = this.convertNumbersToNepali(this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'numberOfInstallments']).value ?
        this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'numberOfInstallments']).value : '', false);
    if (!ObjectUtil.isEmpty(convertNumberOfInstallment)) {
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'numberOfInstallmentsTrans']).patchValue(
          convertNumberOfInstallment);
      this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'numberOfInstallmentsCT']).patchValue(
          this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'numberOfInstallmentsTrans']).value);
    }
  }

  /* FOR CURRENCY FORMATTER IT TAKES PARAMETER TYPE TRUE*/
  convertNumbersToNepali(val, type: boolean) {
    let finalConvertedVal;
    if (!ObjectUtil.isEmpty(val)) {
      if (type) {
        finalConvertedVal = this.engToNepNumberPipe.transform(
            this.currencyFormatterPipe.transform(val.toString())
        );
      } else {
        finalConvertedVal = this.engToNepNumberPipe.transform(val.toString());
      }
    }
    return finalConvertedVal;
  }

  calInterestRate(i) {
    let baseRate;
    if (!ObjectUtil.isEmpty(this.globalBaseRate)) {
      baseRate = this.globalBaseRate;
    } else {
      baseRate = (!ObjectUtil.isEmpty(this.initialInformation) && !ObjectUtil.isEmpty(this.initialInformation.retailGlobalForm) &&
          !ObjectUtil.isEmpty(this.initialInformation.retailGlobalForm.baseRate)) ?
          this.initialInformation.retailGlobalForm.baseRate : 0;    }
    const premiumRate =  this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.autoLoanCombinedForm.get(['autoLoanCombinedFormArray', i, 'interestRate']).patchValue(sum);
  }

}
