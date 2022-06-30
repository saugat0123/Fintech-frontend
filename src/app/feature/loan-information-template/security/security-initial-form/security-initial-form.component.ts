import {Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
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
import {SecurityRevaluationComponent} from './security-revaluation/security-revaluation.component';
import {SecurityIds} from './SecurityIds';
import {OwnershipTransfer} from '../../../loan/model/ownershipTransfer';
import {RelationshipList} from '../../../loan/model/relationshipList';
import {OwnerKycApplicableComponent} from './owner-kyc-applicable/owner-kyc-applicable.component';
import {NepsePriceInfoService} from '../../../admin/component/nepse/nepse-price-info.service';
import {NepsePriceInfo} from '../../../admin/modal/NepsePriceInfo';
import {DatePipe} from '@angular/common';
import {NumberUtils} from '../../../../@core/utils/number-utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {RoleService} from '../../../admin/component/role-permission/role.service';
import {InsuranceList} from '../../../loan/model/insuranceList';
import {FormUtils} from '../../../../@core/utils/form.utils';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {FixAssetCollateralComponent} from './fix-asset-collateral/fix-asset-collateral.component';
import {DateValidator} from '../../../../@core/validator/date-validator';
import {Province} from '../../../admin/modal/province';
import {District} from '../../../admin/modal/district';
import {MunicipalityVdc} from '../../../admin/modal/municipality_VDC';
import {AddressService} from '../../../../@core/service/baseservice/address.service';
import {CustomerType} from 'src/app/feature/customer/model/customerType';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {CadFileSetupComponent} from '../../../credit-administration/cad-work-flow/cad-work-flow-base/legal-and-disbursement/cad-file-setup/cad-file-setup.component';


@Component({
    selector: 'app-security-initial-form',
    templateUrl: './security-initial-form.component.html',
    styleUrls: ['./security-initial-form.component.scss']
})
export class SecurityInitialFormComponent implements OnInit {
    @Input() formData: string;
    @Input() calendarType: CalendarType;
    @Input() loanTag: string;
    @Input() shareSecurity;
    @Input() customerSecurityId;
    securityEmitValue: string;
    @Input() customerType: CustomerType;
    @Input() customerInfo: CustomerInfoData;

    @ViewChildren('revaluationComponent')
    revaluationComponent: QueryList<SecurityRevaluationComponent>;

    @ViewChildren('revaluationComponentApartment')
    revaluationComponentApartment: QueryList<SecurityRevaluationComponent>;

    @ViewChildren('revaluationComponentLandBuilding')
    revaluationComponentLandBuilding: QueryList<SecurityRevaluationComponent>;

    @ViewChildren('ownerKycApplicable')
    ownerKycApplicable: QueryList<OwnerKycApplicableComponent>;

    @ViewChildren('ownerKycApplicableLandBuilding')
    ownerKycApplicableLandBuilding: QueryList<OwnerKycApplicableComponent>;

    @ViewChildren('ownerKycApplicableHypothecation')
    ownerKycApplicableHypothecation: QueryList<OwnerKycApplicableComponent>;
    @ViewChild('cadFileSetupComponent', {static: false}) cadFileSetupComponent: CadFileSetupComponent;

    securityId = SecurityIds;
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
    securityValuator: SecurityValuator = new SecurityValuator();
    otherBranchcheck = false;
    depositSelected = false;
    isFixedDeposit = false;
    shareSelected = false;
    landBuilding = false;
    underBuildingConstructionChecked = false;
    hypothecationOfStock = false;
    assignments = false;
    securityOther = false;
    corporateGuarantee = false;
    ckeConfig;
    personal = false;
    spinner = false;
    insurancePolicySelected = false;
    assignmentOfReceivable = false;
    selectedSecurity: string;
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
        {key: 'InsurancePolicySecurity', value: 'Insurance Policy Security'},
        {key: 'AssignmentOfReceivables', value: 'Assignment of Receivables'},
        {key: 'LeaseAssignment', value: 'Lease Assignment'},
        {key: 'OtherSecurity', value: 'Other Security'}
    ];

    areaFormat = ['R-A-P-D', 'B-K-D', 'SQF', 'Sq.m'];

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
    typeOfProperty = ['Guthi', 'Lease Hold', 'Free Hold', 'Rajkar', 'Others'];
    designationList = [];
    ownershipTransferEnumPair = OwnershipTransfer.enumObject();
    ownershipTransfers = OwnershipTransfer;
    collateralOwnerRelationshipList: RelationshipList = new RelationshipList();
    ownerKycRelationInfoCheckedForLand = false;
    ownerKycRelationInfoCheckedForLandBuilding = false;
    ownerKycRelationInfoCheckedForHypothecation = false;
    ownerKycApplicableData: any;
    nepsePriceInfo: NepsePriceInfo = new NepsePriceInfo();
    insuranceList: InsuranceList = new InsuranceList();
    insuranceCompanyList = InsuranceList.insuranceCompanyList;
    landOtherBranchChecked = false;

    apartmentOtherBranchChecked = false;
    landBuildingOtherBranchChecked = false;
    vehicleOtherBranchChecked = false;
    plantOtherBranchChecked = false;
    totaldv = 0;
    totalmv = 0;
    totalcv = 0;

    totalLandValueRemarks: any;
    dialogRef: NbDialogRef<any>;
    isOpen = false;
    newOwnerShipTransfer = [];
    provinces: Province[];
    districtList: District [];
    municipalityList: MunicipalityVdc [];
    files = [];
    constructor(private formBuilder: FormBuilder,
                private valuatorToast: ToastService,
                private valuatorService: ValuatorService,
                private branchService: BranchService,
                private shareService: NepseService,
                private nepsePriceInfoService: NepsePriceInfoService,
                private datePipe: DatePipe,
                private toastService: ToastService,
                private roleService: RoleService,
                private nbDialogService: NbDialogService,
                private location: AddressService,
    ) {
    }


    ngOnInit() {

        this.getRoleList();
        this.getProvince();
        this.configEditor();
        this.shareService.findAllNepseCompanyData(this.search).subscribe((list) => {
            this.nepseList = list.detail;
        });
        this.findActiveShareRate();
        this.buildForm();
        this.branchList();
        this.checkLoanTags();
        this.nepsePriceInfoService.getActiveNepsePriceInfoData().subscribe((response) => {
            this.nepsePriceInfo = response.detail;
            this.shareSecurityForm.get('sharePriceDate').patchValue(this.nepsePriceInfo && this.nepsePriceInfo.sharePriceDate ?
                this.datePipe.transform(this.nepsePriceInfo.sharePriceDate, 'yyyy-MM-dd') : undefined);
            this.shareSecurityForm.get('avgDaysForPrice').patchValue(this.nepsePriceInfo && this.nepsePriceInfo.avgDaysForPrice
                ? this.nepsePriceInfo.avgDaysForPrice : undefined);
        }, error => {
            console.error(error);
        });
        if (this.formData !== undefined) {
            if (!ObjectUtil.isEmpty(this.formData['files'])) {
                this.files = JSON.parse(this.formData['files']);
            }
            this.formDataForEdit = this.formData['initialForm'];
            this.selectedArray = this.formData['selectedArray'];
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
            this.setLandValueRemarks(this.formDataForEdit['totalLandValueRemarks']);
            this.setRemark(this.formDataForEdit['remark']);
            this.setHypothecation(this.formDataForEdit['hypothecationOfStock']);
            this.setAssignments(this.formDataForEdit['leaseAssignment']);
            this.setSecurityOther(this.formDataForEdit['otherSecurity']);
            this.setCorporate(this.formDataForEdit['corporateGuarantee']);
            this.setPersonal(this.formDataForEdit['personalGuarantee']);
            this.setInsurancePolicy(this.formDataForEdit['insurancePolicy']);
            this.securityForm.get('vehicleLoanExposure').patchValue(this.formDataForEdit['vehicleLoanExposure']);
            this.setAssignment(this.formDataForEdit['assignmentOfReceivables']);
            this.landOtherBank(this.formData['landOtherBranchChecked']);
            this.apartmentOtheBank(this.formData['apartmentOtherBranchChecked']);
            this.landBuildingOtherBank(this.formData['landBuildingOtherBranchChecked']);
            this.vehicleOtherBank(this.formData['vehicleOtherBranchChecked']);
            this.plantOtherBank(this.formData['plantOtherBranchChecked']);

        } else {
            this.addMoreLand();
            this.addBuilding();
            this.addPlantandMachinery();
            this.addBuildingUnderConstructions();
            this.addVehicleSecurity();
            this.addFixedDeposit();
            this.addLandBuilding();
            this.addHypothecationOfStock();
            this.addAssignments();
            this.addSecurityOther();
            this.addCorporateGuarantee();
            this.addPersonalGuarantee();
            this.addInsurancePolicy();
            this.addAssignment();
        }

        if (ObjectUtil.isEmpty(this.shareSecurity)) {
            this.addShareSecurity();
        } else {
            this.shareSecurityData.id = this.shareSecurity.id;
            this.shareSecurityData.version = this.shareSecurity.version;

            this.setShareSecurityDetails(this.shareSecurity);
        }
        this.updateLandSecurityTotal();
        this.reArrangeEnumType();

    }
    private addSecurityToSelectedArray(): void {
        if (!ObjectUtil.isEmpty(this.customerInfo.selectedArray)) {
            if (this.customerInfo.selectedArray.length > 0) {
                if (this.customerInfo.selectedArray.indexOf('VehicleSecurity') !== -1) {
                    this.selectedArray.push('VehicleSecurity');
                }
                if (this.customerInfo.selectedArray.indexOf('Land and Building Security') !== -1) {
                    this.selectedArray.push('Land and Building Security');
                }
            }
        }
    }

    eventLandSecurity($event) {
        const landDetails = this.securityForm.get('landDetails') as FormArray;
        $event['reValuatedDv'] = $event['reValuatedDv'] == null ? 0 : $event['reValuatedDv'];
        $event['reValuatedFmv'] = $event['reValuatedFmv'] == null ? 0 : $event['reValuatedFmv'];
        $event['reValuatedConsideredValue'] = $event['reValuatedConsideredValue'] == null ? 0 : $event['reValuatedConsideredValue'];

        if (landDetails.controls[$event['index']]['controls']['revaluationData']['value'] == null) {
            landDetails.controls[$event['index']]['controls']['revaluationData']['value'] = {
                isReValuated: true,
                reValuatedDv: 0,
                reValuatedFmv: 0,
                reValuatedConsideredValue: 0
            };
        }
        if ($event['isReValuated']) {
            landDetails.controls[$event['index']]['controls']['revaluationData']['value']['isReValuated'] = Boolean(true);
            landDetails.controls[$event['index']]['controls']['revaluationData']['value']['reValuatedDv'] = $event['reValuatedDv'];
            landDetails.controls[$event['index']]['controls']['revaluationData']['value']['reValuatedFmv'] = $event['reValuatedFmv'];
            landDetails.controls[$event['index']]['controls']['revaluationData']['value']['reValuatedConsideredValue'] = $event['reValuatedConsideredValue'];
        } else {
            landDetails.controls[$event['index']]['controls']['revaluationData']['value']['isReValuated'] = Boolean(false);
            landDetails.controls[$event['index']]['controls']['revaluationData']['value']['reValuatedDv'] = 0;
            landDetails.controls[$event['index']]['controls']['revaluationData']['value']['reValuatedFmv'] = 0;
            landDetails.controls[$event['index']]['controls']['revaluationData']['value']['reValuatedConsideredValue'] = 0;
        }
        this.updateLandSecurityTotal();
    }

    updateLandSecurityTotal() {
        const landDetails = this.securityForm.get('landDetails') as FormArray;
        this.totaldv = 0;
        this.totalmv = 0;
        this.totalcv = 0;
        landDetails['value'].forEach((sec, index) => {
            if (sec['revaluationData'] !== null && sec['revaluationData']['isReValuated']) {
                this.totaldv += Number(sec['revaluationData']['reValuatedDv']);
                this.totalmv += Number(sec['revaluationData']['reValuatedFmv']);
                this.totalcv += Number(sec['revaluationData']['reValuatedConsideredValue']);
            } else {
                this.totaldv += Number(sec['distressValue']);
                this.totalmv += Number(sec['marketValue']);
                this.totalcv += Number(sec['landConsideredValue']);
            }

        });
    }

    buildForm() {
        this.securityForm = this.formBuilder.group({
            buildingDetailsDescription: [undefined],
            description: [undefined],
            totalLandValueRemarks: [undefined],
            landDetails: this.formBuilder.array([]),
            buildingDetails: this.formBuilder.array([]),
            buildingUnderConstructions: this.formBuilder.array([]),
            plantDetails: this.formBuilder.array([]),
            vehicleDetails: this.formBuilder.array([]),
            vehicleLoanExposure: [undefined],
            fixedDepositDetails: this.formBuilder.array([]),
            landBuilding: this.formBuilder.array([]),
            landBuildingDescription: [undefined],
            remark: [undefined],
            hypothecationOfStock: this.formBuilder.array([]),
            corporateGuarantee: this.formBuilder.array([]),
            personalGuarantee: this.formBuilder.array([]),
            insurancePolicy: this.formBuilder.array([]),
            leaseAssignment: this.formBuilder.array([]),
            otherSecurity: this.formBuilder.array([]),
            assignmentOfReceivables: this.formBuilder.array([]),
            files: [undefined]
        });
        this.buildShareSecurityForm();
    }

    buildShareSecurityForm() {
        this.shareSecurityForm = this.formBuilder.group({
            shareSecurityDetails: this.formBuilder.array([]),
            securityOffered: undefined,
            loanShareRate: undefined,
            sharePriceDate: undefined,
            avgDaysForPrice: undefined,
        });
        if (!ObjectUtil.isEmpty(this.shareSecurity)) {
            this.shareSecurityForm.get('securityOffered').patchValue(JSON.parse(this.shareSecurity.data)['securityOffered']);
        }
    }

    valuator(branchId, type: string, index: number) {
        if ((this.landOtherBranchChecked || this.landBuildingOtherBranchChecked || this.apartmentOtherBranchChecked ||
            this.vehicleOtherBranchChecked || this.plantOtherBranchChecked) && ObjectUtil.isEmpty(branchId)) {
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
                    this.securityValuator.landValuator[index] = res.detail.filter(item =>
                        item.valuatingFields.length > 0 ? JSON.parse(item.valuatingField).includes('LAND') :
                            item.valuatingField.includes('LAND') && !item.valuatingField.includes('LAND_BUILDING'));
                });
                break;
            case 'apartment':
                this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
                    this.securityValuator.apartmentValuator[index] = res.detail;
                });
                break;
            case 'vehicle':
                this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
                    this.securityValuator.vehicalValuator[index] = res.detail.filter(item => item.valuatingField.includes('VEHICLE'));
                });
                break;
            case 'plant':
                this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
                    this.securityValuator.plantValuator[index] = res.detail;
                });
                break;
            case  'building':
                this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
                    this.securityValuator.buildingValuator[index] = res.detail.filter(item =>
                        item.valuatingField.includes('LAND_BUILDING'));
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

    setLandValueRemarks(landValueRemarks) {
        this.securityForm.get('totalLandValueRemarks').setValue(landValueRemarks);
    }

    setRemark(remarkData) {
        this.securityForm.get('remark').patchValue(remarkData);
    }

    setLandDetails(currentData) {
        const landDetails = this.securityForm.get('landDetails') as FormArray;
        currentData.forEach((singleData, index) => {
            if (!ObjectUtil.isEmpty(singleData.kycCheckForLand) && singleData.kycCheckForLand === true) {
                this.ownerKycRelationInfoCheckedForLand = true;
            }
            if (this.landOtherBranchChecked && singleData['landBranch']) {
                this.valuator(singleData['landBranch']['id'], 'land', index);
            } else {
                this.valuator(null, 'land', index);

            }
            landDetails.push(
                this.formBuilder.group({
                    owner: [singleData.owner],
                    location: [singleData.location],
                    plotNumber: [singleData.plotNumber],
                    areaFormat: [singleData.areaFormat],
                    area: [singleData.area],
                    marketValue: [singleData.marketValue],
                    distressValue: [singleData.distressValue],
                    description: [singleData.description],
                    landValuator: [singleData.landValuator],
                    landValuatorDate: [ObjectUtil.isEmpty(singleData.landValuatorDate) ? undefined : new Date(singleData.landValuatorDate)],
                    landValuatorRepresentative: [singleData.landValuatorRepresentative],
                    landStaffRepresentativeName: [singleData.landStaffRepresentativeName],
                    landBranch: [singleData.landBranch],
                    landConsideredValue: [ObjectUtil.isEmpty(singleData.landConsideredValue) ? undefined : singleData.landConsideredValue],
                    typeOfProperty: [singleData.typeOfProperty],
                    revaluationData: [singleData.revaluationData],
                    landStaffRepresentativeDesignation: [singleData.landStaffRepresentativeDesignation],
                    landStaffRepresentativeName2: [singleData.landStaffRepresentativeName2],
                    landStaffRepresentativeDesignation2: [singleData.landStaffRepresentativeDesignation2],
                    landSecurityLegalDocumentAddress: [singleData.landSecurityLegalDocumentAddress],
                    ownershipTransferDate: [ObjectUtil.isEmpty(singleData.ownershipTransferDate) ?
                        undefined : new Date(singleData.ownershipTransferDate)],
                    ownershipTransferThrough: [singleData.ownershipTransferThrough],
                    otherOwnershipTransferValue: [singleData.otherOwnershipTransferValue],
                    saleOwnershipTransfer: [singleData.saleOwnershipTransfer],
                    familyTransferOwnershipTransfer: [singleData.familyTransferOwnershipTransfer],
                    giftOwnershipTransfer: [singleData.giftOwnershipTransfer],
                    saleRegistrationAmount: [singleData.saleRegistrationAmount],
                    familyRegistrationAmount: [singleData.familyRegistrationAmount],
                    giftRegistrationAmount: [singleData.giftRegistrationAmount],
                    landCollateralOwnerRelationship: [singleData.landCollateralOwnerRelationship],
                    roadAccessBluePrint: [singleData.roadAccessBluePrint],
                    roadAccessDescribe: [singleData.roadAccessDescribe],
                    ownerKycApplicableData: [singleData.ownerKycApplicableData],
                    landOtherBranchChecked: [singleData.landOtherBranchChecked],
                    kycCheckForLand: [singleData.kycCheckForLand],
                    uuid: [singleData.uuid || this.uuid()],
                    forProposed: [singleData.forProposed],
                    forExisting: [singleData.forExisting],
                    existingAsProposed: [singleData.existingAsProposed],
                })
            );
        });
    }

    setHypothecation(currentData) {
        if (!ObjectUtil.isEmpty(currentData)) {
            const hypothecationDetails = this.securityForm.get('hypothecationOfStock') as FormArray;
            currentData.forEach((singleData) => {
                if (!ObjectUtil.isEmpty(singleData.kycCheckForHypthecation) && singleData.kycCheckForHypthecation === true) {
                    this.ownerKycRelationInfoCheckedForHypothecation = true;
                }
                hypothecationDetails.push(
                    this.formBuilder.group({
                        owner: [singleData.owner],
                        stock: [singleData.stock],
                        value: [singleData.value],
                        otherDetail: [singleData.otherDetail],
                        description: [singleData.description],
                        hypothecationOwnerRelationship: [singleData.hypothecationOwnerRelationship],
                        ownerKycApplicableData: [singleData.ownerKycApplicableData],
                        kycCheckForHypthecation: [singleData.kycCheckForHypthecation],

                    })
                );
            });
        } else {
            this.addHypothecationOfStock();
        }

    }

    setAssignments(currentData) {
        if (!ObjectUtil.isEmpty(currentData)) {
            const assignmentsDetails = this.securityForm.get('leaseAssignment') as FormArray;
            currentData.forEach((singleData) => {
                assignmentsDetails.push(
                    this.formBuilder.group({
                        otherDetail: [singleData.otherDetail],
                    })
                );
            });
        } else {
            this.addAssignments();
        }

    }

    setSecurityOther(currentData) {
        if (!ObjectUtil.isEmpty(currentData)) {
            const securityOtherDetails = this.securityForm.get('otherSecurity') as FormArray;
            currentData.forEach((singleData) => {
                securityOtherDetails.push(
                    this.formBuilder.group({
                        otherDetail: [singleData.otherDetail],
                    })
                );
            });
        } else {
            this.addSecurityOther();
        }

    }


    setCorporate(currentData) {
        if (!ObjectUtil.isEmpty(currentData)) {
            const corporateGuarantee = this.securityForm.get('corporateGuarantee') as FormArray;
            currentData.forEach((singleData) => {
                corporateGuarantee.push(
                    this.formBuilder.group({
                        name: [singleData.name],
                        address: [singleData.address],
                        keyPerson: [singleData.keyPerson],
                        email: [singleData.email],
                        phoneNumber: [singleData.phoneNumber],
                        otherDetail: [singleData.otherDetail],
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
                        name: [singleData.name],
                        address: [singleData.address],
                        email: [singleData.email],
                        phoneNumber: [singleData.phoneNumber],
                        otherDetail: [singleData.otherDetail],
                        owner: [singleData.owner],

                    })
                );
            });
        } else {
            this.addPersonalGuarantee();
        }

    }


    setBuildingDetails(Data) {
        const buildingDetails = this.securityForm.get('buildingDetails') as FormArray;
        Data.forEach((singleData, index) => {
            if (this.apartmentOtherBranchChecked && singleData.apartmentBranch) {
                this.valuator(singleData['apartmentBranch']['id'], 'apartment', index);
            } else {
                this.valuator(null, 'apartment', index);
            }
            buildingDetails.push(
                this.formBuilder.group({
                    buildingName: [singleData.buildingName],
                    buildingDescription: [singleData.buildingDescription],
                    buildArea: [singleData.buildArea],
                    totalCost: [singleData.totalCost],
                    floorName: [singleData.floorName],
                    buildingFairMarketValue: [singleData.buildingFairMarketValue],
                    buildingDistressValue: [singleData.buildingDistressValue],
                    ApartmentValuator: [singleData.ApartmentValuator],
                    ApartmentValuatorDate: [ObjectUtil.isEmpty(singleData.ApartmentValuatorDate) ?
                        undefined : new Date(singleData.ApartmentValuatorDate)],
                    ApartmentValuatorRepresentative: [singleData.ApartmentValuatorRepresentative],
                    ApartmentStaffRepresentativeName: [singleData.ApartmentStaffRepresentativeName],
                    apartmentBranch: [singleData.apartmentBranch],
                    revaluationData: [singleData.revaluationData],
                    apartmentStaffRepresentativeDesignation: [singleData.apartmentStaffRepresentativeDesignation],
                    apartmentStaffRepresentativeDesignation2: [singleData.apartmentStaffRepresentativeDesignation2],
                    apartmentStaffRepresentativeName2: [singleData.apartmentStaffRepresentativeName2],
                    apartmentOtherBranchChecked: [singleData.apartmentOtherBranchChecked],
                    apartmentDeveloperNames: this.formBuilder.array([]),
                    uuid: [singleData.uuid || this.uuid()],
                    forProposed: [singleData.forProposed],
                    forExisting: [singleData.forExisting],
                    existingAsProposed: [singleData.existingAsProposed],
                })
            );
            if (!ObjectUtil.isEmpty(Data)) {
                singleData.apartmentDeveloperNames.forEach(val => {
                    this.addApartmentDeveloper(index);
                });
            }
            this.setApartmentDeveloperNames(singleData, index);
        });
    }

    revaluateCalc(data, formGroup, i) {
        const form = (this.securityForm.get(formGroup) as FormArray);
    }

    setLandBuildingDetails(Data) {
        if (ObjectUtil.isEmpty(Data)) {
            this.addLandBuilding();
            return;
        }
        const buildingDetails = this.securityForm.get('landBuilding') as FormArray;
        Data.forEach((singleData, index) => {
            console.log('singleData', singleData);
            if (!ObjectUtil.isEmpty(singleData.kycCheckForLandAndBuilding) && singleData.kycCheckForLandAndBuilding) {
                this.ownerKycRelationInfoCheckedForLandBuilding = true;
            }
            if (this.otherBranchcheck && singleData.buildingBranch) {
                this.valuator(singleData['buildingBranch']['id'], 'building', index);
            } else {
                this.valuator(null, 'building', index);
            }
            buildingDetails.push(
                this.formBuilder.group({
                    owner: [singleData.owner],
                    location: [singleData.location],
                    plotNumber: [singleData.plotNumber],
                    areaFormat: [singleData.areaFormat],
                    area: [singleData.area],
                    marketValue: [singleData.marketValue],
                    distressValue: [singleData.distressValue],
                    description: [singleData.description],
                    houseNumber: [singleData.houseNumber],
                    totalBuildingArea: [singleData.totalBuildingArea],
                    costPerSquare: [singleData.costPerSquare],
                    totalCost: [singleData.totalCost],
                    landConsideredValue: [singleData.landConsideredValue],
                    typeOfProperty: [singleData.typeOfProperty],
                    buildingValuator: [singleData.buildingValuator],
                    buildingValuatorDate: [ObjectUtil.isEmpty(singleData.buildingValuatorDate) ?
                        undefined : new Date(singleData.buildingValuatorDate)],
                    buildingValuatorRepresentative: [singleData.buildingValuatorRepresentative],
                    buildingStaffRepresentativeName: [singleData.buildingStaffRepresentativeName],
                    buildingBranch: [singleData.buildingBranch],
                    ownershipTransferDate: [ObjectUtil.isEmpty(singleData.ownershipTransferDate) ?
                        undefined : new Date(singleData.ownershipTransferDate)],
                    ownershipTransferThrough: [singleData.ownershipTransferThrough],
                    saleOwnershipTransfer: [singleData.saleOwnershipTransfer],
                    otherOwnershipTransferValue: [singleData.otherOwnershipTransferValue],
                    familyTransferOwnershipTransfer: [singleData.familyTransferOwnershipTransfer],
                    giftOwnershipTransfer: [singleData.giftOwnershipTransfer],
                    saleRegistrationAmount: [singleData.saleRegistrationAmount],
                    familyRegistrationAmount: [singleData.familyRegistrationAmount],
                    giftRegistrationAmount: [singleData.giftRegistrationAmount],
                    ownerConstruction: [singleData.ownerConstruction],
                    locationConstruction: [singleData.locationConstruction],
                    plotNumberConstruction: [singleData.plotNumberConstruction],
                    areaFormatConstruction: [singleData.areaFormatConstruction],
                    areaConstruction: [singleData.areaConstruction],
                    marketValueConstruction: [singleData.marketValueConstruction],
                    distressValueConstruction: [singleData.distressValueConstruction],
                    descriptionConstruction: [singleData.descriptionConstruction],
                    // houseNumberConstruction: [singleData.houseNumberConstruction],
                    totalBuildingAreaConstruction: [singleData.totalBuildingAreaConstruction],
                    costPerSquareConstruction: [singleData.costPerSquareConstruction],
                    totalCostConstruction: [singleData.totalCostConstruction],
                    underConstructionChecked: [singleData.underConstructionChecked],
                    landConsideredValueConstruction: [singleData.landConsideredValueConstruction],
                    // typeOfPropertyConstruction: [singleData.typeOfPropertyConstruction],
                    // modeOfTransferConstruction: [singleData.modeOfTransferConstruction],
                    revaluationData: [singleData.revaluationData],
                    landBuildingStaffRepresentativeDesignation: [singleData.landBuildingStaffRepresentativeDesignation],
                    landBuildingStaffRepresentativeDesignation2: [singleData.landBuildingStaffRepresentativeDesignation2],
                    landBuildingStaffRepresentativeName2: [singleData.landBuildingStaffRepresentativeName2],
                    landAndBuildingSecurityLegalDocumentAddress: [singleData.landAndBuildingSecurityLegalDocumentAddress],
                    landBuildingCollateralOwnerRelationship: [singleData.landBuildingCollateralOwnerRelationship],
                    roadAccessDescribe: [singleData.roadAccessDescribe],
                    roadAccessBluePrint: [singleData.roadAccessBluePrint],
                    ownerKycApplicableData: [singleData.ownerKycApplicableData],
                    progessCost: [singleData.progessCost],
                    landBuildingOtherBranchChecked: [singleData.landBuildingOtherBranchChecked],
                    kycCheckForLandAndBuilding: [singleData.kycCheckForLandAndBuilding],
                    governmentRate: [singleData.governmentRate],
                    dv: [singleData.dv],
                    considerValue: [singleData.considerValue],
                    sheetNo: [singleData.sheetNo],
                    province: [singleData.province],
                    district: [singleData.district],
                    municipalityVdc: [singleData.municipalityVdc],
                    geoLocation: [singleData.geoLocation],
                    addressLine1: [singleData.addressLine1],
                    addressLine2: [singleData.addressLine2],
                    registerOffice: [singleData.registerOffice],
                    uuid: [singleData.uuid || this.uuid()],
                    forProposed: [singleData.forProposed],
                    forExisting: [singleData.forExisting],
                    existingAsProposed: [singleData.existingAsProposed],
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
                        buildingName: [singleData.buildingDetailsBeforeCompletion.buildingName],
                        buildingDescription: [singleData.buildingDetailsBeforeCompletion.buildingDescription],
                        buildArea: [singleData.buildingDetailsBeforeCompletion.buildArea],
                        totalCost: [singleData.buildingDetailsBeforeCompletion.totalCost],
                        floorName: [singleData.buildingDetailsBeforeCompletion.floorName],
                        buildingFairMarketValue: [singleData.buildingDetailsBeforeCompletion.buildingFairMarketValue],
                        buildingDistressValue: [singleData.buildingDetailsBeforeCompletion.buildingDistressValue],

                    }),
                    buildingDetailsAfterCompletion: this.formBuilder.group({
                        buildingName: [singleData.buildingDetailsAfterCompletion.buildingName],
                        buildingDescription: [singleData.buildingDetailsAfterCompletion.buildingDescription],
                        buildArea: [singleData.buildingDetailsAfterCompletion.buildArea],
                        totalCost: [singleData.buildingDetailsAfterCompletion.totalCost],
                        floorName: [singleData.buildingDetailsAfterCompletion.floorName],
                        buildingFairMarketValue: [singleData.buildingDetailsAfterCompletion.buildingFairMarketValue],
                        buildingDistressValue: [singleData.buildingDetailsAfterCompletion.buildingDistressValue],


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
                    buildingName: [undefined],
                    buildingDescription: [undefined],
                    buildArea: [undefined],
                    totalCost: [undefined],
                    floorName: [undefined],
                    buildingFairMarketValue: [undefined],
                    buildingDistressValue: [undefined]
                }),
                buildingDetailsAfterCompletion: this.formBuilder.group({
                    buildingName: [undefined],
                    buildingDescription: [undefined],
                    buildArea: [undefined],
                    totalCost: [undefined],
                    floorName: [undefined],
                    buildingFairMarketValue: [undefined],
                    buildingDistressValue: [undefined]

                })
            })
        );
    }

    setPlantDetails(currentData) {
        const plantDetails = this.securityForm.get('plantDetails') as FormArray;
        currentData.forEach((singleData, index) => {
            if (this.plantOtherBranchChecked && singleData.plantBranch) {
                this.valuator(singleData['plantBranch']['id'], 'plant', index);
            } else {
                this.valuator(null, 'plant', index);
            }
            plantDetails.push(
                this.formBuilder.group({
                    model: [singleData.model],
                    quotation: [singleData.quotation],
                    supplier: [singleData.supplier],
                    downPay: [singleData.downPay],
                    loanExp: [singleData.loanExp],
                    plantMachineryValuator: [singleData.plantMachineryValuator],
                    plantMachineryValuatorDate: [ObjectUtil.isEmpty(singleData.plantMachineryValuatorDate) ?
                        undefined : new Date(singleData.plantMachineryValuatorDate)],
                    plantMachineryValuatorRepresentative: [singleData.plantMachineryValuatorRepresentative],
                    plantMachineryStaffRepresentativeName: [singleData.plantMachineryStaffRepresentativeName],
                    plantBranch: [singleData.plantBranch],
                    plantMachineryStaffRepresentativeDesignation: [singleData.plantMachineryStaffRepresentativeDesignation],
                    plantMachineryStaffRepresentativeDesignation2:
                        [singleData.plantMachineryStaffRepresentativeDesignation2],
                    plantMachineryStaffRepresentativeName2: [singleData.plantMachineryStaffRepresentativeName2],
                    plantOtherBranchChecked: [singleData.plantOtherBranchChecked],
                })
            );
        });
    }

    setInsurancePolicy(currentData) {
        if (!ObjectUtil.isEmpty(currentData)) {
            const insurancePolicy = this.securityForm.get('insurancePolicy') as FormArray;
            currentData.forEach((singleData) => {
                insurancePolicy.push(
                    this.formBuilder.group({
                        insuredAmount: [singleData.insuredAmount],
                        insuranceCompanyName: [singleData.insuranceCompanyName],
                        policyStartDate: [ObjectUtil.isEmpty(singleData.policyStartDate) ?
                            undefined : new Date(singleData.policyStartDate)],
                        maturityDate: [ObjectUtil.isEmpty(singleData.maturityDate) ?
                            undefined : new Date(singleData.maturityDate)],
                        insurancePolicyType: [singleData.insurancePolicyType],
                        surrenderValue: [singleData.surrenderValue],
                        earlySurrenderDate: [ObjectUtil.isEmpty(singleData.earlySurrenderDate) ?
                            undefined : new Date(singleData.earlySurrenderDate)],
                        consideredValue: [singleData.consideredValue],
                        cashBackAmount: [singleData.cashBackAmount],
                    })
                );
            });
        } else {
            this.addInsurancePolicy();
        }
    }

    setAssignment(currentData) {
        if (!ObjectUtil.isEmpty(currentData)) {
            const assignmentDetails = this.securityForm.get('assignmentOfReceivables') as FormArray;
            currentData.forEach((singleData) => {
                assignmentDetails.push(
                    this.formBuilder.group({
                        amount: [singleData.amount],
                        otherDetail: [singleData.otherDetail]
                    })
                );
            });
        } else {
            this.addAssignment();
        }

    }


    change(arraySelected) {
        const selectedSecurity = [];
        this.landSelected = this.vehicleSelected = this.apartmentSelected = this.plantSelected
            = this.underConstructionChecked = this.depositSelected = this.shareSelected = this.landBuilding =
            this.insurancePolicySelected = this.hypothecationOfStock = this.assignmentOfReceivable =
                this.corporateGuarantee = this.personal = this.insurancePolicySelected = this.landOtherBranchChecked =
                    this.apartmentOtherBranchChecked = this.landBuildingOtherBranchChecked = this.vehicleOtherBranchChecked =
                        this.plantOtherBranchChecked = false;
        selectedSecurity.push(arraySelected);
        selectedSecurity.forEach(selectedValue => {
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
                    this.landBuilding = true;
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
                    this.hypothecationOfStock = true;
                    break;
                case 'LeaseAssignment':
                    this.assignments = true;
                    break;
                case 'OtherSecurity':
                    this.securityOther = true;
                    break;
                case 'CorporateGuarantee':
                    this.corporateGuarantee = true;
                    break;
                case 'PersonalGuarantee':
                    this.personal = true;
                    break;
                case 'InsurancePolicySecurity':
                    this.insurancePolicySelected = true;
                    break;
                case 'AssignmentOfReceivables':
                    this.assignmentOfReceivable = true;
                    break;
            }
        });
    }
    clearValidationAtInitialStage() {
        if (this.selectedSecurity === undefined) {
            const landDetailsFormControls = this.securityForm.get('landDetails') as FormArray;
            landDetailsFormControls.controls.forEach(f => {
                f.get('owner').clearValidators();
                f.get('owner').updateValueAndValidity();
                f.get('landConsideredValue').clearValidators();
                f.get('landConsideredValue').updateValueAndValidity();
            });
            const vehicleDetailsFormControls = this.securityForm.get('vehicleDetails') as FormArray;
            vehicleDetailsFormControls.controls.forEach(f => {
                f.get('model').clearValidators();
                f.get('model').updateValueAndValidity();
                f.get('quotationAmount').clearValidators();
                f.get('quotationAmount').updateValueAndValidity();
            });
            const buildingDetailsFormControls = this.securityForm.get('buildingDetails') as FormArray;
            buildingDetailsFormControls.controls.forEach(f => {
                f.get('buildArea').clearValidators();
                f.get('buildArea').updateValueAndValidity();
                f.get('buildingFairMarketValue').clearValidators();
                f.get('buildingFairMarketValue').updateValueAndValidity();
            });
            const plantDetailsFormControls = this.securityForm.get('plantDetails') as FormArray;
            plantDetailsFormControls.controls.forEach(f => {
                f.get('model').clearValidators();
                f.get('model').updateValueAndValidity();
                f.get('quotation').clearValidators();
                f.get('quotation').updateValueAndValidity();
            });
            const fixedDepositDetailsFormControls = this.securityForm.get('fixedDepositDetails') as FormArray;
            fixedDepositDetailsFormControls.controls.forEach(f => {
                f.get('accountNumber').clearValidators();
                f.get('accountNumber').updateValueAndValidity();
                f.get('amount').clearValidators();
                f.get('amount').updateValueAndValidity();
            });
            const hypothecationOfStockFormControls = this.securityForm.get('hypothecationOfStock') as FormArray;
            hypothecationOfStockFormControls.controls.forEach(f => {
                f.get('owner').clearValidators();
                f.get('owner').updateValueAndValidity();
            });
            const corporateGuaranteeFormControls = this.securityForm.get('corporateGuarantee') as FormArray;
            corporateGuaranteeFormControls.controls.forEach(f => {
                f.get('name').clearValidators();
                f.get('name').updateValueAndValidity();
            });
            const personalGuaranteeFormControls = this.securityForm.get('personalGuarantee') as FormArray;
            personalGuaranteeFormControls.controls.forEach(f => {
                f.get('name').clearValidators();
                f.get('name').updateValueAndValidity();
            });
            const insurancePolicyFormControls = this.securityForm.get('insurancePolicy') as FormArray;
            insurancePolicyFormControls.controls.forEach(f => {
                f.get('insuredAmount').clearValidators();
                f.get('insuredAmount').updateValueAndValidity();
                f.get('insuranceCompanyName').clearValidators();
                f.get('insuranceCompanyName').updateValueAndValidity();
            });
            const assignmentFormControls = this.securityForm.get('assignmentOfReceivables') as FormArray;
            assignmentFormControls.controls.forEach(f => {
                f.get('amount').clearValidators();
                f.get('amount').updateValueAndValidity();
            });
            const shareSecurityControls = this.shareSecurityForm.get('shareSecurityDetails') as FormArray;
            shareSecurityControls.controls.forEach( f => {
                f.get('companyName').clearValidators();
                f.get('companyName').updateValueAndValidity();
                f.get('totalShareUnit').clearValidators();
                f.get('totalShareUnit').updateValueAndValidity();
            });
            const landBuildingDetails = this.securityForm.get('landBuilding') as FormArray;
            landBuildingDetails.controls.forEach(f => {
                f.get('owner').clearValidators();
                f.get('owner').updateValueAndValidity();
            });
        }
    }
    clearValidationState() {
        if (this.selectedSecurity === 'LandSecurity') {
            const formControls = this.securityForm.get('landDetails') as FormArray;
            formControls.controls.forEach( f => {
                f.get('owner').setValidators(Validators.required);
                f.get('owner').updateValueAndValidity();
                f.get('landConsideredValue').setValidators(Validators.required);
                f.get('landConsideredValue').updateValueAndValidity();
            });
        } else {
            const formControls = this.securityForm.get('landDetails') as FormArray;
            formControls.controls.forEach( f => {
                f.get('owner').clearValidators();
                f.get('owner').updateValueAndValidity();
                f.get('landConsideredValue').clearValidators();
                f.get('landConsideredValue').updateValueAndValidity();
            });
        }
        if (this.selectedSecurity === 'VehicleSecurity') {
            const formControls = this.securityForm.get('vehicleDetails') as FormArray;
            formControls.controls.forEach( f => {
                f.get('model').setValidators(Validators.required);
                f.get('model').updateValueAndValidity();
                f.get('quotationAmount').setValidators(Validators.required);
                f.get('quotationAmount').updateValueAndValidity();
            });
        } else {
            const formControls = this.securityForm.get('vehicleDetails') as FormArray;
            formControls.controls.forEach( f => {
                f.get('model').clearValidators();
                f.get('model').updateValueAndValidity();
                f.get('quotationAmount').clearValidators();
                f.get('quotationAmount').updateValueAndValidity();
            });
        }
        if (this.selectedSecurity === 'ApartmentSecurity') {
            const formControls = this.securityForm.get('buildingDetails') as FormArray;
            formControls.controls.forEach( f => {
                f.get('buildArea').setValidators(Validators.required);
                f.get('buildArea').updateValueAndValidity();
                f.get('buildingFairMarketValue').setValidators(Validators.required);
                f.get('buildingFairMarketValue').updateValueAndValidity();
            });
        } else {
            const formControls = this.securityForm.get('buildingDetails') as FormArray;
            formControls.controls.forEach( f => {
                f.get('buildArea').clearValidators();
                f.get('buildArea').updateValueAndValidity();
                f.get('buildingFairMarketValue').clearValidators();
                f.get('buildingFairMarketValue').updateValueAndValidity();
            });
        }
        if (this.selectedSecurity === 'PlantSecurity') {
            const formControls = this.securityForm.get('plantDetails') as FormArray;
            formControls.controls.forEach( f => {
                f.get('model').setValidators(Validators.required);
                f.get('model').updateValueAndValidity();
                f.get('quotation').setValidators(Validators.required);
                f.get('quotation').updateValueAndValidity();
            });
        } else {
            const formControls = this.securityForm.get('plantDetails') as FormArray;
            formControls.controls.forEach( f => {
                f.get('model').clearValidators();
                f.get('model').updateValueAndValidity();
                f.get('quotation').clearValidators();
                f.get('quotation').updateValueAndValidity();
            });
        }
        if (this.selectedSecurity === 'FixedDeposit') {
            const formControls = this.securityForm.get('fixedDepositDetails') as FormArray;
            formControls.controls.forEach( f => {
                f.get('accountNumber').setValidators(Validators.required);
                f.get('accountNumber').updateValueAndValidity();
                f.get('amount').setValidators(Validators.required);
                f.get('amount').updateValueAndValidity();
            });
        } else {
            const formControls = this.securityForm.get('fixedDepositDetails') as FormArray;
            formControls.controls.forEach( f => {
                f.get('accountNumber').clearValidators();
                f.get('accountNumber').updateValueAndValidity();
                f.get('amount').clearValidators();
                f.get('amount').updateValueAndValidity();
            });
        }
        if (this.selectedSecurity === 'HypothecationOfStock') {
            const formControls = this.securityForm.get('hypothecationOfStock') as FormArray;
            formControls.controls.forEach( f => {
                f.get('owner').setValidators(Validators.required);
                f.get('owner').updateValueAndValidity();
            });
        } else {
            const formControls = this.securityForm.get('hypothecationOfStock') as FormArray;
            formControls.controls.forEach( f => {
                f.get('owner').clearValidators();
                f.get('owner').updateValueAndValidity();
            });
        }
        if (this.selectedSecurity === 'CorporateGuarantee') {
            const formControls = this.securityForm.get('corporateGuarantee') as FormArray;
            formControls.controls.forEach( f => {
                f.get('name').setValidators(Validators.required);
                f.get('name').updateValueAndValidity();
            });
        } else {
            const formControls = this.securityForm.get('corporateGuarantee') as FormArray;
            formControls.controls.forEach( f => {
                f.get('name').clearValidators();
                f.get('name').updateValueAndValidity();
            });
        }
        if (this.selectedSecurity === 'PersonalGuarantee') {
            const formControls = this.securityForm.get('personalGuarantee') as FormArray;
            formControls.controls.forEach( f => {
                f.get('name').setValidators(Validators.required);
                f.get('name').updateValueAndValidity();
            });
        } else {
            const formControls = this.securityForm.get('personalGuarantee') as FormArray;
            formControls.controls.forEach( f => {
                f.get('name').clearValidators();
                f.get('name').updateValueAndValidity();
            });
        }
        if (this.selectedSecurity === 'InsurancePolicySecurity') {
            const formControls = this.securityForm.get('insurancePolicy') as FormArray;
            formControls.controls.forEach( f => {
                f.get('insuredAmount').setValidators(Validators.required);
                f.get('insuredAmount').updateValueAndValidity();
                f.get('insuranceCompanyName').setValidators(Validators.required);
                f.get('insuranceCompanyName').updateValueAndValidity();
            });
        } else {
            const formControls = this.securityForm.get('insurancePolicy') as FormArray;
            formControls.controls.forEach( f => {
                f.get('insuredAmount').clearValidators();
                f.get('insuredAmount').updateValueAndValidity();
                f.get('insuranceCompanyName').clearValidators();
                f.get('insuranceCompanyName').updateValueAndValidity();
            });
        }
        if (this.selectedSecurity === 'AssignmentOfReceivables') {
            const formControls = this.securityForm.get('assignmentOfReceivables') as FormArray;
            formControls.controls.forEach( f => {
                f.get('amount').setValidators(Validators.required);
                f.get('amount').updateValueAndValidity();
            });
        } else {
            const formControls = this.securityForm.get('assignmentOfReceivables') as FormArray;
            formControls.controls.forEach( f => {
                f.get('amount').clearValidators();
                f.get('amount').updateValueAndValidity();
            });
        }
        if (this.selectedSecurity === 'ShareSecurity') {
            const formControls = this.shareSecurityForm.get('shareSecurityDetails') as FormArray;
            formControls.controls.forEach( f => {
                f.get('companyName').setValidators(Validators.required);
                f.get('companyName').updateValueAndValidity();
                f.get('totalShareUnit').setValidators(Validators.required);
                f.get('totalShareUnit').updateValueAndValidity();
            });
        } else {
            const formControls = this.shareSecurityForm.get('shareSecurityDetails') as FormArray;
            formControls.controls.forEach( f => {
                f.get('companyName').clearValidators();
                f.get('companyName').updateValueAndValidity();
                f.get('totalShareUnit').clearValidators();
                f.get('totalShareUnit').updateValueAndValidity();
            });
        }
        if (this.selectedSecurity === 'Land and Building Security') {
            const formControls = this.securityForm.get('landBuilding') as FormArray;
            formControls.controls.forEach( f => {
                f.get('owner').setValidators(Validators.required);
                f.get('owner').updateValueAndValidity();
            });
        } else {
            const formControls = this.securityForm.get('landBuilding') as FormArray;
            formControls.controls.forEach( f => {
                f.get('owner').clearValidators();
                f.get('owner').updateValueAndValidity();
            });
        }
    }

    hypothecationDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
                owner: [undefined, Validators.required],
                stock: [undefined],
                value: [undefined],
                otherDetail: [undefined],
                description: [undefined],
                hypothecationOwnerRelationship: [undefined],
                ownerKycApplicableData: [undefined],
                kycCheckForHypthecation: [false],
            }
        );
    }

    assignmentsDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
                otherDetail: [undefined],
                ownerKycApplicableData: [undefined],

            }
        );
    }

    securityOtherDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
                otherDetail: [undefined],
            }
        );
    }

    corporateDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
                name: [undefined, Validators.required],
                address: [undefined],
                keyPerson: [undefined],
                email: [undefined],
                phoneNumber: [undefined],
                otherDetail: [undefined],
            }
        );
    }

    personalDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
                name: [undefined, Validators.required],
                address: [undefined],
                email: [undefined],
                phoneNumber: [undefined],
                owner: [undefined],
                otherDetail: [undefined],
            }
        );
    }

    configEditor() {
        this.ckeConfig = Editor.CK_CONFIG;
    }

    landDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            owner: ['', Validators.required],
            location: [''],
            plotNumber: [''],
            areaFormat: [''],
            area: [''],
            marketValue: [''],
            distressValue: [''],
            description: [''],
            landValuator: [undefined],
            landValuatorDate: [undefined],
            landValuatorRepresentative: [undefined],
            landStaffRepresentativeName: [undefined],
            landBranch: [undefined],
            landConsideredValue: [undefined, Validators.required],
            typeOfProperty: [undefined],
            revaluationData: [{isReValuated: false, reValuatedDv: 0, reValuatedFmv: 0, reValuatedConsideredValue: 0}, Validators.required],
            landStaffRepresentativeDesignation: [undefined],
            landStaffRepresentativeName2: [undefined],
            landStaffRepresentativeDesignation2: [undefined],
            landSecurityLegalDocumentAddress: [undefined],
            ownershipTransferDate: undefined,
            ownershipTransferThrough: undefined,
            otherOwnershipTransferValue: undefined,
            saleOwnershipTransfer: undefined,
            familyTransferOwnershipTransfer: undefined,
            giftOwnershipTransfer: undefined,
            saleRegistrationAmount: undefined,
            familyRegistrationAmount: undefined,
            giftRegistrationAmount: undefined,
            landCollateralOwnerRelationship: undefined,
            roadAccessBluePrint: undefined,
            roadAccessDescribe: undefined,
            ownerKycApplicableData: [undefined],
            landOtherBranchChecked: [undefined],
            kycCheckForLand: [false],
            uuid: [this.uuid()],
            forProposed: [undefined],
            forExisting: [undefined],
            existingAsProposed: [undefined],
        });
    }

    buildingDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            buildingName: [''],
            buildingDescription: [''],
            buildArea: ['', Validators.required],
            totalCost: [''],
            floorName: [''],
            buildingFairMarketValue: ['', Validators.required],
            buildingDistressValue: [''],
            buildingDetailsDescription: [''],
            ApartmentValuator: [undefined],
            ApartmentValuatorDate: [undefined],
            ApartmentValuatorRepresentative: [undefined],
            ApartmentStaffRepresentativeName: [undefined],
            apartmentBranch: [undefined],
            revaluationData: [undefined],
            apartmentStaffRepresentativeDesignation: [undefined],
            apartmentStaffRepresentativeDesignation2: [undefined],
            apartmentStaffRepresentativeName2: [undefined],
            apartmentOtherBranchChecked: [undefined],
            apartmentDeveloperNames: this.formBuilder.array([]),
            uuid: [this.uuid()],
            forProposed: [undefined],
            forExisting: [undefined],
            existingAsProposed: [undefined],
        });
    }
    LandBuildingDetailsFormGroup() {
        return this.formBuilder.group({
            owner: [undefined],
            location: undefined,
            plotNumber: [undefined],
            areaFormat: undefined,
            area: undefined,
            marketValue: [undefined],
            distressValue: [undefined],
            description: undefined,
            houseNumber: [undefined],
            totalBuildingArea: [undefined],
            costPerSquare: undefined,
            totalCost: undefined,
            buildingValuator: [undefined],
            buildingValuatorDate: [undefined],
            buildingValuatorRepresentative: [undefined],
            buildingStaffRepresentativeName: [undefined],
            buildingBranch: [undefined],
            landConsideredValue: [undefined],
            typeOfProperty: [undefined],
            ownershipTransferDate: [undefined],
            ownershipTransferThrough: [undefined],
            otherOwnershipTransferValue: undefined,
            saleOwnershipTransfer: [undefined],
            familyTransferOwnershipTransfer: [undefined],
            giftOwnershipTransfer: [undefined],
            saleRegistrationAmount: [undefined],
            familyRegistrationAmount: [undefined],
            giftRegistrationAmount: [undefined],
            ownerConstruction: undefined,
            locationConstruction: undefined,
            plotNumberConstruction: undefined,
            areaFormatConstruction: undefined,
            areaConstruction: undefined,
            marketValueConstruction: undefined,
            distressValueConstruction: undefined,
            descriptionConstruction: undefined,
            // houseNumberConstruction: undefined,
            totalBuildingAreaConstruction: undefined,
            costPerSquareConstruction: undefined,
            totalCostConstruction: undefined,
            landConsideredValueConstruction: [undefined],
            // typeOfPropertyConstruction: [undefined],
            // modeOfTransferConstruction: [undefined],
            underConstructionChecked: undefined,
            revaluationData: [undefined],
            landBuildingStaffRepresentativeDesignation: [undefined],
            landBuildingStaffRepresentativeDesignation2: [undefined],
            landBuildingStaffRepresentativeName2: [undefined],
            landAndBuildingSecurityLegalDocumentAddress: [undefined],
            landBuildingCollateralOwnerRelationship: [undefined],
            roadAccessBluePrint: [undefined],
            roadAccessDescribe: [undefined],
            ownerKycApplicableData: [undefined],
            progessCost: [undefined],
            landBuildingOtherBranchChecked: [undefined],
            kycCheckForLandAndBuilding: [false],
            governmentRate: [undefined],
            dv: [undefined],
            considerValue: [undefined],
            sheetNo: [undefined],
            province: [undefined],
            district: [undefined],
            municipalityVdc: [undefined],
            geoLocation: [undefined],
            addressLine1: [undefined],
            addressLine2: [undefined],
            registerOffice: [undefined],
            uuid: [this.uuid()],
            forProposed: [undefined],
            forExisting: [undefined],
            existingAsProposed: [undefined],
        });
    }

    // Insurance policy form group
    insurancePolicyFormGroup(): FormGroup {
        return this.formBuilder.group({
                insuredAmount: [undefined, Validators.required],
                insuranceCompanyName: [undefined, Validators.required],
                policyStartDate: [undefined],
                maturityDate: [undefined],
                insurancePolicyType: [undefined],
                surrenderValue: [undefined],
                earlySurrenderDate: [undefined],
                consideredValue: [undefined],
                cashBackAmount: [undefined],
            }
        );
    }

    plantDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            model: ['', Validators.required],
            quotation: ['', Validators.required],
            supplier: [''],
            downPay: [''],
            loanExp: [''],
            plantMachineryValuator: [undefined],
            plantMachineryValuatorDate: [undefined],
            plantMachineryValuatorRepresentative: [undefined],
            plantMachineryStaffRepresentativeName: [undefined],
            plantBranch: [undefined],
            plantMachineryStaffRepresentativeDesignation: [undefined],
            plantMachineryStaffRepresentativeDesignation2: [undefined],
            plantMachineryStaffRepresentativeName2: [undefined],
            plantOtherBranchChecked: [undefined],
        });
    }

    assignmentDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
                amount: [undefined, Validators.required ],
                otherDetail: [undefined]
            }
        );
    }

    addApartmentDeveloper(i) {
        const controls = this.securityForm.get(['buildingDetails', i, 'apartmentDeveloperNames']) as FormArray;
        controls.push(this.apartmentDeveloperNameFormGroup());
    }
    apartmentDeveloperNameFormGroup(): FormGroup {
        return this.formBuilder.group({
            apartmentDeveloperName: [undefined],
        });
    }
    setApartmentDeveloperNames(singleData, i) {
        const developerNames = this.securityForm.get(['buildingDetails', i, 'apartmentDeveloperNames']) as FormArray;
        if (!ObjectUtil.isEmpty(singleData) &&
            !ObjectUtil.isEmpty(singleData.apartmentDeveloperNames)) {
            singleData.apartmentDeveloperNames.forEach((val, j) => {
                this.securityForm.get(['buildingDetails', i, 'apartmentDeveloperNames', j, 'apartmentDeveloperName']).patchValue(
                    val.apartmentDeveloperName);
            });
        }
    }

    removeApartmentDeveloperName(i, index) {
        (this.securityForm.get(['buildingDetails', i, 'apartmentDeveloperNames']) as FormArray).removeAt(index);
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

    addAssignments() {
        (this.securityForm.get('leaseAssignment') as FormArray).push(this.assignmentsDetailsFormGroup());
    }

    addSecurityOther() {
        (this.securityForm.get('otherSecurity') as FormArray).push(this.securityOtherDetailsFormGroup());
    }

    addCorporateGuarantee() {
        (this.securityForm.get('corporateGuarantee') as FormArray).push(this.corporateDetailsFormGroup());
    }

    addPersonalGuarantee() {
        (this.securityForm.get('personalGuarantee') as FormArray).push(this.personalDetailsFormGroup());
    }

    addInsurancePolicy() {
        const controls = this.securityForm.get('insurancePolicy') as FormArray;
        if (FormUtils.checkEmptyProperties(controls)) {
            this.toastService.show(new Alert(AlertType.INFO, 'Please Fill All fields To Add More'));
            return;
        }
        (this.securityForm.get('insurancePolicy') as FormArray).push(this.insurancePolicyFormGroup());
    }

    addAssignment() {
        (this.securityForm.get('assignmentOfReceivables') as FormArray).push(this.assignmentDetailsFormGroup());
    }

    removeLandDetails(index: number) {
        (<FormArray>this.securityForm.get('landDetails')).removeAt(index);
        this.updateLandSecurityTotal();
    }

    removeHypothecation(index: number) {
        (<FormArray>this.securityForm.get('hypothecationOfStock')).removeAt(index);
    }

    removeAssignments(index: number) {
        (<FormArray>this.securityForm.get('leaseAssignment')).removeAt(index);
    }

    removeSecurityOther(index: number) {
        (<FormArray>this.securityForm.get('otherSecurity')).removeAt(index);
    }

    removeCorporate(index: number) {
        (<FormArray>this.securityForm.get('corporateGuarantee')).removeAt(index);

    }

    removePersonal(index: number) {
        (<FormArray>this.securityForm.get('personalGuarantee')).removeAt(index);
    }

    removeInsurance(index: number) {
        (<FormArray>this.securityForm.get('insurancePolicy')).removeAt(index);
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

    removeAssignment(index: number) {
        (<FormArray>this.securityForm.get('assignmentOfReceivables')).removeAt(index);
    }

    vehicleDetailsFormGroup(): FormGroup {
        return this.formBuilder.group({
            model: ['', Validators.required],
            registrationNumber: [''],
            registrationDate: [''],
            engineNo: [''],
            chasisNo: [''],
            quotationAmount: ['', Validators.required],
            downPayment: [''],
            remainingAmount: [undefined],
            loanExposure: [''],
            showroomCommission: [''],
            vehicalValuator: [undefined],
            vehicalValuatorDate: [undefined],
            vehicalValuatorRepresentative: [undefined],
            vehicalStaffRepresentativeName: [undefined],
            vehicalBranch: [undefined],
            vehicalStaffRepresentativeDesignation: [undefined],
            vehicaleStaffRepresentativeDesignation2: [undefined],
            vehicaleStaffRepresentativeName2: [undefined],
            showroomAddress: undefined,
            showroomName: undefined,
            ownershipTransferDate: undefined,
            vehicleQuotationDate: undefined,
            vehicleRemarks: [undefined],
            vehicleOtherBranchChecked: [undefined],
            isNew: [undefined],
            vehicleRealiasableAmount: [undefined],
            vehicleRate: [undefined],
            manufactureYear: [undefined],
            discountPrice: [undefined],
            considerValue: [undefined],
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
            if (this.vehicleOtherBranchChecked && singleData.vehicalBranch) {
                this.valuator(singleData['vehicalBranch']['id'], 'vehicle', index);
            } else {
                this.valuator(null, 'vehicle', index);
            }
            vehicleDetails.push(
                this.formBuilder.group({
                    model: [singleData.model],
                    registrationNumber: [singleData.registrationNumber],
                    registrationDate: [ObjectUtil.isEmpty(singleData.registrationDate) ?
                        undefined : new Date(singleData.registrationDate), DateValidator.isValidBefore],
                    engineNo: [singleData.engineNo],
                    chasisNo: [singleData.chasisNo],
                    quotationAmount: [singleData.quotationAmount],
                    remainingAmount: [singleData.remainingAmount],
                    downPayment: [singleData.downPayment],
                    loanExposure: [singleData.loanExposure],
                    showroomCommission: [singleData.showroomCommission],
                    vehicalValuator: [singleData.vehicalValuator],
                    vehicalValuatorDate: [ObjectUtil.isEmpty(singleData.vehicalValuatorDate) ? undefined
                        : new Date(singleData.vehicalValuatorDate)],
                    vehicalValuatorRepresentative: [singleData.vehicalValuatorRepresentative],
                    vehicalStaffRepresentativeName: [singleData.vehicalStaffRepresentativeName],
                    vehicalBranch: [singleData.vehicalBranch],
                    vehicalStaffRepresentativeDesignation: [singleData.vehicalStaffRepresentativeDesignation],
                    vehicaleStaffRepresentativeDesignation2: [singleData.vehicaleStaffRepresentativeDesignation2],
                    vehicaleStaffRepresentativeName2: [singleData.vehicaleStaffRepresentativeName2],
                    showroomAddress: [singleData.showroomAddress],
                    showroomName: [singleData.showroomName],
                    ownershipTransferDate: [ObjectUtil.isEmpty(singleData.ownershipTransferDate) ?
                        undefined : new Date(singleData.ownershipTransferDate)],
                    vehicleQuotationDate: [ObjectUtil.isEmpty(singleData.vehicleQuotationDate) ?
                        undefined : new Date(singleData.vehicleQuotationDate)],
                    vehicleRemarks: [singleData.vehicleRemarks],
                    vehicleOtherBranchChecked: [singleData.vehicleOtherBranchChecked],
                    isNew: [singleData.isNew ? singleData.isNew : undefined],
                    vehicleRealiasableAmount: [singleData.vehicleRealiasableAmount ? singleData.vehicleRealiasableAmount : undefined],
                    vehicleRate: [singleData.vehicleRate ? singleData.vehicleRate : undefined],
                    discountPrice: [singleData.discountPrice ? singleData.discountPrice : undefined],
                    considerValue: [singleData.considerValue ? singleData.considerValue : undefined],
                    manufactureYear: [singleData.vehicleRate ? new Date(singleData.manufactureYear) : undefined],
                })
            );
        });
    }

    get vehicleDetails() {
        return this.securityForm.get('vehicleDetails') as FormArray;
    }

    removeLandBuildingDetails(i) {
        (this.securityForm.get('landBuilding') as FormArray).removeAt(i);
    }

    fixedDepositFormGroup(): FormGroup {
        return this.formBuilder.group({
            receiptNumber: [''],
            amount: ['', Validators.required],
            expiryDate: undefined,
            couponRate: [''],
            beneficiary: [''],
            remarks: [''],
            accountHolderName: undefined,
            accountNumber: [undefined, Validators.required],
            tenureStartDate: undefined
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
                        expiryDate: [ObjectUtil.isEmpty(deposit.expiryDate) ?
                            undefined : new Date(deposit.expiryDate)],
                        couponRate: [deposit.couponRate],
                        beneficiary: [deposit.beneficiary],
                        remarks: [deposit.remarks],
                        accountHolderName: [deposit.accountHolderName],
                        accountNumber: [deposit.accountNumber],
                        tenureStartDate: [ObjectUtil.isEmpty(deposit.tenureStartDate) ?
                            undefined : new Date(deposit.tenureStartDate)]
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
        if (this.selectedSecurity === 'Land And Building Security') {
            const formControls = this.securityForm.get('landBuilding') as FormArray;
            formControls.controls.forEach( f => {
                f.get('owner').setValidators(Validators.required);
                f.get('owner').updateValueAndValidity();
            });
        } else {
            const formControls = this.securityForm.get('landBuilding') as FormArray;
            formControls.controls.forEach( f => {
                f.get('owner').clearValidators();
                f.get('owner').updateValueAndValidity();
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
        return total.toFixed(8);
    }

    get shareField() {
        return this.shareSecurityForm.get('shareSecurityDetails') as FormArray;
    }

    get insuranceDetails() {
        return this.securityForm.get('insurancePolicy') as FormArray;
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
                    consideredValue: [share.consideredValue],
                    priceEarningRatio: [share.priceEarningRatio],
                    priceBookValue: [share.priceBookValue],
                    dividendYeild: [share.dividendYeild],
                    dividendPayoutRatio: [share.dividendPayoutRatio],
                })
            );
        });
    }

    shareSecurityFormGroup(): FormGroup {
        return this.formBuilder.group({
            id: undefined,
            version: undefined,
            companyName: ['', Validators.required],
            companyCode: [undefined],
            shareType: undefined,
            totalShareUnit: ['', Validators.required],
            amountPerUnit: [''],
            total: [''],
            consideredValue: [''],
            priceEarningRatio: [undefined],
            priceBookValue: [undefined],
            dividendYeild: [undefined],
            dividendPayoutRatio: [undefined],
        });
    }

    addShareSecurity() {
        this.shareField.push(this.shareSecurityFormGroup());
    }

    submit() {
        this.submitted = true;
        this.cadFileSetupComponent.save();
        this.pushSecurityNameInArray();
        this.setRevaluationData('landDetails', this.revaluationComponent, SecurityIds.landId);
        this.setRevaluationData('buildingDetails', this.revaluationComponentApartment, SecurityIds.apartmentId);
        this.setRevaluationData('landBuilding', this.revaluationComponentLandBuilding, SecurityIds.land_buildingId);
        this.shareSecurityForm.get('loanShareRate').setValue(this.activeNepseMaster);
        this.shareSecurityData.data = JSON.stringify(this.shareSecurityForm.value);
        this.shareSecurityData.customerShareData = this.getShareDataList();

        if (this.ownerKycRelationInfoCheckedForLand) {
            this.fetchOwnerKycValue('landDetails', this.ownerKycApplicable, SecurityIds.landId);
        }
        if (this.ownerKycRelationInfoCheckedForLandBuilding) {
            this.fetchOwnerKycValue('landBuilding', this.ownerKycApplicableLandBuilding, SecurityIds.land_buildingId);
        }
        if (this.ownerKycRelationInfoCheckedForHypothecation) {
            this.fetchOwnerKycValue('hypothecationOfStock', this.ownerKycApplicableHypothecation, SecurityIds.hypothecation_Id);
        }

    }

    setRevaluationData(controlName, list: QueryList<any>, securityId) {
        this.securityForm.controls[controlName]['controls'].forEach((control, index) => {
            const comp: any = list.filter(item => item.revaluationId === (securityId + index))[0];
            control.get('revaluationData').setValue(comp.formGroup.value);
        });
    }

    fetchOwnerKycValue(controlName, list: QueryList<any>, securityId) {
        this.securityForm.controls[controlName]['controls'].forEach((control, index) => {
            const comp: any = list.filter(item => item.kycId === (securityId + index))[0];
            if (ObjectUtil.isEmpty(comp)) {
                control.get('ownerKycApplicableData').setValue(null);
            } else {
                control.get('ownerKycApplicableData').setValue(comp.ownerKycForm.value);
            }
        });
    }

    private getShareDataList() {
        const list: Array<CustomerShareData> = [];
        this.shareField.controls.forEach(c => list.push(c.value));
        return list;
    }

    private getInsurance() {
        const newlist: Array<CustomerShareData> = [];
        this.insuranceDetails.controls.forEach(c => newlist.push(c.value));
        return newlist;
    }

    calculateBuildUpAreaRate(i, type) {
        switch (type) {
            case 'building':
                const totalBuildRate = (Number(this.securityForm.get(['buildingDetails', i, 'buildArea']).value)
                ).toFixed(8);
                this.securityForm.get(['buildingDetails', i, 'totalCost']).patchValue(totalBuildRate);
                break;
            case 'before':
                const beforeTotalBuildRate = (Number(this.securityForm.get(['buildingUnderConstructions', i,
                    'buildingDetailsBeforeCompletion', 'buildArea']).value)).toFixed(8);
                this.securityForm.get(['buildingUnderConstructions', i,
                    'buildingDetailsBeforeCompletion', 'totalCost']).patchValue(beforeTotalBuildRate);
                break;
            case 'after':
                const afterTotalBuildRate = (Number(this.securityForm.get(['buildingUnderConstructions', i,
                    'buildingDetailsAfterCompletion', 'buildArea']).value)).toFixed(8);
                this.securityForm.get(['buildingUnderConstructions', i,
                    'buildingDetailsAfterCompletion', 'totalCost']).patchValue(afterTotalBuildRate);
                break;
            case 'landBuilding':
                const landBuildingTotalBuildRate = (Number(this.securityForm.get(['landBuilding', i, 'buildArea']).value)).toFixed(8);
                this.securityForm.get(['landBuilding', i, 'totalCost']).patchValue(landBuildingTotalBuildRate);
                break;
            case 'landBuildingBefore':
                const landBuildingBeforeTotalBuildRate = (Number(this.securityForm.get(['landBuildingUnderConstruction', i,
                    'buildingDetailsBeforeCompletion', 'buildArea']).value)).toFixed(8);
                this.securityForm.get(['landBuildingUnderConstruction', i,
                    'buildingDetailsBeforeCompletion', 'totalCost']).patchValue(landBuildingBeforeTotalBuildRate);
                break;
            case 'landBuildingAfter':
                const landBuildingAfterTotalBuildRate = (Number(this.securityForm.get(['landBuildingUnderConstruction', i,
                    'buildingDetailsAfterCompletion', 'buildArea']).value)).toFixed(8);
                this.securityForm.get(['landBuildingUnderConstruction', i,
                    'buildingDetailsAfterCompletion', 'totalCost']).patchValue(landBuildingAfterTotalBuildRate);
                break;
        }
    }






    resetOtherTransferParameter(formArray, index: number, resetAmountOnly: boolean) {
        this.securityForm.get([formArray, index, 'saleRegistrationAmount']).patchValue(undefined);
        this.securityForm.get([formArray, index, 'familyRegistrationAmount']).patchValue(undefined);
        this.securityForm.get([formArray, index, 'giftRegistrationAmount']).patchValue(undefined);
        if (resetAmountOnly) {
            return;
        }
        this.securityForm.get([formArray, index, 'saleOwnershipTransfer']).patchValue(undefined);
        this.securityForm.get([formArray, index, 'familyTransferOwnershipTransfer']).patchValue(undefined);
        this.securityForm.get([formArray, index, 'giftOwnershipTransfer']).patchValue(undefined);

    }

    ownerKycRelationInfoCheck(kycCheck, kycCheckId, index) {
        if (kycCheckId === 'land') {
            this.ownerKycRelationInfoCheckedForLand = true;
        }
        if (kycCheckId === 'land_building') {
            this.ownerKycRelationInfoCheckedForLandBuilding = true;
        }
        if (kycCheckId === 'hypothecation') {
            this.ownerKycRelationInfoCheckedForHypothecation = true;
        }
    }

    vehicleRemainingAmount(index: number) {
        const v = this.vehicleDetails.at(index);
        v.get('remainingAmount').setValue(v.get('quotationAmount').value - v.get('downPayment').value);
    }

    get totalVehicleExposure() {
        let totalRemaining = 0;
        let totalValuation = 0;
        let exposures = 0;
        this.vehicleDetails.controls.forEach((c: AbstractControl) => {
            totalRemaining += c.get('remainingAmount').value;
            totalValuation += c.get('quotationAmount').value;
        });
        exposures = NumberUtils.isNumber((totalRemaining / totalValuation) * 100);
        this.securityForm.get('vehicleLoanExposure').setValue(exposures);
        return exposures;
    }

    getRoleList() {
        this.spinner = true;
        this.roleService.getAll().subscribe(res => {
            this.designationList = res.detail;
            this.spinner = false;
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Error While Fetching List'));
            this.spinner = false;
        });
    }

    private landOtherBank(checkedStatus) {
        if (checkedStatus) {
            this.landOtherBranchChecked = true;
        } else {
            this.landOtherBranchChecked = false;
        }
    }

    landBuildingOtherBank(checkStatus) {
        if (checkStatus) {
            this.landBuildingOtherBranchChecked = true;
        } else {
            this.landBuildingOtherBranchChecked = false;
        }
    }

    apartmentOtheBank(checkStatus) {
        if (checkStatus) {
            this.apartmentOtherBranchChecked = true;
        } else {
            this.apartmentOtherBranchChecked = false;
        }
    }

    vehicleOtherBank(checkStatus) {
        if (checkStatus) {
            this.vehicleOtherBranchChecked = false;
        } else {
            this.vehicleOtherBranchChecked = true;
        }
    }

    plantOtherBank(checkStatus) {
        if (checkStatus) {
            this.plantOtherBranchChecked = false;
        } else {
            this.plantOtherBranchChecked = true;
        }
    }

    public close() {
        if (this.isOpen) {
            this.dialogRef.close();
            this.isOpen = false;
        }
    }

    openSiteVisitModel(security: string,  uuid?: string) {
        this.close();
        const context = {
            securityId: this.customerSecurityId,
            security: security,
            uuid: uuid
        };
        this.dialogRef = this.nbDialogService.open(FixAssetCollateralComponent, {
            context,
            closeOnBackdropClick: false,
            hasBackdrop: false,
            hasScroll: true
        });
        this.isOpen = true;
    }

    reArrangeEnumType() {
        const other = this.ownershipTransferEnumPair.filter(value => value.value.toString() === 'Other');
        const index = this.ownershipTransferEnumPair.indexOf(other[0]);
        this.ownershipTransferEnumPair.splice(index, 1);
        this.newOwnerShipTransfer = this.ownershipTransferEnumPair.concat(other);
    }

    public resetSecurityForm(event): void {
        const securityIndex = this.selectedArray.indexOf(event.securityName);
        // if (securityIndex > -1) {
        //     this.selectedArray.splice(securityIndex, 1);
        // }
        let index = 1;
        if (event.formArrayName === 'shareSecurityDetails') {
            const shareSecurityFormControl = this.shareSecurityForm.get(event.formArrayName) as FormArray;
            shareSecurityFormControl.controls.forEach(f => {
                // f.reset();
                f.clearValidators();
                f.updateValueAndValidity();
                index++;
            });
            // for (let i = 1; i <= index; i++) {
            shareSecurityFormControl.removeAt(event.index);
            //     index--;
            //     i--;
            // }
            if (shareSecurityFormControl.length < 1) {
                this.selectedArray.splice(securityIndex, 1);
            }
        } else {
            const formControl = this.securityForm.get(event.formArrayName) as FormArray;
            formControl.controls.forEach(f => {
                // f.reset();
                f.clearValidators();
                f.updateValueAndValidity();
                index++;
            });
            // for (let i = 1; i <= index; i++) {
            //     formControl.removeAt(i);
            //     index--;
            //     i--;
            // }
            formControl.removeAt(event.index);
            if (formControl.length < 1) {
                this.selectedArray.splice(securityIndex, 1);
            }
        }
        this.toastService.show(new Alert(AlertType.INFO, 'Please save security to make changes'));
    }

    private pushSecurityNameInArray(): void {
        const landDetails = this.securityForm.get('landDetails') as FormArray;
        landDetails.controls.forEach(f => {
            const value = f.value.owner || f.value.considerValue || f.value.fairMarketValue;
            if (!ObjectUtil.isEmpty(value) && this.selectedArray !== undefined &&
                this.selectedArray.indexOf('LandSecurity') === -1) {
                this.selectedArray.push('LandSecurity');
            }
        });
        const vehicleDetails = this.securityForm.get('vehicleDetails') as FormArray;
        vehicleDetails.controls.forEach(f => {
            const value = f.value.model  || f.value.registrationNumber || f.value.engineNo;
            if (!ObjectUtil.isEmpty(value) && this.selectedArray !== undefined &&
                this.selectedArray.indexOf('VehicleSecurity') === -1) {
                this.selectedArray.push('VehicleSecurity');
            }
        });
        const buildingDetails = this.securityForm.get('buildingDetails') as FormArray;
        buildingDetails.controls.forEach(f => {
            const value = f.value.buildArea || f.value.buildingFairMarketValue || f.value.buildingFairMarketValue ||
                f.value.buildingDistressValue;
            if (!ObjectUtil.isEmpty(value) && this.selectedArray !== undefined &&
                this.selectedArray.indexOf('ApartmentSecurity') === -1) {
                this.selectedArray.push('ApartmentSecurity');
            }
        });
        const landBuilding = this.securityForm.get('landBuilding') as FormArray;
        landBuilding.controls.forEach(f => {
            const value = f.value.owner || f.value.landConsideredValue || f.value.marketValue;
            if (!ObjectUtil.isEmpty(value) && this.selectedArray !== undefined &&
                this.selectedArray.indexOf('Land and Building Security') === -1) {
                this.selectedArray.push('Land and Building Security');
            }
        });
        const plantDetails = this.securityForm.get('plantDetails') as FormArray;
        plantDetails.controls.forEach(f => {
            const value = f.value.model || f.value.quotation || f.value.supplier
                || f.value.downPay || f.value.loanExp;
            if (!ObjectUtil.isEmpty(value) && this.selectedArray !== undefined &&
                this.selectedArray.indexOf('PlantSecurity') === -1) {
                this.selectedArray.push('PlantSecurity');
            }
        });
        const fixedDepositDetails = this.securityForm.get('fixedDepositDetails') as FormArray;
        fixedDepositDetails.controls.forEach(f => {
            const value = f.value.accountNumber || f.value.amount || f.value.receiptNumber
                || f.value.accountHolderName;
            if (!ObjectUtil.isEmpty(value) && this.selectedArray !== undefined &&
                this.selectedArray.indexOf('FixedDeposit') === -1) {
                this.selectedArray.push('FixedDeposit');
            }
        });
        const hypothecationOfStock = this.securityForm.get('hypothecationOfStock') as FormArray;
        hypothecationOfStock.controls.forEach(f => {
            const value = f.value.owner || f.value.description || f.value.stock
                || f.value.value || f.value.otherDetail;
            if (!ObjectUtil.isEmpty(value) && this.selectedArray !== undefined &&
                this.selectedArray.indexOf('HypothecationOfStock') === -1) {
                this.selectedArray.push('HypothecationOfStock');
            }
        });
        const corporateGuarantee = this.securityForm.get('corporateGuarantee') as FormArray;
        corporateGuarantee.controls.forEach(f => {
            const value = f.value.name || f.value.address || f.value.keyPerson || f.value.otherDetail;
            if (!ObjectUtil.isEmpty(value) && this.selectedArray !== undefined &&
                this.selectedArray.indexOf('CorporateGuarantee') === -1) {
                this.selectedArray.push('CorporateGuarantee');
            }
        });
        const personalGuarantee = this.securityForm.get('personalGuarantee') as FormArray;
        personalGuarantee.controls.forEach(f => {
            const value = f.value.name || f.value.address || f.value.otherDetail;
            if (!ObjectUtil.isEmpty(value) && this.selectedArray !== undefined &&
                this.selectedArray.indexOf('PersonalGuarantee') === -1) {
                this.selectedArray.push('PersonalGuarantee');
            }
        });
        const insurancePolicy = this.securityForm.get('insurancePolicy') as FormArray;
        insurancePolicy.controls.forEach(f => {
            const value = f.value.insuredAmount || f.value.insuranceCompanyName
                || f.value.surrenderValue || f.value.consideredValue || f.value.cashBackAmount;
            if (!ObjectUtil.isEmpty(value) && this.selectedArray !== undefined &&
                this.selectedArray.indexOf('InsurancePolicySecurity') === -1) {
                this.selectedArray.push('InsurancePolicySecurity');
            }
        });
        const assignmentOfReceivables = this.securityForm.get('assignmentOfReceivables') as FormArray;
        assignmentOfReceivables.controls.forEach(f => {
            const value = f.value.amount || f.value.otherDetail;
            if (!ObjectUtil.isEmpty(value) && this.selectedArray !== undefined &&
                this.selectedArray.indexOf('AssignmentOfReceivables') === -1) {
                this.selectedArray.push('AssignmentOfReceivables');
            }
        });
        const shareSecurityDetails = this.shareSecurityForm.get('shareSecurityDetails') as FormArray;
        shareSecurityDetails.controls.forEach(f => {
            const value = f.value.companyName || f.value.totalShareUnit;
            if (!ObjectUtil.isEmpty(value) && this.selectedArray !== undefined &&
                this.selectedArray.indexOf('ShareSecurity') === -1) {
                this.selectedArray.push('ShareSecurity');
            }
        });
        const leaseAssignment = this.securityForm.get('leaseAssignment') as FormArray;
        leaseAssignment.controls.forEach(f => {
            const value = f.get('otherDetail').value;
            if (!ObjectUtil.isEmpty(value) && this.selectedArray !== undefined &&
                this.selectedArray.indexOf('LeaseAssignment') === -1) {
                this.selectedArray.push('LeaseAssignment');
            }
        });
        const otherSecurity = this.securityForm.get('otherSecurity') as FormArray;
        otherSecurity.controls.forEach(f => {
            const value = f.get('otherDetail').value;
            if (!ObjectUtil.isEmpty(value) && this.selectedArray !== undefined &&
                this.selectedArray.indexOf('OtherSecurity') === -1) {
                this.selectedArray.push('OtherSecurity');
            }
        });
    }

    getProvince() {
        this.location.getProvince().subscribe((res: any) => {
            this.provinces = res.detail;
        });
    }

    getDistrict(province: Province) {
        this.location.getDistrictByProvince(province).subscribe((res: any) => {
            this.districtList = res.detail;
        });
    }

    getMunicipality(district: District) {
        this.location.getMunicipalityVDCByDistrict(district).subscribe((res: any) => {
            this.municipalityList = res.detail;
        });
    }
    private uuid(): string {
        // tslint:disable-next-line:no-bitwise
        let firstPart: any = (Math.random() * 46656) | 0;
        // tslint:disable-next-line:no-bitwise
        let secondPart: any = (Math.random() * 46656) | 0;
        firstPart = ('000' + firstPart.toString(36)).slice(-3);
        secondPart = ('000' + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    }
    setFiles(event) {
        this.files = event;
    }
}
