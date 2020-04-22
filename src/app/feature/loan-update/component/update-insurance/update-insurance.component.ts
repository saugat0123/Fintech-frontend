import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Insurance} from '../../../admin/modal/insurance';
import {InsuranceService} from '../../service/insurance.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

@Component({
  selector: 'app-update-insurance',
  templateUrl: './update-insurance.component.html',
  styleUrls: ['./update-insurance.component.scss']
})
export class UpdateInsuranceComponent implements OnInit {
  @Input() public insuranceDataFromModel: Insurance;
  @Input() public customerLoanId: number;
  @Input() public updateExisting: boolean;
  @Output() public updateEmitter = new EventEmitter<boolean>();
  public form: FormGroup;
  public isSubmitted = false;
  private insurance: Insurance = new Insurance();

  constructor(
      private formBuilder: FormBuilder,
      private insuranceService: InsuranceService,
      private toastService: ToastService
  ) { }

  get insuranceControls() {
    return this.form.controls;
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.insuranceDataFromModel)) {
      this.insurance = this.insuranceDataFromModel;
    }
    this.buildForm();
  }

  public submit(): void {
    this.insuranceService.updateInsurance(this.customerLoanId, this.form.value)
    .subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Updated successfully!!!'));
      this.updateEmitter.emit(true);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to updated!!!'));
    });
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      id: [this.updateExisting ? this.insurance.id : undefined],
      version: [ObjectUtil.setUndefinedIfNull(this.insurance.version)],
      company: [ObjectUtil.setUndefinedIfNull(this.insurance.company)],
      insuredAmount: [ObjectUtil.setUndefinedIfNull(this.insurance.insuredAmount)],
      premiumAmount: [ObjectUtil.setUndefinedIfNull(this.insurance.premiumAmount)],
      issuedDate: [this.insurance.issuedDate === undefined ? undefined : new Date(this.insurance.issuedDate)],
      expiryDate: [this.insurance.expiryDate === undefined ? undefined : new Date(this.insurance.expiryDate)],
      policyType: [ObjectUtil.setUndefinedIfNull(this.insurance.policyType)],
      remarks: [ObjectUtil.setUndefinedIfNull(this.insurance.remarks)]
    });
  }

  returnTodayDate(): Date {
    return new Date();
  }
}
