import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-product-paper-checklist',
  templateUrl: './product-paper-checklist.component.html',
  styleUrls: ['./product-paper-checklist.component.scss']
})
export class ProductPaperChecklistComponent implements OnInit {

  constructor(
      private formBuilder: FormBuilder
  ) { }
  @Input() product;
  @Input() fromLoan;
  @Input() loanDataHolder: LoanDataHolder;
  paperForm: FormGroup;
  yesNo = ['Yes', 'No', 'Na'];
  formData;
  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.loanDataHolder.productPaper)) {
      this.formData = JSON.parse(this.loanDataHolder.productPaper);
      this.paperForm.patchValue(this.formData);
    }
  }
  buildForm() {
    this.paperForm = this.formBuilder.group({
      ciclDate: [undefined],
      internal: [undefined],
      negative: [undefined],
      reference: [undefined],
      statements: [undefined],
      lalPurja: [undefined],
      bluePrint: [undefined],
      boundary: [undefined],
      bcc: [undefined],
      bca: [undefined],
      fac: [undefined],
      salaryCertificate: [undefined],
      pension: [undefined],
      rental: [undefined],
      professional: [undefined],
      businessIncome: [undefined],
      agricultureIncome: [undefined],
      loanAmount: [undefined],
      creditChain: [undefined],
      loanTenure: [undefined],
      loanAmountMax: [undefined],
      ltv: [undefined],
      groupExposure: [undefined],
      ageOfBorrower: [undefined],
      ageOfCoBorrower: [undefined],
      dbr: [undefined],
      interestRate: [undefined],
      loanFee: [undefined],
      commitmentFee: [undefined],
      swapFee: [undefined],
    });
  }
}

