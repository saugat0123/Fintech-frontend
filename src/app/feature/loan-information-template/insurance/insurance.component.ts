import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Insurance} from '../../admin/modal/insurance';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-insurance',
    templateUrl: './insurance.component.html',
    styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {
    @Input() insuranceDataFromModel: Insurance;
    @Input() fromProfile;
    @Output() insuranceDataEmitter = new EventEmitter();
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
            id: [ObjectUtil.setUndefinedIfNull(this.insurance.id)],
            version: [ObjectUtil.setUndefinedIfNull(this.insurance.version)],
            company: [ObjectUtil.setUndefinedIfNull(this.insurance.company)],
            insuredAmount: [ObjectUtil.setUndefinedIfNull(this.insurance.insuredAmount)],
            premiumAmount: [ObjectUtil.setUndefinedIfNull(this.insurance.premiumAmount)],
            issuedDate: [this.insurance.issuedDate === undefined ? undefined : new Date(this.insurance.issuedDate)],
            expiryDate: [this.insurance.expiryDate === undefined ? undefined : new Date(this.insurance.expiryDate)],
            policyType: [ObjectUtil.setUndefinedIfNull(this.insurance.policyType)],
            policyNumber: [ObjectUtil.setUndefinedIfNull(this.insurance.policyNumber)]
        });
    }

    submit() {
        this.insurance = this.form.value as Insurance;
        this.insurance.issuedDate = new Date(this.form.get('issuedDate').value);
        this.insurance.expiryDate = new Date(this.form.get('expiryDate').value);
        this.insuranceDataEmitter.emit(this.insurance);
    }

    returnIssuedDate() {
        return (new Date(this.form.get('issuedDate').value));
    }
}
