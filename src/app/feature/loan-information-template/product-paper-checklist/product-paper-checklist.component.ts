import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {LoanConfig} from '../../admin/modal/loan-config';

@Component({
  selector: 'app-product-paper-checklist',
  templateUrl: './product-paper-checklist.component.html',
  styleUrls: ['./product-paper-checklist.component.scss']
})
export class ProductPaperChecklistComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) {
  }

  @Input() loan: LoanConfig;
  @Input() fromLoan;
  @Input() loanDataHolder: LoanDataHolder;
  @Output() checkList = new EventEmitter();
  paperForm: FormGroup;
  yesNo = ['Yes', 'No', 'Na'];
  formData;

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder.paperProductChecklist)) {
      this.formData = JSON.parse(this.loanDataHolder.paperProductChecklist);
    }
    if (this.fromLoan) {
      this.buildForm();
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
      aggregate: [undefined],
    });
  }

  save() {
    this.checkList.emit(this.paperForm.value);
  }

  yesToAll() {
    this.paperForm.patchValue({
      ciclDate: 'Yes',
      internal: 'Yes',
      negative: 'Yes',
      reference: 'Yes',
      statements: 'Yes',
      lalPurja: 'Yes',
      bluePrint: 'Yes',
      boundary: 'Yes',
      bcc: 'Yes',
      bca: 'Yes',
      fac: 'Yes',
      salaryCertificate: 'Yes',
      pension: 'Yes',
      rental: 'Yes',
      professional: 'Yes',
      businessIncome: 'Yes',
      agricultureIncome: 'Yes',
      loanAmount: 'Yes',
      creditChain: 'Yes',
      loanTenure: 'Yes',
      loanAmountMax: 'Yes',
      ltv: 'Yes',
      groupExposure: 'Yes',
      ageOfBorrower: 'Yes',
      ageOfCoBorrower: 'Yes',
      dbr: 'Yes',
      interestRate: 'Yes',
      loanFee: 'Yes',
      commitmentFee: 'Yes',
      swapFee: 'Yes',
      aggregate: 'Yes',
    });
  }

  noToAll() {
    this.paperForm.patchValue({
      ciclDate: 'No',
      internal: 'No',
      negative: 'No',
      reference: 'No',
      statements: 'No',
      lalPurja: 'No',
      bluePrint: 'No',
      boundary: 'No',
      bcc: 'No',
      bca: 'No',
      fac: 'No',
      salaryCertificate: 'No',
      pension: 'No',
      rental: 'No',
      professional: 'No',
      businessIncome: 'No',
      agricultureIncome: 'No',
      loanAmount: 'No',
      creditChain: 'No',
      loanTenure: 'No',
      loanAmountMax: 'No',
      ltv: 'No',
      groupExposure: 'No',
      ageOfBorrower: 'No',
      ageOfCoBorrower: 'No',
      dbr: 'No',
      interestRate: 'No',
      loanFee: 'No',
      commitmentFee: 'No',
      swapFee: 'No',
      aggregate: 'No',
    });
  }
  naToAll() {
    this.paperForm.patchValue({
      ciclDate: 'Na',
      internal: 'Na',
      negative: 'Na',
      reference: 'Na',
      statements: 'Na',
      lalPurja: 'Na',
      bluePrint: 'Na',
      boundary: 'Na',
      bcc: 'Na',
      bca: 'Na',
      fac: 'Na',
      salaryCertificate: 'Na',
      pension: 'Na',
      rental: 'Na',
      professional: 'Na',
      businessIncome: 'Na',
      agricultureIncome: 'Na',
      loanAmount: 'Na',
      creditChain: 'Na',
      loanTenure: 'Na',
      loanAmountMax: 'Na',
      ltv: 'Na',
      groupExposure: 'Na',
      ageOfBorrower: 'Na',
      ageOfCoBorrower: 'Na',
      dbr: 'Na',
      interestRate: 'Na',
      loanFee: 'Na',
      commitmentFee: 'Na',
      swapFee: 'Na',
      aggregate: 'Na',
    });
  }
}

