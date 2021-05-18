import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray , FormBuilder , FormGroup , Validators} from '@angular/forms';
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

    @ViewChild('initialSecurity' , {static: false})
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

    constructor(
        private formBuilder: FormBuilder,
        private addressServices: AddressService,
        private activatedRoute: ActivatedRoute
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
        } else {
            this.addGuarantorsDetails();
            this.initialSecurityValue = undefined;
        }
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
            lambdaScheme: ['GENERAL', !this.crgLambdaDisabled && !this.isBusinessLoan ? Validators.required : undefined],
            roadAccessOfPrimaryProperty: [undefined],
            facCategory: [undefined],
            securityCoverageAutoPrivate: [undefined],
            securityCoverageAutoCommercial: [undefined],
        });
    }

    setCrgSecurityForm(formData) {
        this.securityForm = this.formBuilder.group({
            securityGuarantee: formData.securityGuarantee,
            buildingLocation: formData.buildingLocation,
            vehicleSecurityCoverage: formData.vehicleSecurityCoverage,
            lambdaScheme: [formData.lambdaScheme , !this.crgLambdaDisabled && !this.isBusinessLoan ? Validators.required : undefined],
            roadAccessOfPrimaryProperty: [formData.roadAccessOfPrimaryProperty],
            facCategory: [formData.facCategory],
            securityCoverageAutoCommercial: [formData.securityCoverageAutoCommercial],
            securityCoverageAutoPrivate: [formData.securityCoverageAutoPrivate],
        });
    }

    setGuarantorsDetails(guarantorList: Array<Guarantor>): FormArray {
        const details = this.guarantorsForm.get('guarantorsDetails') as FormArray;
        if (details.length !== 0) {
            this.addressList = new Array<Address>(guarantorList === undefined ? 0 : guarantorList.length);
            let guarantorIndex = 0;
            guarantorList.forEach(guarantor => {
                this.addressList[guarantorIndex] = new Address();
                if (!ObjectUtil.isEmpty(guarantor.province) && !ObjectUtil.isEmpty(guarantor.province.id)) {
                    this.getDistrict(guarantor.province.id , guarantorIndex);
                    if (guarantor.district.id !== null) {
                        this.getMunicipalities(guarantor.district.id , guarantorIndex);
                    }
                }
                guarantorIndex++;
                details.push(this.formBuilder.group({
                    id: [guarantor.id === undefined ? undefined : guarantor.id] ,
                    version: [guarantor.version === undefined ? undefined : guarantor.version] ,
                    name: [guarantor.name === undefined ? undefined : guarantor.name , Validators.required] ,
                    citizenNumber: [guarantor.citizenNumber === undefined ? undefined : guarantor.citizenNumber , Validators.required] ,
                    issuedYear: [guarantor.issuedYear === undefined ? undefined : guarantor.issuedYear , Validators.required] ,
                    issuedPlace: [guarantor.issuedPlace === undefined ? undefined : guarantor.issuedPlace , Validators.required] ,
                    contactNumber: [guarantor.contactNumber === undefined ? undefined : guarantor.contactNumber , Validators.required] ,
                    fatherName: [guarantor.fatherName === undefined ? undefined : guarantor.fatherName , Validators.required] ,
                    grandFatherName: [guarantor.grandFatherName === undefined ? undefined
                    : guarantor.grandFatherName , Validators.required] ,
                    relationship: [guarantor.relationship === undefined ? undefined : guarantor.relationship , Validators.required] ,
                    province: [!ObjectUtil.isEmpty(guarantor.province) && !ObjectUtil.isEmpty(guarantor.province.id)
                    ? guarantor.province.id : undefined , Validators.required] ,
                    district: [!ObjectUtil.isEmpty(guarantor.district) && !ObjectUtil.isEmpty(guarantor.district.id)
                    ? guarantor.district.id : undefined , Validators.required] ,
                    municipalities: [!ObjectUtil.isEmpty(guarantor.municipalities) && !ObjectUtil.isEmpty(guarantor.municipalities.id) ?
                        guarantor.municipalities.id : undefined , Validators.required]
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
                name: [undefined , Validators.required] ,
                province: [null , Validators.required] ,
                district: [null , Validators.required] ,
                municipalities: [null , Validators.required] ,
                citizenNumber: [undefined , Validators.required] ,
                issuedYear: [undefined , Validators.required] ,
                issuedPlace: [undefined , Validators.required] ,
                contactNumber: [undefined , Validators.required] ,
                fatherName: [undefined , Validators.required] ,
                grandFatherName: [undefined , Validators.required] ,
                relationship: [undefined , Validators.required]
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

    getDistrict(provinceId: number , i: number) {
        const province = new Province();
        province.id = provinceId;
        this.addressServices.getDistrictByProvince(province).subscribe((response: any) => {
            this.districtList = response.detail;
            this.addressList[i].districtList = this.districtList;
        });
    }

    getMunicipalities(districtId: number , i: number) {
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
        this.securityData.totalSecurityAmount = this.calculateTotalSecurity(mergedForm);
        this.securityData.data = JSON.stringify(mergedForm);
        this.securityData.guarantor = [];
        this.initialSecurity.selectedArray.forEach((selected) => {
            if (selected === 'ShareSecurity') {
                this.shareSecuritySelected = true;
            }
        });
        if (this.shareSecuritySelected) {
            this.shareSecurityData = this.initialSecurity.shareSecurityData;
            this.securityData.share = this.shareSecurityData;
        } else {
            this.securityData.share = null;
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

    calculateTotalSecurity(securityData): number {
        let totalSecurityAmount = 0;
        const isLandSelected = securityData.selectedArray.includes('LandSecurity');
        const isBuildingSelected = securityData.selectedArray.includes('ApartmentSecurity');
        securityData.selectedArray.forEach(selectedSecurity => {
            switch (selectedSecurity) {
                case 'LandSecurity':
                    const landDetailsArray = securityData.initialForm.landDetails as Array<any>;
                    for (let i = 0; i < landDetailsArray.length; i++) {
                        totalSecurityAmount += Number(landDetailsArray[i].landConsideredValue);
                    }
                    break;
                case 'VehicleSecurity':
                    const vehicleDetailsArray = securityData.initialForm.vehicleDetails as Array<any>;
                    for (let i = 0; i < vehicleDetailsArray.length; i++) {
                        totalSecurityAmount += Number(vehicleDetailsArray[i].valuationAmount);
                    }
                    break;
                case 'ApartmentSecurity':
                    const buildingDetailsArray = securityData.initialForm.buildingDetails as Array<any>;
                    for (let i = 0; i < buildingDetailsArray.length; i++) {
                        totalSecurityAmount += Number(buildingDetailsArray[i].buildingFairMarketValue);
                    }
                    break;
                case 'PlantSecurity':
                    const plantDetailsArray = securityData.initialForm.plantDetails as Array<any>;
                    for (let i = 0; i < plantDetailsArray.length; i++) {
                        totalSecurityAmount += Number(plantDetailsArray[i].quotation);
                    }
                    break;

                case 'Land and Building Security':
                     const landBuildingArray = securityData.initialForm.landBuilding as Array<any>;
                        for (let i = 0; i < landBuildingArray.length; i++) {
                            totalSecurityAmount += Number(landBuildingArray[i].landConsideredValue);
                    }
                    break;
                case 'FixedDeposit':
                    const fixedDepositArray = securityData.initialForm.fixedDepositDetails as Array<any>;
                    for (let i = 0; i < fixedDepositArray.length; i++) {
                        totalSecurityAmount += Number(fixedDepositArray[i].amount);
                    }
                    break;
                    case 'ShareSecurity':
                        const shareSecurity: Array<CustomerShareData> = this.initialSecurity.shareSecurityData.customerShareData;
                        shareSecurity.forEach(value => {
                            totalSecurityAmount += value.total;
                        });
                    break;
                default:
                    totalSecurityAmount += 0;
                    break;
            }
        });
        return totalSecurityAmount;
    }
}
