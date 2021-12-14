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
    }
    this.fillForm();
    this.getLoanName();
    this.checkLoanName();
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
    const tempD = this.tempData;
    if (!ObjectUtil.isEmpty(tempD)) {
      this.isOneOffFacility = this.checkOneOffFacility(tempD);
    }
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
          this.isTermLoanForVehicle = this.tempData.termLoanForm.termLoanFor;
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

  checkOneOffFacility(tempD) {
    if ((!ObjectUtil.isEmpty(tempD.letterOfCreditForm) && tempD.letterOfCreditForm.loanOption === 'ONE_OFF_BASIS') ||
        (!ObjectUtil.isEmpty(tempD.timeLetterCreditForm) && tempD.timeLetterCreditForm.loanOption === 'ONE_OFF_BASIS') ||
        (!ObjectUtil.isEmpty(tempD.importLoanTrust) && tempD.importLoanTrust.loanOption === 'ONE_OFF_BASIS') ||
        (!ObjectUtil.isEmpty(tempD.revolvingShortTermLoan) && tempD.revolvingShortTermLoan.loanOption === 'ONE_OFF_BASIS')) {
      return true;
    } else {
      return false;
    }
  }
  isApplicable() {
    const temp = this.tempData;
    if ((!ObjectUtil.isEmpty(temp.letterOfCreditForm) && temp.letterOfCreditForm.loanOption !== 'ONE_OFF_BASIS'
        || !ObjectUtil.isEmpty(temp.timeLetterCreditForm) && temp.timeLetterCreditForm !== 'ONE_OFF_BASIS'
        || !ObjectUtil.isEmpty(temp.importBillsDiscountForm) && temp.importBillsDiscountForm !== 'ONE_OFF_BASIS'
        || !ObjectUtil.isEmpty(temp.importLoanTrust) && temp.importLoanTrust !== 'ONE_OFF_BASIS'
        || !ObjectUtil.isEmpty(temp.revolvingShortTermLoan) && temp.revolvingShortTermLoan !== 'ONE_OFF_BASIS'
        || !ObjectUtil.isEmpty(temp.demandLoanForm) && temp.demandLoanForm
        || !ObjectUtil.isEmpty(temp.preExportForm) && temp.preExportForm
        || !ObjectUtil.isEmpty(temp.documentaryBillPurchase) && temp.documentaryBillPurchase
        || !ObjectUtil.isEmpty(temp.overdraftLoanForm) && temp.overdraftLoanForm
        || !ObjectUtil.isEmpty(temp.equityMortgaged) && temp.equityMortgaged
        || !ObjectUtil.isEmpty(temp.overdraftFixedForm) && temp.overdraftFixedForm
        || !ObjectUtil.isEmpty(temp.overDraftFacilityForm) && temp.overDraftFacilityForm
        || !ObjectUtil.isEmpty(temp.bridgeGapLoan) && temp.bridgeGapLoan
        || !ObjectUtil.isEmpty(temp.mortgageEquityTermForm) && temp.mortgageEquityTermForm
        || !ObjectUtil.isEmpty(temp.bankGuarantee) && temp.bankGuarantee
        || !ObjectUtil.isEmpty(temp.billPurchaseForm) && temp.billPurchaseForm)) {
      this.isExcept = true;
    }
  }

}
