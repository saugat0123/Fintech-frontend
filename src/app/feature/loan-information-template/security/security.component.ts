import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SecurityInitialFormComponent} from './security-initial-form/security-initial-form.component';
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
import {CustomerShareData} from '../../admin/modal/CustomerShareData';
import {RoadAccess} from '../../admin/modal/crg/RoadAccess';
import {FacCategory} from '../../admin/modal/crg/fac-category';
import {environment} from '../../../../environments/environment';
import {SecurityCoverageAutoPrivate} from '../model/security-coverage-auto-private';
import {SecurityCoverageAutoCommercial} from '../model/security-coverage-auto-commercial';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ToastService} from '../../../@core/utils';
import {TemplateName} from '../../customer/model/templateName';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {SecuritiesType} from '../../constants/securities-type';

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

    @ViewChild('initialSecurity', {static: false})
    initialSecurity: SecurityInitialFormComponent;
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
    usedCoverage = VehicleSecurityCoverage.getUsed();

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

    landSelected = false;
    apartmentSelected = false;
    landOtherBranchChecked = false;
    plantSelected = false;
    vehicleSelected = false;
    shareSelected = false;
    insurancePolicySelected = false;
    assignmentOfReceivable = false;
    underConstructionChecked = false;
    depositSelected = false;
    otherBranchcheck = false;
    isFixedDeposit = false;
    landBuilding = false;
    underBuildingConstructionChecked = false;
    hypothecationOfStock = false;
    assignments = false;
    securityOther = false;
    corporateGuarantee = false;
    ckeConfig;
    personal = false;

    apartmentOtherBranchChecked = false;
    landBuildingOtherBranchChecked = false;
    vehicleOtherBranchChecked = false;
    plantOtherBranchChecked = false;

    selectedSecurity: string;

    securityTypes = SecuritiesType.enumObject();

    securityTypeValues = SecuritiesType.values();
    securityTypeEnumObject = SecuritiesType.enumObject();

    constructor(
        private formBuilder: FormBuilder,
        private addressServices: AddressService,
        private activatedRoute: ActivatedRoute,
        private toastService: ToastService,
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

    change(arraySelected) {
        const selectedSecurity = [];
        selectedSecurity.push(arraySelected);
        console.log('selected security', selectedSecurity);
        this.landSelected = this.vehicleSelected = this.apartmentSelected = this.landBuilding = this.plantSelected =
            this.depositSelected = this.shareSelected = this.hypothecationOfStock =
                this.corporateGuarantee = this.personal = this.insurancePolicySelected =
                    this.assignmentOfReceivable = this.assignments = this.securityOther = false;
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
                    this.landBuilding = true;
                    break;
                case 'PROPERTY_AND_MACHINERY_SECURITY' :
                    this.plantSelected = true;
                    break;
                case 'FIXED_DEPOSIT_RECEIPT':
                    this.depositSelected = true;
                    break;
                case 'SHARE_SECURITY':
                    this.shareSelected = true;
                    break;
                case 'HYPOTHECATION_OF_STOCK':
                    this.hypothecationOfStock = true;
                    break;
                case 'CORPORATE_GUARANTEE':
                    this.corporateGuarantee = true;
                    break;
                case 'PERSONAL_GUARANTEE':
                    this.personal = true;
                    break;
                case 'INSURANCE_POLICY_SECURITY':
                    this.insurancePolicySelected = true;
                    break;
                case 'ASSIGNMENT_OF_RECEIVABLES':
                    this.assignmentOfReceivable = true;
                    break;
                case 'LEASE_ASSIGNMENT':
                    this.assignments = true;
                    break;
                case 'OTHER_SECURITY':
                    this.securityOther = true;
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
        if (this.securityForm.invalid) {
            return;
        }
        if (this.initialSecurity.selectedSecurity === undefined) {
            this.initialSecurity.clearValidationAtInitialStage();
        }
        if (this.initialSecurity.securityForm.invalid) {
            this.toastService.show(new Alert(AlertType.ERROR, 'Please check validation'));
            return;
        }
        if (!ObjectUtil.isEmpty(this.securityValue)) {
            this.securityData = this.securityValue;
        }
        this.initialSecurity.submit();
        const mergedForm = {
            initialForm: this.initialSecurity.securityForm.value,
            selectedArray: this.initialSecurity.selectedArray,
            underConstructionChecked: this.initialSecurity.underConstructionChecked,
            otherBranchcheck: this.initialSecurity.otherBranchcheck,
            guarantorsForm: this.guarantorsForm.value,
            underBuildingConstructionChecked: this.initialSecurity.underBuildingConstructionChecked,
            securityGuarantee: this.securityForm.get('securityGuarantee').value,
            buildingLocation: this.securityForm.get('buildingLocation').value,
            roadAccessOfPrimaryProperty: this.securityForm.get('roadAccessOfPrimaryProperty').value,
            lambdaScheme: this.securityForm.get('lambdaScheme').value,
            facCategory: this.securityForm.get('facCategory').value,
            securityCoverageAutoPrivate: this.securityForm.get('securityCoverageAutoPrivate').value,
            securityCoverageAutoCommercial: this.securityForm.get('securityCoverageAutoCommercial').value,
            vehicleSecurityCoverage: this.securityForm.get('vehicleSecurityCoverage').value
        };
        this.securityData.data = JSON.stringify(mergedForm);
        this.securityData.guarantor = [];
        this.initialSecurity.selectedArray.forEach((selected) => {
            if (selected === 'ShareSecurity') {
                this.shareSecuritySelected = true;
            }
        });
        if (this.shareSecuritySelected) {
            this.securityData.templateName = TemplateName.SHARE_SECURITY;
            this.shareSecurityData = this.initialSecurity.shareSecurityData;
            this.securityData.share = this.shareSecurityData;
        }
        let guarantorIndex = 0;
        while (guarantorIndex < this.getGuarantor().length) {
            const guarantor = new Guarantor();
            guarantor.id = this.getGuarantor()[guarantorIndex].id;
            guarantor.version = this.getGuarantor()[guarantorIndex].version;
            guarantor.name = this.getGuarantor()[guarantorIndex].name;
            guarantor.citizenNumber = this.getGuarantor()[guarantorIndex].citizenNumber;
            guarantor.issuedYear = this.getGuarantor()[guarantorIndex].issuedYear;
            guarantor.issuedPlace = this.getGuarantor()[guarantorIndex].issuedPlace;
            guarantor.fatherName = this.getGuarantor()[guarantorIndex].fatherName;
            guarantor.grandFatherName = this.getGuarantor()[guarantorIndex].grandFatherName;
            guarantor.relationship = this.getGuarantor()[guarantorIndex].relationship;
            guarantor.contactNumber = this.getGuarantor()[guarantorIndex].contactNumber;
            if (!ObjectUtil.isEmpty(this.getGuarantor()[guarantorIndex].province)) {
                const province = new Province();
                province.id = this.getGuarantor()[guarantorIndex].province;
                guarantor.province = province;
                const district = new District();
                district.id = this.getGuarantor()[guarantorIndex].district;
                guarantor.district = district;
                const municipalityVdc = new MunicipalityVdc();
                municipalityVdc.id = this.getGuarantor()[guarantorIndex].municipalities;
                guarantor.municipalities = municipalityVdc;
            }
            guarantorIndex++;
            this.securityData.guarantor.push(guarantor);
        }
        this.securityDataEmitter.emit(this.securityData);
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
}
