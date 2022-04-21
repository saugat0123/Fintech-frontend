import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

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
      baseRate = this.initialInformation.retailGlobalForm.baseRate;
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

}
