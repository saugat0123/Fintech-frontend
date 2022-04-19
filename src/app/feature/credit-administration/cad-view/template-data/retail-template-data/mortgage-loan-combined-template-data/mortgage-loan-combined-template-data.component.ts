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
    console.log('called form mortgage');
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
        this.mortgageCombineLoanForm.patchValue(this.initialInformation.mortgageCombineLoanForm);
      }
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount);
        this.mortgageCombineLoanForm.get(['mortgageCombineLoanFormArray', val, 'loanAmount']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.mortgageCombineLoanForm.get(['mortgageCombineLoanFormArray', val, 'loanAmountWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
  }

  buildForm() {
    this.mortgageCombineLoanForm = this.formBuilder.group({
      mortgageCombineLoanFormArray: this.formBuilder.array([]),
    });
  }

  filterLoanDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.MORTGAGE_LOAN_COMBINED);
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
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.mortgageCombineLoanForm.get([mainArray, index, 'loanAmountTrans']).patchValue(convertNumber);

    this.mortgageCombineLoanForm.get([mainArray, index, 'loanAmountWordsTrans']).patchValue(
        this.mortgageCombineLoanForm.get([mainArray, index, 'loanAmountWords']).value
    );

    const tempPurpose = this.mortgageCombineLoanForm.get([mainArray, index, 'purposeOfLoan']).value;
    if (!ObjectUtil.isEmpty(tempPurpose)) {
      this.mortgageCombineLoanForm.get([mainArray, index, 'purposeOfLoanTrans']);
    }

    const convertedPremiumRate = this.convertNumbersToNepali(this.mortgageCombineLoanForm
        .get([mainArray, index, 'premiumRate']).value.toFixed(2), false);
    this.mortgageCombineLoanForm.get([mainArray, index, 'premiumRateTrans']).patchValue(convertedPremiumRate);

    const convertedInterestRate = this.convertNumbersToNepali(this.mortgageCombineLoanForm
        .get([mainArray, index, 'interestRate']).value, false);
    this.mortgageCombineLoanForm.get([mainArray, index, 'interestRateTrans']).patchValue(convertedInterestRate);

    const tempMargin = this.mortgageCombineLoanForm.get([mainArray, index, 'marginPercent']).value;
    if (!ObjectUtil.isEmpty(tempMargin)) {
      const convertMargin = this.convertNumbersToNepali(tempMargin, true);
      this.mortgageCombineLoanForm.get([mainArray, index, 'marginPercentTrans']).patchValue(convertMargin);
    }

    const tempAdminAmount = this.mortgageCombineLoanForm.get([mainArray, index, 'loanAdmin']).value;
    if (!ObjectUtil.isEmpty(tempAdminAmount)) {
      const convertAdminNumber = this.convertNumbersToNepali(tempAdminAmount, true);
      this.mortgageCombineLoanForm.get([mainArray, index, 'loanAdminTrans']).patchValue(convertAdminNumber);

      this.mortgageCombineLoanForm.get([mainArray, index, 'loanAdminWordsTrans']).patchValue(
          this.mortgageCombineLoanForm.get([mainArray, index, 'loanAdminWords']).value
      );
    }

    const tempEmiAmount = this.mortgageCombineLoanForm.get([mainArray, index, 'emiAmount']).value;
    if (!ObjectUtil.isEmpty(tempEmiAmount)) {
      const convertEmiNumber = this.convertNumbersToNepali(tempEmiAmount, true);
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

    const tempBeneficiaryName = this.mortgageCombineLoanForm.get([mainArray, index, 'beneficiaryName']).value;
    if (!ObjectUtil.isEmpty(tempBeneficiaryName)) {
      this.mortgageCombineLoanForm.get([mainArray, index, 'beneficiaryNameTrans']).patchValue(tempBeneficiaryName);
    }
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

}
