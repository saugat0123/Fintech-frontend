import {Component , Input , OnInit} from '@angular/core';
import {FormArray , FormBuilder , FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../../@core/utils';
import {Alert , AlertType} from '../../../../../../@theme/model/Alert';
import {CalendarType} from '../../../../../../@core/model/calendar-type';

@Component({
    selector: 'app-security-initial-form' ,
    templateUrl: './security-initial-form.component.html' ,
    styleUrls: ['./security-initial-form.component.scss']
})
export class SecurityInitialFormComponent implements OnInit {
    @Input() formData: string;
    @Input() name;
    @Input() calendarType: CalendarType;
    selectedArray = [];
    securityForm: FormGroup;
    landSelected = false;
    apartmentSelected = false;
    plantSelected = false;
    underConstructionChecked = false;
    formDataForEdit: Object;
    valuatorList = [];
    englishDateSelected = true;
    vehicleSelected = false;
    submitted = false;

    constructor(private formBuilder: FormBuilder,
                private valuatorToast: ToastService ) {
    }

    ngOnInit() {
        this.buildForm();
        this.valuatorList = this.name;
        this.message();
        if (this.formData !== undefined) {
            this.formDataForEdit = this.formData['initialForm'];
            this.selectedArray = this.formData['selectedArray'];
            this.change(this.selectedArray);
            this.underConstruction(this.formData['underConstructionChecked']);
            this.setValuatorDetails(this.formDataForEdit['valuatorDetails']);
            this.setBuildingDescription(this.formDataForEdit['buildingDetailsDescription']);
            this.setLandDescription(this.formDataForEdit['description']);
            this.setLandDetails(this.formDataForEdit['landDetails']);
            this.setBuildingDetails(this.formDataForEdit['buildingDetails']);
            this.setBuildingUnderConstructions(this.formDataForEdit['buildingUnderConstructions']);
            this.setPlantDetails(this.formDataForEdit['plantDetails']);
            this.setVehicleDetails(this.formDataForEdit['vehicleDetails']);


        } else {
            this.addMoreLand();
            this.addBuilding();
            this.addPlantandMachinery();
            this.addBuildingUnderConstructions();
            this.addVehicleSecurity();
        }
    }

    buildForm() {
        this.securityForm = this.formBuilder.group({
            valuatorDetails: this.formBuilder.group({
                valuator: [undefined],
                valuatedDate: [undefined],
                valuatorRepresentativeName: [undefined] ,
                staffRepresentativeName: [undefined]
            }) ,
            buildingDetailsDescription: [undefined] ,
            description: [undefined] ,
            landDetails: this.formBuilder.array([]) ,
            buildingDetails: this.formBuilder.array([]) ,
            buildingUnderConstructions: this.formBuilder.array([]) ,
            plantDetails: this.formBuilder.array([]),
            vehicleDetails: this.formBuilder.array([])
        });
    }

    setValuatorDetails(valuatorData) {
        this.securityForm.get('valuatorDetails').setValue(valuatorData);
    }

    setBuildingDescription(buildingDescription) {
        this.securityForm.get('buildingDetailsDescription').setValue(buildingDescription);
    }

    setLandDescription(landDescription) {
        this.securityForm.get('description').setValue(landDescription);
    }

    setLandDetails(currentData) {
        const landDetails = this.securityForm.get('landDetails') as FormArray;
        currentData.forEach(singleData => {
            landDetails.push(
                this.formBuilder.group({
                    owner: [singleData.owner] ,
                    location: [singleData.location] ,
                    plotNumber: [singleData.plotNumber] ,
                    areaFormat: [singleData.areaFormat] ,
                    area: [singleData.area] ,
                    marketValue: [singleData.marketValue] ,
                    distressValue: [singleData.distressValue] ,
                    description: [singleData.description] ,
                })
            );
        });
    }

    setBuildingDetails(Data) {
        const buildingDetails = this.securityForm.get('buildingDetails') as FormArray;
        Data.forEach(singleData => {
            buildingDetails.push(
                this.formBuilder.group({
                    buildingName: [singleData.buildingName] ,
                    buildingDescription: [singleData.buildingDescription] ,
                    buildArea: [singleData.buildArea] ,
                    buildRate: [singleData.buildRate] ,
                    totalCost: [singleData.totalCost] ,
                    floorName: [singleData.floorName] ,
                    valuationArea: [singleData.valuationArea] ,
                    ratePerSquareFeet: [singleData.ratePerSquareFeet] ,
                    estimatedCost: [singleData.estimatedCost] ,
                    waterSupply: [singleData.waterSupply] ,
                    sanitation: [singleData.sanitation] ,
                    electrification: [singleData.electrification] ,
                    buildingTotalCost: [singleData.buildingTotalCost] ,
                    buildingFairMarketValue: [singleData.buildingFairMarketValue] ,
                    buildingDistressValue: [singleData.buildingDistressValue] ,
                })
            );
        });
    }

    setBuildingUnderConstructions(currentData) {
        const underConstruct = this.securityForm.get('buildingUnderConstructions') as FormArray;
        currentData.forEach(singleData => {
            underConstruct.push(
                this.formBuilder.group({
                    buildingDetailsBeforeCompletion: this.formBuilder.group({
                        buildingName: [singleData.buildingDetailsBeforeCompletion.buildingName] ,
                        buildingDescription: [singleData.buildingDetailsBeforeCompletion.buildingDescription] ,
                        buildArea: [singleData.buildingDetailsBeforeCompletion.buildArea] ,
                        buildRate: [singleData.buildingDetailsBeforeCompletion.buildRate] ,
                        totalCost: [singleData.buildingDetailsBeforeCompletion.totalCost] ,
                        floorName: [singleData.buildingDetailsBeforeCompletion.floorName] ,
                        valuationArea: [singleData.buildingDetailsBeforeCompletion.valuationArea] ,
                        ratePerSquareFeet: [singleData.buildingDetailsBeforeCompletion.ratePerSquareFeet] ,
                        estimatedCost: [singleData.buildingDetailsBeforeCompletion.estimatedCost] ,
                        waterSupply: [singleData.buildingDetailsBeforeCompletion.waterSupply] ,
                        sanitation: [singleData.buildingDetailsBeforeCompletion.sanitation] ,
                        electrification: [singleData.buildingDetailsBeforeCompletion.electrification] ,
                        buildingTotalCost: [singleData.buildingDetailsBeforeCompletion.buildingTotalCost] ,
                        buildingFairMarketValue: [singleData.buildingDetailsBeforeCompletion.buildingFairMarketValue] ,
                        buildingDistressValue: [singleData.buildingDetailsBeforeCompletion.buildingDistressValue]
                    }) ,
                    buildingDetailsAfterCompletion: this.formBuilder.group({
                        buildingName: [singleData.buildingDetailsAfterCompletion.buildingName] ,
                        buildingDescription: [singleData.buildingDetailsAfterCompletion.buildingDescription] ,
                        buildArea: [singleData.buildingDetailsAfterCompletion.buildArea] ,
                        buildRate: [singleData.buildingDetailsAfterCompletion.buildRate] ,
                        totalCost: [singleData.buildingDetailsAfterCompletion.totalCost] ,
                        floorName: [singleData.buildingDetailsAfterCompletion.floorName] ,
                        valuationArea: [singleData.buildingDetailsAfterCompletion.valuationArea] ,
                        ratePerSquareFeet: [singleData.buildingDetailsAfterCompletion.ratePerSquareFeet] ,
                        estimatedCost: [singleData.buildingDetailsAfterCompletion.estimatedCost] ,
                        waterSupply: [singleData.buildingDetailsAfterCompletion.waterSupply] ,
                        sanitation: [singleData.buildingDetailsAfterCompletion.sanitation] ,
                        electrification: [singleData.buildingDetailsAfterCompletion.electrification] ,
                        buildingTotalCost: [singleData.buildingDetailsAfterCompletion.buildingTotalCost] ,
                        buildingFairMarketValue: [singleData.buildingDetailsAfterCompletion.buildingFairMarketValue] ,
                        buildingDistressValue: [singleData.buildingDetailsAfterCompletion.buildingDistressValue]
                    })
                })
            );
        });
    }

    addBuildingUnderConstructions() {
        const underConstruct = this.securityForm.get('buildingUnderConstructions') as FormArray;
        underConstruct.push(
            this.formBuilder.group({
                buildingDetailsBeforeCompletion: this.formBuilder.group({
                    buildingName: [undefined] ,
                    buildingDescription: [undefined] ,
                    buildArea: [undefined] ,
                    buildRate: [undefined] ,
                    totalCost: [undefined] ,
                    floorName: [undefined] ,
                    valuationArea: [undefined] ,
                    ratePerSquareFeet: [undefined] ,
                    estimatedCost: [undefined] ,
                    waterSupply: [undefined] ,
                    sanitation: [undefined] ,
                    electrification: [undefined] ,
                    buildingTotalCost: [undefined] ,
                    buildingFairMarketValue: [undefined] ,
                    buildingDistressValue: [undefined]
                }) ,
                buildingDetailsAfterCompletion: this.formBuilder.group({
                    buildingName: [undefined] ,
                    buildingDescription: [undefined] ,
                    buildArea: [undefined] ,
                    buildRate: [undefined] ,
                    totalCost: [undefined] ,
                    floorName: [undefined] ,
                    valuationArea: [undefined] ,
                    ratePerSquareFeet: [undefined] ,
                    estimatedCost: [undefined] ,
                    waterSupply: [undefined] ,
                    sanitation: [undefined] ,
                    electrification: [undefined] ,
                    buildingTotalCost: [undefined] ,
                    buildingFairMarketValue: [undefined] ,
                    buildingDistressValue: [undefined]

                })
            })
        );
    }

    setPlantDetails(currentData) {
        const plantDetails = this.securityForm.get('plantDetails') as FormArray;
        currentData.forEach(singleData => {
            plantDetails.push(
                this.formBuilder.group({
                    model: [singleData.model] ,
                    quotation: [singleData.quotation] ,
                    supplier: [singleData.supplier] ,
                    downPay: [singleData.downPay] ,
                    loanExp: [singleData.loanExp]
                })
            );
        });
    }

    change(arraySelected) {
        this.selectedArray = arraySelected;
        this.landSelected = this.apartmentSelected = this.plantSelected = this.underConstructionChecked = false;
        arraySelected.forEach(selectedValue => {
            switch (selectedValue) {
                case 'LandSecurity' :
                    this.landSelected = true;
                    break;
                case 'VehicleSecurity' :
                    this.vehicleSelected = true;
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
    }

    landDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            owner: [''] ,
            location: [''] ,
            plotNumber: [''] ,
            areaFormat: [''] ,
            area: [''] ,
            marketValue: [''] ,
            distressValue: [''] ,
            description: [''] ,
        });
    }

    buildingDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            buildingName: [''] ,
            buildingDescription: [''] ,
            buildArea: [''] ,
            buildRate: [''] ,
            totalCost: [''] ,
            floorName: [''] ,
            valuationArea: [''] ,
            ratePerSquareFeet: [''] ,
            estimatedCost: [''] ,
            waterSupply: [''] ,
            sanitation: [''] ,
            electrification: [''] ,
            buildingTotalCost: [''] ,
            buildingFairMarketValue: [''] ,
            buildingDistressValue: [''] ,
            buildingDetailsDescription: ['']

        });
    }

    plantDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            model: [''] ,
            quotation: [''] ,
            supplier: [''] ,
            downPay: [''] ,
            loanExp: ['']
        });
    }

    underConstruction(checkedStatus) {
        if (checkedStatus) {
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
        (this.securityForm.get('buildingDetails') as FormArray).push(this.buildingDetailsFormGroup());
    }

    removeBuildingDetails(index: number) {
        (this.securityForm.get('buildingDetails') as FormArray).removeAt(index);
    }

    removeBuildingUnderConstructions(index: number) {
        (this.securityForm.get('buildingUnderConstructions') as FormArray).removeAt(index);
    }

    removePlantDetails(index: number) {
        (this.securityForm.get('plantDetails') as FormArray).removeAt(index);
    }

    addPlantandMachinery() {
        (this.securityForm.get('plantDetails') as FormArray).push(this.plantDetailsFormGroup());
    }
    message() {
        const alert = new Alert(AlertType.INFO, 'Enter valid proposal limit to select valuator');
        this.valuatorToast.show(alert);
    }

    selectDate(value) {
        this.englishDateSelected = !value;
    }

    vehicleDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            model: [''],
            registrationNumber: [''],
            registrationDate: [''],
            engineNumber: [''],
            chassisNumber: [''],
            valuationAmount: [''],
            downPayment: [''],
            loanExposure: [''],
            showroomCommission: [''],
        });
    }

    public addVehicleSecurity() {
        (this.securityForm.get('vehicleDetails') as FormArray).push(this.vehicleDetailsFormGroup());
    }

    removeVehicleDetails(index: number) {
        (this.securityForm.get('vehicleDetails') as FormArray).removeAt(index);
    }

    setVehicleDetails(currentData) {
        const vehicleDetails = this.securityForm.get('vehicleDetails') as FormArray;
        currentData.forEach(singleData => {
            vehicleDetails.push(
                this.formBuilder.group({
                    model: [singleData.model],
                    registrationNumber: [singleData.registrationNumber],
                    registrationDate: [singleData.registrationDate],
                    engineNumber: [singleData.engineNumber],
                    chassisNumber: [singleData.chassisNumber],
                    valuationAmount: [singleData.valuationAmount],
                    downPayment: [singleData.downPayment],
                    loanExposure: [singleData.loanExposure],
                    showroomCommission: [singleData.showroomCommission],
                })
            );
        });
    }
}
