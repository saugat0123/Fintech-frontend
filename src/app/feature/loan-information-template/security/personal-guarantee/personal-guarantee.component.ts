import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';

@Component({
    selector: 'app-personal-guarantee',
    templateUrl: './personal-guarantee.component.html',
    styleUrls: ['./personal-guarantee.component.scss']
})
export class PersonalGuaranteeComponent implements OnInit {
    personalGuaranteeForm: FormGroup;
    submitted = false;
    ckeConfig;


    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildForm();
    }

    private buildForm(): FormGroup {
        return this.personalGuaranteeForm = this.formBuilder.group({
            personalGuarantee: this.formBuilder.array([this.personalDetailsFormGroup()])
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
