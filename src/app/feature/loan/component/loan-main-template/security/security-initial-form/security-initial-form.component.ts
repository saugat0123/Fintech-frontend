import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-security-initial-form',
    templateUrl: './security-initial-form.component.html',
    styleUrls: ['./security-initial-form.component.scss']
})
export class SecurityInitialFormComponent implements OnInit {
    @Input() data: string;
    marked = false;
    securityForm: FormGroup;
    landSelected = false;
    apartmentSelected = false;
    buildingSelected = false;
    plantSelected = false;
    underConstructionChecked = false;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.securityForm = this.formBuilder.group({
            valuatorDetails: this.formBuilder.group({
                valuator: [''],
                valuatedDate: [''],
                valuatorRepresentativeName: [''],
                staffRepresentativeName: [''],
                chooseAny: [null]
            }),
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

    change(arraySelected) {
        arraySelected.forEach(selectedValue => {
            switch (selectedValue) {
                case 'LandSecurity' :
                    this.landSelected = true;
                    break;
                case 'ApartmentSecurity' :
                    this.apartmentSelected = true;
                    break;
                case 'Land and Building Security' :
                    this.apartmentSelected = this.landSelected = true;
                    break;
                case 'PlantSecurity' :
                    this.plantSelected = true;
            }
        });
        // console.log(arraySelected);
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

    underConstruction(event) {

        if (event.target.checked) {
            this.underConstructionChecked = true;
        } else {
            this.underConstructionChecked = false;
        }
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

    onSubmit() {

    }
}
