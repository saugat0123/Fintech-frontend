import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CalendarType} from '../../../../../../@core/model/calendar-type';
import {InsuranceList} from '../../../../../loan/model/insuranceList';
import {FormUtils} from '../../../../../../@core/utils/form.utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../../@core/utils';

@Component({
  selector: 'app-insurance-policy-security',
  templateUrl: './insurance-policy-security.component.html',
  styleUrls: ['./insurance-policy-security.component.scss']
})
export class InsurancePolicySecurityComponent implements OnInit {
  @Input() calendarType: CalendarType;
  insurancePolicyForm: FormGroup;
  insuranceCompanyList = InsuranceList.insuranceCompanyList;
  constructor(private toastService: ToastService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.insurancePolicyForm = this.formBuilder.group({
      insurancePolicy: this.formBuilder.array([this.insurancePolicyFormGroup()])
    });
  }

  private insurancePolicyFormGroup(): FormGroup {
    return this.formBuilder.group({
          insuredAmount: [undefined, Validators.required],
          insuranceCompanyName: [undefined],
          policyStartDate: [undefined],
          maturityDate: [undefined],
          insurancePolicyType: [undefined],
          surrenderValue: [undefined],
          earlySurrenderDate: [undefined],
          consideredValue: [undefined],
          cashBackAmount: [undefined],
        }
    );
  }

  public removeInsuranceForm(index: number): void {
    (<FormArray>this.insurancePolicyForm.get('insurancePolicy')).removeAt(index);
  }

  public addInsurancePolicyForm(): void {
    const controls = this.insurancePolicyForm.get('insurancePolicy') as FormArray;
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fill All fields To Add More'));
      return;
    }
    (this.insurancePolicyForm.get('insurancePolicy') as FormArray).push(this.insurancePolicyFormGroup());
  }
}
