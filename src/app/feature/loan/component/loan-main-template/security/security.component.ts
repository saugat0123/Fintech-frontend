import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SecurityInitialFormComponent} from './security-initial-form/security-initial-form.component';
import {Security} from '../../../model/security';


@Component({
    selector: 'app-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
    @Input () securityValue: Security;
    @ViewChild ('initialSecurity', { static: false })
    initialSecurity: SecurityInitialFormComponent;
    securityData: Security = new Security();
    guarantorsForm: FormGroup;
    initialSecurityValue: Object;
    securityValueForEdit;
    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (this.securityValue !== undefined) {
            this.securityValueForEdit = JSON.parse(this.securityValue.data);

            this.initialSecurityValue = this.securityValueForEdit;
            this.setGuarantorsDetails(this.securityValueForEdit['guarantorsForm'].guarantorsDetails);

        } else {
            this.addguarantorsDetails();
            this.initialSecurityValue = undefined;
        }
    }
    buildForm() {
        this.guarantorsForm = this.formBuilder.group({
            guarantorsDetails: this.formBuilder.array([])// this.guarantorsDetailsFormGroup()
        });
    }
    setGuarantorsDetails(currentData) {
        const details = this.guarantorsForm.get('guarantorsDetails') as FormArray;
        currentData.forEach(singleData => {
            details.push(
                this.formBuilder.group({
                    name: [singleData.name],
                    address: [singleData.address],
                    citizenNumber: [singleData.citizenNumber],
                    issuedYear: [singleData.issuedYear],
                    issuedPlace: [singleData.issuedPlace],
                    contactNumber: [singleData.contactNumber],
                    fatherName: [singleData.fatherName],
                    grandFatherName: [singleData.grandFatherName],
                    relationship: [singleData.relationship]
                    })
            );
        });
    }

    addguarantorsDetails() {
        const addDetails = this.guarantorsForm.get('guarantorsDetails') as FormArray;
        addDetails.push(
            this.formBuilder.group({
                name: [undefined],
                address: [undefined],
                citizenNumber: [undefined],
                issuedYear: [undefined],
                issuedPlace: [undefined],
                contactNumber: [undefined],
                fatherName: [undefined],
                grandFatherName: [undefined],
                relationship: [undefined]
            })
        );
    }

    removeguarantorsDetails(index: number) {
        (this.guarantorsForm.get('guarantorsDetails') as FormArray).removeAt(index);
    }

    onSubmit() {
        const mergedForm = {
            initialForm: this.initialSecurity.securityForm.value,
            selectedArray: this.initialSecurity.selectedArray,
            underConstructionChecked: this.initialSecurity.underConstructionChecked,
            guarantorsForm: this.guarantorsForm.value
        };
        this.securityData.data = JSON.stringify(mergedForm);
    }
}
