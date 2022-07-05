import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Security} from '../../loan/model/security';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {AddressService} from '../../../@core/service/baseservice/address.service';
import {Province} from '../../admin/modal/province';
import {District} from '../../admin/modal/district';
import {MunicipalityVdc} from '../../admin/modal/municipality_VDC';
import {Address} from '../../loan/model/address';
import {Guarantor} from '../../loan/model/guarantor';
import {CalendarType} from '../../../@core/model/calendar-type';
import {ShareSecurity} from '../../admin/modal/shareSecurity';
import {SecurityGuarantee} from '../model/security-guarantee';
import {LandAndBuildingLocation} from '../model/land-and-building-location';
import {VehicleSecurityCoverage} from '../model/vehicle-security-coverage';
import {CustomerType} from '../../customer/model/customerType';
import {ActivatedRoute} from '@angular/router';
import {RoadAccess} from '../../admin/modal/crg/RoadAccess';
import {FacCategory} from '../../admin/modal/crg/fac-category';
import {environment} from '../../../../environments/environment';
import {SecurityCoverageAutoPrivate} from '../model/security-coverage-auto-private';
import {SecurityCoverageAutoCommercial} from '../model/security-coverage-auto-commercial';
import {ToastService} from '../../../@core/utils';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {SecuritiesType} from '../../constants/securities-type';
import {PlantMachineryComponent} from './plant-machinery/plant-machinery.component';
import {LandComponent} from './land/land.component';
import {ApartmentComponent} from './apartment/apartment.component';
import {LandBuildingComponent} from './land-building/land-building.component';
import {FixedDepositComponent} from './fixed-deposit/fixed-deposit.component';
import {HypothecationOfStockComponent} from './hypothecation-of-stock/hypothecation-of-stock.component';
import {
    CorporateGuranteeComponent
} from '../../credit-administration/cad-document-template/laxmi/laxmi-offer-letter/corporate-guarantee/corporate-gurantee.component';
import {PersonalGuaranteeComponent} from './personal-guarantee/personal-guarantee.component';
import {InsurancePolicyComponent} from './insurance-policy/insurance-policy.component';
import {AssignmentOfReceivableComponent} from './assignment-of-receivable/assignment-of-receivable.component';
import {LeaseAssignmentComponent} from './lease-assignment/lease-assignment.component';
import {OtherSecurityComponent} from './other-security/other-security.component';
import {VehicleComponent} from './vehicle/vehicle.component';
import {ShareComponent} from './share/share.component';
import {CorporationGuaranteeComponent} from './corporation-guarantee/corporation-guarantee.component';

@Component({
    selector: 'app-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
    @Input() securityValue: Security;
    @Input() calendarType: CalendarType;
    @Input() loanTag: string;
    @Output() securityDataEmitter = new EventEmitter();
    @Input() fromProfile;
    @Input() shareSecurity: ShareSecurity;
    @Input() isMicroCustomer: boolean;
    @Input() customerType: CustomerType;
    @Input() customerInfo: CustomerInfoData;
    @Output() refreshEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    isEdit = false;
    isSiteVisit = false;


    @ViewChild('landSecurity', {static: false})
    landSecurity: LandComponent;

    @ViewChild('vehicleSecurity', {static: false})
    vehicleSecurity: VehicleComponent;

    @ViewChild('apartmentSecurity', {static: false})
    apartmentSecurity: ApartmentComponent;

    @ViewChild('landBuildingSecurity', {static: false})
    landBuildingSecurity: LandBuildingComponent;

    @ViewChild('plantMachinerySecurity', {static: false})
    plantMachinerySecurity: PlantMachineryComponent;

    @ViewChild('fixedDepositSecurity', {static: false})
    fixedDepositSecurity: FixedDepositComponent;

    @ViewChild('shareSecurityComponent', {static: false})
    shareSecurityComponent: ShareComponent;

    @ViewChild('hypothecationSecurity', {static: false})
    hypothecationSecurity: HypothecationOfStockComponent;

    @ViewChild('corporateGuaranteeSecurity', {static: false})
    corporateGuaranteeSecurity: CorporationGuaranteeComponent;

    @ViewChild('personalGuaranteeSecurity', {static: false})
    personalGuaranteeSecurity: PersonalGuaranteeComponent;

    @ViewChild('insurancePolicySecurity', {static: false})
    insurancePolicySecurity: InsurancePolicyComponent;

    @ViewChild('assignmentOfReceivableSecurity', {static: false})
    assignmentOfReceivableSecurity: AssignmentOfReceivableComponent;

    @ViewChild('leaseAssignmentSecurity', {static: false})
    leaseAssignmentSecurity: LeaseAssignmentComponent;

    @ViewChild('otherSecurity', {static: false})
    otherSecurity: OtherSecurityComponent;

    securityData: Security = new Security();
    guarantorsForm: FormGroup;
    securityForm: FormGroup;
    initialSecurityValue: Object;
    securityValueForEdit;
    province: Province = new Province();
    provinceList: Array<Province> = new Array<Province>();
    district: District = new District();
    districtList: Array<District> = Array<District>();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();
    addressList: Array<Address> = new Array<Address>();
    limit: number;
    submitted = false;
    guarantorsDetails: Guarantor = new Guarantor();
    shareSecurityData: ShareSecurity = new ShareSecurity();
    isBusinessLoan = true;
    shareSecuritySelected = false;

    guaranteeList = SecurityGuarantee.enumObject();
    locationList = LandAndBuildingLocation.enumObject();
    coverageList = VehicleSecurityCoverage.enumObject();
    newCoverage = VehicleSecurityCoverage.getNew();

    apNewCoverage = SecurityCoverageAutoPrivate.getNew();
    apUsedCoverage = SecurityCoverageAutoPrivate.getUsed();

    acNewCoverage = SecurityCoverageAutoCommercial.getNew();
    acUsedCoverage = SecurityCoverageAutoCommercial.getUsed();

    roadAccess = RoadAccess.enumObject();
    facCategory = FacCategory.enumObject();

    disableCrgAlphaParams = environment.disableCrgAlpha;
    crgLambdaDisabled = environment.disableCrgLambda;
    securityId: number;

    alphaControls = ['securityGuarantee', 'buildingLocation', 'vehicleSecurityCoverage'];
    lambdaControls = ['roadAccessOfPrimaryProperty', 'facCategory', 'securityCoverageAutoPrivate', 'securityCoverageAutoCommercial'];

    vehicleSelected = false;
    apartmentSelected = false;
    landSelected = false;
    landBuildingSelected = false;
    plantSelected = false;
    depositSelected = false;
    shareSelected = false;
    hypothecationOfStockSelected = false;
    corporateGuaranteeSelected = false;
    personalGuaranteeSelected = false;
    insurancePolicySelected = false;
    assignmentOfReceivableSelected = false;
    leaseAssignmentSelected = false;
    otherSecuritySelected = false;

    underConstructionChecked = false;
    isFixedDeposit = false;
    ckeConfig;

    selectedSecurity: string;

    securityTypes = SecuritiesType.enumObject();
    isApprovedSecurity = false;
    newSecurity = false;
    constructor(
        private formBuilder: FormBuilder,
        private addressServices: AddressService,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(queryParams => {
            if (CustomerType.INDIVIDUAL === CustomerType[queryParams.customerType]) {
                this.isBusinessLoan = false;
            }
        });
        this.buildForm();
        this.buildCrgSecurityForm();
        this.getProvince();
        if (!ObjectUtil.isEmpty(this.securityValue)) {
            this.securityValueForEdit = JSON.parse(this.securityValue.data);
            this.initialSecurityValue = this.securityValueForEdit;
            this.setCrgSecurityForm(this.securityValueForEdit);
            this.setGuarantorsDetails(this.securityValue.guarantor);
            this.securityId = this.securityValue.id;
        } else {
            this.addGuarantorsDetails();
            this.initialSecurityValue = undefined;
        }
        this.checkDisableAlpha();
        if (!this.isMicroCustomer && !this.crgLambdaDisabled && !this.isBusinessLoan) {
            this.checkDisableLamdha();
        }
    }

    clearValidationState() {
        console.log('validation state');
    }

    securityInitialState() {
        this.landSelected = this.vehicleSelected = this.apartmentSelected = this.landBuildingSelected = this.plantSelected =
            this.depositSelected = this.shareSelected = this.hypothecationOfStockSelected =
                this.corporateGuaranteeSelected = this.personalGuaranteeSelected = this.insurancePolicySelected =
                    this.assignmentOfReceivableSelected = this.leaseAssignmentSelected = this.otherSecuritySelected = false;
    }

    change(arraySelected) {
        if (!this.isEdit) {
            this.newSecurity  = true;
        }
        const selectedSecurity = [];
        selectedSecurity.push(arraySelected);
        this.securityInitialState();
        selectedSecurity.forEach(selectedValue => {
            switch (selectedValue) {
                case 'LAND_SECURITY' :
                    this.landSelected = true;
                    break;
                case 'VEHICLE_SECURITY' :
                    this.vehicleSelected = true;
                    break;
                case 'APARTMENT_SECURITY' :
                    this.apartmentSelected = true;
                    break;
                case 'LAND_BUILDING_SECURITY' :
                    this.landBuildingSelected = true;
                    break;
                case 'PLANT_AND_MACHINERY_SECURITY' :
                    this.plantSelected = true;
                    break;
                case 'FIXED_DEPOSIT_RECEIPT':
                    this.depositSelected = true;
                    break;
                case 'SHARE_SECURITY':
                    this.shareSelected = true;
                    break;
                case 'HYPOTHECATION_OF_STOCK':
                    this.hypothecationOfStockSelected = true;
                    break;
                case 'CORPORATE_GUARANTEE':
                    this.corporateGuaranteeSelected = true;
                    break;
                case 'PERSONAL_GUARANTEE':
                    this.personalGuaranteeSelected = true;
                    break;
                case 'INSURANCE_POLICY_SECURITY':
                    this.insurancePolicySelected = true;
                    break;
                case 'ASSIGNMENT_OF_RECEIVABLES':
                    this.assignmentOfReceivableSelected = true;
                    break;
                case 'LEASE_ASSIGNMENT':
                    this.leaseAssignmentSelected = true;
                    break;
                case 'OTHER_SECURITY':
                    this.otherSecuritySelected = true;
                    break;
            }
        });
    }

    buildForm() {
        this.guarantorsForm = this.formBuilder.group({
            guarantorsDetails: this.formBuilder.array([])
        });
    }

    buildCrgSecurityForm() {
        this.securityForm = this.formBuilder.group({
            securityGuarantee: [undefined],
            buildingLocation: [undefined],
            vehicleSecurityCoverage: [undefined],
            lambdaScheme: [undefined,
                !this.crgLambdaDisabled
                && !this.isBusinessLoan
                && !this.isMicroCustomer ? Validators.required : undefined],
            roadAccessOfPrimaryProperty: [undefined],
            facCategory: [undefined],
            securityCoverageAutoPrivate: [undefined],
            securityCoverageAutoCommercial: [undefined],
        });
    }

    setCrgSecurityForm(formData) {
        if (!ObjectUtil.isEmpty(formData)) {
            this.securityForm = this.formBuilder.group({
                securityGuarantee: formData.securityGuarantee,
                buildingLocation: formData.buildingLocation,
                vehicleSecurityCoverage: formData.vehicleSecurityCoverage,
                lambdaScheme: [formData.lambdaScheme,
                    !this.crgLambdaDisabled && !this.isBusinessLoan && !this.isMicroCustomer ? Validators.required : undefined],
                roadAccessOfPrimaryProperty: [formData.roadAccessOfPrimaryProperty],
                facCategory: [formData.facCategory],
                securityCoverageAutoCommercial: [formData.securityCoverageAutoCommercial],
                securityCoverageAutoPrivate: [formData.securityCoverageAutoPrivate],
            });
        }
    }

    setGuarantorsDetails(guarantorList: Array<Guarantor>): FormArray {
        const details = this.guarantorsForm.get('guarantorsDetails') as FormArray;
        if (details.length !== 0) {
            this.addressList = new Array<Address>(guarantorList === undefined ? 0 : guarantorList.length);
            let guarantorIndex = 0;
            guarantorList.forEach(guarantor => {
                this.addressList[guarantorIndex] = new Address();
                if (!ObjectUtil.isEmpty(guarantor.province) && !ObjectUtil.isEmpty(guarantor.province.id)) {
                    this.getDistrict(guarantor.province.id, guarantorIndex);
                    if (guarantor.district.id !== null) {
                        this.getMunicipalities(guarantor.district.id, guarantorIndex);
                    }
                }
                guarantorIndex++;
                details.push(this.formBuilder.group({
                    id: [guarantor.id === undefined ? undefined : guarantor.id],
                    version: [guarantor.version === undefined ? undefined : guarantor.version],
                    name: [guarantor.name === undefined ? undefined : guarantor.name, Validators.required],
                    citizenNumber: [guarantor.citizenNumber === undefined ? undefined : guarantor.citizenNumber, Validators.required],
                    issuedYear: [guarantor.issuedYear === undefined ? undefined : guarantor.issuedYear, Validators.required],
                    issuedPlace: [guarantor.issuedPlace === undefined ? undefined : guarantor.issuedPlace, Validators.required],
                    contactNumber: [guarantor.contactNumber === undefined ? undefined : guarantor.contactNumber, Validators.required],
                    fatherName: [guarantor.fatherName === undefined ? undefined : guarantor.fatherName, Validators.required],
                    grandFatherName: [guarantor.grandFatherName === undefined ? undefined
                        : guarantor.grandFatherName, Validators.required],
                    relationship: [guarantor.relationship === undefined ? undefined : guarantor.relationship, Validators.required],
                    province: [!ObjectUtil.isEmpty(guarantor.province) && !ObjectUtil.isEmpty(guarantor.province.id)
                        ? guarantor.province.id : undefined, Validators.required],
                    district: [!ObjectUtil.isEmpty(guarantor.district) && !ObjectUtil.isEmpty(guarantor.district.id)
                        ? guarantor.district.id : undefined, Validators.required],
                    municipalities: [!ObjectUtil.isEmpty(guarantor.municipalities) && !ObjectUtil.isEmpty(guarantor.municipalities.id) ?
                        guarantor.municipalities.id : undefined, Validators.required]
                }));

            });
        }
        return details;
    }

    addGuarantorsDetails() {
        const addDetails = this.guarantorsForm.get('guarantorsDetails') as FormArray;
        this.addressList.push(new Address());
        addDetails.push(
            this.formBuilder.group({
                name: [undefined, Validators.required],
                province: [null, Validators.required],
                district: [null, Validators.required],
                municipalities: [null, Validators.required],
                citizenNumber: [undefined, Validators.required],
                issuedYear: [undefined, Validators.required],
                issuedPlace: [undefined, Validators.required],
                contactNumber: [undefined, Validators.required],
                fatherName: [undefined, Validators.required],
                grandFatherName: [undefined, Validators.required],
                relationship: [undefined, Validators.required]
            })
        );
    }

    removeGuarantorsDetails(index: number) {
        (this.guarantorsForm.get('guarantorsDetails') as FormArray).removeAt(index);
    }

    getProvince() {
        this.addressServices.getProvince().subscribe(
            (response: any) => {
                this.provinceList = response.detail;
            });
    }

    getDistrict(provinceId: number, i: number) {
        const province = new Province();
        province.id = provinceId;
        this.addressServices.getDistrictByProvince(province).subscribe((response: any) => {
            this.districtList = response.detail;
            this.addressList[i].districtList = this.districtList;
        });
    }

    getMunicipalities(districtId: number, i: number) {
        const district = new District();
        district.id = districtId;
        this.addressServices.getMunicipalityVDCByDistrict(district).subscribe((response: any) => {
            this.municipalitiesList = response.detail;
            this.addressList[i].municipalityVdcList = this.municipalitiesList;
        });
    }

    getGuarantor() {
        return this.guarantorsForm.value.guarantorsDetails as FormArray;
    }


    onSubmit() {
        this.submitted = true;
        if (this.vehicleSelected) {
            const vehicleData = this.vehicleSecurity.vehicleForm.value.vehicleDetails;
            const securities = this.constructSecurityArray(vehicleData, 'VEHICLE_SECURITY');
            this.securityDataEmitter.emit(securities);
        }
        if (this.apartmentSelected) {
            const apartmentData = this.apartmentSecurity.apartmentForm.value.buildingDetails;
            const securities = this.constructSecurityArray(apartmentData, 'APARTMENT_SECURITY');
            this.securityDataEmitter.emit(securities);
        }
        if (this.landSelected) {
            const landData = this.landSecurity.landForm.value.landDetails;
            const securities = this.constructSecurityArray(landData, 'LAND_SECURITY');
            this.securityDataEmitter.emit(securities);
        }
        if (this.landBuildingSelected) {
            const landBuildingData = this.landBuildingSecurity.landBuildingForm.value.landBuilding;
            const securities = this.constructSecurityArray(landBuildingData, 'LAND_BUILDING_SECURITY');
            this.securityDataEmitter.emit(securities);
        }
        if (this.plantSelected) {
            const plantMachineryData = this.plantMachinerySecurity.plantMachineryForm.value.plantDetails;
            const securities = this.constructSecurityArray(plantMachineryData, 'PLANT_AND_MACHINERY_SECURITY');
            this.securityDataEmitter.emit(securities);
        }
        if (this.depositSelected) {
            const depositData = this.fixedDepositSecurity.fixedDepositForm.value.fixedDepositDetails;
            const securities = this.constructSecurityArray(depositData, 'FIXED_DEPOSIT_RECEIPT');
            this.securityDataEmitter.emit(securities);
        }
         if (this.shareSelected) {
            const shareData = this.shareSecurityComponent.shareSecurityForm.value.shareSecurityDetails;
            const securities = this.constructSecurityArray(shareData, 'SHARE_SECURITY');
            this.securityDataEmitter.emit(securities);
        }
        if (this.hypothecationOfStockSelected) {
            const hypothecationOfStockData = this.hypothecationSecurity.hypothecationForm.value.hypothecationOfStock;
            const securities = this.constructSecurityArray(hypothecationOfStockData, 'HYPOTHECATION_OF_STOCK');
            this.securityDataEmitter.emit(securities);
        }
        if (this.corporateGuaranteeSelected) {
            const corporateGuaranteeData = this.corporateGuaranteeSecurity.corporateForm.value.corporateGuarantee;
            const securities = this.constructSecurityArray(corporateGuaranteeData, 'CORPORATE_GUARANTEE');
            this.securityDataEmitter.emit(securities);
        }
        if (this.personalGuaranteeSelected) {
            const personalGuaranteeData = this.personalGuaranteeSecurity.personalGuaranteeForm.value.personalGuarantee;
            const securities = this.constructSecurityArray(personalGuaranteeData, 'PERSONAL_GUARANTEE');
            this.securityDataEmitter.emit(securities);
        }
        if (this.insurancePolicySelected) {
            const insurancePolicyData = this.insurancePolicySecurity.insurancePolicyForm.value.insurancePolicy;
            const securities = this.constructSecurityArray(insurancePolicyData, 'INSURANCE_POLICY_SECURITY');
            this.securityDataEmitter.emit(securities);
        }
        if (this.assignmentOfReceivableSelected) {
            const assignmentOfReceivableData = this.assignmentOfReceivableSecurity.assignmentForm.value.assignmentOfReceivables;
            const securities = this.constructSecurityArray(assignmentOfReceivableData, 'ASSIGNMENT_OF_RECEIVABLES');
            this.securityDataEmitter.emit(securities);
        }
        if (this.leaseAssignmentSelected) {
            const leaseAssignmentData = this.leaseAssignmentSecurity.leaseAssignmentForm.value.leaseAssignment;
            const securities = this.constructSecurityArray(leaseAssignmentData, 'LEASE_ASSIGNMENT');
            this.securityDataEmitter.emit(securities);
        }
        if (this.otherSecuritySelected) {
            const otherSecurityData = this.otherSecurity.otherSecurityForm.value.otherSecurity;
            const securities = this.constructSecurityArray(otherSecurityData, 'OTHER_SECURITY');
            this.securityDataEmitter.emit(securities);
        }
    }

    constructSecurityArray(formValues: any, securityType: any): Array<Security> {
        const securities: Array<Security> = new Array<Security>();
        formValues.forEach((value, i) => {
            const security: Security = new Security();
            if (this.isEdit && i === 0) {
                security.id = this.securityValue.id;
                security.version = this.securityValue.version;
                security.status = this.securityValue.status;
            }
            if (this.isApprovedSecurity) {
                security.approved = true;
            }
            security.data = JSON.stringify(value);
            security.fairMarketValue = value.fairMarketValue;
            security.distressValue = value.distressValue;
            security.considerValue = value.considerValue;
            security.securityType = securityType;
            securities.push(security);
        });
        return securities;
    }

    controlValidation(controlNames: string[], validate) {
        controlNames.forEach(s => {
            if (validate) {
                this.securityForm.get(s).setValidators(Validators.required);
            } else {
                this.securityForm.get(s).clearValidators();
            }
            this.securityForm.get(s).updateValueAndValidity();
        });
    }

    checkDisableAlpha() {
        if (!this.isMicroCustomer && !this.disableCrgAlphaParams && this.isBusinessLoan) {
            this.controlValidation(this.alphaControls, true);
        } else {
            this.controlValidation(this.alphaControls, false);
        }
    }

    checkDisableLamdha(event?) {
        this.controlValidation(this.lambdaControls, false);
        switch (event) {
            case 'GENERAL':
                this.controlValidation(['roadAccessOfPrimaryProperty', 'facCategory'], true);
                break;
            case 'AUTO_PRIVATE':
                this.controlValidation(['securityCoverageAutoPrivate'], true);
                break;
            case 'AUTO_COMMERCIAL':
                this.controlValidation(['securityCoverageAutoCommercial'], true);
                break;
        }
    }

    public onEdit(event: any): void {
        this.securityValue = event.security;
        this.isEdit = event.isEdit;
        this.isSiteVisit = event.isSiteVisit;
        this.change(event.securityType);
    }

    public onSiteVisit(event: any): void {
        this.securityValue = event.security;
        this.isEdit = event.isEdit;
        this.isSiteVisit = event.isSiteVisit;
        this.change(event.securityType);
    }

    public onEmitRefresh(event): void {
        if (event) {
            this.refreshEmitter.emit(true);
        }
    }
}
