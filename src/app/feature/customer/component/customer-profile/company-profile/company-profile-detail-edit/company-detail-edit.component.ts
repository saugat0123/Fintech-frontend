import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
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
import {Company} from '../../../../../admin/modal/company';
import {CompanyService} from '../../../../../admin/component/company/company.service';
import {DesignationList} from '../../../../../loan/model/designationList';
import {RegisteredOfficeList} from '../../../../../admin/modal/registeredOfficeList';

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
  companyStructureList: Array<Company>;

  designation = new DesignationList().designation;
  registeredOffice = RegisteredOfficeList.enumObject();


  constructor(private formBuilder: FormBuilder,
              private commonLocation: AddressService,
              private companyInfoService: CompanyInfoService,
              protected dialogRef: NbDialogRef<CompanyDetailEditComponent>,
              private toastService: ToastService,
              private company: CompanyService

  ) {
  }

  get form() {
    return this.companyInfoFormGroup.controls;
  }

  async ngOnInit() {
    await this.buildForm();
    this.getCompanyStructure();
    if (!ObjectUtil.isEmpty(this.companyInfo.contactPersons)) {
      this.setContactPersonsData(this.companyInfo.contactPersons);
    }
  }

  buildForm() {
    this.companyInfoFormGroup = this.formBuilder.group({
      // legalStatus
      corporateStructure: [(ObjectUtil.isEmpty(this.companyInfo) || ObjectUtil.isEmpty(this.companyInfo.legalStatus) ||
          ObjectUtil.isEmpty(this.companyInfo.legalStatus.corporateStructure)) ?
          undefined : this.companyInfo.legalStatus.corporateStructure.id, Validators.required],

      registeredOffice: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.legalStatus)) ? undefined :
          this.companyInfo.legalStatus.registeredOffice, Validators.required],

      registeredUnderAct: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.legalStatus)) ? undefined :
          this.companyInfo.legalStatus.registeredUnderAct],

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
          new Date(this.companyInfo.legalStatus.registrationExpiryDate),],

      // capital
      authorizedCapital: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
          this.companyInfo.capital.authorizedCapital],

      paidUpCapital: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
          this.companyInfo.capital.paidUpCapital, Validators.required],

      issuedCapital: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
          this.companyInfo.capital.issuedCapital],

      // totalCapital: [(ObjectUtil.isEmpty(this.companyInfo)
      //     || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
      //     this.companyInfo.capital.totalCapital, Validators.required],
      //
      // fixedCapital: [(ObjectUtil.isEmpty(this.companyInfo)
      //     || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
      //     this.companyInfo.capital.fixedCapital, Validators.required],
      //
      // workingCapital: [(ObjectUtil.isEmpty(this.companyInfo)
      //     || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
      //     this.companyInfo.capital.workingCapital, Validators.required],

      numberOfShareholder: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
          this.companyInfo.capital.numberOfShareholder],

      // contact person
      contactPersons: this.formBuilder.array([
        this.contactPersonFormGroup()
      ]),

      // location
      locationVersion: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined : this.companyInfo.companyLocations.version],
      locationId: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined : this.companyInfo.companyLocations.id],
      houseNumber: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined : this.companyInfo.companyLocations.houseNumber],
      streetName: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined : this.companyInfo.companyLocations.streetName],
      address: [(ObjectUtil.isEmpty(this.companyInfo)
          || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined : this.companyInfo.companyLocations.address,
        Validators.required],

    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.companyInfoFormGroup.invalid) {
      return;
    }
    this.spinner = true;
    // legalStatus
    // this.legalStatus.companyName = this.companyInfoFormGroup.get('companyName').value;
    const corporateStructure = new Company();
    corporateStructure.id = this.companyInfoFormGroup.get('corporateStructure').value;
    this.companyInfo.legalStatus.corporateStructure = ObjectUtil.isEmpty(corporateStructure.id) ? undefined : corporateStructure;
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
    // this.companyInfo.capital.totalCapital = this.companyInfoFormGroup.get('totalCapital').value;
    // this.companyInfo.capital.fixedCapital = this.companyInfoFormGroup.get('fixedCapital').value;
    // this.companyInfo.capital.workingCapital = this.companyInfoFormGroup.get('workingCapital').value;
    this.companyInfo.capital.numberOfShareholder = this.companyInfoFormGroup.get('numberOfShareholder').value;

    // contactPerson
    this.companyInfo.contactPersons = JSON.stringify(this.companyInfoFormGroup.get('contactPersons').value);

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

  contactPersonFormGroup(): FormGroup {
    return this.formBuilder.group({
      contactName: [undefined, Validators.required],
      contactEmail: [undefined],
      contactNumber: [undefined, Validators.required],
      functionalPosition: [undefined, Validators.required],
    });
  }

  setContactPersonsData(contactPerson) {
    const contactPersons = JSON.parse(contactPerson);
    const contactPersonFormArray = new FormArray([]);
    contactPersons.forEach(data => {
      contactPersonFormArray.push(this.formBuilder.group({
        contactName: [data.contactName, Validators.required],
        contactEmail: [data.contactEmail, undefined],
        contactNumber: [data.contactNumber, Validators.required],
        functionalPosition: [data.functionalPosition, Validators.required],
      }));
    });
    this.companyInfoFormGroup.setControl('contactPersons', contactPersonFormArray);
  }

  onClose() {
    this.dialogRef.close();
  }

  getCompanyStructure() {
    this.company.getAll().subscribe(res => {
      this.companyStructureList = res.detail;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Company Structure can not be Loaded'));
    });
  }

  addContactPersons() {
    (<FormArray>this.companyInfoFormGroup.get('contactPersons')).push(this.contactPersonFormGroup());
  }

  removeContactPersons(index: number) {
    (<FormArray>this.companyInfoFormGroup.get('contactPersons')).removeAt(index);
  }
}
