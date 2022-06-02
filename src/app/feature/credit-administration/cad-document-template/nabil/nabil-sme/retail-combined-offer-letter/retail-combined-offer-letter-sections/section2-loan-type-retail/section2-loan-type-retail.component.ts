import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {executeKarmaBuilder} from '@angular-devkit/build-angular';

@Component({
  selector: 'app-section2-loan-type-retail',
  templateUrl: './section2-loan-type-retail.component.html',
  styleUrls: ['./section2-loan-type-retail.component.scss']
})
export class Section2LoanTypeRetailComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  form: FormGroup;
  initialData;
  educationLoanAustraliaAgainstTDArray: Array<any> = new Array<any>();
  educationLoanOtherAgainstTDArray: Array<any> = new Array<any>();
  educationLoanAustraliaArray: Array<any> = new Array<any>();
  educationLoanOtherCountriesArray: Array<any> = new Array<any>();
  freeTextVal: any = {};
  shareLoanFreeTextArray: Array<any> = new Array<any>();
  personalLoanFreeTextArray: Array<any> = new Array<any>();
  tempInformation;
  finalFacility;
  facilityNames: Array<String> = [];
  allFacilityNames;

  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData) &&
    !ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList[0].initialInformation)) {
        this.initialData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
      }
      // this.loanOption = this.initialData.smeGlobalForm.loanOption;
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList[0].supportedInformation)) {
        this.tempInformation = JSON.parse(this.cadData.offerDocumentList[0].supportedInformation);
      }
    }
    console.log('Initial Data:', this.initialData);
    this.buildForm();
    this.patchData();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      // For Existing Loan
      existingLoanFormArray: this.formBuilder.array([]),

      // For Mortgage Combined Loan
      mortgageCombineLoanFormArray: this.formBuilder.array([]),

      // Education Loan
      // Australia Against TD
      educationLoanAustraliaAgainstTDFormArray: this.formBuilder.array([]),
      // Other Countries Against TD
      educationLoanOtherAgainstTDFormArray: this.formBuilder.array([]),
      // Education Loan Australia
      educationLoanAustraliaFormArray: this.formBuilder.array([]),
      // Education Loan Other Countries
      educationLoanOtherCountriesFormArray: this.formBuilder.array([]),

      // Personal Loan
      personalLoanFormArray: this.formBuilder.array([]),

      // Housing Loan
      housingLoanFormArray: this.formBuilder.array([]),

      // Auto Loan
      autoLoanFormArray: this.formBuilder.array([]),

      // Personal Overdraft Loan
      personalOverdraftLoanFormArray: this.formBuilder.array([]),

      // Nabil Sahayatri Loan New and Renewal
      nabilSahayatriLoanFormArray: this.formBuilder.array([]),

      // Personal Overdraft Without Collateral
      personalOverdraftWithoutCollateralFormArray: this.formBuilder.array([]),

      // Nabil Share Loan POD
      nabilShareLoanPODFormArray: this.formBuilder.array([]),

      // Share Loan Demand
      shareLoanDemandFormArray: this.formBuilder.array([])

    });
    this.setFormArrays();
  }
  setFormArrays() {
    if (!ObjectUtil.isEmpty(this.initialData)) {
      if (!ObjectUtil.isEmpty(this.initialData.existingLoanForm) &&
      !ObjectUtil.isEmpty(this.initialData.existingLoanForm.existingLoanFormArray)) {
        for (let a = 0; a < this.initialData.existingLoanForm.existingLoanFormArray.length; a++) {
          (this.form.get('existingLoanFormArray') as FormArray).push(this.setExistingLoanFormArray());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.mortgageCombineForm) &&
          !ObjectUtil.isEmpty(this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray)) {
        for (let a = 0; a < this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray.length; a++) {
          (this.form.get('mortgageCombineLoanFormArray') as FormArray).push(this.setMortgageLoanFormArray());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray)) {
        for (let a = 0; a < this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray.length; a++) {
          (this.form.get('personalLoanFormArray') as FormArray).push(this.setPersonalLoanFormArray());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.homeLoanCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray)) {
        for (let a = 0; a < this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray.length; a++) {
          (this.form.get('housingLoanFormArray') as FormArray).push(this.setHomeLoanForm());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.autoLoanCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray)) {
        for (let a = 0; a < this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray.length; a++) {
          (this.form.get('autoLoanFormArray') as FormArray).push(this.setAutoLoanForm());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.personalOverdraftCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray)) {
        for (let a = 0; a < this.initialData.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray.length; a++) {
          (this.form.get('personalOverdraftLoanFormArray') as FormArray).push(this.setCommonFormArray());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.nabilSahayatriCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray)) {
        for (let a = 0; a < this.initialData.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray.length; a++) {
          (this.form.get('nabilSahayatriLoanFormArray') as FormArray).push(this.setCommonFormArray());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.personalOverDraftWithoutCollateralCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray)) {
        for (let a = 0; a < this.initialData.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray.length; a++) {
          (this.form.get('personalOverdraftWithoutCollateralFormArray') as FormArray).push(this.setCommonFormArray());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.nabilShareLoanPODForm) &&
          !ObjectUtil.isEmpty(this.initialData.nabilShareLoanPODForm.nabilShareLoanPODFormArray)) {
        for (let a = 0; a < this.initialData.nabilShareLoanPODForm.nabilShareLoanPODFormArray.length; a++) {
          (this.form.get('nabilShareLoanPODFormArray') as FormArray).push(this.setCommonFormArray());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray)) {
        for (let a = 0; a < this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray.length; a++) {
          (this.form.get('shareLoanDemandFormArray') as FormArray).push(this.setCommonFormArray());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.educationLoanForm) &&
          !ObjectUtil.isEmpty(this.initialData.educationLoanForm.educationLoanCombinedFormArray)) {
        this.educationLoanAustraliaAgainstTDArray = this.initialData.educationLoanForm.educationLoanCombinedFormArray.filter(
            val => val.countryName === 'AUSTRALIA' && val.securityType === 'TD');
        this.educationLoanOtherAgainstTDArray = this.initialData.educationLoanForm.educationLoanCombinedFormArray.filter(
            val => val.countryName === 'OTHERS' && val.securityType === 'TD');
        this.educationLoanAustraliaArray = this.initialData.educationLoanForm.educationLoanCombinedFormArray.filter(
            val => val.countryName === 'AUSTRALIA' && val.securityType !== 'TD');
        this.educationLoanOtherCountriesArray = this.initialData.educationLoanForm.educationLoanCombinedFormArray.filter(
            val => val.countryName === 'OTHERS' && val.securityType !== 'TD');

        if (!ObjectUtil.isEmpty(this.educationLoanAustraliaAgainstTDArray)) {
          for (let a = 0; a < this.educationLoanAustraliaAgainstTDArray.length; a++) {
            (this.form.get('educationLoanAustraliaAgainstTDFormArray') as FormArray).push(this.setEducationAgainstTDForm());
          }
        }

        if (!ObjectUtil.isEmpty(this.educationLoanOtherAgainstTDArray)) {
          for (let a = 0; a < this.educationLoanOtherAgainstTDArray.length; a++) {
            (this.form.get('educationLoanOtherAgainstTDFormArray') as FormArray).push(this.setEducationAgainstTDForm());
          }
        }

        if (!ObjectUtil.isEmpty(this.educationLoanAustraliaArray)) {
          for (let a = 0; a < this.educationLoanAustraliaArray.length; a++) {
            (this.form.get('educationLoanAustraliaFormArray') as FormArray).push(this.setNormalEducationForm());
          }
        }

        if (!ObjectUtil.isEmpty(this.educationLoanOtherCountriesArray)) {
          for (let a = 0; a < this.educationLoanOtherCountriesArray.length; a++) {
            (this.form.get('educationLoanOtherCountriesFormArray') as FormArray).push(this.setNormalEducationForm());
          }
        }
      }
    }
  }
  setCommonFormArray() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      purposeOfLoan: [undefined],
      baseRate: [undefined],
      interestPremium: [undefined],
      interestRate: [undefined],
      margin: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInWords: [undefined],
      loanExpiryDate: [undefined],

      freeText: [undefined],
    });
  }
  setAutoLoanForm() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      purposeOfLoan: [undefined],
      numberOfVehicle: [undefined],
      baseRate: [undefined],
      interestPremium: [undefined],
      interestRate: [undefined],
      margin: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInWords: [undefined],
      emiAmountInFigure: [undefined],
      emiAmountInWords: [undefined],
      totalNumberOfInstallment: [undefined],
    });
  }
  setHomeLoanForm() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      purposeOfLoan: [undefined],
      baseRate: [undefined],
      interestPremium: [undefined],
      interestRate: [undefined],
      margin: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInWords: [undefined],
      emiAmountInFigure: [undefined],
      emiAmountInWords: [undefined],
      totalNumberOfInstallment: [undefined],
      moratoriumPeriod: [undefined],
    });
  }
  setPersonalLoanFormArray() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      purposeOfLoan: [undefined],
      baseRate: [undefined],
      interestPremium: [undefined],
      interestRate: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInWords: [undefined],
      emiAmountInFigure: [undefined],
      emiAmountInWords: [undefined],
      totalNumberOfInstallment: [undefined],
      freeDate: [undefined]
    });
  }
  setEducationAgainstTDForm() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      purposeOfLoan: [undefined],
      baseRate: [undefined],
      interestPremium: [undefined],
      interestRate: [undefined],
      fixedDepositAmountInFigure: [undefined],
      fixedDepositAmountInWords: [undefined],
      tdNumber: [undefined],
      loanExpiryDate: [undefined]
    });
  }
  setNormalEducationForm() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      purposeOfLoan: [undefined],
      baseRate: [undefined],
      interestPremium: [undefined],
      interestRate: [undefined],
      margin: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInWords: [undefined],
      emiAmountInFigure: [undefined],
      emiAmountInWords: [undefined],
      totalNumberOfInstallment: [undefined],
      moratoriumPeriod: [undefined]
    });
  }
  setMortgageLoanFormArray() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      purposeOfLoan: [undefined],
      baseRate: [undefined],
      interestPremium: [undefined],
      interestRate: [undefined],
      margin: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInWords: [undefined],
      emiAmountInFigure: [undefined],
      emiAmountInWords: [undefined],
      totalNumberOfInstallment: [undefined]
    });
  }
  setExistingLoanFormArray() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      purposeOfLoan: [undefined],
      baseRate: [undefined],
      interestPremium: [undefined],
      interestRate: [undefined],
      facilityName: [undefined]
    });
  }
  patchData(): void {
    this.patchExistingLoanFormData();
    this.patchMortgageLoanFormData();
    this.patchPersonalLoanFormData();
    this.patchEducationFormData();
    this.patchHousingFormData();
    this.patchAutoLoanFormData();
    this.patchCommonFormData();
    this.patchShareDemandFreeText();
  }

  patchShareDemandFreeText() {
    if (!ObjectUtil.isEmpty(this.tempInformation) &&
        !ObjectUtil.isEmpty(this.tempInformation.section2)) {
      if (!ObjectUtil.isEmpty(this.initialData) &&
          !ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray)) {
        this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray.forEach((val, i) => {
          this.form.get(['shareLoanDemandFormArray', i, 'freeText']).patchValue(
              !ObjectUtil.isEmpty(this.tempInformation.section2.loanDemandFreeText[i]) &&
              !ObjectUtil.isEmpty(this.tempInformation.section2.loanDemandFreeText[i].freeText) ?
                  this.tempInformation.section2.loanDemandFreeText[i].freeText : '');
        });
      }
      if (!ObjectUtil.isEmpty(this.initialData) &&
          !ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray)) {
        this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray.forEach((val, i) => {
          this.form.get(['personalLoanFormArray', i, 'freeDate']).patchValue(
              !ObjectUtil.isEmpty(this.tempInformation.section2.personalLoanFreeText[i]) &&
              !ObjectUtil.isEmpty(this.tempInformation.section2.personalLoanFreeText[i].freeDate) ?
                  this.tempInformation.section2.personalLoanFreeText[i].freeDate : '');
        });
      }
    }
  }
  patchCommonFormData() {
    if (!ObjectUtil.isEmpty(this.initialData) &&
        !ObjectUtil.isEmpty(this.initialData.nabilSahayatriCombinedForm) &&
        !ObjectUtil.isEmpty(this.initialData.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray)) {
      this.patchCommonData('nabilSahayatriLoanFormArray', this.initialData.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray);
    }
    if (!ObjectUtil.isEmpty(this.initialData) &&
        !ObjectUtil.isEmpty(this.initialData.personalOverdraftCombinedForm) &&
        !ObjectUtil.isEmpty(this.initialData.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray)) {
      this.patchCommonData('personalOverdraftLoanFormArray', this.initialData.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray);
    }
    if (!ObjectUtil.isEmpty(this.initialData) &&
        !ObjectUtil.isEmpty(this.initialData.personalOverDraftWithoutCollateralCombinedForm) &&
        !ObjectUtil.isEmpty(this.initialData.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray)) {
      this.patchCommonData('personalOverdraftWithoutCollateralFormArray', this.initialData.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray);
    }
    if (!ObjectUtil.isEmpty(this.initialData) &&
        !ObjectUtil.isEmpty(this.initialData.nabilShareLoanPODForm) &&
        !ObjectUtil.isEmpty(this.initialData.nabilShareLoanPODForm.nabilShareLoanPODFormArray)) {
      this.patchCommonData('nabilShareLoanPODFormArray', this.initialData.nabilShareLoanPODForm.nabilShareLoanPODFormArray);
    }
    if (!ObjectUtil.isEmpty(this.initialData) &&
        !ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm) &&
        !ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray)) {
      this.patchCommonData('shareLoanDemandFormArray', this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray);
    }
  }
  patchCommonData(formArray, incomingArray) {
    for (let val = 0; val < incomingArray.length; val++) {
      this.form.get([formArray, val, 'loanAmountInFigure']).patchValue(
          incomingArray[val] &&
          incomingArray[val].loanAmountInFigureCT ?
              incomingArray[val].loanAmountInFigureCT : ''
      );
      this.form.get([formArray, val, 'loanAmountInWords']).patchValue(
          incomingArray[val] &&
          incomingArray[val].loanAmountInWordsCT ?
              incomingArray[val].loanAmountInWordsCT : ''
      );
      this.form.get([formArray, val, 'purposeOfLoan']).patchValue(
          incomingArray[val] &&
          incomingArray[val].purposeOfLoanCT ?
              incomingArray[val].purposeOfLoanCT : ''
      );
      this.form.get([formArray, val, 'baseRate']).patchValue(
          this.initialData.retailGlobalForm &&
          this.initialData.retailGlobalForm.baseRateCT ?
              this.initialData.retailGlobalForm.baseRateCT : ''
      );
      this.form.get([formArray, val, 'interestPremium']).patchValue(
          incomingArray[val] &&
          incomingArray[val].premiumRateCT ?
              incomingArray[val].premiumRateCT : ''
      );
      this.form.get([formArray, val, 'interestRate']).patchValue(
          incomingArray[val] &&
          incomingArray[val].interestRateCT ?
              incomingArray[val].interestRateCT : ''
      );
      this.form.get([formArray, val, 'margin']).patchValue(
          incomingArray[val] &&
          incomingArray[val].marginInPercentageCT ?
              incomingArray[val].marginInPercentageCT : ''
      );
      this.form.get([formArray, val, 'loanAdminFeeInFigure']).patchValue(
          incomingArray[val] &&
          incomingArray[val].loanAdminFeeInFigureCT ?
              incomingArray[val].loanAdminFeeInFigureCT : ''
      );
      this.form.get([formArray, val, 'loanAdminFeeInWords']).patchValue(
          incomingArray[val] &&
          incomingArray[val].loanAdminFeeInWordsCT ?
              incomingArray[val].loanAdminFeeInWordsCT : ''
      );
      this.form.get([formArray, val, 'loanExpiryDate']).patchValue(!ObjectUtil.isEmpty(
          this.patchDate(incomingArray[val])) ?
          this.patchDate(incomingArray[val]) : '');
    }
  }
  patchAutoLoanFormData() {
    if (!ObjectUtil.isEmpty(this.initialData) &&
        !ObjectUtil.isEmpty(this.initialData.autoLoanCombinedForm) &&
        !ObjectUtil.isEmpty(this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray)) {
      for (let val = 0; val < this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray.length; val++) {
        this.form.get(['autoLoanFormArray', val, 'loanAmountInFigure']).patchValue(
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val] &&
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].loanAmountInFigureCT ?
                this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].loanAmountInFigureCT : ''
        );
        this.form.get(['autoLoanFormArray', val, 'loanAmountInWords']).patchValue(
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val] &&
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].loanAmountInWordsCT ?
                this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].loanAmountInWordsCT : ''
        );
        this.form.get(['autoLoanFormArray', val, 'purposeOfLoan']).patchValue(
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val] &&
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].purposeOfLoanCT ?
                this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].purposeOfLoanCT : ''
        );
        this.form.get(['autoLoanFormArray', val, 'baseRate']).patchValue(
            this.initialData.retailGlobalForm &&
            this.initialData.retailGlobalForm.baseRateCT ?
                this.initialData.retailGlobalForm.baseRateCT : ''
        );
        this.form.get(['autoLoanFormArray', val, 'interestPremium']).patchValue(
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val] &&
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].premiumRateCT ?
                this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].premiumRateCT : ''
        );
        this.form.get(['autoLoanFormArray', val, 'interestRate']).patchValue(
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val] &&
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].interestRateCT ?
                this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].interestRateCT : ''
        );
        this.form.get(['autoLoanFormArray', val, 'margin']).patchValue(
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val] &&
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].marginInPercentageCT ?
                this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].marginInPercentageCT : ''
        );
        this.form.get(['autoLoanFormArray', val, 'loanAdminFeeInFigure']).patchValue(
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val] &&
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].loanAdminFeeInFigureCT ?
                this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].loanAdminFeeInFigureCT : ''
        );
        this.form.get(['autoLoanFormArray', val, 'loanAdminFeeInWords']).patchValue(
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val] &&
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].loanAdminFeeInWordsCT ?
                this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].loanAdminFeeInWordsCT : ''
        );
        this.form.get(['autoLoanFormArray', val, 'emiAmountInFigure']).patchValue(
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val] &&
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].EMIAmountInFigureCT ?
                this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].EMIAmountInFigureCT : ''
        );
        this.form.get(['autoLoanFormArray', val, 'emiAmountInWords']).patchValue(
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val] &&
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].EMIAmountInWordsCT ?
                this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].EMIAmountInWordsCT : ''
        );
        this.form.get(['autoLoanFormArray', val, 'totalNumberOfInstallment']).patchValue(
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val] &&
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].numberOfInstallmentsCT ?
                this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].numberOfInstallmentsCT : ''
        );
        this.form.get(['autoLoanFormArray', val, 'numberOfVehicle']).patchValue(
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val] &&
            this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].numberOfVehicleCT ?
                this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray[val].numberOfVehicleCT : ''
        );
      }
    }
  }
  patchHousingFormData() {
    if (!ObjectUtil.isEmpty(this.initialData) &&
        !ObjectUtil.isEmpty(this.initialData.homeLoanCombinedForm) &&
        !ObjectUtil.isEmpty(this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray)) {
      for (let val = 0; val < this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray.length; val++) {
        this.form.get(['housingLoanFormArray', val, 'loanAmountInFigure']).patchValue(
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val] &&
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].loanAmountInFigureCT ?
                this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].loanAmountInFigureCT : ''
        );
        this.form.get(['housingLoanFormArray', val, 'loanAmountInWords']).patchValue(
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val] &&
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].loanAmountInWordsCT ?
                this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].loanAmountInWordsCT : ''
        );
        this.form.get(['housingLoanFormArray', val, 'purposeOfLoan']).patchValue(
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val] &&
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].purposeOfLoanCT ?
                this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].purposeOfLoanCT : ''
        );
        this.form.get(['housingLoanFormArray', val, 'baseRate']).patchValue(
            this.initialData.retailGlobalForm &&
            this.initialData.retailGlobalForm.baseRateCT ?
                this.initialData.retailGlobalForm.baseRateCT : ''
        );
        this.form.get(['housingLoanFormArray', val, 'interestPremium']).patchValue(
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val] &&
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].premiumRateCT ?
                this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].premiumRateCT : ''
        );
        this.form.get(['housingLoanFormArray', val, 'interestRate']).patchValue(
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val] &&
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].interestRateCT ?
                this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].interestRateCT : ''
        );
        this.form.get(['housingLoanFormArray', val, 'margin']).patchValue(
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val] &&
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].marginInPercentageCT ?
                this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].marginInPercentageCT : ''
        );
        this.form.get(['housingLoanFormArray', val, 'loanAdminFeeInFigure']).patchValue(
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val] &&
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].loanAdminFeeInFigureCT ?
                this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].loanAdminFeeInFigureCT : ''
        );
        this.form.get(['housingLoanFormArray', val, 'loanAdminFeeInWords']).patchValue(
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val] &&
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].loanAdminFeeInWordsCT ?
                this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].loanAdminFeeInWordsCT : ''
        );
        this.form.get(['housingLoanFormArray', val, 'emiAmountInFigure']).patchValue(
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val] &&
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].EMIAmountInFigureCT ?
                this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].EMIAmountInFigureCT : ''
        );
        this.form.get(['housingLoanFormArray', val, 'emiAmountInWords']).patchValue(
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val] &&
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].EMIAmountInWordsCT ?
                this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].EMIAmountInWordsCT : ''
        );
        this.form.get(['housingLoanFormArray', val, 'totalNumberOfInstallment']).patchValue(
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val] &&
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].numberOfInstallmentsCT ?
                this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].numberOfInstallmentsCT : ''
        );
        this.form.get(['housingLoanFormArray', val, 'moratoriumPeriod']).patchValue(
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val] &&
            this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].moratoriumPeriodCT ?
                this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray[val].moratoriumPeriodCT : ''
        );
      }
    }
  }
  patchEducationFormData() {
    if (this.educationLoanAustraliaArray.length > 0) {
      this.patchEducationAustraliaAgainstLand(this.educationLoanAustraliaArray, 'educationLoanAustraliaFormArray');
    }
    if (this.educationLoanOtherCountriesArray.length > 0) {
      this.patchEducationAustraliaAgainstLand(this.educationLoanOtherCountriesArray, 'educationLoanOtherCountriesFormArray');
    }
    if (this.educationLoanAustraliaAgainstTDArray.length > 0) {
      this.patchEducationAustraliaAgainstTD(this.educationLoanAustraliaAgainstTDArray, 'educationLoanAustraliaAgainstTDFormArray');
    }
    if (this.educationLoanOtherAgainstTDArray.length > 0) {
      this.patchEducationAustraliaAgainstTD(this.educationLoanOtherAgainstTDArray, 'educationLoanOtherAgainstTDFormArray');
    }
  }
  patchEducationAustraliaAgainstLand(filteredArray, formArrayName) {
    if (!ObjectUtil.isEmpty(filteredArray)) {
      for (let val = 0; val < filteredArray.length; val++) {
        this.form.get([formArrayName, val, 'loanAmountInFigure']).patchValue(
            filteredArray[val] &&
            filteredArray[val].loanAmountInFigureCT ?
                filteredArray[val].loanAmountInFigureCT : ''
        );
        this.form.get([formArrayName, val, 'loanAmountInWords']).patchValue(
            filteredArray[val] &&
            filteredArray[val].loanAmountInWordsCT ?
                filteredArray[val].loanAmountInWordsCT : ''
        );
        this.form.get([formArrayName, val, 'purposeOfLoan']).patchValue(
            filteredArray[val] &&
            filteredArray[val].purposeOfLoanCT ?
                filteredArray[val].purposeOfLoanCT : ''
        );
        this.form.get([formArrayName, val, 'baseRate']).patchValue(
            this.initialData.retailGlobalForm &&
            this.initialData.retailGlobalForm.baseRateCT ?
                this.initialData.retailGlobalForm.baseRateCT : ''
        );
        this.form.get([formArrayName, val, 'interestPremium']).patchValue(
            filteredArray[val] &&
            filteredArray[val].premiumRateCT ?
                filteredArray[val].premiumRateCT : ''
        );
        this.form.get([formArrayName, val, 'interestRate']).patchValue(
            filteredArray[val] &&
            filteredArray[val].interestRateCT ?
                filteredArray[val].interestRateCT : ''
        );
        this.form.get([formArrayName, val, 'margin']).patchValue(
            filteredArray[val] &&
            filteredArray[val].marginInPercentageCT ?
                filteredArray[val].marginInPercentageCT : ''
        );
        this.form.get([formArrayName, val, 'loanAdminFeeInFigure']).patchValue(
            filteredArray[val] &&
            filteredArray[val].loanAdminFeeInFigureCT ?
                filteredArray[val].loanAdminFeeInFigureCT : ''
        );
        this.form.get([formArrayName, val, 'loanAdminFeeInWords']).patchValue(
            filteredArray[val] &&
            filteredArray[val].loanAdminFeeInWordsCT ?
                filteredArray[val].loanAdminFeeInWordsCT : ''
        );
        this.form.get([formArrayName, val, 'emiAmountInFigure']).patchValue(
            filteredArray[val] &&
            filteredArray[val].EMIAmountInFigureCT ?
                filteredArray[val].EMIAmountInFigureCT : ''
        );
        this.form.get([formArrayName, val, 'emiAmountInWords']).patchValue(
            filteredArray[val] &&
            filteredArray[val].EMIAmountInWordsCT ?
                filteredArray[val].EMIAmountInWordsCT : ''
        );
        this.form.get([formArrayName, val, 'totalNumberOfInstallment']).patchValue(
            filteredArray[val] &&
            filteredArray[val].totalNumberOfInstallmentsCT ?
                filteredArray[val].totalNumberOfInstallmentsCT : ''
        );
        this.form.get([formArrayName, val, 'moratoriumPeriod']).patchValue(
            filteredArray[val] &&
            filteredArray[val].moratoriumPeriodCT ?
                filteredArray[val].moratoriumPeriodCT : ''
        );
      }
    }
  }
  patchEducationAustraliaAgainstTD(filteredArray, formArrayName) {
    if (!ObjectUtil.isEmpty(filteredArray)) {
      for (let val = 0; val < filteredArray.length; val++) {
        this.form.get([formArrayName, val, 'loanAmountInFigure']).patchValue(
            filteredArray[val] &&
            filteredArray[val].loanAmountInFigureCT ?
                filteredArray[val].loanAmountInFigureCT : ''
        );
        this.form.get([formArrayName, val, 'loanAmountInWords']).patchValue(
            filteredArray[val] &&
            filteredArray[val].loanAmountInWordsCT ?
                filteredArray[val].loanAmountInWordsCT : ''
        );
        this.form.get([formArrayName, val, 'purposeOfLoan']).patchValue(
            filteredArray[val] &&
            filteredArray[val].purposeOfLoanCT ?
                filteredArray[val].purposeOfLoanCT : ''
        );
        this.form.get([formArrayName, val, 'baseRate']).patchValue(
            filteredArray[val] &&
            filteredArray[val].baseRateCT ?
                filteredArray[val].baseRateCT : ''
        );
        this.form.get([formArrayName, val, 'interestPremium']).patchValue(
            filteredArray[val] &&
            filteredArray[val].premiumRateCT ?
                filteredArray[val].premiumRateCT : ''
        );
        this.form.get([formArrayName, val, 'interestRate']).patchValue(
            filteredArray[val] &&
            filteredArray[val].interestRateCT ?
                filteredArray[val].interestRateCT : ''
        );
        this.form.get([formArrayName, val, 'fixedDepositAmountInFigure']).patchValue(
            filteredArray[val] &&
            filteredArray[val].FDAmountInFigureCT ?
                filteredArray[val].FDAmountInFigureCT : ''
        );
        this.form.get([formArrayName, val, 'fixedDepositAmountInWords']).patchValue(
            filteredArray[val] &&
            filteredArray[val].FDAmountInWordsCT ?
                filteredArray[val].FDAmountInWordsCT : ''
        );
        this.form.get([formArrayName, val, 'tdNumber']).patchValue(
            filteredArray[val] &&
            filteredArray[val].FDNumberCT ?
                filteredArray[val].FDNumberCT : ''
        );
        this.form.get([formArrayName, val, 'loanExpiryDate']).patchValue(
            !ObjectUtil.isEmpty(this.patchDate(filteredArray[val])) ?
                this.patchDate(filteredArray[val]) : '');
      }
    }
  }
  patchPersonalLoanFormData() {
    if (!ObjectUtil.isEmpty(this.initialData) &&
        !ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm) &&
        !ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray)) {
      for (let val = 0; val < this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray.length; val++) {
        this.form.get(['personalLoanFormArray', val, 'loanAmountInFigure']).patchValue(
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val] &&
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].loanAmountInFigureCT ?
                this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].loanAmountInFigureCT : ''
        );
        this.form.get(['personalLoanFormArray', val, 'loanAmountInWords']).patchValue(
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val] &&
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].loanAmountInWordsCT ?
                this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].loanAmountInWordsCT : ''
        );
        this.form.get(['personalLoanFormArray', val, 'purposeOfLoan']).patchValue(
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val] &&
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].purposeOfLoanCT ?
                this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].purposeOfLoanCT : ''
        );
        this.form.get(['personalLoanFormArray', val, 'baseRate']).patchValue(
            this.initialData.retailGlobalForm &&
            this.initialData.retailGlobalForm.baseRateCT ?
                this.initialData.retailGlobalForm.baseRateCT : ''
        );
        this.form.get(['personalLoanFormArray', val, 'interestPremium']).patchValue(
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val] &&
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].premiumRateCT ?
                this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].premiumRateCT : ''
        );
        this.form.get(['personalLoanFormArray', val, 'interestRate']).patchValue(
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val] &&
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].interestRateCT ?
                this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].interestRateCT : ''
        );
        this.form.get(['personalLoanFormArray', val, 'loanAdminFeeInFigure']).patchValue(
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val] &&
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].loanAdminFeeInFigureCT ?
                this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].loanAdminFeeInFigureCT : ''
        );
        this.form.get(['personalLoanFormArray', val, 'loanAdminFeeInWords']).patchValue(
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val] &&
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].loanAdminFeeInWordsCT ?
                this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].loanAdminFeeInWordsCT : ''
        );
        this.form.get(['personalLoanFormArray', val, 'emiAmountInFigure']).patchValue(
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val] &&
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].EMIAmountInFigureCT ?
                this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].EMIAmountInFigureCT : ''
        );
        this.form.get(['personalLoanFormArray', val, 'emiAmountInWords']).patchValue(
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val] &&
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].EMIAmountInWordsCT ?
                this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].EMIAmountInWordsCT : ''
        );
        this.form.get(['personalLoanFormArray', val, 'totalNumberOfInstallment']).patchValue(
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val] &&
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].numberOfInstallmentsCT ?
                this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].numberOfInstallmentsCT : ''
        );
        this.form.get(['personalLoanFormArray', val, 'freeDate']).patchValue(
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val] &&
            this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].paymentDateCT ?
                this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray[val].paymentDateCT : ''
        );
      }
    }
  }
  patchExistingLoanFormData() {
    if (!ObjectUtil.isEmpty(this.initialData) &&
        !ObjectUtil.isEmpty(this.initialData.existingLoanForm) &&
        !ObjectUtil.isEmpty(this.initialData.existingLoanForm.existingLoanFormArray)) {
      for (let val = 0; val < this.initialData.existingLoanForm.existingLoanFormArray.length; val++) {
        this.form.get(['existingLoanFormArray', val, 'loanAmountInFigure']).patchValue(
            this.initialData.existingLoanForm.existingLoanFormArray[val] &&
            this.initialData.existingLoanForm.existingLoanFormArray[val].loanAmountInFigureCT ?
                this.initialData.existingLoanForm.existingLoanFormArray[val].loanAmountInFigureCT : ''
        );
        this.form.get(['existingLoanFormArray', val, 'loanAmountInWords']).patchValue(
            this.initialData.existingLoanForm.existingLoanFormArray[val] &&
            this.initialData.existingLoanForm.existingLoanFormArray[val].loanAmountInWordsCT ?
                this.initialData.existingLoanForm.existingLoanFormArray[val].loanAmountInWordsCT : ''
        );
        this.form.get(['existingLoanFormArray', val, 'purposeOfLoan']).patchValue(
            this.initialData.existingLoanForm.existingLoanFormArray[val] &&
            this.initialData.existingLoanForm.existingLoanFormArray[val].purposeOfLoanCT ?
                this.initialData.existingLoanForm.existingLoanFormArray[val].purposeOfLoanCT : ''
        );
        this.form.get(['existingLoanFormArray', val, 'baseRate']).patchValue(
            this.initialData.existingLoanForm.existingLoanFormArray[val] &&
            this.initialData.existingLoanForm.existingLoanFormArray[val].baseRateCT ?
                this.initialData.existingLoanForm.existingLoanFormArray[val].baseRateCT : ''
        );
        this.form.get(['existingLoanFormArray', val, 'interestPremium']).patchValue(
            this.initialData.existingLoanForm.existingLoanFormArray[val] &&
            this.initialData.existingLoanForm.existingLoanFormArray[val].premiumRateCT ?
                this.initialData.existingLoanForm.existingLoanFormArray[val].premiumRateCT : ''
        );
        this.form.get(['existingLoanFormArray', val, 'interestRate']).patchValue(
            this.initialData.existingLoanForm.existingLoanFormArray[val] &&
            this.initialData.existingLoanForm.existingLoanFormArray[val].interestRateCT ?
                this.initialData.existingLoanForm.existingLoanFormArray[val].interestRateCT : ''
        );
      }
    }
  }
  patchMortgageLoanFormData() {
    if (!ObjectUtil.isEmpty(this.initialData) &&
        !ObjectUtil.isEmpty(this.initialData.mortgageCombineForm) &&
        !ObjectUtil.isEmpty(this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray)) {
      for (let val = 0; val < this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray.length; val++) {
        this.form.get(['mortgageCombineLoanFormArray', val, 'loanAmountInFigure']).patchValue(
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val] &&
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].loanAmountCT ?
                this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].loanAmountCT : ''
        );
        this.form.get(['mortgageCombineLoanFormArray', val, 'loanAmountInWords']).patchValue(
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val] &&
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].loanAmountWordsCT ?
                this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].loanAmountWordsCT : ''
        );
        this.form.get(['mortgageCombineLoanFormArray', val, 'purposeOfLoan']).patchValue(
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val] &&
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].purposeOfLoanCT ?
                this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].purposeOfLoanCT : ''
        );
        this.form.get(['mortgageCombineLoanFormArray', val, 'baseRate']).patchValue(
            this.initialData.retailGlobalForm &&
            this.initialData.retailGlobalForm.baseRateCT ?
                this.initialData.retailGlobalForm.baseRateCT : ''
        );
        this.form.get(['mortgageCombineLoanFormArray', val, 'interestPremium']).patchValue(
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val] &&
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].premiumRateCT ?
                this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].premiumRateCT : ''
        );
        this.form.get(['mortgageCombineLoanFormArray', val, 'interestRate']).patchValue(
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val] &&
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].interestRateCT ?
                this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].interestRateCT : ''
        );
        this.form.get(['mortgageCombineLoanFormArray', val, 'margin']).patchValue(
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val] &&
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].marginPercentCT ?
                this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].marginPercentCT : ''
        );
        this.form.get(['mortgageCombineLoanFormArray', val, 'loanAdminFeeInFigure']).patchValue(
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val] &&
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].loanAdminCT ?
                this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].loanAdminCT : ''
        );
        this.form.get(['mortgageCombineLoanFormArray', val, 'loanAdminFeeInWords']).patchValue(
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val] &&
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].loanAdminWordsCT ?
                this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].loanAdminWordsCT : ''
        );
        this.form.get(['mortgageCombineLoanFormArray', val, 'emiAmountInFigure']).patchValue(
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val] &&
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].emiAmountCT ?
                this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].emiAmountCT : ''
        );
        this.form.get(['mortgageCombineLoanFormArray', val, 'emiAmountInWords']).patchValue(
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val] &&
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].emiAmountWordsCT ?
                this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].emiAmountWordsCT : ''
        );
        this.form.get(['mortgageCombineLoanFormArray', val, 'totalNumberOfInstallment']).patchValue(
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val] &&
            this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].totalInstallmentCT ?
                this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray[val].totalInstallmentCT : ''
        );
      }
    }
  }
  patchDate(formArray) {
    if (!ObjectUtil.isEmpty(formArray &&
        formArray.loanExpiryDateTypeCT)) {
      if (formArray.loanExpiryDateTypeCT === 'AD') {
        if (!ObjectUtil.isEmpty(formArray.loanExpiryDateCT)) {
          return formArray.loanExpiryDateCT;
        }
      }
      if (formArray.loanExpiryDateTypeCT === 'BS') {
        if (!ObjectUtil.isEmpty(formArray.loanExpiryDateNepaliCT)) {
          return formArray.loanExpiryDateNepaliCT;
        }
      }
    }
  }
  setTextAreaValue() {
    this.freeTextVal = {
      loanDemandFreeText: this.shareLoanFreeText(),
      personalLoanFreeText: this.personalLoanFreeText(),
    };
    return this.freeTextVal;
  }
  shareLoanFreeText() {
    if (!ObjectUtil.isEmpty(this.initialData) &&
        !ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm) &&
        !ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray)) {
      for (let val = 0; val < this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray.length; val++) {
        const tempFreeText = {
          freeText: this.form.get(['shareLoanDemandFormArray', val, 'freeText']).value ?
              this.form.get(['shareLoanDemandFormArray', val, 'freeText']).value : '',
        };
        this.shareLoanFreeTextArray.push(tempFreeText);
      }
      return this.shareLoanFreeTextArray;
    }
  }
  personalLoanFreeText() {
    if (!ObjectUtil.isEmpty(this.initialData) &&
        !ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm) &&
        !ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray)) {
      for (let val = 0; val < this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray.length; val++) {
        const tempFreeText = {
          freeDate: this.form.get(['personalLoanFormArray', val, 'freeDate']).value ?
              this.form.get(['personalLoanFormArray', val, 'freeDate']).value : '',
        };
        this.personalLoanFreeTextArray.push(tempFreeText);
      }
      return this.personalLoanFreeTextArray;
    }
  }

}
