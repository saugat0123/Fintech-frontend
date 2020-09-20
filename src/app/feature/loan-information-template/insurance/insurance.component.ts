import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Insurance} from '../../admin/modal/insurance';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {InsuranceList} from '../../loan/model/insuranceList';

@Component({
    selector: 'app-insurance',
    templateUrl: './insurance.component.html',
    styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {
    @Input() insuranceDataFromModel;
    @Input() fromProfile;
    @Output() insuranceDataEmitter = new EventEmitter();
    form: FormGroup;
    isSubmitted = false;
    insurance: Array<Insurance> = new Array<Insurance>();
    insuranceList: InsuranceList = new InsuranceList();
    insuranceCompanyList = InsuranceList.insuranceCompanyList;

    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    get insuranceControls() {
        return this.form.controls;
    }

    ngOnInit() {
        this.buildForm();
        if (ObjectUtil.isEmpty(this.insuranceDataFromModel)) {
            this.addEmptyForm();
        } else {
            if (this.insuranceDataFromModel.length === 0) {
                this.addEmptyForm();
                return;
            }
            this.insuranceDataFromModel.forEach((value) => {
                const formArray = this.form.get('formArray') as FormArray;
                formArray.push(this.addFormData(value));
            });
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({formArray: this.formBuilder.array([])});
    }
    addFormData(data: Insurance) {
        return this.formBuilder.group({id: [ObjectUtil.setUndefinedIfNull(data.id)],
                version: [ObjectUtil.setUndefinedIfNull(data.version)],
                company: [ObjectUtil.setUndefinedIfNull(data.company)],
                insuredAmount: [ObjectUtil.setUndefinedIfNull(data.insuredAmount)],
                premiumAmount: [ObjectUtil.setUndefinedIfNull(data.premiumAmount)],
                issuedDate: [data.issuedDate === undefined ? undefined : new Date(data.issuedDate)],
                expiryDate: [data.expiryDate === undefined ? undefined : new Date(data.expiryDate)],
                policyType: [ObjectUtil.setUndefinedIfNull(data.policyType)],
                policyNumber: [ObjectUtil.setUndefinedIfNull(data.policyNumber)]});
    }
    addEmptyForm() {
        const formArray = this.form.get('formArray') as FormArray;
        formArray.push(this.addFormData(new Insurance()));
    }
    removeForm(index) {
        const formArray = this.form.get('formArray') as FormArray;
        formArray.removeAt(index);
    }


    submit() {
        const formArray = this.form.get('formArray') as FormArray;
        formArray['controls'].forEach((data => {
            const insurance: Insurance = data.value;
            this.insurance.push(insurance);
        }));
        this.insuranceDataEmitter.emit(this.insurance);

    }

    returnIssuedDate(path) {
        return (new Date(path.value));
    }
}
