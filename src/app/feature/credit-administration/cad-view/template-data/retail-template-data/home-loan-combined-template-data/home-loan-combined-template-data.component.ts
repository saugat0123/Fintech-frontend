import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {WordNumberingPipe} from '../../../../../../@core/pipe/word-numbering.pipe';

@Component({
  selector: 'app-home-loan-combined-template-data',
  templateUrl: './home-loan-combined-template-data.component.html',
  styleUrls: ['./home-loan-combined-template-data.component.scss']
})
export class HomeLoanCombinedTemplateDataComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  @Input() globalBaseRate;
  homeLoanCombinedForm: FormGroup;
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
              private translateService: SbTranslateService,
              public wordNumbering: WordNumberingPipe) { }

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
        this.setConstructionArray();
        this.homeLoanCombinedForm.patchValue(this.initialInformation.homeLoanCombinedForm);
      }
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount);
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', val, 'loanAmountInFigure']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', val, 'loanAmountInWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }
  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === 'HOME LOAN COMBINED');
    this.filteredList.forEach((val, i) => {
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
    });
  }
  buildForm() {
    this.homeLoanCombinedForm = this.formBuilder.group({
      homeLoanCombinedFormArray: this.formBuilder.array([])
    });
  }
  filteredListDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === 'HOME LOAN COMBINED');
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }
  addLoanFormArr() {
    (this.homeLoanCombinedForm.get('homeLoanCombinedFormArray') as FormArray).push(this.buildFormArray());
  }
  buildFormArray() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      purposeOfLoan: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      marginInPercentage: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInWords: [undefined],
      EMIAmountInFigure: [undefined],
      EMIAmountInWords: [undefined],
      numberOfInstallments: [undefined],
      moratoriumPeriod: [undefined],
      nameOfBeneficiary: [undefined],
      nameOfBank: [undefined],

      firstPhaseConstructionCost: [undefined],
      finalPhaseConstructionCost: [undefined],

      firstInstallmentAmountInFigure: [undefined],
      finalInstallmentAmountInFigure: [undefined],
      firstInstallmentAmountInWords: [undefined],
      finalInstallmentAmountInWords: [undefined],

      middlePhaseConstruction: this.formBuilder.array([]),

      loanAmountInFigureTrans: [undefined],
      loanAmountInWordsTrans: [undefined],
      purposeOfLoanTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      marginInPercentageTrans: [undefined],
      loanAdminFeeInFigureTrans: [undefined],
      loanAdminFeeInWordsTrans: [undefined],
      EMIAmountInFigureTrans: [undefined],
      EMIAmountInWordsTrans: [undefined],
      numberOfInstallmentsTrans: [undefined],
      moratoriumPeriodTrans: [undefined],
      nameOfBeneficiaryTrans: [undefined],
      nameOfBankTrans: [undefined],

      firstPhaseConstructionCostTrans: [undefined],
      finalPhaseConstructionCostTrans: [undefined],

      firstInstallmentAmountInFigureTrans: [undefined],
      finalInstallmentAmountInFigureTrans: [undefined],
      firstInstallmentAmountInWordsTrans: [undefined],
      finalInstallmentAmountInWordsTrans: [undefined],

      loanAmountInFigureCT: [undefined],
      loanAmountInWordsCT: [undefined],
      purposeOfLoanCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      marginInPercentageCT: [undefined],
      loanAdminFeeInFigureCT: [undefined],
      loanAdminFeeInWordsCT: [undefined],
      EMIAmountInFigureCT: [undefined],
      EMIAmountInWordsCT: [undefined],
      numberOfInstallmentsCT: [undefined],
      moratoriumPeriodCT: [undefined],
      nameOfBeneficiaryCT: [undefined],
      nameOfBankCT: [undefined],

      firstPhaseConstructionCostCT: [undefined],
      finalPhaseConstructionCostCT: [undefined],

      firstInstallmentAmountInFigureCT: [undefined],
      finalInstallmentAmountInFigureCT: [undefined],
      firstInstallmentAmountInWordsCT: [undefined],
      finalInstallmentAmountInWordsCT: [undefined],

      homeLoanCase: [undefined],
      firstTimeHomeBuyerCheck: [undefined],
      NcellStaffCheck: [undefined],
      interestRateType: [undefined],
      moratoriumPeriodCheck: [undefined],

      loanId: [undefined]
    });
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
          this.initialInformation.retailGlobalForm.baseRate : 0;
    }
    const premiumRate =  this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'interestRate']).patchValue(sum);
  }
  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.homeLoanCombinedForm.get(
        [arrayName, index, numLabel]).value);
    this.homeLoanCombinedForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }
  public getNumAmountWordDyna(numLabel, wordLabel, index, arrayName, i, innerArray): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.homeLoanCombinedForm.get(
        [arrayName, index, innerArray, i, numLabel]).value);
    this.homeLoanCombinedForm.get([arrayName, index, innerArray, i, wordLabel]).patchValue(transformValue);
  }

  addConstructionDetails(i, mainArray) {
    (this.homeLoanCombinedForm.get([mainArray, i, 'middlePhaseConstruction']) as FormArray).push(
        this.formBuilder.group({
          nPhaseConstructionCost: [undefined],
          nPhaseInstallmentAmountInFigure: [undefined],
          nPhaseInstallmentAmountInWords: [undefined],

          nPhaseConstructionCostTrans: [undefined],
          nPhaseInstallmentAmountInFigureTrans: [undefined],
          nPhaseInstallmentAmountInWordsTrans: [undefined],

          nPhaseConstructionCostCT: [undefined],
          nPhaseInstallmentAmountInFigureCT: [undefined],
          nPhaseInstallmentAmountInWordsCT: [undefined],
        })
    );
  }

  removeConstructionDetails(i, index, mainArray) {
    (this.homeLoanCombinedForm.get([mainArray, i, 'middlePhaseConstruction']) as FormArray).removeAt(index);
  }

  async translateAndSetVal(i) {
    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAmountInFigure']).value ?
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAmountInFigure']).value.toFixed(2) : '';
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAmountInFigureTrans']).patchValue(convertNumber);
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAmountInFigureCT']).patchValue(
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAmountInFigureTrans']).value);

    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAmountInWordsTrans']).patchValue(
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAmountInWords']).value);
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAmountInWordsCT']).patchValue(
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAmountInWordsTrans']).value);

    this.translatedFormGroup = this.formBuilder.group({
      purposeOfLoan: this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'purposeOfLoan']).value ?
          this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'purposeOfLoan']).value : '',
      nameOfBeneficiary: this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'nameOfBeneficiary']).value ?
          this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'nameOfBeneficiary']).value : '',
      nameOfBank: this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'nameOfBank']).value ?
          this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'nameOfBank']).value : '',
    });
    const translatedValue = await this.translateService.translateForm(this.translatedFormGroup);
    if (!ObjectUtil.isEmpty(translatedValue)) {
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'purposeOfLoanTrans']).patchValue(
          translatedValue.purposeOfLoan);
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'purposeOfLoanCT']).patchValue(
          translatedValue.purposeOfLoan);

      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'nameOfBeneficiaryTrans']).patchValue(
          translatedValue.nameOfBeneficiary);
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'nameOfBeneficiaryCT']).patchValue(
          translatedValue.nameOfBeneficiary);

      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'nameOfBankTrans']).patchValue(
          translatedValue.nameOfBank);
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'nameOfBankCT']).patchValue(
          translatedValue.nameOfBank);
    }

    const convertPremiumRate = this.convertNumbersToNepali(this.homeLoanCombinedForm.get(
        ['homeLoanCombinedFormArray', i, 'premiumRate']).value ? this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'premiumRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertPremiumRate)) {
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'premiumRateTrans']).patchValue(convertPremiumRate);
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'premiumRateCT']).patchValue(
          this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'premiumRateTrans']).value);
    }

    const convertInterestRate = this.convertNumbersToNepali(this.homeLoanCombinedForm.get(
        ['homeLoanCombinedFormArray', i, 'interestRate']).value ? this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'interestRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertInterestRate)) {
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'interestRateTrans']).patchValue(
          convertInterestRate);
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'interestRateCT']).patchValue(
          this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'interestRateTrans']).value);
    }

    const convertMarginInPercent = this.convertNumbersToNepali(this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'marginInPercentage']).value ?
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'marginInPercentage']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertMarginInPercent)) {
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'marginInPercentageTrans']).patchValue(convertMarginInPercent);
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'marginInPercentageCT']).patchValue(
          this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'marginInPercentageTrans']).value);
    }

    const tempLoanAdminFee = this.homeLoanCombinedForm.get(
        ['homeLoanCombinedFormArray', i, 'loanAdminFeeInFigure']).value ?
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAdminFeeInFigure']).value.toFixed(2) : '';
    const convertLoanAdminFee = !ObjectUtil.isEmpty(tempLoanAdminFee) ?
        this.convertNumbersToNepali(tempLoanAdminFee, true) : '';
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).patchValue(
        convertLoanAdminFee);
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAdminFeeInFigureCT']).patchValue(
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).value);

    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).patchValue(
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAdminFeeInWords']).value);
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAdminFeeInWordsCT']).patchValue(
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).value);

    const tempEMIAmount = this.homeLoanCombinedForm.get(
        ['homeLoanCombinedFormArray', i, 'EMIAmountInFigure']).value ?
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'EMIAmountInFigure']).value.toFixed(2) : '';
    const convertEMIAmount = !ObjectUtil.isEmpty(tempEMIAmount) ?
        this.convertNumbersToNepali(tempEMIAmount, true) : '';
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'EMIAmountInFigureTrans']).patchValue(
        convertEMIAmount);
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'EMIAmountInFigureCT']).patchValue(
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'EMIAmountInFigureTrans']).value);

    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'EMIAmountInWordsTrans']).patchValue(
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'EMIAmountInWords']).value);
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'EMIAmountInWordsCT']).patchValue(
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'EMIAmountInWordsTrans']).value);

    const convertNumberOfInstallment = this.convertNumbersToNepali(this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'numberOfInstallments']).value ?
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'numberOfInstallments']).value : '', false);
    if (!ObjectUtil.isEmpty(convertNumberOfInstallment)) {
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'numberOfInstallmentsTrans']).patchValue(
          convertNumberOfInstallment);
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'numberOfInstallmentsCT']).patchValue(
          this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'numberOfInstallmentsTrans']).value);
    }

    const convertMoratoriumPeriod = this.convertNumbersToNepali(this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'moratoriumPeriod']).value ?
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'moratoriumPeriod']).value : '', false);
    if (!ObjectUtil.isEmpty(convertMoratoriumPeriod)) {
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'moratoriumPeriodTrans']).patchValue(
          convertMoratoriumPeriod);
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'moratoriumPeriodCT']).patchValue(
          this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'moratoriumPeriodTrans']).value);
    }

    const convertFirstPhaseCOnstruction = this.convertNumbersToNepali(this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'firstPhaseConstructionCost']).value ?
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'firstPhaseConstructionCost']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertFirstPhaseCOnstruction)) {
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'firstPhaseConstructionCostTrans']).patchValue(
          convertFirstPhaseCOnstruction);
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'firstPhaseConstructionCostCT']).patchValue(
          this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'firstPhaseConstructionCostTrans']).value);
    }

    const convertFinalPhaseConstruction = this.convertNumbersToNepali(this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'finalPhaseConstructionCost']).value ?
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'finalPhaseConstructionCost']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertFinalPhaseConstruction)) {
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'finalPhaseConstructionCostTrans']).patchValue(
          convertFinalPhaseConstruction);
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'finalPhaseConstructionCostCT']).patchValue(
          this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'finalPhaseConstructionCostTrans']).value);
    }

    const tempFirstInstallment = this.homeLoanCombinedForm.get(
        ['homeLoanCombinedFormArray', i, 'firstInstallmentAmountInFigure']).value ?
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'firstInstallmentAmountInFigure']).value.toFixed(2) : '';
    const convertFirstInstallment = !ObjectUtil.isEmpty(tempFirstInstallment) ?
        this.convertNumbersToNepali(tempFirstInstallment, true) : '';
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'firstInstallmentAmountInFigureTrans']).patchValue(
        convertFirstInstallment);
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'firstInstallmentAmountInFigureCT']).patchValue(
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'firstInstallmentAmountInFigureTrans']).value);

    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'firstInstallmentAmountInWordsTrans']).patchValue(
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'firstInstallmentAmountInWords']).value);
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'firstInstallmentAmountInWordsCT']).patchValue(
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'firstInstallmentAmountInWordsTrans']).value);

    const tempFinalInstallment = this.homeLoanCombinedForm.get(
        ['homeLoanCombinedFormArray', i, 'finalInstallmentAmountInFigure']).value ?
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'finalInstallmentAmountInFigure']).value.toFixed(2) : '';
    const convertFinalInstallment = !ObjectUtil.isEmpty(tempFinalInstallment) ?
        this.convertNumbersToNepali(tempFinalInstallment, true) : '';
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'finalInstallmentAmountInFigureTrans']).patchValue(
        convertFinalInstallment);
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'finalInstallmentAmountInFigureCT']).patchValue(
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'finalInstallmentAmountInFigureTrans']).value);

    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'finalInstallmentAmountInWordsTrans']).patchValue(
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'finalInstallmentAmountInWords']).value);
    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'finalInstallmentAmountInWordsCT']).patchValue(
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'finalInstallmentAmountInWordsTrans']).value);

    this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'middlePhaseConstruction']).value.forEach((val, index) => {
      const tempCost = this.convertNumbersToNepali(this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'middlePhaseConstruction', index, 'nPhaseConstructionCost']).value ?
          this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'middlePhaseConstruction', index, 'nPhaseConstructionCost']).value.toFixed(2) : '', false);
      if (!ObjectUtil.isEmpty(tempCost)) {
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'middlePhaseConstruction', index, 'nPhaseConstructionCostTrans']).patchValue(
            tempCost);
        this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'middlePhaseConstruction', index, 'nPhaseConstructionCostCT']).patchValue(
            this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'middlePhaseConstruction', index, 'nPhaseConstructionCostTrans']).value);
      }

      const tempMiddleInstallment = this.homeLoanCombinedForm.get(
          ['homeLoanCombinedFormArray', i, 'middlePhaseConstruction', index, 'nPhaseInstallmentAmountInFigure']).value ?
          this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'middlePhaseConstruction', index, 'nPhaseInstallmentAmountInFigure']).value.toFixed(2) : '';
      const convertMiddleInstallment = !ObjectUtil.isEmpty(tempMiddleInstallment) ?
          this.convertNumbersToNepali(tempMiddleInstallment, true) : '';
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'middlePhaseConstruction', index, 'nPhaseInstallmentAmountInFigureTrans']).patchValue(
          convertMiddleInstallment);
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'middlePhaseConstruction', index, 'nPhaseInstallmentAmountInFigureCT']).patchValue(
          this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'middlePhaseConstruction', index, 'nPhaseInstallmentAmountInFigureTrans']).value);

      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'middlePhaseConstruction', index, 'nPhaseInstallmentAmountInWordsTrans']).patchValue(
          this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'middlePhaseConstruction', index, 'nPhaseInstallmentAmountInWords']).value);
      this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'middlePhaseConstruction', index, 'nPhaseInstallmentAmountInWordsCT']).patchValue(
          this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', i, 'middlePhaseConstruction', index, 'nPhaseInstallmentAmountInWordsTrans']).value);
    });
  }
  setConstructionArray() {
    if (!ObjectUtil.isEmpty(this.initialInformation) && !ObjectUtil.isEmpty(this.initialInformation.homeLoanCombinedForm) &&
        !ObjectUtil.isEmpty(this.initialInformation.homeLoanCombinedForm.homeLoanCombinedFormArray)) {
      this.initialInformation.homeLoanCombinedForm.homeLoanCombinedFormArray.forEach((val, index) => {
        val.middlePhaseConstruction.forEach((cons, i) => {
          (this.homeLoanCombinedForm.get(['homeLoanCombinedFormArray', index, 'middlePhaseConstruction']) as FormArray).push(
              this.formBuilder.group({
                nPhaseConstructionCost: [undefined],
                nPhaseInstallmentAmountInFigure: [undefined],
                nPhaseInstallmentAmountInWords: [undefined],

                nPhaseConstructionCostTrans: [undefined],
                nPhaseInstallmentAmountInFigureTrans: [undefined],
                nPhaseInstallmentAmountInWordsTrans: [undefined],

                nPhaseConstructionCostCT: [undefined],
                nPhaseInstallmentAmountInFigureCT: [undefined],
                nPhaseInstallmentAmountInWordsCT: [undefined],
              })
          );
        });
      });
    }
  }

}
