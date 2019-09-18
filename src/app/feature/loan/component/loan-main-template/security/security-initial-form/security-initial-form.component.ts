import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {isBoolean} from 'util';

@Component({
    selector: 'app-security-initial-form',
    templateUrl: './security-initial-form.component.html',
    styleUrls: ['./security-initial-form.component.scss']
})
export class SecurityInitialFormComponent implements OnInit {
  @Input() title: string;
  @Output() toCheckedCombined = new EventEmitter();
    marked = false;
    securityForm: FormGroup;
    landSelected = false;
    apartmentSelected = false;
    buildingSelected = false;
    plantSelected = false;
    underConstructionChecked = false;
    checkboxSelected = true;

    constructor(private formBuilder: FormBuilder) {
    }
     check(status) {
      if (status) {
        this.toCheckedCombined.next(true);
      } else {
        this.toCheckedCombined.next(false);
      }
     }
    ngOnInit() {
      if (this.title === 'Combined') {
        this.checkboxSelected = false;
      }
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
