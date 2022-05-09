import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {LoanNameConstant} from '../../../../../../cad-view/template-data/nabil-sme-template-data/sme-costant/loan-name-constant';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../model/customerApprovedLoanCadDocumentation';
import {LoanDataHolder} from '../../../../../../../loan/model/loanData';

@Component({
  selector: 'app-section6-facilities-clause',
  templateUrl: './section6-facilities-clause.component.html',
  styleUrls: ['./section6-facilities-clause.component.scss']
})
export class Section6FacilitiesClauseComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() freeText;
  form: FormGroup;
  tempData;
  tenureOfLoan;
  freeInformation: any;
  loanData = [];
  isCustomerAcceptance = false;
  isIrrevocableLetter = false;
  isAutoLoan = false;
  isTermLoan = false;
  isExcept = false;
  isBankGuarantee = false;
  autoLoanOrTermLoan = false;
  isTermLoanForVehicle;
  isTermOrAuto = false;
  isOneOffFacility = false;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      console.log('this.tempData', this.tempData);
    }
    this.fillForm();
    this.getLoanName();
    this.checkLoanName();
    this.checkOneOffFacility();
    this.isApplicable();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      tenureOfLoan: [undefined],
    });
  }
  fillForm() {
    this.form.patchValue({
      tenureOfLoan: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.section6 : ''
    });
  }
  private checkLoanName(): void {
    if (this.loanData.length > 0) {
      this.loanData.forEach(v => {
        if (v === LoanNameConstant.IRREVOCABLE_LETTER_OF_CREDIT_FACILITY) {
          this.isIrrevocableLetter = true;
        } if (v === LoanNameConstant.CUSTOMER_ACCEPTANCE_FOR_TIME_LETTER_OF_CREDIT) {
          this.isCustomerAcceptance = true;
        } if (v === LoanNameConstant.AUTO_LOAN || v === LoanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE) {
          this.isTermOrAuto = true;
        }
        if (v === LoanNameConstant.AUTO_LOAN) {
          this.isAutoLoan = true;
          
        } 
        if (v === LoanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE && !ObjectUtil.isEmpty(this.tempData.termLoanForm)) {
          for (let x of this.tempData.termLoanForm.termLoanDetails) {
            this.isTermLoanForVehicle = x.termLoanForCT;
          }
          
        } if (v === LoanNameConstant.BANK_GUARANTEE) {
          this.isBankGuarantee = true;
        }
      });
    }
  }
  getLoanName() {
    this.cadOfferLetterApprovedDoc.assignedLoan.forEach(val => {
      const loanName = val.loan.name;
      this.loanData.push(loanName);
    });
  }

  checkOneOffFacility() {
    if (!ObjectUtil.isEmpty(this.tempData.letterOfCreditForm)) {
      this.tempData.letterOfCreditForm.letterOfCreditFormArray.forEach(val => {
        if (val.loanOption === 'ONE_OFF_BASIS') {
          this.isOneOffFacility = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.tempData.timeLetterCreditForm)) {
      this.tempData.timeLetterCreditForm.timeLetterCreditFormArray.forEach(val => {
        if (val.loanOption === 'ONE_OFF_BASIS') {
          this.isOneOffFacility = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.tempData.importLoanTrust)) {
      this.tempData.importLoanTrust.importLoanTrustFormArray.forEach(val => {
        if (val.loanOption === 'ONE_OFF_BASIS') {
          this.isOneOffFacility = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.tempData.revolvingShortTermLoan)) {
      this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray.forEach(val => {
        if (val.loanOption === 'ONE_OFF_BASIS') {
          this.isOneOffFacility = true;
        }
      });
    }
  }
  isApplicable() {
    if (!ObjectUtil.isEmpty(this.tempData.letterOfCreditForm)) {
      this.tempData.letterOfCreditForm.letterOfCreditFormArray.forEach(val => {
        if (val.loanOption !== 'ONE_OFF_BASIS') {
          this.isExcept = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.tempData.timeLetterCreditForm)) {
      this.tempData.timeLetterCreditForm.timeLetterCreditFormArray.forEach(val => {
        if (val.loanOption !== 'ONE_OFF_BASIS') {
          this.isExcept = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.tempData.importBillsDiscountForm)) {
      this.tempData.importBillsDiscountForm.importBillsDiscountFormArray.forEach(val => {
        if (val.loanOption !== 'ONE_OFF_BASIS') {
          this.isExcept = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.tempData.importLoanTrust)) {
      this.tempData.importLoanTrust.importLoanTrustFormArray.forEach(val => {
        if (val.loanOption !== 'ONE_OFF_BASIS') {
          this.isExcept = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.tempData.revolvingShortTermLoan)) {
      this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray.forEach(val => {
        if (val.loanOption !== 'ONE_OFF_BASIS') {
          this.isExcept = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.tempData.demandLoanForm) && this.tempData.demandLoanForm) {
      this.isExcept = true;
    }
    if (!ObjectUtil.isEmpty(this.tempData.preExportForm) && this.tempData.preExportForm) {
      this.isExcept = true;
    }
    if (!ObjectUtil.isEmpty(this.tempData.documentaryBillPurchase) && this.tempData.documentaryBillPurchase) {
      this.isExcept = true;
    }
    if (!ObjectUtil.isEmpty(this.tempData.overdraftLoanForm) && this.tempData.overdraftLoanForm) {
      this.isExcept = true;
    }
    if (!ObjectUtil.isEmpty(this.tempData.equityMortgaged) && this.tempData.equityMortgaged) {
      this.isExcept = true;
    }
    if (!ObjectUtil.isEmpty(this.tempData.overdraftFixedForm) && this.tempData.overdraftFixedForm) {
      this.isExcept = true;
    }
    if (!ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm) && this.tempData.overDraftFacilityForm) {
      this.isExcept = true;
    }
    if (!ObjectUtil.isEmpty(this.tempData.bridgeGapLoan) && this.tempData.bridgeGapLoan) {
      this.isExcept = true;
    }
    if (!ObjectUtil.isEmpty(this.tempData.mortgageEquityTermForm) && this.tempData.mortgageEquityTermForm) {
      this.isExcept = true;
    }
    if (!ObjectUtil.isEmpty(this.tempData.bankGuarantee) && this.tempData.bankGuarantee) {
      this.isExcept = true;
    }
    if (!ObjectUtil.isEmpty(this.tempData.billPurchaseForm) && this.tempData.billPurchaseForm) {
      this.isExcept = true;
    }
  }

}
