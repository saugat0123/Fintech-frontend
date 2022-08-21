import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {DatePipe} from '@angular/common';
import {LoanNameConstant} from '../../nabil-sme-template-data/sme-costant/loan-name-constant';

@Component({
  selector: 'app-mortgage-loan-combined-template-data',
  templateUrl: './mortgage-loan-combined-template-data.component.html',
  styleUrls: ['./mortgage-loan-combined-template-data.component.scss']
})
export class MortgageLoanCombinedTemplateDataComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  @Input() globalBaseRate;
  spinner = false;
  mortgageCombineLoanForm: FormGroup;
  yesNoOptions = [
    {value: 'Yes'},
    {value: 'No'}
  ];
  filteredList: any = [];
  loanNameConstant = LoanNameConstant;
  initialInformation: any;
  loanDetails: any = [];
  translatedFormGroup: FormGroup;
  filteredLoanIdList: any = [];

  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private engToNepDatePipe: EngNepDatePipe,
              private translateService: SbTranslateService,
              private datePipe: DatePipe,
              private translatedService: SbTranslateService,
              private engToNepWord: NepaliCurrencyWordPipe) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
      this.filterLoanDetails(this.loanDetails);
    }
    if (this.offerDocumentList.length > 0) {
      this.offerDocumentList.forEach(offerLetter => {
        this.initialInformation = JSON.parse(offerLetter.initialInformation);
      });
      if (!ObjectUtil.isEmpty(this.initialInformation)) {
        this.mortgageCombineLoanForm.patchValue(this.initialInformation.mortgageCombineForm);
      }
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount.toFixed(2));
        this.mortgageCombineLoanForm.get(['mortgageCombineLoanFormArray', val, 'loanAmount']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.mortgageCombineLoanForm.get(['mortgageCombineLoanFormArray', val, 'loanAmountWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }
  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === 'MORTGAGE LOAN COMBINED');
    this.filteredList.forEach((val, i) => {
      this.mortgageCombineLoanForm.get(['mortgageCombineLoanFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
      this.mortgageCombineLoanForm.get(['mortgageCombineLoanFormArray', i, 'loanName']).patchValue(
          this.filteredLoanIdList[i].loan.name);
      this.mortgageCombineLoanForm.get(['mortgageCombineLoanFormArray', i, 'loanNameNepali']).patchValue(
          this.filteredLoanIdList[i].loan.nepaliName);
    });
  }
  buildForm() {
    this.mortgageCombineLoanForm = this.formBuilder.group({
      mortgageCombineLoanFormArray: this.formBuilder.array([]),
    });
  }

  filterLoanDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === 'MORTGAGE LOAN COMBINED');
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }

  addLoanFormArr() {
    (this.mortgageCombineLoanForm.get('mortgageCombineLoanFormArray') as FormArray).push(this.buildLoanForm());
  }

  private buildLoanForm() {
    return this.formBuilder.group({
      interestRateType: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      purposeOfLoan: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      marginPercent: [undefined],
      loanAdmin: [undefined],
      loanAdminWords: [undefined],
      emiAmount: [undefined],
      emiAmountWords: [undefined],
      totalInstallment: [undefined],
      beneficiaryName: [undefined],

      // For Translation
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      purposeOfLoanTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      marginPercentTrans: [undefined],
      loanAdminTrans: [undefined],
      loanAdminWordsTrans: [undefined],
      emiAmountTrans: [undefined],
      emiAmountWordsTrans: [undefined],
      totalInstallmentTrans: [undefined],
      beneficiaryNameTrans: [undefined],

      // For CT
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      purposeOfLoanCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      marginPercentCT: [undefined],
      loanAdminCT: [undefined],
      loanAdminWordsCT: [undefined],
      emiAmountCT: [undefined],
      emiAmountWordsCT: [undefined],
      totalInstallmentCT: [undefined],
      beneficiaryNameCT: [undefined],

      loanId: [undefined],
      loanName: [undefined],
      loanNameNepali: [undefined]

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

  async setTranslatedVal(index, mainArray) {
    this.spinner = true;
    const tempLoanAmount = this.mortgageCombineLoanForm.get([mainArray, index, 'loanAmount']).value;
    if (!ObjectUtil.isEmpty(tempLoanAmount)) {
      const convertNumber = this.convertNumbersToNepali(tempLoanAmount.toFixed(2), true);
      this.mortgageCombineLoanForm.get([mainArray, index, 'loanAmountTrans']).patchValue(convertNumber);

      this.mortgageCombineLoanForm.get([mainArray, index, 'loanAmountWordsTrans']).patchValue(
          this.mortgageCombineLoanForm.get([mainArray, index, 'loanAmountWords']).value
      );
    }

    const tempPremiumRate = this.mortgageCombineLoanForm.get([mainArray, index, 'premiumRate']).value;
    if (!ObjectUtil.isEmpty(tempPremiumRate)) {
      const convertedPremiumRate = this.convertNumbersToNepali(tempPremiumRate.toFixed(2), false);
      this.mortgageCombineLoanForm.get([mainArray, index, 'premiumRateTrans']).patchValue(convertedPremiumRate);
    }

    const convertInterestRate = this.convertNumbersToNepali(this.mortgageCombineLoanForm.get(['mortgageCombineLoanFormArray', index, 'interestRate']).value ?
        this.mortgageCombineLoanForm.get(['mortgageCombineLoanFormArray', index, 'interestRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertInterestRate)) {
      this.mortgageCombineLoanForm.get(['mortgageCombineLoanFormArray', index, 'interestRateTrans']).patchValue(
          convertInterestRate);
    }

    const tempMargin = this.mortgageCombineLoanForm.get([mainArray, index, 'marginPercent']).value;
    if (!ObjectUtil.isEmpty(tempMargin)) {
      const convertMargin = this.convertNumbersToNepali(tempMargin.toFixed(2), true);
      this.mortgageCombineLoanForm.get([mainArray, index, 'marginPercentTrans']).patchValue(convertMargin);
    }

    const tempAdminAmount = this.mortgageCombineLoanForm.get([mainArray, index, 'loanAdmin']).value;
    if (!ObjectUtil.isEmpty(tempAdminAmount)) {
      const convertAdminNumber = this.convertNumbersToNepali(Number(tempAdminAmount).toFixed(2), true);
      this.mortgageCombineLoanForm.get([mainArray, index, 'loanAdminTrans']).patchValue(convertAdminNumber);

      this.mortgageCombineLoanForm.get([mainArray, index, 'loanAdminWordsTrans']).patchValue(
          this.mortgageCombineLoanForm.get([mainArray, index, 'loanAdminWords']).value
      );
    }

    const tempEmiAmount = this.mortgageCombineLoanForm.get([mainArray, index, 'emiAmount']).value;
    if (!ObjectUtil.isEmpty(tempEmiAmount)) {
      const convertEmiNumber = this.convertNumbersToNepali(Number(tempEmiAmount).toFixed(2), true);
      this.mortgageCombineLoanForm.get([mainArray, index, 'emiAmountTrans']).patchValue(convertEmiNumber);

      this.mortgageCombineLoanForm.get([mainArray, index, 'emiAmountWordsTrans']).patchValue(
          this.mortgageCombineLoanForm.get([mainArray, index, 'emiAmountWords']).value
      );
    }
    const convertedTotalNumber = this.convertNumbersToNepali(this.mortgageCombineLoanForm
        .get([mainArray, index, 'totalInstallment']).value, false);
    if (!ObjectUtil.isEmpty(convertedTotalNumber)) {
      this.mortgageCombineLoanForm.get([mainArray, index, 'totalInstallmentTrans']).patchValue(convertedTotalNumber);
    }

    /* Constructing Form for translation */
    this.translatedFormGroup = this.formBuilder.group({
      purposeOfLoan: [this.mortgageCombineLoanForm.get([mainArray, index, 'purposeOfLoan']).value],
    });

    // translated by google api
    this.translatedFormGroup = this.formBuilder.group({
      purposeOfLoan: !ObjectUtil.isEmpty(this.mortgageCombineLoanForm.get([mainArray, index, 'purposeOfLoan']).value) ?
          this.mortgageCombineLoanForm.get([mainArray, index, 'purposeOfLoan']).value : '',
    });
     const translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);
    this.mortgageCombineLoanForm.get([mainArray, index, 'purposeOfLoanTrans']).patchValue(translatedValue.purposeOfLoan);

    /* Constructing Form for translation */
    this.translatedFormGroup = this.formBuilder.group({
      beneficiaryName: [this.mortgageCombineLoanForm.get([mainArray, index, 'beneficiaryName']).value],
    });

    // translated by google api
    this.translatedFormGroup = this.formBuilder.group({
      beneficiaryName: !ObjectUtil.isEmpty(this.mortgageCombineLoanForm.get([mainArray, index, 'beneficiaryName']).value) ?
          this.mortgageCombineLoanForm.get([mainArray, index, 'beneficiaryName']).value : '',
    });
    const beneficiaryTrans =  await this.translateService.translateForm(this.translatedFormGroup);
    this.mortgageCombineLoanForm.get([mainArray, index, 'beneficiaryNameTrans']).patchValue(beneficiaryTrans.beneficiaryName);

    this.setCTValues(index, mainArray);
    this.spinner = false;
  }

  private setCTValues(index, mainArray) {
    this.mortgageCombineLoanForm.get([mainArray, index, 'loanAmountCT']).patchValue(
        this.mortgageCombineLoanForm.get([mainArray, index, 'loanAmountTrans']).value
    );
    this.mortgageCombineLoanForm.get([mainArray, index, 'loanAmountWordsCT']).patchValue(
        this.mortgageCombineLoanForm.get([mainArray, index, 'loanAmountWordsTrans']).value
    );
    this.mortgageCombineLoanForm.get([mainArray, index, 'purposeOfLoanCT']).patchValue(
        this.mortgageCombineLoanForm.get([mainArray, index, 'purposeOfLoanTrans']).value
    );
    this.mortgageCombineLoanForm.get([mainArray, index, 'premiumRateCT']).patchValue(
        this.mortgageCombineLoanForm.get([mainArray, index, 'premiumRateTrans']).value
    );
    this.mortgageCombineLoanForm.get([mainArray, index, 'interestRateCT']).patchValue(
        this.mortgageCombineLoanForm.get([mainArray, index, 'interestRateTrans']).value
    );
    this.mortgageCombineLoanForm.get([mainArray, index, 'marginPercentCT']).patchValue(
        this.mortgageCombineLoanForm.get([mainArray, index, 'marginPercentTrans']).value
    );
    this.mortgageCombineLoanForm.get([mainArray, index, 'loanAdminCT']).patchValue(
        this.mortgageCombineLoanForm.get([mainArray, index, 'loanAdminTrans']).value
    );
    this.mortgageCombineLoanForm.get([mainArray, index, 'loanAdminWordsCT']).patchValue(
        this.mortgageCombineLoanForm.get([mainArray, index, 'loanAdminWordsTrans']).value
    );
    this.mortgageCombineLoanForm.get([mainArray, index, 'emiAmountCT']).patchValue(
        this.mortgageCombineLoanForm.get([mainArray, index, 'emiAmountTrans']).value
    );
    this.mortgageCombineLoanForm.get([mainArray, index, 'emiAmountWordsCT']).patchValue(
        this.mortgageCombineLoanForm.get([mainArray, index, 'emiAmountWordsTrans']).value
    );
    this.mortgageCombineLoanForm.get([mainArray, index, 'totalInstallmentCT']).patchValue(
        this.mortgageCombineLoanForm.get([mainArray, index, 'totalInstallmentTrans']).value
    );
    this.mortgageCombineLoanForm.get([mainArray, index, 'beneficiaryNameCT']).patchValue(
        this.mortgageCombineLoanForm.get([mainArray, index, 'beneficiaryNameTrans']).value
    );
  }

  amountInWord(index, formControl, wordFormControl) {
    const amountWord = this.engToNepWord.transform(
        this.mortgageCombineLoanForm.get(['mortgageCombineLoanFormArray', index, formControl]).value ?
            this.mortgageCombineLoanForm.get(['mortgageCombineLoanFormArray', index, formControl]).value.toFixed(2) : '');
    this.mortgageCombineLoanForm.get(['mortgageCombineLoanFormArray', index, wordFormControl]).patchValue(
        amountWord ? amountWord : '');
  }

  calInterestRate(i) {
    let baseRate;
    if (!ObjectUtil.isEmpty(this.globalBaseRate)) {
      baseRate = this.globalBaseRate;
    } else {
      baseRate = (!ObjectUtil.isEmpty(this.initialInformation) && !ObjectUtil.isEmpty(this.initialInformation.retailGlobalForm) &&
          !ObjectUtil.isEmpty(this.initialInformation.retailGlobalForm.baseRate)) ?
          this.initialInformation.retailGlobalForm.baseRate : 0;    }
    const premiumRate =  this.mortgageCombineLoanForm.get(['mortgageCombineLoanFormArray', i, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.mortgageCombineLoanForm.get(['mortgageCombineLoanFormArray', i, 'interestRate']).patchValue(sum);
  }
}
