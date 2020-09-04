import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {DateValidator} from '../../../../../../@core/validator/date-validator';
import {CalendarType} from '../../../../../../@core/model/calendar-type';
import {Province} from '../../../../../admin/modal/province';
import {District} from '../../../../../admin/modal/district';
import {AddressService} from '../../../../../../@core/service/baseservice/address.service';
import {MunicipalityVdc} from '../../../../../admin/modal/municipality_VDC';
import {Address} from '../../../../../loan/model/address';
import {CompanyInfo} from '../../../../../admin/modal/company-info';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ModalResponse, ToastService} from '../../../../../../@core/utils';
import {CompanyInfoService} from '../../../../../admin/service/company-info.service';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'app-company-detail-edit',
  templateUrl: './company-detail-edit.component.html',
  styleUrls: ['./company-detail-edit.component.scss']
})
export class CompanyDetailEditComponent implements OnInit {
  companyInfo: CompanyInfo;

  calendarType = CalendarType.AD;
  companyInfoFormGroup: FormGroup;
  submitted = false;
  spinner = false;

  provinceList: Array<Province> = new Array<Province>();
  districtList: Array<District> = new Array<District>();
  municipalityVdcList: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
  addressList: Array<Address> = new Array<Address>();

  constructor(private formBuilder: FormBuilder,
              private commonLocation: AddressService,
              private companyInfoService: CompanyInfoService,
              protected dialogRef: NbDialogRef<CompanyDetailEditComponent>,
              private toastService: ToastService,
  ) {
  }

  get form() {
    return this.companyInfoFormGroup.controls;
  }

  async ngOnInit() {
    await this.buildForm();
    this.commonLocation.getProvince().subscribe(
        (response: any) => {
          this.provinceList = response.detail;
          this.provinceList.forEach((province: Province) => {
            if (this.companyInfo !== undefined) {
              if (!ObjectUtil.isEmpty(this.companyInfo.contactPerson.province)) {
                if (province.id === this.companyInfo.contactPerson.province.id) {
                  this.companyInfoFormGroup.controls.contactProvince.setValue(province);
                  this.getDistricts(province.id, null);
                }
              }
            }
          });
        }
    );

  }

  buildForm() {
    this.companyInfoFormGroup = this.formBuilder.group({
      // legalStatus
      corporateStructure: [(ObjectUtil.isEmpty(this.companyInfo) || ObjectUtil.isEmpty(this.companyInfo.legalStatus)) ?
          undefined : this.companyInfo.legalStatus.corporateStructure, Validators.required],

      registeredOffice: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.legalStatus)) ? undefined :
          this.companyInfo.legalStatus.registeredOffice, Validators.required],

      registeredUnderAct: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.legalStatus)) ? undefined :
          this.companyInfo.legalStatus.registeredUnderAct, Validators.required],

      registrationDate: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.legalStatus)
          || ObjectUtil.isEmpty(this.companyInfo.legalStatus.registrationDate)) ? undefined :
          new Date(this.companyInfo.legalStatus.registrationDate), [Validators.required, DateValidator.isValidBefore]],

      panRegistrationOffice: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.legalStatus)) ? undefined :
          this.companyInfo.legalStatus.panRegistrationOffice, Validators.required],

      panRegistrationDate: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.legalStatus)
          || ObjectUtil.isEmpty(this.companyInfo.legalStatus.panRegistrationDate)) ? undefined :
          new Date(this.companyInfo.legalStatus.panRegistrationDate), [Validators.required, DateValidator.isValidBefore]],

      registrationExpiryDate: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.legalStatus)
          || ObjectUtil.isEmpty(this.companyInfo.legalStatus.registrationExpiryDate)) ? undefined :
          new Date(this.companyInfo.legalStatus.registrationExpiryDate), [Validators.required]],

      // capital
      authorizedCapital: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
          this.companyInfo.capital.authorizedCapital, Validators.required],

      paidUpCapital: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
          this.companyInfo.capital.paidUpCapital, Validators.required],

      issuedCapital: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
          this.companyInfo.capital.issuedCapital, Validators.required],

      totalCapital: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
          this.companyInfo.capital.totalCapital, Validators.required],

      fixedCapital: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
          this.companyInfo.capital.fixedCapital, Validators.required],

      workingCapital: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
          this.companyInfo.capital.workingCapital, Validators.required],

      numberOfShareholder: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
          this.companyInfo.capital.numberOfShareholder, Validators.required],

      // contact person
      contactVersion: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.version)) ? undefined : this.companyInfo.version],
      contactId: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.id)) ? undefined : this.companyInfo.id],
      contactName: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.contactPerson.name)) ? undefined : this.companyInfo.contactPerson.name,
        Validators.required],
      contactEmail: [(ObjectUtil.isEmpty(this.companyInfo) || ObjectUtil.isEmpty(this.companyInfo.contactPerson.email)) ?
          undefined : this.companyInfo.contactPerson.email, Validators.required],
      contactNumber: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.contactPerson.contactNumber)) ? undefined :
          this.companyInfo.contactPerson.contactNumber, Validators.required],
      contactProvince: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.contactPerson.province)) ? undefined :
          this.companyInfo.contactPerson.province, Validators.required],
      contactDistrict: [(ObjectUtil.isEmpty(this.companyInfo) || ObjectUtil.isEmpty(this.companyInfo.contactPerson.district))
          ? undefined : this.companyInfo.contactPerson.district, Validators.required],
      contactMunicipalities: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.contactPerson.municipalityVdc))
          ? undefined : this.companyInfo.contactPerson.municipalityVdc, Validators.required],

      // location
      locationVersion: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined : this.companyInfo.companyLocations.version],
      locationId: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined : this.companyInfo.companyLocations.id],
      houseNumber: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined : this.companyInfo.companyLocations.houseNumber],
      streetName: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined : this.companyInfo.companyLocations.streetName,
        Validators.required],
      address: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined : this.companyInfo.companyLocations.address,
        Validators.required],

    });
  }

  // get district list based on province
  getDistricts(provinceId: number, proprietorIndex: number) {
    const province = new Province();
    province.id = provinceId;
    this.commonLocation.getDistrictByProvince(province).subscribe(
        (response: any) => {
          this.districtList = response.detail;
          if (proprietorIndex == null) {
            if (!ObjectUtil.isEmpty(this.companyInfo)) {
              this.districtList.forEach(district => {
                if (district.id === this.companyInfo.contactPerson.district.id) {
                  this.companyInfoFormGroup.controls.contactDistrict.setValue(district);
                  this.getMunicipalities(district.id, null);
                }
              });
            }

          }
          if (!ObjectUtil.isEmpty(proprietorIndex)) {
            this.addressList[proprietorIndex].districtList = this.districtList;
          }

        }
    );
  }

  // get municipalityVdc list based on district
  getMunicipalities(districtId: number, proprietorIndex: number) {
    const district = new District();
    district.id = districtId;
    this.commonLocation.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.municipalityVdcList = response.detail;
          if (proprietorIndex == null) {
            if (!ObjectUtil.isEmpty(this.companyInfo)) {
              this.municipalityVdcList.forEach(municipality => {
                if (municipality.id === this.companyInfo.contactPerson.municipalityVdc.id) {
                  this.companyInfoFormGroup.controls.contactMunicipalities.setValue(municipality);
                }
              });
            }
          }
          if (!ObjectUtil.isEmpty(proprietorIndex)) {
            this.addressList[proprietorIndex].municipalityVdcList = this.municipalityVdcList;
          }
        }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.companyInfoFormGroup.invalid) {
      return;
    }
    this.spinner = true;
    // legalStatus
    // this.legalStatus.companyName = this.companyInfoFormGroup.get('companyName').value;
    this.companyInfo.legalStatus.corporateStructure = this.companyInfoFormGroup.get('corporateStructure').value;
    this.companyInfo.legalStatus.registeredOffice = this.companyInfoFormGroup.get('registeredOffice').value;
    this.companyInfo.legalStatus.registeredUnderAct = this.companyInfoFormGroup.get('registeredUnderAct').value;
    // this.legalStatus.registrationNo = this.companyInfoFormGroup.get('registrationNo').value;
    this.companyInfo.legalStatus.registrationDate = this.companyInfoFormGroup.get('registrationDate').value;
    this.companyInfo.legalStatus.panRegistrationOffice = this.companyInfoFormGroup.get('panRegistrationOffice').value;
    // this.legalStatus.panNumber = this.companyInfoFormGroup.get('panNumber').value;
    this.companyInfo.legalStatus.panRegistrationDate = this.companyInfoFormGroup.get('panRegistrationDate').value;
    this.companyInfo.legalStatus.registrationExpiryDate = this.companyInfoFormGroup.get('registrationExpiryDate').value;
    // capital
    this.companyInfo.capital.authorizedCapital = this.companyInfoFormGroup.get('authorizedCapital').value;
    this.companyInfo.capital.paidUpCapital = this.companyInfoFormGroup.get('paidUpCapital').value;
    this.companyInfo.capital.issuedCapital = this.companyInfoFormGroup.get('issuedCapital').value;
    this.companyInfo.capital.totalCapital = this.companyInfoFormGroup.get('totalCapital').value;
    this.companyInfo.capital.fixedCapital = this.companyInfoFormGroup.get('fixedCapital').value;
    this.companyInfo.capital.workingCapital = this.companyInfoFormGroup.get('workingCapital').value;
    this.companyInfo.capital.numberOfShareholder = this.companyInfoFormGroup.get('numberOfShareholder').value;

    // contactPerson
    this.companyInfo.contactPerson.name = this.companyInfoFormGroup.get('contactName').value;
    this.companyInfo.contactPerson.email = this.companyInfoFormGroup.get('contactEmail').value;
    this.companyInfo.contactPerson.contactNumber = this.companyInfoFormGroup.get('contactNumber').value;
    this.companyInfo.contactPerson.province = this.companyInfoFormGroup.get('contactProvince').value;
    this.companyInfo.contactPerson.district = this.companyInfoFormGroup.get('contactDistrict').value;
    this.companyInfo.contactPerson.municipalityVdc = this.companyInfoFormGroup.get('contactMunicipalities').value;

    // location
    this.companyInfo.companyLocations.id = this.companyInfoFormGroup.get('locationId').value;
    this.companyInfo.companyLocations.version = this.companyInfoFormGroup.get('locationVersion').value;
    this.companyInfo.companyLocations.address = this.companyInfoFormGroup.get('address').value;
    this.companyInfo.companyLocations.houseNumber = this.companyInfoFormGroup.get('houseNumber').value;
    this.companyInfo.companyLocations.streetName = this.companyInfoFormGroup.get('streetName').value;

    this.companyInfoService.save(this.companyInfo).subscribe(response => {
      this.companyInfo = response.detail;
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED COMPANY DETAIl'));
      this.dialogRef.close(ModalResponse.SUCCESS);
    }, res => {
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, res.error.message));
      this.dialogRef.close();
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
