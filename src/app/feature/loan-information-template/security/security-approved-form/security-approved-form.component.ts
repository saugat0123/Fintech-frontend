import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {OwnerKycApplicableComponent} from '../security-initial-form/owner-kyc-applicable/owner-kyc-applicable.component';
import {SecurityIds} from '../security-initial-form/SecurityIds';
import {AbstractControl, FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {SecurityValuator} from '../../../loan/model/securityValuator';
import {ValuatingField} from '../../../admin/modal/valuatingField';
import {ShareType} from '../../../loan/model/ShareType';
import {NepseMaster} from '../../../admin/modal/NepseMaster';
import {Nepse} from '../../../admin/modal/nepse';
import {ShareSecurity} from '../../../admin/modal/shareSecurity';
import {OwnershipTransfer} from '../../../loan/model/ownershipTransfer';
import {RelationshipList} from '../../../loan/model/relationshipList';
import {NepsePriceInfo} from '../../../admin/modal/NepsePriceInfo';
import {InsuranceList} from '../../../loan/model/insuranceList';
import {environment} from '../../../../../environments/environment';
import {Clients} from '../../../../../environments/Clients';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {ToastService} from '../../../../@core/utils';
import {ValuatorService} from '../../../admin/component/valuator/valuator.service';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {NepseService} from '../../../admin/component/nepse/nepse.service';
import {NepsePriceInfoService} from '../../../admin/component/nepse/nepse-price-info.service';
import {DatePipe} from '@angular/common';
import {RoleService} from '../../../admin/component/role-permission/role.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {Editor} from '../../../../@core/utils/constants/editor';
import {FormUtils} from '../../../../@core/utils/form.utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {DateValidator} from '../../../../@core/validator/date-validator';
import {LoanTag} from '../../../loan/model/loanTag';
import {NumberUtils} from '../../../../@core/utils/number-utils';
import {FixAssetCollateralComponent} from '../security-initial-form/fix-asset-collateral/fix-asset-collateral.component';

@Component({
  selector: 'app-security-approved-form',
  templateUrl: './security-approved-form.component.html',
  styleUrls: ['./security-approved-form.component.scss']
})
export class SecurityApprovedFormComponent implements OnInit {
  @Input() formData: string;
  @Input() calendarType: CalendarType;
  @Input() loanTag: string;
  @Input() shareSecurity;
  @Input() customerSecurityId;
  @Input() approvedData: string;
  @Input() approvedShareData: string;
  @Input() disable;

  @ViewChildren('ownerKycApplicable')
  ownerKycApplicable: QueryList<OwnerKycApplicableComponent>;

  @ViewChildren('ownerKycApplicableLandBuilding')
  ownerKycApplicableLandBuilding: QueryList<OwnerKycApplicableComponent>;

  @ViewChildren('ownerKycApplicableHypothecation')
  ownerKycApplicableHypothecation: QueryList<OwnerKycApplicableComponent>;

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
  valuatingFieldEnum = ValuatingField;
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
    {key: 'OtherSecurity', value: 'Other Security'},
  ];

  ownershipType = [
    {key: 'Single', value: 'Single'},
    {key: 'Joint', value: 'Joint'},
    {key: 'Institutional', value: 'Institutional'}
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
  client = environment.client;
  clientName = Clients;
  dialogRef: NbDialogRef<any>;
  isOpen = false;
  newOwnerShipTransfer = [];

  constructor(private formBuilder: FormBuilder,
              private valuatorToast: ToastService,
              private valuatorService: ValuatorService,
              private branchService: BranchService,
              private shareService: NepseService,
              private nepsePriceInfoService: NepsePriceInfoService,
              private datePipe: DatePipe,
              private toastService: ToastService,
              private roleService: RoleService,
              private nbDialogService: NbDialogService) {
  }


  ngOnInit() {
    this.getRoleList();
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
      const date = new Date(this.nepsePriceInfo.sharePriceDate);
      this.shareSecurityForm.get('sharePriceDate').patchValue(date);
      this.shareSecurityForm.get('avgDaysForPrice').patchValue(this.nepsePriceInfo && this.nepsePriceInfo.avgDaysForPrice
          ? this.nepsePriceInfo.avgDaysForPrice : undefined);
    }, error => {
      console.error(error);
    });
    if (!ObjectUtil.isEmpty(this.approvedData)) {
      this.formDataForEdit = this.approvedData['initialForm'];
      this.selectedArray = this.approvedData['selectedArray'];
      this.underConstruction(this.approvedData['underConstructionChecked']);
      this.underBuildingConstruction(this.approvedData['underBuildingConstructionChecked']);
      this.otherBranch(this.approvedData['otherBranchcheck']);
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
      this.landOtherBank(this.approvedData['landOtherBranchChecked']);
      this.apartmentOtheBank(this.approvedData['apartmentOtherBranchChecked']);
      this.landBuildingOtherBank(this.approvedData['landBuildingOtherBranchChecked']);
      this.vehicleOtherBank(this.approvedData['vehicleOtherBranchChecked']);
      this.plantOtherBank(this.approvedData['plantOtherBranchChecked']);

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

  updateLandSecurityTotal() {
    const landDetails = this.securityForm.get('landDetails') as FormArray;
    this.totaldv = 0;
    this.totalmv = 0;
    this.totalcv = 0;
    landDetails['value'].forEach((sec, index) => {
          this.totaldv += Number(sec['distressValue']);
          this.totalmv += Number(sec['marketValue']);
          this.totalcv += Number(sec['landConsideredValue']);
        }
    );
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

    });
    this.buildShareSecurityForm();
  }
  buildShareSecurityForm() {
    this.shareSecurityForm = this.formBuilder.group({
      shareSecurityDetails: this.formBuilder.array([]),
      securityOffered: undefined,
      loanShareRate: undefined,
      sharePriceDate: [undefined],
      avgDaysForPrice: undefined,
    });
    if (!ObjectUtil.isEmpty(this.shareSecurity)) {
      if (!ObjectUtil.isEmpty(this.shareSecurity.approvedData)) {
        this.shareSecurityForm.get('securityOffered').patchValue(JSON.parse(this.shareSecurity.approvedData)['securityOffered']);
      }
    }
  }

  valuator(branchId, type: string, index: number) {
    if ((this.landOtherBranchChecked || this.landBuildingOtherBranchChecked || this.apartmentOtherBranchChecked ||
        this.vehicleOtherBranchChecked || this.plantOtherBranchChecked) && ObjectUtil.isEmpty(branchId)) {
      return;
    }

    const valuatorSearch = {
      'branchIds': LocalStorageUtil.getStorage().branch,
      'valuatingField' : ValuatingField.getKeyByValue(type)
    };
    if (!ObjectUtil.isEmpty(branchId)) {
      valuatorSearch.branchIds = JSON.stringify(branchId);
    }
    switch (type) {
      case this.valuatingFieldEnum.LAND:
        this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
          this.securityValuator.landValuator[index] = res.detail;
        });
        break;
      case this.valuatingFieldEnum.VEHICLE:
        this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
          this.securityValuator.vehicalValuator[index] = res.detail;
        });
        break;
      case this.valuatingFieldEnum.PLANT_MACHINARY:
        this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
          this.securityValuator.plantValuator[index] = res.detail;
        });
        break;
      case  this.valuatingFieldEnum.LAND_BUILDING:
        this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
          this.securityValuator.buildingValuator[index] = res.detail;
          this.securityValuator.apartmentValuator[index] = res.detail;
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
        this.valuator(singleData['landBranch']['id'], this.valuatingFieldEnum.LAND, index);
      } else {
        this.valuator(null, this.valuatingFieldEnum.LAND, index);

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
            ownershipType: [singleData.ownershipType],
            roadAccessBluePrint: [singleData.roadAccessBluePrint],
            roadAccessDescribe: [singleData.roadAccessDescribe],
            ownerKycApplicableData: [singleData.ownerKycApplicableData],
            landOtherBranchChecked: [singleData.landOtherBranchChecked],
            kycCheckForLand: [singleData.kycCheckForLand],
            landRate: [singleData.landRate],
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
        this.valuator(singleData['apartmentBranch']['id'], this.valuatingFieldEnum.LAND_BUILDING, index);
      } else {
        this.valuator(null, this.valuatingFieldEnum.LAND_BUILDING, index);
      }
      buildingDetails.push(
          this.formBuilder.group({
            buildingName: [singleData.buildingName],
            buildingDescription: [singleData.buildingDescription],
            buildArea: [singleData.buildArea],
            buildRate: [singleData.buildRate],
            totalCost: [singleData.totalCost],
            floorName: [singleData.floorName],
            valuationArea: [singleData.valuationArea],
            ratePerSquareFeet: [singleData.ratePerSquareFeet],
            estimatedCost: [singleData.estimatedCost],
            waterSupply: [singleData.waterSupply],
            sanitation: [singleData.sanitation],
            electrification: [singleData.electrification],
            buildingTotalCost: [singleData.buildingTotalCost],
            buildingFairMarketValue: [singleData.buildingFairMarketValue],
            buildingDistressValue: [singleData.buildingDistressValue],
            electrificationPercent: [singleData.electrificationPercent],
            waterSupplyPercent: [singleData.waterSupplyPercent],
            sanitationPercent: [singleData.sanitationPercent],
            ApartmentValuator: [singleData.ApartmentValuator],
            ApartmentValuatorDate: [ObjectUtil.isEmpty(singleData.ApartmentValuatorDate) ?
                undefined : new Date(singleData.ApartmentValuatorDate)],
            ApartmentValuatorRepresentative: [singleData.ApartmentValuatorRepresentative],
            ApartmentStaffRepresentativeName: [singleData.ApartmentStaffRepresentativeName],
            apartmentBranch: [singleData.apartmentBranch],
            apartmentStaffRepresentativeDesignation: [singleData.apartmentStaffRepresentativeDesignation],
            apartmentStaffRepresentativeDesignation2: [singleData.apartmentStaffRepresentativeDesignation2],
            apartmentStaffRepresentativeName2: [singleData.apartmentStaffRepresentativeName2],
            apartmentOtherBranchChecked: [singleData.apartmentOtherBranchChecked],
            proposedOwner: [singleData.proposedOwner],
            apartmentRate: [singleData.apartmentRate],
            buildingReliasableValue: [singleData.buildingReliasableValue],
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
    Data.forEach((singleData, index) => {
      if (!ObjectUtil.isEmpty(singleData.kycCheckForLandAndBuilding) && singleData.kycCheckForLandAndBuilding) {
        this.ownerKycRelationInfoCheckedForLandBuilding = true;
      }
      if (this.otherBranchcheck && singleData.buildingBranch) {
        this.valuator(singleData['buildingBranch']['id'], this.valuatingFieldEnum.LAND_BUILDING, index);
      } else {
        this.valuator(null, this.valuatingFieldEnum.LAND_BUILDING, index);
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
            totalBuildingAreaConstruction: [singleData.totalBuildingAreaConstruction],
            costPerSquareConstruction: [singleData.costPerSquareConstruction],
            totalCostConstruction: [singleData.totalCostConstruction],
            underConstructionChecked: [singleData.underConstructionChecked],
            landConsideredValueConstruction: [singleData.landConsideredValueConstruction],
            landBuildingStaffRepresentativeDesignation: [singleData.landBuildingStaffRepresentativeDesignation],
            landBuildingStaffRepresentativeDesignation2: [singleData.landBuildingStaffRepresentativeDesignation2],
            landBuildingStaffRepresentativeName2: [singleData.landBuildingStaffRepresentativeName2],
            landAndBuildingSecurityLegalDocumentAddress: [singleData.landAndBuildingSecurityLegalDocumentAddress],
            landBuildingCollateralOwnerRelationship: [singleData.landBuildingCollateralOwnerRelationship],
            ownershipTypeForLandAndBuilding: [singleData.ownershipTypeForLandAndBuilding],
            roadAccessDescribe: [singleData.roadAccessDescribe],
            roadAccessBluePrint: [singleData.roadAccessBluePrint],
            ownerKycApplicableData: [singleData.ownerKycApplicableData],
            progessCost: [singleData.progessCost],
            landBuildingOtherBranchChecked: [singleData.landBuildingOtherBranchChecked],
            kycCheckForLandAndBuilding: [singleData.kycCheckForLandAndBuilding],
            landBuildingRate: [singleData.landBuildingRate],
            landbuildingUnderRate: [singleData.landbuildingUnderRate],
            totalLandRealisableValue: [singleData.totalLandRealisableValue],
            apartmentDistressValue:  [singleData.apartmentDistressValue],
            apartmentRate:  [singleData.apartmentRate],
            totalApartmentRealisableValue:  [singleData.totalApartmentRealisableValue],
          })
      );
    });
  }


  setBuildingUnderConstructions(currentData) {
    if (!ObjectUtil.isEmpty(currentData)) {
      const underConstruct = this.securityForm.get('buildingUnderConstructions') as FormArray;
      currentData.forEach(singleData => {
        underConstruct.push(
            this.formBuilder.group({
              buildingDetailsBeforeCompletion: this.formBuilder.group({
                buildingName: [singleData.buildingDetailsBeforeCompletion.buildingName],
                buildingDescription: [singleData.buildingDetailsBeforeCompletion.buildingDescription],
                buildArea: [singleData.buildingDetailsBeforeCompletion.buildArea],
                buildRate: [singleData.buildingDetailsBeforeCompletion.buildRate],
                totalCost: [singleData.buildingDetailsBeforeCompletion.totalCost],
                floorName: [singleData.buildingDetailsBeforeCompletion.floorName],
                valuationArea: [singleData.buildingDetailsBeforeCompletion.valuationArea],
                ratePerSquareFeet: [singleData.buildingDetailsBeforeCompletion.ratePerSquareFeet],
                estimatedCost: [singleData.buildingDetailsBeforeCompletion.estimatedCost],
                waterSupply: [singleData.buildingDetailsBeforeCompletion.waterSupply],
                sanitation: [singleData.buildingDetailsBeforeCompletion.sanitation],
                electrification: [singleData.buildingDetailsBeforeCompletion.electrification],
                buildingTotalCost: [singleData.buildingDetailsBeforeCompletion.buildingTotalCost],
                buildingFairMarketValue: [singleData.buildingDetailsBeforeCompletion.buildingFairMarketValue],
                buildingDistressValue: [singleData.buildingDetailsBeforeCompletion.buildingDistressValue],
                electrificationPercent: [singleData.buildingDetailsBeforeCompletion.electrificationPercent],
                waterSupplyPercent: [singleData.buildingDetailsBeforeCompletion.waterSupplyPercent],
                sanitationPercent: [singleData.buildingDetailsBeforeCompletion.sanitationPercent],

              }),
              buildingDetailsAfterCompletion: this.formBuilder.group({
                buildingName: [singleData.buildingDetailsAfterCompletion.buildingName],
                buildingDescription: [singleData.buildingDetailsAfterCompletion.buildingDescription],
                buildArea: [singleData.buildingDetailsAfterCompletion.buildArea],
                buildRate: [singleData.buildingDetailsAfterCompletion.buildRate],
                totalCost: [singleData.buildingDetailsAfterCompletion.totalCost],
                floorName: [singleData.buildingDetailsAfterCompletion.floorName],
                valuationArea: [singleData.buildingDetailsAfterCompletion.valuationArea],
                ratePerSquareFeet: [singleData.buildingDetailsAfterCompletion.ratePerSquareFeet],
                estimatedCost: [singleData.buildingDetailsAfterCompletion.estimatedCost],
                waterSupply: [singleData.buildingDetailsAfterCompletion.waterSupply],
                sanitation: [singleData.buildingDetailsAfterCompletion.sanitation],
                electrification: [singleData.buildingDetailsAfterCompletion.electrification],
                buildingTotalCost: [singleData.buildingDetailsAfterCompletion.buildingTotalCost],
                buildingFairMarketValue: [singleData.buildingDetailsAfterCompletion.buildingFairMarketValue],
                buildingDistressValue: [singleData.buildingDetailsAfterCompletion.buildingDistressValue],
                waterSupplyPercent: [singleData.buildingDetailsAfterCompletion.waterSupplyPercent],
                sanitationPercent: [singleData.buildingDetailsAfterCompletion.sanitationPercent],
                electrificationPercent: [singleData.buildingDetailsAfterCompletion.electrificationPercent],


              })
            })
        );
      });
    }
  }


  addBuildingUnderConstructions() {
    const underConstruct = this.securityForm.get('buildingUnderConstructions') as FormArray;
    underConstruct.push(
        this.formBuilder.group({
          buildingDetailsBeforeCompletion: this.formBuilder.group({
            buildingName: [undefined],
            buildingDescription: [undefined],
            buildArea: [undefined],
            buildRate: [undefined],
            totalCost: [undefined],
            floorName: [undefined],
            valuationArea: [undefined],
            ratePerSquareFeet: [undefined],
            estimatedCost: [undefined],
            waterSupply: [undefined],
            waterSupplyPercent: [undefined],
            sanitationPercent: [undefined],
            electrificationPercent: [undefined],
            sanitation: [undefined],
            electrification: [undefined],
            buildingTotalCost: [undefined],
            buildingFairMarketValue: [undefined],
            buildingDistressValue: [undefined]
          }),
          buildingDetailsAfterCompletion: this.formBuilder.group({
            buildingName: [undefined],
            buildingDescription: [undefined],
            buildArea: [undefined],
            buildRate: [undefined],
            totalCost: [undefined],
            floorName: [undefined],
            valuationArea: [undefined],
            ratePerSquareFeet: [undefined],
            estimatedCost: [undefined],
            waterSupplyPercent: [undefined],
            sanitationPercent: [undefined],
            electrificationPercent: [undefined],
            waterSupply: [undefined],
            sanitation: [undefined],
            electrification: [undefined],
            buildingTotalCost: [undefined],
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
        this.valuator(singleData['plantBranch']['id'], this.valuatingFieldEnum.PLANT_MACHINARY, index);
      } else {
        this.valuator(null, this.valuatingFieldEnum.PLANT_MACHINARY, index);
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
            realisableRate: [singleData.realisableRate],
            realisableValue: [singleData.realisableValue],
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

  hypothecationDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
          owner: [undefined],
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
          name: [undefined],
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
          name: [undefined],
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
      owner: ['', {disabled: true}],
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
      landConsideredValue: [undefined],
      typeOfProperty: [undefined],
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
      ownershipType: undefined,
      roadAccessBluePrint: undefined,
      roadAccessDescribe: undefined,
      ownerKycApplicableData: [undefined],
      landOtherBranchChecked: [undefined],
      kycCheckForLand: [false],
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
      waterSupplyPercent: [''],
      sanitationPercent: [''],
      electrificationPercent: [''],
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
      apartmentStaffRepresentativeDesignation: [undefined],
      apartmentStaffRepresentativeDesignation2: [undefined],
      apartmentStaffRepresentativeName2: [undefined],
      apartmentOtherBranchChecked: [undefined],
      proposedOwner: [undefined],
      apartmentRate: [undefined],
      buildingReliasableValue: [undefined],
    });
  }

  LandBuildingDetailsFormGroup() {
    return this.formBuilder.group({
      owner: [undefined],
      location: undefined,
      plotNumber: undefined,
      areaFormat: undefined,
      area: undefined,
      marketValue: undefined,
      distressValue: undefined,
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
      totalBuildingAreaConstruction: undefined,
      costPerSquareConstruction: undefined,
      totalCostConstruction: undefined,
      landConsideredValueConstruction: [undefined],
      underConstructionChecked: undefined,
      landBuildingStaffRepresentativeDesignation: [undefined],
      landBuildingStaffRepresentativeDesignation2: [undefined],
      landBuildingStaffRepresentativeName2: [undefined],
      landAndBuildingSecurityLegalDocumentAddress: [undefined],
      landBuildingCollateralOwnerRelationship: [undefined],
      ownershipTypeForLandAndBuilding: [undefined],
      roadAccessBluePrint: [undefined],
      roadAccessDescribe: [undefined],
      ownerKycApplicableData: [undefined],
      progessCost: [undefined],
      landBuildingOtherBranchChecked: [undefined],
      kycCheckForLandAndBuilding: [false],
      landBuildingRate: undefined,
      landbuildingUnderRate: undefined,
      totalLandRealisableValue: undefined,
      apartmentDistressValue: undefined,
      apartmentRate: undefined,
      totalApartmentRealisableValue: undefined,
    });
  }

  // Insurance policy form group
  insurancePolicyFormGroup(): FormGroup {
    return this.formBuilder.group({
          insuredAmount: [undefined],
          insuranceCompanyName: [undefined],
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
      model: [''],
      quotation: [''],
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
      realisableRate: [undefined],
      realisableValue: [undefined],
    });
  }

  assignmentDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
          amount: [undefined],
          otherDetail: [undefined]
        }
    );
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

  removeAssignments(index: number) {
    (<FormArray>this.securityForm.get('leaseAssignment')).removeAt(index);
  }

  removeSecurityOther(index: number) {
    (<FormArray>this.securityForm.get('otherSecurity')).removeAt(index);
  }

  removeCorporate(index: number) {
    (<FormArray>this.securityForm.get('corporateGuarantee')).removeAt(index);

  }

  addBuilding() {
    (this.securityForm.get('buildingDetails') as FormArray).push(this.buildingDetailsFormGroup());
  }

  removeBuildingDetails(index: number) {
    (this.securityForm.get('buildingDetails') as FormArray).removeAt(index);
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
      model: [''],
      registrationNumber: [''],
      registrationDate: [''],
      engineNumber: [''],
      chassisNumber: [''],
      valuationAmount: [''],
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
      isSecondHand: [undefined],
      vehicleRealiasableAmount: [undefined],
      vehicleRate: [undefined],
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
        this.valuator(singleData['vehicalBranch']['id'], this.valuatingFieldEnum.VEHICLE, index);
      } else {
        this.valuator(null, this.valuatingFieldEnum.VEHICLE, index);
      }
      vehicleDetails.push(
          this.formBuilder.group({
            model: [singleData.model],
            registrationNumber: [singleData.registrationNumber],
            registrationDate: [ObjectUtil.isEmpty(singleData.registrationDate) ?
                undefined : new Date(singleData.registrationDate), DateValidator.isValidBefore],
            engineNumber: [singleData.engineNumber],
            chassisNumber: [singleData.chassisNumber],
            valuationAmount: [singleData.valuationAmount],
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
            isSecondHand: [singleData.isSecondHand ? singleData.isSecondHand : undefined],
            vehicleRealiasableAmount: [singleData.vehicleRealiasableAmount ? singleData.vehicleRealiasableAmount : undefined],
            vehicleRate: [singleData.vehicleRate ? singleData.vehicleRate : undefined],

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
      amount: [''],
      expiryDate: undefined,
      couponRate: [''],
      beneficiary: [''],
      remarks: [''],
      accountHolderName: undefined,
      accountNumber: [undefined],
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
        priceEarningRatio: matchedNepse[0].priceEarningRatio,
        priceBookValue: matchedNepse[0].priceToBookValue,
        dividendYeild: matchedNepse[0].dividendYield,
        dividendPayoutRatio: matchedNepse[0].dividendPayoutRatio,
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

  get totalShareValue() {
    let total = 0;
    this.shareField.controls.forEach(c => total += Number(c.get('total').value));
    return total.toFixed(2);
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
    if (!ObjectUtil.isEmpty(details.approvedData)) {
    const shareDetails = this.shareSecurityForm.get('shareSecurityDetails') as FormArray;
    const shareFields = (JSON.parse(details.approvedData))['shareSecurityDetails'];
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
              ratioAsPerAuitedFinancial: [share.ratioAsPerAuitedFinancial],
              shareRate: [share.shareRate],
              drawingPower: [share.drawingPower],
            })
        );
      });
    }
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
      consideredValue: [''],
      priceEarningRatio: [undefined],
      priceBookValue: [undefined],
      dividendYeild: [undefined],
      dividendPayoutRatio: [undefined],
      ratioAsPerAuitedFinancial: [undefined],
    });
  }

  addShareSecurity() {
    this.shareField.push(this.shareSecurityFormGroup());
  }

  calculateBuildUpAreaRate(i, type) {
    switch (type) {
      case 'building':
        const totalBuildRate = (Number(this.securityForm.get(['buildingDetails', i, 'buildArea']).value)
            * Number(this.securityForm.get(['buildingDetails', i, 'buildRate']).value)).toFixed(2);
        this.securityForm.get(['buildingDetails', i, 'totalCost']).patchValue(totalBuildRate);
        break;
      case 'before':
        const beforeTotalBuildRate = (Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'buildArea']).value)
            * Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'buildRate']).value)).toFixed(2);
        this.securityForm.get(['buildingUnderConstructions', i,
          'buildingDetailsBeforeCompletion', 'totalCost']).patchValue(beforeTotalBuildRate);
        break;
      case 'after':
        const afterTotalBuildRate = (Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'buildArea']).value)
            * Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'buildRate']).value)).toFixed(2);
        this.securityForm.get(['buildingUnderConstructions', i,
          'buildingDetailsAfterCompletion', 'totalCost']).patchValue(afterTotalBuildRate);
        break;
      case 'landBuilding':
        const landBuildingTotalBuildRate = (Number(this.securityForm.get(['landBuilding', i, 'buildArea']).value)
            * Number(this.securityForm.get(['landBuilding', i, 'buildRate']).value)).toFixed(2);
        this.securityForm.get(['landBuilding', i, 'totalCost']).patchValue(landBuildingTotalBuildRate);
        break;
      case 'landBuildingBefore':
        const landBuildingBeforeTotalBuildRate = (Number(this.securityForm.get(['landBuildingUnderConstruction', i,
              'buildingDetailsBeforeCompletion', 'buildArea']).value)
            * Number(this.securityForm.get(['landBuildingUnderConstruction', i,
              'buildingDetailsBeforeCompletion', 'buildRate']).value)).toFixed(2);
        this.securityForm.get(['landBuildingUnderConstruction', i,
          'buildingDetailsBeforeCompletion', 'totalCost']).patchValue(landBuildingBeforeTotalBuildRate);
        break;
      case 'landBuildingAfter':
        const landBuildingAfterTotalBuildRate = (Number(this.securityForm.get(['landBuildingUnderConstruction', i,
              'buildingDetailsAfterCompletion', 'buildArea']).value)
            * Number(this.securityForm.get(['landBuildingUnderConstruction', i,
              'buildingDetailsAfterCompletion', 'buildRate']).value)).toFixed(2);
        this.securityForm.get(['landBuildingUnderConstruction', i,
          'buildingDetailsAfterCompletion', 'totalCost']).patchValue(landBuildingAfterTotalBuildRate);
        break;
    }
  }

  calculateEstimatedCost(i, type) {
    switch (type) {
      case 'building':
        const estimatedCost = (Number(this.securityForm.get(['buildingDetails', i, 'valuationArea']).value)
            * Number(this.securityForm.get(['buildingDetails', i, 'ratePerSquareFeet']).value)).toFixed(2);
        this.securityForm.get(['buildingDetails', i, 'estimatedCost']).patchValue(estimatedCost);
        break;
      case 'before':
        const beforeEstimatedCost = (Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'valuationArea']).value)
            * Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'ratePerSquareFeet']).value)).toFixed(2);
        this.securityForm.get(['buildingUnderConstructions', i,
          'buildingDetailsBeforeCompletion', 'estimatedCost']).patchValue(beforeEstimatedCost);
        break;
      case 'after':
        const afterEstimatedCost = (Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'valuationArea']).value)
            * Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'ratePerSquareFeet']).value)).toFixed(2);
        this.securityForm.get(['buildingUnderConstructions', i,
          'buildingDetailsAfterCompletion', 'estimatedCost']).patchValue(afterEstimatedCost);
        break;
      case 'landBuilding':
        const landBuildingEstimatedCost = (Number(this.securityForm.get(['landBuilding', i, 'valuationArea']).value)
            * Number(this.securityForm.get(['landBuilding', i, 'ratePerSquareFeet']).value)).toFixed(2);
        this.securityForm.get(['landBuilding', i, 'estimatedCost']).patchValue(landBuildingEstimatedCost);
        break;
      case 'landBuildingBefore':
        const landBuildingBeforeEstimatedCost = (Number(this.securityForm.get(['landBuildingUnderConstruction', i,
              'buildingDetailsBeforeCompletion', 'valuationArea']).value)
            * Number(this.securityForm.get(['landBuildingUnderConstruction', i,
              'buildingDetailsBeforeCompletion', 'ratePerSquareFeet']).value)).toFixed(2);
        this.securityForm.get(['landBuildingUnderConstruction', i,
          'buildingDetailsBeforeCompletion', 'estimatedCost']).patchValue(landBuildingBeforeEstimatedCost);
        break;
      case 'landBuildingAfter':
        const landBuildingAfterEstimatedCost = (Number(this.securityForm.get(['landBuildingUnderConstruction', i,
              'buildingDetailsAfterCompletion', 'valuationArea']).value)
            * Number(this.securityForm.get(['landBuildingUnderConstruction', i,
              'buildingDetailsAfterCompletion', 'ratePerSquareFeet']).value)).toFixed(2);
        this.securityForm.get(['landBuildingUnderConstruction', i,
          'buildingDetailsAfterCompletion', 'estimatedCost']).patchValue(landBuildingAfterEstimatedCost);
        break;
    }
  }

  calculateWaterSupply(i, type) {
    switch (type) {
      case 'building':
        const waterSupply = (Number(this.securityForm.get(['buildingDetails', i, 'waterSupplyPercent']).value) / 100
            * Number(this.securityForm.get(['buildingDetails', i, 'totalCost']).value)).toFixed(2);
        this.securityForm.get(['buildingDetails', i, 'waterSupply']).patchValue(waterSupply);
        break;
      case 'before':
        const beforeWaterSupply = (Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'waterSupplyPercent']).value) / 100
            * Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'totalCost']).value)).toFixed(2);
        this.securityForm.get(['buildingUnderConstructions', i,
          'buildingDetailsBeforeCompletion', 'waterSupply']).patchValue(beforeWaterSupply);
        break;
      case 'after':
        const afterWaterSupply = (Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'waterSupplyPercent']).value) / 100
            * Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'totalCost']).value)).toFixed(2);
        this.securityForm.get(['buildingUnderConstructions', i,
          'buildingDetailsAfterCompletion', 'waterSupply']).patchValue(afterWaterSupply);
        break;
    }
  }

  calculateSanitation(i, type) {
    switch (type) {
      case 'building':
        const sanitation = (Number(this.securityForm.get(['buildingDetails', i, 'sanitationPercent']).value) / 100
            * Number(this.securityForm.get(['buildingDetails', i, 'totalCost']).value)).toFixed(2);
        this.securityForm.get(['buildingDetails', i, 'sanitation']).patchValue(sanitation);
        break;
      case 'before':
        const beforeSanitation = (Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'sanitationPercent']).value) / 100
            * Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'totalCost']).value)).toFixed(2);
        this.securityForm.get(['buildingUnderConstructions', i,
          'buildingDetailsBeforeCompletion', 'sanitation']).patchValue(beforeSanitation);
        break;
      case 'after':
        const afterSanitation = (Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'sanitationPercent']).value) / 100
            * Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'totalCost']).value)).toFixed(2);
        this.securityForm.get(['buildingUnderConstructions', i,
          'buildingDetailsAfterCompletion', 'sanitation']).patchValue(afterSanitation);
        break;
    }
  }

  calculateElectrification(i, type) {
    switch (type) {
      case 'building':
        const electrification = (Number(this.securityForm.get(['buildingDetails', i, 'electrificationPercent']).value) / 100
            * Number(this.securityForm.get(['buildingDetails', i, 'totalCost']).value)).toFixed(2);
        this.securityForm.get(['buildingDetails', i, 'electrification']).patchValue(electrification);
        break;
      case 'before':
        const beforeElectrification = (Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'electrificationPercent']).value) / 100
            * Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'totalCost']).value)).toFixed(2);
        this.securityForm.get(['buildingUnderConstructions', i,
          'buildingDetailsBeforeCompletion', 'electrification']).patchValue(beforeElectrification);
        break;
      case 'after':
        const afterElectrification = (Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'electrificationPercent']).value) / 100
            * Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'totalCost']).value)).toFixed(2);
        this.securityForm.get(['buildingUnderConstructions', i,
          'buildingDetailsAfterCompletion', 'electrification']).patchValue(afterElectrification);
        break;
    }
  }

  calculateTotalApartmentCost(i, type) {
    switch (type) {
      case 'building':
        const totalApartmentCost = (Number(this.securityForm.get(['buildingDetails', i, 'estimatedCost']).value) +
            Number(this.securityForm.get(['buildingDetails', i, 'waterSupply']).value) +
            Number(this.securityForm.get(['buildingDetails', i, 'sanitation']).value) +
            Number(this.securityForm.get(['buildingDetails', i, 'electrification']).value)).toFixed(2);
        this.securityForm.get(['buildingDetails', i, 'buildingTotalCost']).patchValue(totalApartmentCost);
        break;
      case 'before':
        const beforeTotalApartmentCost = (Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'estimatedCost']).value) +
            Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'waterSupply']).value) +
            Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'sanitation']).value) +
            Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'electrification']).value)).toFixed(2);
        this.securityForm.get(['buildingUnderConstructions', i,
          'buildingDetailsBeforeCompletion', 'buildingTotalCost']).patchValue(beforeTotalApartmentCost);
        break;
      case 'after':
        const afterTotalApartmentCost = (Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'estimatedCost']).value) +
            Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'waterSupply']).value) +
            Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'sanitation']).value) +
            Number(this.securityForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'electrification']).value)).toFixed(2);
        this.securityForm.get(['buildingUnderConstructions', i,
          'buildingDetailsAfterCompletion', 'buildingTotalCost']).patchValue(afterTotalApartmentCost);
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
    v.get('remainingAmount').setValue(v.get('valuationAmount').value - v.get('downPayment').value);
  }

  get totalVehicleExposure() {
    let totalRemaining = 0;
    let totalValuation = 0;
    let exposures = 0;
    this.vehicleDetails.controls.forEach((c: AbstractControl) => {
      totalRemaining += c.get('remainingAmount').value;
      totalValuation += c.get('valuationAmount').value;
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

  openSiteVisitModel(security: string) {
    this.close();
    const context = {
      securityId: this.customerSecurityId,
      security: security,
      readMode: true,
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
}