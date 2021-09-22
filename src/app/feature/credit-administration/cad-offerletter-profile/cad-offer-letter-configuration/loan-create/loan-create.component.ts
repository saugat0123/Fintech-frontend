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
  spinner = false;
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
    this.addEmptyLoan();
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

  async translate() {
    this.spinner = true;
    this.translatedValues = await this.translateService.translateForm(this.form.get('loanDetails').value[0]);
    console.log(this.translatedValues);
    this.spinner = false;
  }

  save() {
    this.spinner = true;
    const finalObj = {
      ...this.data,
      ...this.form.get('loanDetails').value[0]
    };
    this.cadOneFormService.saveLoan(finalObj).subscribe(res => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Loan created successfully'));
      this.spinner = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Error while creating loan'));
      this.spinner = false;
    });
  }
}
