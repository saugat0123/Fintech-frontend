import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Security} from '../../../../../loan/model/security';
import {CalendarType} from '../../../../../../@core/model/calendar-type';
import {ShareSecurity} from '../../../../../admin/modal/shareSecurity';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Province} from '../../../../../admin/modal/province';
import {District} from '../../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../../admin/modal/municipality_VDC';
import {Address} from '../../../../../loan/model/address';
import {Guarantor} from '../../../../../loan/model/guarantor';
import {SecurityGuarantee} from '../../../../model/security-guarantee';
import {LandAndBuildingLocation} from '../../../../model/land-and-building-location';
import {VehicleSecurityCoverage} from '../../../../model/vehicle-security-coverage';
import {SecurityCoverageAutoPrivate} from '../../../../model/security-coverage-auto-private';
import {SecurityCoverageAutoCommercial} from '../../../../model/security-coverage-auto-commercial';
import {RoadAccess} from '../../../../../admin/modal/crg/RoadAccess';
import {FacCategory} from '../../../../../admin/modal/crg/fac-category';
import {environment} from '../../../../../../../environments/environment';
import {AddressService} from '../../../../../../@core/service/baseservice/address.service';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '../../../../../../@core/utils';
import {CustomerType} from '../../../../../customer/model/customerType';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CustomerShareData} from '../../../../../admin/modal/CustomerShareData';
import {AdditionalSecurity} from '../../../../../loan/model/additional-security';
import {AdditionalSecurityComponent} from '../additional-security-child/additional-security.component';

@Component({
  selector: 'app-adiitional-security-parent',
  templateUrl: './adiitional-security-parent.component.html',
  styleUrls: ['./adiitional-security-parent.component.scss']
})
export class AdiitionalSecurityParentComponent implements OnInit {
  @Input() additionalSecurityValue: Array<AdditionalSecurity>;
  @Input() calendarType: CalendarType;
  @Input() loanTag: string;
  @Output() securityDataEmitter = new EventEmitter();
  @Input() fromProfile;
  @Input() shareSecurity: ShareSecurity;
  @Input() isMicroCustomer: boolean;
  @Input() isContainedApprovedLoan;

  @ViewChild('additionalSecurity' , {static: false})
  additionalSecurity: AdditionalSecurityComponent;
  additionalSecurityData: Array<AdditionalSecurity> = new Array<AdditionalSecurity>();
  guarantorsForm: FormGroup;
  securityForm: FormGroup;
  additionalSecurityObjectValue: Object;
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
    if (!ObjectUtil.isEmpty(this.additionalSecurityValue)) {
      this.additionalSecurityValue.forEach((securityValue) => {
        this.securityValueForEdit = JSON.parse(securityValue.data);
        this.additionalSecurityObjectValue = this.securityValueForEdit;
        this.setCrgSecurityForm(this.securityValueForEdit);
        this.setGuarantorsDetails(securityValue.guarantor);
        this.securityId = securityValue.id;
      });
    } else {
      this.addGuarantorsDetails();
      this.additionalSecurityObjectValue = undefined;
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
    if (this.additionalSecurity.selectedSecurity === undefined) {
      this.additionalSecurity.clearValidationAtInitialStage();
    }
    if (this.additionalSecurity.securityForm.invalid) {
      this.toastService.show(new Alert(AlertType.ERROR, 'Please check validation'));
      return;
    }
    if (!ObjectUtil.isEmpty(this.additionalSecurityValue)) {
      this.additionalSecurityData = this.additionalSecurityValue;
    }
    this.additionalSecurity.submit();
    const mergedForm = {
      initialForm: this.additionalSecurity.securityForm.value,
      selectedArray: this.additionalSecurity.selectedArray,
      underConstructionChecked: this.additionalSecurity.underConstructionChecked,
      otherBranchcheck: this.additionalSecurity.otherBranchcheck,
      guarantorsForm: this.guarantorsForm.value,
      underBuildingConstructionChecked: this.additionalSecurity.underBuildingConstructionChecked,
      securityGuarantee: this.securityForm.get('securityGuarantee').value,
      buildingLocation: this.securityForm.get('buildingLocation').value,
      roadAccessOfPrimaryProperty: this.securityForm.get('roadAccessOfPrimaryProperty').value,
      lambdaScheme: this.securityForm.get('lambdaScheme').value,
      facCategory: this.securityForm.get('facCategory').value,
      securityCoverageAutoPrivate: this.securityForm.get('securityCoverageAutoPrivate').value,
      securityCoverageAutoCommercial: this.securityForm.get('securityCoverageAutoCommercial').value,
      vehicleSecurityCoverage: this.securityForm.get('vehicleSecurityCoverage').value
    };
    this.additionalSecurityData.forEach((additionalSecurity) => {
      additionalSecurity.totalSecurityAmount = this.calculateTotalSecurity(mergedForm);
      if (this.isContainedApprovedLoan) {
        additionalSecurity.additionalSecurity = JSON.stringify(mergedForm);
      } else {
        additionalSecurity.data = JSON.stringify(mergedForm);
      }
      additionalSecurity.guarantor = [];
      this.additionalSecurity.selectedArray.forEach((selected) => {
        if (selected === 'ShareSecurity') {
          this.shareSecuritySelected = true;
        }
      });
      if (this.shareSecuritySelected) {
        this.shareSecurityData = this.additionalSecurity.shareSecurityData;
        additionalSecurity.share = this.shareSecurityData;
      } else {
        additionalSecurity.share = null;
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
        additionalSecurity.guarantor.push(guarantor);
      }
    });
    this.securityDataEmitter.emit(this.additionalSecurityData);
  }

  calculateTotalSecurity(securityData): number {
    let totalSecurityAmount = 0;
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
          const shareSecurity: Array<CustomerShareData> = this.additionalSecurity.shareSecurityData.customerShareData;
          for (let i = 0; i < shareSecurity.length; i++) {
            totalSecurityAmount += Number(shareSecurity[i].consideredValue);
          }
          break;
        default:
          totalSecurityAmount += 0;
          break;
      }
    });
    return totalSecurityAmount;
  }
}
