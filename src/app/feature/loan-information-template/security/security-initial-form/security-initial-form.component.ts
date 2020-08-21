import {Component , Input , OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../../@core/utils';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ValuatorService} from '../../../admin/component/valuator/valuator.service';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {SecurityValuator} from '../../../loan/model/securityValuator';
import {LoanTag} from '../../../loan/model/loanTag';
import {NepseMaster} from '../../../admin/modal/NepseMaster';
import {Nepse} from '../../../admin/modal/nepse';
import {ShareType} from '../../../loan/model/ShareType';
import {CustomerShareData} from '../../../admin/modal/CustomerShareData';
import {NepseService} from '../../../admin/component/nepse/nepse.service';
import {ShareSecurity} from '../../../admin/modal/shareSecurity';


@Component({
    selector: 'app-security-initial-form' ,
    templateUrl: './security-initial-form.component.html' ,
    styleUrls: ['./security-initial-form.component.scss']
})
export class SecurityInitialFormComponent implements OnInit {
    @Input() formData: string;
    @Input() calendarType: CalendarType;
    @Input() loanTag: string;
    @Input() shareSecurity;

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
    shareSelected = false;

    securityTypes = [
        {key: 'LandSecurity', value: 'Land Security'},
        {key: 'VehicleSecurity', value: 'Vehicle Security'},
        {key: 'ApartmentSecurity', value: 'Apartment Security'},
        {key: 'Land and Building Security', value: 'Land and Building Security'},
        {key: 'PlantSecurity', value: 'Plant and Machinery Security'},
        {key: 'FixedDeposit', value: 'Fixed Deposit Receipt'},
        {key: 'ShareSecurity', value: 'Share Security'}
    ];

    shareType = ShareType;
    activeNepseMaster: NepseMaster = new NepseMaster();
    nepseList: Array<Nepse> = new Array<Nepse>();
    search: any = {
        status: 'ACTIVE',
        shareType: undefined,
        companyName: undefined
    };
    isShareSecurity = false;
    shareSecurityForm: FormGroup;
    shareSecurityData: ShareSecurity = new ShareSecurity();

    constructor(private formBuilder: FormBuilder,
                private valuatorToast: ToastService,
                private valuatorService: ValuatorService,
                private branchService: BranchService,
                private shareService: NepseService) {
    }

    ngOnInit() {
        this.shareService.findAllNepseCompanyData(this.search).subscribe((list) => {
            this.nepseList = list.detail;
        });
        this.findActiveShareRate();
        this.buildForm();
        this.branchList();
        this.checkLoanTags();

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

        if (ObjectUtil.isEmpty(this.shareSecurity)) {
            this.addShareSecurity();
        } else {
            this.shareSecurityData.id = this.shareSecurity.id;
            this.shareSecurityData.version = this.shareSecurity.version;

            this.setShareSecurityDetails(this.shareSecurity);
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
        this.buildShareSecurityForm();
    }

    buildShareSecurityForm() {
        this.shareSecurityForm = this.formBuilder.group({
            shareSecurityDetails: this.formBuilder.array([]),
            securityOffered: undefined,
            loanShareRate: undefined
        });
        if (!ObjectUtil.isEmpty(this.shareSecurity)) {
            this.shareSecurityForm.get('securityOffered').patchValue(JSON.parse(this.shareSecurity.data)['securityOffered']);
        }
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
                    plantBranch: [singleData.plantBranch]
                })
            );
        });
    }

    change(arraySelected) {
        this.selectedArray = arraySelected;
        this.landSelected = this.vehicleSelected = this.apartmentSelected = this.plantSelected
            = this.underConstructionChecked = this.depositSelected = this.shareSelected = false;
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
                    break;
                case 'ShareSecurity':
                    this.shareSelected = true;
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
                    vehicalBranch: [singleData.vehicalBranch]
                })
            );
        });
    }

    fixedDepositFormGroup(): FormGroup {
        return this.formBuilder.group({
            receiptNumber: [''],
            amount: [''],
            expiryDate: undefined,
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
        if (!ObjectUtil.isEmpty(details)) {
        const depositDetails = this.securityForm.get('fixedDepositDetails') as FormArray;
        details.forEach(deposit => {
            depositDetails.push(
                this.formBuilder.group({
                    receiptNumber: [deposit.receiptNumber],
                    amount: [deposit.amount],
                    expiryDate: [new Date(deposit.expiryDate)],
                    couponRate: [deposit.couponRate],
                    beneficiary: [deposit.beneficiary],
                    remarks: [deposit.remarks]
                })
            );
        });
        } else {
            this.addFixedDeposit();
        }
    }

    checkLoanTags() {
        if (this.loanTag === LoanTag.getKeyByValue('FIXED DEPOSIT')) {
            this.isFixedDeposit = true;
        } else if (this.loanTag === LoanTag.getKeyByValue('SHARE SECURITY')) {
            this.isShareSecurity = true;
        }
    }

    getSecurities() {
        if (this.isFixedDeposit) {
            return this.securityTypes.filter(type => type.key === 'FixedDeposit');
        } else if (this.isShareSecurity) {
            return this.securityTypes.filter(type => type.key === 'ShareSecurity');
        }
        return this.securityTypes;
    }

    setShareValueByCompany(index: number) {
        const companyName = this.shareField.at(index).get('companyName').value;
        const totalShareUnit = this.shareField.at(index).get('totalShareUnit').value;
        const matchedNepse = this.nepseList.filter(n => n.companyName === companyName);
        if (matchedNepse) {
            this.shareField.at(index).patchValue({
                shareType: matchedNepse[0].shareType,
                companyCode: matchedNepse[0].companyCode,
                amountPerUnit: matchedNepse[0].amountPerUnit,
                total: this.calculateTotalShareAmount(companyName, totalShareUnit),
                consideredValue: this.calculateConsideredAmount(
                    this.shareField.at(index).get('totalShareUnit').value,
                    this.shareField.at(index).get('amountPerUnit').value,
                    matchedNepse[0].shareType
                )
            });
        }
    }

    private calculateTotalShareAmount(companyName: string, totalShareUnit: number): number {
        if (ObjectUtil.isEmpty(companyName)) {
            return undefined;
        }
        const matchedNepse = this.nepseList.filter(n => n.companyName === companyName);
        return totalShareUnit ? totalShareUnit * Number(matchedNepse[0].amountPerUnit) : 0;
    }

    private calculateConsideredAmount(totalShareUnit: number, amountPerUnit: number, shareType) {
        if (ObjectUtil.isEmpty(shareType)) {
            return undefined;
        }
        const activeNepse = shareType === ShareType.PROMOTER ? this.activeNepseMaster.promoter :
            this.activeNepseMaster.ordinary;
        return ((totalShareUnit * amountPerUnit) / 100) * activeNepse;
    }

    calculateShareFieldsValues(index: number) {
        const totalShareUnit = this.shareField.at(index).get('totalShareUnit').value;
        const amountPerUnit = this.shareField.at(index).get('amountPerUnit').value;
        const shareType = this.shareField.at(index).get('shareType').value;
        this.shareField.at(index).patchValue({
            total: totalShareUnit * amountPerUnit,
            consideredValue: this.calculateConsideredAmount(totalShareUnit, amountPerUnit, shareType)
        });
    }

    get totalConsideredValue() {
        let total = 0;
        this.shareField.controls.forEach(c => total += Number(c.get('consideredValue').value));
        return total;
    }

    get shareField() {
        return this.shareSecurityForm.get('shareSecurityDetails') as FormArray;
    }

    public removeShareList(index: number): void {
        this.shareField.removeAt(index);
    }

    private findActiveShareRate() {
        this.shareService.getActiveShare().subscribe(value => {
            if (!ObjectUtil.isEmpty(value.detail)) {
                this.activeNepseMaster = value.detail;
            }
        });
    }

    private setShareSecurityDetails(details) {
        const shareDetails = this.shareSecurityForm.get('shareSecurityDetails') as FormArray;
        const shareFields = (JSON.parse(details.data))['shareSecurityDetails'];
        shareFields.forEach(share => {
            shareDetails.push(
                this.formBuilder.group({
                    companyName: [share.companyName],
                    shareType: [share.shareType],
                    totalShareUnit: [share.totalShareUnit],
                    amountPerUnit: [share.amountPerUnit],
                    total: [share.total],
                    consideredValue: [share.consideredValue]
                })
            );
        });
    }

    shareSecurityFormGroup(): FormGroup {
        return this.formBuilder.group({
            id: undefined,
            version: undefined,
            companyName: [''],
            shareType: undefined,
            totalShareUnit: [''],
            amountPerUnit: [''],
            total: [''],
            consideredValue: ['']
        });
    }

    addShareSecurity() {
        this.shareField.push(this.shareSecurityFormGroup());
    }

    submit() {
        this.shareSecurityForm.get('loanShareRate').setValue(this.activeNepseMaster);
        this.shareSecurityData.data = JSON.stringify(this.shareSecurityForm.value);
        this.shareSecurityData.customerShareData = this.getShareDataList();

    }

    private getShareDataList() {
        const list: Array<CustomerShareData> = [];
        this.shareField.controls.forEach(c => list.push(c.value));
        return list;
    }
}
