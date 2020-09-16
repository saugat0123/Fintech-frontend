import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Insurance} from '../../../../admin/modal/insurance';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {InsuranceList} from '../../../model/insuranceList';

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
    insuranceList: InsuranceList = new InsuranceList();
    insuranceCompanyList;

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
        this.insuranceCompanyList = this.insuranceList.insuranceCompanyList;
    }

    buildForm() {
        this.form = this.formBuilder.group({
            id: [ObjectUtil.setUndefinedIfNull(this.insurance.id)],
            version: [ObjectUtil.setUndefinedIfNull(this.insurance.version)],
            company: [ObjectUtil.setUndefinedIfNull(this.insurance.company)],
            insuredAmount: [ObjectUtil.setUndefinedIfNull(this.insurance.insuredAmount)],
            premiumAmount: [ObjectUtil.setUndefinedIfNull(this.insurance.premiumAmount)],
            issuedDate: [this.insurance.issuedDate === undefined ? undefined : new Date(this.insurance.issuedDate)],
            expiryDate: [this.insurance.expiryDate === undefined ? undefined : new Date(this.insurance.expiryDate)],
            policyType: [ObjectUtil.setUndefinedIfNull(this.insurance.policyType)],
        });
    }

    submit() {
        this.insurance = this.form.value as Insurance;
    }

    returnIssuedDate() {
        return (new Date(this.form.get('issuedDate').value));
    }
}
