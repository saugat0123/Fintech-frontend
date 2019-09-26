import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {SecurityInitialFormComponent} from './security-initial-form/security-initial-form.component';


@Component({
    selector: 'app-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
    @Input () securityValue;
    @ViewChild ('initialSecurity', { static: false })
    initialSecurity: SecurityInitialFormComponent;
    securityData = {};
    guarantorsForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.guarantorsForm = this.formBuilder.group({
            guarantorsDetails: this.formBuilder.array([
                this.guarantorsDetailsFormGroup()
            ])
        });
    }

    onSubmit() {
        const mergedForm = {
            initialForm: this.initialSecurity.securityForm.value,
            guarantorsForm: this.guarantorsForm.value
        };
        this.securityData = {data: mergedForm};
        console.log(this.securityData);
    }

    guarantorsDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            name: [''],
            address: [''],
            citizenNumber: [''],
            issuedYear: [''],
            issuedPlace: [''],
            contactNumber: [''],
            fatherName: [''],
            grandFatherName: [''],
            relationship: ['']
        });
    }

    addguarantorsDetails() {

        (this.guarantorsForm.get('guarantorsDetails') as FormArray).push(this.guarantorsDetailsFormGroup());
    }

    removeguarantorsDetails(index: number) {
        (this.guarantorsForm.get('guarantorsDetails') as FormArray).removeAt(index);
    }
}
