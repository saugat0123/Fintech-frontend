import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {FormUtils} from '../../../../@core/utils/form.utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';
import {InsuranceList} from '../../../loan/model/insuranceList';

@Component({
  selector: 'app-insurance-policy',
  templateUrl: './insurance-policy.component.html',
  styleUrls: ['./insurance-policy.component.scss']
})
export class InsurancePolicyComponent implements OnInit {
  insurancePolicyForm: FormGroup;
  submitted = false;
  ckeConfig;
  insuranceCompanyList = InsuranceList.insuranceCompanyList;
  @Input() calendarType: CalendarType;

  constructor(private formBuilder: FormBuilder,
              private toastService: ToastService) { }

    ngOnInit() {
        this.configEditor();
        this.buildForm();
    }

  private buildForm(): FormGroup {
    return this.insurancePolicyForm = this.formBuilder.group({
      insurancePolicy: this.formBuilder.array([this.insurancePolicyFormGroup()])
    });
  }

  configEditor() {
    this.ckeConfig = Editor.CK_CONFIG;
  }

  public removeInsurance(index: number): void {
    (<FormArray>this.insurancePolicyForm.get('insurancePolicy')).removeAt(index);
  }

  public addInsurancePolicy(): void {
    const controls = this.insurancePolicyForm.get('insurancePolicy') as FormArray;
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fill All fields To Add More'));
      return;
    }
    (this.insurancePolicyForm.get('insurancePolicy') as FormArray).push(this.insurancePolicyFormGroup());
  }

    public insurancePolicyFormGroup(): FormGroup {
        return this.formBuilder.group({
                insuredAmount: [undefined, Validators.required],
                insuranceCompanyName: [undefined, Validators.required],
                policyStartDate: [undefined],
                maturityDate: [undefined],
                considerValue: [undefined],
                fairMarketValue: [undefined],
                distressValue: [undefined],
                insurancePolicyType: [undefined],
                surrenderValue: [undefined],
                earlySurrenderDate: [undefined],
                consideredValue: [undefined],
                cashBackAmount: [undefined],
            }
        );
    }
}
