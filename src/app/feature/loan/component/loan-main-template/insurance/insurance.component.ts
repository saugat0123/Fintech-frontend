import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Insurance} from '../../../../admin/modal/insurance';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-insurance',
    templateUrl: './insurance.component.html',
    styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {
    @Input() insuranceDataFromModel: Insurance;

    form: FormGroup;
    isSubmitted = false;
    insurance: Insurance = new Insurance();

    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    get insuranceControls() {
        return this.form.controls;
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.insuranceDataFromModel)) {
            this.insurance = this.insuranceDataFromModel;
        }
        this.buildForm();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            insuranceCompany: [this.insurance.company === undefined ? undefined : this.insurance.company],
            insuredAmount: [this.insurance.insuredAmount === undefined ? undefined : this.insurance.insuredAmount],
            premiumAmount: [this.insurance.premiumAmount === undefined ? undefined : this.insurance.premiumAmount],
            issuedDate: [this.insurance.issuedDate === undefined ? undefined : this.insurance.issuedDate],
            expiryDate: [this.insurance.expiryDate === undefined ? undefined : this.insurance.expiryDate],
            insurancePolicyType: [this.insurance.policyType === undefined ? undefined : this.insurance.policyType],
        });
    }

    submit() {
        this.insurance.company = this.form.get('insuranceCompany').value;
        this.insurance.insuredAmount = this.form.get('insuredAmount').value;
        this.insurance.premiumAmount = this.form.get('premiumAmount').value;
        this.insurance.issuedDate = this.form.get('issuedDate').value;
        this.insurance.expiryDate = this.form.get('expiryDate').value;
        this.insurance.policyType = this.form.get('insurancePolicyType').value;
    }
}
