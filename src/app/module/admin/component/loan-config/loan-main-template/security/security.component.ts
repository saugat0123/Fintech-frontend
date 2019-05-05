import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';


@Component({
    selector: 'app-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
    marked = false;
    security: FormGroup;
    landSelected = false;
    apartmentSelected = false;
    buildingSelected = false;
    underConstructionChecked = false;

    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.security = this.formBuilder.group({
            valuatorDetails: this.formBuilder.array([
                this.valuatorDetailsFormGroup()
            ]),
            guarantorsDetails: this.formBuilder.array([
                this.guarantorsDetailsFormGroup()
            ]),
            landDetails: this.formBuilder.array([
                this.landDetailsFormGroup()
            ]),
            buildingDetails: this.formBuilder.array([
                this.buildingDetailsFormGroup()
            ]),
            buildingDetailsBeforeCompletion: this.formBuilder.array([
                this.buildingDetailsFormGroup()
            ]),
            buildingDetailsAfterCompletion: this.formBuilder.array([
                this.buildingDetailsFormGroup()
            ])
        });
    }


    onChange(event) {
        let selected = event.target.value;
        if (selected === 'Land Security') {
            this.showLand();
        } else if (selected === 'Apartment Security') {
            this.showApartment();
        } else {
            this.showBoth();
        }
    }

    showLand() {
        this.landSelected = true;
        this.apartmentSelected = false;
    }

    showApartment() {
        this.apartmentSelected = true;
        this.landSelected = false;
    }

    showBoth() {
        this.landSelected = true;
        this.apartmentSelected = true;
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

    valuatorDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            valuator: [''],
            valuatedDate: [''],
            valuatorRepresentativeName: [''],
            staffRepresentativeName: [''],
            chooseAny: [null],
        });
    }

    landDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            owner: [''],
            location: [''],
            plotNumber: [''],
            areaFormat: [''],
            area: [''],
            marketValue: [''],
            distressValue: [''],
            description: [''],
        });
    }

    buildingDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            buildingName: [''],
            buildingDescription: [''],
            buildArea: [''],
            buildRate: [''],
            totalCost: [''],
            floorName: [''],
            valuationArea: [''],
            ratePerSquareFeet: [''],
            estimatedCost: [''],
            waterSupply: [''],
            sanitation: [''],
            electrification: [''],
            buildingTotalCost: [''],
            buildingFairMarketValue: [''],
            buildingDistressValue: [''],

        });
    }

    checkboxSelected(event) {
        this.marked = event.target.checked;
        if (this.marked) {
            this.addValuatorDetails();
        } else {
            this.removeValuatorDetails(0);
        }

    }

    underConstruction(event) {

        if (event.target.checked) {
            this.underConstructionChecked = true;
        } else {
            this.underConstructionChecked = false;
        }
    }

    addValuatorDetails() {

        (<FormArray>this.security.get('valuatorDetails')).push(this.valuatorDetailsFormGroup());
    }

    removeValuatorDetails(index: number) {
        (<FormArray>this.security.get('valuatorDetails')).removeAt(index);
    }

    addguarantorsDetails() {

        (<FormArray>this.security.get('guarantorsDetails')).push(this.guarantorsDetailsFormGroup());
    }

    removeguarantorsDetails(index: number) {
        (<FormArray>this.security.get('guarantorsDetails')).removeAt(index);
    }

    addMoreLand() {
        (<FormArray>this.security.get('landDetails')).push(this.landDetailsFormGroup());
    }

    removeLandDetails(index: number) {
        (<FormArray>this.security.get('landDetails')).removeAt(index);
    }

    addBuilding() {
        if (this.buildingSelected === false) {
            this.buildingSelected = true;
        } else {
            (<FormArray>this.security.get('buildingDetails')).push(this.buildingDetailsFormGroup());
        }
    }

    removeBuildingDetails(index: number) {
        (<FormArray>this.security.get('buildingDetails')).removeAt(index);
    }
}
