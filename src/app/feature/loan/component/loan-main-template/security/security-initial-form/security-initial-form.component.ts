import {Component , Input , OnInit} from '@angular/core';
import {FormArray , FormBuilder , FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../../@core/utils';
import {CalendarType} from '../../../../../../@core/model/calendar-type';
import {LocalStorageUtil} from '../../../../../../@core/utils/local-storage-util';
import {ValuatorService} from '../../../../../admin/component/valuator/valuator.service';
import {BranchService} from '../../../../../admin/component/branch/branch.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {SecurityValuator} from '../../../../model/securityValuator';
import {LoanTag} from '../../../../model/loanTag';

@Component({
    selector: 'app-security-initial-form' ,
    templateUrl: './security-initial-form.component.html' ,
    styleUrls: ['./security-initial-form.component.scss']
})
export class SecurityInitialFormComponent implements OnInit {
    @Input() formData: string;
    @Input() name;
    @Input() calendarType: CalendarType;
    @Input() loanTag: string;

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
    branchLists;
    securityValuator: SecurityValuator =  new SecurityValuator();
    otherBranchcheck = false;
    depositSelected = false;
    isFixedDeposit = false;

    securityTypes = [
        {key: 'LandSecurity', value: 'Land Security'},
        {key: 'VehicleSecurity', value: 'Vehicle Security'},
        {key: 'ApartmentSecurity', value: 'Apartment Security'},
        {key: 'Land and Building Security', value: 'Land and Building Security'},
        {key: 'PlantSecurity', value: 'Plant and Machinery Security'},
        {key: 'FixedDeposit', value: 'Fixed Deposit Receipt'},
    ];

    constructor(private formBuilder: FormBuilder,
                private valuatorToast: ToastService,
                private valuatorService: ValuatorService,
                private branchService: BranchService) {
    }

    ngOnInit() {
        this.buildForm();
        this.valuatorList = this.name;
        this.branchList();
        this.checkFixDeposit();
        if (this.formData !== undefined) {
            this.formDataForEdit = this.formData['initialForm'];
            this.selectedArray = this.formData['selectedArray'];
            this.change(this.selectedArray);
            this.underConstruction(this.formData['underConstructionChecked']);
            this.otherBranch(this.formData['otherBranchcheck']);
            this.setBuildingDescription(this.formDataForEdit['buildingDetailsDescription']);
            this.setLandDescription(this.formDataForEdit['description']);
            this.setLandDetails(this.formDataForEdit['landDetails']);
            this.setBuildingDetails(this.formDataForEdit['buildingDetails']);
            this.setBuildingUnderConstructions(this.formDataForEdit['buildingUnderConstructions']);
            this.setPlantDetails(this.formDataForEdit['plantDetails']);
            this.setVehicleDetails(this.formDataForEdit['vehicleDetails']);
            this.setFixedDepositDetails(this.formDataForEdit['fixedDepositDetails']);
        } else {
            this.addMoreLand();
            this.addBuilding();
            this.addPlantandMachinery();
            this.addBuildingUnderConstructions();
            this.addVehicleSecurity();
            this.addFixedDeposit();
        }
    }

    buildForm() {
        this.securityForm = this.formBuilder.group({
            buildingDetailsDescription: [undefined],
            description: [undefined],
            landDetails: this.formBuilder.array([]),
            buildingDetails: this.formBuilder.array([]),
            buildingUnderConstructions: this.formBuilder.array([]),
            plantDetails: this.formBuilder.array([]),
            vehicleDetails: this.formBuilder.array([]),
            fixedDepositDetails: this.formBuilder.array([])
        });
    }

    valuator(branchId, type: string, index: number) {
        if (this.otherBranchcheck && ObjectUtil.isEmpty(branchId)) {
            return;
        }
        const valuatorSearch = {
            'branchIds': LocalStorageUtil.getStorage().branch
        };
        if (!ObjectUtil.isEmpty(branchId)) {
                valuatorSearch.branchIds = JSON.stringify(branchId);
        }
        switch (type) {
            case 'land':
            this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
                        this.securityValuator.landValuator[index] = res.detail;
                    });
                break;
            case 'apartment':
                this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
                    this.securityValuator.apartmentValuator[index] = res.detail;
                });
                break;
            case 'vehicle':
                this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
                    this.securityValuator.vehicalValuator[index] = res.detail;
                });
                break;
            case 'plant':
                this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
                    this.securityValuator.plantValuator[index] = res.detail;
                });
                break;
        }
    }
    branchList() {
        this.branchService.getAll().subscribe((res: any) => {
            this.branchLists = res.detail;
        });
    }


    setBuildingDescription(buildingDescription) {
        this.securityForm.get('buildingDetailsDescription').setValue(buildingDescription);
    }

    setLandDescription(landDescription) {
        this.securityForm.get('description').setValue(landDescription);
    }

    setLandDetails(currentData) {
        const landDetails = this.securityForm.get('landDetails') as FormArray;
        currentData.forEach((singleData, index) => {
            if (this.otherBranchcheck && singleData['landBranch']) {
                this.valuator(singleData['landBranch']['id'], 'land', index);
            } else {
                this.valuator(null, 'land', index);

            }
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
                    landValuator: [singleData.landValuator],
                    landValuatorDate: [ObjectUtil.isEmpty(singleData.landValuatorDate) ? undefined : new Date(singleData.landValuatorDate)],
                    landValuatorRepresentative: [singleData.landValuatorRepresentative],
                    landStaffRepresentativeName: [singleData.landStaffRepresentativeName],
                    landStaffRepresentativeNameOne: [singleData.landStaffRepresentativeNameOne],
                    landBranch: [singleData.landBranch]
                })
            );
        });
    }

    setBuildingDetails(Data) {
        const buildingDetails = this.securityForm.get('buildingDetails') as FormArray;
        Data.forEach((singleData , index) => {
            if (this.otherBranchcheck && singleData.apartmentBranch) {
                this.valuator(singleData['apartmentBranch']['id'], 'apartment', index);
            } else {
                this.valuator(null, 'apartment', index);
            }
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
                    ApartmentValuator: [singleData.ApartmentValuator],
                    ApartmentValuatorDate: [ObjectUtil.isEmpty(singleData.ApartmentValuatorDate) ?
                        undefined : new Date(singleData.ApartmentValuatorDate)],
                    ApartmentValuatorRepresentative: [singleData.ApartmentValuatorRepresentative],
                    ApartmentStaffRepresentativeName: [singleData.ApartmentStaffRepresentativeName],
                    ApartmentStaffRepresentativeNameOne: [singleData.ApartmentStaffRepresentativeNameOne],
                    apartmentBranch: [singleData.apartmentBranch]
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
        currentData.forEach((singleData, index) => {
            if (this.otherBranchcheck && singleData.plantBranch) {
                this.valuator(singleData['plantBranch']['id'], 'plant', index);
            } else {
                this.valuator(null, 'plant', index);
            }
            plantDetails.push(
                this.formBuilder.group({
                    model: [singleData.model] ,
                    quotation: [singleData.quotation] ,
                    supplier: [singleData.supplier] ,
                    downPay: [singleData.downPay] ,
                    loanExp: [singleData.loanExp],
                    plantMachineryValuator: [singleData.plantMachineryValuator],
                    plantMachineryValuatorDate: [ObjectUtil.isEmpty(singleData.plantMachineryValuatorDate) ?
                        undefined : new Date(singleData.plantMachineryValuatorDate)],
                    plantMachineryValuatorRepresentative: [singleData.plantMachineryValuatorRepresentative],
                    plantMachineryStaffRepresentativeName: [singleData.plantMachineryStaffRepresentativeName],
                    plantMachineryStaffRepresentativeNameOne: [singleData.plantMachineryStaffRepresentativeNameOne],

                    plantBranch: [singleData.plantBranch]
                })
            );
        });
    }

    change(arraySelected) {
        this.selectedArray = arraySelected;
        this.landSelected = this.vehicleSelected = this.apartmentSelected = this.plantSelected
            = this.underConstructionChecked = this.depositSelected = false;
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
                    break;
                case 'FixedDeposit':
                    this.depositSelected = true;
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
            landValuator: [undefined],
            landValuatorDate: [undefined],
            landValuatorRepresentative: [undefined],
            landStaffRepresentativeName: [undefined],
            landStaffRepresentativeNameOne: [undefined],
            landBranch: [undefined]
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
            buildingDetailsDescription: [''],
            ApartmentValuator: [undefined],
            ApartmentValuatorDate: [undefined],
            ApartmentValuatorRepresentative: [undefined],
            ApartmentStaffRepresentativeName: [undefined],
            ApartmentStaffRepresentativeNameOne: [undefined],
            apartmentBranch: [undefined]
        });
    }

    plantDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            model: [''] ,
            quotation: [''] ,
            supplier: [''] ,
            downPay: [''] ,
            loanExp: [''],
            plantMachineryValuator: [undefined],
            plantMachineryValuatorDate: [undefined],
            plantMachineryValuatorRepresentative: [undefined],
            plantMachineryStaffRepresentativeName: [undefined],
            plantMachineryStaffRepresentativeNameOne: [undefined],
            plantBranch: [undefined]
        });
    }

    underConstruction(checkedStatus) {
        if (checkedStatus) {
            this.underConstructionChecked = true;
        } else {
            this.underConstructionChecked = false;
        }
    }
    otherBranch(checkedStatus) {
        if (checkedStatus) {
            this.otherBranchcheck = true;
        } else {
            this.otherBranchcheck = false;
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
            vehicalValuator: [undefined],
            vehicalValuatorDate: [undefined],
            vehicalValuatorRepresentative: [undefined],
            vehicalStaffRepresentativeName: [undefined],
            vehicalStaffRepresentativeNameOne: [undefined],
            vehicalBranch: [undefined]
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
        currentData.forEach((singleData, index) => {
            if (this.otherBranchcheck && singleData.vehicalBranch) {
                this.valuator(singleData['vehicalBranch']['id'], 'vehicle', index);
            } else {
                this.valuator(null, 'vehicle', index);
            }
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
                    vehicalValuator: [singleData.vehicalValuator],
                    vehicalValuatorDate: [ObjectUtil.isEmpty(singleData.vehicalValuatorDate) ? undefined
                        : new Date(singleData.vehicalValuatorDate)],
                    vehicalValuatorRepresentative: [singleData.vehicalValuatorRepresentative],
                    vehicalStaffRepresentativeName: [singleData.vehicalStaffRepresentativeName],
                    vehicalStaffRepresentativeNameOne: [singleData.vehicalStaffRepresentativeNameOne],
                    vehicalBranch: [singleData.vehicalBranch]
                })
            );
        });
    }

    fixedDepositFormGroup(): FormGroup {
        return this.formBuilder.group({
            receiptNumber: [''],
            amount: [''],
            expiryDate: [undefined],
            couponRate: [''],
            beneficiary: [''],
            remarks: ['']
        });
    }

    addFixedDeposit() {
        (this.securityForm.get('fixedDepositDetails') as FormArray).push(this.fixedDepositFormGroup());
    }

    removeFixedDeposit(index: number) {
        (this.securityForm.get('fixedDepositDetails') as FormArray).removeAt(index);
    }

    setFixedDepositDetails(details) {
        const depositDetails = this.securityForm.get('fixedDepositDetails') as FormArray;
        details.forEach(deposit => {
            depositDetails.push(
                this.formBuilder.group({
                    receiptNumber: [deposit.receiptNumber],
                    amount: [deposit.amount],
                    expiryDate: [ObjectUtil.isEmpty(deposit.expiryDate) ? undefined : new Date(deposit.expiryDate)],
                    couponRate: [deposit.couponRate],
                    beneficiary: [deposit.beneficiary],
                    remarks: [deposit.remarks]
                })
            );
        });
    }

    checkFixDeposit() {
        if (this.loanTag === LoanTag.getKeyByValue('FIXED DEPOSIT')) {
            this.isFixedDeposit = true;
        }
    }

    getSecurities() {
        if (this.isFixedDeposit) {
            return this.securityTypes.filter(type => type.key === 'FixedDeposit');
        }
        return this.securityTypes;
    }

    calculateBuildUpAreaRate(i) {
        const totalBuildRate = (Number(this.securityForm.get(['buildingDetails', i , 'buildArea']).value) * Number(this.securityForm.get(['buildingDetails', i , 'buildRate']).value)).toFixed(2);
        this.securityForm.get(['buildingDetails', i , 'totalCost']).patchValue(totalBuildRate);
    }
}
