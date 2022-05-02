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
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData) &&
        !ObjectUtil.isEmpty(this.cadData.offerDocumentList) &&
        !ObjectUtil.isEmpty(this.cadData.offerDocumentList[0].initialInformation)) {
      this.initialData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
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
              console.log('construction', this.constructionArray[a]);
              (this.form.get(['homeLoanConstructionFormArray', b, 'middlePhaseConstruction']) as FormArray).push(
                  this.formBuilder.group({
                    freetext4: [undefined],
                    freetext5: [undefined],
                    freetext10: [undefined]
                  })
              );
          }
          }
          console.log('homeloanArray:', this.form.get('homeLoanConstructionFormArray').value);
          console.log('Construction Array:', this.constructionArray);
        }
      }
      this.takeOverArray = this.initialData.homeLoanCombinedForm.homeLoanCombinedFormArray.filter(val =>
          val.homeLoanCase === 'TAKEOVER');
      for (let a = 0; a < this.takeOverArray.length; a++) {
        (this.form.get('homeLoanTakeOverFormArray') as FormArray).push(this.setAllFormFields());
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
  setMiddleConstruction() {
    return this.formBuilder.group({
      freetext4: [undefined],
      freetext5: [undefined],
      freetext10: [undefined]
    });
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
    });
  }

}
