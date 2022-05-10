import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../../model/customerApprovedLoanCadDocumentation';
import {FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {LoanNameConstant} from '../../../../../../../cad-view/template-data/nabil-sme-template-data/sme-costant/loan-name-constant';

@Component({
  selector: 'app-section6-facilities-clause-print',
  templateUrl: './section6-facilities-clause-print.component.html',
  styleUrls: ['./section6-facilities-clause-print.component.scss']
})
export class Section6FacilitiesClausePrintComponent implements OnInit {
  @Input() customerApprovedDoc;
  @Input() freeText;
  @Input() letterData;
  form: FormGroup;
  tempData;
  tenureOfLoan;
  freeInformation: any;
  loanData = [];
  isCustomerAcceptance = false;
  isIrrevocableLetter = false;
  isAutoLoan = false;
  isBankGuarantee = false;
  autoLoanOrTermLoan = false;
  isTermLoanForVehicle;
  isTermOrAuto = false;
  isOneOffFacility = false;
  isOtherLoan: boolean;
  isNotOneOffForExceptForLetter: boolean;
  isNotOneOffForExceptForTime: boolean;
  isNotOneOffForExceptForImportBill: boolean;
  isNotOneOffForExceptForImportLoan: boolean;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.freeInformation = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].supportedInformation);
      this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
    }
    this.getLoanName();
    this.checkLoanName();
    this.isApplicable();
    this.checkOneOffFacility();
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
        } if (v === LoanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE && !ObjectUtil.isEmpty(this.tempData.termLoanForm)) {
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
    this.customerApprovedDoc.assignedLoan.forEach(val => {
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
          this.isNotOneOffForExceptForLetter = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.tempData.timeLetterCreditForm)) {
      this.tempData.timeLetterCreditForm.timeLetterCreditFormArray.forEach(val => {
        if (val.loanOption !== 'ONE_OFF_BASIS') {
          this.isNotOneOffForExceptForTime = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.tempData.importBillsDiscountForm)) {
      this.tempData.importBillsDiscountForm.importBillsDiscountFormArray.forEach(val => {
        if (val.loanOption !== 'ONE_OFF_BASIS') {
          this.isNotOneOffForExceptForImportBill = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.tempData.importLoanTrust)) {
      this.tempData.importLoanTrust.importLoanTrustFormArray.forEach(val => {
        if (val.loanOption !== 'ONE_OFF_BASIS') {
          this.isNotOneOffForExceptForImportLoan = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.tempData.demandLoanForm) && this.tempData.demandLoanForm
        || !ObjectUtil.isEmpty(this.tempData.preExportForm) && this.tempData.preExportForm
        || !ObjectUtil.isEmpty(this.tempData.documentaryBillPurchase) && this.tempData.documentaryBillPurchase
        || !ObjectUtil.isEmpty(this.tempData.overdraftLoanForm) && this.tempData.overdraftLoanForm
        || !ObjectUtil.isEmpty(this.tempData.overdraftFixedForm) && this.tempData.overdraftFixedForm
        || !ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm) && this.tempData.overDraftFacilityForm
        || !ObjectUtil.isEmpty(this.tempData.bridgeGapLoan) && this.tempData.bridgeGapLoan
        || !ObjectUtil.isEmpty(this.tempData.bankGuarantee) && this.tempData.bankGuarantee
        || !ObjectUtil.isEmpty(this.tempData.billPurchaseForm) && this.tempData.billPurchaseForm) {
      this.isOtherLoan = true;
    }
  }
}
