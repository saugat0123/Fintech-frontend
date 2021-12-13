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
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
    }
    this.fillForm();
    this.getLoanName();
    this.checkLoanName();
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

}
