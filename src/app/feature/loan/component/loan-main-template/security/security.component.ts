import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';


@Component({
    selector: 'app-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
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
