import { Component, OnInit, Input } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section8-loan-disbursement-related-clause',
  templateUrl: './section8-loan-disbursement-related-clause.component.html',
  styleUrls: ['./section8-loan-disbursement-related-clause.component.scss']
})
export class Section8LoanDisbursementRelatedClauseComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  initialData: any;
  form: FormGroup;
  purchaseArray: Array<any> = new Array<any>();
  constructionArray: Array<any> = new Array<any>();
  takeOverArray: Array<any> = new Array<any>();
  loanHolderInfo;
  branchName: String;
  freeTextVal: any = {};
  shareLoanFreeTextArray: Array<any> = new Array<any>();
  mortgageLoanFreeTextArray: Array<any> = new Array<any>();
  personalLoanFreeTextArray: Array<any> = new Array<any>();
  tempInformation;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData) &&
        !ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList[0].initialInformation)) {
        this.initialData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
      }
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList[0].supportedInformation)) {
        this.tempInformation = JSON.parse(this.cadData.offerDocumentList[0].supportedInformation);
      }
    }
    if (!ObjectUtil.isEmpty(this.cadData) &&
        !ObjectUtil.isEmpty(this.cadData.loanHolder) &&
        !ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.loanHolderInfo = JSON.parse(this.cadData.loanHolder.nepData);
      if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
        this.branchName = !ObjectUtil.isEmpty(this.loanHolderInfo.branch) &&
            !ObjectUtil.isEmpty(this.loanHolderInfo.branch.ct) ? this.loanHolderInfo.branch.ct : '';
      }
    }
    console.log('Initial Data:', this.initialData);
    this.buildForm();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      homeLoanPurchaseFormArray: this.formBuilder.array([]),
      homeLoanConstructionFormArray: this.formBuilder.array([]),
      homeLoanTakeOverFormArray: this.formBuilder.array([]),

      // educationLoanFormArray: this.formBuilder.array([]),

      autoLoanFormArray: this.formBuilder.array([]),

      personalLoanFormArray: this.formBuilder.array([]),

      personalOverdraftFormArray: this.formBuilder.array([]),

      personalOverdraftWithoutCollateralFormArray: this.formBuilder.array([]),

      mortgageLoanFormArray: this.formBuilder.array([]),

      nabilShareLoanFormArray: this.formBuilder.array([]),

      shareLoanDemandFormArray: this.formBuilder.array([]),

      branchName: [undefined]
    });
    this.setFormArrays();
    this.patchFormData();
    // this.patchShareDemandFreeText();
  }
  patchShareDemandFreeText() {
    if (!ObjectUtil.isEmpty(this.tempInformation) &&
        !ObjectUtil.isEmpty(this.tempInformation.section8)) {
      console.log('Free Info:', this.tempInformation);
      if (!ObjectUtil.isEmpty(this.initialData) &&
          !ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray)) {
        this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray.forEach((val, i) => {
          this.form.get(['shareLoanDemandFormArray', i, 'freetext11']).patchValue(
              !ObjectUtil.isEmpty(this.tempInformation.section8.loanDemandFreeText[i]) &&
              !ObjectUtil.isEmpty(this.tempInformation.section8.loanDemandFreeText[i].freetext11) ?
                  this.tempInformation.section8.loanDemandFreeText[i].freetext11 : '');
        });
      }
      if (!ObjectUtil.isEmpty(this.initialData) &&
          !ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray)) {
        this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray.forEach((val, i) => {
          this.form.get(['personalLoanFormArray', i, 'amtNum']).patchValue(
              !ObjectUtil.isEmpty(this.tempInformation.section8.personalLoanFreeText[i]) &&
                  !ObjectUtil.isEmpty(this.tempInformation.section8.personalLoanFreeText[i].amtNum) ?
                  this.tempInformation.section8.personalLoanFreeText[i].amtNum : '');
        });
      }
    }
  }
  patchFormData() {
    if (!ObjectUtil.isEmpty(this.initialData)) {
      if (!ObjectUtil.isEmpty(this.initialData.mortgageCombineForm) &&
          !ObjectUtil.isEmpty(this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray)) {
        this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray.forEach((val, i) => {
          this.form.get(['mortgageLoanFormArray', i, 'loanAmtFigure1']).patchValue(val.loanAmountCT ? val.loanAmountCT : '');
          this.form.get(['mortgageLoanFormArray', i, 'loanAmtWords3']).patchValue(val.loanAmountWordsCT ? val.loanAmountWordsCT : '');
          this.form.get(['mortgageLoanFormArray', i, 'nameOfBeneficiary4']).patchValue(val.beneficiaryNameCT ? val.beneficiaryNameCT : '');
          this.form.get(['mortgageLoanFormArray', i, 'mortgageClause']).patchValue(!ObjectUtil.isEmpty(this.tempInformation) ?
              !ObjectUtil.isEmpty(this.tempInformation.section8) ?
                  this.tempInformation.section8.mortgageClauseFreeText[i].mortgageClause : '' : '');
        });
      }

      if (!ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray)) {
        this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray.forEach((val, i) => {
          this.form.get(['personalLoanFormArray', i, 'loanAmtFig1']).patchValue(val.loanAmountInFigureCT ? val.loanAmountInFigureCT : '');
          this.form.get(['personalLoanFormArray', i, 'loanAmtInWords1']).patchValue(val.loanAmountInWordsCT ? val.loanAmountInWordsCT : '');
          this.form.get(['personalLoanFormArray', i, 'amtNum']).patchValue(val.accNumCT ? val.accNumCT : '');
        });
      }

      if (!ObjectUtil.isEmpty(this.initialData.homeLoanCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray)) {
        if (this.purchaseArray.length > 0) {
          this.purchaseArray.forEach((val, i) => {
            this.form.get(['homeLoanPurchaseFormArray', i, 'loanAmountInFigure']).patchValue(val.loanAmountInFigureCT ? val.loanAmountInFigureCT : '');
            this.form.get(['homeLoanPurchaseFormArray', i, 'loanAmountInWords']).patchValue(val.loanAmountInWordsCT ? val.loanAmountInWordsCT : '');
            this.form.get(['homeLoanPurchaseFormArray', i, 'nameOfBeneficiary']).patchValue(val.nameOfBeneficiaryCT ? val.nameOfBeneficiaryCT : '');
          });
        }
        if (this.constructionArray.length > 0) {
          this.constructionArray.forEach((val, i) => {
            this.form.get(['homeLoanConstructionFormArray', i, 'branchName']).patchValue(
                this.branchName ? this.branchName : '');

            // First Phase
            this.form.get(['homeLoanConstructionFormArray', i, 'freetext1']).patchValue(
                val.firstPhaseConstructionCostCT ? val.firstPhaseConstructionCostCT : '');
            this.form.get(['homeLoanConstructionFormArray', i, 'freetext2']).patchValue(
                val.firstInstallmentAmountInFigureCT ? val.firstInstallmentAmountInFigureCT : '');
            this.form.get(['homeLoanConstructionFormArray', i, 'freetext3']).patchValue(
                val.firstInstallmentAmountInWordsCT ? val.firstInstallmentAmountInWordsCT : '');

            // Middle Phase
            this.constructionArray[i].middlePhaseConstruction.forEach((midVal, j) => {
              this.form.get(['homeLoanConstructionFormArray', i, 'middlePhaseConstruction', j, 'freetext10']).patchValue(
                  midVal.nPhaseConstructionCostCT ? midVal.nPhaseConstructionCostCT : '');
              this.form.get(['homeLoanConstructionFormArray', i, 'middlePhaseConstruction', j, 'freetext4']).patchValue(
                  midVal.nPhaseInstallmentAmountInFigureCT ? midVal.nPhaseInstallmentAmountInFigureCT : '');
              this.form.get(['homeLoanConstructionFormArray', i, 'middlePhaseConstruction', j, 'freetext5']).patchValue(
                  midVal.nPhaseInstallmentAmountInWordsCT ? midVal.nPhaseInstallmentAmountInWordsCT : '');
            });

            // Final Phase
            // this.form.get(['homeLoanConstructionFormArray', i, 'freetext7']).patchValue(
            //     val.finalPhaseConstructionCostCT ? val.finalPhaseConstructionCostCT : '');
            this.form.get(['homeLoanConstructionFormArray', i, 'freetext6']).patchValue(
                val.finalPhaseConstructionCostCT ? val.finalPhaseConstructionCostCT : '');
            this.form.get(['homeLoanConstructionFormArray', i, 'freetext8']).patchValue(
                val.finalInstallmentAmountInFigureCT ? val.finalInstallmentAmountInFigureCT : '');
            this.form.get(['homeLoanConstructionFormArray', i, 'freetext9']).patchValue(
                val.finalInstallmentAmountInWordsCT ? val.finalInstallmentAmountInWordsCT : '');
          });
        }
        if (this.takeOverArray.length > 0) {
          this.takeOverArray.forEach((val, i) => {
            this.form.get(['homeLoanTakeOverFormArray', i, 'loanAmt']).patchValue(val.loanAmountInFigureCT ? val.loanAmountInFigureCT : '');
            this.form.get(['homeLoanTakeOverFormArray', i, 'loanAmtWords']).patchValue(val.loanAmountInWordsCT ? val.loanAmountInWordsCT : '');
            this.form.get(['homeLoanTakeOverFormArray', i, 'nameOfBank']).patchValue(val.nameOfBankCT ? val.nameOfBankCT : '');
          });
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.autoLoanCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray)) {
        this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray.forEach((val, i) => {
          this.form.get(['autoLoanFormArray', i, 'branchName']).patchValue(this.branchName ? this.branchName : '');
          this.form.get(['autoLoanFormArray', i, 'nameOfBeneficiary3']).patchValue(val.nameOfBeneficiaryCT ? val.nameOfBeneficiaryCT : '');
          this.form.get(['autoLoanFormArray', i, 'loanFig']).patchValue(val.loanAmountInFigureCT ? val.loanAmountInFigureCT : '');
          this.form.get(['autoLoanFormArray', i, 'loanWords']).patchValue(val.loanAmountInWordsCT ? val.loanAmountInWordsCT : '');
        });
      }

      if (!ObjectUtil.isEmpty(this.initialData.personalOverdraftCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray)) {
       this.initialData.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray.forEach((val, i) => {
         this.form.get(['personalOverdraftFormArray', i, 'branchName1']).patchValue(this.branchName ? this.branchName : '');
         this.form.get(['personalOverdraftFormArray', i, 'loanAmtInFig']).patchValue(val.loanAmountInFigureCT ? val.loanAmountInFigureCT : '');
         this.form.get(['personalOverdraftFormArray', i, 'loanAmtInWords']).patchValue(val.loanAmountInWordsCT ? val.loanAmountInWordsCT : '');
       });
      }

      if (!ObjectUtil.isEmpty(this.initialData.personalOverDraftWithoutCollateralCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray)) {
        this.initialData.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray.forEach((val, i) => {
          this.form.get(['personalOverdraftWithoutCollateralFormArray', i, 'branchName2']).patchValue(this.branchName ? this.branchName : '');
          this.form.get(['personalOverdraftWithoutCollateralFormArray', i, 'loanAmtFig']).patchValue(val.loanAmountInFigureCT ? val.loanAmountInFigureCT : '');
          this.form.get(['personalOverdraftWithoutCollateralFormArray', i, 'loanAmtWords1']).patchValue(val.loanAmountInWordsCT ? val.loanAmountInWordsCT : '');
        });
      }

      if (!ObjectUtil.isEmpty(this.initialData.nabilShareLoanPODForm) &&
          !ObjectUtil.isEmpty(this.initialData.nabilShareLoanPODForm.nabilShareLoanPODFormArray)) {
        this.initialData.nabilShareLoanPODForm.nabilShareLoanPODFormArray.forEach((val, i) => {
            this.form.get(['nabilShareLoanFormArray', i, 'branchName3']).patchValue(this.branchName ? this.branchName : '');
            this.form.get(['nabilShareLoanFormArray', i, 'loanAmtFig4']).patchValue(val.loanAmountInFigureCT ? val.loanAmountInFigureCT : '');
            this.form.get(['nabilShareLoanFormArray', i, 'loanAmtWords4']).patchValue(val.loanAmountInWordsCT ? val.loanAmountInWordsCT : '');
        });
      }

      if (!ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray)) {
        this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray.forEach((val, i) => {
          this.form.get(['shareLoanDemandFormArray', i, 'bName']).patchValue(this.branchName ? this.branchName : '');
          this.form.get(['shareLoanDemandFormArray', i, 'loanAmtDemand']).patchValue(val.loanAmountInFigureCT ? val.loanAmountInFigureCT : '');
          this.form.get(['shareLoanDemandFormArray', i, 'loanAmtFigDemand']).patchValue(val.loanAmountInWordsCT ? val.loanAmountInWordsCT : '');
          // this.form.get(['shareLoanDemandFormArray', i, 'freetext11']).patchValue(val.loanAmountInWordsCT ? val.loanAmountInWordsCT : '');
        });
      }
    }
  }
  setFormArrays() {
    if (!ObjectUtil.isEmpty(this.initialData)) {
      if (!ObjectUtil.isEmpty(this.initialData.mortgageCombineForm) &&
          !ObjectUtil.isEmpty(this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray)) {
        for (let a = 0; a < this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray.length; a++) {
          (this.form.get('mortgageLoanFormArray') as FormArray).push(this.setAllFormFields());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray)) {
        for (let a = 0; a < this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray.length; a++) {
          (this.form.get('personalLoanFormArray') as FormArray).push(this.setAllFormFields());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.homeLoanCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray)) {
        this.purchaseArray = this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray.filter(val =>
            val.homeLoanCase === 'PURCHASE' && val.firstTimeHomeBuyerCheck);
        for (let a = 0; a < this.purchaseArray.length; a++) {
          (this.form.get('homeLoanPurchaseFormArray') as FormArray).push(this.setAllFormFields());
        }
        this.constructionArray = this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray.filter(val =>
            val.homeLoanCase === 'CONSTRUCTION');
        if (this.constructionArray.length > 0) {
          for (let a = 0; a < this.constructionArray.length; a++) {
            (this.form.get('homeLoanConstructionFormArray') as FormArray).push(this.setAllFormFields());
            for (let b = 0; b < this.constructionArray[a].middlePhaseConstruction.length; b++) {
              (this.form.get(['homeLoanConstructionFormArray', a, 'middlePhaseConstruction']) as FormArray).push(
                  this.formBuilder.group({
                    freetext4: [undefined],
                    freetext5: [undefined],
                    freetext10: [undefined]
                  })
              );
            }
          }
        }
        this.takeOverArray = this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray.filter(val =>
            val.homeLoanCase === 'TAKEOVER');
        for (let a = 0; a < this.takeOverArray.length; a++) {
          (this.form.get('homeLoanTakeOverFormArray') as FormArray).push(this.setAllFormFields());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.autoLoanCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray)) {
        for (let a = 0; a < this.initialData.autoLoanCombinedForm.autoLoanCombinedFormArray.length; a++) {
          (this.form.get('autoLoanFormArray') as FormArray).push(this.setAllFormFields());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.personalOverdraftCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray)) {
        for (let a = 0; a < this.initialData.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray.length; a++) {
          (this.form.get('personalOverdraftFormArray') as FormArray).push(this.setAllFormFields());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.personalOverDraftWithoutCollateralCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray)) {
        for (let a = 0; a < this.initialData.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray.length; a++) {
          (this.form.get('personalOverdraftWithoutCollateralFormArray') as FormArray).push(this.setAllFormFields());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.nabilShareLoanPODForm) &&
          !ObjectUtil.isEmpty(this.initialData.nabilShareLoanPODForm.nabilShareLoanPODFormArray)) {
        for (let a = 0; a < this.initialData.nabilShareLoanPODForm.nabilShareLoanPODFormArray.length; a++) {
          (this.form.get('nabilShareLoanFormArray') as FormArray).push(this.setAllFormFields());
        }
      }

      if (!ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray)) {
        for (let a = 0; a < this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray.length; a++) {
          (this.form.get('shareLoanDemandFormArray') as FormArray).push(this.setAllFormFields());
        }
      }
    }
  }

  setAllFormFields() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      nameOfBeneficiary: [undefined],
      nameOfBeneficiary1: [undefined],
      branchName: [undefined],
      loanAmt: [undefined],
      nameOfFig: [undefined],
      loanAmtWords: [undefined],
      nameOfBank: [undefined],
      nameOfBank1: [undefined],
      nameOfBeneficiary2: [undefined],
      nameOfBeneficiary3: [undefined],
      loanFig: [undefined],
      loanWords: [undefined],
      branchName1: [undefined],
      loanAmtInWords: [undefined],
      loanAmtInFig: [undefined],
      branchName2: [undefined],
      loanAmtFig: [undefined],
      loanAmtWords1: [undefined],
      amtNum: [undefined],
      loanAmtInWords1: [undefined],
      loanAmtFig1: [undefined],
      loanAmtWords3: [undefined],
      loanAmtFigure1: [undefined],
      nameOfBeneficiary4: [undefined],
      branchName3: [undefined],
      loanAmtWords4: [undefined],
      loanAmtFig4: [undefined],
      bName: [undefined],
      loanAmtDemand: [undefined],
      loanAmtFigDemand: [undefined],
      middlePhaseConstruction: this.formBuilder.array([]),

      freetext1: [undefined],
      freetext2: [undefined],
      freetext3: [undefined],
      freetext6: [undefined],
      freetext7: [undefined],
      freetext8: [undefined],
      freetext9: [undefined],
      freetext11: [undefined],
      mortgageClause: [false],
    });
  }
  setTextAreaValue() {
    this.freeTextVal = {
      loanDemandFreeText: this.shareLoanFreeText(),
      mortgageClauseFreeText: this.mortgageClauseFreeText(),
      // personalLoanFreeText: this.personalLoanFreeText(),
    };
    return this.freeTextVal;
  }
  shareLoanFreeText() {
    if (!ObjectUtil.isEmpty(this.initialData) &&
        !ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm) &&
        !ObjectUtil.isEmpty(this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray)) {
      for (let val = 0; val < this.initialData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray.length; val++) {
        const tempFreeText = {
          freetext11: this.form.get(['shareLoanDemandFormArray', val, 'freetext11']).value ?
              this.form.get(['shareLoanDemandFormArray', val, 'freetext11']).value : '',
        };
        this.shareLoanFreeTextArray.push(tempFreeText);
      }
      return this.shareLoanFreeTextArray;
    }
  }

  mortgageClauseFreeText() {
    if (!ObjectUtil.isEmpty(this.initialData) &&
        !ObjectUtil.isEmpty(this.initialData.mortgageCombineForm) &&
        !ObjectUtil.isEmpty(this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray)) {
      for (let val = 0; val < this.initialData.mortgageCombineForm.mortgageCombineLoanFormArray.length; val++) {
        const tempFreeText = {
          mortgageClause: this.form.get(['mortgageLoanFormArray', val, 'mortgageClause']).value ?
              this.form.get(['mortgageLoanFormArray', val, 'mortgageClause']).value : '',
        };
        this.mortgageLoanFreeTextArray.push(tempFreeText);
      }
      return this.mortgageLoanFreeTextArray;
    }
  }
  // personalLoanFreeText() {
  //   if (!ObjectUtil.isEmpty(this.initialData) &&
  //       !ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm) &&
  //       !ObjectUtil.isEmpty(this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray)) {
  //     for (let val = 0; val < this.initialData.personalLoanCombinedForm.personalLoanCombinedFormArray.length; val++) {
  //       const tempFreeText = {
  //         amtNum: this.form.get(['personalLoanFormArray', val, 'amtNum']).value ?
  //             this.form.get(['personalLoanFormArray', val, 'amtNum']).value : '',
  //       };
  //       this.personalLoanFreeTextArray.push(tempFreeText);
  //     }
  //     return this.personalLoanFreeTextArray;
  //   }
  // }

}
