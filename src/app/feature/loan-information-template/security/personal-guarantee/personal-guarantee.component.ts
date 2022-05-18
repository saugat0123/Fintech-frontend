import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';
import {Security} from '../../../loan/model/security';

@Component({
    selector: 'app-personal-guarantee',
    templateUrl: './personal-guarantee.component.html',
    styleUrls: ['./personal-guarantee.component.scss']
})
export class PersonalGuaranteeComponent implements OnInit {
    personalGuaranteeForm: FormGroup;
    submitted = false;
    ckeConfig;
    @Input() security: Security;
    @Input() isEdit = false;



    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildForm();
        if (this.isEdit) {
            this.setPersonalGuarantee();
        } else {
            this.addPersonalGuarantee();
        }
    }

    private setPersonalGuarantee() {
        const formData = JSON.parse(this.security.data);
        const personalGuaranteeData = this.personalGuaranteeForm.get('personalGuarantee') as FormArray;
        personalGuaranteeData.push(
            this.formBuilder.group({
                name: [formData.name],
                address: [formData.address],
                email: [formData.email],
                phoneNumber: [formData.phoneNumber],
                owner: [formData.owner],
                considerValue: [formData.considerValue],
                fairMarketValue: [formData.fairMarketValue],
                distressValue: [formData.distressValue],
                otherDetail: [formData.otherDetail]
            })
        );
    }

    private buildForm(): FormGroup {
        return this.personalGuaranteeForm = this.formBuilder.group({
            personalGuarantee: this.formBuilder.array([])
        });
    }

    configEditor() {
        this.ckeConfig = Editor.CK_CONFIG;
    }

    public addPersonalGuarantee(): void {
        (this.personalGuaranteeForm.get('personalGuarantee') as FormArray).push(this.personalDetailsFormGroup());
    }


    public removePersonal(index: number) {
        (<FormArray>this.personalGuaranteeForm.get('personalGuarantee')).removeAt(index);
    }

    private personalDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
                name: [undefined, Validators.required],
                address: [undefined],
                email: [undefined],
                phoneNumber: [undefined],
                owner: [undefined],
                considerValue: 0,
                fairMarketValue: [undefined],
                distressValue: [undefined],
                otherDetail: [undefined]
            }
        );
    }

}
