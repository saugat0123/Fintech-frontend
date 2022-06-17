import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {FormUtils} from '../../../../@core/utils/form.utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';
import {InsuranceList} from '../../../loan/model/insuranceList';
import {Security} from '../../../loan/model/security';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

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
    @Input() security: Security;
    @Input() isEdit = false;


    constructor(private formBuilder: FormBuilder,
              private toastService: ToastService) { }

    ngOnInit() {
        this.configEditor();
        this.buildForm();
        if (this.isEdit) {
            this.setInsurancePolicy();
        } else {
            this.addInsurancePolicy();
        }
    }

    private setInsurancePolicy() {
        const formData = JSON.parse(this.security.data);
        const insurancePolicyData = this.insurancePolicyForm.get('insurancePolicy') as FormArray;
        insurancePolicyData.push(
            this.formBuilder.group({
                insuredAmount: [formData.insuredAmount],
                insuranceCompanyName: [formData.insuranceCompanyName],
                policyStartDate: [formData.policyStartDate ? new Date(formData.policyStartDate) : ''],
                maturityDate: [formData.maturityDate ? new Date(formData.maturityDate) : ''],
                considerValue: [formData.considerValue],
                fairMarketValue: [formData.fairMarketValue],
                distressValue: [formData.distressValue],
                insurancePolicyType: [formData.insurancePolicyType],
                surrenderValue: [formData.surrenderValue],
                earlySurrenderDate: [formData.earlySurrenderDate ? new Date(formData.earlySurrenderDate) : ''],
                consideredValue: [formData.considerValue],
                cashBackAmount: [formData.cashBackAmount],
                insurancePolicyFirstValuationDate: [formData.insurancePolicyFirstValuationDate ? new Date(formData.insurancePolicyFirstValuationDate) : ''],
            })
        );
    }

    private buildForm(): FormGroup {
        return this.insurancePolicyForm = this.formBuilder.group({
            insurancePolicy: this.formBuilder.array([])
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
    if (controls.invalid) {
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
                insurancePolicyFirstValuationDate: [undefined]
            }
        );
    }
}
