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
import {Editor} from '../../../../@core/utils/constants/editor';


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
    landBuilding = false;
    underBuildingConstructionChecked = false;
    hypothecation = false;
    corporate = false;
    ckeConfig;
    personal = false;
    securityTypes = [
        {key: 'LandSecurity', value: 'Land Security'},
        {key: 'VehicleSecurity', value: 'Vehicle Security'},
        {key: 'ApartmentSecurity', value: 'Apartment Security'},
        {key: 'Land and Building Security', value: 'Land and Building Security'},
        {key: 'PlantSecurity', value: 'Plant and Machinery Security'},
        {key: 'FixedDeposit', value: 'Fixed Deposit Receipt'},
        {key: 'ShareSecurity', value: 'Share Security'},
        {key: 'HypothecationOfStock', value: 'Hypothecation of Stock'},
        {key: 'CorporateGuarantee', value: 'Corporate Guarantee'},
        {key: 'PersonalGuarantee', value: 'Personal Guarantee'},

    ];

    areaFormat = ['R-A-P-D' , 'B-K-D' , 'SQF', 'Sq.m'];

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
    typeOfProperty = ['Rajkar', 'Guthi', 'Others'];

    constructor(private formBuilder: FormBuilder,
                private valuatorToast: ToastService,
                private valuatorService: ValuatorService,
                private branchService: BranchService,
                private shareService: NepseService) {
    }

    ngOnInit() {
        this.configEditor();
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
            this.underBuildingConstruction(this.formData['underBuildingConstructionChecked']);
            this.otherBranch(this.formData['otherBranchcheck']);
            this.setBuildingDescription(this.formDataForEdit['buildingDetailsDescription']);
            this.setLandDescription(this.formDataForEdit['description']);
            this.setLandDetails(this.formDataForEdit['landDetails']);
            this.setBuildingDetails(this.formDataForEdit['buildingDetails']);
            this.setBuildingUnderConstructions(this.formDataForEdit['buildingUnderConstructions']);
            this.setLandBuildingDetails(this.formDataForEdit['landBuilding']);
            this.setPlantDetails(this.formDataForEdit['plantDetails']);
            this.setVehicleDetails(this.formDataForEdit['vehicleDetails']);
            this.setFixedDepositDetails(this.formDataForEdit['fixedDepositDetails']);
            this.setLandBuildingDescription(this.formDataForEdit['landBuildingDescription']);
            this.setLandBuildingUnderConstructions(this.formDataForEdit['landBuildingUnderConstruction']);
            this.setRemark(this.formDataForEdit['remark']);
            this.setHypothecation(this.formDataForEdit['hypothecationOfStock']);
            this.setCorporate(this.formDataForEdit['corporateGuarantee']);
            this.setPersonal(this.formDataForEdit['personalGuarantee']);

        } else {
            this.addMoreLand();
            this.addBuilding();
            this.addPlantandMachinery();
            this.addBuildingUnderConstructions();
            this.addVehicleSecurity();
            this.addFixedDeposit();
            this.addLandBuilding();
            this.addLandBuildingUnderConstruction();
            this.addHypothecationOfStock();
            this.addCorporateGuarantee();
            this.addPersonalGuarantee();
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
            fixedDepositDetails: this.formBuilder.array([]),
            landBuilding: this.formBuilder.array([]),
            landBuildingDescription: [undefined],
            landBuildingUnderConstruction: this.formBuilder.array([]),
            remark: [undefined],
            hypothecationOfStock: this.formBuilder.array([]),
            corporateGuarantee: this.formBuilder.array([]),
            personalGuarantee: this.formBuilder.array([])

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
            case  'building':
                this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
                    this.securityValuator.buildingValuator[index] = res.detail;
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

    setLandBuildingDescription(landBuildingDescription) {
        this.securityForm.get('landBuildingDescription').setValue(landBuildingDescription);
    }

    setLandDescription(landDescription) {
        this.securityForm.get('description').setValue(landDescription);
    }

    setRemark(remarkData) {
        this.securityForm.get('remark').patchValue(remarkData);
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
                    landBranch: [singleData.landBranch] ,
                    landConsideredValue: [ObjectUtil.isEmpty(singleData.landConsideredValue) ?  undefined : singleData.landConsideredValue],
                    typeOfProperty: [singleData.typeOfProperty],
                    modeOfTransfer: [singleData.modeOfTransfer]
                })
            );
        });
    }

    setHypothecation(currentData) {
        if (!ObjectUtil.isEmpty(currentData)) {
            const hypothecationDetails = this.securityForm.get('hypothecationOfStock') as FormArray;
            currentData.forEach((singleData) => {
                hypothecationDetails.push(
                    this.formBuilder.group({
                        owner: [singleData.owner] ,
                        stock: [singleData.stock] ,
                        value: [singleData.value] ,
                        otherDetail: [singleData.otherDetail] ,
                        description: [singleData.description]

                    })
                );
            });
        } else {
            this.addHypothecationOfStock();
        }

    }

    setCorporate(currentData) {
        if (!ObjectUtil.isEmpty(currentData)) {
            const corporateGuarantee = this.securityForm.get('corporateGuarantee') as FormArray;
            currentData.forEach((singleData) => {
                corporateGuarantee.push(
                    this.formBuilder.group({
                        name: [singleData.name] ,
                        address: [singleData.address] ,
                        keyPerson: [singleData.keyPerson] ,
                        email: [singleData.email] ,
                        phoneNumber: [singleData.phoneNumber] ,
                        otherDetail: [singleData.otherDetail] ,
                    })
                );
            });
        } else {
            this.addCorporateGuarantee();
        }

    }

    setPersonal(currentData) {
        if (!ObjectUtil.isEmpty(currentData)) {
            const personalGuarantee = this.securityForm.get('personalGuarantee') as FormArray;
            currentData.forEach((singleData) => {
                personalGuarantee.push(
                    this.formBuilder.group({
                        name: [singleData.name] ,
                        address: [singleData.address] ,
                        email: [singleData.email] ,
                        phoneNumber: [singleData.phoneNumber] ,
                        otherDetail: [singleData.otherDetail] ,
                        owner: [singleData.owner] ,

                    })
                );
            });
        } else {
            this.addPersonalGuarantee();
        }

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

    setLandBuildingDetails(Data) {
        if (ObjectUtil.isEmpty(Data)) {
            this.addLandBuilding();
            return;
        }
        const buildingDetails = this.securityForm.get('landBuilding') as FormArray;
        Data.forEach((singleData , index) => {
            if (this.otherBranchcheck && singleData.apartmentBranch) {
                this.valuator(singleData['apartmentBranch']['id'], 'building', index);
            } else {
                this.valuator(null, 'building', index);
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
                    apartmentBranch: [singleData.apartmentBranch],
                    typeOfProperty: [singleData.typeOfProperty],
                    modeOfTransfer: [singleData.modeOfTransfer]
                })
            );
        });
    }

    setLandBuildingUnderConstructions(currentData) {
        if (ObjectUtil.isEmpty(currentData)) {
            this.addLandBuildingUnderConstruction();
            return;
        }
        const underConstruct = this.securityForm.get('landBuildingUnderConstruction') as FormArray;
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
                        buildingDistressValue: [singleData.buildingDetailsBeforeCompletion.buildingDistressValue],
                        typeOfProperty: [singleData.buildingDetailsBeforeCompletion.typeOfProperty],
                        modeOfTransfer: [singleData.buildingDetailsBeforeCompletion.modeOfTransfer]
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
                        buildingDistressValue: [singleData.buildingDetailsAfterCompletion.buildingDistressValue],
                        typeOfProperty: [singleData.buildingDetailsAfterCompletion.typeOfProperty],
                        modeOfTransfer: [singleData.buildingDetailsAfterCompletion.modeOfTransfer]
                    })
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

    addLandBuildingUnderConstruction() {
        const underConstruct = this.securityForm.get('landBuildingUnderConstruction') as FormArray;
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
                    buildingDistressValue: [undefined],
                    typeOfProperty: [undefined],
                    modeOfTransfer: [undefined]
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
                    buildingDistressValue: [undefined],
                    typeOfProperty: [undefined],
                    modeOfTransfer: [undefined]

                })
            })
        );
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
            = this.underConstructionChecked = this.depositSelected = this.shareSelected = this.landBuilding =  false;
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
                    this.landBuilding = this.landSelected = true;
                    break;
                case 'PlantSecurity' :
                    this.plantSelected = true;
                    break;
                case 'FixedDeposit':
                    this.depositSelected = true;
                    break;
                case 'ShareSecurity':
                    this.shareSelected = true;
                    break;
                case 'HypothecationOfStock':
                    this.hypothecation = true;
                    break;
                case 'CorporateGuarantee':
                    this.corporate = true;
                    break;
                case 'PersonalGuarantee':
                    this.personal = true;
            }
        });
    }

    hypothecationDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            owner: [undefined] ,
            stock: [undefined] ,
            value: [undefined] ,
            otherDetail: [undefined] ,
            description: [undefined]

            }
        ); }

    corporateDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            name: [undefined] ,
            address: [undefined] ,
            keyPerson: [undefined] ,
            email: [undefined] ,
            phoneNumber: [undefined] ,
            otherDetail: [undefined] ,
            }
        ); }

    personalDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            name: [undefined] ,
            address: [undefined] ,
            email: [undefined] ,
            phoneNumber: [undefined] ,
            owner: [undefined] ,
            otherDetail: [undefined] ,
            }
        );
    }
    configEditor() {
        this.ckeConfig = Editor.CK_CONFIG;
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
            landBranch: [undefined],
            landConsideredValue: [undefined],
            typeOfProperty: [undefined],
            modeOfTransfer: [undefined]
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

    LandBuildingDetailsFormGroup() {
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
            buildingDetailsDescription: [''],
            ApartmentValuator: [undefined],
            ApartmentValuatorDate: [undefined],
            ApartmentValuatorRepresentative: [undefined],
            ApartmentStaffRepresentativeName: [undefined],
            apartmentBranch: [undefined],
            typeOfProperty: [undefined],
            modeOfTransfer: [undefined]
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

    underBuildingConstruction(checkedStatus) {
        if (checkedStatus) {
            this.underBuildingConstructionChecked = true;
        } else {
            this.underBuildingConstructionChecked = false;
        }
    }
    otherBranch(checkedStatus) {
        if (checkedStatus) {
            this.otherBranchcheck = true;
        } else {
            this.otherBranchcheck = false;
        }
    }

    addLandBuilding() {
        (this.securityForm.get('landBuilding') as FormArray).push(this.LandBuildingDetailsFormGroup());
    }

    addMoreLand() {
        (this.securityForm.get('landDetails') as FormArray).push(this.landDetailsFormGroup());
    }

    addHypothecationOfStock() {
        (this.securityForm.get('hypothecationOfStock') as FormArray).push(this.hypothecationDetailsFormGroup());
    }

    addCorporateGuarantee() {
        (this.securityForm.get('corporateGuarantee') as FormArray).push(this.corporateDetailsFormGroup());
    }

    addPersonalGuarantee() {
        (this.securityForm.get('personalGuarantee') as FormArray).push(this.personalDetailsFormGroup());
    }

    removeLandDetails(index: number) {
        (<FormArray>this.securityForm.get('landDetails')).removeAt(index);
    }

    removeHypothecation(index: number) {
        (<FormArray>this.securityForm.get('hypothecationOfStock')).removeAt(index);
    }

    removeCorporate(index: number) {
        (<FormArray>this.securityForm.get('corporateGuarantee')).removeAt(index);

    }

    removePersonal(index: number) {
        (<FormArray>this.securityForm.get('personalGuarantee')).removeAt(index);
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

    removeLandBuildingUnderConstructions(i) {
        (this.securityForm.get('landBuildingUnderConstruction') as FormArray).removeAt(i);
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

    removeLandBuildingDetails(i) {
        (this.securityForm.get('landBuilding') as FormArray).removeAt(i);
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
                    companyCode: [share.companyCode],
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
            companyCode: [undefined],
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

    calculateBuildUpAreaRate(i, type) {
        switch (type) {
            case 'building':
                const totalBuildRate = (Number(this.securityForm.get(['buildingDetails', i , 'buildArea']).value)
                    * Number(this.securityForm.get(['buildingDetails', i , 'buildRate']).value)).toFixed(2);
                this.securityForm.get(['buildingDetails', i , 'totalCost']).patchValue(totalBuildRate);
                break;
            case 'before':
                const beforeTotalBuildRate = (Number(this.securityForm.get(['buildingUnderConstructions', i ,
                        'buildingDetailsBeforeCompletion', 'buildArea']).value)
                    * Number(this.securityForm.get(['buildingUnderConstructions', i ,
                        'buildingDetailsBeforeCompletion', 'buildRate']).value)).toFixed(2);
                this.securityForm.get(['buildingUnderConstructions', i ,
                    'buildingDetailsBeforeCompletion', 'totalCost']).patchValue(beforeTotalBuildRate);
                break;
            case 'after':
                const afterTotalBuildRate = (Number(this.securityForm.get(['buildingUnderConstructions', i ,
                        'buildingDetailsAfterCompletion', 'buildArea']).value)
                    * Number(this.securityForm.get(['buildingUnderConstructions', i ,
                        'buildingDetailsAfterCompletion', 'buildRate']).value)).toFixed(2);
                this.securityForm.get(['buildingUnderConstructions', i ,
                    'buildingDetailsAfterCompletion', 'totalCost']).patchValue(afterTotalBuildRate);
                break;
            case 'landBuilding':
                const landBuildingTotalBuildRate = (Number(this.securityForm.get(['landBuilding', i , 'buildArea']).value)
                    * Number(this.securityForm.get(['landBuilding', i , 'buildRate']).value)).toFixed(2);
                this.securityForm.get(['landBuilding', i , 'totalCost']).patchValue(landBuildingTotalBuildRate);
                break;
            case 'landBuildingBefore':
                const landBuildingBeforeTotalBuildRate = (Number(this.securityForm.get(['landBuildingUnderConstruction', i ,
                        'buildingDetailsBeforeCompletion', 'buildArea']).value)
                    * Number(this.securityForm.get(['landBuildingUnderConstruction', i ,
                        'buildingDetailsBeforeCompletion', 'buildRate']).value)).toFixed(2);
                this.securityForm.get(['landBuildingUnderConstruction', i ,
                    'buildingDetailsBeforeCompletion', 'totalCost']).patchValue(landBuildingBeforeTotalBuildRate);
                break;
            case 'landBuildingAfter':
                const landBuildingAfterTotalBuildRate = (Number(this.securityForm.get(['landBuildingUnderConstruction', i ,
                        'buildingDetailsAfterCompletion', 'buildArea']).value)
                    * Number(this.securityForm.get(['landBuildingUnderConstruction', i ,
                        'buildingDetailsAfterCompletion', 'buildRate']).value)).toFixed(2);
                this.securityForm.get(['landBuildingUnderConstruction', i ,
                    'buildingDetailsAfterCompletion', 'totalCost']).patchValue(landBuildingAfterTotalBuildRate);
                break;
        }
    }
    calculateEstimatedCost(i, type) {
        switch (type) {
            case 'building':
                const estimatedCost = (Number(this.securityForm.get(['buildingDetails', i , 'valuationArea']).value)
                    * Number(this.securityForm.get(['buildingDetails', i , 'ratePerSquareFeet']).value)).toFixed(2);
                this.securityForm.get(['buildingDetails', i , 'estimatedCost']).patchValue(estimatedCost);
                break;
            case 'before':
                const beforeEstimatedCost = (Number(this.securityForm.get(['buildingUnderConstructions', i ,
                        'buildingDetailsBeforeCompletion', 'valuationArea']).value)
                    * Number(this.securityForm.get(['buildingUnderConstructions', i ,
                        'buildingDetailsBeforeCompletion', 'ratePerSquareFeet']).value)).toFixed(2);
                this.securityForm.get(['buildingUnderConstructions', i ,
                    'buildingDetailsBeforeCompletion', 'estimatedCost']).patchValue(beforeEstimatedCost);
                break;
            case 'after':
                const afterEstimatedCost = (Number(this.securityForm.get(['buildingUnderConstructions', i ,
                        'buildingDetailsAfterCompletion', 'valuationArea']).value)
                    * Number(this.securityForm.get(['buildingUnderConstructions', i ,
                        'buildingDetailsAfterCompletion', 'ratePerSquareFeet']).value)).toFixed(2);
                this.securityForm.get(['buildingUnderConstructions', i ,
                    'buildingDetailsAfterCompletion', 'estimatedCost']).patchValue(afterEstimatedCost);
                break;
            case 'landBuilding':
                const landBuildingEstimatedCost = (Number(this.securityForm.get(['landBuilding', i , 'valuationArea']).value)
                    * Number(this.securityForm.get(['landBuilding', i , 'ratePerSquareFeet']).value)).toFixed(2);
                this.securityForm.get(['landBuilding', i , 'estimatedCost']).patchValue(landBuildingEstimatedCost);
                break;
            case 'landBuildingBefore':
                const landBuildingBeforeEstimatedCost = (Number(this.securityForm.get(['landBuildingUnderConstruction', i ,
                        'buildingDetailsBeforeCompletion', 'valuationArea']).value)
                    * Number(this.securityForm.get(['landBuildingUnderConstruction', i ,
                        'buildingDetailsBeforeCompletion', 'ratePerSquareFeet']).value)).toFixed(2);
                this.securityForm.get(['landBuildingUnderConstruction', i ,
                    'buildingDetailsBeforeCompletion', 'estimatedCost']).patchValue(landBuildingBeforeEstimatedCost);
                break;
            case 'landBuildingAfter':
                const landBuildingAfterEstimatedCost = (Number(this.securityForm.get(['landBuildingUnderConstruction', i ,
                        'buildingDetailsAfterCompletion', 'valuationArea']).value)
                    * Number(this.securityForm.get(['landBuildingUnderConstruction', i ,
                        'buildingDetailsAfterCompletion', 'ratePerSquareFeet']).value)).toFixed(2);
                this.securityForm.get(['landBuildingUnderConstruction', i ,
                    'buildingDetailsAfterCompletion', 'estimatedCost']).patchValue(landBuildingAfterEstimatedCost);
                break;
        }
    }

}
