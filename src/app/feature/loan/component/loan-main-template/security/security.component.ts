import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';



@Component({
    selector: 'app-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
    marked = false;
    securityForm: FormGroup;
    guarantorsForm: FormGroup;
    landSelected = false;
    apartmentSelected = false;
    buildingSelected = false;
    plantSelected = false;
    underConstructionChecked = false;

    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.guarantorsForm = this.formBuilder.group({
            guarantorsDetails: this.formBuilder.array([
                this.guarantorsDetailsFormGroup()
            ]),
        });
        this.securityForm = this.formBuilder.group({
            valuatorDetails: this.formBuilder.array([
                this.valuatorDetailsFormGroup()
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
            ]),
            plantDetails: this.formBuilder.array([
                this.plantDetailsFormGroup()
            ])
        });
    }


    onChange(event) {
        const selected = event.target.value;
        if (selected === 'Land Security') {
            this.showLand();
        } else if (selected === 'Apartment Security') {
            this.showApartment();
        } else if (selected === 'Plant and Machinery Security') {
            this.showPlantandMachinery();
        } else {
            this.showBoth();
        }
    }

    showLand() {
        this.landSelected = true;
        this.apartmentSelected = false;
        this.plantSelected = false;
    }

    showApartment() {
        this.apartmentSelected = true;
        this.landSelected = false;
        this.plantSelected = false;
    }

    showBoth() {
        this.landSelected = true;
        this.apartmentSelected = true;
        this.plantSelected = false;
    }

    showPlantandMachinery() {
        this.apartmentSelected = false;
        this.landSelected = false;
        this.plantSelected = true;
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

    plantDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            model: [''],
            quotation: [''],
            supplier: [''],
            downPay: [''],
            loanExp: ['']
        });
    }

    checkboxSelected(event) {
        this.marked = event.target.checked;
        if ( this.marked) {
            this.addValuatorDetails();
        //     this.addMoreLand();
        // } else if (this.apartmentSelected && this.marked) {
        //     this.addValuatorDetails();
        //     this.addBuilding();
        // } else if (this.plantSelected && this.marked) {
        //     this.addValuatorDetails();
        //     this.addPlantandMachinery();
        // } else if (this.plantSelected && this.marked) {
        //     this.addValuatorDetails();
        //     this.addPlantandMachinery();
        // } else if (this.buildingSelected && this.marked) {
        //     this.addValuatorDetails();
        //     this.addMoreLand();
        //     this.addBuilding();
        } else {
            this.removeValuatorDetails(0);
            // this.removeLandDetails(0);
            // this.removeBuildingDetails(0);
            // this.removePlantDetails(0);
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

        (this.securityForm.get('valuatorDetails') as FormArray).push(this.valuatorDetailsFormGroup());
    }

    removeValuatorDetails(index: number) {
        (this.securityForm.get('valuatorDetails') as FormArray).removeAt(index);
    }

    addguarantorsDetails() {

        (this.guarantorsForm.get('guarantorsDetails') as FormArray).push(this.guarantorsDetailsFormGroup());
    }

    removeguarantorsDetails(index: number) {
        (this.guarantorsForm.get('guarantorsDetails') as FormArray).removeAt(index);
    }

    addMoreLand() {
        (this.securityForm.get('landDetails') as FormArray).push(this.landDetailsFormGroup());
    }

    removeLandDetails(index: number) {
        (<FormArray>this.securityForm.get('landDetails')).removeAt(index);
    }

    addBuilding() {
        if (this.buildingSelected === false) {
            this.buildingSelected = true;
        } else {
            (this.securityForm.get('buildingDetails') as FormArray).push(this.buildingDetailsFormGroup());
        }
    }

    removeBuildingDetails(index: number) {
        (this.securityForm.get('buildingDetails') as FormArray).removeAt(index);
    }

    removePlantDetails(index: number) {
        (this.securityForm.get('plantDetails') as FormArray).removeAt(index);
    }

    addPlantandMachinery() {
        (this.securityForm.get('plantDetails') as FormArray).push(this.plantDetailsFormGroup());
    }
}
