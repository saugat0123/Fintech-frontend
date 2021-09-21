import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {LoanType} from '../../../../loan/model/loanType';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../../../@core/utils';
import {CadOneformService} from '../../../service/cad-oneform.service';

@Component({
  selector: 'app-loan-create',
  templateUrl: './loan-create.component.html',
  styleUrls: ['./loan-create.component.scss']
})
export class LoanCreateComponent implements OnInit {
  // @Input() form;
  @Input() data;
  @Input() customerType;
  submitted = false;
  translatedValues: any;
  form: FormGroup;
  loanFacilityList: Array<LoanConfig> = new Array<LoanConfig>();
  loanTypeList = LoanType;

  constructor(
      private formBuilder: FormBuilder,
      private translateService: SbTranslateService,
      private loanConfigService: LoanConfigService,
      private toastService: ToastService,
      private cadOneFormService: CadOneformService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.loadData();
    this.addEmptyLoan();
  }

  loadData() {
    this.loanConfigService.getAllByLoanCategory(this.customerType).subscribe((response: any) => {
      console.log(response);
      this.loanFacilityList = response.detail;
      console.log(response.detail);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      loanDetails: this.formBuilder.array([])
    });
  }

  setLoan(data) {
    if (data.length === 0) {
      this.addEmptyLoan();
      return;
    }
    data.forEach(d => {
      (this.form.get('loanDetails') as FormArray).push(
          this.formBuilder.group({
            loan: [d.loan],
            proposedAmount: [d.proposedAmount],
            status: [d.status],
            approvedOn: [d.approvedOn],
            comments: [d.comments],
          })
      );
    });
  }

  addEmptyLoan() {
    (this.form.get('loanDetails') as FormArray).push(
        this.formBuilder.group({
          loanHolderId: this.data.customerInfoId,
          loanType: [undefined],
          loan: [undefined],
          proposedAmount: [undefined],
          status: [undefined],
          approvedOn: [undefined],
          comments: [undefined],
        })
    );
  }

  removeLoan(i) {
    (this.form.get('loanDetails') as FormArray).removeAt(i);
  }

  translate() {

  }

  save() {
    console.log(this.form.get('loanDetails').value[0]);
    const finalObj = {
      ...this.data,
      ...this.form.get('loanDetails').value[0]
    };
    console.log(finalObj);
    this.cadOneFormService.saveLoan(finalObj).subscribe(res => {
      console.log(res);
    });
    // Long customerInfoId;
    // Long loanHolderId;
    // Long companyInfoId;
    // Long branchId;
    // Long loan;
    // String loanCategory;
    // String proposedAmount;
    // String comments;
    // Long guarantorDetailId;
  }
}
